'use strict';

var create = require('../create');

function hasStyle(styleStr, attr, val) {
	var regexp = new RegExp(
		'\\b' + attr + '\\s*:\\s*' + val + '\\s*(;|$)'
	);
	assert(
		regexp.test(styleStr),
		'Style string "' + styleStr +
			'" should contain the declaration: `' + attr + ': ' + val +
			';`'
	);
}

suite('inline styling', function() {
	setup(function() {
		this.div = create('<div>');
	});

	test('`style` attribute updates `style` property', function() {
		this.div.setAttribute('style', 'color: red;');

		assert.equal(this.div.style.color, 'red');
	});

	test('`style` property updates `style` attribute', function() {
		this.div.style.color = 'red';

		hasStyle(this.div.getAttribute('style'), 'color', 'red');
	});
});
