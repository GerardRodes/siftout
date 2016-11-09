const
DEFAULT_OPTIONS = {
  gridElement: document.getElementById('siftout-grid'),
  filterElement: document.getElementById('siftout-filter'),
  itemSelector: '.siftout-item',
  columns: 4,
  columnGap: 50,
  rowGap: 50,
  transition: '375ms ease-out'
},
GRID_CSS = {
  position: 'relative',
  perspective: '1000px',
  perspectiveOrigin: 'center center',
  backfaceVisibility: 'hidden'
},
HIDDEN_CSS = {
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateZ(-1000px)'
},
VISIBLE_CSS = {
  opacity: 1,
  pointerEvents: 'auto',
  transform: 'translateZ(0px)'
}

let ITEM_CSS = {
  lineHeight: 0,
  display: 'inline-block',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'auto',
  transform: 'translateZ(0px)'
}


export default class Siftout {
  
  constructor(customOptions) {
    this.opt = Object.assign(DEFAULT_OPTIONS, customOptions)
    this.items = null
    this.matrix = null
    this.colWidth = ((this.opt.gridElement.offsetWidth - (this.opt.columnGap * (this.opt.columns - 1))) / this.opt.columns)
    this.rowsMaxHeights = {}
    
    ITEM_CSS.maxWidth = this.colWidth + 'px'
    ITEM_CSS.width = this.colWidth + 'px'
    ITEM_CSS.transition = this.opt.transition

    this.init()
  }

  init(){
    this.loadItems()
    this.applyStyles(this.opt.gridElement, GRID_CSS)
    this.applyStyles(this.items, ITEM_CSS)
    this.buildMatrix()
    this.arrangeItems()
    this.bindFilters()
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
      this.applyStyles(hiddenItems, HIDDEN_CSS)
    } else {
      items = this.items
    }
    
    Array.from(items).forEach(item => item.classList.add('active'))
    
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
        item.item.style['transform'] = 'translateX('+(iCol * this.colWidth + iCol * this.opt.columnGap)+'px) translateY('+YPos+'px)'
      })
      this.applyStyles(col.map(item => item.item), VISIBLE_CSS)
    })
    
    this.updateGridHeight()
  }
  
  applyStyles(items, css){
    if (items.length === undefined)
      items = Array(items)
    
    Array.from(items).forEach((item, i) => {
      for (let prop in css) {
        if (prop !== 'transform' || item.style[prop] === '') {
          item.style[prop] = css[prop]
        } else {
          let newFilters = this.splitTransform(css.transform),
              oldFilters = this.splitTransform(item.style.transform)
              
          let uneditedFilters = oldFilters.filter(oldFilter =>
            newFilters.filter(newFilter =>
              oldFilter.substr(0, oldFilter.indexOf('(')) === newFilter.substr(0, newFilter.indexOf('('))
            ).length === 0
          )
          
          let finalFilters = newFilters.reduce((a, b) => a+' '+b)
          if (uneditedFilters.length > 0) {
            finalFilters += ' '+uneditedFilters.reduce((a, b) => a+' '+b)
          }
          
          if(item.style.transform != finalFilters){
            item.style.transform = finalFilters
          }
          
        }
      }
    })
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
      
    let itemIdOnRow = iRow * this.opt.columns
    
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
    let filterItems = Array.from(this.opt.filterElement.querySelectorAll('[data-group]'))
    
    filterItems.forEach(item => {
      item.addEventListener('click', e => {
        filterItems.forEach(item => item.classList.remove('active'))
        e.target.classList.add('active')
        e.preventDefault()
        let groups = e.target.getAttribute('data-group').split(',').map(group => group.trim())
        this.buildMatrix(groups)
        this.arrangeItems()
      })
    })
  }
  
}