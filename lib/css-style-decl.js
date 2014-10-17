'use strict';

function CSSStyleDeclaration(elem) {
	this._elem = elem;
}

CSSStyleDeclaration.prototype._parseInline = function() {
	var inline = this._elem.getAttribute('style');
	var values;

	if (!inline) {
		return {};
	}

	values = {};

	inline.trim().split(';').forEach(function(statement) {
		var parts = statement.split(':');

		if (parts.length !== 2) {
			return;
		}

		values[parts[0].trim()] = parts[1].trim();
	});

	return values;
};

CSSStyleDeclaration.prototype.getPropertyValue = function(name) {
	var values = this._parseInline();

	return values[name] || null;
};

CSSStyleDeclaration.prototype.setProperty = function(name, value) {
	var values = this._parseInline();
	var style;

	values[name] = value;

	style = Object.keys(values).map(function(name) {
		return name + ':' + values[name];
	}).join(';');

	this._elem.setAttribute('style', style);
};

module.exports = CSSStyleDeclaration;
