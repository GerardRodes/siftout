////////////////////////////////////
/*--Thanks Microsoft--*/
/**/import 'core-js/fn/object/assign'
/**/import 'core-js/fn/symbol/'
/**/import 'core-js/fn/array/from'
/**/import 'core-js/fn/array/keys'
////////////////////////////////////

const
DEFAULT_OPTIONS = {
  gridElement: document.getElementById('siftout-grid'),
  filterElement: document.getElementById('siftout-filter'),
  itemSelector: '.siftout-item',
  itemWidth: undefined, //if provided #columns will be ignored and a custom number of columns will be set from itemWidth, columnGap and the size of the grid
  columns: 4,
  columnGap: 25,
  rowGap: 25,
  cascadeAnimations: true,
  cascadeDuration: 880, //ms
  transition: '375ms ease-out'
},
HIDDEN_CSS = {
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateZ(-1000px)',
  zIndex: 0
},
VISIBLE_CSS = {
  opacity: 1,
  pointerEvents: 'auto',
  transform: 'translateZ(0px)',
  zIndex: 1
}

let ITEM_CSS = {
  lineHeight: 0,
  display: 'inline-block',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'auto',
  transform: 'translateZ(0px)'
},
GRID_CSS = {
  position: 'relative',
  perspective: '1000px',
  perspectiveOrigin: 'center center',
  backfaceVisibility: 'hidden',
  transition: '.64s linear'
}


