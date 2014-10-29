'use strict';

var create = require('../create');

suite('Element', function() {
	test('rendering changes to CSS', function() {
		var el = create('<div><div></div></div>');
		var child;

		el.childNodes[0].setAttribute('style', 'color: red');
		el.childNodes[0].style.border = '1px';
		el.innerHTML = el.innerHTML;
		child = el.childNodes[0];

		assert.match(child.getAttribute('style'), /color:\s*red;/);
		assert.match(child.getAttribute('style'), /border:\s*1px;/);
	});
});
