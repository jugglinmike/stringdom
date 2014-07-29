'use strict';
var util = require('util');

var Element = require('../dom-element');

function OptionElement() {
	Element.apply(this, arguments);
}

util.inherits(OptionElement, Element);

Object.defineProperty(OptionElement.prototype, 'selected', {
	get: function() {
		return this.attributes.getNamedItem('selected') !== null;
	},
	set: function(val) {
		if (val) {
			this.setAttribute('selected', 'selected');
		} else {
			this.removeAttribute('selected');
		}
	}
});

Object.defineProperty(OptionElement.prototype, 'value', {
	get: function() {
		return this.attributes.getNamedItem('value');
	},
	set: function(value) {
		return this.attributes.setNamedItem('value', value);
	}
});

// TODO: Implement `disabled` property

module.exports = OptionElement;
