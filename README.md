see
===

d3 is awesome, see

Inspired by emmet and put-selector, _see_ is a d3 plugin (a function
which operates on a selection) which generates HTML nodes based on a snippet

```javascript
d3.select('body')
  .select(see('header+(section>article>$p)+footer'))
  .text('hello :)')
```

```html
<header></header>
<section>
  <article><p>hello :)</p></article>
</section>
<footer></footer>
```

Syntax
------

### Elements (div, p, ul etc.)


e.g. `div`, `span.urgent` and `a[href="/foo"]`

```javascript
d3.select('body').select(see('div.silly'))
```

```html
<div width="20px" class="silly"></div>
```

### Nesting >

`section>article>h1`

```javascript
d3.select('body').select(see('section>article>h1'))
```
`see` will return the `<section/>` tag to `select`

```html
<section>
    <article>
        <h1></h1>
    </article>
</section>
```

### Siblings +

`header+section+footer`

```javascript
d3.select('body').selectAll(see('header+section+footer'))
```
`see` will return an array of nodes `[<header/>,<section/>,<footer/>]`

```html
<header></header>
<section></section>
<footer></footer>
```

### Multiply *

`li*5`

```javascript
d3.select('body').select(see('ul>li.foo*5'))
```

`see` returns the top level `<ul/>`

```html
<ul>
    <li class="foo"></li>
    <li class="foo"></li>
    <li class="foo"></li>
    <li class="foo"></li>
    <li class="foo"></li>
</ul>
```

### Grouping ()

`header+(section>p>span)+footer`

```javascript
d3.select('body').selectAll(see('header+(section>p>span)+footer'))
```

```html
<header></header>
<section>
    <p><span><span></p>
</section>
<footer></footer>
```

### Targeting $

`$` allows you to control the node(s) that is return to create the selection

```javascript
d3.select('body')
  .select(see('header+(section>p>$span)+footer'))
  .text("hello")
```

```html
<header></header>
<section>
    <p><span>hello<span></p>
</section>
<footer></footer>
```

Or target multiple nodes

```javascript
d3.select('body')
  .selectAll(see('nav>ul>li*5'))
  .call(callForEachLi)
```

```html
<nav>
    <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</nav>
```


Developing
----------

```
open test/index.html
```


License
-------

License: http://sammyt.mit-license.org
