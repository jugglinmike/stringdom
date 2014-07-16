'use strict';
var util = require('util');

var render = require('dom-serializer');
var select = require('CSSselect');
var Node = require('./dom-node');

var Element = function(options) {
	Node.apply(this, arguments);
	this.tagName = options.tagName;
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
		return this.attribs.class;
	},
	set: function(className) {
		return this.attribs.class = className;
	}
});

Element.prototype.getAttribute = function(name) {
	return this.attribs[name];
};

Element.prototype.setAttribute = function(name, value) {
	return this.attribs[name] = value;
};

Element.prototype.removeAttribute = function(name) {
	delete this.attribs[name];
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
		this.childNodes = require('./evaluate')(str);
		this.childNodes.forEach(function(child) {
			child.parentNode = this;
		}, this);
		return this.childNodes;
	}
});

module.exports = Element;
