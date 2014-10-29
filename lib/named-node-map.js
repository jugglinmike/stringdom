'use strict';

var splice = Array.prototype.splice;
var push = Array.prototype.push;

/**
 * @constructor
 * @private
 */
function NamedNodeMap(attribs) {
	this._attribs = attribs || {};
	var keys = Object.keys(this._attribs);

	keys.forEach(function(attrib, idx) {
		this[idx] = { name: attrib };
	}, this);

	this.length = keys.length;
}

NamedNodeMap.prototype.getNamedItem = function(name) {
	if (name in this._attribs) {
		return this._attribs[name];
	}

	return null;
};

NamedNodeMap.prototype.setNamedItem = function(name, value) {
	var idx = Object.keys(this._attribs).indexOf(name);

	if (idx > -1) {
		this._attribs[idx] = { name: name };
	} else {
		push.call(this, { name: name });
	}

	this._attribs[name] = value;
};

NamedNodeMap.prototype.removeNamedItem = function(name) {
	var idx = Object.keys(this._attribs).indexOf(name);

	if (idx === -1) {
		throw new Error(
			'Failed to execute "removeNamedItem" on "NamedNodeMap": ' +
			'No item with name "' + name + '" was found.'
		);
	}

	splice.call(this, idx, 1);
	delete this._attribs[name];
};

NamedNodeMap.prototype._clone = function() {
	var attribs = {};
	Object.keys(this._attribs).forEach(function(name) {
		attribs[name] = this._attribs[name];
	}, this);
	return new NamedNodeMap(attribs);
};

module.exports = NamedNodeMap;
