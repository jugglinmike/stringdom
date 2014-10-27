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
		test('retrieval from leaf', function() {
			var node = new Node();
			node.textContent = 'some text';

			assert.equal(node.textContent, 'some text');
		});

		test('retrieval from parent', function() {
			var parent = new Node();
			var child1 = new Node();
			var child2 = new Node();
			child1.textContent = 'Hello ';
			child2.textContent = 'world';
			parent.appendChild(child1);
			parent.appendChild(child2);

			assert.equal(parent.textContent, 'Hello world');
		});

		test('removal of existing children', function() {
			var parent = new Node();
			var child1 = new Node();
			var child2 = new Node();

			parent.appendChild(child1);
			parent.appendChild(child2);

			parent.textContent = '';

			assert.equal(parent.childNodes.length, 0);
			assert.equal(child1.parentNode, null);
			assert.equal(child2.parentNode, null);
		});

		test('setting simple text');
		test('setting text that contains markup');
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

		test('fragments', function() {
			var df = new Node({
				nodeType: 11
			});
			var child2 = new Node();
			var child3 = new Node();
			df.appendChild(child2);
			df.appendChild(child3);

			parent.appendChild(df);

			assert.equal(df.parentNode, null);
			assert.equal(df.childNodes.length, 0);
			assert.equal(parent.childNodes.length, 3);
			assert.equal(parent.childNodes[1], child2);
			assert.equal(parent.childNodes[2], child3);
			assert.equal(child2.parentNode, parent);
			assert.equal(child3.parentNode, parent);
		});
	});

	suite('#insertBefore', function() {
		var parent, child1, child2, child3, oldParent, newNode;

		setup(function() {
			parent = new Node();
			child1 = new Node();
			child2 = new Node();
			child3 = new Node();
			oldParent = new Node();
			newNode = new Node();
			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.appendChild(child3);
			oldParent.appendChild(newNode);
		});

		test('before first child', function() {
			parent.insertBefore(newNode, child1);

			assert.equal(parent.childNodes[0], newNode);
			assert.equal(newNode.parentNode, parent);
			assert.equal(oldParent.childNodes, 0);
		});

		test('before middle child', function() {
			parent.insertBefore(newNode, child2);

			assert.equal(parent.childNodes[1], newNode);
			assert.equal(newNode.parentNode, parent);
			assert.equal(oldParent.childNodes, 0);
		});

		test('before last child', function() {
			parent.insertBefore(newNode, child3);

			assert.equal(parent.childNodes[2], newNode);
			assert.equal(newNode.parentNode, parent);
			assert.equal(oldParent.childNodes.length, 0);
		});

		test('document fragments', function() {
			var df = new Node({
				nodeType: 11
			});
			var newNode1 = new Node();
			var newNode2 = new Node();
			df.appendChild(newNode1);
			df.appendChild(newNode2);

			parent.insertBefore(df, child2);

			assert.equal(df.parentNode, null);
			assert.equal(df.childNodes.length, 0);
			assert.equal(newNode1.parentNode, parent);
			assert.equal(newNode2.parentNode, parent);
			assert.equal(parent.childNodes.length, 5);
			assert.equal(parent.childNodes[1], newNode1);
			assert.equal(parent.childNodes[2], newNode2);
		});

		test('before invalid child', function() {
			assert.throws(function() {
				parent.insertBefore(newNode, new Node());
			});
		});

		test('before null (appending)', function() {
			parent.insertBefore(newNode, null);

			assert.equal(parent.childNodes.length, 4);
			assert.equal(parent.childNodes[3], newNode);
			assert.equal(newNode.parentNode, parent);
			assert.equal(oldParent.childNodes.length, 0);
		});
	});

	suite('#replaceChild', function() {
		var parent, child, newNode, oldParent;

		setup(function() {
			parent = new Node();
			child = new Node();
			newNode = new Node();
			oldParent = new Node();

			parent.appendChild(child);
			oldParent.appendChild(newNode);
		});

		test('valid child', function() {
			parent.replaceChild(newNode, child);

			assert.equal(parent.childNodes.length, 1);
			assert.equal(parent.childNodes[0], newNode);
			assert.equal(child.parentNode, null);
			assert.equal(newNode.parentNode, parent);
			assert.equal(oldParent.childNodes.length, 0);
		});

		test('invalid child', function() {
			assert.throws(function() {
				parent.replaceChild(newNode, new Node());
			});
		});

		test('detached node', function() {
			var detachedNode = new Node();
			parent.replaceChild(detachedNode, child);

			assert.equal(detachedNode.parentNode, parent);
			assert.equal(parent.childNodes.length, 1);
			assert.equal(parent.childNodes[0], detachedNode);
			assert.equal(child.parentNode, null);
		});

		test('document fragment', function() {
			var df = new Node({
				nodeType: 11
			});
			var newChild1 = new Node();
			var newChild2 = new Node();
			df.appendChild(newChild1);
			df.appendChild(newChild2);

			parent.replaceChild(df, child);

			assert.equal(parent.childNodes.length, 2);
			assert.equal(newChild1.parentNode, parent);
			assert.equal(newChild2.parentNode, parent);
			assert.equal(df.childNodes.length, 0);
		});
	});

	suite('#cloneNode', function() {
		test('attributes', function() {
			var owner = {};
			var source = new Node({
				nodeType: 1,
				ownerDocument: owner,
				data: 'some text'
			});
			var cloned = source.cloneNode();

			assert.equal(cloned.nodeType, 1);
			assert.equal(cloned.ownerDocument, owner);
			assert.equal(cloned.data, 'some text');
		});

		test('does not copy children by default', function() {
			var source = new Node();
			var child = new Node();
			var cloned;

			source.appendChild(child);
			cloned = source.cloneNode();

			assert.equal(source.childNodes.length, 1);
			assert.equal(source.childNodes[0], child);
			assert.equal(child.parentNode, source);
			assert.equal(cloned.childNodes.length, 0);
		});

		test('deep cloning', function() {
			var owner = {};
			var source = new Node();
			var child = new Node({
				nodeType: 1,
				ownerDocument: owner
			});
			var grandChild = new Node();
			var cloned;

			source.appendChild(child);
			child.appendChild(grandChild);
			cloned = source.cloneNode(true);

			assert.equal(source.childNodes.length, 1);
			assert.equal(source.childNodes[0], child);
			assert.equal(child.parentNode, source);
			assert.equal(cloned.childNodes.length, 1);
			assert.equal(cloned.childNodes[0].parentNode, cloned);
			assert.equal(cloned.childNodes[0].nodeType, 1);
			assert.equal(cloned.childNodes[0].ownerDocument, owner);
			assert.equal(cloned.childNodes[0].childNodes.length, 1);
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
