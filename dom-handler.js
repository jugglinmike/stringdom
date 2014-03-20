var Node = require('./dom-node');

var ElementType = {
	Text: "text", //Text
	Directive: "directive", //<? ... ?>
	Comment: "comment", //<!-- ... -->
	Script: "script", //<script> tags
	Style: "style", //<style> tags
	Tag: "tag", //Any tag
	CDATA: "cdata", //<![CDATA[ ... ]]>
	
	isTag: function(elem){
		return elem.type === "tag" || elem.type === "script" || elem.type === "style";
	}
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

DomHandler.prototype.onclosetag = function(name){
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

var domLvl1 = {
	tagName: 'name',
	childNodes: 'children',
	parentNode: 'parent',
	previousSibling: 'prev',
	nextSibling: 'next'
};
var nodeTypes = {
	element: 1,
	text: 3,
	comment: 8,
	cdata: 4
};

DomHandler.prototype.onopentag = function(name, attribs){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	var node = new Node({
		type: name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag,
		name: name,
		attribs: attribs,
		childNodes: [],
		prev: null,
		next: null,
		parent: lastTag || null
	});

	if(lastTag){
		var idx = lastTag.childNodes.length;
		while(idx > 0){
			if(ElementType.isTag(lastTag.childNodes[--idx])){
				node.previousSibling = lastTag.childNodes[idx];
				lastTag.childNodes[idx].next = node;
				break;
			}
		}
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
			lastTag.type === ElementType.Text
		){
			lastTag.data += data;
			return;
		}
	} else {
		if(this.dom.length && this.dom[this.dom.length-1].type === ElementType.Text){
			this.dom[this.dom.length-1].data += data;
			return;
		}
	}

	this._addDomElement({
		data: data,
		type: ElementType.Text
	});
};

DomHandler.prototype.oncomment = function(data){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	if(lastTag && lastTag.type === ElementType.Comment){
		lastTag.data += data;
		return;
	}

	var node = new Node({
		data: data,
		type: ElementType.Comment
	});

	this._addDomElement(node);
	this._tagStack.push(node);
};

DomHandler.prototype.oncdatastart = function(){
	var node = new Node({
		childNodes: [{
			data: "",
			type: ElementType.Text
		}],
		type: ElementType.CDATA
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
		type: ElementType.Directive
	});
};

module.exports = DomHandler;
