var Node = require('./lib/dom-node');

var document = new Node({
	nodeType: 9
});
document.documentElement = new Node({
	tagName: 'html',
	ownerDocument: document
});
document.createElement = function(tagName) {
	return new Node({
		tagName: tagName,
		parent: this,
		ownerDocument: document
	});
};
document.removeChild = function(childNode) {

};
document.createDocumentFragment = function() {
	return new Node({
		nodeType: 11
	});
};

var $ = require('jquery')({
	document: document,
	addEventListener: function() {}
});

var $statement = $("<div>")
	.html("The <b>future</b> is <span>something</span>.")
	.find('span').text('cool')
	.end();

console.log($statement.html());
