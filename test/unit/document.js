'use strict';
var stringdom = require('../..');

var Node = stringdom.Node;
var Document = stringdom.Document;

suite('Document', function() {
	test('default behavior', function() {
		var document = new Document();

		assert.instanceOf(document, Node);
		assert.ok(document.documentElement, 'creates a document element');
		assert.ok(document.documentElement.nodeType, 1);
	});
});
