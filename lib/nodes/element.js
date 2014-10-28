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
var Node = require('../node');
var CSSStyleDeclaration = require('../css-style-decl');

var Element = function() {
	var styleStr;

	Node.apply(this, arguments);

	styleStr = this.attributes.getNamedItem('style');
	this.style = new CSSStyleDeclaration(styleStr);
};

util.inherits(Element, Node);

var tagNameRe = /^\s*[a-z-]+\s*$/i;
Element.prototype.getElementsByTagName = function(tagName) {
	if (!tagNameRe.test(tagName)) {
		return [];
	}
	return select(tagName, this, this.parseOptions);
};

Element.prototype.getElementById = function(id) {
	return select.selectOne('#' + id, this) || null;
};
Element.prototype.querySelectorAll = function(selector) {
	return select(selector, this, this.parseOptions);
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
	if (name === 'style') {
		return this.style.toString();
	}

	return this.attributes.getNamedItem(name);
};

Element.prototype.setAttribute = function(name, value) {
	if (name === 'style') {
		value.split(';').forEach(function(declaration) {
			var parts = declaration.split(':');

			if (parts.length !== 2) {
				return;
			}

			this.style.setProperty(parts[0], parts[1]);
		}, this);
		return;
	}

	return this.attributes.setNamedItem(name, value);
};

Element.prototype.removeAttribute = function(name) {
	if (name === 'style') {
		this.style._values = {};
		return;
	}

	return this.attributes.removeNamedItem(name);
};

Element.prototype.addEventListener = function() {};

Object.defineProperty(Element.prototype, 'innerHTML', {
	get: function() {
		return render(this.children, this.parseOptions);
	},
	set: function(str) {
		var idx = this.childNodes.length;
		var child = this.childNodes[--idx];

		while (child) {
			this.removeChild(child);
			child = this.childNodes[--idx];
		}

		this.childNodes = require('./../evaluate')(str, {
			document: this.ownerDocument,
			parseOptions: this.parseOptions
		});
		this.childNodes.forEach(function(child) {
			child.parentNode = this;
		}, this);
		return this.childNodes;
	}
});

Object.defineProperty(Element.prototype, 'textContent', {
	set: function(str) {
		this.childNodes.forEach(function(childNode) {
			childNode.parentNode = null;
		});

		if (typeof str !== 'string') {
			str = String(str);
		}

		if (str === '') {
			this.childNodes.length = 0;
		} else {
			this.childNodes.length = 1;
			this.childNodes[0] = new Node({
				data: str,
				nodeType: 3,
				parent: this
			});
		}
	},
	get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').get
});

// TODO: Throw error when Element is a document root node.
Object.defineProperty(Element.prototype, 'outerHTML', {
	get: function() {
		return render(this, this.parseOptions);
	},
	set: function(str) {
		var newNodes = require('./../evaluate')(str, {
			document: this.ownerDocument,
			parseOptions: this.parseOptions
		});
		var childNodes = this.parentNode.childNodes;
		var idx = childNodes.indexOf(this);

		childNodes.splice.apply(childNodes, [idx, 1].concat(newNodes));
		newNodes.forEach(function(newNode) {
			newNode.parentNode = this.parentNode;
		}, this);
		this.parentNode = null;

		return str;
	}
});

Element.prototype.cloneNode = function() {
	var cloned = Node.prototype.cloneNode.apply(this, arguments);

	cloned.attributes = this.attributes._clone();

	return cloned;
};

module.exports = Element;
