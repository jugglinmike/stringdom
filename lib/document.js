'use strict';
var util = require('util');

var Node = require('./dom-node');
var Element = require('./dom-element');

function Document(markup) {
	Node.call(this, {
		tagName: 'html',
		nodeType: 9
	});

	this.documentElement = new Element({
		tagName: 'html',
		ownerDocument: this
	});

	this.childNodes = [this.documentElement];

	if (markup) {
		this.documentElement.innerHTML = markup;
	}
}

util.inherits(Document, Element);

Document.prototype.createDocumentFragment = function() {
	return new Node({
		nodeType: 11
	});
};

Document.prototype.createElement = function(nodeName) {
	return new Element({
		nodeName: nodeName,
		ownerDocument: this
	});
};

module.exports = Document;
