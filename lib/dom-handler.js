'use strict';

var Node = require('./dom-node');
var makeElement = require('./make-element');

var nodeTypes = {
	element: 1,
	text: 3,
	comment: 8,
	cdata: 4,
	documentType: 10
};

function DomHandler(callback, options, elementCB){
	if(typeof callback === "object"){
		elementCB = options;
		options = callback;
		callback = null;
	} else if(typeof options === "function"){
		elementCB = options;
		options = defaultOpts;
	}
	this._callback = callback;
	this._options = options || defaultOpts;
	this._elementCB = elementCB;
	this.dom = [];
	this._done = false;
	this._tagStack = [];
}

//default options
var defaultOpts = {
	ignoreWhitespace: false //Keep whitespace-only text nodes
};

//Resets the handler back to starting state
DomHandler.prototype.onreset = function(){
	DomHandler.call(this, this._callback, this._options, this._elementCB);
};

//Signals the handler that parsing is done
DomHandler.prototype.onend = function(){
	if(this._done) return;
	this._done = true;
	this._handleCallback(null);
};

DomHandler.prototype._handleCallback =
DomHandler.prototype.onerror = function(error){
	if(typeof this._callback === "function"){
		this._callback(error, this.dom);
	} else {
		if(error) throw error;
	}
};

DomHandler.prototype.onclosetag = function(){
	var elem = this._tagStack.pop();
	if(this._elementCB) this._elementCB(elem);
};

DomHandler.prototype._addDomElement = function(element){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	if(lastTag){
		lastTag.childNodes.push(element);
	} else { //There aren't parent elements
		this.dom.push(element);
	}
};

DomHandler.prototype.onopentag = function(name, attribs){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	var node = makeElement({
		nodeType: nodeTypes.element,
		nodeName: name,
		attribs: attribs,
		childNodes: [],
		prev: null,
		next: null,
		parent: lastTag || null
	});

	if(lastTag){
		lastTag.childNodes.push(node);
	} else {
		this.dom.push(node);
	}

	this._tagStack.push(node);
};

DomHandler.prototype.ontext = function(data){
	if(this._options.ignoreWhitespace && data.trim() === "") return;

	if(this._tagStack.length){
		var lastTag;

		if(
			(lastTag = this._tagStack[this._tagStack.length - 1]) &&
			(lastTag = lastTag.childNodes[lastTag.childNodes.length - 1]) &&
			lastTag.nodeType === nodeTypes.text
		){
			lastTag.data += data;
			return;
		}
	} else {
		if(this.dom.length && this.dom[this.dom.length-1].nodeType === nodeTypes.text){
			this.dom[this.dom.length-1].data += data;
			return;
		}
	}

	this._addDomElement(new Node({
		data: data,
		nodeType: nodeTypes.text,
	}));
};

DomHandler.prototype.oncomment = function(data){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	if (lastTag && lastTag.nodeType === nodeTypes.comment) {
		lastTag.data += data;
		return;
	}

	var node = new Node({
		data: data,
		nodeType: nodeTypes.comment
	});

	this._addDomElement(node);
	this._tagStack.push(node);
};

DomHandler.prototype.oncdatastart = function(){
	var node = new Node({
		childNodes: [{
			data: "",
			nodeType: nodeTypes.text
		}],
		nodeType: nodeTypes.cdata
	});

	this._addDomElement(node);
	this._tagStack.push(node);
};

DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function(){
	this._tagStack.pop();
};

DomHandler.prototype.onprocessinginstruction = function(name, data){
	this._addDomElement({
		name: name,
		data: data,
		nodeType: nodeTypes.documentType
	});
};

module.exports = DomHandler;
