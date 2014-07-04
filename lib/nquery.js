'use strict';

var jQuery = require('jquery');
var Node = require('./dom-node');

module.exports = {
	load: function(markup) {
		var document = new Node({
			nodeType: 9
		});
		document.documentElement = new Node({
			tagName: 'html',
			ownerDocument: document
		});
		document.createElement = function(tagName) {
			return new Node({
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

		document.innerHTML = markup;

		return jQuery({
			document: document,
			addEventListener: function() {}
		});
	}
};
