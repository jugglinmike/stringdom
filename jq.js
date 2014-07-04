'use strict';

var nQuery = require('./');

var $ = nQuery.load("<div>");

var $statement = $('div')
	.html("The <b>future</b> is <span class='now'>something</span>.")
	.find('span').toggleClass('bocoup now').text('cool')
	.end();

console.log($statement.html());
