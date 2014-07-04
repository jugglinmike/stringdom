var select = require('CSSselect');
var render = require('dom-serializer');

var Node = function(options) {
	options = options || {};
	this.tagName = options.tagName;
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
	this.nodeType = options.nodeType || 1;
	this.ownerDocument = options.ownerDocument;
	this.data = options.data;
	this.attribs = options.attribs;
};

Node.prototype.getElementsByTagName = function(tagName) {
	return select(tagName, this);
};

Node.prototype.querySelectorAll = function(selector) {
	return select(selector, this);
};
Object.defineProperty(Node.prototype, 'className', {
	get: function() {
		return this.attribs.class;
	},
	set: function(className) {
		return this.attribs.class = className;
	}
});

// Aliases for compatability with CSSSelect and dom-serializer
var typeNames = {
	'1': 'tag',
	'3': 'text'
};
Object.defineProperty(Node.prototype, 'type', {
	get: function() {
		return typeNames[this.nodeType];
	},
	set: function(type) {
		return this.nodeType = type;
	}
});
Object.defineProperty(Node.prototype, 'children', {
	get: function() {
		return this.childNodes;
	},
	set: function(children) {
		return this.childNodes = children;
	}
});
Object.defineProperty(Node.prototype, 'name', {
	get: function() {
		return this.tagName;
	},
	set: function(name) {
		return this.tagName = name;
	}
});

Node.prototype.removeChild = function() {};
Node.prototype.appendChild = function(childNode) {
	this.childNodes.push(childNode);
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

Node.prototype.addEventListener = function() {};

Object.defineProperty(Node.prototype, 'lastChild', {
	get: function() {
		return this.childNodes[this.childNodes.length - 1] || null;
	}
});

Object.defineProperty(Node.prototype, 'innerHTML', {
	get: function() {
		return render(this.children, {
			normalizeWhitespace: false,
			xmlMode: false,
			decodeEntities: true
		});
	},
	set: function(str) {
		this.childNodes = require('./evaluate')(str);
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
