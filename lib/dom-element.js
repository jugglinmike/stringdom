'use strict';
var util = require('util');

// TODO: Talk with Felix about implementing a standards-compliant method
// upstream.
require(
	'CSSselect/node_modules/domutils/node_modules/domelementtype'
).isTag =
require(
	'dom-serializer/node_modules/domelementtype'
).isTag = function(elem) {
	return elem.nodeType === 1;
};
var render = require('dom-serializer');
var select = require('CSSselect');
var Node = require('./dom-node');

var Element = function() {
	Node.apply(this, arguments);
};

util.inherits(Element, Node);

Element.prototype.getElementsByTagName = function(tagName) {
	return select(tagName, this);
};
Element.prototype.getElementById = function(id) {
	return select.selectOne('#' + id, this) || null;
};
Element.prototype.querySelectorAll = function(selector) {
	return select(selector, this);
};
Object.defineProperty(Element.prototype, 'className', {
	get: function() {
		return this.attributes.getNamedItem('class');
	},
	set: function(className) {
		this.attributes.setNamedItem('class', className);
		return className;
	}
});

Object.defineProperty(Element.prototype, 'tagName', {
	get: function() {
		return this.nodeName;
	},
	set: function(tagName) {
		this.nodeName = tagName;
		return tagName;
	}
});

Element.prototype.getAttribute = function(name) {
	return this.attributes.getNamedItem(name);
};

Element.prototype.setAttribute = function(name, value) {
	return this.attributes.setNamedItem(name, value);
};

Element.prototype.removeAttribute = function(name) {
	return this.attributes.removeNamedItem(name);
};

Element.prototype.addEventListener = function() {};

Object.defineProperty(Element.prototype, 'innerHTML', {
	get: function() {
		return render(this.children, {
			normalizeWhitespace: false,
			xmlMode: false,
			decodeEntities: true
		});
	},
	set: function(str) {
		var idx = this.childNodes.length;
		var child;

		while (child = this.childNodes[--idx]) {
			this.removeChild(child);
		}

		this.childNodes = require('./evaluate')(str);
		this.childNodes.forEach(function(child) {
			child.parentNode = this;
		}, this);
		return this.childNodes;
	}
});

// TODO: Throw error when Element is a document root node.
Object.defineProperty(Element.prototype, 'outerHTML', {
	get: function() {
		return render(this, {
			normalizeWhitespace: false,
			xmlMode: false,
			decodeEntities: true
		});
	},
	set: function(str) {
		var newNode = require('./evaluate')(str);
		var idx = this.parentNode.childNodes.indexOf(this);

		this.parentNode.childNodes[idx] = newNode;
		newNode.parentNode = this.parentNode;
		this.parentNode = null;

		return newNode;
	}
});

module.exports = Element;
