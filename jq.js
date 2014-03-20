var Node = require('./dom-node');

var document = new Node();
document.createElement = function(tagName) {
	return new Node({ parent: this });
};
document.removeChild = function(childNode) {

};
document.createDocumentFragment = function() {
	return new Node();
};

var $ = require('jquery')({
	document: document,
	addEventListener: function() {}
});

console.log($('<div>'));