module.exports = class Siftout {
  
  constructor(customOptions) {
    this.opt = Object.assign(DEFAULT_OPTIONS, customOptions)
    this.items = null
    this.matrix = null
    this.rowsMaxHeights = {}

    this.init()
  }

  init(){
    this.detectBrowser()
    this.setColumnWidth()
    this.setVariableCSS()
    this.loadItems()
    this.applyStyles(this.opt.gridElement, GRID_CSS, true)
    this.applyStyles(this.items, ITEM_CSS, true)
    this.buildMatrix()
    this.arrangeItems()
    this.bindFilters()
  }
  
  setColumnWidth(){
    if (this.opt.itemWidth !== undefined){
      let gridWidth = this.opt.gridElement.offsetWidth,
          possibleColumns = Math.floor(gridWidth / this.opt.itemWidth),
          hypotheticalWidth = ((possibleColumns - 1) * this.opt.columnGap) + (this.opt.itemWidth * possibleColumns)
      
      while(hypotheticalWidth > gridWidth){
        possibleColumns -= 1
        hypotheticalWidth = ((possibleColumns - 1) * this.opt.columnGap) + (this.opt.itemWidth * possibleColumns)
      }
      
      this.colWidth = this.opt.itemWidth
      this.opt.columns = possibleColumns
    } else {
      this.colWidth = ((this.opt.gridElement.offsetWidth - (this.opt.columnGap * (this.opt.columns - 1))) / this.opt.columns)
    }
  }
  
  setVariableCSS(){
    ITEM_CSS.maxWidth = this.colWidth + 'px'
    ITEM_CSS.width = this.colWidth + 'px'
    ITEM_CSS.transition = this.opt.transition
    
    if(this.browser.prefix){
      ITEM_CSS[this.customBrowserAttr('transition')] = ITEM_CSS.transition
      ITEM_CSS[this.customBrowserAttr('transform')] = ITEM_CSS.transform
      
      GRID_CSS[this.customBrowserAttr('transition')] = GRID_CSS.transition
      GRID_CSS[this.customBrowserAttr('perspective')] = GRID_CSS.perspective
      GRID_CSS[this.customBrowserAttr('perspectiveOrigin')] = GRID_CSS.perspectiveOrigin
      GRID_CSS[this.customBrowserAttr('backfaceVisibility')] = GRID_CSS.backfaceVisibility
    }
  }
  
  loadItems(){
    this.items = this.opt.gridElement.querySelectorAll(this.opt.itemSelector)
  }
  
  buildMatrix(groups){
    this.matrix = Array.from(Array(this.opt.columns)).map(col => [])
    let items = null
    Array.from(this.items).forEach(item => item.classList.remove('active'))
    
    if (groups !== undefined){
      items = Array.from(this.items).filter(item => {
        let itemGroups = item.getAttribute('data-group').split(',').map(group => group.trim()),
            commonGroups = itemGroups.filter(itemGroup => groups.indexOf(itemGroup) != -1)
            
        return commonGroups.length > 0
      })
      
      let hiddenItems = Array.from(this.items).filter(item => items.indexOf(item) == -1)
      if(hiddenItems.length > 0)
        this.applyStyles(hiddenItems, HIDDEN_CSS)
    } else {
      items = this.items
    }
    
    Array.from(items).forEach(item => item.classList.add('active'))
    this.activeItems = items.length
    
    for(let i in items){
      if (!isNaN(i)) {
        this.matrix[i % this.opt.columns].push({
          item:items[i],
          id: i
        })
      }
    }
  }
  
  arrangeItems(){
    this.rowsMaxHeights = {}
    
    let animationTimerMultiplier = this.opt.cascadeDuration / this.activeItems,
        animationQueue = []
    
    this.matrix.forEach((col, iCol) => {
      col.forEach((item, iItem) => {
        let itemId = item.id,
            YPos = 0,
            done = false
        
        while (!done) {
          let prevHeight = this.prevRowMaxHeight(itemId)
          
          YPos += prevHeight
          if (itemId >= this.opt.columns){
            YPos += this.opt.rowGap
          }
          
          itemId -= this.opt.columns
          
          if (!prevHeight > 0){
            done = true
          }
        }
        // this.applyStyles(item.item,{
        //   'transform': 'translateX('+(iCol * this.colWidth + iCol * this.opt.columnGap)+'px) translateY('+YPos+'px)'
        // }, false, animationTimerMultiplier)
        animationQueue.push({
          item: item.item,
          active: item.item.classList.contains('active'),
          css: {
            transform: 'translateX('+(iCol * this.colWidth + iCol * this.opt.columnGap)+'px) translateY('+YPos+'px)',
          }
        })
      })
    })
    
    let alreadyActive = animationQueue.filter(bundle => bundle.active),
        notActive     = animationQueue.filter(bundle => !bundle.active)
    this.applyStyles(alreadyActive, 'queue');
    (function(_main, notActive){
      setTimeout(function(){
        _main.applyStyles(notActive, 'queue')
      }, _main.opt.cascadeDuration)
    })(this, notActive)
    this.applyStyles(animationQueue.map(bundle => bundle.item), VISIBLE_CSS)
    
    this.updateGridHeight()
  }
  
  applyStyles(items, css, instant, animationTimerMultiplier){
    instant = instant === undefined ? false : instant
    
    if (items.length === undefined)
      items = Array(items)
    
    animationTimerMultiplier = animationTimerMultiplier === undefined ? this.opt.cascadeDuration / items.length : animationTimerMultiplier
    
    Array.from(items).forEach((item, i) => {
      if(instant || !this.opt.cascadeAnimations){
        this.editStyle(item, css)
      } else {
        let styles = undefined,
            target = undefined
        if (css === 'queue'){
          styles = item.css
          target = item.item
        } else {
          styles = css
          target = item
        }
        
        (function(_main, target, styles, i, animationTimerMultiplier){
          setTimeout(function() {
            _main.editStyle(target, styles)
          }, animationTimerMultiplier * i)
        })(this, target, styles, i, animationTimerMultiplier)
      }
    })
  }
  
  editStyle(item, css){
    let finalFilters = undefined
    for (let prop in css) {
      if (prop !== 'transform' || item.style[prop] === '') {
        item.style[prop] = css[prop]
      } else {
        
        if(finalFilters === undefined){
          let newFilters = this.splitTransform(css.transform),
              oldFilters = this.splitTransform(item.style.transform)
              
          let uneditedFilters = oldFilters.filter(oldFilter =>
            newFilters.filter(newFilter =>
              oldFilter.substr(0, oldFilter.indexOf('(')) === newFilter.substr(0, newFilter.indexOf('('))
            ).length === 0
          )
          
          finalFilters = newFilters.reduce((a, b) => a+' '+b)
          if (uneditedFilters.length > 0) {
            finalFilters += ' '+uneditedFilters.reduce((a, b) => a+' '+b)
          }
        }
        
        if(item.style.transform != finalFilters){
          if(this.browser.prefix){
            item.style[this.customBrowserAttr('transform')] = finalFilters
          }
          //checking if custom attributes had apply
          if(item.style.transform != finalFilters){
            item.style.transform = finalFilters
          }
        }
      }
    }
  }
  
  splitTransform(string){
    return string.split(/[)] /g).map(string => {
       return string.trim() + ( string.slice(-1) != ')' ? ')' : '' )
    })
  }
  
  prevRowMaxHeight(itemId){
    let iRow = Math.floor(parseInt(itemId) / this.opt.columns)
    
    if (iRow === 0) {
      return 0
    } else {
      iRow -= 1
    }
    
    if (this.rowsMaxHeights[iRow] === undefined){
      for (let i of Array(this.opt.columns).keys()){
        if (this.matrix[i][iRow] !== undefined){
          if(this.rowsMaxHeights[iRow] === undefined){
            this.rowsMaxHeights[iRow] = this.matrix[i][iRow].item.offsetHeight
          } else if (this.matrix[i][iRow].item.offsetHeight > this.rowsMaxHeights[iRow]){
            this.rowsMaxHeights[iRow] = this.matrix[i][iRow].item.offsetHeight
          }
        }
      }
    }
    
    return this.rowsMaxHeights[iRow]
  }
  
  updateGridHeight(){
    let highestCol = Array.from(this.matrix).reduce((a, b) => {
      if(a.length === b.length){
        let aItemsHeight = a.reduce((total, val) => total + val.item.offsetHeight, 0),
            bItemsHeight = b.reduce((total, val) => total + val.item.offsetHeight, 0)
        
        return aItemsHeight > bItemsHeight ? a : b
      } else {
        return a.length > b.length ? a : b
      }
    })
    
    let height = highestCol.slice(-1)[0].item.offsetHeight
    for (let iRow in this.rowsMaxHeights){
      height += this.rowsMaxHeights[iRow]
    }
    
    this.opt.gridElement.style.height = height + ((highestCol.length - 1) * this.opt.rowGap) + 'px'
  }
  
  bindFilters(){
    let filterItems = Array.from(this.opt.filterElement.querySelectorAll('[data-group]')),
        timeouts = []
    
    filterItems.forEach(filter => {
      
      filter.addEventListener('click', e => {
        filterItems.forEach(filter => filter.classList.remove('active'))
        e.target.classList.add('active')
        e.preventDefault()
        let groups = e.target.getAttribute('data-group').split(',').map(group => group.trim())
        this.buildMatrix(groups)
        this.arrangeItems()
      })
      
      //css optimization, tells the browser that some transformations are going to be asked      
      filter.addEventListener('mouseover', e => {
        Array.from(this.items).forEach(item => item.style.willChange = 'transform, opacity')
        timeouts.forEach(to => clearTimeout(to))
      })
      
      filter.addEventListener('mouseout', e => {
        timeouts.push(setTimeout(() => Array.from(this.items).forEach(item => item.style.willChange = 'auto'), 1000))
      })
      
    })
  }
  
  detectBrowser(){
    this.browser = {}
    
    if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0){
      this.browser.name = 'opera'
    } else if (typeof InstallTrigger !== 'undefined'){
      this.browser.name = 'firefox'
    } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)){
      this.browser.name = 'safari'
    } else if (/*@cc_on!@*/false || !!document.documentMode){
      this.browser.name = 'ie'
    } else if (!!window.StyleMedia){
      this.browser.name = 'edge'
    } else if (!!window.chrome && !!window.chrome.webstore){
      this.browser.name = 'chrome'
    }
    
    switch(this.browser.name) {
      case 'chrome':
      case 'safari':
      case 'opera':
        this.browser.prefix = 'webkit'
        break;
      case 'firefox':
        this.browser.prefix = 'Moz'
        break;
      case 'ie':
      case 'edge':
        this.browser.prefix = 'ms'
        break;
      default:
        this.browser.prefix = false
        break;
    }
  }
  
  customBrowserAttr(attr){
    return this.browser.prefix ? this.browser.prefix + attr.charAt(0).toUpperCase() + attr.slice(1) : false
  }
  
}