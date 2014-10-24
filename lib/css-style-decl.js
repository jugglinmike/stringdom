'use strict';

function CSSStyleDeclaration(inline) {
	if (inline) {
		inline.trim().split(';').forEach(function(statement) {
			var parts = statement.split(':');
			var property = parts[0];
			var value = parts.slice(1).join(':');

			if (!property || !value) {
				return;
			}

			this[property.trim()] = value.trim();
		}, this);
	}
}

CSSStyleDeclaration.prototype.getPropertyValue = function(name) {
	if (Object.hasOwnProperty.call(this, name)) {
		return this[name];
	}

	return null;
};

CSSStyleDeclaration.prototype.setProperty = function(name, value) {
	if (name in this && !Object.hasOwnProperty.call(this, name)) {
		return;
	}

	this[name] = value.trim();
};

CSSStyleDeclaration.prototype.toString = function() {
	var str = Object.keys(this).filter(function(name) {
		return !!this[name];
	}, this).map(function(name) {
		return name + ': ' + this[name];
	}, this).join('; ');

	if (str) {
		str += ';';
	}

	return str;
};

module.exports = CSSStyleDeclaration;
