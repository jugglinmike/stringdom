'use strict';

var Node = require('../..').Node;

suite('Node', function() {
	suite('constructor', function() {
		test('children linkage', function() {
			var children = [new Node(), new Node()];
			var node = new Node({
				childNodes: children
			});

			assert.equal(children[0].parentNode, node);
			assert.equal(children[1].parentNode, node);
		});
	});

	suite('#textContent', function() {
		var node = new Node();
		node.textContent = 'some text';

		assert.equal(node.textContent, 'some text');
	});

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

		test('childNodes of previous parent', function() {
			var newParent = new Node();
			newParent.appendChild(child);

			assert.deepEqual(parent.childNodes, []);
		});
	});

	suite('#removeChild', function() {
		var parent, child, keptChild1, keptChild2;

		setup(function() {
			parent = new Node();
			child = new Node();
			keptChild1 = new Node();
			keptChild2 = new Node();

			parent.appendChild(keptChild1);
			parent.appendChild(child);
			parent.appendChild(keptChild2);
		});

		test('return value', function() {
			assert.equal(parent.removeChild(child), child);
		});

		test('non-child node', function() {
			var notChild = new Node();
			assert.throws(function() {
				parent.removeChild(notChild);
			});
		});

		test('childNodes of parent', function() {
			parent.removeChild(child);

			assert.deepEqual(parent.childNodes, [keptChild1, keptChild2]);
		});

		test('parentNode of child', function() {
			parent.removeChild(child);

			assert.equal(child.parentNode, null);
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

	suite('#nextSibling', function() {
		var parent, firstChild, lastChild;

		setup(function() {
			parent = new Node();
			firstChild = new Node();
			lastChild = new Node();
			parent.appendChild(firstChild);
		});

		test('no siblings', function() {
			assert.equal(firstChild.nextSibling, null);
		});

		test('one sibling', function() {
			parent.appendChild(lastChild);

			assert.equal(firstChild.nextSibling, lastChild);
		});

		test('no parents', function() {
			assert.equal(parent.nextSibling, null);
		});
	});

	suite('#previousSibling', function() {
		var parent, firstChild, lastChild;

		setup(function() {
			parent = new Node();
			firstChild = new Node();
			lastChild = new Node();
			parent.appendChild(firstChild);
		});

		test('no siblings', function() {
			assert.equal(firstChild.previousSibling, null);
		});

		test('one sibling', function() {
			parent.appendChild(lastChild);

			assert.equal(lastChild.previousSibling, firstChild);
		});

		test('no parents', function() {
			assert.equal(parent.previousSibling, null);
		});
	});
});
