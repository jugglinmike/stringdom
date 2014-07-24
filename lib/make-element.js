'use strict';

var Element = require('./dom-element');
var subclasses = {
	input: require('./elements/input'),
	select: require('./elements/select'),
	option: require('./elements/option')
};

/**
 * Simple factory function for creating instances of DOM elements--either
 * "plain" Elements or subclasses, depending on the `nodeType`.
 *
 * @param {Object} [options] - Data to be passed along to the Element
 *                             constructor.
 * @param {String} [options.nodeName] - Type of element to create. If
 *                                      unspecified (or unrecognized), a basic
 *                                      `Element` will be created.
 *
 * @returns {Element}
 */
module.exports = function(options) {
	var nodeName, Ctor;

	if (options && options.nodeName) {
		nodeName = options.nodeName.toLowerCase();
	}
	Ctor = subclasses[nodeName] || Element;

	return new Ctor(options);
};
