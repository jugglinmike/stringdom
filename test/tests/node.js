'use strict';

var Node = require('../..').Node;

suite('Node', function() {
	test('#appendChild', function() {
		var parent = new Node();
		var child = new Node();

		parent.appendChild(child);

		assert.deepEqual(parent.childNodes, [child]);
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
