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
