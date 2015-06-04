'use strict';

var create = require('../../create');

suite('Element', function() {
	suite('querying', function() {
		var elem;

		setup(function() {
			elem = create(
				'<div class="a">' +
					'<ul class="b c" id="unordered">' +
						'<li class="c d"></li>' +
						'<li class="c b"></li>' +
						'<li class="cd"></li>' +
					'</ul>' +
				'</div>'
			);
		});

		suite('#getElementsByTagName', function() {
			test('valid tag names', function() {
				var lis = elem.getElementsByTagName('li');

				assert.equal(lis.length, 3);
			});

			test('case insensitivity', function() {
				var lis = elem.getElementsByTagName('lI');

				assert.equal(lis.length, 3);
			});

			test('invalid tags', function() {
				var cs = elem.getElementsByTagName('.c');

				assert.equal(cs.length, 0);
			});
		});

		suite('#getElementById', function() {
			test('valid IDs', function() {
				var ul = elem.getElementById('unordered');

				assert(ul);
			});

			test('invalid IDs', function() {
				assert.equal(elem.getElementById('unordered .c'), null);
			});
		});

		suite('#querySelector', function() {
			test('returns first matching node', function() {
				var li = elem.querySelector('ul.b#unordered.c li');

				assert.equal(li, elem.childNodes[0].childNodes[0]);
			});

			test('returns null for non-matching selector', function() {
				assert.equal(elem.querySelector('#nomatch'), null);
			});
		});

		suite('#querySelectorAll', function() {
			test('multiple matching nodes', function() {
				var lis = elem.querySelectorAll('ul.b#unordered.c li');

				assert.equal(lis.length, 3);
			});

			test('zero nodes', function() {
				var lis = elem.querySelectorAll('ul.b#unordered.c li.f');

				assert.equal(lis.length, 0);
			});
		});
	});

	test('className', function() {
		var elem = create('<div class="a b c">');
		assert.equal(elem.className, 'a b c');
	});

	suite('innerHTML', function() {
		test('`ownerDocument` attribute', function() {
			var elem = create('<div>');
			var child;

			elem.innerHTML = '<span></span>';

			child = elem.childNodes[0];

			assert(elem.ownerDocument);
			assert.equal(elem.ownerDocument, child.ownerDocument);
			elem.removeChild(child);

			assert.equal(elem.ownerDocument, child.ownerDocument);
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
		test('reading from "plain" element', function() {
			var div = create('<div></div>');

			assert.equal(div.outerHTML, '<div></div>');
		});

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

	suite('textContent', function() {
		test('creation of new Text node child', function() {
			var div = create('<div></div>');

			div.textContent = 'some new text';

			assert.equal(div.childNodes.length, 1);
			assert.equal(div.childNodes[0].nodeType, 3);
			assert.equal(div.textContent, 'some new text');
			assert.equal(div.childNodes[0].parentNode, div);
		});

		test('removal of previous children', function() {
			var div = create('<div><p>paragraph 1</p><p>paragraph 2</p></div>');
			var oldChild1 = div.childNodes[0];
			var oldChild2 = div.childNodes[1];

			div.textContent = 'some new text';

			assert.equal(oldChild1.parentNode, null);
			assert.equal(oldChild2.parentNode, null);
		});

		test('clearing children for empty strings', function() {
			var div = create('<div><p>paragraph 1</p><p>paragraph 2</p></div>');
			var oldChild1 = div.childNodes[0];
			var oldChild2 = div.childNodes[1];

			div.textContent = '';

			assert.equal(div.childNodes.length, 0);
			assert.equal(oldChild1.parentNode, null);
			assert.equal(oldChild2.parentNode, null);
		});

		test('setting with falsey non-string values', function() {
			var div = create('<div>');

			div.textContent = 0;

			assert.equal(div.childNodes[0].data, '0');
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

		test('star', function() {
			var div = create('<div><ul></ul><p><a></a></p></div>');
			var els = div.getElementsByTagName('*');

			assert.equal(els.length, 3);
			assert.equal(els[0], div.childNodes[0]);
			assert.equal(els[1], div.childNodes[1]);
			assert.equal(els[2], div.childNodes[1].childNodes[0]);
		});
	});

	suite('#cloneNode', function() {
		test('attribute copying', function() {
			var div = create('<div data-test="some value">');
			var cloned = div.cloneNode();

			assert.equal(cloned.tagName, 'div');
			assert.equal(cloned.getAttribute('data-test'), 'some value');

			cloned.setAttribute('data-test', 'some other value');

			assert.equal(div.getAttribute('data-test'), 'some value');
		});
	});
});
