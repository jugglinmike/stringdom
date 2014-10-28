'use strict';

var evaluate = require('../../lib/evaluate');

suite('evaluate', function() {
	suite('text nodes', function() {
		test('parent of first child', function() {
			var dom = evaluate('<div>text</div>', {});
			var div = dom[0];
			var text = div.childNodes[0];

			assert.equal(div.childNodes.length, 1);
			assert.equal(text.nodeType, 3);
			assert.equal(text.parentNode, div);
		});

		test('parent of subsequent children', function() {
			var dom = evaluate('<div><h1></h1>text</div>', {});
			var div = dom[0];
			var text = div.childNodes[1];

			assert.equal(div.childNodes.length, 2);
			assert.equal(text.nodeType, 3);
			assert.equal(text.parentNode, div);
		});
	});

	suite('comment nodes', function() {
		test('parent of first child', function() {
			var dom = evaluate('<div><!-- comment --></div>', {});
			var div = dom[0];
			var comment = div.childNodes[0];

			assert.equal(div.childNodes.length, 1);
			assert.equal(comment.nodeType, 8);
			assert.equal(comment.parentNode, div);
		});

		test('parent of subsequent children', function() {
			var dom = evaluate('<div><h1></h1><!-- comment --></div>', {});
			var div = dom[0];
			var comment = div.childNodes[1];

			assert.equal(div.childNodes.length, 2);
			assert.equal(comment.nodeType, 8);
			assert.equal(comment.parentNode, div);
		});
	});
});
