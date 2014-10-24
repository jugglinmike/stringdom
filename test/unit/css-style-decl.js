'use strict';

var SD = require('../../lib/css-style-decl');

suite('CSSStyleDeclaration', function() {
	setup(function() {
		this.sd = new SD();
	});
	suite('#getPropertyValue', function() {
		test('returns `null` for unrecognized values', function() {
			assert.equal(this.sd.getPropertyValue('color'), null);
		});

		test('returns `null` for inherited values', function() {
			assert.equal(this.sd.getPropertyValue('toString'), null);
		});

		suite('initial values', function() {
			test('single value with trailing semicolon', function() {
				this.sd = new SD('color: red;');
				assert.equal(this.sd.getPropertyValue('color'), 'red');
			});

			test('single value without trailing semicolon', function() {
				this.sd = new SD('color: red');
				assert.equal(this.sd.getPropertyValue('color'), 'red');
			});

			test('multiple values', function() {
				this.sd = new SD('color: red;display: block;');

				assert.equal(this.sd.getPropertyValue('color'), 'red');
				assert.equal(this.sd.getPropertyValue('display'), 'block');
			});

			test('multiple values with extra whitespace', function() {
				this.sd = new SD('  color  : blue ; display : inline ; ');

				assert.equal(this.sd.getPropertyValue('color'), 'blue');
				assert.equal(this.sd.getPropertyValue('display'), 'inline');
			});
		});
	});

	suite('#setProperty', function() {
		test('correctly sets valid properties', function() {
			this.sd.setProperty('color', 'green');

			assert.equal(this.sd.color, 'green');
		});

		test('ignores invalid properties', function() {
			var oldToString = this.sd.toString;
			this.sd.setProperty('toString', 'something bad');

			assert.equal(this.sd.toString, oldToString);
		});
	});
});
