'use strict';
var NamedNodeMap = require('./named-node-map');

var Node = function(options) {
	options = options || {};
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
	this.nodeType = options.nodeType || 1;
	this.ownerDocument = options.ownerDocument;
	this.data = options.data;
	this.attributes = new NamedNodeMap(options.attribs);
	this.nodeName = options.nodeName;
};

Object.defineProperty(Node.prototype, 'children', {
	get: function() {
		return this.childNodes;
	},
	set: function(children) {
		this.childNodes = children;
		return children;
	}
});
Object.defineProperty(Node.prototype, 'name', {
	get: function() {
		return this.tagName;
	},
	set: function(name) {
		this.tagName = name;
		return name;
	}
});
Object.defineProperty(Node.prototype, 'attribs', {
	get: function() {
		return this.attributes._attribs;
	},
	set: function(attributes) {
		this.attributes = new NamedNodeMap(attributes);
		return this.attributes;
	}
});

Node.prototype.removeChild = function(childNode) {
	var idx = this.childNodes.indexOf(childNode);

	if (idx === -1) {
		throw new Error(
			'Unable to execute "removeChild" on Node: supplied Node is not ' +
			'a child of this Node.'
		);
	}

	this.childNodes.splice(idx, 1);
	childNode.parentNode = null;

	return childNode;
};

Node.prototype.appendChild = function(childNode) {
	this.childNodes.push(childNode);
	childNode.parentNode = this;
	return childNode;
};
Node.prototype.cloneNode = function(deep) {
	var childNodes;

	if (deep) {
		childNodes = this.childNodes.map(function(childNode) {
			return new Node(childNode);
		});
	} else {
		childNodes = this.childNodes;
	}

	return new Node({
		childNodes: childNodes
	});
};

Object.defineProperty(Node.prototype, 'firstChild', {
	get: function() {
		return this.childNodes[0] || null;
	}
});

Object.defineProperty(Node.prototype, 'lastChild', {
	get: function() {
		return this.childNodes[this.childNodes.length - 1] || null;
	}
});

Object.defineProperty(Node.prototype, 'textContent', {
	set: function(textContent) {
		this.childNodes = [
			new Node({ data: textContent, nodeType: 3 })
		];
	}
});

module.exports = Node;
