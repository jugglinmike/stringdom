'use strict';

var nQuery = require('./');

var $ = nQuery.load("<div>");

var $statement = $('div')
	.html("The <b>future</b> is <span class='now'>something</span>.")
	.find('span').toggleClass('bocoup now').text('cool')
	.end();

console.log($statement.html());

console.log(nQuery('<h1>This is a <span>title</span></h1>').html());
