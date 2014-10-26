'use strict';

var create = require('../create');

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

	suite('outerHTML', function() {
		test('creation of new element', function() {
			var parent = create('<div><div></div></div>');
			var origElem = parent.childNodes[0];
			var newElem;

			origElem.outerHTML = '<span></span>';

			newElem = parent.childNodes[0];

			assert.notEqual(origElem, newElem);
			assert.equal(newElem.parentNode, parent);
		});

		test('sibling linkages', function() {
			var parent = create('<ul><li></li><li></li><li></li></ul>');
			var origElem = parent.childNodes[1];
			var newElem;

			origElem.outerHTML = '<li></li>';

			newElem = parent.childNodes[1];

			assert.equal(origElem.nextSibling, null);
			assert.equal(origElem.previousSibling, null);
			assert.equal(newElem.nextSibling, parent.childNodes[2]);
			assert.equal(newElem.previousSibling, parent.childNodes[0]);
			assert.equal(parent.childNodes[0].nextSibling, newElem);
			assert.equal(parent.childNodes[2].previousSibling, newElem);
		});

		test('removal of previous element', function() {
			var parent = create('<div><div></div></div>');
			var origElem = parent.childNodes[0];

			origElem.outerHTML = '<span></span>';

			assert.equal(origElem.parentNode, null);
		});
	});

	suite('#getElementsByTagName', function() {
		test('nested elements', function() {
			var div = create('<div>');
			var ps;
			div.innerHTML = '<div><p></p></div><ul><li><p></p></li></ul><p></p>';

			ps = div.getElementsByTagName('p');

			assert.equal(ps.length, 3);
			assert.equal(ps[0], div.childNodes[0].childNodes[0]);
			assert.equal(ps[1], div.childNodes[1].childNodes[0].childNodes[0]);
			assert.equal(ps[2], div.childNodes[2]);
		});

		test('case insensitivity', function() {
			var div = create('<div>');
			var spans1, spans2;
			div.innerHTML = '<sPaN></sPaN>';

			spans1 = div.getElementsByTagName('span');
			spans2 = div.getElementsByTagName('SPAN');

			assert.equal(div.childNodes.length, 1);
			assert.equal(spans1.length, 1);
			assert.equal(spans1[0], div.childNodes[0]);
			assert.equal(spans2.length, 1);
			assert.equal(spans2[0], div.childNodes[0]);
		});

		test('case sensitivity in xmlMode', function() {
			var div = create('<div>', { xmlMode: true });
			var spans1, spans2, spans3;
			div.innerHTML = '<sPaN></sPaN>';

			spans1 = div.getElementsByTagName('span');
			spans2 = div.getElementsByTagName('SPAN');
			spans3 = div.getElementsByTagName('sPaN');

			assert.equal(div.childNodes.length, 1);
			assert.equal(spans1.length, 0);
			assert.equal(spans2.length, 0);
			assert.equal(spans3.length, 1);
			assert.equal(spans3[0], div.childNodes[0]);
		});
	});
});
