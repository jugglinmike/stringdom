'use strict';

var Node = require('../..').Node;

suite('Node', function() {
	suite('#appendChild', function() {
		var parent, child;

		setup(function() {
			parent = new Node();
			child = new Node();
			parent.appendChild(child);
		});

		test('childNodes of parent', function() {
			assert.deepEqual(parent.childNodes, [child]);
		});

		test('parentNode of child', function() {
			assert.equal(child.parentNode, parent);
		});
	});

	suite('#firstChild', function() {
		var parent;

		setup(function() {
			parent = new Node();
		});

		test('no children', function() {
			assert.equal(parent.firstChild, null);
		});

		test('one child', function() {
			var child = new Node();
			parent.appendChild(child);

			assert.equal(parent.firstChild, child);
		});

		test('many children', function() {
			var firstChild = new Node();
			var lastChild = new Node();
			parent.appendChild(firstChild);
			parent.appendChild(lastChild);

			assert.equal(parent.firstChild, firstChild);
		});
	});

	suite('#lastChild', function() {
		var parent;

		setup(function() {
			parent = new Node();
		});

		test('no children', function() {
			assert.equal(parent.lastChild, null);
		});

		test('one child', function() {
			var child = new Node();
			parent.appendChild(child);

			assert.equal(parent.lastChild, child);
		});

		test('many children', function() {
			var firstChild = new Node();
			var lastChild = new Node();

			parent.appendChild(firstChild);
			parent.appendChild(lastChild);

			assert.equal(parent.lastChild, lastChild);
		});
	});
});
