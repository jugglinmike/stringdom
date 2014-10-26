'use strict';
var util = require('util');

var Element = require('../element');

function SelectElement() {
	Element.apply(this, arguments);
}

util.inherits(SelectElement, Element);

// TODO: Implement `HTMLOptionsCollection` in favor of a native Array.
Object.defineProperty(SelectElement.prototype, 'options', {
	get: function() {
		return this.childNodes.filter(function(node) {
			return node.nodeName === 'option';
		});
	},
	set: function(options) {
		this.childNodes = options;
		return options;
	}
});

Object.defineProperty(SelectElement.prototype, 'type', {
	get: function() {
		if (this.getAttribute('multiple') !== null) {
			return 'select-multiple';
		}
		return 'select-one';
	},
	set: function(type) {
		return type;
	}
});

Object.defineProperty(SelectElement.prototype, 'selectedIndex', {
	get: function() {
		var options = this.options;
		var length = options.length;
		var idx;

		for (idx = 0; idx < length; ++idx) {
			if (options[idx].selected) {
				return idx;
			}
		}

		return -1;
	},
	set: function(idx) {
		var options = this.options;
		options[this.selectedIndex].selected = false;
		options[idx].selected = true;
	}
});

module.exports = SelectElement;
