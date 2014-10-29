'use strict';

var Document = require('../..');

suite('Document', function() {
	test('default behavior', function() {
		var document = new Document();

		assert.ok(document.documentElement, 'creates a document element');
		assert.ok(document.documentElement.nodeType, 1);
	});

	test('specification of `defaultView`', function() {
		var window = {};
		var document = new Document({
			defaultView: window
		});

		assert.equal(document.defaultView, window);
	});

	suite('#write', function() {
		test('markup parsing', function() {
			var document = new Document();
			var docElem = document.childNodes[0];

			assert.equal(docElem.childNodes.length, 0);

			document.write('<h1>Hello, world!</h1><p>This is a test</p>');

			assert.equal(docElem.childNodes.length, 2);
		});

		test('removal of previous elements', function() {
			var document = new Document();
			var docElem = document.documentElement;
			var h1;

			document.write('<h1>A test</h1');

			h1 = docElem.childNodes[0];

			document.write('');

			assert.equal(h1.parentNode, null);
			assert.equal(docElem.childNodes.length, 0);
		});
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

	suite('#createElement', function() {
		var document;

		setup(function() {
			document = new Document();
		});

		test('normal operation', function() {
			var elem = document.createElement('span');

			assert.equal(elem.nodeName, 'span');
			assert.equal(elem.nodeType, 1);
		});

		test('insufficient arguments', function() {
			assert.throws(document.createElement.bind(document));
		});
	});
});
