'use strict';
var stringdom = require('../..');
var Node = stringdom.Node;
var Element = stringdom.Element;
var Document = stringdom.Document;

suite('Document', function() {
	test('default behavior', function() {
		var document = new Document();

		assert.instanceOf(document, Node);
		assert.instanceOf(document.documentElement, Element);
	});

	test('#createElement', function() {
		var document = new Document();
		var ul = document.createElement('ul');

		assert.instanceOf(ul, Element);
		assert.equal(ul.nodeName, 'ul');
		assert.equal(ul.ownerDocument, document);
	});

	test('#createDocumentFragment', function() {
		var document = new Document();
		var fragment = document.createDocumentFragment();

		assert.instanceOf(fragment, Node);
		assert.equal(fragment.nodeType, 11);
	});
});
