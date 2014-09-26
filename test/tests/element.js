'use strict';

var Document = require('../..').Document;

function create(markup) {
	var d = new Document();
	d.documentElement.innerHTML = markup;
	return  d.documentElement.childNodes[0];
}

suite('Element', function() {
	test('#className', function() {
		var elem = create('<div class="a b c">');
		assert.equal(elem.className, 'a b c');
	});

	suite('innerHTML', function() {
		test('`ownerDocument` attribute', function() {
			var elem = create('<div>');
			elem.ownerDocument = {};

			elem.innerHTML = '<span></span>';

			assert.equal(elem.ownerDocument, elem.childNodes[0].ownerDocument);
		});

		test('removal of previous `childNodes`', function() {
			var elem = create('<div>');
			var children;

			elem.innerHTML = '<span></span><div></div>';
			children = elem.childNodes.slice();
			elem.innerHTML = '';

			assert.equal(children[0].parentNode, null);
			assert.equal(children[1].parentNode, null);
		});
	});
});
