see
===

d3 is awesome, see

Inspired by emmet and put-selector, _see_ is a d3 plugin (a function
which operates on a selection) which generates HTML nodes based on a snippet

```javascript
d3.select('body')
  .select(see('header+(section>article>p)+footer'))
  .select('p').text('hello :)')
```


Developing
----------

```
open test/index.html
```


License
-------

License: http://sammyt.mit-license.org
