'use strict';

/**
 * @constructor
 * @private
 */
var Node = function(options) {
	options = options || {};
	this.parentNode = options.parent || null;
	this.style = {};
	this.childNodes = options.childNodes || [];
	this.nodeType = options.nodeType || 1;
	this.data = options.data;
	this.nodeName = options.nodeName;
	if ('parseOptions' in options) {
		this.parseOptions = options.parseOptions;
		this.parseOptions.decodeEntities = true;
	}

	this.childNodes.forEach(function(child) {
		child.parentNode = this;
	}, this);

	if ('ownerDocument' in options) {
		this._ownerDocument = options.ownerDocument;
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
		return this.nodeName;
	},
	set: function(name) {
		this.nodeName = name;
		return name;
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

	if (childNode.nodeType === 11) {
		this.childNodes.push.apply(this.childNodes, childNode.childNodes);
		childNode.childNodes.forEach(function(childNode) {
			childNode.parentNode = this;
		}, this);
		childNode.childNodes.length = 0;
		return;
	}

	if (previousParent) {
		previousParent.removeChild(childNode);
	}

	this.childNodes.push(childNode);
	childNode.parentNode = this;
	return childNode;
};

Node.prototype.insertBefore = function(childNode, nextSibling) {
	var childNodes = this.childNodes;
	var idx = nextSibling ?
		this.childNodes.indexOf(nextSibling) : childNodes.length;

	if (idx === -1) {
		throw new Error('Node#insertBefore: next sibling node not found.');
	}

	if (childNode.nodeType === 11) {
		childNodes.splice.apply(
			childNodes, [idx, 0].concat(childNode.childNodes)
		);
		childNode.childNodes.forEach(function(childNode) {
			childNode.parentNode = this;
		}, this);
		childNode.childNodes.length = 0;
		return;
	}

	childNodes.splice(idx, 0, childNode);
	childNode.parentNode.removeChild(childNode);
	childNode.parentNode = this;
};

Node.prototype.replaceChild = function(newChild, oldChild) {
	var idx = this.childNodes.indexOf(oldChild);
	var oldIdx, oldSiblings;

	if (idx === -1) {
		throw new Error('Node#replaceChild: child node not found.');
	}

	if (newChild.nodeType === 11) {
		this.childNodes.splice.apply(
			this.childNodes, [idx, 1].concat(newChild.childNodes)
		);
		newChild.childNodes.forEach(function(childNode) {
			childNode.parentNode = this;
		}, this);
		newChild.childNodes.length = 0;
		return;
	}

	if (newChild.parentNode) {
		oldSiblings = newChild.parentNode.childNodes;
		oldIdx = oldSiblings.indexOf(newChild);
		oldSiblings.splice(oldIdx, 1);
	}

	this.childNodes[idx] = newChild;
	newChild.parentNode = this;
	oldChild.parentNode = null;
};

Node.prototype.cloneNode = function(deep) {
	var options = {
		ownerDocument: this.ownerDocument
	};

	Object.keys(this).forEach(function(key) {
		options[key] = this[key];
	}, this);

	if (deep) {
		options.childNodes = options.childNodes.map(function(child) {
			return child.cloneNode(true);
		});
	} else {
		delete options.childNodes;
	}

	return new (this.constructor)(options);
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

		if (!parent) {
			return null;
		}

		return parent.childNodes[parent.childNodes.indexOf(this) + 1];
	}
});

Object.defineProperty(Node.prototype, 'previousSibling', {
	get: function() {
		var parent = this.parentNode;

		if (!parent) {
			return null;
		}

		return parent.childNodes[parent.childNodes.indexOf(this) - 1];
	}
});

Object.defineProperty(Node.prototype, 'textContent', {
	get: function() {
		if (this.data) {
			return this.data;
		}

		return this.childNodes.map(function(childNode) {
			return childNode.textContent;
		}).join('');
	},
	set: function(textContent) {
		this.data = textContent;

		this.childNodes.forEach(function(childNode) {
			childNode.parentNode = null;
		});
		this.childNodes.length = 0;

		return this.data;
	}
});

Object.defineProperty(Node.prototype, 'ownerDocument', {
	get: function() {
		return this._ownerDocument;
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
		owner._parseOptions = parseOptions;
		return owner._parseOptions;
	}
});

module.exports = Node;
