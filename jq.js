'use strict';

var nQuery = require('./');

var $ = nQuery.load("<div>");

var $statement = $('div')
	.html("The <b>future</b> is <span>something</span>.")
	.find('span').text('cool')
	.end();

console.log($statement.html());
