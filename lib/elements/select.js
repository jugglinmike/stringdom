'use strict';
var util = require('util');

var Element = require('../dom-element');

function SelectElement(options) {
	Element.apply(this, arguments);

	this.type = 'select-one';
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
		return this.childNodes = options;
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
