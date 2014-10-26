'use strict';

var Document = require('../../lib/document');
var Node = require('../../lib/node');
var Element = require('../../lib/nodes/element');
var ElementTypes = {
	Input: require('../../lib/nodes/elements/input'),
	Option: require('../../lib/nodes/elements/option'),
	Select: require('../../lib/nodes/elements/select')
};

suite('document', function() {
	suite('#createElement', function() {
		test('generic element', function() {
			var document = new Document();
			var div = document.createElement('div');

			assert.instanceOf(div, Element);
			assert.equal(div.nodeName, 'div');
			assert.equal(div.ownerDocument, document, 'sets the owner document');
		});

		test('input element', function() {
			var document = new Document();
			var input = document.createElement('input');

			assert.instanceOf(input, ElementTypes.Input);
		});

		test('option element', function() {
			var document = new Document();
			var option = document.createElement('option');

			assert.instanceOf(option, ElementTypes.Option);
		});

		test('select element', function() {
			var document = new Document();
			var select = document.createElement('select');

			assert.instanceOf(select, ElementTypes.Select);
		});
	});

	test('#createDocumentFragment', function() {
		var document = new Document();
		var fragment = document.createDocumentFragment();

		assert.instanceOf(fragment, Node);
		assert.equal(fragment.nodeType, 11);
		assert.equal(fragment.ownerDocument, document);
	});
});
