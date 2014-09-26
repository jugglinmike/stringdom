'use strict';

var htmlparser = require('htmlparser2');
var DomHandler = require('./dom-handler');

module.exports = function(content, options) {
	var handler = new DomHandler(),
		parser = new htmlparser.Parser(handler, options);

	parser.write(content);
	parser.done();

	return handler.dom;
};
