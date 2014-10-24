'use strict';

function CSSStyleDeclaration(inline) {
	if (inline) {
		inline.trim().split(';').forEach(function(statement) {
			var parts = statement.split(':');

			if (parts.length !== 2) {
				return;
			}

			this[parts[0].trim()] = parts[1].trim();
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
	return Object.keys(this).map(function(name) {
		return name + ': ' + this[name];
	}, this).join(';');
};

module.exports = CSSStyleDeclaration;
