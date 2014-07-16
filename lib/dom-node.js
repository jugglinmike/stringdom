var Node = function(options) {
	options = options || {};
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
	this.nodeType = options.nodeType || 1;
	this.ownerDocument = options.ownerDocument;
	this.data = options.data;
	this.attribs = options.attribs || {};
};

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
