'use strict';

var SD = require('../../lib/css-style-decl');
var Document = require('../..').Document;

function create(markup, options) {
	var d = new Document(options);
	d.documentElement.innerHTML = markup;
	return  d.documentElement.childNodes[0];
}

suite('CSSStyleDeclaration', function() {
	setup(function() {
		this.elem = create('<div>');
		this.sd = new SD(this.elem);
	});
	suite('#getPropertyValue', function() {
		test('returns `null` for unrecognized values', function() {
			assert.equal(this.sd.getPropertyValue('color'), null);
		});

		test('returns the string value of inline styles', function() {
			this.elem = create('<div style="color: red;">');
			this.sd = new SD(this.elem);
			assert.equal(this.sd.getPropertyValue('color'), 'red');
		});
	});

	suite('#setProperty', function() {
		function hasStyle(styleStr, attr, val) {
			var regexp = new RegExp(
				'\\b' + attr + '\\s*:\\s*' + val + '\\s*(;|$)'
			);
			assert(
				regexp.test(styleStr),
				'Style string "' + styleStr +
					'" should contain the declaration: `' + attr + ': ' + val
					+ ';`'
			);
		}

		test('adds new declarations to element\'s `style` attribute', function() {
			this.sd.setProperty('color', 'blue');
			hasStyle(this.elem.getAttribute('style'), 'color', 'blue')
		});

		test('updates existing declarations on element\'s `style` attribute', function() {
			this.elem.setAttribute('style', 'color: green;');
			this.sd.setProperty('color', 'orange');
			hasStyle(this.elem.getAttribute('style'), 'color', 'orange')
		});
	});
});
