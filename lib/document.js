'use strict';
var util = require('util');

var Node = require('./node');
var Element = require('./nodes/element');
var makeElement = require('./nodes/make-element');

function Document(markup, options) {
	if (typeof markup !== 'string') {
		options = markup;
		markup = null;
	}

	Node.call(this, {
		tagName: 'html',
		nodeType: 9,
		parseOptions: options
	});

	this.documentElement = new Element({
		tagName: 'html',
		ownerDocument: this,
		parseOptions: options
	});

	this.childNodes = [this.documentElement];

	if (markup) {
		this.documentElement.innerHTML = markup;
	}
}

util.inherits(Document, Element);

Document.prototype.createDocumentFragment = function() {
	return new Node({
		nodeType: 11,
		ownerDocument: this
	});
};

Document.prototype.createElement = function(nodeName) {
	return makeElement({
		nodeName: nodeName,
		ownerDocument: this
	});
};

module.exports = Document;
