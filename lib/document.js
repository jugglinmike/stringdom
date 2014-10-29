'use strict';
var util = require('util');

var Node = require('./node');
var Element = require('./nodes/element');
var makeElement = require('./nodes/make-element');

/**
 * @constructor
 *
 * @param {Object} [options]
 * @param {Object} [options.defaultView] the `window` object to associate with
 *                                       the document
 */
function Document(options) {
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

	this.defaultView = options && options.defaultView || null;
	this.childNodes = [this.documentElement];
}

util.inherits(Document, Element);

/**
 * Create a Node structure from a markup string and insert it into the
 * document's `documentElement`.
 *
 * @param {string} content Markup to parse for Node structure
 */
Document.prototype.write = function(content) {
	this.documentElement.innerHTML = content;
};

/**
 * Create a Document Fragment node.
 *
 * @returns {Node}
 */
Document.prototype.createDocumentFragment = function() {
	return new Node({
		nodeType: 11,
		ownerDocument: this
	});
};

/**
 * Create an Element node.
 *
 * @param {string} nodeName The name of the node to create.
 *
 * @returns {Element}
 */
Document.prototype.createElement = function(nodeName) {
	if (arguments.length === 0) {
		throw new Error('Document#createElement: not enough arguments.');
	}

	return makeElement({
		nodeName: nodeName,
		ownerDocument: this
	});
};

/**
 * Create a text node.
 *
 * @param {string} data The content of the node to be created.
 *
 * @returns {Node}
 */
Document.prototype.createTextNode = function(data) {
	if (arguments.length === 0) {
		throw new Error('Document#createTextNode: not enough arguments.');
	}

	return new Node({
		nodeType: 3,
		ownerDocument: this,
		data: data
	});
};

module.exports = Document;
