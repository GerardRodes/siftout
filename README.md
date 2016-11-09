# siftout
Sort elements by filters on responsive grid

##cool facts
- made with ES6
- responsive
- multiple browser support

![siftout gif example](http://i.imgur.com/sex3Biv.gif)


##The HTML
```html
  <div id="siftout-filter">
    <ul>
      <li><a href="#" data-group="all">All items</a></li>
      <li><a href="#" data-group="1">Group #1</a></li>
      <li><a href="#" data-group="2">Group #2</a></li>
      <li><a href="#" data-group="3">Group #3</a></li>
      <li><a href="#" data-group="4">Group #4</a></li>
    </ul>
  </div>
  <div id="siftout-grid">
    <div class="siftout-item" data-group="all, 1" ><img src="http://lorempixel.com/400/400/"></div>
    <div class="siftout-item" data-group="all, 2" ><img src="http://lorempixel.com/400/350/"></div>
    <div class="siftout-item" data-group="all, 3" ><img src="http://lorempixel.com/200/400/"></div>
    <div class="siftout-item" data-group="all, 4" ><img src="http://lorempixel.com/400/180/"></div>
    <div class="siftout-item" data-group="all, 2" ><img src="http://lorempixel.com/350/400/"></div>
    <div class="siftout-item" data-group="all, 4" ><img src="http://lorempixel.com/400/400/"></div>
    <div class="siftout-item" data-group="all, 3" ><img src="http://lorempixel.com/180/400/"></div>
    <div class="siftout-item" data-group="all, 4" ><img src="http://lorempixel.com/400/200/"></div>
    <div class="siftout-item" data-group="all, 1" ><img src="http://lorempixel.com/350/400/"></div>
    <div class="siftout-item" data-group="all, 1" ><img src="http://lorempixel.com/400/350/"></div>
    <div class="siftout-item" data-group="all, 4" ><img src="http://lorempixel.com/400/400/"></div>
    <div class="siftout-item" data-group="all, 3" ><img src="http://lorempixel.com/400/180/"></div>
    <div class="siftout-item" data-group="all, 2" ><img src="http://lorempixel.com/200/400/"></div>
    <div class="siftout-item" data-group="all, 1" ><img src="http://lorempixel.com/400/350/"></div>
    <div class="siftout-item" data-group="all, 4" ><img src="http://lorempixel.com/400/400/"></div>
    <div class="siftout-item" data-group="all, 3" ><img src="http://lorempixel.com/400/200/"></div>
    <div class="siftout-item" data-group="all, 1" ><img src="http://lorempixel.com/350/400/"></div>
    <div class="siftout-item" data-group="all, 2" ><img src="http://lorempixel.com/400/180/"></div>
  </div>
```
##The JS
yep, thats all
```javascript
let siftout = new Siftout()
```

##Configurable options
These are the default values
- gridElement: document.getElementById('siftout-grid')
- filterElement: document.getElementById('siftout-filter')
- itemSelector: '.siftout-item'
- columns: 4
- columnGap: 50
- rowGap: 50
- transition: '375ms ease-out'

###setting custom options
```javascript
let options = {
  gridElement: document.getElementById('my-grid'),
  filterElement: document.getElementById('my-filter'),
  itemSelector: '.my-item',
  columns: 2,
  columnGap: 0,
  rowGap: 0,
  transition: 'none'
}, 
siftout = new Siftout(options)
```
