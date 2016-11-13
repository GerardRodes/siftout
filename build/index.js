(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Siftout", [], factory);
	else if(typeof exports === 'object')
		exports["Siftout"] = factory();
	else
		root["Siftout"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); ////////////////////////////////////
	/*--Thanks Microsoft--*/
	/**/
	/**/
	/**/
	/**/

	__webpack_require__(1);

	__webpack_require__(38);

	__webpack_require__(59);

	__webpack_require__(72);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	////////////////////////////////////

	var DEFAULT_OPTIONS = {
	  gridElement: document.getElementById('siftout-grid'),
	  filterElement: document.getElementById('siftout-filter'),
	  itemSelector: '.siftout-item',
	  itemWidth: undefined, //if provided #columns will be ignored and a custom number of columns will be set from itemWidth, columnGap and the size of the grid
	  columns: 4,
	  columnGap: 25, //only auto if itemWidth defined,
	  rows: undefined,
	  rowGap: 25,
	  cascadeAnimations: true,
	  cascadeDuration: 880, //ms
	  transition: 'transform 375ms ease-out, opacity 375ms ease-out'
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
	};

	var ITEM_CSS = {
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
	  // transition: 'height .68s ease-out',
	  overflow: 'hidden'
	};

	module.exports = function () {
	  function Siftout(customOptions) {
	    _classCallCheck(this, Siftout);

	    this.opt = undefined;
	    this.items = null;
	    this.matrix = null;
	    this.rowsMaxHeights = {};

	    this.init(customOptions);
	  }

	  _createClass(Siftout, [{
	    key: 'init',
	    value: function init(customOptions) {
	      if (customOptions !== undefined) {
	        this.setOptions(customOptions);
	      }
	      this.detectBrowser();
	      this.loadItems();
	      this.setColumnWidth();
	      this.setVariableCSS();
	      this.applyStyles(this.opt.gridElement, GRID_CSS, true);
	      this.applyStyles(this.items, ITEM_CSS, true);
	      this.buildMatrix();
	      this.arrangeItems();
	      this.bindFilters();
	    }
	  }, {
	    key: 'setOptions',
	    value: function setOptions(newOptions) {
	      var baseOptions = this.opt === undefined ? DEFAULT_OPTIONS : this.opt;
	      this.opt = Object.assign(baseOptions, newOptions);
	    }
	  }, {
	    key: 'setColumnWidth',
	    value: function setColumnWidth() {
	      if (this.opt.itemWidth !== undefined) {
	        var gridWidth = this.opt.gridElement.offsetWidth,
	            possibleColumns = Math.floor(gridWidth / this.opt.itemWidth);

	        if (this.opt.columnGap === 'auto' && possibleColumns > 1) {
	          if (this.opt.rows === undefined) {
	            possibleColumns = possibleColumns > this.items.length ? this.items.length : possibleColumns;
	          } else {
	            possibleColumns = Math.floor(this.items.length / this.opt.rows);
	          }
	          this.opt.columnGap = (gridWidth - possibleColumns * this.opt.itemWidth) / (possibleColumns - 1);
	        } else {
	          var hypotheticalWidth = (possibleColumns - 1) * this.opt.columnGap + this.opt.itemWidth * possibleColumns;

	          while (hypotheticalWidth > gridWidth) {
	            possibleColumns -= 1;
	            hypotheticalWidth = (possibleColumns - 1) * this.opt.columnGap + this.opt.itemWidth * possibleColumns;
	          }
	        }

	        this.opt.colWidth = this.opt.itemWidth;
	        this.opt.columns = possibleColumns;
	        console.log('possibleColumns: ', possibleColumns);
	      } else {
	        this.opt.colWidth = (this.opt.gridElement.offsetWidth - this.opt.columnGap * (this.opt.columns - 1)) / this.opt.columns;
	      }
	    }
	  }, {
	    key: 'setVariableCSS',
	    value: function setVariableCSS() {
	      ITEM_CSS.maxWidth = this.opt.colWidth + 'px';
	      ITEM_CSS.width = this.opt.colWidth + 'px';
	      ITEM_CSS.transition = this.opt.transition;

	      if (this.browser.prefix) {
	        ITEM_CSS[this.customBrowserAttr('transition')] = ITEM_CSS.transition;
	        ITEM_CSS[this.customBrowserAttr('transform')] = ITEM_CSS.transform;

	        GRID_CSS[this.customBrowserAttr('transition')] = GRID_CSS.transition;
	        GRID_CSS[this.customBrowserAttr('perspective')] = GRID_CSS.perspective;
	        GRID_CSS[this.customBrowserAttr('perspectiveOrigin')] = GRID_CSS.perspectiveOrigin;
	        GRID_CSS[this.customBrowserAttr('backfaceVisibility')] = GRID_CSS.backfaceVisibility;
	      }
	    }
	  }, {
	    key: 'loadItems',
	    value: function loadItems() {
	      this.items = this.opt.gridElement.querySelectorAll(this.opt.itemSelector);
	    }
	  }, {
	    key: 'buildMatrix',
	    value: function buildMatrix(groups) {
	      console.dir(this.opt);
	      this.matrix = Array.from(Array(this.opt.columns)).map(function (col) {
	        return [];
	      });
	      var items = null;
	      Array.from(this.items).forEach(function (item) {
	        return item.classList.remove('active');
	      });

	      if (groups !== undefined) {
	        items = Array.from(this.items).filter(function (item) {
	          var itemGroups = item.getAttribute('data-group').split(',').map(function (group) {
	            return group.trim();
	          }),
	              commonGroups = itemGroups.filter(function (itemGroup) {
	            return groups.indexOf(itemGroup) != -1;
	          });

	          return commonGroups.length > 0;
	        });

	        var hiddenItems = Array.from(this.items).filter(function (item) {
	          return items.indexOf(item) == -1;
	        });
	        if (hiddenItems.length > 0) this.applyStyles(hiddenItems, HIDDEN_CSS);
	      } else {
	        items = this.items;
	      }

	      Array.from(items).forEach(function (item) {
	        return item.classList.add('active');
	      });
	      this.activeItems = items.length;

	      for (var i in items) {
	        if (!isNaN(i)) {
	          this.matrix[i % this.opt.columns].push({
	            item: items[i],
	            id: i
	          });
	        }
	      }
	    }
	  }, {
	    key: 'arrangeItems',
	    value: function arrangeItems() {
	      var _this = this;

	      this.rowsMaxHeights = {};

	      var animationTimerMultiplier = this.opt.cascadeDuration / this.activeItems,
	          animationQueue = [];

	      this.matrix.forEach(function (col, iCol) {
	        col.forEach(function (item, iItem) {
	          var itemId = item.id,
	              YPos = 0,
	              done = false;

	          while (!done) {
	            var prevHeight = _this.prevRowMaxHeight(itemId);

	            YPos += prevHeight;
	            if (itemId >= _this.opt.columns) {
	              YPos += _this.opt.rowGap;
	            }

	            itemId -= _this.opt.columns;

	            if (!prevHeight > 0) {
	              done = true;
	            }
	          }
	          animationQueue.push({
	            item: item.item,
	            active: item.item.classList.contains('active'),
	            css: {
	              transform: 'translateX(' + (iCol * _this.opt.colWidth + iCol * _this.opt.columnGap) + 'px) translateY(' + YPos + 'px)'
	            }
	          });
	        });
	      });

	      this.updateGridHeight();
	      var alreadyActive = animationQueue.filter(function (bundle) {
	        return bundle.active;
	      }),
	          notActive = animationQueue.filter(function (bundle) {
	        return !bundle.active;
	      });
	      this.applyStyles(alreadyActive, 'queue');
	      (function (_main, notActive) {
	        setTimeout(function () {
	          _main.applyStyles(notActive, 'queue');
	        }, _main.opt.cascadeDuration);
	      })(this, notActive);
	      this.applyStyles(animationQueue.map(function (bundle) {
	        return bundle.item;
	      }), VISIBLE_CSS);
	    }
	  }, {
	    key: 'applyStyles',
	    value: function applyStyles(items, css, instant, animationTimerMultiplier) {
	      var _this2 = this;

	      instant = instant === undefined ? false : instant;

	      if (items.length === undefined) items = Array(items);

	      animationTimerMultiplier = animationTimerMultiplier === undefined ? this.opt.cascadeDuration / items.length : animationTimerMultiplier;

	      Array.from(items).forEach(function (item, i) {
	        if (instant || !_this2.opt.cascadeAnimations) {
	          _this2.editStyle(item, css);
	        } else {
	          var styles = undefined,
	              target = undefined;
	          if (css === 'queue') {
	            styles = item.css;
	            target = item.item;
	          } else {
	            styles = css;
	            target = item;
	          }

	          (function (_main, target, styles, i, animationTimerMultiplier) {
	            setTimeout(function () {
	              _main.editStyle(target, styles);
	            }, animationTimerMultiplier * i);
	          })(_this2, target, styles, i, animationTimerMultiplier);
	        }
	      });
	    }
	  }, {
	    key: 'editStyle',
	    value: function editStyle(item, css) {
	      var _this3 = this;

	      for (var prop in css) {
	        if (prop !== 'transform' || item.style[prop] === '') {
	          item.style[prop] = css[prop];
	        } else {
	          (function () {

	            var newFilters = _this3.splitTransform(css.transform),
	                oldFilters = _this3.splitTransform(item.style.transform),
	                finalFilters = undefined;

	            var uneditedFilters = oldFilters.filter(function (oldFilter) {
	              return newFilters.filter(function (newFilter) {
	                return oldFilter.substr(0, oldFilter.indexOf('(')) === newFilter.substr(0, newFilter.indexOf('('));
	              }).length === 0;
	            });

	            finalFilters = newFilters.reduce(function (a, b) {
	              return a + ' ' + b;
	            });
	            if (uneditedFilters.length > 0) {
	              finalFilters += ' ' + uneditedFilters.reduce(function (a, b) {
	                return a + ' ' + b;
	              });
	            }

	            if (item.style.transform != finalFilters) {
	              if (_this3.browser.prefix) {
	                item.style[_this3.customBrowserAttr('transform')] = finalFilters;
	              }
	              //checking if custom attributes had apply
	              if (item.style.transform != finalFilters) {
	                item.style.transform = finalFilters;
	              }
	            }
	          })();
	        }
	      }
	    }
	  }, {
	    key: 'splitTransform',
	    value: function splitTransform(string) {
	      return string.split(/[)] /g).map(function (string) {
	        return string.trim() + (string.slice(-1) != ')' ? ')' : '');
	      });
	    }
	  }, {
	    key: 'prevRowMaxHeight',
	    value: function prevRowMaxHeight(itemId) {
	      var iRow = Math.floor(parseInt(itemId) / this.opt.columns);

	      if (iRow === 0) {
	        return 0;
	      } else {
	        iRow -= 1;
	      }

	      if (this.rowsMaxHeights[iRow] === undefined) {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = Array(this.opt.columns).keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var i = _step.value;

	            if (this.matrix[i][iRow] !== undefined) {
	              if (this.rowsMaxHeights[iRow] === undefined) {
	                this.rowsMaxHeights[iRow] = this.matrix[i][iRow].item.offsetHeight;
	              } else if (this.matrix[i][iRow].item.offsetHeight > this.rowsMaxHeights[iRow]) {
	                this.rowsMaxHeights[iRow] = this.matrix[i][iRow].item.offsetHeight;
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }

	      return this.rowsMaxHeights[iRow];
	    }
	  }, {
	    key: 'updateGridHeight',
	    value: function updateGridHeight() {
	      var highestCol = Array.from(this.matrix).reduce(function (a, b) {
	        if (a.length === b.length) {
	          var aItemsHeight = a.reduce(function (total, val) {
	            return total + val.item.offsetHeight;
	          }, 0),
	              bItemsHeight = b.reduce(function (total, val) {
	            return total + val.item.offsetHeight;
	          }, 0);

	          return aItemsHeight > bItemsHeight ? a : b;
	        } else {
	          return a.length > b.length ? a : b;
	        }
	      });

	      var height = highestCol.slice(-1)[0].item.offsetHeight;
	      for (var iRow in this.rowsMaxHeights) {
	        height += this.rowsMaxHeights[iRow];
	      }

	      var actualHeight = this.opt.gridElement.style.height ? parseInt(this.opt.gridElement.style.height.slice(0, -2)) : 0,
	          newHeight = height + (highestCol.length - 1) * this.opt.rowGap;

	      if (newHeight >= actualHeight) {
	        this.opt.gridElement.style.height = newHeight + 'px';
	      } else {
	        ;(function (_main) {
	          setTimeout(function () {
	            _main.opt.gridElement.style.height = newHeight + 'px';
	          }, _main.opt.cascadeDuration);
	        })(this);
	      }
	    }
	  }, {
	    key: 'bindFilters',
	    value: function bindFilters() {
	      var _this4 = this;

	      var filterItems = Array.from(this.opt.filterElement.querySelectorAll('[data-group]')),
	          timeouts = [];

	      filterItems.forEach(function (filter) {

	        filter.addEventListener('click', function (e) {
	          filterItems.forEach(function (filter) {
	            return filter.classList.remove('active');
	          });
	          e.target.classList.add('active');
	          e.preventDefault();
	          var groups = e.target.getAttribute('data-group').split(',').map(function (group) {
	            return group.trim();
	          });
	          _this4.buildMatrix(groups);
	          _this4.arrangeItems();
	        });

	        //css optimization, tells the browser that some transformations are going to be asked      
	        filter.addEventListener('mouseover', function (e) {
	          Array.from(_this4.items).forEach(function (item) {
	            return item.style.willChange = 'transform, opacity';
	          });
	          timeouts.forEach(function (to) {
	            return clearTimeout(to);
	          });
	        });

	        filter.addEventListener('mouseout', function (e) {
	          timeouts.push(setTimeout(function () {
	            return Array.from(_this4.items).forEach(function (item) {
	              return item.style.willChange = 'auto';
	            });
	          }, 1000));
	        });
	      });
	    }
	  }, {
	    key: 'detectBrowser',
	    value: function detectBrowser() {
	      this.browser = {};

	      if (!!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
	        this.browser.name = 'opera';
	      } else if (typeof InstallTrigger !== 'undefined') {
	        this.browser.name = 'firefox';
	      } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || function (p) {
	        return p.toString() === "[object SafariRemoteNotification]";
	      }(!window['safari'] || safari.pushNotification)) {
	        this.browser.name = 'safari';
	      } else if ( /*@cc_on!@*/false || !!document.documentMode) {
	        this.browser.name = 'ie';
	      } else if (!!window.StyleMedia) {
	        this.browser.name = 'edge';
	      } else if (!!window.chrome && !!window.chrome.webstore) {
	        this.browser.name = 'chrome';
	      }

	      switch (this.browser.name) {
	        case 'chrome':
	        case 'safari':
	        case 'opera':
	          this.browser.prefix = 'webkit';
	          break;
	        case 'firefox':
	          this.browser.prefix = 'Moz';
	          break;
	        case 'ie':
	        case 'edge':
	          this.browser.prefix = 'ms';
	          break;
	        default:
	          this.browser.prefix = false;
	          break;
	      }
	    }
	  }, {
	    key: 'customBrowserAttr',
	    value: function customBrowserAttr(attr) {
	      return this.browser.prefix ? this.browser.prefix + attr.charAt(0).toUpperCase() + attr.slice(1) : false;
	    }
	  }]);

	  return Siftout;
	}();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	module.exports = __webpack_require__(5).Object.assign;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(3);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(21)});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(4)
	  , core      = __webpack_require__(5)
	  , hide      = __webpack_require__(6)
	  , redefine  = __webpack_require__(16)
	  , ctx       = __webpack_require__(19)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 4 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(7)
	  , createDesc = __webpack_require__(15);
	module.exports = __webpack_require__(11) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(8)
	  , IE8_DOM_DEFINE = __webpack_require__(10)
	  , toPrimitive    = __webpack_require__(14)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(11) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(9);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(11) && !__webpack_require__(12)(function(){
	  return Object.defineProperty(__webpack_require__(13)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(12)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(9)
	  , document = __webpack_require__(4).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(9);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(4)
	  , hide      = __webpack_require__(6)
	  , has       = __webpack_require__(17)
	  , SRC       = __webpack_require__(18)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(5).inspectSource = function(it){
	  return $toString.call(it);
	};

	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 17 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(20);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(22)
	  , gOPS     = __webpack_require__(35)
	  , pIE      = __webpack_require__(36)
	  , toObject = __webpack_require__(37)
	  , IObject  = __webpack_require__(25)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(12)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(23)
	  , enumBugKeys = __webpack_require__(34);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(17)
	  , toIObject    = __webpack_require__(24)
	  , arrayIndexOf = __webpack_require__(28)(false)
	  , IE_PROTO     = __webpack_require__(32)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(25)
	  , defined = __webpack_require__(27);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(26);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(24)
	  , toLength  = __webpack_require__(29)
	  , toIndex   = __webpack_require__(31);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(30)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(30)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(33)('keys')
	  , uid    = __webpack_require__(18);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 35 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 36 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(27);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(39);
	__webpack_require__(55);
	__webpack_require__(57);
	__webpack_require__(58);
	module.exports = __webpack_require__(5).Symbol;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(4)
	  , has            = __webpack_require__(17)
	  , DESCRIPTORS    = __webpack_require__(11)
	  , $export        = __webpack_require__(3)
	  , redefine       = __webpack_require__(16)
	  , META           = __webpack_require__(40).KEY
	  , $fails         = __webpack_require__(12)
	  , shared         = __webpack_require__(33)
	  , setToStringTag = __webpack_require__(41)
	  , uid            = __webpack_require__(18)
	  , wks            = __webpack_require__(42)
	  , wksExt         = __webpack_require__(43)
	  , wksDefine      = __webpack_require__(44)
	  , keyOf          = __webpack_require__(46)
	  , enumKeys       = __webpack_require__(47)
	  , isArray        = __webpack_require__(48)
	  , anObject       = __webpack_require__(8)
	  , toIObject      = __webpack_require__(24)
	  , toPrimitive    = __webpack_require__(14)
	  , createDesc     = __webpack_require__(15)
	  , _create        = __webpack_require__(49)
	  , gOPNExt        = __webpack_require__(52)
	  , $GOPD          = __webpack_require__(54)
	  , $DP            = __webpack_require__(7)
	  , $keys          = __webpack_require__(22)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(53).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(36).f  = $propertyIsEnumerable;
	  __webpack_require__(35).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(45)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(6)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(18)('meta')
	  , isObject = __webpack_require__(9)
	  , has      = __webpack_require__(17)
	  , setDesc  = __webpack_require__(7).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(12)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(7).f
	  , has = __webpack_require__(17)
	  , TAG = __webpack_require__(42)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(33)('wks')
	  , uid        = __webpack_require__(18)
	  , Symbol     = __webpack_require__(4).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(42);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(4)
	  , core           = __webpack_require__(5)
	  , LIBRARY        = __webpack_require__(45)
	  , wksExt         = __webpack_require__(43)
	  , defineProperty = __webpack_require__(7).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = false;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(22)
	  , toIObject = __webpack_require__(24);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(22)
	  , gOPS    = __webpack_require__(35)
	  , pIE     = __webpack_require__(36);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(26);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(8)
	  , dPs         = __webpack_require__(50)
	  , enumBugKeys = __webpack_require__(34)
	  , IE_PROTO    = __webpack_require__(32)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(13)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(51).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(7)
	  , anObject = __webpack_require__(8)
	  , getKeys  = __webpack_require__(22);

	module.exports = __webpack_require__(11) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4).document && document.documentElement;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(24)
	  , gOPN      = __webpack_require__(53).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(23)
	  , hiddenKeys = __webpack_require__(34).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(36)
	  , createDesc     = __webpack_require__(15)
	  , toIObject      = __webpack_require__(24)
	  , toPrimitive    = __webpack_require__(14)
	  , has            = __webpack_require__(17)
	  , IE8_DOM_DEFINE = __webpack_require__(10)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(11) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(56)
	  , test    = {};
	test[__webpack_require__(42)('toStringTag')] = 'z';
	if(test + '' != '[object z]'){
	  __webpack_require__(16)(Object.prototype, 'toString', function toString(){
	    return '[object ' + classof(this) + ']';
	  }, true);
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(26)
	  , TAG = __webpack_require__(42)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(44)('asyncIterator');

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(44)('observable');

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	__webpack_require__(66);
	module.exports = __webpack_require__(5).Array.from;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(61)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(62)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(30)
	  , defined   = __webpack_require__(27);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(45)
	  , $export        = __webpack_require__(3)
	  , redefine       = __webpack_require__(16)
	  , hide           = __webpack_require__(6)
	  , has            = __webpack_require__(17)
	  , Iterators      = __webpack_require__(63)
	  , $iterCreate    = __webpack_require__(64)
	  , setToStringTag = __webpack_require__(41)
	  , getPrototypeOf = __webpack_require__(65)
	  , ITERATOR       = __webpack_require__(42)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(49)
	  , descriptor     = __webpack_require__(15)
	  , setToStringTag = __webpack_require__(41)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(6)(IteratorPrototype, __webpack_require__(42)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(17)
	  , toObject    = __webpack_require__(37)
	  , IE_PROTO    = __webpack_require__(32)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(19)
	  , $export        = __webpack_require__(3)
	  , toObject       = __webpack_require__(37)
	  , call           = __webpack_require__(67)
	  , isArrayIter    = __webpack_require__(68)
	  , toLength       = __webpack_require__(29)
	  , createProperty = __webpack_require__(69)
	  , getIterFn      = __webpack_require__(70);

	$export($export.S + $export.F * !__webpack_require__(71)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(8);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(63)
	  , ITERATOR   = __webpack_require__(42)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(7)
	  , createDesc      = __webpack_require__(15);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(56)
	  , ITERATOR  = __webpack_require__(42)('iterator')
	  , Iterators = __webpack_require__(63);
	module.exports = __webpack_require__(5).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(42)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(73);
	module.exports = __webpack_require__(5).Array.keys;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(74)
	  , step             = __webpack_require__(75)
	  , Iterators        = __webpack_require__(63)
	  , toIObject        = __webpack_require__(24);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(62)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = __webpack_require__(42)('unscopables')
	  , ArrayProto  = Array.prototype;
	if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(6)(ArrayProto, UNSCOPABLES, {});
	module.exports = function(key){
	  ArrayProto[UNSCOPABLES][key] = true;
	};

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }
/******/ ])
});
;