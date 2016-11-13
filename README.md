# Siftout
Sort elements by categories on responsive grid

##Cool Facts
- made with ES6
- responsive
- multiple browser support
- gpu accelerated animations
- cascade animations
- demo folder with live configurable settings, also available [here](https://htmlpreview.github.io/?https://github.com/GerardRodes/siftout/blob/master/demo/index.html)

![Demo preview](http://i.imgur.com/g29DZvN.gif)

#Use
##HTML
###Filters
A filter just needs the attribute `data-group` to be dettected, there is no need to be a link attribute or any else, it's up to you.
The `data-group` attribute has to be defined with any kind of string without a comma `,`.
```html
<ul id="siftout-filter">
  <li><a href="#" class="active" data-group="1" >Filter 1</a></li>
  <li><a href="#" data-group="2" >Filter 2</a></li>
  <li><a href="#" data-group="3" >Filter 3</a></li>
</ul>
```

###Items
Items must be on a grid _depth doesn't matters, or shouldn't, i didn't try_, every item should have a `class` to select all them and a `data-group` attribute to specify the groups to which it belongs, groups must be separated with a comma `,`.
Inside an item you can write any HTML structure.
```html
<div id="siftout-grid">
  <div class="siftout-item" data-group="1" ></div>
  <div class="siftout-item" data-group="1, 3" ></div>
  <div class="siftout-item" data-group="2" ></div>
</div>
```


###Initialization
```html
<script type="text/javascript" src="siftout.min.js" ></script>
<script type="text/javascript" >
  siftout = new Siftout()
</script>
```
When creating a new instance of __Siftout__ you can pass as parameter an object with any custom setting you want to define.
Example:
```javascript
<script type="text/javascript" src="siftout.min.js" ></script>
<script type="text/javascript" >
  siftout = new Siftout({
    gridElement: document.getElementById('grid'),
    filterElement: document.getElementById('filter'),
    itemSelector: '.item',
    columns: 5
  })
</script>
```

##Settings
```javascript
name: gridElement
default: document.getElementById('siftout-grid')
type: element
```
```javascript
name: filterElement
default: document.getElementById('siftout-filter')
type: element
```
```javascript
name: itemSelector
default: '.siftout-item'
type: css selector
```
```javascript
name: columns
default: 4
type: int
tips: number of columns
```
```javascript
name: itemWidth
default: undefined
type: int
tips: if provided columns setting will be ignored and a custom number of columns will be set from itemWidth, columnGap and the size of the grid
```
```javascript
name: columnGap
default: 25
type: int | string
tips: size in px between every column, set as string with 'auto' value to center columns with same space between
```
```javascript
name: rows
default: undefined
type: int
tips: number of rows, only useful when columns is not specified and auto gap size is true
```
```javascript
name: rowGap
default: 25
type: int
tips: size in px between every row
```
```javascript
name: cascadeAnimations
default: true
type: boolean
tips: if false all animations will be executed at same time
```
```javascript
name: cascadeDuration
default: 880
type: int
tips: time in ms which defined the time that will take to execute all the animations on any process
```
```javascript
name: transition
default: 'transform 375ms ease-out, opacity 375ms ease-out'
type: css valid value
tips: transition defined on every item
```
