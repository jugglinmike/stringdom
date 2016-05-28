'use strict';

var create = require('../create');

suite('Element', function() {
	test('rendering changes to CSS', function() {
		var el = create('<div><div></div></div>');
		var child;

		el.childNodes[0].setAttribute('style', 'color: red');
		el.childNodes[0].style.border = '1px';
		el.innerHTML = el.innerHTML;
		child = el.childNodes[0];

		assert.match(child.getAttribute('style'), /color:\s*red;/);
		assert.match(child.getAttribute('style'), /border:\s*1px;/);
	});

	test('integration with underlying CSS selector engine', function() {
		var el =create(
			'<div>' +
			'<h1>Some text</h1>' +
			'<h2></h2>' +
			'<ul><li><!-- a comment --></li>' +
			'</ul>' +
			'<p><![CDATA[ some data ]]></p>' +
			'</div>'
		);

		var emptyElements = el.querySelectorAll(':empty');

		assert.equal(emptyElements.length, 3);
	});

	test('integration with underlying rendering engine', function() {
		var html =
			'<div>' +
			'<!-- comment -->' +
			'text node' +
			'<style>a { color: red; }</style>' +
			'<script>var javascript;</script>' +
			'</div>';
		var el = create(html);

		assert.equal(el.outerHTML, html);
	});
});
