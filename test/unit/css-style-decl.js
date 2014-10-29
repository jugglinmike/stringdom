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

			test('values containing colons', function() {
				this.sd = new SD('content: ":";');

				assert.equal(this.sd.getPropertyValue('content'), '":"');
			});

			test('hyphenated properties', function() {
				this.sd = new SD('background-color: red; margin-left: 0;');

				assert.equal(
					this.sd.getPropertyValue('backgroundColor'), 'red'
				);
				assert.equal(
					this.sd.getPropertyValue('marginLeft'), '0'
				);
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

	suite('#toString', function() {
		test('values set during initialization', function() {
			var sd = new SD('color: grey;');

			assert.match(sd.toString(), /color:\s*grey/);
		});

		test('values set dynamically as properties', function() {
			this.sd.margin = '3px';

			assert.match(this.sd.toString(), /margin:\s*3px/);
		});

		test('values set via `setProperty`', function() {
			this.sd.setProperty('float', 'left');

			assert.match(this.sd.toString(), /float:\s*left/);
		});
	});
});
