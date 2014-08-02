'use strict';

var Document = require('../..').Document;
var Element = require('../..').Element;

function create(markup) {
	var d = new Document();
	d.documentElement.innerHTML = markup;
	return  d.documentElement.childNodes[0];
}

suite('Element', function() {
	test('#className', function() {
		var elem = create('<div class="a b c">');
		assert.equal(elem.className, 'a b c');
	});
});
