'use strict';

var hasOwn = Object.hasOwnProperty.call.bind(Object.hasOwnProperty);

function CSSStyleDeclaration(inline) {
	if (inline) {
		inline.trim().split(';').forEach(function(statement) {
			var parts = statement.split(':');
			var property = parts[0];
			var value = parts.slice(1).join(':');

			if (!property || !value) {
				return;
			}

			this.setProperty(property, value);
		}, this);
	}
}

CSSStyleDeclaration.prototype.getPropertyValue = function(name) {
	if (hasOwn(this, name)) {
		return this[name];
	}

	return null;
};

CSSStyleDeclaration.prototype.setProperty = function(name, value) {
	if (name in this && !hasOwn(this, name)) {
		return;
	}

	name = name.trim().replace(/(.)-([a-z])/g, function(_, leader, letter) {
		return leader + letter.toUpperCase();
	});


	this[name] = value.trim();
};

CSSStyleDeclaration.prototype.toString = function() {
	var str = Object.keys(this).filter(function(name) {
		var value = this[name];
		return hasOwn(this, name) && value !== null && value !== undefined;
	}, this).map(function(name) {
		return name + ': ' + this[name];
	}, this).join('; ');

	if (str) {
		str += ';';
	}

	return str;
};

module.exports = CSSStyleDeclaration;
