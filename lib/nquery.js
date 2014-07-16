'use strict';

var jQuery = require('jquery');
var Node = require('./dom-node');
var Element = require('./dom-element');

function load(markup) {
	var document = new Element({
		tagName: 'html',
		nodeType: 9
	});
	document.documentElement = new Element({
		tagName: 'html',
		ownerDocument: document
	});
	document.childNodes = [document.documentElement];
	document.createElement = function(tagName) {
		return new Element({
			tagName: tagName,
			parent: this,
			ownerDocument: document
		});
	};
	document.removeChild = function(childNode) {

	};
	document.createDocumentFragment = function() {
		return new Node({
			nodeType: 11
		});
	};

	document.documentElement.innerHTML = markup;

	return {
		document: document,
		$: jQuery({
			document: document,
			addEventListener: function() {}
		})
	};
}

module.exports = function(markup) {
	var loaded = load(markup);

	return loaded.$(loaded.document.documentElement.childNodes);
};

module.exports.load = function(markup) {
	return load(markup).$;
};;
