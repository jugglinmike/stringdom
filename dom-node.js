var Node = function(options) {
	options = options || {};
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
};

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
	set: function(str) {
		this.childNodes = require('./evaluate')(str);
	}
});

module.exports = Node;
