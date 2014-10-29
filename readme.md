# Stringdom

The [W3C DOM](http://www.w3.org/TR/REC-DOM-Level-1/) powered by text. Built on
top of [htmlparser2](https://github.com/fb55/htmlparser2) and
[CSSSelect](https://github.com/fb55/CSSselect).

## Usage

This library is published on npm as "stringdom". Install it via:

    $ npm install stringdom

It exports a single constructor function for Document objects. Documents can be
initialized with [a `defaultView`
object](https://developer.mozilla.org/en-US/docs/Web/API/document.defaultView)
(i.e. the global `window` reference) and the parsing options supported by
[htmlparser2](https://github.com/fb55/htmlparser2).

```javascript
var Document = require('stringdom');

var document = new Document();
var ul;

document.write('<h1>Soul Food Cafe</h1><ul></ul>');

ul = document.getElementsByTagName('ul')[0];

ul.innerHTML = '<li></li><li></li>';
document.querySelectorAll('li')[0].textContent = 'toasted white bread';
ul.lastChild.textContent = 'four fried chickens and Coke';

ul.setAttriubute('class', 'orders');

console.log(document.documentElement.innerHTML);
// '<h1>Soul Food Cafe</h1><ul class="orders"><li>toasted white bread</li><li>four fried chickens and a Coke</li></ul>';
```

## Limitations

- **Pseudoselectors** The CSSSelect engine is extremely fast, but some of its
  optimizations preclude the use of certain pseudo selectors. This includes
  `:first` and `:last`.
- **Live `NodeList`s** Unlike in true web browser contexts, all selections made
  with Stringdom are static--existing element collections will not be updated
  as their document is modified.

## License

Copyright (c) 2014 Mike Pennisi  
Licensed under the MIT Expat license.
