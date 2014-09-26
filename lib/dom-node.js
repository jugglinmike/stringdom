'use strict';
var NamedNodeMap = require('./named-node-map');

var Node = function(options) {
	options = options || {};
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
	this.nodeType = options.nodeType || 1;
	this.data = options.data;
	this.attributes = new NamedNodeMap(options.attribs);
	this.nodeName = options.nodeName;
	if ('parseOptions' in options) {
		this.parseOptions = options.parseOptions;
		this.parseOptions.normalizeWhitespace = false;
		this.parseOptions.decodeEntities = true;
	}

	this.childNodes.forEach(function(child) {
		child.parentNode = this;
	}, this);

	if ('ownerDocument' in options) {
		this.ownerDocument = options.ownerDocument;
	}
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
	var previousParent = childNode.parentNode;

	if (previousParent) {
		previousParent.removeChild(childNode);
	}

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

Object.defineProperty(Node.prototype, 'nextSibling', {
	get: function() {
		var parent = this.parentNode;
		return parent.childNodes[parent.childNodes.indexOf(this) + 1];
	}
});

Object.defineProperty(Node.prototype, 'textContent', {
	get: function() {
		return this.data;
	},
	set: function(textContent) {
		return this.data = textContent;
	}
});

Object.defineProperty(Node.prototype, 'ownerDocument', {
	get: function() {
		return this._ownerDocument ||
			(this.parentNode && this.parentNode.ownerDocument);
	},
	set: function(document) {
		return this._ownerDocument = document;
	}
});

Object.defineProperty(Node.prototype, 'parseOptions', {
	get: function() {
		var owner = this.ownerDocument;
		var options = owner && owner._parseOptions || this._parseOptions || {};
		return options;
	},
	set: function(parseOptions) {
		var owner = this.ownerDocument || this;
		return owner._parseOptions = parseOptions;
	}
});

module.exports = Node;
