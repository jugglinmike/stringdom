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

	suite('#createTextNode', function() {
		var document;

		setup(function() {
			document = new Document();
		});

		test('normal operation', function() {
			var textNode = document.createTextNode('some text');

			assert.equal(textNode.data, 'some text');
			assert.equal(textNode.nodeType, 3);
		});

		test('insufficient arguments', function() {
			assert.throws(document.createTextNode.bind(document));
		});
	});
});
