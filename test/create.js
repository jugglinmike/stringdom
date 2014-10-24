'use strict';

var Document = require('..').Document;

module.exports = function(markup, options) {
	var d = new Document(options);
	d.documentElement.innerHTML = markup;
	return  d.documentElement.childNodes[0];
};
