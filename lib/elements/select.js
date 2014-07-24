'use strict';
var util = require('util');

var Element = require('../dom-element');

function SelectElement(options) {
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
		return this.childNodes = options;
	}
});

module.exports = SelectElement;
