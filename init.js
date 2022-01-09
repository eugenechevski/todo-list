/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "popperGenerator": () => (/* binding */ popperGenerator),
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__["default"])
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/validateModifiers.js */ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js");
/* harmony import */ var _utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/uniqueBy.js */ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");














var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (true) {
          var modifiers = (0,_utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__["default"])([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          (0,_utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__["default"])(modifiers);

          if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.options.placement) === _enums_js__WEBPACK_IMPORTED_MODULE_7__.auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__["default"])(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (true) {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (true) {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (true) {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");


function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");







function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element);

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");



function getViewportRect(element) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "isShadowRoot": () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "top": () => (/* binding */ top),
/* harmony export */   "bottom": () => (/* binding */ bottom),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "basePlacements": () => (/* binding */ basePlacements),
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "end": () => (/* binding */ end),
/* harmony export */   "clippingParents": () => (/* binding */ clippingParents),
/* harmony export */   "viewport": () => (/* binding */ viewport),
/* harmony export */   "popper": () => (/* binding */ popper),
/* harmony export */   "reference": () => (/* binding */ reference),
/* harmony export */   "variationPlacements": () => (/* binding */ variationPlacements),
/* harmony export */   "placements": () => (/* binding */ placements),
/* harmony export */   "beforeRead": () => (/* binding */ beforeRead),
/* harmony export */   "read": () => (/* binding */ read),
/* harmony export */   "afterRead": () => (/* binding */ afterRead),
/* harmony export */   "beforeMain": () => (/* binding */ beforeMain),
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "afterMain": () => (/* binding */ afterMain),
/* harmony export */   "beforeWrite": () => (/* binding */ beforeWrite),
/* harmony export */   "write": () => (/* binding */ write),
/* harmony export */   "afterWrite": () => (/* binding */ afterWrite),
/* harmony export */   "modifierPhases": () => (/* binding */ modifierPhases)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   "afterRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   "afterWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   "auto": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   "basePlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   "beforeMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   "beforeRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   "beforeWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   "bottom": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   "clippingParents": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   "end": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   "left": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   "main": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   "modifierPhases": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   "placements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   "popper": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   "read": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   "reference": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   "right": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   "start": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   "top": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   "variationPlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   "viewport": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   "write": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write),
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "createPopperBase": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   "createPopper": () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (true) {
    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__.isHTMLElement)(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.popper, arrowElement)) {
    if (true) {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapToStyles": () => (/* binding */ mapToStyles),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (true) {
    var transitionProperty = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "arrow": () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "flip": () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "hide": () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "offset": () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "distanceAndSkiddingToXY": () => (/* binding */ distanceAndSkiddingToXY),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;

    if (true) {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/format.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/format.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ format)
/* harmony export */ });
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "round": () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/uniqueBy.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniqueBy)
/* harmony export */ });
function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/validateModifiers.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ validateModifiers)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format.js */ "./node_modules/@popperjs/core/lib/utils/format.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");


var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (_enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.indexOf(modifier.phase) < 0) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + _enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "within": () => (/* binding */ within),
/* harmony export */   "withinMaxClamp": () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js ***!
  \****************************************************************/
/***/ (function(module) {

/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";const t="transitionend",e=t=>{let e=t.getAttribute("data-bs-target");if(!e||"#"===e){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&"#"!==i?i.trim():null}return e},i=t=>{const i=e(t);return i&&document.querySelector(i)?i:null},n=t=>{const i=e(t);return i?document.querySelector(i):null},s=e=>{e.dispatchEvent(new Event(t))},o=t=>!(!t||"object"!=typeof t)&&(void 0!==t.jquery&&(t=t[0]),void 0!==t.nodeType),r=t=>o(t)?t.jquery?t[0]:t:"string"==typeof t&&t.length>0?document.querySelector(t):null,a=(t,e,i)=>{Object.keys(i).forEach((n=>{const s=i[n],r=e[n],a=r&&o(r)?"element":null==(l=r)?`${l}`:{}.toString.call(l).match(/\s([a-z]+)/i)[1].toLowerCase();var l;if(!new RegExp(s).test(a))throw new TypeError(`${t.toUpperCase()}: Option "${n}" provided type "${a}" but expected type "${s}".`)}))},l=t=>!(!o(t)||0===t.getClientRects().length)&&"visible"===getComputedStyle(t).getPropertyValue("visibility"),c=t=>!t||t.nodeType!==Node.ELEMENT_NODE||!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")),h=t=>{if(!document.documentElement.attachShadow)return null;if("function"==typeof t.getRootNode){const e=t.getRootNode();return e instanceof ShadowRoot?e:null}return t instanceof ShadowRoot?t:t.parentNode?h(t.parentNode):null},d=()=>{},u=t=>{t.offsetHeight},f=()=>{const{jQuery:t}=window;return t&&!document.body.hasAttribute("data-bs-no-jquery")?t:null},p=[],m=()=>"rtl"===document.documentElement.dir,g=t=>{var e;e=()=>{const e=f();if(e){const i=t.NAME,n=e.fn[i];e.fn[i]=t.jQueryInterface,e.fn[i].Constructor=t,e.fn[i].noConflict=()=>(e.fn[i]=n,t.jQueryInterface)}},"loading"===document.readyState?(p.length||document.addEventListener("DOMContentLoaded",(()=>{p.forEach((t=>t()))})),p.push(e)):e()},_=t=>{"function"==typeof t&&t()},b=(e,i,n=!0)=>{if(!n)return void _(e);const o=(t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const n=Number.parseFloat(e),s=Number.parseFloat(i);return n||s?(e=e.split(",")[0],i=i.split(",")[0],1e3*(Number.parseFloat(e)+Number.parseFloat(i))):0})(i)+5;let r=!1;const a=({target:n})=>{n===i&&(r=!0,i.removeEventListener(t,a),_(e))};i.addEventListener(t,a),setTimeout((()=>{r||s(i)}),o)},v=(t,e,i,n)=>{let s=t.indexOf(e);if(-1===s)return t[!i&&n?t.length-1:0];const o=t.length;return s+=i?1:-1,n&&(s=(s+o)%o),t[Math.max(0,Math.min(s,o-1))]},y=/[^.]*(?=\..*)\.|.*/,w=/\..*/,E=/::\d+$/,A={};let T=1;const O={mouseenter:"mouseover",mouseleave:"mouseout"},C=/^(mouseenter|mouseleave)/i,k=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function L(t,e){return e&&`${e}::${T++}`||t.uidEvent||T++}function x(t){const e=L(t);return t.uidEvent=e,A[e]=A[e]||{},A[e]}function D(t,e,i=null){const n=Object.keys(t);for(let s=0,o=n.length;s<o;s++){const o=t[n[s]];if(o.originalHandler===e&&o.delegationSelector===i)return o}return null}function S(t,e,i){const n="string"==typeof e,s=n?i:e;let o=P(t);return k.has(o)||(o=t),[n,s,o]}function N(t,e,i,n,s){if("string"!=typeof e||!t)return;if(i||(i=n,n=null),C.test(e)){const t=t=>function(e){if(!e.relatedTarget||e.relatedTarget!==e.delegateTarget&&!e.delegateTarget.contains(e.relatedTarget))return t.call(this,e)};n?n=t(n):i=t(i)}const[o,r,a]=S(e,i,n),l=x(t),c=l[a]||(l[a]={}),h=D(c,r,o?i:null);if(h)return void(h.oneOff=h.oneOff&&s);const d=L(r,e.replace(y,"")),u=o?function(t,e,i){return function n(s){const o=t.querySelectorAll(e);for(let{target:r}=s;r&&r!==this;r=r.parentNode)for(let a=o.length;a--;)if(o[a]===r)return s.delegateTarget=r,n.oneOff&&j.off(t,s.type,e,i),i.apply(r,[s]);return null}}(t,i,n):function(t,e){return function i(n){return n.delegateTarget=t,i.oneOff&&j.off(t,n.type,e),e.apply(t,[n])}}(t,i);u.delegationSelector=o?i:null,u.originalHandler=r,u.oneOff=s,u.uidEvent=d,c[d]=u,t.addEventListener(a,u,o)}function I(t,e,i,n,s){const o=D(e[i],n,s);o&&(t.removeEventListener(i,o,Boolean(s)),delete e[i][o.uidEvent])}function P(t){return t=t.replace(w,""),O[t]||t}const j={on(t,e,i,n){N(t,e,i,n,!1)},one(t,e,i,n){N(t,e,i,n,!0)},off(t,e,i,n){if("string"!=typeof e||!t)return;const[s,o,r]=S(e,i,n),a=r!==e,l=x(t),c=e.startsWith(".");if(void 0!==o){if(!l||!l[r])return;return void I(t,l,r,o,s?i:null)}c&&Object.keys(l).forEach((i=>{!function(t,e,i,n){const s=e[i]||{};Object.keys(s).forEach((o=>{if(o.includes(n)){const n=s[o];I(t,e,i,n.originalHandler,n.delegationSelector)}}))}(t,l,i,e.slice(1))}));const h=l[r]||{};Object.keys(h).forEach((i=>{const n=i.replace(E,"");if(!a||e.includes(n)){const e=h[i];I(t,l,r,e.originalHandler,e.delegationSelector)}}))},trigger(t,e,i){if("string"!=typeof e||!t)return null;const n=f(),s=P(e),o=e!==s,r=k.has(s);let a,l=!0,c=!0,h=!1,d=null;return o&&n&&(a=n.Event(e,i),n(t).trigger(a),l=!a.isPropagationStopped(),c=!a.isImmediatePropagationStopped(),h=a.isDefaultPrevented()),r?(d=document.createEvent("HTMLEvents"),d.initEvent(s,l,!0)):d=new CustomEvent(e,{bubbles:l,cancelable:!0}),void 0!==i&&Object.keys(i).forEach((t=>{Object.defineProperty(d,t,{get:()=>i[t]})})),h&&d.preventDefault(),c&&t.dispatchEvent(d),d.defaultPrevented&&void 0!==a&&a.preventDefault(),d}},M=new Map,H={set(t,e,i){M.has(t)||M.set(t,new Map);const n=M.get(t);n.has(e)||0===n.size?n.set(e,i):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(n.keys())[0]}.`)},get:(t,e)=>M.has(t)&&M.get(t).get(e)||null,remove(t,e){if(!M.has(t))return;const i=M.get(t);i.delete(e),0===i.size&&M.delete(t)}};class B{constructor(t){(t=r(t))&&(this._element=t,H.set(this._element,this.constructor.DATA_KEY,this))}dispose(){H.remove(this._element,this.constructor.DATA_KEY),j.off(this._element,this.constructor.EVENT_KEY),Object.getOwnPropertyNames(this).forEach((t=>{this[t]=null}))}_queueCallback(t,e,i=!0){b(t,e,i)}static getInstance(t){return H.get(r(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,"object"==typeof e?e:null)}static get VERSION(){return"5.1.3"}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}}const R=(t,e="hide")=>{const i=`click.dismiss${t.EVENT_KEY}`,s=t.NAME;j.on(document,i,`[data-bs-dismiss="${s}"]`,(function(i){if(["A","AREA"].includes(this.tagName)&&i.preventDefault(),c(this))return;const o=n(this)||this.closest(`.${s}`);t.getOrCreateInstance(o)[e]()}))};class W extends B{static get NAME(){return"alert"}close(){if(j.trigger(this._element,"close.bs.alert").defaultPrevented)return;this._element.classList.remove("show");const t=this._element.classList.contains("fade");this._queueCallback((()=>this._destroyElement()),this._element,t)}_destroyElement(){this._element.remove(),j.trigger(this._element,"closed.bs.alert"),this.dispose()}static jQueryInterface(t){return this.each((function(){const e=W.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}R(W,"close"),g(W);const $='[data-bs-toggle="button"]';class z extends B{static get NAME(){return"button"}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}static jQueryInterface(t){return this.each((function(){const e=z.getOrCreateInstance(this);"toggle"===t&&e[t]()}))}}function q(t){return"true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function F(t){return t.replace(/[A-Z]/g,(t=>`-${t.toLowerCase()}`))}j.on(document,"click.bs.button.data-api",$,(t=>{t.preventDefault();const e=t.target.closest($);z.getOrCreateInstance(e).toggle()})),g(z);const U={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${F(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${F(e)}`)},getDataAttributes(t){if(!t)return{};const e={};return Object.keys(t.dataset).filter((t=>t.startsWith("bs"))).forEach((i=>{let n=i.replace(/^bs/,"");n=n.charAt(0).toLowerCase()+n.slice(1,n.length),e[n]=q(t.dataset[i])})),e},getDataAttribute:(t,e)=>q(t.getAttribute(`data-bs-${F(e)}`)),offset(t){const e=t.getBoundingClientRect();return{top:e.top+window.pageYOffset,left:e.left+window.pageXOffset}},position:t=>({top:t.offsetTop,left:t.offsetLeft})},V={find:(t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e,t)),findOne:(t,e=document.documentElement)=>Element.prototype.querySelector.call(e,t),children:(t,e)=>[].concat(...t.children).filter((t=>t.matches(e))),parents(t,e){const i=[];let n=t.parentNode;for(;n&&n.nodeType===Node.ELEMENT_NODE&&3!==n.nodeType;)n.matches(e)&&i.push(n),n=n.parentNode;return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map((t=>`${t}:not([tabindex^="-"])`)).join(", ");return this.find(e,t).filter((t=>!c(t)&&l(t)))}},K="carousel",X={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},Y={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},Q="next",G="prev",Z="left",J="right",tt={ArrowLeft:J,ArrowRight:Z},et="slid.bs.carousel",it="active",nt=".active.carousel-item";class st extends B{constructor(t,e){super(t),this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._indicatorsElement=V.findOne(".carousel-indicators",this._element),this._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,this._pointerEvent=Boolean(window.PointerEvent),this._addEventListeners()}static get Default(){return X}static get NAME(){return K}next(){this._slide(Q)}nextWhenVisible(){!document.hidden&&l(this._element)&&this.next()}prev(){this._slide(G)}pause(t){t||(this._isPaused=!0),V.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(s(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null}cycle(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._updateInterval(),this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))}to(t){this._activeElement=V.findOne(nt,this._element);const e=this._getItemIndex(this._activeElement);if(t>this._items.length-1||t<0)return;if(this._isSliding)return void j.one(this._element,et,(()=>this.to(t)));if(e===t)return this.pause(),void this.cycle();const i=t>e?Q:G;this._slide(i,this._items[t])}_getConfig(t){return t={...X,...U.getDataAttributes(this._element),..."object"==typeof t?t:{}},a(K,t,Y),t}_handleSwipe(){const t=Math.abs(this.touchDeltaX);if(t<=40)return;const e=t/this.touchDeltaX;this.touchDeltaX=0,e&&this._slide(e>0?J:Z)}_addEventListeners(){this._config.keyboard&&j.on(this._element,"keydown.bs.carousel",(t=>this._keydown(t))),"hover"===this._config.pause&&(j.on(this._element,"mouseenter.bs.carousel",(t=>this.pause(t))),j.on(this._element,"mouseleave.bs.carousel",(t=>this.cycle(t)))),this._config.touch&&this._touchSupported&&this._addTouchEventListeners()}_addTouchEventListeners(){const t=t=>this._pointerEvent&&("pen"===t.pointerType||"touch"===t.pointerType),e=e=>{t(e)?this.touchStartX=e.clientX:this._pointerEvent||(this.touchStartX=e.touches[0].clientX)},i=t=>{this.touchDeltaX=t.touches&&t.touches.length>1?0:t.touches[0].clientX-this.touchStartX},n=e=>{t(e)&&(this.touchDeltaX=e.clientX-this.touchStartX),this._handleSwipe(),"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout((t=>this.cycle(t)),500+this._config.interval))};V.find(".carousel-item img",this._element).forEach((t=>{j.on(t,"dragstart.bs.carousel",(t=>t.preventDefault()))})),this._pointerEvent?(j.on(this._element,"pointerdown.bs.carousel",(t=>e(t))),j.on(this._element,"pointerup.bs.carousel",(t=>n(t))),this._element.classList.add("pointer-event")):(j.on(this._element,"touchstart.bs.carousel",(t=>e(t))),j.on(this._element,"touchmove.bs.carousel",(t=>i(t))),j.on(this._element,"touchend.bs.carousel",(t=>n(t))))}_keydown(t){if(/input|textarea/i.test(t.target.tagName))return;const e=tt[t.key];e&&(t.preventDefault(),this._slide(e))}_getItemIndex(t){return this._items=t&&t.parentNode?V.find(".carousel-item",t.parentNode):[],this._items.indexOf(t)}_getItemByOrder(t,e){const i=t===Q;return v(this._items,e,i,this._config.wrap)}_triggerSlideEvent(t,e){const i=this._getItemIndex(t),n=this._getItemIndex(V.findOne(nt,this._element));return j.trigger(this._element,"slide.bs.carousel",{relatedTarget:t,direction:e,from:n,to:i})}_setActiveIndicatorElement(t){if(this._indicatorsElement){const e=V.findOne(".active",this._indicatorsElement);e.classList.remove(it),e.removeAttribute("aria-current");const i=V.find("[data-bs-target]",this._indicatorsElement);for(let e=0;e<i.length;e++)if(Number.parseInt(i[e].getAttribute("data-bs-slide-to"),10)===this._getItemIndex(t)){i[e].classList.add(it),i[e].setAttribute("aria-current","true");break}}}_updateInterval(){const t=this._activeElement||V.findOne(nt,this._element);if(!t)return;const e=Number.parseInt(t.getAttribute("data-bs-interval"),10);e?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=e):this._config.interval=this._config.defaultInterval||this._config.interval}_slide(t,e){const i=this._directionToOrder(t),n=V.findOne(nt,this._element),s=this._getItemIndex(n),o=e||this._getItemByOrder(i,n),r=this._getItemIndex(o),a=Boolean(this._interval),l=i===Q,c=l?"carousel-item-start":"carousel-item-end",h=l?"carousel-item-next":"carousel-item-prev",d=this._orderToDirection(i);if(o&&o.classList.contains(it))return void(this._isSliding=!1);if(this._isSliding)return;if(this._triggerSlideEvent(o,d).defaultPrevented)return;if(!n||!o)return;this._isSliding=!0,a&&this.pause(),this._setActiveIndicatorElement(o),this._activeElement=o;const f=()=>{j.trigger(this._element,et,{relatedTarget:o,direction:d,from:s,to:r})};if(this._element.classList.contains("slide")){o.classList.add(h),u(o),n.classList.add(c),o.classList.add(c);const t=()=>{o.classList.remove(c,h),o.classList.add(it),n.classList.remove(it,h,c),this._isSliding=!1,setTimeout(f,0)};this._queueCallback(t,n,!0)}else n.classList.remove(it),o.classList.add(it),this._isSliding=!1,f();a&&this.cycle()}_directionToOrder(t){return[J,Z].includes(t)?m()?t===Z?G:Q:t===Z?Q:G:t}_orderToDirection(t){return[Q,G].includes(t)?m()?t===G?Z:J:t===G?J:Z:t}static carouselInterface(t,e){const i=st.getOrCreateInstance(t,e);let{_config:n}=i;"object"==typeof e&&(n={...n,...e});const s="string"==typeof e?e:n.slide;if("number"==typeof e)i.to(e);else if("string"==typeof s){if(void 0===i[s])throw new TypeError(`No method named "${s}"`);i[s]()}else n.interval&&n.ride&&(i.pause(),i.cycle())}static jQueryInterface(t){return this.each((function(){st.carouselInterface(this,t)}))}static dataApiClickHandler(t){const e=n(this);if(!e||!e.classList.contains("carousel"))return;const i={...U.getDataAttributes(e),...U.getDataAttributes(this)},s=this.getAttribute("data-bs-slide-to");s&&(i.interval=!1),st.carouselInterface(e,i),s&&st.getInstance(e).to(s),t.preventDefault()}}j.on(document,"click.bs.carousel.data-api","[data-bs-slide], [data-bs-slide-to]",st.dataApiClickHandler),j.on(window,"load.bs.carousel.data-api",(()=>{const t=V.find('[data-bs-ride="carousel"]');for(let e=0,i=t.length;e<i;e++)st.carouselInterface(t[e],st.getInstance(t[e]))})),g(st);const ot="collapse",rt={toggle:!0,parent:null},at={toggle:"boolean",parent:"(null|element)"},lt="show",ct="collapse",ht="collapsing",dt="collapsed",ut=":scope .collapse .collapse",ft='[data-bs-toggle="collapse"]';class pt extends B{constructor(t,e){super(t),this._isTransitioning=!1,this._config=this._getConfig(e),this._triggerArray=[];const n=V.find(ft);for(let t=0,e=n.length;t<e;t++){const e=n[t],s=i(e),o=V.find(s).filter((t=>t===this._element));null!==s&&o.length&&(this._selector=s,this._triggerArray.push(e))}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return rt}static get NAME(){return ot}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t,e=[];if(this._config.parent){const t=V.find(ut,this._config.parent);e=V.find(".collapse.show, .collapse.collapsing",this._config.parent).filter((e=>!t.includes(e)))}const i=V.findOne(this._selector);if(e.length){const n=e.find((t=>i!==t));if(t=n?pt.getInstance(n):null,t&&t._isTransitioning)return}if(j.trigger(this._element,"show.bs.collapse").defaultPrevented)return;e.forEach((e=>{i!==e&&pt.getOrCreateInstance(e,{toggle:!1}).hide(),t||H.set(e,"bs.collapse",null)}));const n=this._getDimension();this._element.classList.remove(ct),this._element.classList.add(ht),this._element.style[n]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const s=`scroll${n[0].toUpperCase()+n.slice(1)}`;this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(ht),this._element.classList.add(ct,lt),this._element.style[n]="",j.trigger(this._element,"shown.bs.collapse")}),this._element,!0),this._element.style[n]=`${this._element[s]}px`}hide(){if(this._isTransitioning||!this._isShown())return;if(j.trigger(this._element,"hide.bs.collapse").defaultPrevented)return;const t=this._getDimension();this._element.style[t]=`${this._element.getBoundingClientRect()[t]}px`,u(this._element),this._element.classList.add(ht),this._element.classList.remove(ct,lt);const e=this._triggerArray.length;for(let t=0;t<e;t++){const e=this._triggerArray[t],i=n(e);i&&!this._isShown(i)&&this._addAriaAndCollapsedClass([e],!1)}this._isTransitioning=!0,this._element.style[t]="",this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(ht),this._element.classList.add(ct),j.trigger(this._element,"hidden.bs.collapse")}),this._element,!0)}_isShown(t=this._element){return t.classList.contains(lt)}_getConfig(t){return(t={...rt,...U.getDataAttributes(this._element),...t}).toggle=Boolean(t.toggle),t.parent=r(t.parent),a(ot,t,at),t}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const t=V.find(ut,this._config.parent);V.find(ft,this._config.parent).filter((e=>!t.includes(e))).forEach((t=>{const e=n(t);e&&this._addAriaAndCollapsedClass([t],this._isShown(e))}))}_addAriaAndCollapsedClass(t,e){t.length&&t.forEach((t=>{e?t.classList.remove(dt):t.classList.add(dt),t.setAttribute("aria-expanded",e)}))}static jQueryInterface(t){return this.each((function(){const e={};"string"==typeof t&&/show|hide/.test(t)&&(e.toggle=!1);const i=pt.getOrCreateInstance(this,e);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t]()}}))}}j.on(document,"click.bs.collapse.data-api",ft,(function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();const e=i(this);V.find(e).forEach((t=>{pt.getOrCreateInstance(t,{toggle:!1}).toggle()}))})),g(pt);var mt="top",gt="bottom",_t="right",bt="left",vt="auto",yt=[mt,gt,_t,bt],wt="start",Et="end",At="clippingParents",Tt="viewport",Ot="popper",Ct="reference",kt=yt.reduce((function(t,e){return t.concat([e+"-"+wt,e+"-"+Et])}),[]),Lt=[].concat(yt,[vt]).reduce((function(t,e){return t.concat([e,e+"-"+wt,e+"-"+Et])}),[]),xt="beforeRead",Dt="read",St="afterRead",Nt="beforeMain",It="main",Pt="afterMain",jt="beforeWrite",Mt="write",Ht="afterWrite",Bt=[xt,Dt,St,Nt,It,Pt,jt,Mt,Ht];function Rt(t){return t?(t.nodeName||"").toLowerCase():null}function Wt(t){if(null==t)return window;if("[object Window]"!==t.toString()){var e=t.ownerDocument;return e&&e.defaultView||window}return t}function $t(t){return t instanceof Wt(t).Element||t instanceof Element}function zt(t){return t instanceof Wt(t).HTMLElement||t instanceof HTMLElement}function qt(t){return"undefined"!=typeof ShadowRoot&&(t instanceof Wt(t).ShadowRoot||t instanceof ShadowRoot)}const Ft={name:"applyStyles",enabled:!0,phase:"write",fn:function(t){var e=t.state;Object.keys(e.elements).forEach((function(t){var i=e.styles[t]||{},n=e.attributes[t]||{},s=e.elements[t];zt(s)&&Rt(s)&&(Object.assign(s.style,i),Object.keys(n).forEach((function(t){var e=n[t];!1===e?s.removeAttribute(t):s.setAttribute(t,!0===e?"":e)})))}))},effect:function(t){var e=t.state,i={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,i.popper),e.styles=i,e.elements.arrow&&Object.assign(e.elements.arrow.style,i.arrow),function(){Object.keys(e.elements).forEach((function(t){var n=e.elements[t],s=e.attributes[t]||{},o=Object.keys(e.styles.hasOwnProperty(t)?e.styles[t]:i[t]).reduce((function(t,e){return t[e]="",t}),{});zt(n)&&Rt(n)&&(Object.assign(n.style,o),Object.keys(s).forEach((function(t){n.removeAttribute(t)})))}))}},requires:["computeStyles"]};function Ut(t){return t.split("-")[0]}function Vt(t,e){var i=t.getBoundingClientRect();return{width:i.width/1,height:i.height/1,top:i.top/1,right:i.right/1,bottom:i.bottom/1,left:i.left/1,x:i.left/1,y:i.top/1}}function Kt(t){var e=Vt(t),i=t.offsetWidth,n=t.offsetHeight;return Math.abs(e.width-i)<=1&&(i=e.width),Math.abs(e.height-n)<=1&&(n=e.height),{x:t.offsetLeft,y:t.offsetTop,width:i,height:n}}function Xt(t,e){var i=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(i&&qt(i)){var n=e;do{if(n&&t.isSameNode(n))return!0;n=n.parentNode||n.host}while(n)}return!1}function Yt(t){return Wt(t).getComputedStyle(t)}function Qt(t){return["table","td","th"].indexOf(Rt(t))>=0}function Gt(t){return(($t(t)?t.ownerDocument:t.document)||window.document).documentElement}function Zt(t){return"html"===Rt(t)?t:t.assignedSlot||t.parentNode||(qt(t)?t.host:null)||Gt(t)}function Jt(t){return zt(t)&&"fixed"!==Yt(t).position?t.offsetParent:null}function te(t){for(var e=Wt(t),i=Jt(t);i&&Qt(i)&&"static"===Yt(i).position;)i=Jt(i);return i&&("html"===Rt(i)||"body"===Rt(i)&&"static"===Yt(i).position)?e:i||function(t){var e=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&zt(t)&&"fixed"===Yt(t).position)return null;for(var i=Zt(t);zt(i)&&["html","body"].indexOf(Rt(i))<0;){var n=Yt(i);if("none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||-1!==["transform","perspective"].indexOf(n.willChange)||e&&"filter"===n.willChange||e&&n.filter&&"none"!==n.filter)return i;i=i.parentNode}return null}(t)||e}function ee(t){return["top","bottom"].indexOf(t)>=0?"x":"y"}var ie=Math.max,ne=Math.min,se=Math.round;function oe(t,e,i){return ie(t,ne(e,i))}function re(t){return Object.assign({},{top:0,right:0,bottom:0,left:0},t)}function ae(t,e){return e.reduce((function(e,i){return e[i]=t,e}),{})}const le={name:"arrow",enabled:!0,phase:"main",fn:function(t){var e,i=t.state,n=t.name,s=t.options,o=i.elements.arrow,r=i.modifiersData.popperOffsets,a=Ut(i.placement),l=ee(a),c=[bt,_t].indexOf(a)>=0?"height":"width";if(o&&r){var h=function(t,e){return re("number"!=typeof(t="function"==typeof t?t(Object.assign({},e.rects,{placement:e.placement})):t)?t:ae(t,yt))}(s.padding,i),d=Kt(o),u="y"===l?mt:bt,f="y"===l?gt:_t,p=i.rects.reference[c]+i.rects.reference[l]-r[l]-i.rects.popper[c],m=r[l]-i.rects.reference[l],g=te(o),_=g?"y"===l?g.clientHeight||0:g.clientWidth||0:0,b=p/2-m/2,v=h[u],y=_-d[c]-h[f],w=_/2-d[c]/2+b,E=oe(v,w,y),A=l;i.modifiersData[n]=((e={})[A]=E,e.centerOffset=E-w,e)}},effect:function(t){var e=t.state,i=t.options.element,n=void 0===i?"[data-popper-arrow]":i;null!=n&&("string"!=typeof n||(n=e.elements.popper.querySelector(n)))&&Xt(e.elements.popper,n)&&(e.elements.arrow=n)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ce(t){return t.split("-")[1]}var he={top:"auto",right:"auto",bottom:"auto",left:"auto"};function de(t){var e,i=t.popper,n=t.popperRect,s=t.placement,o=t.variation,r=t.offsets,a=t.position,l=t.gpuAcceleration,c=t.adaptive,h=t.roundOffsets,d=!0===h?function(t){var e=t.x,i=t.y,n=window.devicePixelRatio||1;return{x:se(se(e*n)/n)||0,y:se(se(i*n)/n)||0}}(r):"function"==typeof h?h(r):r,u=d.x,f=void 0===u?0:u,p=d.y,m=void 0===p?0:p,g=r.hasOwnProperty("x"),_=r.hasOwnProperty("y"),b=bt,v=mt,y=window;if(c){var w=te(i),E="clientHeight",A="clientWidth";w===Wt(i)&&"static"!==Yt(w=Gt(i)).position&&"absolute"===a&&(E="scrollHeight",A="scrollWidth"),w=w,s!==mt&&(s!==bt&&s!==_t||o!==Et)||(v=gt,m-=w[E]-n.height,m*=l?1:-1),s!==bt&&(s!==mt&&s!==gt||o!==Et)||(b=_t,f-=w[A]-n.width,f*=l?1:-1)}var T,O=Object.assign({position:a},c&&he);return l?Object.assign({},O,((T={})[v]=_?"0":"",T[b]=g?"0":"",T.transform=(y.devicePixelRatio||1)<=1?"translate("+f+"px, "+m+"px)":"translate3d("+f+"px, "+m+"px, 0)",T)):Object.assign({},O,((e={})[v]=_?m+"px":"",e[b]=g?f+"px":"",e.transform="",e))}const ue={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(t){var e=t.state,i=t.options,n=i.gpuAcceleration,s=void 0===n||n,o=i.adaptive,r=void 0===o||o,a=i.roundOffsets,l=void 0===a||a,c={placement:Ut(e.placement),variation:ce(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:s};null!=e.modifiersData.popperOffsets&&(e.styles.popper=Object.assign({},e.styles.popper,de(Object.assign({},c,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:r,roundOffsets:l})))),null!=e.modifiersData.arrow&&(e.styles.arrow=Object.assign({},e.styles.arrow,de(Object.assign({},c,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})},data:{}};var fe={passive:!0};const pe={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(t){var e=t.state,i=t.instance,n=t.options,s=n.scroll,o=void 0===s||s,r=n.resize,a=void 0===r||r,l=Wt(e.elements.popper),c=[].concat(e.scrollParents.reference,e.scrollParents.popper);return o&&c.forEach((function(t){t.addEventListener("scroll",i.update,fe)})),a&&l.addEventListener("resize",i.update,fe),function(){o&&c.forEach((function(t){t.removeEventListener("scroll",i.update,fe)})),a&&l.removeEventListener("resize",i.update,fe)}},data:{}};var me={left:"right",right:"left",bottom:"top",top:"bottom"};function ge(t){return t.replace(/left|right|bottom|top/g,(function(t){return me[t]}))}var _e={start:"end",end:"start"};function be(t){return t.replace(/start|end/g,(function(t){return _e[t]}))}function ve(t){var e=Wt(t);return{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function ye(t){return Vt(Gt(t)).left+ve(t).scrollLeft}function we(t){var e=Yt(t),i=e.overflow,n=e.overflowX,s=e.overflowY;return/auto|scroll|overlay|hidden/.test(i+s+n)}function Ee(t){return["html","body","#document"].indexOf(Rt(t))>=0?t.ownerDocument.body:zt(t)&&we(t)?t:Ee(Zt(t))}function Ae(t,e){var i;void 0===e&&(e=[]);var n=Ee(t),s=n===(null==(i=t.ownerDocument)?void 0:i.body),o=Wt(n),r=s?[o].concat(o.visualViewport||[],we(n)?n:[]):n,a=e.concat(r);return s?a:a.concat(Ae(Zt(r)))}function Te(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function Oe(t,e){return e===Tt?Te(function(t){var e=Wt(t),i=Gt(t),n=e.visualViewport,s=i.clientWidth,o=i.clientHeight,r=0,a=0;return n&&(s=n.width,o=n.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(r=n.offsetLeft,a=n.offsetTop)),{width:s,height:o,x:r+ye(t),y:a}}(t)):zt(e)?function(t){var e=Vt(t);return e.top=e.top+t.clientTop,e.left=e.left+t.clientLeft,e.bottom=e.top+t.clientHeight,e.right=e.left+t.clientWidth,e.width=t.clientWidth,e.height=t.clientHeight,e.x=e.left,e.y=e.top,e}(e):Te(function(t){var e,i=Gt(t),n=ve(t),s=null==(e=t.ownerDocument)?void 0:e.body,o=ie(i.scrollWidth,i.clientWidth,s?s.scrollWidth:0,s?s.clientWidth:0),r=ie(i.scrollHeight,i.clientHeight,s?s.scrollHeight:0,s?s.clientHeight:0),a=-n.scrollLeft+ye(t),l=-n.scrollTop;return"rtl"===Yt(s||i).direction&&(a+=ie(i.clientWidth,s?s.clientWidth:0)-o),{width:o,height:r,x:a,y:l}}(Gt(t)))}function Ce(t){var e,i=t.reference,n=t.element,s=t.placement,o=s?Ut(s):null,r=s?ce(s):null,a=i.x+i.width/2-n.width/2,l=i.y+i.height/2-n.height/2;switch(o){case mt:e={x:a,y:i.y-n.height};break;case gt:e={x:a,y:i.y+i.height};break;case _t:e={x:i.x+i.width,y:l};break;case bt:e={x:i.x-n.width,y:l};break;default:e={x:i.x,y:i.y}}var c=o?ee(o):null;if(null!=c){var h="y"===c?"height":"width";switch(r){case wt:e[c]=e[c]-(i[h]/2-n[h]/2);break;case Et:e[c]=e[c]+(i[h]/2-n[h]/2)}}return e}function ke(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=void 0===n?t.placement:n,o=i.boundary,r=void 0===o?At:o,a=i.rootBoundary,l=void 0===a?Tt:a,c=i.elementContext,h=void 0===c?Ot:c,d=i.altBoundary,u=void 0!==d&&d,f=i.padding,p=void 0===f?0:f,m=re("number"!=typeof p?p:ae(p,yt)),g=h===Ot?Ct:Ot,_=t.rects.popper,b=t.elements[u?g:h],v=function(t,e,i){var n="clippingParents"===e?function(t){var e=Ae(Zt(t)),i=["absolute","fixed"].indexOf(Yt(t).position)>=0&&zt(t)?te(t):t;return $t(i)?e.filter((function(t){return $t(t)&&Xt(t,i)&&"body"!==Rt(t)})):[]}(t):[].concat(e),s=[].concat(n,[i]),o=s[0],r=s.reduce((function(e,i){var n=Oe(t,i);return e.top=ie(n.top,e.top),e.right=ne(n.right,e.right),e.bottom=ne(n.bottom,e.bottom),e.left=ie(n.left,e.left),e}),Oe(t,o));return r.width=r.right-r.left,r.height=r.bottom-r.top,r.x=r.left,r.y=r.top,r}($t(b)?b:b.contextElement||Gt(t.elements.popper),r,l),y=Vt(t.elements.reference),w=Ce({reference:y,element:_,strategy:"absolute",placement:s}),E=Te(Object.assign({},_,w)),A=h===Ot?E:y,T={top:v.top-A.top+m.top,bottom:A.bottom-v.bottom+m.bottom,left:v.left-A.left+m.left,right:A.right-v.right+m.right},O=t.modifiersData.offset;if(h===Ot&&O){var C=O[s];Object.keys(T).forEach((function(t){var e=[_t,gt].indexOf(t)>=0?1:-1,i=[mt,gt].indexOf(t)>=0?"y":"x";T[t]+=C[i]*e}))}return T}function Le(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=i.boundary,o=i.rootBoundary,r=i.padding,a=i.flipVariations,l=i.allowedAutoPlacements,c=void 0===l?Lt:l,h=ce(n),d=h?a?kt:kt.filter((function(t){return ce(t)===h})):yt,u=d.filter((function(t){return c.indexOf(t)>=0}));0===u.length&&(u=d);var f=u.reduce((function(e,i){return e[i]=ke(t,{placement:i,boundary:s,rootBoundary:o,padding:r})[Ut(i)],e}),{});return Object.keys(f).sort((function(t,e){return f[t]-f[e]}))}const xe={name:"flip",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name;if(!e.modifiersData[n]._skip){for(var s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0===r||r,l=i.fallbackPlacements,c=i.padding,h=i.boundary,d=i.rootBoundary,u=i.altBoundary,f=i.flipVariations,p=void 0===f||f,m=i.allowedAutoPlacements,g=e.options.placement,_=Ut(g),b=l||(_!==g&&p?function(t){if(Ut(t)===vt)return[];var e=ge(t);return[be(t),e,be(e)]}(g):[ge(g)]),v=[g].concat(b).reduce((function(t,i){return t.concat(Ut(i)===vt?Le(e,{placement:i,boundary:h,rootBoundary:d,padding:c,flipVariations:p,allowedAutoPlacements:m}):i)}),[]),y=e.rects.reference,w=e.rects.popper,E=new Map,A=!0,T=v[0],O=0;O<v.length;O++){var C=v[O],k=Ut(C),L=ce(C)===wt,x=[mt,gt].indexOf(k)>=0,D=x?"width":"height",S=ke(e,{placement:C,boundary:h,rootBoundary:d,altBoundary:u,padding:c}),N=x?L?_t:bt:L?gt:mt;y[D]>w[D]&&(N=ge(N));var I=ge(N),P=[];if(o&&P.push(S[k]<=0),a&&P.push(S[N]<=0,S[I]<=0),P.every((function(t){return t}))){T=C,A=!1;break}E.set(C,P)}if(A)for(var j=function(t){var e=v.find((function(e){var i=E.get(e);if(i)return i.slice(0,t).every((function(t){return t}))}));if(e)return T=e,"break"},M=p?3:1;M>0&&"break"!==j(M);M--);e.placement!==T&&(e.modifiersData[n]._skip=!0,e.placement=T,e.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function De(t,e,i){return void 0===i&&(i={x:0,y:0}),{top:t.top-e.height-i.y,right:t.right-e.width+i.x,bottom:t.bottom-e.height+i.y,left:t.left-e.width-i.x}}function Se(t){return[mt,_t,gt,bt].some((function(e){return t[e]>=0}))}const Ne={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(t){var e=t.state,i=t.name,n=e.rects.reference,s=e.rects.popper,o=e.modifiersData.preventOverflow,r=ke(e,{elementContext:"reference"}),a=ke(e,{altBoundary:!0}),l=De(r,n),c=De(a,s,o),h=Se(l),d=Se(c);e.modifiersData[i]={referenceClippingOffsets:l,popperEscapeOffsets:c,isReferenceHidden:h,hasPopperEscaped:d},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":h,"data-popper-escaped":d})}},Ie={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.offset,o=void 0===s?[0,0]:s,r=Lt.reduce((function(t,i){return t[i]=function(t,e,i){var n=Ut(t),s=[bt,mt].indexOf(n)>=0?-1:1,o="function"==typeof i?i(Object.assign({},e,{placement:t})):i,r=o[0],a=o[1];return r=r||0,a=(a||0)*s,[bt,_t].indexOf(n)>=0?{x:a,y:r}:{x:r,y:a}}(i,e.rects,o),t}),{}),a=r[e.placement],l=a.x,c=a.y;null!=e.modifiersData.popperOffsets&&(e.modifiersData.popperOffsets.x+=l,e.modifiersData.popperOffsets.y+=c),e.modifiersData[n]=r}},Pe={name:"popperOffsets",enabled:!0,phase:"read",fn:function(t){var e=t.state,i=t.name;e.modifiersData[i]=Ce({reference:e.rects.reference,element:e.rects.popper,strategy:"absolute",placement:e.placement})},data:{}},je={name:"preventOverflow",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0!==r&&r,l=i.boundary,c=i.rootBoundary,h=i.altBoundary,d=i.padding,u=i.tether,f=void 0===u||u,p=i.tetherOffset,m=void 0===p?0:p,g=ke(e,{boundary:l,rootBoundary:c,padding:d,altBoundary:h}),_=Ut(e.placement),b=ce(e.placement),v=!b,y=ee(_),w="x"===y?"y":"x",E=e.modifiersData.popperOffsets,A=e.rects.reference,T=e.rects.popper,O="function"==typeof m?m(Object.assign({},e.rects,{placement:e.placement})):m,C={x:0,y:0};if(E){if(o||a){var k="y"===y?mt:bt,L="y"===y?gt:_t,x="y"===y?"height":"width",D=E[y],S=E[y]+g[k],N=E[y]-g[L],I=f?-T[x]/2:0,P=b===wt?A[x]:T[x],j=b===wt?-T[x]:-A[x],M=e.elements.arrow,H=f&&M?Kt(M):{width:0,height:0},B=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},R=B[k],W=B[L],$=oe(0,A[x],H[x]),z=v?A[x]/2-I-$-R-O:P-$-R-O,q=v?-A[x]/2+I+$+W+O:j+$+W+O,F=e.elements.arrow&&te(e.elements.arrow),U=F?"y"===y?F.clientTop||0:F.clientLeft||0:0,V=e.modifiersData.offset?e.modifiersData.offset[e.placement][y]:0,K=E[y]+z-V-U,X=E[y]+q-V;if(o){var Y=oe(f?ne(S,K):S,D,f?ie(N,X):N);E[y]=Y,C[y]=Y-D}if(a){var Q="x"===y?mt:bt,G="x"===y?gt:_t,Z=E[w],J=Z+g[Q],tt=Z-g[G],et=oe(f?ne(J,K):J,Z,f?ie(tt,X):tt);E[w]=et,C[w]=et-Z}}e.modifiersData[n]=C}},requiresIfExists:["offset"]};function Me(t,e,i){void 0===i&&(i=!1);var n=zt(e);zt(e)&&function(t){var e=t.getBoundingClientRect();e.width,t.offsetWidth,e.height,t.offsetHeight}(e);var s,o,r=Gt(e),a=Vt(t),l={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(n||!n&&!i)&&(("body"!==Rt(e)||we(r))&&(l=(s=e)!==Wt(s)&&zt(s)?{scrollLeft:(o=s).scrollLeft,scrollTop:o.scrollTop}:ve(s)),zt(e)?((c=Vt(e)).x+=e.clientLeft,c.y+=e.clientTop):r&&(c.x=ye(r))),{x:a.left+l.scrollLeft-c.x,y:a.top+l.scrollTop-c.y,width:a.width,height:a.height}}function He(t){var e=new Map,i=new Set,n=[];function s(t){i.add(t.name),[].concat(t.requires||[],t.requiresIfExists||[]).forEach((function(t){if(!i.has(t)){var n=e.get(t);n&&s(n)}})),n.push(t)}return t.forEach((function(t){e.set(t.name,t)})),t.forEach((function(t){i.has(t.name)||s(t)})),n}var Be={placement:"bottom",modifiers:[],strategy:"absolute"};function Re(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return!e.some((function(t){return!(t&&"function"==typeof t.getBoundingClientRect)}))}function We(t){void 0===t&&(t={});var e=t,i=e.defaultModifiers,n=void 0===i?[]:i,s=e.defaultOptions,o=void 0===s?Be:s;return function(t,e,i){void 0===i&&(i=o);var s,r,a={placement:"bottom",orderedModifiers:[],options:Object.assign({},Be,o),modifiersData:{},elements:{reference:t,popper:e},attributes:{},styles:{}},l=[],c=!1,h={state:a,setOptions:function(i){var s="function"==typeof i?i(a.options):i;d(),a.options=Object.assign({},o,a.options,s),a.scrollParents={reference:$t(t)?Ae(t):t.contextElement?Ae(t.contextElement):[],popper:Ae(e)};var r,c,u=function(t){var e=He(t);return Bt.reduce((function(t,i){return t.concat(e.filter((function(t){return t.phase===i})))}),[])}((r=[].concat(n,a.options.modifiers),c=r.reduce((function(t,e){var i=t[e.name];return t[e.name]=i?Object.assign({},i,e,{options:Object.assign({},i.options,e.options),data:Object.assign({},i.data,e.data)}):e,t}),{}),Object.keys(c).map((function(t){return c[t]}))));return a.orderedModifiers=u.filter((function(t){return t.enabled})),a.orderedModifiers.forEach((function(t){var e=t.name,i=t.options,n=void 0===i?{}:i,s=t.effect;if("function"==typeof s){var o=s({state:a,name:e,instance:h,options:n});l.push(o||function(){})}})),h.update()},forceUpdate:function(){if(!c){var t=a.elements,e=t.reference,i=t.popper;if(Re(e,i)){a.rects={reference:Me(e,te(i),"fixed"===a.options.strategy),popper:Kt(i)},a.reset=!1,a.placement=a.options.placement,a.orderedModifiers.forEach((function(t){return a.modifiersData[t.name]=Object.assign({},t.data)}));for(var n=0;n<a.orderedModifiers.length;n++)if(!0!==a.reset){var s=a.orderedModifiers[n],o=s.fn,r=s.options,l=void 0===r?{}:r,d=s.name;"function"==typeof o&&(a=o({state:a,options:l,name:d,instance:h})||a)}else a.reset=!1,n=-1}}},update:(s=function(){return new Promise((function(t){h.forceUpdate(),t(a)}))},function(){return r||(r=new Promise((function(t){Promise.resolve().then((function(){r=void 0,t(s())}))}))),r}),destroy:function(){d(),c=!0}};if(!Re(t,e))return h;function d(){l.forEach((function(t){return t()})),l=[]}return h.setOptions(i).then((function(t){!c&&i.onFirstUpdate&&i.onFirstUpdate(t)})),h}}var $e=We(),ze=We({defaultModifiers:[pe,Pe,ue,Ft]}),qe=We({defaultModifiers:[pe,Pe,ue,Ft,Ie,xe,je,le,Ne]});const Fe=Object.freeze({__proto__:null,popperGenerator:We,detectOverflow:ke,createPopperBase:$e,createPopper:qe,createPopperLite:ze,top:mt,bottom:gt,right:_t,left:bt,auto:vt,basePlacements:yt,start:wt,end:Et,clippingParents:At,viewport:Tt,popper:Ot,reference:Ct,variationPlacements:kt,placements:Lt,beforeRead:xt,read:Dt,afterRead:St,beforeMain:Nt,main:It,afterMain:Pt,beforeWrite:jt,write:Mt,afterWrite:Ht,modifierPhases:Bt,applyStyles:Ft,arrow:le,computeStyles:ue,eventListeners:pe,flip:xe,hide:Ne,offset:Ie,popperOffsets:Pe,preventOverflow:je}),Ue="dropdown",Ve="Escape",Ke="Space",Xe="ArrowUp",Ye="ArrowDown",Qe=new RegExp("ArrowUp|ArrowDown|Escape"),Ge="click.bs.dropdown.data-api",Ze="keydown.bs.dropdown.data-api",Je="show",ti='[data-bs-toggle="dropdown"]',ei=".dropdown-menu",ii=m()?"top-end":"top-start",ni=m()?"top-start":"top-end",si=m()?"bottom-end":"bottom-start",oi=m()?"bottom-start":"bottom-end",ri=m()?"left-start":"right-start",ai=m()?"right-start":"left-start",li={offset:[0,2],boundary:"clippingParents",reference:"toggle",display:"dynamic",popperConfig:null,autoClose:!0},ci={offset:"(array|string|function)",boundary:"(string|element)",reference:"(string|element|object)",display:"string",popperConfig:"(null|object|function)",autoClose:"(boolean|string)"};class hi extends B{constructor(t,e){super(t),this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar()}static get Default(){return li}static get DefaultType(){return ci}static get NAME(){return Ue}toggle(){return this._isShown()?this.hide():this.show()}show(){if(c(this._element)||this._isShown(this._menu))return;const t={relatedTarget:this._element};if(j.trigger(this._element,"show.bs.dropdown",t).defaultPrevented)return;const e=hi.getParentFromElement(this._element);this._inNavbar?U.setDataAttribute(this._menu,"popper","none"):this._createPopper(e),"ontouchstart"in document.documentElement&&!e.closest(".navbar-nav")&&[].concat(...document.body.children).forEach((t=>j.on(t,"mouseover",d))),this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(Je),this._element.classList.add(Je),j.trigger(this._element,"shown.bs.dropdown",t)}hide(){if(c(this._element)||!this._isShown(this._menu))return;const t={relatedTarget:this._element};this._completeHide(t)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(t){j.trigger(this._element,"hide.bs.dropdown",t).defaultPrevented||("ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach((t=>j.off(t,"mouseover",d))),this._popper&&this._popper.destroy(),this._menu.classList.remove(Je),this._element.classList.remove(Je),this._element.setAttribute("aria-expanded","false"),U.removeDataAttribute(this._menu,"popper"),j.trigger(this._element,"hidden.bs.dropdown",t))}_getConfig(t){if(t={...this.constructor.Default,...U.getDataAttributes(this._element),...t},a(Ue,t,this.constructor.DefaultType),"object"==typeof t.reference&&!o(t.reference)&&"function"!=typeof t.reference.getBoundingClientRect)throw new TypeError(`${Ue.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);return t}_createPopper(t){if(void 0===Fe)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");let e=this._element;"parent"===this._config.reference?e=t:o(this._config.reference)?e=r(this._config.reference):"object"==typeof this._config.reference&&(e=this._config.reference);const i=this._getPopperConfig(),n=i.modifiers.find((t=>"applyStyles"===t.name&&!1===t.enabled));this._popper=qe(e,this._menu,i),n&&U.setDataAttribute(this._menu,"popper","static")}_isShown(t=this._element){return t.classList.contains(Je)}_getMenuElement(){return V.next(this._element,ei)[0]}_getPlacement(){const t=this._element.parentNode;if(t.classList.contains("dropend"))return ri;if(t.classList.contains("dropstart"))return ai;const e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?ni:ii:e?oi:si}_detectNavbar(){return null!==this._element.closest(".navbar")}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_getPopperConfig(){const t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return"static"===this._config.display&&(t.modifiers=[{name:"applyStyles",enabled:!1}]),{...t,..."function"==typeof this._config.popperConfig?this._config.popperConfig(t):this._config.popperConfig}}_selectMenuItem({key:t,target:e}){const i=V.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter(l);i.length&&v(i,e,t===Ye,!i.includes(e)).focus()}static jQueryInterface(t){return this.each((function(){const e=hi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}static clearMenus(t){if(t&&(2===t.button||"keyup"===t.type&&"Tab"!==t.key))return;const e=V.find(ti);for(let i=0,n=e.length;i<n;i++){const n=hi.getInstance(e[i]);if(!n||!1===n._config.autoClose)continue;if(!n._isShown())continue;const s={relatedTarget:n._element};if(t){const e=t.composedPath(),i=e.includes(n._menu);if(e.includes(n._element)||"inside"===n._config.autoClose&&!i||"outside"===n._config.autoClose&&i)continue;if(n._menu.contains(t.target)&&("keyup"===t.type&&"Tab"===t.key||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;"click"===t.type&&(s.clickEvent=t)}n._completeHide(s)}}static getParentFromElement(t){return n(t)||t.parentNode}static dataApiKeydownHandler(t){if(/input|textarea/i.test(t.target.tagName)?t.key===Ke||t.key!==Ve&&(t.key!==Ye&&t.key!==Xe||t.target.closest(ei)):!Qe.test(t.key))return;const e=this.classList.contains(Je);if(!e&&t.key===Ve)return;if(t.preventDefault(),t.stopPropagation(),c(this))return;const i=this.matches(ti)?this:V.prev(this,ti)[0],n=hi.getOrCreateInstance(i);if(t.key!==Ve)return t.key===Xe||t.key===Ye?(e||n.show(),void n._selectMenuItem(t)):void(e&&t.key!==Ke||hi.clearMenus());n.hide()}}j.on(document,Ze,ti,hi.dataApiKeydownHandler),j.on(document,Ze,ei,hi.dataApiKeydownHandler),j.on(document,Ge,hi.clearMenus),j.on(document,"keyup.bs.dropdown.data-api",hi.clearMenus),j.on(document,Ge,ti,(function(t){t.preventDefault(),hi.getOrCreateInstance(this).toggle()})),g(hi);const di=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",ui=".sticky-top";class fi{constructor(){this._element=document.body}getWidth(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}hide(){const t=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,"paddingRight",(e=>e+t)),this._setElementAttributes(di,"paddingRight",(e=>e+t)),this._setElementAttributes(ui,"marginRight",(e=>e-t))}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(t,e,i){const n=this.getWidth();this._applyManipulationCallback(t,(t=>{if(t!==this._element&&window.innerWidth>t.clientWidth+n)return;this._saveInitialAttribute(t,e);const s=window.getComputedStyle(t)[e];t.style[e]=`${i(Number.parseFloat(s))}px`}))}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,"paddingRight"),this._resetElementAttributes(di,"paddingRight"),this._resetElementAttributes(ui,"marginRight")}_saveInitialAttribute(t,e){const i=t.style[e];i&&U.setDataAttribute(t,e,i)}_resetElementAttributes(t,e){this._applyManipulationCallback(t,(t=>{const i=U.getDataAttribute(t,e);void 0===i?t.style.removeProperty(e):(U.removeDataAttribute(t,e),t.style[e]=i)}))}_applyManipulationCallback(t,e){o(t)?e(t):V.find(t,this._element).forEach(e)}isOverflowing(){return this.getWidth()>0}}const pi={className:"modal-backdrop",isVisible:!0,isAnimated:!1,rootElement:"body",clickCallback:null},mi={className:"string",isVisible:"boolean",isAnimated:"boolean",rootElement:"(element|string)",clickCallback:"(function|null)"},gi="show",_i="mousedown.bs.backdrop";class bi{constructor(t){this._config=this._getConfig(t),this._isAppended=!1,this._element=null}show(t){this._config.isVisible?(this._append(),this._config.isAnimated&&u(this._getElement()),this._getElement().classList.add(gi),this._emulateAnimation((()=>{_(t)}))):_(t)}hide(t){this._config.isVisible?(this._getElement().classList.remove(gi),this._emulateAnimation((()=>{this.dispose(),_(t)}))):_(t)}_getElement(){if(!this._element){const t=document.createElement("div");t.className=this._config.className,this._config.isAnimated&&t.classList.add("fade"),this._element=t}return this._element}_getConfig(t){return(t={...pi,..."object"==typeof t?t:{}}).rootElement=r(t.rootElement),a("backdrop",t,mi),t}_append(){this._isAppended||(this._config.rootElement.append(this._getElement()),j.on(this._getElement(),_i,(()=>{_(this._config.clickCallback)})),this._isAppended=!0)}dispose(){this._isAppended&&(j.off(this._element,_i),this._element.remove(),this._isAppended=!1)}_emulateAnimation(t){b(t,this._getElement(),this._config.isAnimated)}}const vi={trapElement:null,autofocus:!0},yi={trapElement:"element",autofocus:"boolean"},wi=".bs.focustrap",Ei="backward";class Ai{constructor(t){this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}activate(){const{trapElement:t,autofocus:e}=this._config;this._isActive||(e&&t.focus(),j.off(document,wi),j.on(document,"focusin.bs.focustrap",(t=>this._handleFocusin(t))),j.on(document,"keydown.tab.bs.focustrap",(t=>this._handleKeydown(t))),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,j.off(document,wi))}_handleFocusin(t){const{target:e}=t,{trapElement:i}=this._config;if(e===document||e===i||i.contains(e))return;const n=V.focusableChildren(i);0===n.length?i.focus():this._lastTabNavDirection===Ei?n[n.length-1].focus():n[0].focus()}_handleKeydown(t){"Tab"===t.key&&(this._lastTabNavDirection=t.shiftKey?Ei:"forward")}_getConfig(t){return t={...vi,..."object"==typeof t?t:{}},a("focustrap",t,yi),t}}const Ti="modal",Oi="Escape",Ci={backdrop:!0,keyboard:!0,focus:!0},ki={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean"},Li="hidden.bs.modal",xi="show.bs.modal",Di="resize.bs.modal",Si="click.dismiss.bs.modal",Ni="keydown.dismiss.bs.modal",Ii="mousedown.dismiss.bs.modal",Pi="modal-open",ji="show",Mi="modal-static";class Hi extends B{constructor(t,e){super(t),this._config=this._getConfig(e),this._dialog=V.findOne(".modal-dialog",this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollBar=new fi}static get Default(){return Ci}static get NAME(){return Ti}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||this._isTransitioning||j.trigger(this._element,xi,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isAnimated()&&(this._isTransitioning=!0),this._scrollBar.hide(),document.body.classList.add(Pi),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),j.on(this._dialog,Ii,(()=>{j.one(this._element,"mouseup.dismiss.bs.modal",(t=>{t.target===this._element&&(this._ignoreBackdropClick=!0)}))})),this._showBackdrop((()=>this._showElement(t))))}hide(){if(!this._isShown||this._isTransitioning)return;if(j.trigger(this._element,"hide.bs.modal").defaultPrevented)return;this._isShown=!1;const t=this._isAnimated();t&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),this._focustrap.deactivate(),this._element.classList.remove(ji),j.off(this._element,Si),j.off(this._dialog,Ii),this._queueCallback((()=>this._hideModal()),this._element,t)}dispose(){[window,this._dialog].forEach((t=>j.off(t,".bs.modal"))),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new bi({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new Ai({trapElement:this._element})}_getConfig(t){return t={...Ci,...U.getDataAttributes(this._element),..."object"==typeof t?t:{}},a(Ti,t,ki),t}_showElement(t){const e=this._isAnimated(),i=V.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,i&&(i.scrollTop=0),e&&u(this._element),this._element.classList.add(ji),this._queueCallback((()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,j.trigger(this._element,"shown.bs.modal",{relatedTarget:t})}),this._dialog,e)}_setEscapeEvent(){this._isShown?j.on(this._element,Ni,(t=>{this._config.keyboard&&t.key===Oi?(t.preventDefault(),this.hide()):this._config.keyboard||t.key!==Oi||this._triggerBackdropTransition()})):j.off(this._element,Ni)}_setResizeEvent(){this._isShown?j.on(window,Di,(()=>this._adjustDialog())):j.off(window,Di)}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide((()=>{document.body.classList.remove(Pi),this._resetAdjustments(),this._scrollBar.reset(),j.trigger(this._element,Li)}))}_showBackdrop(t){j.on(this._element,Si,(t=>{this._ignoreBackdropClick?this._ignoreBackdropClick=!1:t.target===t.currentTarget&&(!0===this._config.backdrop?this.hide():"static"===this._config.backdrop&&this._triggerBackdropTransition())})),this._backdrop.show(t)}_isAnimated(){return this._element.classList.contains("fade")}_triggerBackdropTransition(){if(j.trigger(this._element,"hidePrevented.bs.modal").defaultPrevented)return;const{classList:t,scrollHeight:e,style:i}=this._element,n=e>document.documentElement.clientHeight;!n&&"hidden"===i.overflowY||t.contains(Mi)||(n||(i.overflowY="hidden"),t.add(Mi),this._queueCallback((()=>{t.remove(Mi),n||this._queueCallback((()=>{i.overflowY=""}),this._dialog)}),this._dialog),this._element.focus())}_adjustDialog(){const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),i=e>0;(!i&&t&&!m()||i&&!t&&m())&&(this._element.style.paddingLeft=`${e}px`),(i&&!t&&!m()||!i&&t&&m())&&(this._element.style.paddingRight=`${e}px`)}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(t,e){return this.each((function(){const i=Hi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](e)}}))}}j.on(document,"click.bs.modal.data-api",'[data-bs-toggle="modal"]',(function(t){const e=n(this);["A","AREA"].includes(this.tagName)&&t.preventDefault(),j.one(e,xi,(t=>{t.defaultPrevented||j.one(e,Li,(()=>{l(this)&&this.focus()}))}));const i=V.findOne(".modal.show");i&&Hi.getInstance(i).hide(),Hi.getOrCreateInstance(e).toggle(this)})),R(Hi),g(Hi);const Bi="offcanvas",Ri={backdrop:!0,keyboard:!0,scroll:!1},Wi={backdrop:"boolean",keyboard:"boolean",scroll:"boolean"},$i="show",zi=".offcanvas.show",qi="hidden.bs.offcanvas";class Fi extends B{constructor(t,e){super(t),this._config=this._getConfig(e),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get NAME(){return Bi}static get Default(){return Ri}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||j.trigger(this._element,"show.bs.offcanvas",{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._element.style.visibility="visible",this._backdrop.show(),this._config.scroll||(new fi).hide(),this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add($i),this._queueCallback((()=>{this._config.scroll||this._focustrap.activate(),j.trigger(this._element,"shown.bs.offcanvas",{relatedTarget:t})}),this._element,!0))}hide(){this._isShown&&(j.trigger(this._element,"hide.bs.offcanvas").defaultPrevented||(this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.remove($i),this._backdrop.hide(),this._queueCallback((()=>{this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._element.style.visibility="hidden",this._config.scroll||(new fi).reset(),j.trigger(this._element,qi)}),this._element,!0)))}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_getConfig(t){return t={...Ri,...U.getDataAttributes(this._element),..."object"==typeof t?t:{}},a(Bi,t,Wi),t}_initializeBackDrop(){return new bi({className:"offcanvas-backdrop",isVisible:this._config.backdrop,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:()=>this.hide()})}_initializeFocusTrap(){return new Ai({trapElement:this._element})}_addEventListeners(){j.on(this._element,"keydown.dismiss.bs.offcanvas",(t=>{this._config.keyboard&&"Escape"===t.key&&this.hide()}))}static jQueryInterface(t){return this.each((function(){const e=Fi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}j.on(document,"click.bs.offcanvas.data-api",'[data-bs-toggle="offcanvas"]',(function(t){const e=n(this);if(["A","AREA"].includes(this.tagName)&&t.preventDefault(),c(this))return;j.one(e,qi,(()=>{l(this)&&this.focus()}));const i=V.findOne(zi);i&&i!==e&&Fi.getInstance(i).hide(),Fi.getOrCreateInstance(e).toggle(this)})),j.on(window,"load.bs.offcanvas.data-api",(()=>V.find(zi).forEach((t=>Fi.getOrCreateInstance(t).show())))),R(Fi),g(Fi);const Ui=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),Vi=/^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,Ki=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,Xi=(t,e)=>{const i=t.nodeName.toLowerCase();if(e.includes(i))return!Ui.has(i)||Boolean(Vi.test(t.nodeValue)||Ki.test(t.nodeValue));const n=e.filter((t=>t instanceof RegExp));for(let t=0,e=n.length;t<e;t++)if(n[t].test(i))return!0;return!1};function Yi(t,e,i){if(!t.length)return t;if(i&&"function"==typeof i)return i(t);const n=(new window.DOMParser).parseFromString(t,"text/html"),s=[].concat(...n.body.querySelectorAll("*"));for(let t=0,i=s.length;t<i;t++){const i=s[t],n=i.nodeName.toLowerCase();if(!Object.keys(e).includes(n)){i.remove();continue}const o=[].concat(...i.attributes),r=[].concat(e["*"]||[],e[n]||[]);o.forEach((t=>{Xi(t,r)||i.removeAttribute(t.nodeName)}))}return n.body.innerHTML}const Qi="tooltip",Gi=new Set(["sanitize","allowList","sanitizeFn"]),Zi={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(array|string|function)",container:"(string|element|boolean)",fallbackPlacements:"array",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object|function)"},Ji={AUTO:"auto",TOP:"top",RIGHT:m()?"left":"right",BOTTOM:"bottom",LEFT:m()?"right":"left"},tn={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:[0,0],container:!1,fallbackPlacements:["top","right","bottom","left"],boundary:"clippingParents",customClass:"",sanitize:!0,sanitizeFn:null,allowList:{"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},popperConfig:null},en={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},nn="fade",sn="show",on="show",rn="out",an=".tooltip-inner",ln=".modal",cn="hide.bs.modal",hn="hover",dn="focus";class un extends B{constructor(t,e){if(void 0===Fe)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");super(t),this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this._config=this._getConfig(e),this.tip=null,this._setListeners()}static get Default(){return tn}static get NAME(){return Qi}static get Event(){return en}static get DefaultType(){return Zi}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(t){if(this._isEnabled)if(t){const e=this._initializeOnDelegatedTarget(t);e._activeTrigger.click=!e._activeTrigger.click,e._isWithActiveTrigger()?e._enter(null,e):e._leave(null,e)}else{if(this.getTipElement().classList.contains(sn))return void this._leave(null,this);this._enter(null,this)}}dispose(){clearTimeout(this._timeout),j.off(this._element.closest(ln),cn,this._hideModalHandler),this.tip&&this.tip.remove(),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this.isWithContent()||!this._isEnabled)return;const t=j.trigger(this._element,this.constructor.Event.SHOW),e=h(this._element),i=null===e?this._element.ownerDocument.documentElement.contains(this._element):e.contains(this._element);if(t.defaultPrevented||!i)return;"tooltip"===this.constructor.NAME&&this.tip&&this.getTitle()!==this.tip.querySelector(an).innerHTML&&(this._disposePopper(),this.tip.remove(),this.tip=null);const n=this.getTipElement(),s=(t=>{do{t+=Math.floor(1e6*Math.random())}while(document.getElementById(t));return t})(this.constructor.NAME);n.setAttribute("id",s),this._element.setAttribute("aria-describedby",s),this._config.animation&&n.classList.add(nn);const o="function"==typeof this._config.placement?this._config.placement.call(this,n,this._element):this._config.placement,r=this._getAttachment(o);this._addAttachmentClass(r);const{container:a}=this._config;H.set(n,this.constructor.DATA_KEY,this),this._element.ownerDocument.documentElement.contains(this.tip)||(a.append(n),j.trigger(this._element,this.constructor.Event.INSERTED)),this._popper?this._popper.update():this._popper=qe(this._element,n,this._getPopperConfig(r)),n.classList.add(sn);const l=this._resolvePossibleFunction(this._config.customClass);l&&n.classList.add(...l.split(" ")),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach((t=>{j.on(t,"mouseover",d)}));const c=this.tip.classList.contains(nn);this._queueCallback((()=>{const t=this._hoverState;this._hoverState=null,j.trigger(this._element,this.constructor.Event.SHOWN),t===rn&&this._leave(null,this)}),this.tip,c)}hide(){if(!this._popper)return;const t=this.getTipElement();if(j.trigger(this._element,this.constructor.Event.HIDE).defaultPrevented)return;t.classList.remove(sn),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach((t=>j.off(t,"mouseover",d))),this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1;const e=this.tip.classList.contains(nn);this._queueCallback((()=>{this._isWithActiveTrigger()||(this._hoverState!==on&&t.remove(),this._cleanTipClass(),this._element.removeAttribute("aria-describedby"),j.trigger(this._element,this.constructor.Event.HIDDEN),this._disposePopper())}),this.tip,e),this._hoverState=""}update(){null!==this._popper&&this._popper.update()}isWithContent(){return Boolean(this.getTitle())}getTipElement(){if(this.tip)return this.tip;const t=document.createElement("div");t.innerHTML=this._config.template;const e=t.children[0];return this.setContent(e),e.classList.remove(nn,sn),this.tip=e,this.tip}setContent(t){this._sanitizeAndSetContent(t,this.getTitle(),an)}_sanitizeAndSetContent(t,e,i){const n=V.findOne(i,t);e||!n?this.setElementContent(n,e):n.remove()}setElementContent(t,e){if(null!==t)return o(e)?(e=r(e),void(this._config.html?e.parentNode!==t&&(t.innerHTML="",t.append(e)):t.textContent=e.textContent)):void(this._config.html?(this._config.sanitize&&(e=Yi(e,this._config.allowList,this._config.sanitizeFn)),t.innerHTML=e):t.textContent=e)}getTitle(){const t=this._element.getAttribute("data-bs-original-title")||this._config.title;return this._resolvePossibleFunction(t)}updateAttachment(t){return"right"===t?"end":"left"===t?"start":t}_initializeOnDelegatedTarget(t,e){return e||this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_resolvePossibleFunction(t){return"function"==typeof t?t.call(this._element):t}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"onChange",enabled:!0,phase:"afterWrite",fn:t=>this._handlePopperPlacementChange(t)}],onFirstUpdate:t=>{t.options.placement!==t.placement&&this._handlePopperPlacementChange(t)}};return{...e,..."function"==typeof this._config.popperConfig?this._config.popperConfig(e):this._config.popperConfig}}_addAttachmentClass(t){this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(t)}`)}_getAttachment(t){return Ji[t.toUpperCase()]}_setListeners(){this._config.trigger.split(" ").forEach((t=>{if("click"===t)j.on(this._element,this.constructor.Event.CLICK,this._config.selector,(t=>this.toggle(t)));else if("manual"!==t){const e=t===hn?this.constructor.Event.MOUSEENTER:this.constructor.Event.FOCUSIN,i=t===hn?this.constructor.Event.MOUSELEAVE:this.constructor.Event.FOCUSOUT;j.on(this._element,e,this._config.selector,(t=>this._enter(t))),j.on(this._element,i,this._config.selector,(t=>this._leave(t)))}})),this._hideModalHandler=()=>{this._element&&this.hide()},j.on(this._element.closest(ln),cn,this._hideModalHandler),this._config.selector?this._config={...this._config,trigger:"manual",selector:""}:this._fixTitle()}_fixTitle(){const t=this._element.getAttribute("title"),e=typeof this._element.getAttribute("data-bs-original-title");(t||"string"!==e)&&(this._element.setAttribute("data-bs-original-title",t||""),!t||this._element.getAttribute("aria-label")||this._element.textContent||this._element.setAttribute("aria-label",t),this._element.setAttribute("title",""))}_enter(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusin"===t.type?dn:hn]=!0),e.getTipElement().classList.contains(sn)||e._hoverState===on?e._hoverState=on:(clearTimeout(e._timeout),e._hoverState=on,e._config.delay&&e._config.delay.show?e._timeout=setTimeout((()=>{e._hoverState===on&&e.show()}),e._config.delay.show):e.show())}_leave(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusout"===t.type?dn:hn]=e._element.contains(t.relatedTarget)),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=rn,e._config.delay&&e._config.delay.hide?e._timeout=setTimeout((()=>{e._hoverState===rn&&e.hide()}),e._config.delay.hide):e.hide())}_isWithActiveTrigger(){for(const t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1}_getConfig(t){const e=U.getDataAttributes(this._element);return Object.keys(e).forEach((t=>{Gi.has(t)&&delete e[t]})),(t={...this.constructor.Default,...e,..."object"==typeof t&&t?t:{}}).container=!1===t.container?document.body:r(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),a(Qi,t,this.constructor.DefaultType),t.sanitize&&(t.template=Yi(t.template,t.allowList,t.sanitizeFn)),t}_getDelegateConfig(){const t={};for(const e in this._config)this.constructor.Default[e]!==this._config[e]&&(t[e]=this._config[e]);return t}_cleanTipClass(){const t=this.getTipElement(),e=new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`,"g"),i=t.getAttribute("class").match(e);null!==i&&i.length>0&&i.map((t=>t.trim())).forEach((e=>t.classList.remove(e)))}_getBasicClassPrefix(){return"bs-tooltip"}_handlePopperPlacementChange(t){const{state:e}=t;e&&(this.tip=e.elements.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(e.placement)))}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null)}static jQueryInterface(t){return this.each((function(){const e=un.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}g(un);const fn={...un.Default,placement:"right",offset:[0,8],trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'},pn={...un.DefaultType,content:"(string|element|function)"},mn={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"};class gn extends un{static get Default(){return fn}static get NAME(){return"popover"}static get Event(){return mn}static get DefaultType(){return pn}isWithContent(){return this.getTitle()||this._getContent()}setContent(t){this._sanitizeAndSetContent(t,this.getTitle(),".popover-header"),this._sanitizeAndSetContent(t,this._getContent(),".popover-body")}_getContent(){return this._resolvePossibleFunction(this._config.content)}_getBasicClassPrefix(){return"bs-popover"}static jQueryInterface(t){return this.each((function(){const e=gn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}g(gn);const _n="scrollspy",bn={offset:10,method:"auto",target:""},vn={offset:"number",method:"string",target:"(string|element)"},yn="active",wn=".nav-link, .list-group-item, .dropdown-item",En="position";class An extends B{constructor(t,e){super(t),this._scrollElement="BODY"===this._element.tagName?window:this._element,this._config=this._getConfig(e),this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,j.on(this._scrollElement,"scroll.bs.scrollspy",(()=>this._process())),this.refresh(),this._process()}static get Default(){return bn}static get NAME(){return _n}refresh(){const t=this._scrollElement===this._scrollElement.window?"offset":En,e="auto"===this._config.method?t:this._config.method,n=e===En?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),V.find(wn,this._config.target).map((t=>{const s=i(t),o=s?V.findOne(s):null;if(o){const t=o.getBoundingClientRect();if(t.width||t.height)return[U[e](o).top+n,s]}return null})).filter((t=>t)).sort(((t,e)=>t[0]-e[0])).forEach((t=>{this._offsets.push(t[0]),this._targets.push(t[1])}))}dispose(){j.off(this._scrollElement,".bs.scrollspy"),super.dispose()}_getConfig(t){return(t={...bn,...U.getDataAttributes(this._element),..."object"==typeof t&&t?t:{}}).target=r(t.target)||document.documentElement,a(_n,t,vn),t}_getScrollTop(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop}_getScrollHeight(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}_getOffsetHeight(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height}_process(){const t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),i=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=i){const t=this._targets[this._targets.length-1];this._activeTarget!==t&&this._activate(t)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(let e=this._offsets.length;e--;)this._activeTarget!==this._targets[e]&&t>=this._offsets[e]&&(void 0===this._offsets[e+1]||t<this._offsets[e+1])&&this._activate(this._targets[e])}}_activate(t){this._activeTarget=t,this._clear();const e=wn.split(",").map((e=>`${e}[data-bs-target="${t}"],${e}[href="${t}"]`)),i=V.findOne(e.join(","),this._config.target);i.classList.add(yn),i.classList.contains("dropdown-item")?V.findOne(".dropdown-toggle",i.closest(".dropdown")).classList.add(yn):V.parents(i,".nav, .list-group").forEach((t=>{V.prev(t,".nav-link, .list-group-item").forEach((t=>t.classList.add(yn))),V.prev(t,".nav-item").forEach((t=>{V.children(t,".nav-link").forEach((t=>t.classList.add(yn)))}))})),j.trigger(this._scrollElement,"activate.bs.scrollspy",{relatedTarget:t})}_clear(){V.find(wn,this._config.target).filter((t=>t.classList.contains(yn))).forEach((t=>t.classList.remove(yn)))}static jQueryInterface(t){return this.each((function(){const e=An.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}j.on(window,"load.bs.scrollspy.data-api",(()=>{V.find('[data-bs-spy="scroll"]').forEach((t=>new An(t)))})),g(An);const Tn="active",On="fade",Cn="show",kn=".active",Ln=":scope > li > .active";class xn extends B{static get NAME(){return"tab"}show(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains(Tn))return;let t;const e=n(this._element),i=this._element.closest(".nav, .list-group");if(i){const e="UL"===i.nodeName||"OL"===i.nodeName?Ln:kn;t=V.find(e,i),t=t[t.length-1]}const s=t?j.trigger(t,"hide.bs.tab",{relatedTarget:this._element}):null;if(j.trigger(this._element,"show.bs.tab",{relatedTarget:t}).defaultPrevented||null!==s&&s.defaultPrevented)return;this._activate(this._element,i);const o=()=>{j.trigger(t,"hidden.bs.tab",{relatedTarget:this._element}),j.trigger(this._element,"shown.bs.tab",{relatedTarget:t})};e?this._activate(e,e.parentNode,o):o()}_activate(t,e,i){const n=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?V.children(e,kn):V.find(Ln,e))[0],s=i&&n&&n.classList.contains(On),o=()=>this._transitionComplete(t,n,i);n&&s?(n.classList.remove(Cn),this._queueCallback(o,t,!0)):o()}_transitionComplete(t,e,i){if(e){e.classList.remove(Tn);const t=V.findOne(":scope > .dropdown-menu .active",e.parentNode);t&&t.classList.remove(Tn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}t.classList.add(Tn),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),u(t),t.classList.contains(On)&&t.classList.add(Cn);let n=t.parentNode;if(n&&"LI"===n.nodeName&&(n=n.parentNode),n&&n.classList.contains("dropdown-menu")){const e=t.closest(".dropdown");e&&V.find(".dropdown-toggle",e).forEach((t=>t.classList.add(Tn))),t.setAttribute("aria-expanded",!0)}i&&i()}static jQueryInterface(t){return this.each((function(){const e=xn.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}j.on(document,"click.bs.tab.data-api",'[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',(function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),c(this)||xn.getOrCreateInstance(this).show()})),g(xn);const Dn="toast",Sn="hide",Nn="show",In="showing",Pn={animation:"boolean",autohide:"boolean",delay:"number"},jn={animation:!0,autohide:!0,delay:5e3};class Mn extends B{constructor(t,e){super(t),this._config=this._getConfig(e),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get DefaultType(){return Pn}static get Default(){return jn}static get NAME(){return Dn}show(){j.trigger(this._element,"show.bs.toast").defaultPrevented||(this._clearTimeout(),this._config.animation&&this._element.classList.add("fade"),this._element.classList.remove(Sn),u(this._element),this._element.classList.add(Nn),this._element.classList.add(In),this._queueCallback((()=>{this._element.classList.remove(In),j.trigger(this._element,"shown.bs.toast"),this._maybeScheduleHide()}),this._element,this._config.animation))}hide(){this._element.classList.contains(Nn)&&(j.trigger(this._element,"hide.bs.toast").defaultPrevented||(this._element.classList.add(In),this._queueCallback((()=>{this._element.classList.add(Sn),this._element.classList.remove(In),this._element.classList.remove(Nn),j.trigger(this._element,"hidden.bs.toast")}),this._element,this._config.animation)))}dispose(){this._clearTimeout(),this._element.classList.contains(Nn)&&this._element.classList.remove(Nn),super.dispose()}_getConfig(t){return t={...jn,...U.getDataAttributes(this._element),..."object"==typeof t&&t?t:{}},a(Dn,t,this.constructor.DefaultType),t}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout((()=>{this.hide()}),this._config.delay)))}_onInteraction(t,e){switch(t.type){case"mouseover":case"mouseout":this._hasMouseInteraction=e;break;case"focusin":case"focusout":this._hasKeyboardInteraction=e}if(e)return void this._clearTimeout();const i=t.relatedTarget;this._element===i||this._element.contains(i)||this._maybeScheduleHide()}_setListeners(){j.on(this._element,"mouseover.bs.toast",(t=>this._onInteraction(t,!0))),j.on(this._element,"mouseout.bs.toast",(t=>this._onInteraction(t,!1))),j.on(this._element,"focusin.bs.toast",(t=>this._onInteraction(t,!0))),j.on(this._element,"focusout.bs.toast",(t=>this._onInteraction(t,!1)))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(t){return this.each((function(){const e=Mn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}return R(Mn),g(Mn),{Alert:W,Button:z,Carousel:st,Collapse:pt,Dropdown:hi,Modal:Hi,Offcanvas:Fi,Popover:gn,ScrollSpy:An,Tab:xn,Toast:Mn,Tooltip:un}}));
//# sourceMappingURL=bootstrap.bundle.min.js.map

/***/ }),

/***/ "./node_modules/bootstrap/js/dist/base-component.js":
/*!**********************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/base-component.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap base-component.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__(/*! ./dom/data.js */ "./node_modules/bootstrap/js/dist/dom/data.js"), __webpack_require__(/*! ./dom/event-handler.js */ "./node_modules/bootstrap/js/dist/dom/event-handler.js")) :
  0;
})(this, (function (Data, EventHandler) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return document.querySelector(obj);
    }

    return null;
  };

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }

    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;

    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }

      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };

    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.1.3';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data__default.default.remove(this._element, this.constructor.DATA_KEY);
      EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    /** Static */


    static getInstance(element) {
      return Data__default.default.get(getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }

  return BaseComponent;

}));
//# sourceMappingURL=base-component.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/dom/data.js":
/*!****************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/dom/data.js ***!
  \****************************************************/
/***/ (function(module) {

/*!
  * Bootstrap data.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  const data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  return data;

}));
//# sourceMappingURL=data.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/dom/event-handler.js":
/*!*************************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/dom/event-handler.js ***!
  \*************************************************************/
/***/ (function(module) {

/*!
  * Bootstrap event-handler.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  return EventHandler;

}));
//# sourceMappingURL=event-handler.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/dom/manipulator.js":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/dom/manipulator.js ***!
  \***********************************************************/
/***/ (function(module) {

/*!
  * Bootstrap manipulator.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  return Manipulator;

}));
//# sourceMappingURL=manipulator.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/dom/selector-engine.js":
/*!***************************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/dom/selector-engine.js ***!
  \***************************************************************/
/***/ (function(module) {

/*!
  * Bootstrap selector-engine.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
    }

    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  };

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    },

    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    }

  };

  return SelectorEngine;

}));
//# sourceMappingURL=selector-engine.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/popover.js":
/*!***************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/popover.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap popover.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__(/*! ./tooltip.js */ "./node_modules/bootstrap/js/dist/tooltip.js")) :
  0;
})(this, (function (Tooltip) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const Tooltip__default = /*#__PURE__*/_interopDefaultLegacy(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const DOMContentLoadedCallbacks = [];

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          DOMContentLoadedCallbacks.forEach(callback => callback());
        });
      }

      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'popover';
  const DATA_KEY = 'bs.popover';
  const EVENT_KEY = `.${DATA_KEY}`;
  const CLASS_PREFIX = 'bs-popover';
  const Default = { ...Tooltip__default.default.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType = { ...Tooltip__default.default.DefaultType,
    content: '(string|element|function)'
  };
  const Event = {
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    INSERTED: `inserted${EVENT_KEY}`,
    CLICK: `click${EVENT_KEY}`,
    FOCUSIN: `focusin${EVENT_KEY}`,
    FOCUSOUT: `focusout${EVENT_KEY}`,
    MOUSEENTER: `mouseenter${EVENT_KEY}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY}`
  };
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip__default.default {
    // Getters
    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    }

    static get Event() {
      return Event;
    }

    static get DefaultType() {
      return DefaultType;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

      this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
    } // Private


    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  return Popover;

}));
//# sourceMappingURL=popover.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/tooltip.js":
/*!***************************************************!*\
  !*** ./node_modules/bootstrap/js/dist/tooltip.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap tooltip.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js"), __webpack_require__(/*! ./dom/data.js */ "./node_modules/bootstrap/js/dist/dom/data.js"), __webpack_require__(/*! ./dom/event-handler.js */ "./node_modules/bootstrap/js/dist/dom/event-handler.js"), __webpack_require__(/*! ./dom/manipulator.js */ "./node_modules/bootstrap/js/dist/dom/manipulator.js"), __webpack_require__(/*! ./dom/selector-engine.js */ "./node_modules/bootstrap/js/dist/dom/selector-engine.js"), __webpack_require__(/*! ./base-component.js */ "./node_modules/bootstrap/js/dist/base-component.js")) :
  0;
})(this, (function (Popper, Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    const n = Object.create(null);
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return document.querySelector(obj);
    }

    return null;
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  const noop = () => {};

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const DOMContentLoadedCallbacks = [];

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          DOMContentLoadedCallbacks.forEach(callback => callback());
        });
      }

      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
      }

      return true;
    }

    const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attributeName)) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const element = elements[i];
      const elementName = element.nodeName.toLowerCase();

      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }

      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
      attributeList.forEach(attribute => {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'tooltip';
  const DATA_KEY = 'bs.tooltip';
  const EVENT_KEY = `.${DATA_KEY}`;
  const CLASS_PREFIX = 'bs-tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event = {
    HIDE: `hide${EVENT_KEY}`,
    HIDDEN: `hidden${EVENT_KEY}`,
    SHOW: `show${EVENT_KEY}`,
    SHOWN: `shown${EVENT_KEY}`,
    INSERTED: `inserted${EVENT_KEY}`,
    CLICK: `click${EVENT_KEY}`,
    FOCUSIN: `focusin${EVENT_KEY}`,
    FOCUSOUT: `focusout${EVENT_KEY}`,
    MOUSEENTER: `mouseenter${EVENT_KEY}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY}`
  };
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent__default.default {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    }

    static get Event() {
      return Event;
    }

    static get DefaultType() {
      return DefaultType;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler__default.default.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this.tip) {
        this.tip.remove();
      }

      this._disposePopper();

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler__default.default.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
      // This will be removed later in favor of a `setContent` method


      if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
        this._disposePopper();

        this.tip.remove();
        this.tip = null;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data__default.default.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler__default.default.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW);

      const customClass = this._resolvePossibleFunction(this._config.customClass);

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler__default.default.on(element, 'mouseover', noop);
        });
      }

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler__default.default.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW) {
          tip.remove();
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler__default.default.trigger(this._element, this.constructor.Event.HIDDEN);

        this._disposePopper();
      };

      const hideEvent = EventHandler__default.default.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler__default.default.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      const tip = element.children[0];
      this.setContent(tip);
      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);
      this.tip = tip;
      return this.tip;
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
    }

    _sanitizeAndSetContent(template, content, selector) {
      const templateElement = SelectorEngine__default.default.findOne(selector, template);

      if (!content && templateElement) {
        templateElement.remove();
        return;
      } // we use append for html objects to maintain js events


      this.setElementContent(templateElement, content);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.append(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }

    getTitle() {
      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

      return this._resolvePossibleFunction(title);
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _resolvePossibleFunction(content) {
      return typeof content === 'function' ? content.call(this._element) : content;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler__default.default.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler__default.default.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler__default.default.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };

      EventHandler__default.default.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator__default.default.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      for (const key in this._config) {
        if (this.constructor.Default[key] !== this._config[key]) {
          config[key] = this._config[key];
        }
      } // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`


      return config;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX;
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    }

    _disposePopper() {
      if (this._popper) {
        this._popper.destroy();

        this._popper = null;
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  return Tooltip;

}));
//# sourceMappingURL=tooltip.js.map


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap-icons/font/bootstrap-icons.scss":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap-icons/font/bootstrap-icons.scss ***!
  \*********************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/bootstrap-icons.woff2?30af91bf14e37666a085fb8a161ff36d */ "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2?30af91bf14e37666a085fb8a161ff36d"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/bootstrap-icons.woff?30af91bf14e37666a085fb8a161ff36d */ "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff?30af91bf14e37666a085fb8a161ff36d"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n@font-face {\n  font-family: \"bootstrap-icons\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"woff\"); }\n\n.bi::before,\n[class^=\"bi-\"]::before,\n[class*=\" bi-\"]::before {\n  display: inline-block;\n  font-family: \"bootstrap-icons\" !important;\n  font-style: normal;\n  font-weight: normal !important;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  vertical-align: -.125em;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.bi-123::before {\n  content: \"\"; }\n\n.bi-alarm-fill::before {\n  content: \"\"; }\n\n.bi-alarm::before {\n  content: \"\"; }\n\n.bi-align-bottom::before {\n  content: \"\"; }\n\n.bi-align-center::before {\n  content: \"\"; }\n\n.bi-align-end::before {\n  content: \"\"; }\n\n.bi-align-middle::before {\n  content: \"\"; }\n\n.bi-align-start::before {\n  content: \"\"; }\n\n.bi-align-top::before {\n  content: \"\"; }\n\n.bi-alt::before {\n  content: \"\"; }\n\n.bi-app-indicator::before {\n  content: \"\"; }\n\n.bi-app::before {\n  content: \"\"; }\n\n.bi-archive-fill::before {\n  content: \"\"; }\n\n.bi-archive::before {\n  content: \"\"; }\n\n.bi-arrow-90deg-down::before {\n  content: \"\"; }\n\n.bi-arrow-90deg-left::before {\n  content: \"\"; }\n\n.bi-arrow-90deg-right::before {\n  content: \"\"; }\n\n.bi-arrow-90deg-up::before {\n  content: \"\"; }\n\n.bi-arrow-bar-down::before {\n  content: \"\"; }\n\n.bi-arrow-bar-left::before {\n  content: \"\"; }\n\n.bi-arrow-bar-right::before {\n  content: \"\"; }\n\n.bi-arrow-bar-up::before {\n  content: \"\"; }\n\n.bi-arrow-clockwise::before {\n  content: \"\"; }\n\n.bi-arrow-counterclockwise::before {\n  content: \"\"; }\n\n.bi-arrow-down-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-circle::before {\n  content: \"\"; }\n\n.bi-arrow-down-left-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-left-circle::before {\n  content: \"\"; }\n\n.bi-arrow-down-left-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-left-square::before {\n  content: \"\"; }\n\n.bi-arrow-down-left::before {\n  content: \"\"; }\n\n.bi-arrow-down-right-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-right-circle::before {\n  content: \"\"; }\n\n.bi-arrow-down-right-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-right-square::before {\n  content: \"\"; }\n\n.bi-arrow-down-right::before {\n  content: \"\"; }\n\n.bi-arrow-down-short::before {\n  content: \"\"; }\n\n.bi-arrow-down-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-down-square::before {\n  content: \"\"; }\n\n.bi-arrow-down-up::before {\n  content: \"\"; }\n\n.bi-arrow-down::before {\n  content: \"\"; }\n\n.bi-arrow-left-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-left-circle::before {\n  content: \"\"; }\n\n.bi-arrow-left-right::before {\n  content: \"\"; }\n\n.bi-arrow-left-short::before {\n  content: \"\"; }\n\n.bi-arrow-left-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-left-square::before {\n  content: \"\"; }\n\n.bi-arrow-left::before {\n  content: \"\"; }\n\n.bi-arrow-repeat::before {\n  content: \"\"; }\n\n.bi-arrow-return-left::before {\n  content: \"\"; }\n\n.bi-arrow-return-right::before {\n  content: \"\"; }\n\n.bi-arrow-right-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-right-circle::before {\n  content: \"\"; }\n\n.bi-arrow-right-short::before {\n  content: \"\"; }\n\n.bi-arrow-right-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-right-square::before {\n  content: \"\"; }\n\n.bi-arrow-right::before {\n  content: \"\"; }\n\n.bi-arrow-up-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-circle::before {\n  content: \"\"; }\n\n.bi-arrow-up-left-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-left-circle::before {\n  content: \"\"; }\n\n.bi-arrow-up-left-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-left-square::before {\n  content: \"\"; }\n\n.bi-arrow-up-left::before {\n  content: \"\"; }\n\n.bi-arrow-up-right-circle-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-right-circle::before {\n  content: \"\"; }\n\n.bi-arrow-up-right-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-right-square::before {\n  content: \"\"; }\n\n.bi-arrow-up-right::before {\n  content: \"\"; }\n\n.bi-arrow-up-short::before {\n  content: \"\"; }\n\n.bi-arrow-up-square-fill::before {\n  content: \"\"; }\n\n.bi-arrow-up-square::before {\n  content: \"\"; }\n\n.bi-arrow-up::before {\n  content: \"\"; }\n\n.bi-arrows-angle-contract::before {\n  content: \"\"; }\n\n.bi-arrows-angle-expand::before {\n  content: \"\"; }\n\n.bi-arrows-collapse::before {\n  content: \"\"; }\n\n.bi-arrows-expand::before {\n  content: \"\"; }\n\n.bi-arrows-fullscreen::before {\n  content: \"\"; }\n\n.bi-arrows-move::before {\n  content: \"\"; }\n\n.bi-aspect-ratio-fill::before {\n  content: \"\"; }\n\n.bi-aspect-ratio::before {\n  content: \"\"; }\n\n.bi-asterisk::before {\n  content: \"\"; }\n\n.bi-at::before {\n  content: \"\"; }\n\n.bi-award-fill::before {\n  content: \"\"; }\n\n.bi-award::before {\n  content: \"\"; }\n\n.bi-back::before {\n  content: \"\"; }\n\n.bi-backspace-fill::before {\n  content: \"\"; }\n\n.bi-backspace-reverse-fill::before {\n  content: \"\"; }\n\n.bi-backspace-reverse::before {\n  content: \"\"; }\n\n.bi-backspace::before {\n  content: \"\"; }\n\n.bi-badge-3d-fill::before {\n  content: \"\"; }\n\n.bi-badge-3d::before {\n  content: \"\"; }\n\n.bi-badge-4k-fill::before {\n  content: \"\"; }\n\n.bi-badge-4k::before {\n  content: \"\"; }\n\n.bi-badge-8k-fill::before {\n  content: \"\"; }\n\n.bi-badge-8k::before {\n  content: \"\"; }\n\n.bi-badge-ad-fill::before {\n  content: \"\"; }\n\n.bi-badge-ad::before {\n  content: \"\"; }\n\n.bi-badge-ar-fill::before {\n  content: \"\"; }\n\n.bi-badge-ar::before {\n  content: \"\"; }\n\n.bi-badge-cc-fill::before {\n  content: \"\"; }\n\n.bi-badge-cc::before {\n  content: \"\"; }\n\n.bi-badge-hd-fill::before {\n  content: \"\"; }\n\n.bi-badge-hd::before {\n  content: \"\"; }\n\n.bi-badge-tm-fill::before {\n  content: \"\"; }\n\n.bi-badge-tm::before {\n  content: \"\"; }\n\n.bi-badge-vo-fill::before {\n  content: \"\"; }\n\n.bi-badge-vo::before {\n  content: \"\"; }\n\n.bi-badge-vr-fill::before {\n  content: \"\"; }\n\n.bi-badge-vr::before {\n  content: \"\"; }\n\n.bi-badge-wc-fill::before {\n  content: \"\"; }\n\n.bi-badge-wc::before {\n  content: \"\"; }\n\n.bi-bag-check-fill::before {\n  content: \"\"; }\n\n.bi-bag-check::before {\n  content: \"\"; }\n\n.bi-bag-dash-fill::before {\n  content: \"\"; }\n\n.bi-bag-dash::before {\n  content: \"\"; }\n\n.bi-bag-fill::before {\n  content: \"\"; }\n\n.bi-bag-plus-fill::before {\n  content: \"\"; }\n\n.bi-bag-plus::before {\n  content: \"\"; }\n\n.bi-bag-x-fill::before {\n  content: \"\"; }\n\n.bi-bag-x::before {\n  content: \"\"; }\n\n.bi-bag::before {\n  content: \"\"; }\n\n.bi-bar-chart-fill::before {\n  content: \"\"; }\n\n.bi-bar-chart-line-fill::before {\n  content: \"\"; }\n\n.bi-bar-chart-line::before {\n  content: \"\"; }\n\n.bi-bar-chart-steps::before {\n  content: \"\"; }\n\n.bi-bar-chart::before {\n  content: \"\"; }\n\n.bi-basket-fill::before {\n  content: \"\"; }\n\n.bi-basket::before {\n  content: \"\"; }\n\n.bi-basket2-fill::before {\n  content: \"\"; }\n\n.bi-basket2::before {\n  content: \"\"; }\n\n.bi-basket3-fill::before {\n  content: \"\"; }\n\n.bi-basket3::before {\n  content: \"\"; }\n\n.bi-battery-charging::before {\n  content: \"\"; }\n\n.bi-battery-full::before {\n  content: \"\"; }\n\n.bi-battery-half::before {\n  content: \"\"; }\n\n.bi-battery::before {\n  content: \"\"; }\n\n.bi-bell-fill::before {\n  content: \"\"; }\n\n.bi-bell::before {\n  content: \"\"; }\n\n.bi-bezier::before {\n  content: \"\"; }\n\n.bi-bezier2::before {\n  content: \"\"; }\n\n.bi-bicycle::before {\n  content: \"\"; }\n\n.bi-binoculars-fill::before {\n  content: \"\"; }\n\n.bi-binoculars::before {\n  content: \"\"; }\n\n.bi-blockquote-left::before {\n  content: \"\"; }\n\n.bi-blockquote-right::before {\n  content: \"\"; }\n\n.bi-book-fill::before {\n  content: \"\"; }\n\n.bi-book-half::before {\n  content: \"\"; }\n\n.bi-book::before {\n  content: \"\"; }\n\n.bi-bookmark-check-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-check::before {\n  content: \"\"; }\n\n.bi-bookmark-dash-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-dash::before {\n  content: \"\"; }\n\n.bi-bookmark-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-heart-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-heart::before {\n  content: \"\"; }\n\n.bi-bookmark-plus-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-plus::before {\n  content: \"\"; }\n\n.bi-bookmark-star-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-star::before {\n  content: \"\"; }\n\n.bi-bookmark-x-fill::before {\n  content: \"\"; }\n\n.bi-bookmark-x::before {\n  content: \"\"; }\n\n.bi-bookmark::before {\n  content: \"\"; }\n\n.bi-bookmarks-fill::before {\n  content: \"\"; }\n\n.bi-bookmarks::before {\n  content: \"\"; }\n\n.bi-bookshelf::before {\n  content: \"\"; }\n\n.bi-bootstrap-fill::before {\n  content: \"\"; }\n\n.bi-bootstrap-reboot::before {\n  content: \"\"; }\n\n.bi-bootstrap::before {\n  content: \"\"; }\n\n.bi-border-all::before {\n  content: \"\"; }\n\n.bi-border-bottom::before {\n  content: \"\"; }\n\n.bi-border-center::before {\n  content: \"\"; }\n\n.bi-border-inner::before {\n  content: \"\"; }\n\n.bi-border-left::before {\n  content: \"\"; }\n\n.bi-border-middle::before {\n  content: \"\"; }\n\n.bi-border-outer::before {\n  content: \"\"; }\n\n.bi-border-right::before {\n  content: \"\"; }\n\n.bi-border-style::before {\n  content: \"\"; }\n\n.bi-border-top::before {\n  content: \"\"; }\n\n.bi-border-width::before {\n  content: \"\"; }\n\n.bi-border::before {\n  content: \"\"; }\n\n.bi-bounding-box-circles::before {\n  content: \"\"; }\n\n.bi-bounding-box::before {\n  content: \"\"; }\n\n.bi-box-arrow-down-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-down-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-down::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-down-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-down-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-down::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-up-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-up-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-in-up::before {\n  content: \"\"; }\n\n.bi-box-arrow-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-up-left::before {\n  content: \"\"; }\n\n.bi-box-arrow-up-right::before {\n  content: \"\"; }\n\n.bi-box-arrow-up::before {\n  content: \"\"; }\n\n.bi-box-seam::before {\n  content: \"\"; }\n\n.bi-box::before {\n  content: \"\"; }\n\n.bi-braces::before {\n  content: \"\"; }\n\n.bi-bricks::before {\n  content: \"\"; }\n\n.bi-briefcase-fill::before {\n  content: \"\"; }\n\n.bi-briefcase::before {\n  content: \"\"; }\n\n.bi-brightness-alt-high-fill::before {\n  content: \"\"; }\n\n.bi-brightness-alt-high::before {\n  content: \"\"; }\n\n.bi-brightness-alt-low-fill::before {\n  content: \"\"; }\n\n.bi-brightness-alt-low::before {\n  content: \"\"; }\n\n.bi-brightness-high-fill::before {\n  content: \"\"; }\n\n.bi-brightness-high::before {\n  content: \"\"; }\n\n.bi-brightness-low-fill::before {\n  content: \"\"; }\n\n.bi-brightness-low::before {\n  content: \"\"; }\n\n.bi-broadcast-pin::before {\n  content: \"\"; }\n\n.bi-broadcast::before {\n  content: \"\"; }\n\n.bi-brush-fill::before {\n  content: \"\"; }\n\n.bi-brush::before {\n  content: \"\"; }\n\n.bi-bucket-fill::before {\n  content: \"\"; }\n\n.bi-bucket::before {\n  content: \"\"; }\n\n.bi-bug-fill::before {\n  content: \"\"; }\n\n.bi-bug::before {\n  content: \"\"; }\n\n.bi-building::before {\n  content: \"\"; }\n\n.bi-bullseye::before {\n  content: \"\"; }\n\n.bi-calculator-fill::before {\n  content: \"\"; }\n\n.bi-calculator::before {\n  content: \"\"; }\n\n.bi-calendar-check-fill::before {\n  content: \"\"; }\n\n.bi-calendar-check::before {\n  content: \"\"; }\n\n.bi-calendar-date-fill::before {\n  content: \"\"; }\n\n.bi-calendar-date::before {\n  content: \"\"; }\n\n.bi-calendar-day-fill::before {\n  content: \"\"; }\n\n.bi-calendar-day::before {\n  content: \"\"; }\n\n.bi-calendar-event-fill::before {\n  content: \"\"; }\n\n.bi-calendar-event::before {\n  content: \"\"; }\n\n.bi-calendar-fill::before {\n  content: \"\"; }\n\n.bi-calendar-minus-fill::before {\n  content: \"\"; }\n\n.bi-calendar-minus::before {\n  content: \"\"; }\n\n.bi-calendar-month-fill::before {\n  content: \"\"; }\n\n.bi-calendar-month::before {\n  content: \"\"; }\n\n.bi-calendar-plus-fill::before {\n  content: \"\"; }\n\n.bi-calendar-plus::before {\n  content: \"\"; }\n\n.bi-calendar-range-fill::before {\n  content: \"\"; }\n\n.bi-calendar-range::before {\n  content: \"\"; }\n\n.bi-calendar-week-fill::before {\n  content: \"\"; }\n\n.bi-calendar-week::before {\n  content: \"\"; }\n\n.bi-calendar-x-fill::before {\n  content: \"\"; }\n\n.bi-calendar-x::before {\n  content: \"\"; }\n\n.bi-calendar::before {\n  content: \"\"; }\n\n.bi-calendar2-check-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-check::before {\n  content: \"\"; }\n\n.bi-calendar2-date-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-date::before {\n  content: \"\"; }\n\n.bi-calendar2-day-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-day::before {\n  content: \"\"; }\n\n.bi-calendar2-event-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-event::before {\n  content: \"\"; }\n\n.bi-calendar2-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-minus-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-minus::before {\n  content: \"\"; }\n\n.bi-calendar2-month-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-month::before {\n  content: \"\"; }\n\n.bi-calendar2-plus-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-plus::before {\n  content: \"\"; }\n\n.bi-calendar2-range-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-range::before {\n  content: \"\"; }\n\n.bi-calendar2-week-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-week::before {\n  content: \"\"; }\n\n.bi-calendar2-x-fill::before {\n  content: \"\"; }\n\n.bi-calendar2-x::before {\n  content: \"\"; }\n\n.bi-calendar2::before {\n  content: \"\"; }\n\n.bi-calendar3-event-fill::before {\n  content: \"\"; }\n\n.bi-calendar3-event::before {\n  content: \"\"; }\n\n.bi-calendar3-fill::before {\n  content: \"\"; }\n\n.bi-calendar3-range-fill::before {\n  content: \"\"; }\n\n.bi-calendar3-range::before {\n  content: \"\"; }\n\n.bi-calendar3-week-fill::before {\n  content: \"\"; }\n\n.bi-calendar3-week::before {\n  content: \"\"; }\n\n.bi-calendar3::before {\n  content: \"\"; }\n\n.bi-calendar4-event::before {\n  content: \"\"; }\n\n.bi-calendar4-range::before {\n  content: \"\"; }\n\n.bi-calendar4-week::before {\n  content: \"\"; }\n\n.bi-calendar4::before {\n  content: \"\"; }\n\n.bi-camera-fill::before {\n  content: \"\"; }\n\n.bi-camera-reels-fill::before {\n  content: \"\"; }\n\n.bi-camera-reels::before {\n  content: \"\"; }\n\n.bi-camera-video-fill::before {\n  content: \"\"; }\n\n.bi-camera-video-off-fill::before {\n  content: \"\"; }\n\n.bi-camera-video-off::before {\n  content: \"\"; }\n\n.bi-camera-video::before {\n  content: \"\"; }\n\n.bi-camera::before {\n  content: \"\"; }\n\n.bi-camera2::before {\n  content: \"\"; }\n\n.bi-capslock-fill::before {\n  content: \"\"; }\n\n.bi-capslock::before {\n  content: \"\"; }\n\n.bi-card-checklist::before {\n  content: \"\"; }\n\n.bi-card-heading::before {\n  content: \"\"; }\n\n.bi-card-image::before {\n  content: \"\"; }\n\n.bi-card-list::before {\n  content: \"\"; }\n\n.bi-card-text::before {\n  content: \"\"; }\n\n.bi-caret-down-fill::before {\n  content: \"\"; }\n\n.bi-caret-down-square-fill::before {\n  content: \"\"; }\n\n.bi-caret-down-square::before {\n  content: \"\"; }\n\n.bi-caret-down::before {\n  content: \"\"; }\n\n.bi-caret-left-fill::before {\n  content: \"\"; }\n\n.bi-caret-left-square-fill::before {\n  content: \"\"; }\n\n.bi-caret-left-square::before {\n  content: \"\"; }\n\n.bi-caret-left::before {\n  content: \"\"; }\n\n.bi-caret-right-fill::before {\n  content: \"\"; }\n\n.bi-caret-right-square-fill::before {\n  content: \"\"; }\n\n.bi-caret-right-square::before {\n  content: \"\"; }\n\n.bi-caret-right::before {\n  content: \"\"; }\n\n.bi-caret-up-fill::before {\n  content: \"\"; }\n\n.bi-caret-up-square-fill::before {\n  content: \"\"; }\n\n.bi-caret-up-square::before {\n  content: \"\"; }\n\n.bi-caret-up::before {\n  content: \"\"; }\n\n.bi-cart-check-fill::before {\n  content: \"\"; }\n\n.bi-cart-check::before {\n  content: \"\"; }\n\n.bi-cart-dash-fill::before {\n  content: \"\"; }\n\n.bi-cart-dash::before {\n  content: \"\"; }\n\n.bi-cart-fill::before {\n  content: \"\"; }\n\n.bi-cart-plus-fill::before {\n  content: \"\"; }\n\n.bi-cart-plus::before {\n  content: \"\"; }\n\n.bi-cart-x-fill::before {\n  content: \"\"; }\n\n.bi-cart-x::before {\n  content: \"\"; }\n\n.bi-cart::before {\n  content: \"\"; }\n\n.bi-cart2::before {\n  content: \"\"; }\n\n.bi-cart3::before {\n  content: \"\"; }\n\n.bi-cart4::before {\n  content: \"\"; }\n\n.bi-cash-stack::before {\n  content: \"\"; }\n\n.bi-cash::before {\n  content: \"\"; }\n\n.bi-cast::before {\n  content: \"\"; }\n\n.bi-chat-dots-fill::before {\n  content: \"\"; }\n\n.bi-chat-dots::before {\n  content: \"\"; }\n\n.bi-chat-fill::before {\n  content: \"\"; }\n\n.bi-chat-left-dots-fill::before {\n  content: \"\"; }\n\n.bi-chat-left-dots::before {\n  content: \"\"; }\n\n.bi-chat-left-fill::before {\n  content: \"\"; }\n\n.bi-chat-left-quote-fill::before {\n  content: \"\"; }\n\n.bi-chat-left-quote::before {\n  content: \"\"; }\n\n.bi-chat-left-text-fill::before {\n  content: \"\"; }\n\n.bi-chat-left-text::before {\n  content: \"\"; }\n\n.bi-chat-left::before {\n  content: \"\"; }\n\n.bi-chat-quote-fill::before {\n  content: \"\"; }\n\n.bi-chat-quote::before {\n  content: \"\"; }\n\n.bi-chat-right-dots-fill::before {\n  content: \"\"; }\n\n.bi-chat-right-dots::before {\n  content: \"\"; }\n\n.bi-chat-right-fill::before {\n  content: \"\"; }\n\n.bi-chat-right-quote-fill::before {\n  content: \"\"; }\n\n.bi-chat-right-quote::before {\n  content: \"\"; }\n\n.bi-chat-right-text-fill::before {\n  content: \"\"; }\n\n.bi-chat-right-text::before {\n  content: \"\"; }\n\n.bi-chat-right::before {\n  content: \"\"; }\n\n.bi-chat-square-dots-fill::before {\n  content: \"\"; }\n\n.bi-chat-square-dots::before {\n  content: \"\"; }\n\n.bi-chat-square-fill::before {\n  content: \"\"; }\n\n.bi-chat-square-quote-fill::before {\n  content: \"\"; }\n\n.bi-chat-square-quote::before {\n  content: \"\"; }\n\n.bi-chat-square-text-fill::before {\n  content: \"\"; }\n\n.bi-chat-square-text::before {\n  content: \"\"; }\n\n.bi-chat-square::before {\n  content: \"\"; }\n\n.bi-chat-text-fill::before {\n  content: \"\"; }\n\n.bi-chat-text::before {\n  content: \"\"; }\n\n.bi-chat::before {\n  content: \"\"; }\n\n.bi-check-all::before {\n  content: \"\"; }\n\n.bi-check-circle-fill::before {\n  content: \"\"; }\n\n.bi-check-circle::before {\n  content: \"\"; }\n\n.bi-check-square-fill::before {\n  content: \"\"; }\n\n.bi-check-square::before {\n  content: \"\"; }\n\n.bi-check::before {\n  content: \"\"; }\n\n.bi-check2-all::before {\n  content: \"\"; }\n\n.bi-check2-circle::before {\n  content: \"\"; }\n\n.bi-check2-square::before {\n  content: \"\"; }\n\n.bi-check2::before {\n  content: \"\"; }\n\n.bi-chevron-bar-contract::before {\n  content: \"\"; }\n\n.bi-chevron-bar-down::before {\n  content: \"\"; }\n\n.bi-chevron-bar-expand::before {\n  content: \"\"; }\n\n.bi-chevron-bar-left::before {\n  content: \"\"; }\n\n.bi-chevron-bar-right::before {\n  content: \"\"; }\n\n.bi-chevron-bar-up::before {\n  content: \"\"; }\n\n.bi-chevron-compact-down::before {\n  content: \"\"; }\n\n.bi-chevron-compact-left::before {\n  content: \"\"; }\n\n.bi-chevron-compact-right::before {\n  content: \"\"; }\n\n.bi-chevron-compact-up::before {\n  content: \"\"; }\n\n.bi-chevron-contract::before {\n  content: \"\"; }\n\n.bi-chevron-double-down::before {\n  content: \"\"; }\n\n.bi-chevron-double-left::before {\n  content: \"\"; }\n\n.bi-chevron-double-right::before {\n  content: \"\"; }\n\n.bi-chevron-double-up::before {\n  content: \"\"; }\n\n.bi-chevron-down::before {\n  content: \"\"; }\n\n.bi-chevron-expand::before {\n  content: \"\"; }\n\n.bi-chevron-left::before {\n  content: \"\"; }\n\n.bi-chevron-right::before {\n  content: \"\"; }\n\n.bi-chevron-up::before {\n  content: \"\"; }\n\n.bi-circle-fill::before {\n  content: \"\"; }\n\n.bi-circle-half::before {\n  content: \"\"; }\n\n.bi-circle-square::before {\n  content: \"\"; }\n\n.bi-circle::before {\n  content: \"\"; }\n\n.bi-clipboard-check::before {\n  content: \"\"; }\n\n.bi-clipboard-data::before {\n  content: \"\"; }\n\n.bi-clipboard-minus::before {\n  content: \"\"; }\n\n.bi-clipboard-plus::before {\n  content: \"\"; }\n\n.bi-clipboard-x::before {\n  content: \"\"; }\n\n.bi-clipboard::before {\n  content: \"\"; }\n\n.bi-clock-fill::before {\n  content: \"\"; }\n\n.bi-clock-history::before {\n  content: \"\"; }\n\n.bi-clock::before {\n  content: \"\"; }\n\n.bi-cloud-arrow-down-fill::before {\n  content: \"\"; }\n\n.bi-cloud-arrow-down::before {\n  content: \"\"; }\n\n.bi-cloud-arrow-up-fill::before {\n  content: \"\"; }\n\n.bi-cloud-arrow-up::before {\n  content: \"\"; }\n\n.bi-cloud-check-fill::before {\n  content: \"\"; }\n\n.bi-cloud-check::before {\n  content: \"\"; }\n\n.bi-cloud-download-fill::before {\n  content: \"\"; }\n\n.bi-cloud-download::before {\n  content: \"\"; }\n\n.bi-cloud-drizzle-fill::before {\n  content: \"\"; }\n\n.bi-cloud-drizzle::before {\n  content: \"\"; }\n\n.bi-cloud-fill::before {\n  content: \"\"; }\n\n.bi-cloud-fog-fill::before {\n  content: \"\"; }\n\n.bi-cloud-fog::before {\n  content: \"\"; }\n\n.bi-cloud-fog2-fill::before {\n  content: \"\"; }\n\n.bi-cloud-fog2::before {\n  content: \"\"; }\n\n.bi-cloud-hail-fill::before {\n  content: \"\"; }\n\n.bi-cloud-hail::before {\n  content: \"\"; }\n\n.bi-cloud-haze-1::before {\n  content: \"\"; }\n\n.bi-cloud-haze-fill::before {\n  content: \"\"; }\n\n.bi-cloud-haze::before {\n  content: \"\"; }\n\n.bi-cloud-haze2-fill::before {\n  content: \"\"; }\n\n.bi-cloud-lightning-fill::before {\n  content: \"\"; }\n\n.bi-cloud-lightning-rain-fill::before {\n  content: \"\"; }\n\n.bi-cloud-lightning-rain::before {\n  content: \"\"; }\n\n.bi-cloud-lightning::before {\n  content: \"\"; }\n\n.bi-cloud-minus-fill::before {\n  content: \"\"; }\n\n.bi-cloud-minus::before {\n  content: \"\"; }\n\n.bi-cloud-moon-fill::before {\n  content: \"\"; }\n\n.bi-cloud-moon::before {\n  content: \"\"; }\n\n.bi-cloud-plus-fill::before {\n  content: \"\"; }\n\n.bi-cloud-plus::before {\n  content: \"\"; }\n\n.bi-cloud-rain-fill::before {\n  content: \"\"; }\n\n.bi-cloud-rain-heavy-fill::before {\n  content: \"\"; }\n\n.bi-cloud-rain-heavy::before {\n  content: \"\"; }\n\n.bi-cloud-rain::before {\n  content: \"\"; }\n\n.bi-cloud-slash-fill::before {\n  content: \"\"; }\n\n.bi-cloud-slash::before {\n  content: \"\"; }\n\n.bi-cloud-sleet-fill::before {\n  content: \"\"; }\n\n.bi-cloud-sleet::before {\n  content: \"\"; }\n\n.bi-cloud-snow-fill::before {\n  content: \"\"; }\n\n.bi-cloud-snow::before {\n  content: \"\"; }\n\n.bi-cloud-sun-fill::before {\n  content: \"\"; }\n\n.bi-cloud-sun::before {\n  content: \"\"; }\n\n.bi-cloud-upload-fill::before {\n  content: \"\"; }\n\n.bi-cloud-upload::before {\n  content: \"\"; }\n\n.bi-cloud::before {\n  content: \"\"; }\n\n.bi-clouds-fill::before {\n  content: \"\"; }\n\n.bi-clouds::before {\n  content: \"\"; }\n\n.bi-cloudy-fill::before {\n  content: \"\"; }\n\n.bi-cloudy::before {\n  content: \"\"; }\n\n.bi-code-slash::before {\n  content: \"\"; }\n\n.bi-code-square::before {\n  content: \"\"; }\n\n.bi-code::before {\n  content: \"\"; }\n\n.bi-collection-fill::before {\n  content: \"\"; }\n\n.bi-collection-play-fill::before {\n  content: \"\"; }\n\n.bi-collection-play::before {\n  content: \"\"; }\n\n.bi-collection::before {\n  content: \"\"; }\n\n.bi-columns-gap::before {\n  content: \"\"; }\n\n.bi-columns::before {\n  content: \"\"; }\n\n.bi-command::before {\n  content: \"\"; }\n\n.bi-compass-fill::before {\n  content: \"\"; }\n\n.bi-compass::before {\n  content: \"\"; }\n\n.bi-cone-striped::before {\n  content: \"\"; }\n\n.bi-cone::before {\n  content: \"\"; }\n\n.bi-controller::before {\n  content: \"\"; }\n\n.bi-cpu-fill::before {\n  content: \"\"; }\n\n.bi-cpu::before {\n  content: \"\"; }\n\n.bi-credit-card-2-back-fill::before {\n  content: \"\"; }\n\n.bi-credit-card-2-back::before {\n  content: \"\"; }\n\n.bi-credit-card-2-front-fill::before {\n  content: \"\"; }\n\n.bi-credit-card-2-front::before {\n  content: \"\"; }\n\n.bi-credit-card-fill::before {\n  content: \"\"; }\n\n.bi-credit-card::before {\n  content: \"\"; }\n\n.bi-crop::before {\n  content: \"\"; }\n\n.bi-cup-fill::before {\n  content: \"\"; }\n\n.bi-cup-straw::before {\n  content: \"\"; }\n\n.bi-cup::before {\n  content: \"\"; }\n\n.bi-cursor-fill::before {\n  content: \"\"; }\n\n.bi-cursor-text::before {\n  content: \"\"; }\n\n.bi-cursor::before {\n  content: \"\"; }\n\n.bi-dash-circle-dotted::before {\n  content: \"\"; }\n\n.bi-dash-circle-fill::before {\n  content: \"\"; }\n\n.bi-dash-circle::before {\n  content: \"\"; }\n\n.bi-dash-square-dotted::before {\n  content: \"\"; }\n\n.bi-dash-square-fill::before {\n  content: \"\"; }\n\n.bi-dash-square::before {\n  content: \"\"; }\n\n.bi-dash::before {\n  content: \"\"; }\n\n.bi-diagram-2-fill::before {\n  content: \"\"; }\n\n.bi-diagram-2::before {\n  content: \"\"; }\n\n.bi-diagram-3-fill::before {\n  content: \"\"; }\n\n.bi-diagram-3::before {\n  content: \"\"; }\n\n.bi-diamond-fill::before {\n  content: \"\"; }\n\n.bi-diamond-half::before {\n  content: \"\"; }\n\n.bi-diamond::before {\n  content: \"\"; }\n\n.bi-dice-1-fill::before {\n  content: \"\"; }\n\n.bi-dice-1::before {\n  content: \"\"; }\n\n.bi-dice-2-fill::before {\n  content: \"\"; }\n\n.bi-dice-2::before {\n  content: \"\"; }\n\n.bi-dice-3-fill::before {\n  content: \"\"; }\n\n.bi-dice-3::before {\n  content: \"\"; }\n\n.bi-dice-4-fill::before {\n  content: \"\"; }\n\n.bi-dice-4::before {\n  content: \"\"; }\n\n.bi-dice-5-fill::before {\n  content: \"\"; }\n\n.bi-dice-5::before {\n  content: \"\"; }\n\n.bi-dice-6-fill::before {\n  content: \"\"; }\n\n.bi-dice-6::before {\n  content: \"\"; }\n\n.bi-disc-fill::before {\n  content: \"\"; }\n\n.bi-disc::before {\n  content: \"\"; }\n\n.bi-discord::before {\n  content: \"\"; }\n\n.bi-display-fill::before {\n  content: \"\"; }\n\n.bi-display::before {\n  content: \"\"; }\n\n.bi-distribute-horizontal::before {\n  content: \"\"; }\n\n.bi-distribute-vertical::before {\n  content: \"\"; }\n\n.bi-door-closed-fill::before {\n  content: \"\"; }\n\n.bi-door-closed::before {\n  content: \"\"; }\n\n.bi-door-open-fill::before {\n  content: \"\"; }\n\n.bi-door-open::before {\n  content: \"\"; }\n\n.bi-dot::before {\n  content: \"\"; }\n\n.bi-download::before {\n  content: \"\"; }\n\n.bi-droplet-fill::before {\n  content: \"\"; }\n\n.bi-droplet-half::before {\n  content: \"\"; }\n\n.bi-droplet::before {\n  content: \"\"; }\n\n.bi-earbuds::before {\n  content: \"\"; }\n\n.bi-easel-fill::before {\n  content: \"\"; }\n\n.bi-easel::before {\n  content: \"\"; }\n\n.bi-egg-fill::before {\n  content: \"\"; }\n\n.bi-egg-fried::before {\n  content: \"\"; }\n\n.bi-egg::before {\n  content: \"\"; }\n\n.bi-eject-fill::before {\n  content: \"\"; }\n\n.bi-eject::before {\n  content: \"\"; }\n\n.bi-emoji-angry-fill::before {\n  content: \"\"; }\n\n.bi-emoji-angry::before {\n  content: \"\"; }\n\n.bi-emoji-dizzy-fill::before {\n  content: \"\"; }\n\n.bi-emoji-dizzy::before {\n  content: \"\"; }\n\n.bi-emoji-expressionless-fill::before {\n  content: \"\"; }\n\n.bi-emoji-expressionless::before {\n  content: \"\"; }\n\n.bi-emoji-frown-fill::before {\n  content: \"\"; }\n\n.bi-emoji-frown::before {\n  content: \"\"; }\n\n.bi-emoji-heart-eyes-fill::before {\n  content: \"\"; }\n\n.bi-emoji-heart-eyes::before {\n  content: \"\"; }\n\n.bi-emoji-laughing-fill::before {\n  content: \"\"; }\n\n.bi-emoji-laughing::before {\n  content: \"\"; }\n\n.bi-emoji-neutral-fill::before {\n  content: \"\"; }\n\n.bi-emoji-neutral::before {\n  content: \"\"; }\n\n.bi-emoji-smile-fill::before {\n  content: \"\"; }\n\n.bi-emoji-smile-upside-down-fill::before {\n  content: \"\"; }\n\n.bi-emoji-smile-upside-down::before {\n  content: \"\"; }\n\n.bi-emoji-smile::before {\n  content: \"\"; }\n\n.bi-emoji-sunglasses-fill::before {\n  content: \"\"; }\n\n.bi-emoji-sunglasses::before {\n  content: \"\"; }\n\n.bi-emoji-wink-fill::before {\n  content: \"\"; }\n\n.bi-emoji-wink::before {\n  content: \"\"; }\n\n.bi-envelope-fill::before {\n  content: \"\"; }\n\n.bi-envelope-open-fill::before {\n  content: \"\"; }\n\n.bi-envelope-open::before {\n  content: \"\"; }\n\n.bi-envelope::before {\n  content: \"\"; }\n\n.bi-eraser-fill::before {\n  content: \"\"; }\n\n.bi-eraser::before {\n  content: \"\"; }\n\n.bi-exclamation-circle-fill::before {\n  content: \"\"; }\n\n.bi-exclamation-circle::before {\n  content: \"\"; }\n\n.bi-exclamation-diamond-fill::before {\n  content: \"\"; }\n\n.bi-exclamation-diamond::before {\n  content: \"\"; }\n\n.bi-exclamation-octagon-fill::before {\n  content: \"\"; }\n\n.bi-exclamation-octagon::before {\n  content: \"\"; }\n\n.bi-exclamation-square-fill::before {\n  content: \"\"; }\n\n.bi-exclamation-square::before {\n  content: \"\"; }\n\n.bi-exclamation-triangle-fill::before {\n  content: \"\"; }\n\n.bi-exclamation-triangle::before {\n  content: \"\"; }\n\n.bi-exclamation::before {\n  content: \"\"; }\n\n.bi-exclude::before {\n  content: \"\"; }\n\n.bi-eye-fill::before {\n  content: \"\"; }\n\n.bi-eye-slash-fill::before {\n  content: \"\"; }\n\n.bi-eye-slash::before {\n  content: \"\"; }\n\n.bi-eye::before {\n  content: \"\"; }\n\n.bi-eyedropper::before {\n  content: \"\"; }\n\n.bi-eyeglasses::before {\n  content: \"\"; }\n\n.bi-facebook::before {\n  content: \"\"; }\n\n.bi-file-arrow-down-fill::before {\n  content: \"\"; }\n\n.bi-file-arrow-down::before {\n  content: \"\"; }\n\n.bi-file-arrow-up-fill::before {\n  content: \"\"; }\n\n.bi-file-arrow-up::before {\n  content: \"\"; }\n\n.bi-file-bar-graph-fill::before {\n  content: \"\"; }\n\n.bi-file-bar-graph::before {\n  content: \"\"; }\n\n.bi-file-binary-fill::before {\n  content: \"\"; }\n\n.bi-file-binary::before {\n  content: \"\"; }\n\n.bi-file-break-fill::before {\n  content: \"\"; }\n\n.bi-file-break::before {\n  content: \"\"; }\n\n.bi-file-check-fill::before {\n  content: \"\"; }\n\n.bi-file-check::before {\n  content: \"\"; }\n\n.bi-file-code-fill::before {\n  content: \"\"; }\n\n.bi-file-code::before {\n  content: \"\"; }\n\n.bi-file-diff-fill::before {\n  content: \"\"; }\n\n.bi-file-diff::before {\n  content: \"\"; }\n\n.bi-file-earmark-arrow-down-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-arrow-down::before {\n  content: \"\"; }\n\n.bi-file-earmark-arrow-up-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-arrow-up::before {\n  content: \"\"; }\n\n.bi-file-earmark-bar-graph-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-bar-graph::before {\n  content: \"\"; }\n\n.bi-file-earmark-binary-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-binary::before {\n  content: \"\"; }\n\n.bi-file-earmark-break-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-break::before {\n  content: \"\"; }\n\n.bi-file-earmark-check-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-check::before {\n  content: \"\"; }\n\n.bi-file-earmark-code-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-code::before {\n  content: \"\"; }\n\n.bi-file-earmark-diff-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-diff::before {\n  content: \"\"; }\n\n.bi-file-earmark-easel-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-easel::before {\n  content: \"\"; }\n\n.bi-file-earmark-excel-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-excel::before {\n  content: \"\"; }\n\n.bi-file-earmark-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-font-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-font::before {\n  content: \"\"; }\n\n.bi-file-earmark-image-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-image::before {\n  content: \"\"; }\n\n.bi-file-earmark-lock-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-lock::before {\n  content: \"\"; }\n\n.bi-file-earmark-lock2-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-lock2::before {\n  content: \"\"; }\n\n.bi-file-earmark-medical-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-medical::before {\n  content: \"\"; }\n\n.bi-file-earmark-minus-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-minus::before {\n  content: \"\"; }\n\n.bi-file-earmark-music-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-music::before {\n  content: \"\"; }\n\n.bi-file-earmark-person-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-person::before {\n  content: \"\"; }\n\n.bi-file-earmark-play-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-play::before {\n  content: \"\"; }\n\n.bi-file-earmark-plus-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-plus::before {\n  content: \"\"; }\n\n.bi-file-earmark-post-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-post::before {\n  content: \"\"; }\n\n.bi-file-earmark-ppt-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-ppt::before {\n  content: \"\"; }\n\n.bi-file-earmark-richtext-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-richtext::before {\n  content: \"\"; }\n\n.bi-file-earmark-ruled-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-ruled::before {\n  content: \"\"; }\n\n.bi-file-earmark-slides-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-slides::before {\n  content: \"\"; }\n\n.bi-file-earmark-spreadsheet-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-spreadsheet::before {\n  content: \"\"; }\n\n.bi-file-earmark-text-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-text::before {\n  content: \"\"; }\n\n.bi-file-earmark-word-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-word::before {\n  content: \"\"; }\n\n.bi-file-earmark-x-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-x::before {\n  content: \"\"; }\n\n.bi-file-earmark-zip-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-zip::before {\n  content: \"\"; }\n\n.bi-file-earmark::before {\n  content: \"\"; }\n\n.bi-file-easel-fill::before {\n  content: \"\"; }\n\n.bi-file-easel::before {\n  content: \"\"; }\n\n.bi-file-excel-fill::before {\n  content: \"\"; }\n\n.bi-file-excel::before {\n  content: \"\"; }\n\n.bi-file-fill::before {\n  content: \"\"; }\n\n.bi-file-font-fill::before {\n  content: \"\"; }\n\n.bi-file-font::before {\n  content: \"\"; }\n\n.bi-file-image-fill::before {\n  content: \"\"; }\n\n.bi-file-image::before {\n  content: \"\"; }\n\n.bi-file-lock-fill::before {\n  content: \"\"; }\n\n.bi-file-lock::before {\n  content: \"\"; }\n\n.bi-file-lock2-fill::before {\n  content: \"\"; }\n\n.bi-file-lock2::before {\n  content: \"\"; }\n\n.bi-file-medical-fill::before {\n  content: \"\"; }\n\n.bi-file-medical::before {\n  content: \"\"; }\n\n.bi-file-minus-fill::before {\n  content: \"\"; }\n\n.bi-file-minus::before {\n  content: \"\"; }\n\n.bi-file-music-fill::before {\n  content: \"\"; }\n\n.bi-file-music::before {\n  content: \"\"; }\n\n.bi-file-person-fill::before {\n  content: \"\"; }\n\n.bi-file-person::before {\n  content: \"\"; }\n\n.bi-file-play-fill::before {\n  content: \"\"; }\n\n.bi-file-play::before {\n  content: \"\"; }\n\n.bi-file-plus-fill::before {\n  content: \"\"; }\n\n.bi-file-plus::before {\n  content: \"\"; }\n\n.bi-file-post-fill::before {\n  content: \"\"; }\n\n.bi-file-post::before {\n  content: \"\"; }\n\n.bi-file-ppt-fill::before {\n  content: \"\"; }\n\n.bi-file-ppt::before {\n  content: \"\"; }\n\n.bi-file-richtext-fill::before {\n  content: \"\"; }\n\n.bi-file-richtext::before {\n  content: \"\"; }\n\n.bi-file-ruled-fill::before {\n  content: \"\"; }\n\n.bi-file-ruled::before {\n  content: \"\"; }\n\n.bi-file-slides-fill::before {\n  content: \"\"; }\n\n.bi-file-slides::before {\n  content: \"\"; }\n\n.bi-file-spreadsheet-fill::before {\n  content: \"\"; }\n\n.bi-file-spreadsheet::before {\n  content: \"\"; }\n\n.bi-file-text-fill::before {\n  content: \"\"; }\n\n.bi-file-text::before {\n  content: \"\"; }\n\n.bi-file-word-fill::before {\n  content: \"\"; }\n\n.bi-file-word::before {\n  content: \"\"; }\n\n.bi-file-x-fill::before {\n  content: \"\"; }\n\n.bi-file-x::before {\n  content: \"\"; }\n\n.bi-file-zip-fill::before {\n  content: \"\"; }\n\n.bi-file-zip::before {\n  content: \"\"; }\n\n.bi-file::before {\n  content: \"\"; }\n\n.bi-files-alt::before {\n  content: \"\"; }\n\n.bi-files::before {\n  content: \"\"; }\n\n.bi-film::before {\n  content: \"\"; }\n\n.bi-filter-circle-fill::before {\n  content: \"\"; }\n\n.bi-filter-circle::before {\n  content: \"\"; }\n\n.bi-filter-left::before {\n  content: \"\"; }\n\n.bi-filter-right::before {\n  content: \"\"; }\n\n.bi-filter-square-fill::before {\n  content: \"\"; }\n\n.bi-filter-square::before {\n  content: \"\"; }\n\n.bi-filter::before {\n  content: \"\"; }\n\n.bi-flag-fill::before {\n  content: \"\"; }\n\n.bi-flag::before {\n  content: \"\"; }\n\n.bi-flower1::before {\n  content: \"\"; }\n\n.bi-flower2::before {\n  content: \"\"; }\n\n.bi-flower3::before {\n  content: \"\"; }\n\n.bi-folder-check::before {\n  content: \"\"; }\n\n.bi-folder-fill::before {\n  content: \"\"; }\n\n.bi-folder-minus::before {\n  content: \"\"; }\n\n.bi-folder-plus::before {\n  content: \"\"; }\n\n.bi-folder-symlink-fill::before {\n  content: \"\"; }\n\n.bi-folder-symlink::before {\n  content: \"\"; }\n\n.bi-folder-x::before {\n  content: \"\"; }\n\n.bi-folder::before {\n  content: \"\"; }\n\n.bi-folder2-open::before {\n  content: \"\"; }\n\n.bi-folder2::before {\n  content: \"\"; }\n\n.bi-fonts::before {\n  content: \"\"; }\n\n.bi-forward-fill::before {\n  content: \"\"; }\n\n.bi-forward::before {\n  content: \"\"; }\n\n.bi-front::before {\n  content: \"\"; }\n\n.bi-fullscreen-exit::before {\n  content: \"\"; }\n\n.bi-fullscreen::before {\n  content: \"\"; }\n\n.bi-funnel-fill::before {\n  content: \"\"; }\n\n.bi-funnel::before {\n  content: \"\"; }\n\n.bi-gear-fill::before {\n  content: \"\"; }\n\n.bi-gear-wide-connected::before {\n  content: \"\"; }\n\n.bi-gear-wide::before {\n  content: \"\"; }\n\n.bi-gear::before {\n  content: \"\"; }\n\n.bi-gem::before {\n  content: \"\"; }\n\n.bi-geo-alt-fill::before {\n  content: \"\"; }\n\n.bi-geo-alt::before {\n  content: \"\"; }\n\n.bi-geo-fill::before {\n  content: \"\"; }\n\n.bi-geo::before {\n  content: \"\"; }\n\n.bi-gift-fill::before {\n  content: \"\"; }\n\n.bi-gift::before {\n  content: \"\"; }\n\n.bi-github::before {\n  content: \"\"; }\n\n.bi-globe::before {\n  content: \"\"; }\n\n.bi-globe2::before {\n  content: \"\"; }\n\n.bi-google::before {\n  content: \"\"; }\n\n.bi-graph-down::before {\n  content: \"\"; }\n\n.bi-graph-up::before {\n  content: \"\"; }\n\n.bi-grid-1x2-fill::before {\n  content: \"\"; }\n\n.bi-grid-1x2::before {\n  content: \"\"; }\n\n.bi-grid-3x2-gap-fill::before {\n  content: \"\"; }\n\n.bi-grid-3x2-gap::before {\n  content: \"\"; }\n\n.bi-grid-3x2::before {\n  content: \"\"; }\n\n.bi-grid-3x3-gap-fill::before {\n  content: \"\"; }\n\n.bi-grid-3x3-gap::before {\n  content: \"\"; }\n\n.bi-grid-3x3::before {\n  content: \"\"; }\n\n.bi-grid-fill::before {\n  content: \"\"; }\n\n.bi-grid::before {\n  content: \"\"; }\n\n.bi-grip-horizontal::before {\n  content: \"\"; }\n\n.bi-grip-vertical::before {\n  content: \"\"; }\n\n.bi-hammer::before {\n  content: \"\"; }\n\n.bi-hand-index-fill::before {\n  content: \"\"; }\n\n.bi-hand-index-thumb-fill::before {\n  content: \"\"; }\n\n.bi-hand-index-thumb::before {\n  content: \"\"; }\n\n.bi-hand-index::before {\n  content: \"\"; }\n\n.bi-hand-thumbs-down-fill::before {\n  content: \"\"; }\n\n.bi-hand-thumbs-down::before {\n  content: \"\"; }\n\n.bi-hand-thumbs-up-fill::before {\n  content: \"\"; }\n\n.bi-hand-thumbs-up::before {\n  content: \"\"; }\n\n.bi-handbag-fill::before {\n  content: \"\"; }\n\n.bi-handbag::before {\n  content: \"\"; }\n\n.bi-hash::before {\n  content: \"\"; }\n\n.bi-hdd-fill::before {\n  content: \"\"; }\n\n.bi-hdd-network-fill::before {\n  content: \"\"; }\n\n.bi-hdd-network::before {\n  content: \"\"; }\n\n.bi-hdd-rack-fill::before {\n  content: \"\"; }\n\n.bi-hdd-rack::before {\n  content: \"\"; }\n\n.bi-hdd-stack-fill::before {\n  content: \"\"; }\n\n.bi-hdd-stack::before {\n  content: \"\"; }\n\n.bi-hdd::before {\n  content: \"\"; }\n\n.bi-headphones::before {\n  content: \"\"; }\n\n.bi-headset::before {\n  content: \"\"; }\n\n.bi-heart-fill::before {\n  content: \"\"; }\n\n.bi-heart-half::before {\n  content: \"\"; }\n\n.bi-heart::before {\n  content: \"\"; }\n\n.bi-heptagon-fill::before {\n  content: \"\"; }\n\n.bi-heptagon-half::before {\n  content: \"\"; }\n\n.bi-heptagon::before {\n  content: \"\"; }\n\n.bi-hexagon-fill::before {\n  content: \"\"; }\n\n.bi-hexagon-half::before {\n  content: \"\"; }\n\n.bi-hexagon::before {\n  content: \"\"; }\n\n.bi-hourglass-bottom::before {\n  content: \"\"; }\n\n.bi-hourglass-split::before {\n  content: \"\"; }\n\n.bi-hourglass-top::before {\n  content: \"\"; }\n\n.bi-hourglass::before {\n  content: \"\"; }\n\n.bi-house-door-fill::before {\n  content: \"\"; }\n\n.bi-house-door::before {\n  content: \"\"; }\n\n.bi-house-fill::before {\n  content: \"\"; }\n\n.bi-house::before {\n  content: \"\"; }\n\n.bi-hr::before {\n  content: \"\"; }\n\n.bi-hurricane::before {\n  content: \"\"; }\n\n.bi-image-alt::before {\n  content: \"\"; }\n\n.bi-image-fill::before {\n  content: \"\"; }\n\n.bi-image::before {\n  content: \"\"; }\n\n.bi-images::before {\n  content: \"\"; }\n\n.bi-inbox-fill::before {\n  content: \"\"; }\n\n.bi-inbox::before {\n  content: \"\"; }\n\n.bi-inboxes-fill::before {\n  content: \"\"; }\n\n.bi-inboxes::before {\n  content: \"\"; }\n\n.bi-info-circle-fill::before {\n  content: \"\"; }\n\n.bi-info-circle::before {\n  content: \"\"; }\n\n.bi-info-square-fill::before {\n  content: \"\"; }\n\n.bi-info-square::before {\n  content: \"\"; }\n\n.bi-info::before {\n  content: \"\"; }\n\n.bi-input-cursor-text::before {\n  content: \"\"; }\n\n.bi-input-cursor::before {\n  content: \"\"; }\n\n.bi-instagram::before {\n  content: \"\"; }\n\n.bi-intersect::before {\n  content: \"\"; }\n\n.bi-journal-album::before {\n  content: \"\"; }\n\n.bi-journal-arrow-down::before {\n  content: \"\"; }\n\n.bi-journal-arrow-up::before {\n  content: \"\"; }\n\n.bi-journal-bookmark-fill::before {\n  content: \"\"; }\n\n.bi-journal-bookmark::before {\n  content: \"\"; }\n\n.bi-journal-check::before {\n  content: \"\"; }\n\n.bi-journal-code::before {\n  content: \"\"; }\n\n.bi-journal-medical::before {\n  content: \"\"; }\n\n.bi-journal-minus::before {\n  content: \"\"; }\n\n.bi-journal-plus::before {\n  content: \"\"; }\n\n.bi-journal-richtext::before {\n  content: \"\"; }\n\n.bi-journal-text::before {\n  content: \"\"; }\n\n.bi-journal-x::before {\n  content: \"\"; }\n\n.bi-journal::before {\n  content: \"\"; }\n\n.bi-journals::before {\n  content: \"\"; }\n\n.bi-joystick::before {\n  content: \"\"; }\n\n.bi-justify-left::before {\n  content: \"\"; }\n\n.bi-justify-right::before {\n  content: \"\"; }\n\n.bi-justify::before {\n  content: \"\"; }\n\n.bi-kanban-fill::before {\n  content: \"\"; }\n\n.bi-kanban::before {\n  content: \"\"; }\n\n.bi-key-fill::before {\n  content: \"\"; }\n\n.bi-key::before {\n  content: \"\"; }\n\n.bi-keyboard-fill::before {\n  content: \"\"; }\n\n.bi-keyboard::before {\n  content: \"\"; }\n\n.bi-ladder::before {\n  content: \"\"; }\n\n.bi-lamp-fill::before {\n  content: \"\"; }\n\n.bi-lamp::before {\n  content: \"\"; }\n\n.bi-laptop-fill::before {\n  content: \"\"; }\n\n.bi-laptop::before {\n  content: \"\"; }\n\n.bi-layer-backward::before {\n  content: \"\"; }\n\n.bi-layer-forward::before {\n  content: \"\"; }\n\n.bi-layers-fill::before {\n  content: \"\"; }\n\n.bi-layers-half::before {\n  content: \"\"; }\n\n.bi-layers::before {\n  content: \"\"; }\n\n.bi-layout-sidebar-inset-reverse::before {\n  content: \"\"; }\n\n.bi-layout-sidebar-inset::before {\n  content: \"\"; }\n\n.bi-layout-sidebar-reverse::before {\n  content: \"\"; }\n\n.bi-layout-sidebar::before {\n  content: \"\"; }\n\n.bi-layout-split::before {\n  content: \"\"; }\n\n.bi-layout-text-sidebar-reverse::before {\n  content: \"\"; }\n\n.bi-layout-text-sidebar::before {\n  content: \"\"; }\n\n.bi-layout-text-window-reverse::before {\n  content: \"\"; }\n\n.bi-layout-text-window::before {\n  content: \"\"; }\n\n.bi-layout-three-columns::before {\n  content: \"\"; }\n\n.bi-layout-wtf::before {\n  content: \"\"; }\n\n.bi-life-preserver::before {\n  content: \"\"; }\n\n.bi-lightbulb-fill::before {\n  content: \"\"; }\n\n.bi-lightbulb-off-fill::before {\n  content: \"\"; }\n\n.bi-lightbulb-off::before {\n  content: \"\"; }\n\n.bi-lightbulb::before {\n  content: \"\"; }\n\n.bi-lightning-charge-fill::before {\n  content: \"\"; }\n\n.bi-lightning-charge::before {\n  content: \"\"; }\n\n.bi-lightning-fill::before {\n  content: \"\"; }\n\n.bi-lightning::before {\n  content: \"\"; }\n\n.bi-link-45deg::before {\n  content: \"\"; }\n\n.bi-link::before {\n  content: \"\"; }\n\n.bi-linkedin::before {\n  content: \"\"; }\n\n.bi-list-check::before {\n  content: \"\"; }\n\n.bi-list-nested::before {\n  content: \"\"; }\n\n.bi-list-ol::before {\n  content: \"\"; }\n\n.bi-list-stars::before {\n  content: \"\"; }\n\n.bi-list-task::before {\n  content: \"\"; }\n\n.bi-list-ul::before {\n  content: \"\"; }\n\n.bi-list::before {\n  content: \"\"; }\n\n.bi-lock-fill::before {\n  content: \"\"; }\n\n.bi-lock::before {\n  content: \"\"; }\n\n.bi-mailbox::before {\n  content: \"\"; }\n\n.bi-mailbox2::before {\n  content: \"\"; }\n\n.bi-map-fill::before {\n  content: \"\"; }\n\n.bi-map::before {\n  content: \"\"; }\n\n.bi-markdown-fill::before {\n  content: \"\"; }\n\n.bi-markdown::before {\n  content: \"\"; }\n\n.bi-mask::before {\n  content: \"\"; }\n\n.bi-megaphone-fill::before {\n  content: \"\"; }\n\n.bi-megaphone::before {\n  content: \"\"; }\n\n.bi-menu-app-fill::before {\n  content: \"\"; }\n\n.bi-menu-app::before {\n  content: \"\"; }\n\n.bi-menu-button-fill::before {\n  content: \"\"; }\n\n.bi-menu-button-wide-fill::before {\n  content: \"\"; }\n\n.bi-menu-button-wide::before {\n  content: \"\"; }\n\n.bi-menu-button::before {\n  content: \"\"; }\n\n.bi-menu-down::before {\n  content: \"\"; }\n\n.bi-menu-up::before {\n  content: \"\"; }\n\n.bi-mic-fill::before {\n  content: \"\"; }\n\n.bi-mic-mute-fill::before {\n  content: \"\"; }\n\n.bi-mic-mute::before {\n  content: \"\"; }\n\n.bi-mic::before {\n  content: \"\"; }\n\n.bi-minecart-loaded::before {\n  content: \"\"; }\n\n.bi-minecart::before {\n  content: \"\"; }\n\n.bi-moisture::before {\n  content: \"\"; }\n\n.bi-moon-fill::before {\n  content: \"\"; }\n\n.bi-moon-stars-fill::before {\n  content: \"\"; }\n\n.bi-moon-stars::before {\n  content: \"\"; }\n\n.bi-moon::before {\n  content: \"\"; }\n\n.bi-mouse-fill::before {\n  content: \"\"; }\n\n.bi-mouse::before {\n  content: \"\"; }\n\n.bi-mouse2-fill::before {\n  content: \"\"; }\n\n.bi-mouse2::before {\n  content: \"\"; }\n\n.bi-mouse3-fill::before {\n  content: \"\"; }\n\n.bi-mouse3::before {\n  content: \"\"; }\n\n.bi-music-note-beamed::before {\n  content: \"\"; }\n\n.bi-music-note-list::before {\n  content: \"\"; }\n\n.bi-music-note::before {\n  content: \"\"; }\n\n.bi-music-player-fill::before {\n  content: \"\"; }\n\n.bi-music-player::before {\n  content: \"\"; }\n\n.bi-newspaper::before {\n  content: \"\"; }\n\n.bi-node-minus-fill::before {\n  content: \"\"; }\n\n.bi-node-minus::before {\n  content: \"\"; }\n\n.bi-node-plus-fill::before {\n  content: \"\"; }\n\n.bi-node-plus::before {\n  content: \"\"; }\n\n.bi-nut-fill::before {\n  content: \"\"; }\n\n.bi-nut::before {\n  content: \"\"; }\n\n.bi-octagon-fill::before {\n  content: \"\"; }\n\n.bi-octagon-half::before {\n  content: \"\"; }\n\n.bi-octagon::before {\n  content: \"\"; }\n\n.bi-option::before {\n  content: \"\"; }\n\n.bi-outlet::before {\n  content: \"\"; }\n\n.bi-paint-bucket::before {\n  content: \"\"; }\n\n.bi-palette-fill::before {\n  content: \"\"; }\n\n.bi-palette::before {\n  content: \"\"; }\n\n.bi-palette2::before {\n  content: \"\"; }\n\n.bi-paperclip::before {\n  content: \"\"; }\n\n.bi-paragraph::before {\n  content: \"\"; }\n\n.bi-patch-check-fill::before {\n  content: \"\"; }\n\n.bi-patch-check::before {\n  content: \"\"; }\n\n.bi-patch-exclamation-fill::before {\n  content: \"\"; }\n\n.bi-patch-exclamation::before {\n  content: \"\"; }\n\n.bi-patch-minus-fill::before {\n  content: \"\"; }\n\n.bi-patch-minus::before {\n  content: \"\"; }\n\n.bi-patch-plus-fill::before {\n  content: \"\"; }\n\n.bi-patch-plus::before {\n  content: \"\"; }\n\n.bi-patch-question-fill::before {\n  content: \"\"; }\n\n.bi-patch-question::before {\n  content: \"\"; }\n\n.bi-pause-btn-fill::before {\n  content: \"\"; }\n\n.bi-pause-btn::before {\n  content: \"\"; }\n\n.bi-pause-circle-fill::before {\n  content: \"\"; }\n\n.bi-pause-circle::before {\n  content: \"\"; }\n\n.bi-pause-fill::before {\n  content: \"\"; }\n\n.bi-pause::before {\n  content: \"\"; }\n\n.bi-peace-fill::before {\n  content: \"\"; }\n\n.bi-peace::before {\n  content: \"\"; }\n\n.bi-pen-fill::before {\n  content: \"\"; }\n\n.bi-pen::before {\n  content: \"\"; }\n\n.bi-pencil-fill::before {\n  content: \"\"; }\n\n.bi-pencil-square::before {\n  content: \"\"; }\n\n.bi-pencil::before {\n  content: \"\"; }\n\n.bi-pentagon-fill::before {\n  content: \"\"; }\n\n.bi-pentagon-half::before {\n  content: \"\"; }\n\n.bi-pentagon::before {\n  content: \"\"; }\n\n.bi-people-fill::before {\n  content: \"\"; }\n\n.bi-people::before {\n  content: \"\"; }\n\n.bi-percent::before {\n  content: \"\"; }\n\n.bi-person-badge-fill::before {\n  content: \"\"; }\n\n.bi-person-badge::before {\n  content: \"\"; }\n\n.bi-person-bounding-box::before {\n  content: \"\"; }\n\n.bi-person-check-fill::before {\n  content: \"\"; }\n\n.bi-person-check::before {\n  content: \"\"; }\n\n.bi-person-circle::before {\n  content: \"\"; }\n\n.bi-person-dash-fill::before {\n  content: \"\"; }\n\n.bi-person-dash::before {\n  content: \"\"; }\n\n.bi-person-fill::before {\n  content: \"\"; }\n\n.bi-person-lines-fill::before {\n  content: \"\"; }\n\n.bi-person-plus-fill::before {\n  content: \"\"; }\n\n.bi-person-plus::before {\n  content: \"\"; }\n\n.bi-person-square::before {\n  content: \"\"; }\n\n.bi-person-x-fill::before {\n  content: \"\"; }\n\n.bi-person-x::before {\n  content: \"\"; }\n\n.bi-person::before {\n  content: \"\"; }\n\n.bi-phone-fill::before {\n  content: \"\"; }\n\n.bi-phone-landscape-fill::before {\n  content: \"\"; }\n\n.bi-phone-landscape::before {\n  content: \"\"; }\n\n.bi-phone-vibrate-fill::before {\n  content: \"\"; }\n\n.bi-phone-vibrate::before {\n  content: \"\"; }\n\n.bi-phone::before {\n  content: \"\"; }\n\n.bi-pie-chart-fill::before {\n  content: \"\"; }\n\n.bi-pie-chart::before {\n  content: \"\"; }\n\n.bi-pin-angle-fill::before {\n  content: \"\"; }\n\n.bi-pin-angle::before {\n  content: \"\"; }\n\n.bi-pin-fill::before {\n  content: \"\"; }\n\n.bi-pin::before {\n  content: \"\"; }\n\n.bi-pip-fill::before {\n  content: \"\"; }\n\n.bi-pip::before {\n  content: \"\"; }\n\n.bi-play-btn-fill::before {\n  content: \"\"; }\n\n.bi-play-btn::before {\n  content: \"\"; }\n\n.bi-play-circle-fill::before {\n  content: \"\"; }\n\n.bi-play-circle::before {\n  content: \"\"; }\n\n.bi-play-fill::before {\n  content: \"\"; }\n\n.bi-play::before {\n  content: \"\"; }\n\n.bi-plug-fill::before {\n  content: \"\"; }\n\n.bi-plug::before {\n  content: \"\"; }\n\n.bi-plus-circle-dotted::before {\n  content: \"\"; }\n\n.bi-plus-circle-fill::before {\n  content: \"\"; }\n\n.bi-plus-circle::before {\n  content: \"\"; }\n\n.bi-plus-square-dotted::before {\n  content: \"\"; }\n\n.bi-plus-square-fill::before {\n  content: \"\"; }\n\n.bi-plus-square::before {\n  content: \"\"; }\n\n.bi-plus::before {\n  content: \"\"; }\n\n.bi-power::before {\n  content: \"\"; }\n\n.bi-printer-fill::before {\n  content: \"\"; }\n\n.bi-printer::before {\n  content: \"\"; }\n\n.bi-puzzle-fill::before {\n  content: \"\"; }\n\n.bi-puzzle::before {\n  content: \"\"; }\n\n.bi-question-circle-fill::before {\n  content: \"\"; }\n\n.bi-question-circle::before {\n  content: \"\"; }\n\n.bi-question-diamond-fill::before {\n  content: \"\"; }\n\n.bi-question-diamond::before {\n  content: \"\"; }\n\n.bi-question-octagon-fill::before {\n  content: \"\"; }\n\n.bi-question-octagon::before {\n  content: \"\"; }\n\n.bi-question-square-fill::before {\n  content: \"\"; }\n\n.bi-question-square::before {\n  content: \"\"; }\n\n.bi-question::before {\n  content: \"\"; }\n\n.bi-rainbow::before {\n  content: \"\"; }\n\n.bi-receipt-cutoff::before {\n  content: \"\"; }\n\n.bi-receipt::before {\n  content: \"\"; }\n\n.bi-reception-0::before {\n  content: \"\"; }\n\n.bi-reception-1::before {\n  content: \"\"; }\n\n.bi-reception-2::before {\n  content: \"\"; }\n\n.bi-reception-3::before {\n  content: \"\"; }\n\n.bi-reception-4::before {\n  content: \"\"; }\n\n.bi-record-btn-fill::before {\n  content: \"\"; }\n\n.bi-record-btn::before {\n  content: \"\"; }\n\n.bi-record-circle-fill::before {\n  content: \"\"; }\n\n.bi-record-circle::before {\n  content: \"\"; }\n\n.bi-record-fill::before {\n  content: \"\"; }\n\n.bi-record::before {\n  content: \"\"; }\n\n.bi-record2-fill::before {\n  content: \"\"; }\n\n.bi-record2::before {\n  content: \"\"; }\n\n.bi-reply-all-fill::before {\n  content: \"\"; }\n\n.bi-reply-all::before {\n  content: \"\"; }\n\n.bi-reply-fill::before {\n  content: \"\"; }\n\n.bi-reply::before {\n  content: \"\"; }\n\n.bi-rss-fill::before {\n  content: \"\"; }\n\n.bi-rss::before {\n  content: \"\"; }\n\n.bi-rulers::before {\n  content: \"\"; }\n\n.bi-save-fill::before {\n  content: \"\"; }\n\n.bi-save::before {\n  content: \"\"; }\n\n.bi-save2-fill::before {\n  content: \"\"; }\n\n.bi-save2::before {\n  content: \"\"; }\n\n.bi-scissors::before {\n  content: \"\"; }\n\n.bi-screwdriver::before {\n  content: \"\"; }\n\n.bi-search::before {\n  content: \"\"; }\n\n.bi-segmented-nav::before {\n  content: \"\"; }\n\n.bi-server::before {\n  content: \"\"; }\n\n.bi-share-fill::before {\n  content: \"\"; }\n\n.bi-share::before {\n  content: \"\"; }\n\n.bi-shield-check::before {\n  content: \"\"; }\n\n.bi-shield-exclamation::before {\n  content: \"\"; }\n\n.bi-shield-fill-check::before {\n  content: \"\"; }\n\n.bi-shield-fill-exclamation::before {\n  content: \"\"; }\n\n.bi-shield-fill-minus::before {\n  content: \"\"; }\n\n.bi-shield-fill-plus::before {\n  content: \"\"; }\n\n.bi-shield-fill-x::before {\n  content: \"\"; }\n\n.bi-shield-fill::before {\n  content: \"\"; }\n\n.bi-shield-lock-fill::before {\n  content: \"\"; }\n\n.bi-shield-lock::before {\n  content: \"\"; }\n\n.bi-shield-minus::before {\n  content: \"\"; }\n\n.bi-shield-plus::before {\n  content: \"\"; }\n\n.bi-shield-shaded::before {\n  content: \"\"; }\n\n.bi-shield-slash-fill::before {\n  content: \"\"; }\n\n.bi-shield-slash::before {\n  content: \"\"; }\n\n.bi-shield-x::before {\n  content: \"\"; }\n\n.bi-shield::before {\n  content: \"\"; }\n\n.bi-shift-fill::before {\n  content: \"\"; }\n\n.bi-shift::before {\n  content: \"\"; }\n\n.bi-shop-window::before {\n  content: \"\"; }\n\n.bi-shop::before {\n  content: \"\"; }\n\n.bi-shuffle::before {\n  content: \"\"; }\n\n.bi-signpost-2-fill::before {\n  content: \"\"; }\n\n.bi-signpost-2::before {\n  content: \"\"; }\n\n.bi-signpost-fill::before {\n  content: \"\"; }\n\n.bi-signpost-split-fill::before {\n  content: \"\"; }\n\n.bi-signpost-split::before {\n  content: \"\"; }\n\n.bi-signpost::before {\n  content: \"\"; }\n\n.bi-sim-fill::before {\n  content: \"\"; }\n\n.bi-sim::before {\n  content: \"\"; }\n\n.bi-skip-backward-btn-fill::before {\n  content: \"\"; }\n\n.bi-skip-backward-btn::before {\n  content: \"\"; }\n\n.bi-skip-backward-circle-fill::before {\n  content: \"\"; }\n\n.bi-skip-backward-circle::before {\n  content: \"\"; }\n\n.bi-skip-backward-fill::before {\n  content: \"\"; }\n\n.bi-skip-backward::before {\n  content: \"\"; }\n\n.bi-skip-end-btn-fill::before {\n  content: \"\"; }\n\n.bi-skip-end-btn::before {\n  content: \"\"; }\n\n.bi-skip-end-circle-fill::before {\n  content: \"\"; }\n\n.bi-skip-end-circle::before {\n  content: \"\"; }\n\n.bi-skip-end-fill::before {\n  content: \"\"; }\n\n.bi-skip-end::before {\n  content: \"\"; }\n\n.bi-skip-forward-btn-fill::before {\n  content: \"\"; }\n\n.bi-skip-forward-btn::before {\n  content: \"\"; }\n\n.bi-skip-forward-circle-fill::before {\n  content: \"\"; }\n\n.bi-skip-forward-circle::before {\n  content: \"\"; }\n\n.bi-skip-forward-fill::before {\n  content: \"\"; }\n\n.bi-skip-forward::before {\n  content: \"\"; }\n\n.bi-skip-start-btn-fill::before {\n  content: \"\"; }\n\n.bi-skip-start-btn::before {\n  content: \"\"; }\n\n.bi-skip-start-circle-fill::before {\n  content: \"\"; }\n\n.bi-skip-start-circle::before {\n  content: \"\"; }\n\n.bi-skip-start-fill::before {\n  content: \"\"; }\n\n.bi-skip-start::before {\n  content: \"\"; }\n\n.bi-slack::before {\n  content: \"\"; }\n\n.bi-slash-circle-fill::before {\n  content: \"\"; }\n\n.bi-slash-circle::before {\n  content: \"\"; }\n\n.bi-slash-square-fill::before {\n  content: \"\"; }\n\n.bi-slash-square::before {\n  content: \"\"; }\n\n.bi-slash::before {\n  content: \"\"; }\n\n.bi-sliders::before {\n  content: \"\"; }\n\n.bi-smartwatch::before {\n  content: \"\"; }\n\n.bi-snow::before {\n  content: \"\"; }\n\n.bi-snow2::before {\n  content: \"\"; }\n\n.bi-snow3::before {\n  content: \"\"; }\n\n.bi-sort-alpha-down-alt::before {\n  content: \"\"; }\n\n.bi-sort-alpha-down::before {\n  content: \"\"; }\n\n.bi-sort-alpha-up-alt::before {\n  content: \"\"; }\n\n.bi-sort-alpha-up::before {\n  content: \"\"; }\n\n.bi-sort-down-alt::before {\n  content: \"\"; }\n\n.bi-sort-down::before {\n  content: \"\"; }\n\n.bi-sort-numeric-down-alt::before {\n  content: \"\"; }\n\n.bi-sort-numeric-down::before {\n  content: \"\"; }\n\n.bi-sort-numeric-up-alt::before {\n  content: \"\"; }\n\n.bi-sort-numeric-up::before {\n  content: \"\"; }\n\n.bi-sort-up-alt::before {\n  content: \"\"; }\n\n.bi-sort-up::before {\n  content: \"\"; }\n\n.bi-soundwave::before {\n  content: \"\"; }\n\n.bi-speaker-fill::before {\n  content: \"\"; }\n\n.bi-speaker::before {\n  content: \"\"; }\n\n.bi-speedometer::before {\n  content: \"\"; }\n\n.bi-speedometer2::before {\n  content: \"\"; }\n\n.bi-spellcheck::before {\n  content: \"\"; }\n\n.bi-square-fill::before {\n  content: \"\"; }\n\n.bi-square-half::before {\n  content: \"\"; }\n\n.bi-square::before {\n  content: \"\"; }\n\n.bi-stack::before {\n  content: \"\"; }\n\n.bi-star-fill::before {\n  content: \"\"; }\n\n.bi-star-half::before {\n  content: \"\"; }\n\n.bi-star::before {\n  content: \"\"; }\n\n.bi-stars::before {\n  content: \"\"; }\n\n.bi-stickies-fill::before {\n  content: \"\"; }\n\n.bi-stickies::before {\n  content: \"\"; }\n\n.bi-sticky-fill::before {\n  content: \"\"; }\n\n.bi-sticky::before {\n  content: \"\"; }\n\n.bi-stop-btn-fill::before {\n  content: \"\"; }\n\n.bi-stop-btn::before {\n  content: \"\"; }\n\n.bi-stop-circle-fill::before {\n  content: \"\"; }\n\n.bi-stop-circle::before {\n  content: \"\"; }\n\n.bi-stop-fill::before {\n  content: \"\"; }\n\n.bi-stop::before {\n  content: \"\"; }\n\n.bi-stoplights-fill::before {\n  content: \"\"; }\n\n.bi-stoplights::before {\n  content: \"\"; }\n\n.bi-stopwatch-fill::before {\n  content: \"\"; }\n\n.bi-stopwatch::before {\n  content: \"\"; }\n\n.bi-subtract::before {\n  content: \"\"; }\n\n.bi-suit-club-fill::before {\n  content: \"\"; }\n\n.bi-suit-club::before {\n  content: \"\"; }\n\n.bi-suit-diamond-fill::before {\n  content: \"\"; }\n\n.bi-suit-diamond::before {\n  content: \"\"; }\n\n.bi-suit-heart-fill::before {\n  content: \"\"; }\n\n.bi-suit-heart::before {\n  content: \"\"; }\n\n.bi-suit-spade-fill::before {\n  content: \"\"; }\n\n.bi-suit-spade::before {\n  content: \"\"; }\n\n.bi-sun-fill::before {\n  content: \"\"; }\n\n.bi-sun::before {\n  content: \"\"; }\n\n.bi-sunglasses::before {\n  content: \"\"; }\n\n.bi-sunrise-fill::before {\n  content: \"\"; }\n\n.bi-sunrise::before {\n  content: \"\"; }\n\n.bi-sunset-fill::before {\n  content: \"\"; }\n\n.bi-sunset::before {\n  content: \"\"; }\n\n.bi-symmetry-horizontal::before {\n  content: \"\"; }\n\n.bi-symmetry-vertical::before {\n  content: \"\"; }\n\n.bi-table::before {\n  content: \"\"; }\n\n.bi-tablet-fill::before {\n  content: \"\"; }\n\n.bi-tablet-landscape-fill::before {\n  content: \"\"; }\n\n.bi-tablet-landscape::before {\n  content: \"\"; }\n\n.bi-tablet::before {\n  content: \"\"; }\n\n.bi-tag-fill::before {\n  content: \"\"; }\n\n.bi-tag::before {\n  content: \"\"; }\n\n.bi-tags-fill::before {\n  content: \"\"; }\n\n.bi-tags::before {\n  content: \"\"; }\n\n.bi-telegram::before {\n  content: \"\"; }\n\n.bi-telephone-fill::before {\n  content: \"\"; }\n\n.bi-telephone-forward-fill::before {\n  content: \"\"; }\n\n.bi-telephone-forward::before {\n  content: \"\"; }\n\n.bi-telephone-inbound-fill::before {\n  content: \"\"; }\n\n.bi-telephone-inbound::before {\n  content: \"\"; }\n\n.bi-telephone-minus-fill::before {\n  content: \"\"; }\n\n.bi-telephone-minus::before {\n  content: \"\"; }\n\n.bi-telephone-outbound-fill::before {\n  content: \"\"; }\n\n.bi-telephone-outbound::before {\n  content: \"\"; }\n\n.bi-telephone-plus-fill::before {\n  content: \"\"; }\n\n.bi-telephone-plus::before {\n  content: \"\"; }\n\n.bi-telephone-x-fill::before {\n  content: \"\"; }\n\n.bi-telephone-x::before {\n  content: \"\"; }\n\n.bi-telephone::before {\n  content: \"\"; }\n\n.bi-terminal-fill::before {\n  content: \"\"; }\n\n.bi-terminal::before {\n  content: \"\"; }\n\n.bi-text-center::before {\n  content: \"\"; }\n\n.bi-text-indent-left::before {\n  content: \"\"; }\n\n.bi-text-indent-right::before {\n  content: \"\"; }\n\n.bi-text-left::before {\n  content: \"\"; }\n\n.bi-text-paragraph::before {\n  content: \"\"; }\n\n.bi-text-right::before {\n  content: \"\"; }\n\n.bi-textarea-resize::before {\n  content: \"\"; }\n\n.bi-textarea-t::before {\n  content: \"\"; }\n\n.bi-textarea::before {\n  content: \"\"; }\n\n.bi-thermometer-half::before {\n  content: \"\"; }\n\n.bi-thermometer-high::before {\n  content: \"\"; }\n\n.bi-thermometer-low::before {\n  content: \"\"; }\n\n.bi-thermometer-snow::before {\n  content: \"\"; }\n\n.bi-thermometer-sun::before {\n  content: \"\"; }\n\n.bi-thermometer::before {\n  content: \"\"; }\n\n.bi-three-dots-vertical::before {\n  content: \"\"; }\n\n.bi-three-dots::before {\n  content: \"\"; }\n\n.bi-toggle-off::before {\n  content: \"\"; }\n\n.bi-toggle-on::before {\n  content: \"\"; }\n\n.bi-toggle2-off::before {\n  content: \"\"; }\n\n.bi-toggle2-on::before {\n  content: \"\"; }\n\n.bi-toggles::before {\n  content: \"\"; }\n\n.bi-toggles2::before {\n  content: \"\"; }\n\n.bi-tools::before {\n  content: \"\"; }\n\n.bi-tornado::before {\n  content: \"\"; }\n\n.bi-trash-fill::before {\n  content: \"\"; }\n\n.bi-trash::before {\n  content: \"\"; }\n\n.bi-trash2-fill::before {\n  content: \"\"; }\n\n.bi-trash2::before {\n  content: \"\"; }\n\n.bi-tree-fill::before {\n  content: \"\"; }\n\n.bi-tree::before {\n  content: \"\"; }\n\n.bi-triangle-fill::before {\n  content: \"\"; }\n\n.bi-triangle-half::before {\n  content: \"\"; }\n\n.bi-triangle::before {\n  content: \"\"; }\n\n.bi-trophy-fill::before {\n  content: \"\"; }\n\n.bi-trophy::before {\n  content: \"\"; }\n\n.bi-tropical-storm::before {\n  content: \"\"; }\n\n.bi-truck-flatbed::before {\n  content: \"\"; }\n\n.bi-truck::before {\n  content: \"\"; }\n\n.bi-tsunami::before {\n  content: \"\"; }\n\n.bi-tv-fill::before {\n  content: \"\"; }\n\n.bi-tv::before {\n  content: \"\"; }\n\n.bi-twitch::before {\n  content: \"\"; }\n\n.bi-twitter::before {\n  content: \"\"; }\n\n.bi-type-bold::before {\n  content: \"\"; }\n\n.bi-type-h1::before {\n  content: \"\"; }\n\n.bi-type-h2::before {\n  content: \"\"; }\n\n.bi-type-h3::before {\n  content: \"\"; }\n\n.bi-type-italic::before {\n  content: \"\"; }\n\n.bi-type-strikethrough::before {\n  content: \"\"; }\n\n.bi-type-underline::before {\n  content: \"\"; }\n\n.bi-type::before {\n  content: \"\"; }\n\n.bi-ui-checks-grid::before {\n  content: \"\"; }\n\n.bi-ui-checks::before {\n  content: \"\"; }\n\n.bi-ui-radios-grid::before {\n  content: \"\"; }\n\n.bi-ui-radios::before {\n  content: \"\"; }\n\n.bi-umbrella-fill::before {\n  content: \"\"; }\n\n.bi-umbrella::before {\n  content: \"\"; }\n\n.bi-union::before {\n  content: \"\"; }\n\n.bi-unlock-fill::before {\n  content: \"\"; }\n\n.bi-unlock::before {\n  content: \"\"; }\n\n.bi-upc-scan::before {\n  content: \"\"; }\n\n.bi-upc::before {\n  content: \"\"; }\n\n.bi-upload::before {\n  content: \"\"; }\n\n.bi-vector-pen::before {\n  content: \"\"; }\n\n.bi-view-list::before {\n  content: \"\"; }\n\n.bi-view-stacked::before {\n  content: \"\"; }\n\n.bi-vinyl-fill::before {\n  content: \"\"; }\n\n.bi-vinyl::before {\n  content: \"\"; }\n\n.bi-voicemail::before {\n  content: \"\"; }\n\n.bi-volume-down-fill::before {\n  content: \"\"; }\n\n.bi-volume-down::before {\n  content: \"\"; }\n\n.bi-volume-mute-fill::before {\n  content: \"\"; }\n\n.bi-volume-mute::before {\n  content: \"\"; }\n\n.bi-volume-off-fill::before {\n  content: \"\"; }\n\n.bi-volume-off::before {\n  content: \"\"; }\n\n.bi-volume-up-fill::before {\n  content: \"\"; }\n\n.bi-volume-up::before {\n  content: \"\"; }\n\n.bi-vr::before {\n  content: \"\"; }\n\n.bi-wallet-fill::before {\n  content: \"\"; }\n\n.bi-wallet::before {\n  content: \"\"; }\n\n.bi-wallet2::before {\n  content: \"\"; }\n\n.bi-watch::before {\n  content: \"\"; }\n\n.bi-water::before {\n  content: \"\"; }\n\n.bi-whatsapp::before {\n  content: \"\"; }\n\n.bi-wifi-1::before {\n  content: \"\"; }\n\n.bi-wifi-2::before {\n  content: \"\"; }\n\n.bi-wifi-off::before {\n  content: \"\"; }\n\n.bi-wifi::before {\n  content: \"\"; }\n\n.bi-wind::before {\n  content: \"\"; }\n\n.bi-window-dock::before {\n  content: \"\"; }\n\n.bi-window-sidebar::before {\n  content: \"\"; }\n\n.bi-window::before {\n  content: \"\"; }\n\n.bi-wrench::before {\n  content: \"\"; }\n\n.bi-x-circle-fill::before {\n  content: \"\"; }\n\n.bi-x-circle::before {\n  content: \"\"; }\n\n.bi-x-diamond-fill::before {\n  content: \"\"; }\n\n.bi-x-diamond::before {\n  content: \"\"; }\n\n.bi-x-octagon-fill::before {\n  content: \"\"; }\n\n.bi-x-octagon::before {\n  content: \"\"; }\n\n.bi-x-square-fill::before {\n  content: \"\"; }\n\n.bi-x-square::before {\n  content: \"\"; }\n\n.bi-x::before {\n  content: \"\"; }\n\n.bi-youtube::before {\n  content: \"\"; }\n\n.bi-zoom-in::before {\n  content: \"\"; }\n\n.bi-zoom-out::before {\n  content: \"\"; }\n\n.bi-bank::before {\n  content: \"\"; }\n\n.bi-bank2::before {\n  content: \"\"; }\n\n.bi-bell-slash-fill::before {\n  content: \"\"; }\n\n.bi-bell-slash::before {\n  content: \"\"; }\n\n.bi-cash-coin::before {\n  content: \"\"; }\n\n.bi-check-lg::before {\n  content: \"\"; }\n\n.bi-coin::before {\n  content: \"\"; }\n\n.bi-currency-bitcoin::before {\n  content: \"\"; }\n\n.bi-currency-dollar::before {\n  content: \"\"; }\n\n.bi-currency-euro::before {\n  content: \"\"; }\n\n.bi-currency-exchange::before {\n  content: \"\"; }\n\n.bi-currency-pound::before {\n  content: \"\"; }\n\n.bi-currency-yen::before {\n  content: \"\"; }\n\n.bi-dash-lg::before {\n  content: \"\"; }\n\n.bi-exclamation-lg::before {\n  content: \"\"; }\n\n.bi-file-earmark-pdf-fill::before {\n  content: \"\"; }\n\n.bi-file-earmark-pdf::before {\n  content: \"\"; }\n\n.bi-file-pdf-fill::before {\n  content: \"\"; }\n\n.bi-file-pdf::before {\n  content: \"\"; }\n\n.bi-gender-ambiguous::before {\n  content: \"\"; }\n\n.bi-gender-female::before {\n  content: \"\"; }\n\n.bi-gender-male::before {\n  content: \"\"; }\n\n.bi-gender-trans::before {\n  content: \"\"; }\n\n.bi-headset-vr::before {\n  content: \"\"; }\n\n.bi-info-lg::before {\n  content: \"\"; }\n\n.bi-mastodon::before {\n  content: \"\"; }\n\n.bi-messenger::before {\n  content: \"\"; }\n\n.bi-piggy-bank-fill::before {\n  content: \"\"; }\n\n.bi-piggy-bank::before {\n  content: \"\"; }\n\n.bi-pin-map-fill::before {\n  content: \"\"; }\n\n.bi-pin-map::before {\n  content: \"\"; }\n\n.bi-plus-lg::before {\n  content: \"\"; }\n\n.bi-question-lg::before {\n  content: \"\"; }\n\n.bi-recycle::before {\n  content: \"\"; }\n\n.bi-reddit::before {\n  content: \"\"; }\n\n.bi-safe-fill::before {\n  content: \"\"; }\n\n.bi-safe2-fill::before {\n  content: \"\"; }\n\n.bi-safe2::before {\n  content: \"\"; }\n\n.bi-sd-card-fill::before {\n  content: \"\"; }\n\n.bi-sd-card::before {\n  content: \"\"; }\n\n.bi-skype::before {\n  content: \"\"; }\n\n.bi-slash-lg::before {\n  content: \"\"; }\n\n.bi-translate::before {\n  content: \"\"; }\n\n.bi-x-lg::before {\n  content: \"\"; }\n\n.bi-safe::before {\n  content: \"\"; }\n\n.bi-apple::before {\n  content: \"\"; }\n\n.bi-microsoft::before {\n  content: \"\"; }\n\n.bi-windows::before {\n  content: \"\"; }\n\n.bi-behance::before {\n  content: \"\"; }\n\n.bi-dribbble::before {\n  content: \"\"; }\n\n.bi-line::before {\n  content: \"\"; }\n\n.bi-medium::before {\n  content: \"\"; }\n\n.bi-paypal::before {\n  content: \"\"; }\n\n.bi-pinterest::before {\n  content: \"\"; }\n\n.bi-signal::before {\n  content: \"\"; }\n\n.bi-snapchat::before {\n  content: \"\"; }\n\n.bi-spotify::before {\n  content: \"\"; }\n\n.bi-stack-overflow::before {\n  content: \"\"; }\n\n.bi-strava::before {\n  content: \"\"; }\n\n.bi-wordpress::before {\n  content: \"\"; }\n\n.bi-vimeo::before {\n  content: \"\"; }\n\n.bi-activity::before {\n  content: \"\"; }\n\n.bi-easel2-fill::before {\n  content: \"\"; }\n\n.bi-easel2::before {\n  content: \"\"; }\n\n.bi-easel3-fill::before {\n  content: \"\"; }\n\n.bi-easel3::before {\n  content: \"\"; }\n\n.bi-fan::before {\n  content: \"\"; }\n\n.bi-fingerprint::before {\n  content: \"\"; }\n\n.bi-graph-down-arrow::before {\n  content: \"\"; }\n\n.bi-graph-up-arrow::before {\n  content: \"\"; }\n\n.bi-hypnotize::before {\n  content: \"\"; }\n\n.bi-magic::before {\n  content: \"\"; }\n\n.bi-person-rolodex::before {\n  content: \"\"; }\n\n.bi-person-video::before {\n  content: \"\"; }\n\n.bi-person-video2::before {\n  content: \"\"; }\n\n.bi-person-video3::before {\n  content: \"\"; }\n\n.bi-person-workspace::before {\n  content: \"\"; }\n\n.bi-radioactive::before {\n  content: \"\"; }\n\n.bi-webcam-fill::before {\n  content: \"\"; }\n\n.bi-webcam::before {\n  content: \"\"; }\n\n.bi-yin-yang::before {\n  content: \"\"; }\n\n.bi-bandaid-fill::before {\n  content: \"\"; }\n\n.bi-bandaid::before {\n  content: \"\"; }\n\n.bi-bluetooth::before {\n  content: \"\"; }\n\n.bi-body-text::before {\n  content: \"\"; }\n\n.bi-boombox::before {\n  content: \"\"; }\n\n.bi-boxes::before {\n  content: \"\"; }\n\n.bi-dpad-fill::before {\n  content: \"\"; }\n\n.bi-dpad::before {\n  content: \"\"; }\n\n.bi-ear-fill::before {\n  content: \"\"; }\n\n.bi-ear::before {\n  content: \"\"; }\n\n.bi-envelope-check-1::before {\n  content: \"\"; }\n\n.bi-envelope-check-fill::before {\n  content: \"\"; }\n\n.bi-envelope-check::before {\n  content: \"\"; }\n\n.bi-envelope-dash-1::before {\n  content: \"\"; }\n\n.bi-envelope-dash-fill::before {\n  content: \"\"; }\n\n.bi-envelope-dash::before {\n  content: \"\"; }\n\n.bi-envelope-exclamation-1::before {\n  content: \"\"; }\n\n.bi-envelope-exclamation-fill::before {\n  content: \"\"; }\n\n.bi-envelope-exclamation::before {\n  content: \"\"; }\n\n.bi-envelope-plus-fill::before {\n  content: \"\"; }\n\n.bi-envelope-plus::before {\n  content: \"\"; }\n\n.bi-envelope-slash-1::before {\n  content: \"\"; }\n\n.bi-envelope-slash-fill::before {\n  content: \"\"; }\n\n.bi-envelope-slash::before {\n  content: \"\"; }\n\n.bi-envelope-x-1::before {\n  content: \"\"; }\n\n.bi-envelope-x-fill::before {\n  content: \"\"; }\n\n.bi-envelope-x::before {\n  content: \"\"; }\n\n.bi-explicit-fill::before {\n  content: \"\"; }\n\n.bi-explicit::before {\n  content: \"\"; }\n\n.bi-git::before {\n  content: \"\"; }\n\n.bi-infinity::before {\n  content: \"\"; }\n\n.bi-list-columns-reverse::before {\n  content: \"\"; }\n\n.bi-list-columns::before {\n  content: \"\"; }\n\n.bi-meta::before {\n  content: \"\"; }\n\n.bi-mortorboard-fill::before {\n  content: \"\"; }\n\n.bi-mortorboard::before {\n  content: \"\"; }\n\n.bi-nintendo-switch::before {\n  content: \"\"; }\n\n.bi-pc-display-horizontal::before {\n  content: \"\"; }\n\n.bi-pc-display::before {\n  content: \"\"; }\n\n.bi-pc-horizontal::before {\n  content: \"\"; }\n\n.bi-pc::before {\n  content: \"\"; }\n\n.bi-playstation::before {\n  content: \"\"; }\n\n.bi-plus-slash-minus::before {\n  content: \"\"; }\n\n.bi-projector-fill::before {\n  content: \"\"; }\n\n.bi-projector::before {\n  content: \"\"; }\n\n.bi-qr-code-scan::before {\n  content: \"\"; }\n\n.bi-qr-code::before {\n  content: \"\"; }\n\n.bi-quora::before {\n  content: \"\"; }\n\n.bi-quote::before {\n  content: \"\"; }\n\n.bi-robot::before {\n  content: \"\"; }\n\n.bi-send-check-fill::before {\n  content: \"\"; }\n\n.bi-send-check::before {\n  content: \"\"; }\n\n.bi-send-dash-fill::before {\n  content: \"\"; }\n\n.bi-send-dash::before {\n  content: \"\"; }\n\n.bi-send-exclamation-1::before {\n  content: \"\"; }\n\n.bi-send-exclamation-fill::before {\n  content: \"\"; }\n\n.bi-send-exclamation::before {\n  content: \"\"; }\n\n.bi-send-fill::before {\n  content: \"\"; }\n\n.bi-send-plus-fill::before {\n  content: \"\"; }\n\n.bi-send-plus::before {\n  content: \"\"; }\n\n.bi-send-slash-fill::before {\n  content: \"\"; }\n\n.bi-send-slash::before {\n  content: \"\"; }\n\n.bi-send-x-fill::before {\n  content: \"\"; }\n\n.bi-send-x::before {\n  content: \"\"; }\n\n.bi-send::before {\n  content: \"\"; }\n\n.bi-steam::before {\n  content: \"\"; }\n\n.bi-terminal-dash-1::before {\n  content: \"\"; }\n\n.bi-terminal-dash::before {\n  content: \"\"; }\n\n.bi-terminal-plus::before {\n  content: \"\"; }\n\n.bi-terminal-split::before {\n  content: \"\"; }\n\n.bi-ticket-detailed-fill::before {\n  content: \"\"; }\n\n.bi-ticket-detailed::before {\n  content: \"\"; }\n\n.bi-ticket-fill::before {\n  content: \"\"; }\n\n.bi-ticket-perforated-fill::before {\n  content: \"\"; }\n\n.bi-ticket-perforated::before {\n  content: \"\"; }\n\n.bi-ticket::before {\n  content: \"\"; }\n\n.bi-tiktok::before {\n  content: \"\"; }\n\n.bi-window-dash::before {\n  content: \"\"; }\n\n.bi-window-desktop::before {\n  content: \"\"; }\n\n.bi-window-fullscreen::before {\n  content: \"\"; }\n\n.bi-window-plus::before {\n  content: \"\"; }\n\n.bi-window-split::before {\n  content: \"\"; }\n\n.bi-window-stack::before {\n  content: \"\"; }\n\n.bi-window-x::before {\n  content: \"\"; }\n\n.bi-xbox::before {\n  content: \"\"; }\n\n.bi-ethernet::before {\n  content: \"\"; }\n\n.bi-hdmi-fill::before {\n  content: \"\"; }\n\n.bi-hdmi::before {\n  content: \"\"; }\n\n.bi-usb-c-fill::before {\n  content: \"\"; }\n\n.bi-usb-c::before {\n  content: \"\"; }\n\n.bi-usb-fill::before {\n  content: \"\"; }\n\n.bi-usb-plug-fill::before {\n  content: \"\"; }\n\n.bi-usb-plug::before {\n  content: \"\"; }\n\n.bi-usb-symbol::before {\n  content: \"\"; }\n\n.bi-usb::before {\n  content: \"\"; }\n\n.bi-boombox-fill::before {\n  content: \"\"; }\n\n.bi-displayport-1::before {\n  content: \"\"; }\n\n.bi-displayport::before {\n  content: \"\"; }\n\n.bi-gpu-card::before {\n  content: \"\"; }\n\n.bi-memory::before {\n  content: \"\"; }\n\n.bi-modem-fill::before {\n  content: \"\"; }\n\n.bi-modem::before {\n  content: \"\"; }\n\n.bi-motherboard-fill::before {\n  content: \"\"; }\n\n.bi-motherboard::before {\n  content: \"\"; }\n\n.bi-optical-audio-fill::before {\n  content: \"\"; }\n\n.bi-optical-audio::before {\n  content: \"\"; }\n\n.bi-pci-card::before {\n  content: \"\"; }\n\n.bi-router-fill::before {\n  content: \"\"; }\n\n.bi-router::before {\n  content: \"\"; }\n\n.bi-ssd-fill::before {\n  content: \"\"; }\n\n.bi-ssd::before {\n  content: \"\"; }\n\n.bi-thunderbolt-fill::before {\n  content: \"\"; }\n\n.bi-thunderbolt::before {\n  content: \"\"; }\n\n.bi-usb-drive-fill::before {\n  content: \"\"; }\n\n.bi-usb-drive::before {\n  content: \"\"; }\n\n.bi-usb-micro-fill::before {\n  content: \"\"; }\n\n.bi-usb-micro::before {\n  content: \"\"; }\n\n.bi-usb-mini-fill::before {\n  content: \"\"; }\n\n.bi-usb-mini::before {\n  content: \"\"; }\n\n.bi-cloud-haze2::before {\n  content: \"\"; }\n\n.bi-device-hdd-fill::before {\n  content: \"\"; }\n\n.bi-device-hdd::before {\n  content: \"\"; }\n\n.bi-device-ssd-fill::before {\n  content: \"\"; }\n\n.bi-device-ssd::before {\n  content: \"\"; }\n\n.bi-displayport-fill::before {\n  content: \"\"; }\n\n.bi-mortarboard-fill::before {\n  content: \"\"; }\n\n.bi-mortarboard::before {\n  content: \"\"; }\n\n.bi-terminal-x::before {\n  content: \"\"; }\n", "",{"version":3,"sources":["webpack://./node_modules/bootstrap-icons/font/bootstrap-icons.scss"],"names":[],"mappings":"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","sourcesContent":["$bootstrap-icons-font: \"bootstrap-icons\" !default;\n$bootstrap-icons-font-src: url(\"./fonts/bootstrap-icons.woff2?30af91bf14e37666a085fb8a161ff36d\") format(\"woff2\"),\nurl(\"./fonts/bootstrap-icons.woff?30af91bf14e37666a085fb8a161ff36d\") format(\"woff\") !default;\n\n@font-face {\n  font-family: $bootstrap-icons-font;\n  src: $bootstrap-icons-font-src;\n}\n\n.bi::before,\n[class^=\"bi-\"]::before,\n[class*=\" bi-\"]::before {\n  display: inline-block;\n  font-family: $bootstrap-icons-font !important;\n  font-style: normal;\n  font-weight: normal !important;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  vertical-align: -.125em;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n$bootstrap-icons-map: (\n  \"123\": \"\\f67f\",\n  \"alarm-fill\": \"\\f101\",\n  \"alarm\": \"\\f102\",\n  \"align-bottom\": \"\\f103\",\n  \"align-center\": \"\\f104\",\n  \"align-end\": \"\\f105\",\n  \"align-middle\": \"\\f106\",\n  \"align-start\": \"\\f107\",\n  \"align-top\": \"\\f108\",\n  \"alt\": \"\\f109\",\n  \"app-indicator\": \"\\f10a\",\n  \"app\": \"\\f10b\",\n  \"archive-fill\": \"\\f10c\",\n  \"archive\": \"\\f10d\",\n  \"arrow-90deg-down\": \"\\f10e\",\n  \"arrow-90deg-left\": \"\\f10f\",\n  \"arrow-90deg-right\": \"\\f110\",\n  \"arrow-90deg-up\": \"\\f111\",\n  \"arrow-bar-down\": \"\\f112\",\n  \"arrow-bar-left\": \"\\f113\",\n  \"arrow-bar-right\": \"\\f114\",\n  \"arrow-bar-up\": \"\\f115\",\n  \"arrow-clockwise\": \"\\f116\",\n  \"arrow-counterclockwise\": \"\\f117\",\n  \"arrow-down-circle-fill\": \"\\f118\",\n  \"arrow-down-circle\": \"\\f119\",\n  \"arrow-down-left-circle-fill\": \"\\f11a\",\n  \"arrow-down-left-circle\": \"\\f11b\",\n  \"arrow-down-left-square-fill\": \"\\f11c\",\n  \"arrow-down-left-square\": \"\\f11d\",\n  \"arrow-down-left\": \"\\f11e\",\n  \"arrow-down-right-circle-fill\": \"\\f11f\",\n  \"arrow-down-right-circle\": \"\\f120\",\n  \"arrow-down-right-square-fill\": \"\\f121\",\n  \"arrow-down-right-square\": \"\\f122\",\n  \"arrow-down-right\": \"\\f123\",\n  \"arrow-down-short\": \"\\f124\",\n  \"arrow-down-square-fill\": \"\\f125\",\n  \"arrow-down-square\": \"\\f126\",\n  \"arrow-down-up\": \"\\f127\",\n  \"arrow-down\": \"\\f128\",\n  \"arrow-left-circle-fill\": \"\\f129\",\n  \"arrow-left-circle\": \"\\f12a\",\n  \"arrow-left-right\": \"\\f12b\",\n  \"arrow-left-short\": \"\\f12c\",\n  \"arrow-left-square-fill\": \"\\f12d\",\n  \"arrow-left-square\": \"\\f12e\",\n  \"arrow-left\": \"\\f12f\",\n  \"arrow-repeat\": \"\\f130\",\n  \"arrow-return-left\": \"\\f131\",\n  \"arrow-return-right\": \"\\f132\",\n  \"arrow-right-circle-fill\": \"\\f133\",\n  \"arrow-right-circle\": \"\\f134\",\n  \"arrow-right-short\": \"\\f135\",\n  \"arrow-right-square-fill\": \"\\f136\",\n  \"arrow-right-square\": \"\\f137\",\n  \"arrow-right\": \"\\f138\",\n  \"arrow-up-circle-fill\": \"\\f139\",\n  \"arrow-up-circle\": \"\\f13a\",\n  \"arrow-up-left-circle-fill\": \"\\f13b\",\n  \"arrow-up-left-circle\": \"\\f13c\",\n  \"arrow-up-left-square-fill\": \"\\f13d\",\n  \"arrow-up-left-square\": \"\\f13e\",\n  \"arrow-up-left\": \"\\f13f\",\n  \"arrow-up-right-circle-fill\": \"\\f140\",\n  \"arrow-up-right-circle\": \"\\f141\",\n  \"arrow-up-right-square-fill\": \"\\f142\",\n  \"arrow-up-right-square\": \"\\f143\",\n  \"arrow-up-right\": \"\\f144\",\n  \"arrow-up-short\": \"\\f145\",\n  \"arrow-up-square-fill\": \"\\f146\",\n  \"arrow-up-square\": \"\\f147\",\n  \"arrow-up\": \"\\f148\",\n  \"arrows-angle-contract\": \"\\f149\",\n  \"arrows-angle-expand\": \"\\f14a\",\n  \"arrows-collapse\": \"\\f14b\",\n  \"arrows-expand\": \"\\f14c\",\n  \"arrows-fullscreen\": \"\\f14d\",\n  \"arrows-move\": \"\\f14e\",\n  \"aspect-ratio-fill\": \"\\f14f\",\n  \"aspect-ratio\": \"\\f150\",\n  \"asterisk\": \"\\f151\",\n  \"at\": \"\\f152\",\n  \"award-fill\": \"\\f153\",\n  \"award\": \"\\f154\",\n  \"back\": \"\\f155\",\n  \"backspace-fill\": \"\\f156\",\n  \"backspace-reverse-fill\": \"\\f157\",\n  \"backspace-reverse\": \"\\f158\",\n  \"backspace\": \"\\f159\",\n  \"badge-3d-fill\": \"\\f15a\",\n  \"badge-3d\": \"\\f15b\",\n  \"badge-4k-fill\": \"\\f15c\",\n  \"badge-4k\": \"\\f15d\",\n  \"badge-8k-fill\": \"\\f15e\",\n  \"badge-8k\": \"\\f15f\",\n  \"badge-ad-fill\": \"\\f160\",\n  \"badge-ad\": \"\\f161\",\n  \"badge-ar-fill\": \"\\f162\",\n  \"badge-ar\": \"\\f163\",\n  \"badge-cc-fill\": \"\\f164\",\n  \"badge-cc\": \"\\f165\",\n  \"badge-hd-fill\": \"\\f166\",\n  \"badge-hd\": \"\\f167\",\n  \"badge-tm-fill\": \"\\f168\",\n  \"badge-tm\": \"\\f169\",\n  \"badge-vo-fill\": \"\\f16a\",\n  \"badge-vo\": \"\\f16b\",\n  \"badge-vr-fill\": \"\\f16c\",\n  \"badge-vr\": \"\\f16d\",\n  \"badge-wc-fill\": \"\\f16e\",\n  \"badge-wc\": \"\\f16f\",\n  \"bag-check-fill\": \"\\f170\",\n  \"bag-check\": \"\\f171\",\n  \"bag-dash-fill\": \"\\f172\",\n  \"bag-dash\": \"\\f173\",\n  \"bag-fill\": \"\\f174\",\n  \"bag-plus-fill\": \"\\f175\",\n  \"bag-plus\": \"\\f176\",\n  \"bag-x-fill\": \"\\f177\",\n  \"bag-x\": \"\\f178\",\n  \"bag\": \"\\f179\",\n  \"bar-chart-fill\": \"\\f17a\",\n  \"bar-chart-line-fill\": \"\\f17b\",\n  \"bar-chart-line\": \"\\f17c\",\n  \"bar-chart-steps\": \"\\f17d\",\n  \"bar-chart\": \"\\f17e\",\n  \"basket-fill\": \"\\f17f\",\n  \"basket\": \"\\f180\",\n  \"basket2-fill\": \"\\f181\",\n  \"basket2\": \"\\f182\",\n  \"basket3-fill\": \"\\f183\",\n  \"basket3\": \"\\f184\",\n  \"battery-charging\": \"\\f185\",\n  \"battery-full\": \"\\f186\",\n  \"battery-half\": \"\\f187\",\n  \"battery\": \"\\f188\",\n  \"bell-fill\": \"\\f189\",\n  \"bell\": \"\\f18a\",\n  \"bezier\": \"\\f18b\",\n  \"bezier2\": \"\\f18c\",\n  \"bicycle\": \"\\f18d\",\n  \"binoculars-fill\": \"\\f18e\",\n  \"binoculars\": \"\\f18f\",\n  \"blockquote-left\": \"\\f190\",\n  \"blockquote-right\": \"\\f191\",\n  \"book-fill\": \"\\f192\",\n  \"book-half\": \"\\f193\",\n  \"book\": \"\\f194\",\n  \"bookmark-check-fill\": \"\\f195\",\n  \"bookmark-check\": \"\\f196\",\n  \"bookmark-dash-fill\": \"\\f197\",\n  \"bookmark-dash\": \"\\f198\",\n  \"bookmark-fill\": \"\\f199\",\n  \"bookmark-heart-fill\": \"\\f19a\",\n  \"bookmark-heart\": \"\\f19b\",\n  \"bookmark-plus-fill\": \"\\f19c\",\n  \"bookmark-plus\": \"\\f19d\",\n  \"bookmark-star-fill\": \"\\f19e\",\n  \"bookmark-star\": \"\\f19f\",\n  \"bookmark-x-fill\": \"\\f1a0\",\n  \"bookmark-x\": \"\\f1a1\",\n  \"bookmark\": \"\\f1a2\",\n  \"bookmarks-fill\": \"\\f1a3\",\n  \"bookmarks\": \"\\f1a4\",\n  \"bookshelf\": \"\\f1a5\",\n  \"bootstrap-fill\": \"\\f1a6\",\n  \"bootstrap-reboot\": \"\\f1a7\",\n  \"bootstrap\": \"\\f1a8\",\n  \"border-all\": \"\\f1a9\",\n  \"border-bottom\": \"\\f1aa\",\n  \"border-center\": \"\\f1ab\",\n  \"border-inner\": \"\\f1ac\",\n  \"border-left\": \"\\f1ad\",\n  \"border-middle\": \"\\f1ae\",\n  \"border-outer\": \"\\f1af\",\n  \"border-right\": \"\\f1b0\",\n  \"border-style\": \"\\f1b1\",\n  \"border-top\": \"\\f1b2\",\n  \"border-width\": \"\\f1b3\",\n  \"border\": \"\\f1b4\",\n  \"bounding-box-circles\": \"\\f1b5\",\n  \"bounding-box\": \"\\f1b6\",\n  \"box-arrow-down-left\": \"\\f1b7\",\n  \"box-arrow-down-right\": \"\\f1b8\",\n  \"box-arrow-down\": \"\\f1b9\",\n  \"box-arrow-in-down-left\": \"\\f1ba\",\n  \"box-arrow-in-down-right\": \"\\f1bb\",\n  \"box-arrow-in-down\": \"\\f1bc\",\n  \"box-arrow-in-left\": \"\\f1bd\",\n  \"box-arrow-in-right\": \"\\f1be\",\n  \"box-arrow-in-up-left\": \"\\f1bf\",\n  \"box-arrow-in-up-right\": \"\\f1c0\",\n  \"box-arrow-in-up\": \"\\f1c1\",\n  \"box-arrow-left\": \"\\f1c2\",\n  \"box-arrow-right\": \"\\f1c3\",\n  \"box-arrow-up-left\": \"\\f1c4\",\n  \"box-arrow-up-right\": \"\\f1c5\",\n  \"box-arrow-up\": \"\\f1c6\",\n  \"box-seam\": \"\\f1c7\",\n  \"box\": \"\\f1c8\",\n  \"braces\": \"\\f1c9\",\n  \"bricks\": \"\\f1ca\",\n  \"briefcase-fill\": \"\\f1cb\",\n  \"briefcase\": \"\\f1cc\",\n  \"brightness-alt-high-fill\": \"\\f1cd\",\n  \"brightness-alt-high\": \"\\f1ce\",\n  \"brightness-alt-low-fill\": \"\\f1cf\",\n  \"brightness-alt-low\": \"\\f1d0\",\n  \"brightness-high-fill\": \"\\f1d1\",\n  \"brightness-high\": \"\\f1d2\",\n  \"brightness-low-fill\": \"\\f1d3\",\n  \"brightness-low\": \"\\f1d4\",\n  \"broadcast-pin\": \"\\f1d5\",\n  \"broadcast\": \"\\f1d6\",\n  \"brush-fill\": \"\\f1d7\",\n  \"brush\": \"\\f1d8\",\n  \"bucket-fill\": \"\\f1d9\",\n  \"bucket\": \"\\f1da\",\n  \"bug-fill\": \"\\f1db\",\n  \"bug\": \"\\f1dc\",\n  \"building\": \"\\f1dd\",\n  \"bullseye\": \"\\f1de\",\n  \"calculator-fill\": \"\\f1df\",\n  \"calculator\": \"\\f1e0\",\n  \"calendar-check-fill\": \"\\f1e1\",\n  \"calendar-check\": \"\\f1e2\",\n  \"calendar-date-fill\": \"\\f1e3\",\n  \"calendar-date\": \"\\f1e4\",\n  \"calendar-day-fill\": \"\\f1e5\",\n  \"calendar-day\": \"\\f1e6\",\n  \"calendar-event-fill\": \"\\f1e7\",\n  \"calendar-event\": \"\\f1e8\",\n  \"calendar-fill\": \"\\f1e9\",\n  \"calendar-minus-fill\": \"\\f1ea\",\n  \"calendar-minus\": \"\\f1eb\",\n  \"calendar-month-fill\": \"\\f1ec\",\n  \"calendar-month\": \"\\f1ed\",\n  \"calendar-plus-fill\": \"\\f1ee\",\n  \"calendar-plus\": \"\\f1ef\",\n  \"calendar-range-fill\": \"\\f1f0\",\n  \"calendar-range\": \"\\f1f1\",\n  \"calendar-week-fill\": \"\\f1f2\",\n  \"calendar-week\": \"\\f1f3\",\n  \"calendar-x-fill\": \"\\f1f4\",\n  \"calendar-x\": \"\\f1f5\",\n  \"calendar\": \"\\f1f6\",\n  \"calendar2-check-fill\": \"\\f1f7\",\n  \"calendar2-check\": \"\\f1f8\",\n  \"calendar2-date-fill\": \"\\f1f9\",\n  \"calendar2-date\": \"\\f1fa\",\n  \"calendar2-day-fill\": \"\\f1fb\",\n  \"calendar2-day\": \"\\f1fc\",\n  \"calendar2-event-fill\": \"\\f1fd\",\n  \"calendar2-event\": \"\\f1fe\",\n  \"calendar2-fill\": \"\\f1ff\",\n  \"calendar2-minus-fill\": \"\\f200\",\n  \"calendar2-minus\": \"\\f201\",\n  \"calendar2-month-fill\": \"\\f202\",\n  \"calendar2-month\": \"\\f203\",\n  \"calendar2-plus-fill\": \"\\f204\",\n  \"calendar2-plus\": \"\\f205\",\n  \"calendar2-range-fill\": \"\\f206\",\n  \"calendar2-range\": \"\\f207\",\n  \"calendar2-week-fill\": \"\\f208\",\n  \"calendar2-week\": \"\\f209\",\n  \"calendar2-x-fill\": \"\\f20a\",\n  \"calendar2-x\": \"\\f20b\",\n  \"calendar2\": \"\\f20c\",\n  \"calendar3-event-fill\": \"\\f20d\",\n  \"calendar3-event\": \"\\f20e\",\n  \"calendar3-fill\": \"\\f20f\",\n  \"calendar3-range-fill\": \"\\f210\",\n  \"calendar3-range\": \"\\f211\",\n  \"calendar3-week-fill\": \"\\f212\",\n  \"calendar3-week\": \"\\f213\",\n  \"calendar3\": \"\\f214\",\n  \"calendar4-event\": \"\\f215\",\n  \"calendar4-range\": \"\\f216\",\n  \"calendar4-week\": \"\\f217\",\n  \"calendar4\": \"\\f218\",\n  \"camera-fill\": \"\\f219\",\n  \"camera-reels-fill\": \"\\f21a\",\n  \"camera-reels\": \"\\f21b\",\n  \"camera-video-fill\": \"\\f21c\",\n  \"camera-video-off-fill\": \"\\f21d\",\n  \"camera-video-off\": \"\\f21e\",\n  \"camera-video\": \"\\f21f\",\n  \"camera\": \"\\f220\",\n  \"camera2\": \"\\f221\",\n  \"capslock-fill\": \"\\f222\",\n  \"capslock\": \"\\f223\",\n  \"card-checklist\": \"\\f224\",\n  \"card-heading\": \"\\f225\",\n  \"card-image\": \"\\f226\",\n  \"card-list\": \"\\f227\",\n  \"card-text\": \"\\f228\",\n  \"caret-down-fill\": \"\\f229\",\n  \"caret-down-square-fill\": \"\\f22a\",\n  \"caret-down-square\": \"\\f22b\",\n  \"caret-down\": \"\\f22c\",\n  \"caret-left-fill\": \"\\f22d\",\n  \"caret-left-square-fill\": \"\\f22e\",\n  \"caret-left-square\": \"\\f22f\",\n  \"caret-left\": \"\\f230\",\n  \"caret-right-fill\": \"\\f231\",\n  \"caret-right-square-fill\": \"\\f232\",\n  \"caret-right-square\": \"\\f233\",\n  \"caret-right\": \"\\f234\",\n  \"caret-up-fill\": \"\\f235\",\n  \"caret-up-square-fill\": \"\\f236\",\n  \"caret-up-square\": \"\\f237\",\n  \"caret-up\": \"\\f238\",\n  \"cart-check-fill\": \"\\f239\",\n  \"cart-check\": \"\\f23a\",\n  \"cart-dash-fill\": \"\\f23b\",\n  \"cart-dash\": \"\\f23c\",\n  \"cart-fill\": \"\\f23d\",\n  \"cart-plus-fill\": \"\\f23e\",\n  \"cart-plus\": \"\\f23f\",\n  \"cart-x-fill\": \"\\f240\",\n  \"cart-x\": \"\\f241\",\n  \"cart\": \"\\f242\",\n  \"cart2\": \"\\f243\",\n  \"cart3\": \"\\f244\",\n  \"cart4\": \"\\f245\",\n  \"cash-stack\": \"\\f246\",\n  \"cash\": \"\\f247\",\n  \"cast\": \"\\f248\",\n  \"chat-dots-fill\": \"\\f249\",\n  \"chat-dots\": \"\\f24a\",\n  \"chat-fill\": \"\\f24b\",\n  \"chat-left-dots-fill\": \"\\f24c\",\n  \"chat-left-dots\": \"\\f24d\",\n  \"chat-left-fill\": \"\\f24e\",\n  \"chat-left-quote-fill\": \"\\f24f\",\n  \"chat-left-quote\": \"\\f250\",\n  \"chat-left-text-fill\": \"\\f251\",\n  \"chat-left-text\": \"\\f252\",\n  \"chat-left\": \"\\f253\",\n  \"chat-quote-fill\": \"\\f254\",\n  \"chat-quote\": \"\\f255\",\n  \"chat-right-dots-fill\": \"\\f256\",\n  \"chat-right-dots\": \"\\f257\",\n  \"chat-right-fill\": \"\\f258\",\n  \"chat-right-quote-fill\": \"\\f259\",\n  \"chat-right-quote\": \"\\f25a\",\n  \"chat-right-text-fill\": \"\\f25b\",\n  \"chat-right-text\": \"\\f25c\",\n  \"chat-right\": \"\\f25d\",\n  \"chat-square-dots-fill\": \"\\f25e\",\n  \"chat-square-dots\": \"\\f25f\",\n  \"chat-square-fill\": \"\\f260\",\n  \"chat-square-quote-fill\": \"\\f261\",\n  \"chat-square-quote\": \"\\f262\",\n  \"chat-square-text-fill\": \"\\f263\",\n  \"chat-square-text\": \"\\f264\",\n  \"chat-square\": \"\\f265\",\n  \"chat-text-fill\": \"\\f266\",\n  \"chat-text\": \"\\f267\",\n  \"chat\": \"\\f268\",\n  \"check-all\": \"\\f269\",\n  \"check-circle-fill\": \"\\f26a\",\n  \"check-circle\": \"\\f26b\",\n  \"check-square-fill\": \"\\f26c\",\n  \"check-square\": \"\\f26d\",\n  \"check\": \"\\f26e\",\n  \"check2-all\": \"\\f26f\",\n  \"check2-circle\": \"\\f270\",\n  \"check2-square\": \"\\f271\",\n  \"check2\": \"\\f272\",\n  \"chevron-bar-contract\": \"\\f273\",\n  \"chevron-bar-down\": \"\\f274\",\n  \"chevron-bar-expand\": \"\\f275\",\n  \"chevron-bar-left\": \"\\f276\",\n  \"chevron-bar-right\": \"\\f277\",\n  \"chevron-bar-up\": \"\\f278\",\n  \"chevron-compact-down\": \"\\f279\",\n  \"chevron-compact-left\": \"\\f27a\",\n  \"chevron-compact-right\": \"\\f27b\",\n  \"chevron-compact-up\": \"\\f27c\",\n  \"chevron-contract\": \"\\f27d\",\n  \"chevron-double-down\": \"\\f27e\",\n  \"chevron-double-left\": \"\\f27f\",\n  \"chevron-double-right\": \"\\f280\",\n  \"chevron-double-up\": \"\\f281\",\n  \"chevron-down\": \"\\f282\",\n  \"chevron-expand\": \"\\f283\",\n  \"chevron-left\": \"\\f284\",\n  \"chevron-right\": \"\\f285\",\n  \"chevron-up\": \"\\f286\",\n  \"circle-fill\": \"\\f287\",\n  \"circle-half\": \"\\f288\",\n  \"circle-square\": \"\\f289\",\n  \"circle\": \"\\f28a\",\n  \"clipboard-check\": \"\\f28b\",\n  \"clipboard-data\": \"\\f28c\",\n  \"clipboard-minus\": \"\\f28d\",\n  \"clipboard-plus\": \"\\f28e\",\n  \"clipboard-x\": \"\\f28f\",\n  \"clipboard\": \"\\f290\",\n  \"clock-fill\": \"\\f291\",\n  \"clock-history\": \"\\f292\",\n  \"clock\": \"\\f293\",\n  \"cloud-arrow-down-fill\": \"\\f294\",\n  \"cloud-arrow-down\": \"\\f295\",\n  \"cloud-arrow-up-fill\": \"\\f296\",\n  \"cloud-arrow-up\": \"\\f297\",\n  \"cloud-check-fill\": \"\\f298\",\n  \"cloud-check\": \"\\f299\",\n  \"cloud-download-fill\": \"\\f29a\",\n  \"cloud-download\": \"\\f29b\",\n  \"cloud-drizzle-fill\": \"\\f29c\",\n  \"cloud-drizzle\": \"\\f29d\",\n  \"cloud-fill\": \"\\f29e\",\n  \"cloud-fog-fill\": \"\\f29f\",\n  \"cloud-fog\": \"\\f2a0\",\n  \"cloud-fog2-fill\": \"\\f2a1\",\n  \"cloud-fog2\": \"\\f2a2\",\n  \"cloud-hail-fill\": \"\\f2a3\",\n  \"cloud-hail\": \"\\f2a4\",\n  \"cloud-haze-1\": \"\\f2a5\",\n  \"cloud-haze-fill\": \"\\f2a6\",\n  \"cloud-haze\": \"\\f2a7\",\n  \"cloud-haze2-fill\": \"\\f2a8\",\n  \"cloud-lightning-fill\": \"\\f2a9\",\n  \"cloud-lightning-rain-fill\": \"\\f2aa\",\n  \"cloud-lightning-rain\": \"\\f2ab\",\n  \"cloud-lightning\": \"\\f2ac\",\n  \"cloud-minus-fill\": \"\\f2ad\",\n  \"cloud-minus\": \"\\f2ae\",\n  \"cloud-moon-fill\": \"\\f2af\",\n  \"cloud-moon\": \"\\f2b0\",\n  \"cloud-plus-fill\": \"\\f2b1\",\n  \"cloud-plus\": \"\\f2b2\",\n  \"cloud-rain-fill\": \"\\f2b3\",\n  \"cloud-rain-heavy-fill\": \"\\f2b4\",\n  \"cloud-rain-heavy\": \"\\f2b5\",\n  \"cloud-rain\": \"\\f2b6\",\n  \"cloud-slash-fill\": \"\\f2b7\",\n  \"cloud-slash\": \"\\f2b8\",\n  \"cloud-sleet-fill\": \"\\f2b9\",\n  \"cloud-sleet\": \"\\f2ba\",\n  \"cloud-snow-fill\": \"\\f2bb\",\n  \"cloud-snow\": \"\\f2bc\",\n  \"cloud-sun-fill\": \"\\f2bd\",\n  \"cloud-sun\": \"\\f2be\",\n  \"cloud-upload-fill\": \"\\f2bf\",\n  \"cloud-upload\": \"\\f2c0\",\n  \"cloud\": \"\\f2c1\",\n  \"clouds-fill\": \"\\f2c2\",\n  \"clouds\": \"\\f2c3\",\n  \"cloudy-fill\": \"\\f2c4\",\n  \"cloudy\": \"\\f2c5\",\n  \"code-slash\": \"\\f2c6\",\n  \"code-square\": \"\\f2c7\",\n  \"code\": \"\\f2c8\",\n  \"collection-fill\": \"\\f2c9\",\n  \"collection-play-fill\": \"\\f2ca\",\n  \"collection-play\": \"\\f2cb\",\n  \"collection\": \"\\f2cc\",\n  \"columns-gap\": \"\\f2cd\",\n  \"columns\": \"\\f2ce\",\n  \"command\": \"\\f2cf\",\n  \"compass-fill\": \"\\f2d0\",\n  \"compass\": \"\\f2d1\",\n  \"cone-striped\": \"\\f2d2\",\n  \"cone\": \"\\f2d3\",\n  \"controller\": \"\\f2d4\",\n  \"cpu-fill\": \"\\f2d5\",\n  \"cpu\": \"\\f2d6\",\n  \"credit-card-2-back-fill\": \"\\f2d7\",\n  \"credit-card-2-back\": \"\\f2d8\",\n  \"credit-card-2-front-fill\": \"\\f2d9\",\n  \"credit-card-2-front\": \"\\f2da\",\n  \"credit-card-fill\": \"\\f2db\",\n  \"credit-card\": \"\\f2dc\",\n  \"crop\": \"\\f2dd\",\n  \"cup-fill\": \"\\f2de\",\n  \"cup-straw\": \"\\f2df\",\n  \"cup\": \"\\f2e0\",\n  \"cursor-fill\": \"\\f2e1\",\n  \"cursor-text\": \"\\f2e2\",\n  \"cursor\": \"\\f2e3\",\n  \"dash-circle-dotted\": \"\\f2e4\",\n  \"dash-circle-fill\": \"\\f2e5\",\n  \"dash-circle\": \"\\f2e6\",\n  \"dash-square-dotted\": \"\\f2e7\",\n  \"dash-square-fill\": \"\\f2e8\",\n  \"dash-square\": \"\\f2e9\",\n  \"dash\": \"\\f2ea\",\n  \"diagram-2-fill\": \"\\f2eb\",\n  \"diagram-2\": \"\\f2ec\",\n  \"diagram-3-fill\": \"\\f2ed\",\n  \"diagram-3\": \"\\f2ee\",\n  \"diamond-fill\": \"\\f2ef\",\n  \"diamond-half\": \"\\f2f0\",\n  \"diamond\": \"\\f2f1\",\n  \"dice-1-fill\": \"\\f2f2\",\n  \"dice-1\": \"\\f2f3\",\n  \"dice-2-fill\": \"\\f2f4\",\n  \"dice-2\": \"\\f2f5\",\n  \"dice-3-fill\": \"\\f2f6\",\n  \"dice-3\": \"\\f2f7\",\n  \"dice-4-fill\": \"\\f2f8\",\n  \"dice-4\": \"\\f2f9\",\n  \"dice-5-fill\": \"\\f2fa\",\n  \"dice-5\": \"\\f2fb\",\n  \"dice-6-fill\": \"\\f2fc\",\n  \"dice-6\": \"\\f2fd\",\n  \"disc-fill\": \"\\f2fe\",\n  \"disc\": \"\\f2ff\",\n  \"discord\": \"\\f300\",\n  \"display-fill\": \"\\f301\",\n  \"display\": \"\\f302\",\n  \"distribute-horizontal\": \"\\f303\",\n  \"distribute-vertical\": \"\\f304\",\n  \"door-closed-fill\": \"\\f305\",\n  \"door-closed\": \"\\f306\",\n  \"door-open-fill\": \"\\f307\",\n  \"door-open\": \"\\f308\",\n  \"dot\": \"\\f309\",\n  \"download\": \"\\f30a\",\n  \"droplet-fill\": \"\\f30b\",\n  \"droplet-half\": \"\\f30c\",\n  \"droplet\": \"\\f30d\",\n  \"earbuds\": \"\\f30e\",\n  \"easel-fill\": \"\\f30f\",\n  \"easel\": \"\\f310\",\n  \"egg-fill\": \"\\f311\",\n  \"egg-fried\": \"\\f312\",\n  \"egg\": \"\\f313\",\n  \"eject-fill\": \"\\f314\",\n  \"eject\": \"\\f315\",\n  \"emoji-angry-fill\": \"\\f316\",\n  \"emoji-angry\": \"\\f317\",\n  \"emoji-dizzy-fill\": \"\\f318\",\n  \"emoji-dizzy\": \"\\f319\",\n  \"emoji-expressionless-fill\": \"\\f31a\",\n  \"emoji-expressionless\": \"\\f31b\",\n  \"emoji-frown-fill\": \"\\f31c\",\n  \"emoji-frown\": \"\\f31d\",\n  \"emoji-heart-eyes-fill\": \"\\f31e\",\n  \"emoji-heart-eyes\": \"\\f31f\",\n  \"emoji-laughing-fill\": \"\\f320\",\n  \"emoji-laughing\": \"\\f321\",\n  \"emoji-neutral-fill\": \"\\f322\",\n  \"emoji-neutral\": \"\\f323\",\n  \"emoji-smile-fill\": \"\\f324\",\n  \"emoji-smile-upside-down-fill\": \"\\f325\",\n  \"emoji-smile-upside-down\": \"\\f326\",\n  \"emoji-smile\": \"\\f327\",\n  \"emoji-sunglasses-fill\": \"\\f328\",\n  \"emoji-sunglasses\": \"\\f329\",\n  \"emoji-wink-fill\": \"\\f32a\",\n  \"emoji-wink\": \"\\f32b\",\n  \"envelope-fill\": \"\\f32c\",\n  \"envelope-open-fill\": \"\\f32d\",\n  \"envelope-open\": \"\\f32e\",\n  \"envelope\": \"\\f32f\",\n  \"eraser-fill\": \"\\f330\",\n  \"eraser\": \"\\f331\",\n  \"exclamation-circle-fill\": \"\\f332\",\n  \"exclamation-circle\": \"\\f333\",\n  \"exclamation-diamond-fill\": \"\\f334\",\n  \"exclamation-diamond\": \"\\f335\",\n  \"exclamation-octagon-fill\": \"\\f336\",\n  \"exclamation-octagon\": \"\\f337\",\n  \"exclamation-square-fill\": \"\\f338\",\n  \"exclamation-square\": \"\\f339\",\n  \"exclamation-triangle-fill\": \"\\f33a\",\n  \"exclamation-triangle\": \"\\f33b\",\n  \"exclamation\": \"\\f33c\",\n  \"exclude\": \"\\f33d\",\n  \"eye-fill\": \"\\f33e\",\n  \"eye-slash-fill\": \"\\f33f\",\n  \"eye-slash\": \"\\f340\",\n  \"eye\": \"\\f341\",\n  \"eyedropper\": \"\\f342\",\n  \"eyeglasses\": \"\\f343\",\n  \"facebook\": \"\\f344\",\n  \"file-arrow-down-fill\": \"\\f345\",\n  \"file-arrow-down\": \"\\f346\",\n  \"file-arrow-up-fill\": \"\\f347\",\n  \"file-arrow-up\": \"\\f348\",\n  \"file-bar-graph-fill\": \"\\f349\",\n  \"file-bar-graph\": \"\\f34a\",\n  \"file-binary-fill\": \"\\f34b\",\n  \"file-binary\": \"\\f34c\",\n  \"file-break-fill\": \"\\f34d\",\n  \"file-break\": \"\\f34e\",\n  \"file-check-fill\": \"\\f34f\",\n  \"file-check\": \"\\f350\",\n  \"file-code-fill\": \"\\f351\",\n  \"file-code\": \"\\f352\",\n  \"file-diff-fill\": \"\\f353\",\n  \"file-diff\": \"\\f354\",\n  \"file-earmark-arrow-down-fill\": \"\\f355\",\n  \"file-earmark-arrow-down\": \"\\f356\",\n  \"file-earmark-arrow-up-fill\": \"\\f357\",\n  \"file-earmark-arrow-up\": \"\\f358\",\n  \"file-earmark-bar-graph-fill\": \"\\f359\",\n  \"file-earmark-bar-graph\": \"\\f35a\",\n  \"file-earmark-binary-fill\": \"\\f35b\",\n  \"file-earmark-binary\": \"\\f35c\",\n  \"file-earmark-break-fill\": \"\\f35d\",\n  \"file-earmark-break\": \"\\f35e\",\n  \"file-earmark-check-fill\": \"\\f35f\",\n  \"file-earmark-check\": \"\\f360\",\n  \"file-earmark-code-fill\": \"\\f361\",\n  \"file-earmark-code\": \"\\f362\",\n  \"file-earmark-diff-fill\": \"\\f363\",\n  \"file-earmark-diff\": \"\\f364\",\n  \"file-earmark-easel-fill\": \"\\f365\",\n  \"file-earmark-easel\": \"\\f366\",\n  \"file-earmark-excel-fill\": \"\\f367\",\n  \"file-earmark-excel\": \"\\f368\",\n  \"file-earmark-fill\": \"\\f369\",\n  \"file-earmark-font-fill\": \"\\f36a\",\n  \"file-earmark-font\": \"\\f36b\",\n  \"file-earmark-image-fill\": \"\\f36c\",\n  \"file-earmark-image\": \"\\f36d\",\n  \"file-earmark-lock-fill\": \"\\f36e\",\n  \"file-earmark-lock\": \"\\f36f\",\n  \"file-earmark-lock2-fill\": \"\\f370\",\n  \"file-earmark-lock2\": \"\\f371\",\n  \"file-earmark-medical-fill\": \"\\f372\",\n  \"file-earmark-medical\": \"\\f373\",\n  \"file-earmark-minus-fill\": \"\\f374\",\n  \"file-earmark-minus\": \"\\f375\",\n  \"file-earmark-music-fill\": \"\\f376\",\n  \"file-earmark-music\": \"\\f377\",\n  \"file-earmark-person-fill\": \"\\f378\",\n  \"file-earmark-person\": \"\\f379\",\n  \"file-earmark-play-fill\": \"\\f37a\",\n  \"file-earmark-play\": \"\\f37b\",\n  \"file-earmark-plus-fill\": \"\\f37c\",\n  \"file-earmark-plus\": \"\\f37d\",\n  \"file-earmark-post-fill\": \"\\f37e\",\n  \"file-earmark-post\": \"\\f37f\",\n  \"file-earmark-ppt-fill\": \"\\f380\",\n  \"file-earmark-ppt\": \"\\f381\",\n  \"file-earmark-richtext-fill\": \"\\f382\",\n  \"file-earmark-richtext\": \"\\f383\",\n  \"file-earmark-ruled-fill\": \"\\f384\",\n  \"file-earmark-ruled\": \"\\f385\",\n  \"file-earmark-slides-fill\": \"\\f386\",\n  \"file-earmark-slides\": \"\\f387\",\n  \"file-earmark-spreadsheet-fill\": \"\\f388\",\n  \"file-earmark-spreadsheet\": \"\\f389\",\n  \"file-earmark-text-fill\": \"\\f38a\",\n  \"file-earmark-text\": \"\\f38b\",\n  \"file-earmark-word-fill\": \"\\f38c\",\n  \"file-earmark-word\": \"\\f38d\",\n  \"file-earmark-x-fill\": \"\\f38e\",\n  \"file-earmark-x\": \"\\f38f\",\n  \"file-earmark-zip-fill\": \"\\f390\",\n  \"file-earmark-zip\": \"\\f391\",\n  \"file-earmark\": \"\\f392\",\n  \"file-easel-fill\": \"\\f393\",\n  \"file-easel\": \"\\f394\",\n  \"file-excel-fill\": \"\\f395\",\n  \"file-excel\": \"\\f396\",\n  \"file-fill\": \"\\f397\",\n  \"file-font-fill\": \"\\f398\",\n  \"file-font\": \"\\f399\",\n  \"file-image-fill\": \"\\f39a\",\n  \"file-image\": \"\\f39b\",\n  \"file-lock-fill\": \"\\f39c\",\n  \"file-lock\": \"\\f39d\",\n  \"file-lock2-fill\": \"\\f39e\",\n  \"file-lock2\": \"\\f39f\",\n  \"file-medical-fill\": \"\\f3a0\",\n  \"file-medical\": \"\\f3a1\",\n  \"file-minus-fill\": \"\\f3a2\",\n  \"file-minus\": \"\\f3a3\",\n  \"file-music-fill\": \"\\f3a4\",\n  \"file-music\": \"\\f3a5\",\n  \"file-person-fill\": \"\\f3a6\",\n  \"file-person\": \"\\f3a7\",\n  \"file-play-fill\": \"\\f3a8\",\n  \"file-play\": \"\\f3a9\",\n  \"file-plus-fill\": \"\\f3aa\",\n  \"file-plus\": \"\\f3ab\",\n  \"file-post-fill\": \"\\f3ac\",\n  \"file-post\": \"\\f3ad\",\n  \"file-ppt-fill\": \"\\f3ae\",\n  \"file-ppt\": \"\\f3af\",\n  \"file-richtext-fill\": \"\\f3b0\",\n  \"file-richtext\": \"\\f3b1\",\n  \"file-ruled-fill\": \"\\f3b2\",\n  \"file-ruled\": \"\\f3b3\",\n  \"file-slides-fill\": \"\\f3b4\",\n  \"file-slides\": \"\\f3b5\",\n  \"file-spreadsheet-fill\": \"\\f3b6\",\n  \"file-spreadsheet\": \"\\f3b7\",\n  \"file-text-fill\": \"\\f3b8\",\n  \"file-text\": \"\\f3b9\",\n  \"file-word-fill\": \"\\f3ba\",\n  \"file-word\": \"\\f3bb\",\n  \"file-x-fill\": \"\\f3bc\",\n  \"file-x\": \"\\f3bd\",\n  \"file-zip-fill\": \"\\f3be\",\n  \"file-zip\": \"\\f3bf\",\n  \"file\": \"\\f3c0\",\n  \"files-alt\": \"\\f3c1\",\n  \"files\": \"\\f3c2\",\n  \"film\": \"\\f3c3\",\n  \"filter-circle-fill\": \"\\f3c4\",\n  \"filter-circle\": \"\\f3c5\",\n  \"filter-left\": \"\\f3c6\",\n  \"filter-right\": \"\\f3c7\",\n  \"filter-square-fill\": \"\\f3c8\",\n  \"filter-square\": \"\\f3c9\",\n  \"filter\": \"\\f3ca\",\n  \"flag-fill\": \"\\f3cb\",\n  \"flag\": \"\\f3cc\",\n  \"flower1\": \"\\f3cd\",\n  \"flower2\": \"\\f3ce\",\n  \"flower3\": \"\\f3cf\",\n  \"folder-check\": \"\\f3d0\",\n  \"folder-fill\": \"\\f3d1\",\n  \"folder-minus\": \"\\f3d2\",\n  \"folder-plus\": \"\\f3d3\",\n  \"folder-symlink-fill\": \"\\f3d4\",\n  \"folder-symlink\": \"\\f3d5\",\n  \"folder-x\": \"\\f3d6\",\n  \"folder\": \"\\f3d7\",\n  \"folder2-open\": \"\\f3d8\",\n  \"folder2\": \"\\f3d9\",\n  \"fonts\": \"\\f3da\",\n  \"forward-fill\": \"\\f3db\",\n  \"forward\": \"\\f3dc\",\n  \"front\": \"\\f3dd\",\n  \"fullscreen-exit\": \"\\f3de\",\n  \"fullscreen\": \"\\f3df\",\n  \"funnel-fill\": \"\\f3e0\",\n  \"funnel\": \"\\f3e1\",\n  \"gear-fill\": \"\\f3e2\",\n  \"gear-wide-connected\": \"\\f3e3\",\n  \"gear-wide\": \"\\f3e4\",\n  \"gear\": \"\\f3e5\",\n  \"gem\": \"\\f3e6\",\n  \"geo-alt-fill\": \"\\f3e7\",\n  \"geo-alt\": \"\\f3e8\",\n  \"geo-fill\": \"\\f3e9\",\n  \"geo\": \"\\f3ea\",\n  \"gift-fill\": \"\\f3eb\",\n  \"gift\": \"\\f3ec\",\n  \"github\": \"\\f3ed\",\n  \"globe\": \"\\f3ee\",\n  \"globe2\": \"\\f3ef\",\n  \"google\": \"\\f3f0\",\n  \"graph-down\": \"\\f3f1\",\n  \"graph-up\": \"\\f3f2\",\n  \"grid-1x2-fill\": \"\\f3f3\",\n  \"grid-1x2\": \"\\f3f4\",\n  \"grid-3x2-gap-fill\": \"\\f3f5\",\n  \"grid-3x2-gap\": \"\\f3f6\",\n  \"grid-3x2\": \"\\f3f7\",\n  \"grid-3x3-gap-fill\": \"\\f3f8\",\n  \"grid-3x3-gap\": \"\\f3f9\",\n  \"grid-3x3\": \"\\f3fa\",\n  \"grid-fill\": \"\\f3fb\",\n  \"grid\": \"\\f3fc\",\n  \"grip-horizontal\": \"\\f3fd\",\n  \"grip-vertical\": \"\\f3fe\",\n  \"hammer\": \"\\f3ff\",\n  \"hand-index-fill\": \"\\f400\",\n  \"hand-index-thumb-fill\": \"\\f401\",\n  \"hand-index-thumb\": \"\\f402\",\n  \"hand-index\": \"\\f403\",\n  \"hand-thumbs-down-fill\": \"\\f404\",\n  \"hand-thumbs-down\": \"\\f405\",\n  \"hand-thumbs-up-fill\": \"\\f406\",\n  \"hand-thumbs-up\": \"\\f407\",\n  \"handbag-fill\": \"\\f408\",\n  \"handbag\": \"\\f409\",\n  \"hash\": \"\\f40a\",\n  \"hdd-fill\": \"\\f40b\",\n  \"hdd-network-fill\": \"\\f40c\",\n  \"hdd-network\": \"\\f40d\",\n  \"hdd-rack-fill\": \"\\f40e\",\n  \"hdd-rack\": \"\\f40f\",\n  \"hdd-stack-fill\": \"\\f410\",\n  \"hdd-stack\": \"\\f411\",\n  \"hdd\": \"\\f412\",\n  \"headphones\": \"\\f413\",\n  \"headset\": \"\\f414\",\n  \"heart-fill\": \"\\f415\",\n  \"heart-half\": \"\\f416\",\n  \"heart\": \"\\f417\",\n  \"heptagon-fill\": \"\\f418\",\n  \"heptagon-half\": \"\\f419\",\n  \"heptagon\": \"\\f41a\",\n  \"hexagon-fill\": \"\\f41b\",\n  \"hexagon-half\": \"\\f41c\",\n  \"hexagon\": \"\\f41d\",\n  \"hourglass-bottom\": \"\\f41e\",\n  \"hourglass-split\": \"\\f41f\",\n  \"hourglass-top\": \"\\f420\",\n  \"hourglass\": \"\\f421\",\n  \"house-door-fill\": \"\\f422\",\n  \"house-door\": \"\\f423\",\n  \"house-fill\": \"\\f424\",\n  \"house\": \"\\f425\",\n  \"hr\": \"\\f426\",\n  \"hurricane\": \"\\f427\",\n  \"image-alt\": \"\\f428\",\n  \"image-fill\": \"\\f429\",\n  \"image\": \"\\f42a\",\n  \"images\": \"\\f42b\",\n  \"inbox-fill\": \"\\f42c\",\n  \"inbox\": \"\\f42d\",\n  \"inboxes-fill\": \"\\f42e\",\n  \"inboxes\": \"\\f42f\",\n  \"info-circle-fill\": \"\\f430\",\n  \"info-circle\": \"\\f431\",\n  \"info-square-fill\": \"\\f432\",\n  \"info-square\": \"\\f433\",\n  \"info\": \"\\f434\",\n  \"input-cursor-text\": \"\\f435\",\n  \"input-cursor\": \"\\f436\",\n  \"instagram\": \"\\f437\",\n  \"intersect\": \"\\f438\",\n  \"journal-album\": \"\\f439\",\n  \"journal-arrow-down\": \"\\f43a\",\n  \"journal-arrow-up\": \"\\f43b\",\n  \"journal-bookmark-fill\": \"\\f43c\",\n  \"journal-bookmark\": \"\\f43d\",\n  \"journal-check\": \"\\f43e\",\n  \"journal-code\": \"\\f43f\",\n  \"journal-medical\": \"\\f440\",\n  \"journal-minus\": \"\\f441\",\n  \"journal-plus\": \"\\f442\",\n  \"journal-richtext\": \"\\f443\",\n  \"journal-text\": \"\\f444\",\n  \"journal-x\": \"\\f445\",\n  \"journal\": \"\\f446\",\n  \"journals\": \"\\f447\",\n  \"joystick\": \"\\f448\",\n  \"justify-left\": \"\\f449\",\n  \"justify-right\": \"\\f44a\",\n  \"justify\": \"\\f44b\",\n  \"kanban-fill\": \"\\f44c\",\n  \"kanban\": \"\\f44d\",\n  \"key-fill\": \"\\f44e\",\n  \"key\": \"\\f44f\",\n  \"keyboard-fill\": \"\\f450\",\n  \"keyboard\": \"\\f451\",\n  \"ladder\": \"\\f452\",\n  \"lamp-fill\": \"\\f453\",\n  \"lamp\": \"\\f454\",\n  \"laptop-fill\": \"\\f455\",\n  \"laptop\": \"\\f456\",\n  \"layer-backward\": \"\\f457\",\n  \"layer-forward\": \"\\f458\",\n  \"layers-fill\": \"\\f459\",\n  \"layers-half\": \"\\f45a\",\n  \"layers\": \"\\f45b\",\n  \"layout-sidebar-inset-reverse\": \"\\f45c\",\n  \"layout-sidebar-inset\": \"\\f45d\",\n  \"layout-sidebar-reverse\": \"\\f45e\",\n  \"layout-sidebar\": \"\\f45f\",\n  \"layout-split\": \"\\f460\",\n  \"layout-text-sidebar-reverse\": \"\\f461\",\n  \"layout-text-sidebar\": \"\\f462\",\n  \"layout-text-window-reverse\": \"\\f463\",\n  \"layout-text-window\": \"\\f464\",\n  \"layout-three-columns\": \"\\f465\",\n  \"layout-wtf\": \"\\f466\",\n  \"life-preserver\": \"\\f467\",\n  \"lightbulb-fill\": \"\\f468\",\n  \"lightbulb-off-fill\": \"\\f469\",\n  \"lightbulb-off\": \"\\f46a\",\n  \"lightbulb\": \"\\f46b\",\n  \"lightning-charge-fill\": \"\\f46c\",\n  \"lightning-charge\": \"\\f46d\",\n  \"lightning-fill\": \"\\f46e\",\n  \"lightning\": \"\\f46f\",\n  \"link-45deg\": \"\\f470\",\n  \"link\": \"\\f471\",\n  \"linkedin\": \"\\f472\",\n  \"list-check\": \"\\f473\",\n  \"list-nested\": \"\\f474\",\n  \"list-ol\": \"\\f475\",\n  \"list-stars\": \"\\f476\",\n  \"list-task\": \"\\f477\",\n  \"list-ul\": \"\\f478\",\n  \"list\": \"\\f479\",\n  \"lock-fill\": \"\\f47a\",\n  \"lock\": \"\\f47b\",\n  \"mailbox\": \"\\f47c\",\n  \"mailbox2\": \"\\f47d\",\n  \"map-fill\": \"\\f47e\",\n  \"map\": \"\\f47f\",\n  \"markdown-fill\": \"\\f480\",\n  \"markdown\": \"\\f481\",\n  \"mask\": \"\\f482\",\n  \"megaphone-fill\": \"\\f483\",\n  \"megaphone\": \"\\f484\",\n  \"menu-app-fill\": \"\\f485\",\n  \"menu-app\": \"\\f486\",\n  \"menu-button-fill\": \"\\f487\",\n  \"menu-button-wide-fill\": \"\\f488\",\n  \"menu-button-wide\": \"\\f489\",\n  \"menu-button\": \"\\f48a\",\n  \"menu-down\": \"\\f48b\",\n  \"menu-up\": \"\\f48c\",\n  \"mic-fill\": \"\\f48d\",\n  \"mic-mute-fill\": \"\\f48e\",\n  \"mic-mute\": \"\\f48f\",\n  \"mic\": \"\\f490\",\n  \"minecart-loaded\": \"\\f491\",\n  \"minecart\": \"\\f492\",\n  \"moisture\": \"\\f493\",\n  \"moon-fill\": \"\\f494\",\n  \"moon-stars-fill\": \"\\f495\",\n  \"moon-stars\": \"\\f496\",\n  \"moon\": \"\\f497\",\n  \"mouse-fill\": \"\\f498\",\n  \"mouse\": \"\\f499\",\n  \"mouse2-fill\": \"\\f49a\",\n  \"mouse2\": \"\\f49b\",\n  \"mouse3-fill\": \"\\f49c\",\n  \"mouse3\": \"\\f49d\",\n  \"music-note-beamed\": \"\\f49e\",\n  \"music-note-list\": \"\\f49f\",\n  \"music-note\": \"\\f4a0\",\n  \"music-player-fill\": \"\\f4a1\",\n  \"music-player\": \"\\f4a2\",\n  \"newspaper\": \"\\f4a3\",\n  \"node-minus-fill\": \"\\f4a4\",\n  \"node-minus\": \"\\f4a5\",\n  \"node-plus-fill\": \"\\f4a6\",\n  \"node-plus\": \"\\f4a7\",\n  \"nut-fill\": \"\\f4a8\",\n  \"nut\": \"\\f4a9\",\n  \"octagon-fill\": \"\\f4aa\",\n  \"octagon-half\": \"\\f4ab\",\n  \"octagon\": \"\\f4ac\",\n  \"option\": \"\\f4ad\",\n  \"outlet\": \"\\f4ae\",\n  \"paint-bucket\": \"\\f4af\",\n  \"palette-fill\": \"\\f4b0\",\n  \"palette\": \"\\f4b1\",\n  \"palette2\": \"\\f4b2\",\n  \"paperclip\": \"\\f4b3\",\n  \"paragraph\": \"\\f4b4\",\n  \"patch-check-fill\": \"\\f4b5\",\n  \"patch-check\": \"\\f4b6\",\n  \"patch-exclamation-fill\": \"\\f4b7\",\n  \"patch-exclamation\": \"\\f4b8\",\n  \"patch-minus-fill\": \"\\f4b9\",\n  \"patch-minus\": \"\\f4ba\",\n  \"patch-plus-fill\": \"\\f4bb\",\n  \"patch-plus\": \"\\f4bc\",\n  \"patch-question-fill\": \"\\f4bd\",\n  \"patch-question\": \"\\f4be\",\n  \"pause-btn-fill\": \"\\f4bf\",\n  \"pause-btn\": \"\\f4c0\",\n  \"pause-circle-fill\": \"\\f4c1\",\n  \"pause-circle\": \"\\f4c2\",\n  \"pause-fill\": \"\\f4c3\",\n  \"pause\": \"\\f4c4\",\n  \"peace-fill\": \"\\f4c5\",\n  \"peace\": \"\\f4c6\",\n  \"pen-fill\": \"\\f4c7\",\n  \"pen\": \"\\f4c8\",\n  \"pencil-fill\": \"\\f4c9\",\n  \"pencil-square\": \"\\f4ca\",\n  \"pencil\": \"\\f4cb\",\n  \"pentagon-fill\": \"\\f4cc\",\n  \"pentagon-half\": \"\\f4cd\",\n  \"pentagon\": \"\\f4ce\",\n  \"people-fill\": \"\\f4cf\",\n  \"people\": \"\\f4d0\",\n  \"percent\": \"\\f4d1\",\n  \"person-badge-fill\": \"\\f4d2\",\n  \"person-badge\": \"\\f4d3\",\n  \"person-bounding-box\": \"\\f4d4\",\n  \"person-check-fill\": \"\\f4d5\",\n  \"person-check\": \"\\f4d6\",\n  \"person-circle\": \"\\f4d7\",\n  \"person-dash-fill\": \"\\f4d8\",\n  \"person-dash\": \"\\f4d9\",\n  \"person-fill\": \"\\f4da\",\n  \"person-lines-fill\": \"\\f4db\",\n  \"person-plus-fill\": \"\\f4dc\",\n  \"person-plus\": \"\\f4dd\",\n  \"person-square\": \"\\f4de\",\n  \"person-x-fill\": \"\\f4df\",\n  \"person-x\": \"\\f4e0\",\n  \"person\": \"\\f4e1\",\n  \"phone-fill\": \"\\f4e2\",\n  \"phone-landscape-fill\": \"\\f4e3\",\n  \"phone-landscape\": \"\\f4e4\",\n  \"phone-vibrate-fill\": \"\\f4e5\",\n  \"phone-vibrate\": \"\\f4e6\",\n  \"phone\": \"\\f4e7\",\n  \"pie-chart-fill\": \"\\f4e8\",\n  \"pie-chart\": \"\\f4e9\",\n  \"pin-angle-fill\": \"\\f4ea\",\n  \"pin-angle\": \"\\f4eb\",\n  \"pin-fill\": \"\\f4ec\",\n  \"pin\": \"\\f4ed\",\n  \"pip-fill\": \"\\f4ee\",\n  \"pip\": \"\\f4ef\",\n  \"play-btn-fill\": \"\\f4f0\",\n  \"play-btn\": \"\\f4f1\",\n  \"play-circle-fill\": \"\\f4f2\",\n  \"play-circle\": \"\\f4f3\",\n  \"play-fill\": \"\\f4f4\",\n  \"play\": \"\\f4f5\",\n  \"plug-fill\": \"\\f4f6\",\n  \"plug\": \"\\f4f7\",\n  \"plus-circle-dotted\": \"\\f4f8\",\n  \"plus-circle-fill\": \"\\f4f9\",\n  \"plus-circle\": \"\\f4fa\",\n  \"plus-square-dotted\": \"\\f4fb\",\n  \"plus-square-fill\": \"\\f4fc\",\n  \"plus-square\": \"\\f4fd\",\n  \"plus\": \"\\f4fe\",\n  \"power\": \"\\f4ff\",\n  \"printer-fill\": \"\\f500\",\n  \"printer\": \"\\f501\",\n  \"puzzle-fill\": \"\\f502\",\n  \"puzzle\": \"\\f503\",\n  \"question-circle-fill\": \"\\f504\",\n  \"question-circle\": \"\\f505\",\n  \"question-diamond-fill\": \"\\f506\",\n  \"question-diamond\": \"\\f507\",\n  \"question-octagon-fill\": \"\\f508\",\n  \"question-octagon\": \"\\f509\",\n  \"question-square-fill\": \"\\f50a\",\n  \"question-square\": \"\\f50b\",\n  \"question\": \"\\f50c\",\n  \"rainbow\": \"\\f50d\",\n  \"receipt-cutoff\": \"\\f50e\",\n  \"receipt\": \"\\f50f\",\n  \"reception-0\": \"\\f510\",\n  \"reception-1\": \"\\f511\",\n  \"reception-2\": \"\\f512\",\n  \"reception-3\": \"\\f513\",\n  \"reception-4\": \"\\f514\",\n  \"record-btn-fill\": \"\\f515\",\n  \"record-btn\": \"\\f516\",\n  \"record-circle-fill\": \"\\f517\",\n  \"record-circle\": \"\\f518\",\n  \"record-fill\": \"\\f519\",\n  \"record\": \"\\f51a\",\n  \"record2-fill\": \"\\f51b\",\n  \"record2\": \"\\f51c\",\n  \"reply-all-fill\": \"\\f51d\",\n  \"reply-all\": \"\\f51e\",\n  \"reply-fill\": \"\\f51f\",\n  \"reply\": \"\\f520\",\n  \"rss-fill\": \"\\f521\",\n  \"rss\": \"\\f522\",\n  \"rulers\": \"\\f523\",\n  \"save-fill\": \"\\f524\",\n  \"save\": \"\\f525\",\n  \"save2-fill\": \"\\f526\",\n  \"save2\": \"\\f527\",\n  \"scissors\": \"\\f528\",\n  \"screwdriver\": \"\\f529\",\n  \"search\": \"\\f52a\",\n  \"segmented-nav\": \"\\f52b\",\n  \"server\": \"\\f52c\",\n  \"share-fill\": \"\\f52d\",\n  \"share\": \"\\f52e\",\n  \"shield-check\": \"\\f52f\",\n  \"shield-exclamation\": \"\\f530\",\n  \"shield-fill-check\": \"\\f531\",\n  \"shield-fill-exclamation\": \"\\f532\",\n  \"shield-fill-minus\": \"\\f533\",\n  \"shield-fill-plus\": \"\\f534\",\n  \"shield-fill-x\": \"\\f535\",\n  \"shield-fill\": \"\\f536\",\n  \"shield-lock-fill\": \"\\f537\",\n  \"shield-lock\": \"\\f538\",\n  \"shield-minus\": \"\\f539\",\n  \"shield-plus\": \"\\f53a\",\n  \"shield-shaded\": \"\\f53b\",\n  \"shield-slash-fill\": \"\\f53c\",\n  \"shield-slash\": \"\\f53d\",\n  \"shield-x\": \"\\f53e\",\n  \"shield\": \"\\f53f\",\n  \"shift-fill\": \"\\f540\",\n  \"shift\": \"\\f541\",\n  \"shop-window\": \"\\f542\",\n  \"shop\": \"\\f543\",\n  \"shuffle\": \"\\f544\",\n  \"signpost-2-fill\": \"\\f545\",\n  \"signpost-2\": \"\\f546\",\n  \"signpost-fill\": \"\\f547\",\n  \"signpost-split-fill\": \"\\f548\",\n  \"signpost-split\": \"\\f549\",\n  \"signpost\": \"\\f54a\",\n  \"sim-fill\": \"\\f54b\",\n  \"sim\": \"\\f54c\",\n  \"skip-backward-btn-fill\": \"\\f54d\",\n  \"skip-backward-btn\": \"\\f54e\",\n  \"skip-backward-circle-fill\": \"\\f54f\",\n  \"skip-backward-circle\": \"\\f550\",\n  \"skip-backward-fill\": \"\\f551\",\n  \"skip-backward\": \"\\f552\",\n  \"skip-end-btn-fill\": \"\\f553\",\n  \"skip-end-btn\": \"\\f554\",\n  \"skip-end-circle-fill\": \"\\f555\",\n  \"skip-end-circle\": \"\\f556\",\n  \"skip-end-fill\": \"\\f557\",\n  \"skip-end\": \"\\f558\",\n  \"skip-forward-btn-fill\": \"\\f559\",\n  \"skip-forward-btn\": \"\\f55a\",\n  \"skip-forward-circle-fill\": \"\\f55b\",\n  \"skip-forward-circle\": \"\\f55c\",\n  \"skip-forward-fill\": \"\\f55d\",\n  \"skip-forward\": \"\\f55e\",\n  \"skip-start-btn-fill\": \"\\f55f\",\n  \"skip-start-btn\": \"\\f560\",\n  \"skip-start-circle-fill\": \"\\f561\",\n  \"skip-start-circle\": \"\\f562\",\n  \"skip-start-fill\": \"\\f563\",\n  \"skip-start\": \"\\f564\",\n  \"slack\": \"\\f565\",\n  \"slash-circle-fill\": \"\\f566\",\n  \"slash-circle\": \"\\f567\",\n  \"slash-square-fill\": \"\\f568\",\n  \"slash-square\": \"\\f569\",\n  \"slash\": \"\\f56a\",\n  \"sliders\": \"\\f56b\",\n  \"smartwatch\": \"\\f56c\",\n  \"snow\": \"\\f56d\",\n  \"snow2\": \"\\f56e\",\n  \"snow3\": \"\\f56f\",\n  \"sort-alpha-down-alt\": \"\\f570\",\n  \"sort-alpha-down\": \"\\f571\",\n  \"sort-alpha-up-alt\": \"\\f572\",\n  \"sort-alpha-up\": \"\\f573\",\n  \"sort-down-alt\": \"\\f574\",\n  \"sort-down\": \"\\f575\",\n  \"sort-numeric-down-alt\": \"\\f576\",\n  \"sort-numeric-down\": \"\\f577\",\n  \"sort-numeric-up-alt\": \"\\f578\",\n  \"sort-numeric-up\": \"\\f579\",\n  \"sort-up-alt\": \"\\f57a\",\n  \"sort-up\": \"\\f57b\",\n  \"soundwave\": \"\\f57c\",\n  \"speaker-fill\": \"\\f57d\",\n  \"speaker\": \"\\f57e\",\n  \"speedometer\": \"\\f57f\",\n  \"speedometer2\": \"\\f580\",\n  \"spellcheck\": \"\\f581\",\n  \"square-fill\": \"\\f582\",\n  \"square-half\": \"\\f583\",\n  \"square\": \"\\f584\",\n  \"stack\": \"\\f585\",\n  \"star-fill\": \"\\f586\",\n  \"star-half\": \"\\f587\",\n  \"star\": \"\\f588\",\n  \"stars\": \"\\f589\",\n  \"stickies-fill\": \"\\f58a\",\n  \"stickies\": \"\\f58b\",\n  \"sticky-fill\": \"\\f58c\",\n  \"sticky\": \"\\f58d\",\n  \"stop-btn-fill\": \"\\f58e\",\n  \"stop-btn\": \"\\f58f\",\n  \"stop-circle-fill\": \"\\f590\",\n  \"stop-circle\": \"\\f591\",\n  \"stop-fill\": \"\\f592\",\n  \"stop\": \"\\f593\",\n  \"stoplights-fill\": \"\\f594\",\n  \"stoplights\": \"\\f595\",\n  \"stopwatch-fill\": \"\\f596\",\n  \"stopwatch\": \"\\f597\",\n  \"subtract\": \"\\f598\",\n  \"suit-club-fill\": \"\\f599\",\n  \"suit-club\": \"\\f59a\",\n  \"suit-diamond-fill\": \"\\f59b\",\n  \"suit-diamond\": \"\\f59c\",\n  \"suit-heart-fill\": \"\\f59d\",\n  \"suit-heart\": \"\\f59e\",\n  \"suit-spade-fill\": \"\\f59f\",\n  \"suit-spade\": \"\\f5a0\",\n  \"sun-fill\": \"\\f5a1\",\n  \"sun\": \"\\f5a2\",\n  \"sunglasses\": \"\\f5a3\",\n  \"sunrise-fill\": \"\\f5a4\",\n  \"sunrise\": \"\\f5a5\",\n  \"sunset-fill\": \"\\f5a6\",\n  \"sunset\": \"\\f5a7\",\n  \"symmetry-horizontal\": \"\\f5a8\",\n  \"symmetry-vertical\": \"\\f5a9\",\n  \"table\": \"\\f5aa\",\n  \"tablet-fill\": \"\\f5ab\",\n  \"tablet-landscape-fill\": \"\\f5ac\",\n  \"tablet-landscape\": \"\\f5ad\",\n  \"tablet\": \"\\f5ae\",\n  \"tag-fill\": \"\\f5af\",\n  \"tag\": \"\\f5b0\",\n  \"tags-fill\": \"\\f5b1\",\n  \"tags\": \"\\f5b2\",\n  \"telegram\": \"\\f5b3\",\n  \"telephone-fill\": \"\\f5b4\",\n  \"telephone-forward-fill\": \"\\f5b5\",\n  \"telephone-forward\": \"\\f5b6\",\n  \"telephone-inbound-fill\": \"\\f5b7\",\n  \"telephone-inbound\": \"\\f5b8\",\n  \"telephone-minus-fill\": \"\\f5b9\",\n  \"telephone-minus\": \"\\f5ba\",\n  \"telephone-outbound-fill\": \"\\f5bb\",\n  \"telephone-outbound\": \"\\f5bc\",\n  \"telephone-plus-fill\": \"\\f5bd\",\n  \"telephone-plus\": \"\\f5be\",\n  \"telephone-x-fill\": \"\\f5bf\",\n  \"telephone-x\": \"\\f5c0\",\n  \"telephone\": \"\\f5c1\",\n  \"terminal-fill\": \"\\f5c2\",\n  \"terminal\": \"\\f5c3\",\n  \"text-center\": \"\\f5c4\",\n  \"text-indent-left\": \"\\f5c5\",\n  \"text-indent-right\": \"\\f5c6\",\n  \"text-left\": \"\\f5c7\",\n  \"text-paragraph\": \"\\f5c8\",\n  \"text-right\": \"\\f5c9\",\n  \"textarea-resize\": \"\\f5ca\",\n  \"textarea-t\": \"\\f5cb\",\n  \"textarea\": \"\\f5cc\",\n  \"thermometer-half\": \"\\f5cd\",\n  \"thermometer-high\": \"\\f5ce\",\n  \"thermometer-low\": \"\\f5cf\",\n  \"thermometer-snow\": \"\\f5d0\",\n  \"thermometer-sun\": \"\\f5d1\",\n  \"thermometer\": \"\\f5d2\",\n  \"three-dots-vertical\": \"\\f5d3\",\n  \"three-dots\": \"\\f5d4\",\n  \"toggle-off\": \"\\f5d5\",\n  \"toggle-on\": \"\\f5d6\",\n  \"toggle2-off\": \"\\f5d7\",\n  \"toggle2-on\": \"\\f5d8\",\n  \"toggles\": \"\\f5d9\",\n  \"toggles2\": \"\\f5da\",\n  \"tools\": \"\\f5db\",\n  \"tornado\": \"\\f5dc\",\n  \"trash-fill\": \"\\f5dd\",\n  \"trash\": \"\\f5de\",\n  \"trash2-fill\": \"\\f5df\",\n  \"trash2\": \"\\f5e0\",\n  \"tree-fill\": \"\\f5e1\",\n  \"tree\": \"\\f5e2\",\n  \"triangle-fill\": \"\\f5e3\",\n  \"triangle-half\": \"\\f5e4\",\n  \"triangle\": \"\\f5e5\",\n  \"trophy-fill\": \"\\f5e6\",\n  \"trophy\": \"\\f5e7\",\n  \"tropical-storm\": \"\\f5e8\",\n  \"truck-flatbed\": \"\\f5e9\",\n  \"truck\": \"\\f5ea\",\n  \"tsunami\": \"\\f5eb\",\n  \"tv-fill\": \"\\f5ec\",\n  \"tv\": \"\\f5ed\",\n  \"twitch\": \"\\f5ee\",\n  \"twitter\": \"\\f5ef\",\n  \"type-bold\": \"\\f5f0\",\n  \"type-h1\": \"\\f5f1\",\n  \"type-h2\": \"\\f5f2\",\n  \"type-h3\": \"\\f5f3\",\n  \"type-italic\": \"\\f5f4\",\n  \"type-strikethrough\": \"\\f5f5\",\n  \"type-underline\": \"\\f5f6\",\n  \"type\": \"\\f5f7\",\n  \"ui-checks-grid\": \"\\f5f8\",\n  \"ui-checks\": \"\\f5f9\",\n  \"ui-radios-grid\": \"\\f5fa\",\n  \"ui-radios\": \"\\f5fb\",\n  \"umbrella-fill\": \"\\f5fc\",\n  \"umbrella\": \"\\f5fd\",\n  \"union\": \"\\f5fe\",\n  \"unlock-fill\": \"\\f5ff\",\n  \"unlock\": \"\\f600\",\n  \"upc-scan\": \"\\f601\",\n  \"upc\": \"\\f602\",\n  \"upload\": \"\\f603\",\n  \"vector-pen\": \"\\f604\",\n  \"view-list\": \"\\f605\",\n  \"view-stacked\": \"\\f606\",\n  \"vinyl-fill\": \"\\f607\",\n  \"vinyl\": \"\\f608\",\n  \"voicemail\": \"\\f609\",\n  \"volume-down-fill\": \"\\f60a\",\n  \"volume-down\": \"\\f60b\",\n  \"volume-mute-fill\": \"\\f60c\",\n  \"volume-mute\": \"\\f60d\",\n  \"volume-off-fill\": \"\\f60e\",\n  \"volume-off\": \"\\f60f\",\n  \"volume-up-fill\": \"\\f610\",\n  \"volume-up\": \"\\f611\",\n  \"vr\": \"\\f612\",\n  \"wallet-fill\": \"\\f613\",\n  \"wallet\": \"\\f614\",\n  \"wallet2\": \"\\f615\",\n  \"watch\": \"\\f616\",\n  \"water\": \"\\f617\",\n  \"whatsapp\": \"\\f618\",\n  \"wifi-1\": \"\\f619\",\n  \"wifi-2\": \"\\f61a\",\n  \"wifi-off\": \"\\f61b\",\n  \"wifi\": \"\\f61c\",\n  \"wind\": \"\\f61d\",\n  \"window-dock\": \"\\f61e\",\n  \"window-sidebar\": \"\\f61f\",\n  \"window\": \"\\f620\",\n  \"wrench\": \"\\f621\",\n  \"x-circle-fill\": \"\\f622\",\n  \"x-circle\": \"\\f623\",\n  \"x-diamond-fill\": \"\\f624\",\n  \"x-diamond\": \"\\f625\",\n  \"x-octagon-fill\": \"\\f626\",\n  \"x-octagon\": \"\\f627\",\n  \"x-square-fill\": \"\\f628\",\n  \"x-square\": \"\\f629\",\n  \"x\": \"\\f62a\",\n  \"youtube\": \"\\f62b\",\n  \"zoom-in\": \"\\f62c\",\n  \"zoom-out\": \"\\f62d\",\n  \"bank\": \"\\f62e\",\n  \"bank2\": \"\\f62f\",\n  \"bell-slash-fill\": \"\\f630\",\n  \"bell-slash\": \"\\f631\",\n  \"cash-coin\": \"\\f632\",\n  \"check-lg\": \"\\f633\",\n  \"coin\": \"\\f634\",\n  \"currency-bitcoin\": \"\\f635\",\n  \"currency-dollar\": \"\\f636\",\n  \"currency-euro\": \"\\f637\",\n  \"currency-exchange\": \"\\f638\",\n  \"currency-pound\": \"\\f639\",\n  \"currency-yen\": \"\\f63a\",\n  \"dash-lg\": \"\\f63b\",\n  \"exclamation-lg\": \"\\f63c\",\n  \"file-earmark-pdf-fill\": \"\\f63d\",\n  \"file-earmark-pdf\": \"\\f63e\",\n  \"file-pdf-fill\": \"\\f63f\",\n  \"file-pdf\": \"\\f640\",\n  \"gender-ambiguous\": \"\\f641\",\n  \"gender-female\": \"\\f642\",\n  \"gender-male\": \"\\f643\",\n  \"gender-trans\": \"\\f644\",\n  \"headset-vr\": \"\\f645\",\n  \"info-lg\": \"\\f646\",\n  \"mastodon\": \"\\f647\",\n  \"messenger\": \"\\f648\",\n  \"piggy-bank-fill\": \"\\f649\",\n  \"piggy-bank\": \"\\f64a\",\n  \"pin-map-fill\": \"\\f64b\",\n  \"pin-map\": \"\\f64c\",\n  \"plus-lg\": \"\\f64d\",\n  \"question-lg\": \"\\f64e\",\n  \"recycle\": \"\\f64f\",\n  \"reddit\": \"\\f650\",\n  \"safe-fill\": \"\\f651\",\n  \"safe2-fill\": \"\\f652\",\n  \"safe2\": \"\\f653\",\n  \"sd-card-fill\": \"\\f654\",\n  \"sd-card\": \"\\f655\",\n  \"skype\": \"\\f656\",\n  \"slash-lg\": \"\\f657\",\n  \"translate\": \"\\f658\",\n  \"x-lg\": \"\\f659\",\n  \"safe\": \"\\f65a\",\n  \"apple\": \"\\f65b\",\n  \"microsoft\": \"\\f65d\",\n  \"windows\": \"\\f65e\",\n  \"behance\": \"\\f65c\",\n  \"dribbble\": \"\\f65f\",\n  \"line\": \"\\f660\",\n  \"medium\": \"\\f661\",\n  \"paypal\": \"\\f662\",\n  \"pinterest\": \"\\f663\",\n  \"signal\": \"\\f664\",\n  \"snapchat\": \"\\f665\",\n  \"spotify\": \"\\f666\",\n  \"stack-overflow\": \"\\f667\",\n  \"strava\": \"\\f668\",\n  \"wordpress\": \"\\f669\",\n  \"vimeo\": \"\\f66a\",\n  \"activity\": \"\\f66b\",\n  \"easel2-fill\": \"\\f66c\",\n  \"easel2\": \"\\f66d\",\n  \"easel3-fill\": \"\\f66e\",\n  \"easel3\": \"\\f66f\",\n  \"fan\": \"\\f670\",\n  \"fingerprint\": \"\\f671\",\n  \"graph-down-arrow\": \"\\f672\",\n  \"graph-up-arrow\": \"\\f673\",\n  \"hypnotize\": \"\\f674\",\n  \"magic\": \"\\f675\",\n  \"person-rolodex\": \"\\f676\",\n  \"person-video\": \"\\f677\",\n  \"person-video2\": \"\\f678\",\n  \"person-video3\": \"\\f679\",\n  \"person-workspace\": \"\\f67a\",\n  \"radioactive\": \"\\f67b\",\n  \"webcam-fill\": \"\\f67c\",\n  \"webcam\": \"\\f67d\",\n  \"yin-yang\": \"\\f67e\",\n  \"bandaid-fill\": \"\\f680\",\n  \"bandaid\": \"\\f681\",\n  \"bluetooth\": \"\\f682\",\n  \"body-text\": \"\\f683\",\n  \"boombox\": \"\\f684\",\n  \"boxes\": \"\\f685\",\n  \"dpad-fill\": \"\\f686\",\n  \"dpad\": \"\\f687\",\n  \"ear-fill\": \"\\f688\",\n  \"ear\": \"\\f689\",\n  \"envelope-check-1\": \"\\f68a\",\n  \"envelope-check-fill\": \"\\f68b\",\n  \"envelope-check\": \"\\f68c\",\n  \"envelope-dash-1\": \"\\f68d\",\n  \"envelope-dash-fill\": \"\\f68e\",\n  \"envelope-dash\": \"\\f68f\",\n  \"envelope-exclamation-1\": \"\\f690\",\n  \"envelope-exclamation-fill\": \"\\f691\",\n  \"envelope-exclamation\": \"\\f692\",\n  \"envelope-plus-fill\": \"\\f693\",\n  \"envelope-plus\": \"\\f694\",\n  \"envelope-slash-1\": \"\\f695\",\n  \"envelope-slash-fill\": \"\\f696\",\n  \"envelope-slash\": \"\\f697\",\n  \"envelope-x-1\": \"\\f698\",\n  \"envelope-x-fill\": \"\\f699\",\n  \"envelope-x\": \"\\f69a\",\n  \"explicit-fill\": \"\\f69b\",\n  \"explicit\": \"\\f69c\",\n  \"git\": \"\\f69d\",\n  \"infinity\": \"\\f69e\",\n  \"list-columns-reverse\": \"\\f69f\",\n  \"list-columns\": \"\\f6a0\",\n  \"meta\": \"\\f6a1\",\n  \"mortorboard-fill\": \"\\f6a2\",\n  \"mortorboard\": \"\\f6a3\",\n  \"nintendo-switch\": \"\\f6a4\",\n  \"pc-display-horizontal\": \"\\f6a5\",\n  \"pc-display\": \"\\f6a6\",\n  \"pc-horizontal\": \"\\f6a7\",\n  \"pc\": \"\\f6a8\",\n  \"playstation\": \"\\f6a9\",\n  \"plus-slash-minus\": \"\\f6aa\",\n  \"projector-fill\": \"\\f6ab\",\n  \"projector\": \"\\f6ac\",\n  \"qr-code-scan\": \"\\f6ad\",\n  \"qr-code\": \"\\f6ae\",\n  \"quora\": \"\\f6af\",\n  \"quote\": \"\\f6b0\",\n  \"robot\": \"\\f6b1\",\n  \"send-check-fill\": \"\\f6b2\",\n  \"send-check\": \"\\f6b3\",\n  \"send-dash-fill\": \"\\f6b4\",\n  \"send-dash\": \"\\f6b5\",\n  \"send-exclamation-1\": \"\\f6b6\",\n  \"send-exclamation-fill\": \"\\f6b7\",\n  \"send-exclamation\": \"\\f6b8\",\n  \"send-fill\": \"\\f6b9\",\n  \"send-plus-fill\": \"\\f6ba\",\n  \"send-plus\": \"\\f6bb\",\n  \"send-slash-fill\": \"\\f6bc\",\n  \"send-slash\": \"\\f6bd\",\n  \"send-x-fill\": \"\\f6be\",\n  \"send-x\": \"\\f6bf\",\n  \"send\": \"\\f6c0\",\n  \"steam\": \"\\f6c1\",\n  \"terminal-dash-1\": \"\\f6c2\",\n  \"terminal-dash\": \"\\f6c3\",\n  \"terminal-plus\": \"\\f6c4\",\n  \"terminal-split\": \"\\f6c5\",\n  \"ticket-detailed-fill\": \"\\f6c6\",\n  \"ticket-detailed\": \"\\f6c7\",\n  \"ticket-fill\": \"\\f6c8\",\n  \"ticket-perforated-fill\": \"\\f6c9\",\n  \"ticket-perforated\": \"\\f6ca\",\n  \"ticket\": \"\\f6cb\",\n  \"tiktok\": \"\\f6cc\",\n  \"window-dash\": \"\\f6cd\",\n  \"window-desktop\": \"\\f6ce\",\n  \"window-fullscreen\": \"\\f6cf\",\n  \"window-plus\": \"\\f6d0\",\n  \"window-split\": \"\\f6d1\",\n  \"window-stack\": \"\\f6d2\",\n  \"window-x\": \"\\f6d3\",\n  \"xbox\": \"\\f6d4\",\n  \"ethernet\": \"\\f6d5\",\n  \"hdmi-fill\": \"\\f6d6\",\n  \"hdmi\": \"\\f6d7\",\n  \"usb-c-fill\": \"\\f6d8\",\n  \"usb-c\": \"\\f6d9\",\n  \"usb-fill\": \"\\f6da\",\n  \"usb-plug-fill\": \"\\f6db\",\n  \"usb-plug\": \"\\f6dc\",\n  \"usb-symbol\": \"\\f6dd\",\n  \"usb\": \"\\f6de\",\n  \"boombox-fill\": \"\\f6df\",\n  \"displayport-1\": \"\\f6e0\",\n  \"displayport\": \"\\f6e1\",\n  \"gpu-card\": \"\\f6e2\",\n  \"memory\": \"\\f6e3\",\n  \"modem-fill\": \"\\f6e4\",\n  \"modem\": \"\\f6e5\",\n  \"motherboard-fill\": \"\\f6e6\",\n  \"motherboard\": \"\\f6e7\",\n  \"optical-audio-fill\": \"\\f6e8\",\n  \"optical-audio\": \"\\f6e9\",\n  \"pci-card\": \"\\f6ea\",\n  \"router-fill\": \"\\f6eb\",\n  \"router\": \"\\f6ec\",\n  \"ssd-fill\": \"\\f6ed\",\n  \"ssd\": \"\\f6ee\",\n  \"thunderbolt-fill\": \"\\f6ef\",\n  \"thunderbolt\": \"\\f6f0\",\n  \"usb-drive-fill\": \"\\f6f1\",\n  \"usb-drive\": \"\\f6f2\",\n  \"usb-micro-fill\": \"\\f6f3\",\n  \"usb-micro\": \"\\f6f4\",\n  \"usb-mini-fill\": \"\\f6f5\",\n  \"usb-mini\": \"\\f6f6\",\n  \"cloud-haze2\": \"\\f6f7\",\n  \"device-hdd-fill\": \"\\f6f8\",\n  \"device-hdd\": \"\\f6f9\",\n  \"device-ssd-fill\": \"\\f6fa\",\n  \"device-ssd\": \"\\f6fb\",\n  \"displayport-fill\": \"\\f6fc\",\n  \"mortarboard-fill\": \"\\f6fd\",\n  \"mortarboard\": \"\\f6fe\",\n  \"terminal-x\": \"\\f6ff\",\n);\n\n.bi-123::before { content: map-get($bootstrap-icons-map, \"123\"); }\n.bi-alarm-fill::before { content: map-get($bootstrap-icons-map, \"alarm-fill\"); }\n.bi-alarm::before { content: map-get($bootstrap-icons-map, \"alarm\"); }\n.bi-align-bottom::before { content: map-get($bootstrap-icons-map, \"align-bottom\"); }\n.bi-align-center::before { content: map-get($bootstrap-icons-map, \"align-center\"); }\n.bi-align-end::before { content: map-get($bootstrap-icons-map, \"align-end\"); }\n.bi-align-middle::before { content: map-get($bootstrap-icons-map, \"align-middle\"); }\n.bi-align-start::before { content: map-get($bootstrap-icons-map, \"align-start\"); }\n.bi-align-top::before { content: map-get($bootstrap-icons-map, \"align-top\"); }\n.bi-alt::before { content: map-get($bootstrap-icons-map, \"alt\"); }\n.bi-app-indicator::before { content: map-get($bootstrap-icons-map, \"app-indicator\"); }\n.bi-app::before { content: map-get($bootstrap-icons-map, \"app\"); }\n.bi-archive-fill::before { content: map-get($bootstrap-icons-map, \"archive-fill\"); }\n.bi-archive::before { content: map-get($bootstrap-icons-map, \"archive\"); }\n.bi-arrow-90deg-down::before { content: map-get($bootstrap-icons-map, \"arrow-90deg-down\"); }\n.bi-arrow-90deg-left::before { content: map-get($bootstrap-icons-map, \"arrow-90deg-left\"); }\n.bi-arrow-90deg-right::before { content: map-get($bootstrap-icons-map, \"arrow-90deg-right\"); }\n.bi-arrow-90deg-up::before { content: map-get($bootstrap-icons-map, \"arrow-90deg-up\"); }\n.bi-arrow-bar-down::before { content: map-get($bootstrap-icons-map, \"arrow-bar-down\"); }\n.bi-arrow-bar-left::before { content: map-get($bootstrap-icons-map, \"arrow-bar-left\"); }\n.bi-arrow-bar-right::before { content: map-get($bootstrap-icons-map, \"arrow-bar-right\"); }\n.bi-arrow-bar-up::before { content: map-get($bootstrap-icons-map, \"arrow-bar-up\"); }\n.bi-arrow-clockwise::before { content: map-get($bootstrap-icons-map, \"arrow-clockwise\"); }\n.bi-arrow-counterclockwise::before { content: map-get($bootstrap-icons-map, \"arrow-counterclockwise\"); }\n.bi-arrow-down-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-circle-fill\"); }\n.bi-arrow-down-circle::before { content: map-get($bootstrap-icons-map, \"arrow-down-circle\"); }\n.bi-arrow-down-left-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-left-circle-fill\"); }\n.bi-arrow-down-left-circle::before { content: map-get($bootstrap-icons-map, \"arrow-down-left-circle\"); }\n.bi-arrow-down-left-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-left-square-fill\"); }\n.bi-arrow-down-left-square::before { content: map-get($bootstrap-icons-map, \"arrow-down-left-square\"); }\n.bi-arrow-down-left::before { content: map-get($bootstrap-icons-map, \"arrow-down-left\"); }\n.bi-arrow-down-right-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-right-circle-fill\"); }\n.bi-arrow-down-right-circle::before { content: map-get($bootstrap-icons-map, \"arrow-down-right-circle\"); }\n.bi-arrow-down-right-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-right-square-fill\"); }\n.bi-arrow-down-right-square::before { content: map-get($bootstrap-icons-map, \"arrow-down-right-square\"); }\n.bi-arrow-down-right::before { content: map-get($bootstrap-icons-map, \"arrow-down-right\"); }\n.bi-arrow-down-short::before { content: map-get($bootstrap-icons-map, \"arrow-down-short\"); }\n.bi-arrow-down-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-down-square-fill\"); }\n.bi-arrow-down-square::before { content: map-get($bootstrap-icons-map, \"arrow-down-square\"); }\n.bi-arrow-down-up::before { content: map-get($bootstrap-icons-map, \"arrow-down-up\"); }\n.bi-arrow-down::before { content: map-get($bootstrap-icons-map, \"arrow-down\"); }\n.bi-arrow-left-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-left-circle-fill\"); }\n.bi-arrow-left-circle::before { content: map-get($bootstrap-icons-map, \"arrow-left-circle\"); }\n.bi-arrow-left-right::before { content: map-get($bootstrap-icons-map, \"arrow-left-right\"); }\n.bi-arrow-left-short::before { content: map-get($bootstrap-icons-map, \"arrow-left-short\"); }\n.bi-arrow-left-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-left-square-fill\"); }\n.bi-arrow-left-square::before { content: map-get($bootstrap-icons-map, \"arrow-left-square\"); }\n.bi-arrow-left::before { content: map-get($bootstrap-icons-map, \"arrow-left\"); }\n.bi-arrow-repeat::before { content: map-get($bootstrap-icons-map, \"arrow-repeat\"); }\n.bi-arrow-return-left::before { content: map-get($bootstrap-icons-map, \"arrow-return-left\"); }\n.bi-arrow-return-right::before { content: map-get($bootstrap-icons-map, \"arrow-return-right\"); }\n.bi-arrow-right-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-right-circle-fill\"); }\n.bi-arrow-right-circle::before { content: map-get($bootstrap-icons-map, \"arrow-right-circle\"); }\n.bi-arrow-right-short::before { content: map-get($bootstrap-icons-map, \"arrow-right-short\"); }\n.bi-arrow-right-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-right-square-fill\"); }\n.bi-arrow-right-square::before { content: map-get($bootstrap-icons-map, \"arrow-right-square\"); }\n.bi-arrow-right::before { content: map-get($bootstrap-icons-map, \"arrow-right\"); }\n.bi-arrow-up-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-circle-fill\"); }\n.bi-arrow-up-circle::before { content: map-get($bootstrap-icons-map, \"arrow-up-circle\"); }\n.bi-arrow-up-left-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-left-circle-fill\"); }\n.bi-arrow-up-left-circle::before { content: map-get($bootstrap-icons-map, \"arrow-up-left-circle\"); }\n.bi-arrow-up-left-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-left-square-fill\"); }\n.bi-arrow-up-left-square::before { content: map-get($bootstrap-icons-map, \"arrow-up-left-square\"); }\n.bi-arrow-up-left::before { content: map-get($bootstrap-icons-map, \"arrow-up-left\"); }\n.bi-arrow-up-right-circle-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-right-circle-fill\"); }\n.bi-arrow-up-right-circle::before { content: map-get($bootstrap-icons-map, \"arrow-up-right-circle\"); }\n.bi-arrow-up-right-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-right-square-fill\"); }\n.bi-arrow-up-right-square::before { content: map-get($bootstrap-icons-map, \"arrow-up-right-square\"); }\n.bi-arrow-up-right::before { content: map-get($bootstrap-icons-map, \"arrow-up-right\"); }\n.bi-arrow-up-short::before { content: map-get($bootstrap-icons-map, \"arrow-up-short\"); }\n.bi-arrow-up-square-fill::before { content: map-get($bootstrap-icons-map, \"arrow-up-square-fill\"); }\n.bi-arrow-up-square::before { content: map-get($bootstrap-icons-map, \"arrow-up-square\"); }\n.bi-arrow-up::before { content: map-get($bootstrap-icons-map, \"arrow-up\"); }\n.bi-arrows-angle-contract::before { content: map-get($bootstrap-icons-map, \"arrows-angle-contract\"); }\n.bi-arrows-angle-expand::before { content: map-get($bootstrap-icons-map, \"arrows-angle-expand\"); }\n.bi-arrows-collapse::before { content: map-get($bootstrap-icons-map, \"arrows-collapse\"); }\n.bi-arrows-expand::before { content: map-get($bootstrap-icons-map, \"arrows-expand\"); }\n.bi-arrows-fullscreen::before { content: map-get($bootstrap-icons-map, \"arrows-fullscreen\"); }\n.bi-arrows-move::before { content: map-get($bootstrap-icons-map, \"arrows-move\"); }\n.bi-aspect-ratio-fill::before { content: map-get($bootstrap-icons-map, \"aspect-ratio-fill\"); }\n.bi-aspect-ratio::before { content: map-get($bootstrap-icons-map, \"aspect-ratio\"); }\n.bi-asterisk::before { content: map-get($bootstrap-icons-map, \"asterisk\"); }\n.bi-at::before { content: map-get($bootstrap-icons-map, \"at\"); }\n.bi-award-fill::before { content: map-get($bootstrap-icons-map, \"award-fill\"); }\n.bi-award::before { content: map-get($bootstrap-icons-map, \"award\"); }\n.bi-back::before { content: map-get($bootstrap-icons-map, \"back\"); }\n.bi-backspace-fill::before { content: map-get($bootstrap-icons-map, \"backspace-fill\"); }\n.bi-backspace-reverse-fill::before { content: map-get($bootstrap-icons-map, \"backspace-reverse-fill\"); }\n.bi-backspace-reverse::before { content: map-get($bootstrap-icons-map, \"backspace-reverse\"); }\n.bi-backspace::before { content: map-get($bootstrap-icons-map, \"backspace\"); }\n.bi-badge-3d-fill::before { content: map-get($bootstrap-icons-map, \"badge-3d-fill\"); }\n.bi-badge-3d::before { content: map-get($bootstrap-icons-map, \"badge-3d\"); }\n.bi-badge-4k-fill::before { content: map-get($bootstrap-icons-map, \"badge-4k-fill\"); }\n.bi-badge-4k::before { content: map-get($bootstrap-icons-map, \"badge-4k\"); }\n.bi-badge-8k-fill::before { content: map-get($bootstrap-icons-map, \"badge-8k-fill\"); }\n.bi-badge-8k::before { content: map-get($bootstrap-icons-map, \"badge-8k\"); }\n.bi-badge-ad-fill::before { content: map-get($bootstrap-icons-map, \"badge-ad-fill\"); }\n.bi-badge-ad::before { content: map-get($bootstrap-icons-map, \"badge-ad\"); }\n.bi-badge-ar-fill::before { content: map-get($bootstrap-icons-map, \"badge-ar-fill\"); }\n.bi-badge-ar::before { content: map-get($bootstrap-icons-map, \"badge-ar\"); }\n.bi-badge-cc-fill::before { content: map-get($bootstrap-icons-map, \"badge-cc-fill\"); }\n.bi-badge-cc::before { content: map-get($bootstrap-icons-map, \"badge-cc\"); }\n.bi-badge-hd-fill::before { content: map-get($bootstrap-icons-map, \"badge-hd-fill\"); }\n.bi-badge-hd::before { content: map-get($bootstrap-icons-map, \"badge-hd\"); }\n.bi-badge-tm-fill::before { content: map-get($bootstrap-icons-map, \"badge-tm-fill\"); }\n.bi-badge-tm::before { content: map-get($bootstrap-icons-map, \"badge-tm\"); }\n.bi-badge-vo-fill::before { content: map-get($bootstrap-icons-map, \"badge-vo-fill\"); }\n.bi-badge-vo::before { content: map-get($bootstrap-icons-map, \"badge-vo\"); }\n.bi-badge-vr-fill::before { content: map-get($bootstrap-icons-map, \"badge-vr-fill\"); }\n.bi-badge-vr::before { content: map-get($bootstrap-icons-map, \"badge-vr\"); }\n.bi-badge-wc-fill::before { content: map-get($bootstrap-icons-map, \"badge-wc-fill\"); }\n.bi-badge-wc::before { content: map-get($bootstrap-icons-map, \"badge-wc\"); }\n.bi-bag-check-fill::before { content: map-get($bootstrap-icons-map, \"bag-check-fill\"); }\n.bi-bag-check::before { content: map-get($bootstrap-icons-map, \"bag-check\"); }\n.bi-bag-dash-fill::before { content: map-get($bootstrap-icons-map, \"bag-dash-fill\"); }\n.bi-bag-dash::before { content: map-get($bootstrap-icons-map, \"bag-dash\"); }\n.bi-bag-fill::before { content: map-get($bootstrap-icons-map, \"bag-fill\"); }\n.bi-bag-plus-fill::before { content: map-get($bootstrap-icons-map, \"bag-plus-fill\"); }\n.bi-bag-plus::before { content: map-get($bootstrap-icons-map, \"bag-plus\"); }\n.bi-bag-x-fill::before { content: map-get($bootstrap-icons-map, \"bag-x-fill\"); }\n.bi-bag-x::before { content: map-get($bootstrap-icons-map, \"bag-x\"); }\n.bi-bag::before { content: map-get($bootstrap-icons-map, \"bag\"); }\n.bi-bar-chart-fill::before { content: map-get($bootstrap-icons-map, \"bar-chart-fill\"); }\n.bi-bar-chart-line-fill::before { content: map-get($bootstrap-icons-map, \"bar-chart-line-fill\"); }\n.bi-bar-chart-line::before { content: map-get($bootstrap-icons-map, \"bar-chart-line\"); }\n.bi-bar-chart-steps::before { content: map-get($bootstrap-icons-map, \"bar-chart-steps\"); }\n.bi-bar-chart::before { content: map-get($bootstrap-icons-map, \"bar-chart\"); }\n.bi-basket-fill::before { content: map-get($bootstrap-icons-map, \"basket-fill\"); }\n.bi-basket::before { content: map-get($bootstrap-icons-map, \"basket\"); }\n.bi-basket2-fill::before { content: map-get($bootstrap-icons-map, \"basket2-fill\"); }\n.bi-basket2::before { content: map-get($bootstrap-icons-map, \"basket2\"); }\n.bi-basket3-fill::before { content: map-get($bootstrap-icons-map, \"basket3-fill\"); }\n.bi-basket3::before { content: map-get($bootstrap-icons-map, \"basket3\"); }\n.bi-battery-charging::before { content: map-get($bootstrap-icons-map, \"battery-charging\"); }\n.bi-battery-full::before { content: map-get($bootstrap-icons-map, \"battery-full\"); }\n.bi-battery-half::before { content: map-get($bootstrap-icons-map, \"battery-half\"); }\n.bi-battery::before { content: map-get($bootstrap-icons-map, \"battery\"); }\n.bi-bell-fill::before { content: map-get($bootstrap-icons-map, \"bell-fill\"); }\n.bi-bell::before { content: map-get($bootstrap-icons-map, \"bell\"); }\n.bi-bezier::before { content: map-get($bootstrap-icons-map, \"bezier\"); }\n.bi-bezier2::before { content: map-get($bootstrap-icons-map, \"bezier2\"); }\n.bi-bicycle::before { content: map-get($bootstrap-icons-map, \"bicycle\"); }\n.bi-binoculars-fill::before { content: map-get($bootstrap-icons-map, \"binoculars-fill\"); }\n.bi-binoculars::before { content: map-get($bootstrap-icons-map, \"binoculars\"); }\n.bi-blockquote-left::before { content: map-get($bootstrap-icons-map, \"blockquote-left\"); }\n.bi-blockquote-right::before { content: map-get($bootstrap-icons-map, \"blockquote-right\"); }\n.bi-book-fill::before { content: map-get($bootstrap-icons-map, \"book-fill\"); }\n.bi-book-half::before { content: map-get($bootstrap-icons-map, \"book-half\"); }\n.bi-book::before { content: map-get($bootstrap-icons-map, \"book\"); }\n.bi-bookmark-check-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-check-fill\"); }\n.bi-bookmark-check::before { content: map-get($bootstrap-icons-map, \"bookmark-check\"); }\n.bi-bookmark-dash-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-dash-fill\"); }\n.bi-bookmark-dash::before { content: map-get($bootstrap-icons-map, \"bookmark-dash\"); }\n.bi-bookmark-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-fill\"); }\n.bi-bookmark-heart-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-heart-fill\"); }\n.bi-bookmark-heart::before { content: map-get($bootstrap-icons-map, \"bookmark-heart\"); }\n.bi-bookmark-plus-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-plus-fill\"); }\n.bi-bookmark-plus::before { content: map-get($bootstrap-icons-map, \"bookmark-plus\"); }\n.bi-bookmark-star-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-star-fill\"); }\n.bi-bookmark-star::before { content: map-get($bootstrap-icons-map, \"bookmark-star\"); }\n.bi-bookmark-x-fill::before { content: map-get($bootstrap-icons-map, \"bookmark-x-fill\"); }\n.bi-bookmark-x::before { content: map-get($bootstrap-icons-map, \"bookmark-x\"); }\n.bi-bookmark::before { content: map-get($bootstrap-icons-map, \"bookmark\"); }\n.bi-bookmarks-fill::before { content: map-get($bootstrap-icons-map, \"bookmarks-fill\"); }\n.bi-bookmarks::before { content: map-get($bootstrap-icons-map, \"bookmarks\"); }\n.bi-bookshelf::before { content: map-get($bootstrap-icons-map, \"bookshelf\"); }\n.bi-bootstrap-fill::before { content: map-get($bootstrap-icons-map, \"bootstrap-fill\"); }\n.bi-bootstrap-reboot::before { content: map-get($bootstrap-icons-map, \"bootstrap-reboot\"); }\n.bi-bootstrap::before { content: map-get($bootstrap-icons-map, \"bootstrap\"); }\n.bi-border-all::before { content: map-get($bootstrap-icons-map, \"border-all\"); }\n.bi-border-bottom::before { content: map-get($bootstrap-icons-map, \"border-bottom\"); }\n.bi-border-center::before { content: map-get($bootstrap-icons-map, \"border-center\"); }\n.bi-border-inner::before { content: map-get($bootstrap-icons-map, \"border-inner\"); }\n.bi-border-left::before { content: map-get($bootstrap-icons-map, \"border-left\"); }\n.bi-border-middle::before { content: map-get($bootstrap-icons-map, \"border-middle\"); }\n.bi-border-outer::before { content: map-get($bootstrap-icons-map, \"border-outer\"); }\n.bi-border-right::before { content: map-get($bootstrap-icons-map, \"border-right\"); }\n.bi-border-style::before { content: map-get($bootstrap-icons-map, \"border-style\"); }\n.bi-border-top::before { content: map-get($bootstrap-icons-map, \"border-top\"); }\n.bi-border-width::before { content: map-get($bootstrap-icons-map, \"border-width\"); }\n.bi-border::before { content: map-get($bootstrap-icons-map, \"border\"); }\n.bi-bounding-box-circles::before { content: map-get($bootstrap-icons-map, \"bounding-box-circles\"); }\n.bi-bounding-box::before { content: map-get($bootstrap-icons-map, \"bounding-box\"); }\n.bi-box-arrow-down-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-down-left\"); }\n.bi-box-arrow-down-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-down-right\"); }\n.bi-box-arrow-down::before { content: map-get($bootstrap-icons-map, \"box-arrow-down\"); }\n.bi-box-arrow-in-down-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-down-left\"); }\n.bi-box-arrow-in-down-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-down-right\"); }\n.bi-box-arrow-in-down::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-down\"); }\n.bi-box-arrow-in-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-left\"); }\n.bi-box-arrow-in-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-right\"); }\n.bi-box-arrow-in-up-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-up-left\"); }\n.bi-box-arrow-in-up-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-up-right\"); }\n.bi-box-arrow-in-up::before { content: map-get($bootstrap-icons-map, \"box-arrow-in-up\"); }\n.bi-box-arrow-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-left\"); }\n.bi-box-arrow-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-right\"); }\n.bi-box-arrow-up-left::before { content: map-get($bootstrap-icons-map, \"box-arrow-up-left\"); }\n.bi-box-arrow-up-right::before { content: map-get($bootstrap-icons-map, \"box-arrow-up-right\"); }\n.bi-box-arrow-up::before { content: map-get($bootstrap-icons-map, \"box-arrow-up\"); }\n.bi-box-seam::before { content: map-get($bootstrap-icons-map, \"box-seam\"); }\n.bi-box::before { content: map-get($bootstrap-icons-map, \"box\"); }\n.bi-braces::before { content: map-get($bootstrap-icons-map, \"braces\"); }\n.bi-bricks::before { content: map-get($bootstrap-icons-map, \"bricks\"); }\n.bi-briefcase-fill::before { content: map-get($bootstrap-icons-map, \"briefcase-fill\"); }\n.bi-briefcase::before { content: map-get($bootstrap-icons-map, \"briefcase\"); }\n.bi-brightness-alt-high-fill::before { content: map-get($bootstrap-icons-map, \"brightness-alt-high-fill\"); }\n.bi-brightness-alt-high::before { content: map-get($bootstrap-icons-map, \"brightness-alt-high\"); }\n.bi-brightness-alt-low-fill::before { content: map-get($bootstrap-icons-map, \"brightness-alt-low-fill\"); }\n.bi-brightness-alt-low::before { content: map-get($bootstrap-icons-map, \"brightness-alt-low\"); }\n.bi-brightness-high-fill::before { content: map-get($bootstrap-icons-map, \"brightness-high-fill\"); }\n.bi-brightness-high::before { content: map-get($bootstrap-icons-map, \"brightness-high\"); }\n.bi-brightness-low-fill::before { content: map-get($bootstrap-icons-map, \"brightness-low-fill\"); }\n.bi-brightness-low::before { content: map-get($bootstrap-icons-map, \"brightness-low\"); }\n.bi-broadcast-pin::before { content: map-get($bootstrap-icons-map, \"broadcast-pin\"); }\n.bi-broadcast::before { content: map-get($bootstrap-icons-map, \"broadcast\"); }\n.bi-brush-fill::before { content: map-get($bootstrap-icons-map, \"brush-fill\"); }\n.bi-brush::before { content: map-get($bootstrap-icons-map, \"brush\"); }\n.bi-bucket-fill::before { content: map-get($bootstrap-icons-map, \"bucket-fill\"); }\n.bi-bucket::before { content: map-get($bootstrap-icons-map, \"bucket\"); }\n.bi-bug-fill::before { content: map-get($bootstrap-icons-map, \"bug-fill\"); }\n.bi-bug::before { content: map-get($bootstrap-icons-map, \"bug\"); }\n.bi-building::before { content: map-get($bootstrap-icons-map, \"building\"); }\n.bi-bullseye::before { content: map-get($bootstrap-icons-map, \"bullseye\"); }\n.bi-calculator-fill::before { content: map-get($bootstrap-icons-map, \"calculator-fill\"); }\n.bi-calculator::before { content: map-get($bootstrap-icons-map, \"calculator\"); }\n.bi-calendar-check-fill::before { content: map-get($bootstrap-icons-map, \"calendar-check-fill\"); }\n.bi-calendar-check::before { content: map-get($bootstrap-icons-map, \"calendar-check\"); }\n.bi-calendar-date-fill::before { content: map-get($bootstrap-icons-map, \"calendar-date-fill\"); }\n.bi-calendar-date::before { content: map-get($bootstrap-icons-map, \"calendar-date\"); }\n.bi-calendar-day-fill::before { content: map-get($bootstrap-icons-map, \"calendar-day-fill\"); }\n.bi-calendar-day::before { content: map-get($bootstrap-icons-map, \"calendar-day\"); }\n.bi-calendar-event-fill::before { content: map-get($bootstrap-icons-map, \"calendar-event-fill\"); }\n.bi-calendar-event::before { content: map-get($bootstrap-icons-map, \"calendar-event\"); }\n.bi-calendar-fill::before { content: map-get($bootstrap-icons-map, \"calendar-fill\"); }\n.bi-calendar-minus-fill::before { content: map-get($bootstrap-icons-map, \"calendar-minus-fill\"); }\n.bi-calendar-minus::before { content: map-get($bootstrap-icons-map, \"calendar-minus\"); }\n.bi-calendar-month-fill::before { content: map-get($bootstrap-icons-map, \"calendar-month-fill\"); }\n.bi-calendar-month::before { content: map-get($bootstrap-icons-map, \"calendar-month\"); }\n.bi-calendar-plus-fill::before { content: map-get($bootstrap-icons-map, \"calendar-plus-fill\"); }\n.bi-calendar-plus::before { content: map-get($bootstrap-icons-map, \"calendar-plus\"); }\n.bi-calendar-range-fill::before { content: map-get($bootstrap-icons-map, \"calendar-range-fill\"); }\n.bi-calendar-range::before { content: map-get($bootstrap-icons-map, \"calendar-range\"); }\n.bi-calendar-week-fill::before { content: map-get($bootstrap-icons-map, \"calendar-week-fill\"); }\n.bi-calendar-week::before { content: map-get($bootstrap-icons-map, \"calendar-week\"); }\n.bi-calendar-x-fill::before { content: map-get($bootstrap-icons-map, \"calendar-x-fill\"); }\n.bi-calendar-x::before { content: map-get($bootstrap-icons-map, \"calendar-x\"); }\n.bi-calendar::before { content: map-get($bootstrap-icons-map, \"calendar\"); }\n.bi-calendar2-check-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-check-fill\"); }\n.bi-calendar2-check::before { content: map-get($bootstrap-icons-map, \"calendar2-check\"); }\n.bi-calendar2-date-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-date-fill\"); }\n.bi-calendar2-date::before { content: map-get($bootstrap-icons-map, \"calendar2-date\"); }\n.bi-calendar2-day-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-day-fill\"); }\n.bi-calendar2-day::before { content: map-get($bootstrap-icons-map, \"calendar2-day\"); }\n.bi-calendar2-event-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-event-fill\"); }\n.bi-calendar2-event::before { content: map-get($bootstrap-icons-map, \"calendar2-event\"); }\n.bi-calendar2-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-fill\"); }\n.bi-calendar2-minus-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-minus-fill\"); }\n.bi-calendar2-minus::before { content: map-get($bootstrap-icons-map, \"calendar2-minus\"); }\n.bi-calendar2-month-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-month-fill\"); }\n.bi-calendar2-month::before { content: map-get($bootstrap-icons-map, \"calendar2-month\"); }\n.bi-calendar2-plus-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-plus-fill\"); }\n.bi-calendar2-plus::before { content: map-get($bootstrap-icons-map, \"calendar2-plus\"); }\n.bi-calendar2-range-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-range-fill\"); }\n.bi-calendar2-range::before { content: map-get($bootstrap-icons-map, \"calendar2-range\"); }\n.bi-calendar2-week-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-week-fill\"); }\n.bi-calendar2-week::before { content: map-get($bootstrap-icons-map, \"calendar2-week\"); }\n.bi-calendar2-x-fill::before { content: map-get($bootstrap-icons-map, \"calendar2-x-fill\"); }\n.bi-calendar2-x::before { content: map-get($bootstrap-icons-map, \"calendar2-x\"); }\n.bi-calendar2::before { content: map-get($bootstrap-icons-map, \"calendar2\"); }\n.bi-calendar3-event-fill::before { content: map-get($bootstrap-icons-map, \"calendar3-event-fill\"); }\n.bi-calendar3-event::before { content: map-get($bootstrap-icons-map, \"calendar3-event\"); }\n.bi-calendar3-fill::before { content: map-get($bootstrap-icons-map, \"calendar3-fill\"); }\n.bi-calendar3-range-fill::before { content: map-get($bootstrap-icons-map, \"calendar3-range-fill\"); }\n.bi-calendar3-range::before { content: map-get($bootstrap-icons-map, \"calendar3-range\"); }\n.bi-calendar3-week-fill::before { content: map-get($bootstrap-icons-map, \"calendar3-week-fill\"); }\n.bi-calendar3-week::before { content: map-get($bootstrap-icons-map, \"calendar3-week\"); }\n.bi-calendar3::before { content: map-get($bootstrap-icons-map, \"calendar3\"); }\n.bi-calendar4-event::before { content: map-get($bootstrap-icons-map, \"calendar4-event\"); }\n.bi-calendar4-range::before { content: map-get($bootstrap-icons-map, \"calendar4-range\"); }\n.bi-calendar4-week::before { content: map-get($bootstrap-icons-map, \"calendar4-week\"); }\n.bi-calendar4::before { content: map-get($bootstrap-icons-map, \"calendar4\"); }\n.bi-camera-fill::before { content: map-get($bootstrap-icons-map, \"camera-fill\"); }\n.bi-camera-reels-fill::before { content: map-get($bootstrap-icons-map, \"camera-reels-fill\"); }\n.bi-camera-reels::before { content: map-get($bootstrap-icons-map, \"camera-reels\"); }\n.bi-camera-video-fill::before { content: map-get($bootstrap-icons-map, \"camera-video-fill\"); }\n.bi-camera-video-off-fill::before { content: map-get($bootstrap-icons-map, \"camera-video-off-fill\"); }\n.bi-camera-video-off::before { content: map-get($bootstrap-icons-map, \"camera-video-off\"); }\n.bi-camera-video::before { content: map-get($bootstrap-icons-map, \"camera-video\"); }\n.bi-camera::before { content: map-get($bootstrap-icons-map, \"camera\"); }\n.bi-camera2::before { content: map-get($bootstrap-icons-map, \"camera2\"); }\n.bi-capslock-fill::before { content: map-get($bootstrap-icons-map, \"capslock-fill\"); }\n.bi-capslock::before { content: map-get($bootstrap-icons-map, \"capslock\"); }\n.bi-card-checklist::before { content: map-get($bootstrap-icons-map, \"card-checklist\"); }\n.bi-card-heading::before { content: map-get($bootstrap-icons-map, \"card-heading\"); }\n.bi-card-image::before { content: map-get($bootstrap-icons-map, \"card-image\"); }\n.bi-card-list::before { content: map-get($bootstrap-icons-map, \"card-list\"); }\n.bi-card-text::before { content: map-get($bootstrap-icons-map, \"card-text\"); }\n.bi-caret-down-fill::before { content: map-get($bootstrap-icons-map, \"caret-down-fill\"); }\n.bi-caret-down-square-fill::before { content: map-get($bootstrap-icons-map, \"caret-down-square-fill\"); }\n.bi-caret-down-square::before { content: map-get($bootstrap-icons-map, \"caret-down-square\"); }\n.bi-caret-down::before { content: map-get($bootstrap-icons-map, \"caret-down\"); }\n.bi-caret-left-fill::before { content: map-get($bootstrap-icons-map, \"caret-left-fill\"); }\n.bi-caret-left-square-fill::before { content: map-get($bootstrap-icons-map, \"caret-left-square-fill\"); }\n.bi-caret-left-square::before { content: map-get($bootstrap-icons-map, \"caret-left-square\"); }\n.bi-caret-left::before { content: map-get($bootstrap-icons-map, \"caret-left\"); }\n.bi-caret-right-fill::before { content: map-get($bootstrap-icons-map, \"caret-right-fill\"); }\n.bi-caret-right-square-fill::before { content: map-get($bootstrap-icons-map, \"caret-right-square-fill\"); }\n.bi-caret-right-square::before { content: map-get($bootstrap-icons-map, \"caret-right-square\"); }\n.bi-caret-right::before { content: map-get($bootstrap-icons-map, \"caret-right\"); }\n.bi-caret-up-fill::before { content: map-get($bootstrap-icons-map, \"caret-up-fill\"); }\n.bi-caret-up-square-fill::before { content: map-get($bootstrap-icons-map, \"caret-up-square-fill\"); }\n.bi-caret-up-square::before { content: map-get($bootstrap-icons-map, \"caret-up-square\"); }\n.bi-caret-up::before { content: map-get($bootstrap-icons-map, \"caret-up\"); }\n.bi-cart-check-fill::before { content: map-get($bootstrap-icons-map, \"cart-check-fill\"); }\n.bi-cart-check::before { content: map-get($bootstrap-icons-map, \"cart-check\"); }\n.bi-cart-dash-fill::before { content: map-get($bootstrap-icons-map, \"cart-dash-fill\"); }\n.bi-cart-dash::before { content: map-get($bootstrap-icons-map, \"cart-dash\"); }\n.bi-cart-fill::before { content: map-get($bootstrap-icons-map, \"cart-fill\"); }\n.bi-cart-plus-fill::before { content: map-get($bootstrap-icons-map, \"cart-plus-fill\"); }\n.bi-cart-plus::before { content: map-get($bootstrap-icons-map, \"cart-plus\"); }\n.bi-cart-x-fill::before { content: map-get($bootstrap-icons-map, \"cart-x-fill\"); }\n.bi-cart-x::before { content: map-get($bootstrap-icons-map, \"cart-x\"); }\n.bi-cart::before { content: map-get($bootstrap-icons-map, \"cart\"); }\n.bi-cart2::before { content: map-get($bootstrap-icons-map, \"cart2\"); }\n.bi-cart3::before { content: map-get($bootstrap-icons-map, \"cart3\"); }\n.bi-cart4::before { content: map-get($bootstrap-icons-map, \"cart4\"); }\n.bi-cash-stack::before { content: map-get($bootstrap-icons-map, \"cash-stack\"); }\n.bi-cash::before { content: map-get($bootstrap-icons-map, \"cash\"); }\n.bi-cast::before { content: map-get($bootstrap-icons-map, \"cast\"); }\n.bi-chat-dots-fill::before { content: map-get($bootstrap-icons-map, \"chat-dots-fill\"); }\n.bi-chat-dots::before { content: map-get($bootstrap-icons-map, \"chat-dots\"); }\n.bi-chat-fill::before { content: map-get($bootstrap-icons-map, \"chat-fill\"); }\n.bi-chat-left-dots-fill::before { content: map-get($bootstrap-icons-map, \"chat-left-dots-fill\"); }\n.bi-chat-left-dots::before { content: map-get($bootstrap-icons-map, \"chat-left-dots\"); }\n.bi-chat-left-fill::before { content: map-get($bootstrap-icons-map, \"chat-left-fill\"); }\n.bi-chat-left-quote-fill::before { content: map-get($bootstrap-icons-map, \"chat-left-quote-fill\"); }\n.bi-chat-left-quote::before { content: map-get($bootstrap-icons-map, \"chat-left-quote\"); }\n.bi-chat-left-text-fill::before { content: map-get($bootstrap-icons-map, \"chat-left-text-fill\"); }\n.bi-chat-left-text::before { content: map-get($bootstrap-icons-map, \"chat-left-text\"); }\n.bi-chat-left::before { content: map-get($bootstrap-icons-map, \"chat-left\"); }\n.bi-chat-quote-fill::before { content: map-get($bootstrap-icons-map, \"chat-quote-fill\"); }\n.bi-chat-quote::before { content: map-get($bootstrap-icons-map, \"chat-quote\"); }\n.bi-chat-right-dots-fill::before { content: map-get($bootstrap-icons-map, \"chat-right-dots-fill\"); }\n.bi-chat-right-dots::before { content: map-get($bootstrap-icons-map, \"chat-right-dots\"); }\n.bi-chat-right-fill::before { content: map-get($bootstrap-icons-map, \"chat-right-fill\"); }\n.bi-chat-right-quote-fill::before { content: map-get($bootstrap-icons-map, \"chat-right-quote-fill\"); }\n.bi-chat-right-quote::before { content: map-get($bootstrap-icons-map, \"chat-right-quote\"); }\n.bi-chat-right-text-fill::before { content: map-get($bootstrap-icons-map, \"chat-right-text-fill\"); }\n.bi-chat-right-text::before { content: map-get($bootstrap-icons-map, \"chat-right-text\"); }\n.bi-chat-right::before { content: map-get($bootstrap-icons-map, \"chat-right\"); }\n.bi-chat-square-dots-fill::before { content: map-get($bootstrap-icons-map, \"chat-square-dots-fill\"); }\n.bi-chat-square-dots::before { content: map-get($bootstrap-icons-map, \"chat-square-dots\"); }\n.bi-chat-square-fill::before { content: map-get($bootstrap-icons-map, \"chat-square-fill\"); }\n.bi-chat-square-quote-fill::before { content: map-get($bootstrap-icons-map, \"chat-square-quote-fill\"); }\n.bi-chat-square-quote::before { content: map-get($bootstrap-icons-map, \"chat-square-quote\"); }\n.bi-chat-square-text-fill::before { content: map-get($bootstrap-icons-map, \"chat-square-text-fill\"); }\n.bi-chat-square-text::before { content: map-get($bootstrap-icons-map, \"chat-square-text\"); }\n.bi-chat-square::before { content: map-get($bootstrap-icons-map, \"chat-square\"); }\n.bi-chat-text-fill::before { content: map-get($bootstrap-icons-map, \"chat-text-fill\"); }\n.bi-chat-text::before { content: map-get($bootstrap-icons-map, \"chat-text\"); }\n.bi-chat::before { content: map-get($bootstrap-icons-map, \"chat\"); }\n.bi-check-all::before { content: map-get($bootstrap-icons-map, \"check-all\"); }\n.bi-check-circle-fill::before { content: map-get($bootstrap-icons-map, \"check-circle-fill\"); }\n.bi-check-circle::before { content: map-get($bootstrap-icons-map, \"check-circle\"); }\n.bi-check-square-fill::before { content: map-get($bootstrap-icons-map, \"check-square-fill\"); }\n.bi-check-square::before { content: map-get($bootstrap-icons-map, \"check-square\"); }\n.bi-check::before { content: map-get($bootstrap-icons-map, \"check\"); }\n.bi-check2-all::before { content: map-get($bootstrap-icons-map, \"check2-all\"); }\n.bi-check2-circle::before { content: map-get($bootstrap-icons-map, \"check2-circle\"); }\n.bi-check2-square::before { content: map-get($bootstrap-icons-map, \"check2-square\"); }\n.bi-check2::before { content: map-get($bootstrap-icons-map, \"check2\"); }\n.bi-chevron-bar-contract::before { content: map-get($bootstrap-icons-map, \"chevron-bar-contract\"); }\n.bi-chevron-bar-down::before { content: map-get($bootstrap-icons-map, \"chevron-bar-down\"); }\n.bi-chevron-bar-expand::before { content: map-get($bootstrap-icons-map, \"chevron-bar-expand\"); }\n.bi-chevron-bar-left::before { content: map-get($bootstrap-icons-map, \"chevron-bar-left\"); }\n.bi-chevron-bar-right::before { content: map-get($bootstrap-icons-map, \"chevron-bar-right\"); }\n.bi-chevron-bar-up::before { content: map-get($bootstrap-icons-map, \"chevron-bar-up\"); }\n.bi-chevron-compact-down::before { content: map-get($bootstrap-icons-map, \"chevron-compact-down\"); }\n.bi-chevron-compact-left::before { content: map-get($bootstrap-icons-map, \"chevron-compact-left\"); }\n.bi-chevron-compact-right::before { content: map-get($bootstrap-icons-map, \"chevron-compact-right\"); }\n.bi-chevron-compact-up::before { content: map-get($bootstrap-icons-map, \"chevron-compact-up\"); }\n.bi-chevron-contract::before { content: map-get($bootstrap-icons-map, \"chevron-contract\"); }\n.bi-chevron-double-down::before { content: map-get($bootstrap-icons-map, \"chevron-double-down\"); }\n.bi-chevron-double-left::before { content: map-get($bootstrap-icons-map, \"chevron-double-left\"); }\n.bi-chevron-double-right::before { content: map-get($bootstrap-icons-map, \"chevron-double-right\"); }\n.bi-chevron-double-up::before { content: map-get($bootstrap-icons-map, \"chevron-double-up\"); }\n.bi-chevron-down::before { content: map-get($bootstrap-icons-map, \"chevron-down\"); }\n.bi-chevron-expand::before { content: map-get($bootstrap-icons-map, \"chevron-expand\"); }\n.bi-chevron-left::before { content: map-get($bootstrap-icons-map, \"chevron-left\"); }\n.bi-chevron-right::before { content: map-get($bootstrap-icons-map, \"chevron-right\"); }\n.bi-chevron-up::before { content: map-get($bootstrap-icons-map, \"chevron-up\"); }\n.bi-circle-fill::before { content: map-get($bootstrap-icons-map, \"circle-fill\"); }\n.bi-circle-half::before { content: map-get($bootstrap-icons-map, \"circle-half\"); }\n.bi-circle-square::before { content: map-get($bootstrap-icons-map, \"circle-square\"); }\n.bi-circle::before { content: map-get($bootstrap-icons-map, \"circle\"); }\n.bi-clipboard-check::before { content: map-get($bootstrap-icons-map, \"clipboard-check\"); }\n.bi-clipboard-data::before { content: map-get($bootstrap-icons-map, \"clipboard-data\"); }\n.bi-clipboard-minus::before { content: map-get($bootstrap-icons-map, \"clipboard-minus\"); }\n.bi-clipboard-plus::before { content: map-get($bootstrap-icons-map, \"clipboard-plus\"); }\n.bi-clipboard-x::before { content: map-get($bootstrap-icons-map, \"clipboard-x\"); }\n.bi-clipboard::before { content: map-get($bootstrap-icons-map, \"clipboard\"); }\n.bi-clock-fill::before { content: map-get($bootstrap-icons-map, \"clock-fill\"); }\n.bi-clock-history::before { content: map-get($bootstrap-icons-map, \"clock-history\"); }\n.bi-clock::before { content: map-get($bootstrap-icons-map, \"clock\"); }\n.bi-cloud-arrow-down-fill::before { content: map-get($bootstrap-icons-map, \"cloud-arrow-down-fill\"); }\n.bi-cloud-arrow-down::before { content: map-get($bootstrap-icons-map, \"cloud-arrow-down\"); }\n.bi-cloud-arrow-up-fill::before { content: map-get($bootstrap-icons-map, \"cloud-arrow-up-fill\"); }\n.bi-cloud-arrow-up::before { content: map-get($bootstrap-icons-map, \"cloud-arrow-up\"); }\n.bi-cloud-check-fill::before { content: map-get($bootstrap-icons-map, \"cloud-check-fill\"); }\n.bi-cloud-check::before { content: map-get($bootstrap-icons-map, \"cloud-check\"); }\n.bi-cloud-download-fill::before { content: map-get($bootstrap-icons-map, \"cloud-download-fill\"); }\n.bi-cloud-download::before { content: map-get($bootstrap-icons-map, \"cloud-download\"); }\n.bi-cloud-drizzle-fill::before { content: map-get($bootstrap-icons-map, \"cloud-drizzle-fill\"); }\n.bi-cloud-drizzle::before { content: map-get($bootstrap-icons-map, \"cloud-drizzle\"); }\n.bi-cloud-fill::before { content: map-get($bootstrap-icons-map, \"cloud-fill\"); }\n.bi-cloud-fog-fill::before { content: map-get($bootstrap-icons-map, \"cloud-fog-fill\"); }\n.bi-cloud-fog::before { content: map-get($bootstrap-icons-map, \"cloud-fog\"); }\n.bi-cloud-fog2-fill::before { content: map-get($bootstrap-icons-map, \"cloud-fog2-fill\"); }\n.bi-cloud-fog2::before { content: map-get($bootstrap-icons-map, \"cloud-fog2\"); }\n.bi-cloud-hail-fill::before { content: map-get($bootstrap-icons-map, \"cloud-hail-fill\"); }\n.bi-cloud-hail::before { content: map-get($bootstrap-icons-map, \"cloud-hail\"); }\n.bi-cloud-haze-1::before { content: map-get($bootstrap-icons-map, \"cloud-haze-1\"); }\n.bi-cloud-haze-fill::before { content: map-get($bootstrap-icons-map, \"cloud-haze-fill\"); }\n.bi-cloud-haze::before { content: map-get($bootstrap-icons-map, \"cloud-haze\"); }\n.bi-cloud-haze2-fill::before { content: map-get($bootstrap-icons-map, \"cloud-haze2-fill\"); }\n.bi-cloud-lightning-fill::before { content: map-get($bootstrap-icons-map, \"cloud-lightning-fill\"); }\n.bi-cloud-lightning-rain-fill::before { content: map-get($bootstrap-icons-map, \"cloud-lightning-rain-fill\"); }\n.bi-cloud-lightning-rain::before { content: map-get($bootstrap-icons-map, \"cloud-lightning-rain\"); }\n.bi-cloud-lightning::before { content: map-get($bootstrap-icons-map, \"cloud-lightning\"); }\n.bi-cloud-minus-fill::before { content: map-get($bootstrap-icons-map, \"cloud-minus-fill\"); }\n.bi-cloud-minus::before { content: map-get($bootstrap-icons-map, \"cloud-minus\"); }\n.bi-cloud-moon-fill::before { content: map-get($bootstrap-icons-map, \"cloud-moon-fill\"); }\n.bi-cloud-moon::before { content: map-get($bootstrap-icons-map, \"cloud-moon\"); }\n.bi-cloud-plus-fill::before { content: map-get($bootstrap-icons-map, \"cloud-plus-fill\"); }\n.bi-cloud-plus::before { content: map-get($bootstrap-icons-map, \"cloud-plus\"); }\n.bi-cloud-rain-fill::before { content: map-get($bootstrap-icons-map, \"cloud-rain-fill\"); }\n.bi-cloud-rain-heavy-fill::before { content: map-get($bootstrap-icons-map, \"cloud-rain-heavy-fill\"); }\n.bi-cloud-rain-heavy::before { content: map-get($bootstrap-icons-map, \"cloud-rain-heavy\"); }\n.bi-cloud-rain::before { content: map-get($bootstrap-icons-map, \"cloud-rain\"); }\n.bi-cloud-slash-fill::before { content: map-get($bootstrap-icons-map, \"cloud-slash-fill\"); }\n.bi-cloud-slash::before { content: map-get($bootstrap-icons-map, \"cloud-slash\"); }\n.bi-cloud-sleet-fill::before { content: map-get($bootstrap-icons-map, \"cloud-sleet-fill\"); }\n.bi-cloud-sleet::before { content: map-get($bootstrap-icons-map, \"cloud-sleet\"); }\n.bi-cloud-snow-fill::before { content: map-get($bootstrap-icons-map, \"cloud-snow-fill\"); }\n.bi-cloud-snow::before { content: map-get($bootstrap-icons-map, \"cloud-snow\"); }\n.bi-cloud-sun-fill::before { content: map-get($bootstrap-icons-map, \"cloud-sun-fill\"); }\n.bi-cloud-sun::before { content: map-get($bootstrap-icons-map, \"cloud-sun\"); }\n.bi-cloud-upload-fill::before { content: map-get($bootstrap-icons-map, \"cloud-upload-fill\"); }\n.bi-cloud-upload::before { content: map-get($bootstrap-icons-map, \"cloud-upload\"); }\n.bi-cloud::before { content: map-get($bootstrap-icons-map, \"cloud\"); }\n.bi-clouds-fill::before { content: map-get($bootstrap-icons-map, \"clouds-fill\"); }\n.bi-clouds::before { content: map-get($bootstrap-icons-map, \"clouds\"); }\n.bi-cloudy-fill::before { content: map-get($bootstrap-icons-map, \"cloudy-fill\"); }\n.bi-cloudy::before { content: map-get($bootstrap-icons-map, \"cloudy\"); }\n.bi-code-slash::before { content: map-get($bootstrap-icons-map, \"code-slash\"); }\n.bi-code-square::before { content: map-get($bootstrap-icons-map, \"code-square\"); }\n.bi-code::before { content: map-get($bootstrap-icons-map, \"code\"); }\n.bi-collection-fill::before { content: map-get($bootstrap-icons-map, \"collection-fill\"); }\n.bi-collection-play-fill::before { content: map-get($bootstrap-icons-map, \"collection-play-fill\"); }\n.bi-collection-play::before { content: map-get($bootstrap-icons-map, \"collection-play\"); }\n.bi-collection::before { content: map-get($bootstrap-icons-map, \"collection\"); }\n.bi-columns-gap::before { content: map-get($bootstrap-icons-map, \"columns-gap\"); }\n.bi-columns::before { content: map-get($bootstrap-icons-map, \"columns\"); }\n.bi-command::before { content: map-get($bootstrap-icons-map, \"command\"); }\n.bi-compass-fill::before { content: map-get($bootstrap-icons-map, \"compass-fill\"); }\n.bi-compass::before { content: map-get($bootstrap-icons-map, \"compass\"); }\n.bi-cone-striped::before { content: map-get($bootstrap-icons-map, \"cone-striped\"); }\n.bi-cone::before { content: map-get($bootstrap-icons-map, \"cone\"); }\n.bi-controller::before { content: map-get($bootstrap-icons-map, \"controller\"); }\n.bi-cpu-fill::before { content: map-get($bootstrap-icons-map, \"cpu-fill\"); }\n.bi-cpu::before { content: map-get($bootstrap-icons-map, \"cpu\"); }\n.bi-credit-card-2-back-fill::before { content: map-get($bootstrap-icons-map, \"credit-card-2-back-fill\"); }\n.bi-credit-card-2-back::before { content: map-get($bootstrap-icons-map, \"credit-card-2-back\"); }\n.bi-credit-card-2-front-fill::before { content: map-get($bootstrap-icons-map, \"credit-card-2-front-fill\"); }\n.bi-credit-card-2-front::before { content: map-get($bootstrap-icons-map, \"credit-card-2-front\"); }\n.bi-credit-card-fill::before { content: map-get($bootstrap-icons-map, \"credit-card-fill\"); }\n.bi-credit-card::before { content: map-get($bootstrap-icons-map, \"credit-card\"); }\n.bi-crop::before { content: map-get($bootstrap-icons-map, \"crop\"); }\n.bi-cup-fill::before { content: map-get($bootstrap-icons-map, \"cup-fill\"); }\n.bi-cup-straw::before { content: map-get($bootstrap-icons-map, \"cup-straw\"); }\n.bi-cup::before { content: map-get($bootstrap-icons-map, \"cup\"); }\n.bi-cursor-fill::before { content: map-get($bootstrap-icons-map, \"cursor-fill\"); }\n.bi-cursor-text::before { content: map-get($bootstrap-icons-map, \"cursor-text\"); }\n.bi-cursor::before { content: map-get($bootstrap-icons-map, \"cursor\"); }\n.bi-dash-circle-dotted::before { content: map-get($bootstrap-icons-map, \"dash-circle-dotted\"); }\n.bi-dash-circle-fill::before { content: map-get($bootstrap-icons-map, \"dash-circle-fill\"); }\n.bi-dash-circle::before { content: map-get($bootstrap-icons-map, \"dash-circle\"); }\n.bi-dash-square-dotted::before { content: map-get($bootstrap-icons-map, \"dash-square-dotted\"); }\n.bi-dash-square-fill::before { content: map-get($bootstrap-icons-map, \"dash-square-fill\"); }\n.bi-dash-square::before { content: map-get($bootstrap-icons-map, \"dash-square\"); }\n.bi-dash::before { content: map-get($bootstrap-icons-map, \"dash\"); }\n.bi-diagram-2-fill::before { content: map-get($bootstrap-icons-map, \"diagram-2-fill\"); }\n.bi-diagram-2::before { content: map-get($bootstrap-icons-map, \"diagram-2\"); }\n.bi-diagram-3-fill::before { content: map-get($bootstrap-icons-map, \"diagram-3-fill\"); }\n.bi-diagram-3::before { content: map-get($bootstrap-icons-map, \"diagram-3\"); }\n.bi-diamond-fill::before { content: map-get($bootstrap-icons-map, \"diamond-fill\"); }\n.bi-diamond-half::before { content: map-get($bootstrap-icons-map, \"diamond-half\"); }\n.bi-diamond::before { content: map-get($bootstrap-icons-map, \"diamond\"); }\n.bi-dice-1-fill::before { content: map-get($bootstrap-icons-map, \"dice-1-fill\"); }\n.bi-dice-1::before { content: map-get($bootstrap-icons-map, \"dice-1\"); }\n.bi-dice-2-fill::before { content: map-get($bootstrap-icons-map, \"dice-2-fill\"); }\n.bi-dice-2::before { content: map-get($bootstrap-icons-map, \"dice-2\"); }\n.bi-dice-3-fill::before { content: map-get($bootstrap-icons-map, \"dice-3-fill\"); }\n.bi-dice-3::before { content: map-get($bootstrap-icons-map, \"dice-3\"); }\n.bi-dice-4-fill::before { content: map-get($bootstrap-icons-map, \"dice-4-fill\"); }\n.bi-dice-4::before { content: map-get($bootstrap-icons-map, \"dice-4\"); }\n.bi-dice-5-fill::before { content: map-get($bootstrap-icons-map, \"dice-5-fill\"); }\n.bi-dice-5::before { content: map-get($bootstrap-icons-map, \"dice-5\"); }\n.bi-dice-6-fill::before { content: map-get($bootstrap-icons-map, \"dice-6-fill\"); }\n.bi-dice-6::before { content: map-get($bootstrap-icons-map, \"dice-6\"); }\n.bi-disc-fill::before { content: map-get($bootstrap-icons-map, \"disc-fill\"); }\n.bi-disc::before { content: map-get($bootstrap-icons-map, \"disc\"); }\n.bi-discord::before { content: map-get($bootstrap-icons-map, \"discord\"); }\n.bi-display-fill::before { content: map-get($bootstrap-icons-map, \"display-fill\"); }\n.bi-display::before { content: map-get($bootstrap-icons-map, \"display\"); }\n.bi-distribute-horizontal::before { content: map-get($bootstrap-icons-map, \"distribute-horizontal\"); }\n.bi-distribute-vertical::before { content: map-get($bootstrap-icons-map, \"distribute-vertical\"); }\n.bi-door-closed-fill::before { content: map-get($bootstrap-icons-map, \"door-closed-fill\"); }\n.bi-door-closed::before { content: map-get($bootstrap-icons-map, \"door-closed\"); }\n.bi-door-open-fill::before { content: map-get($bootstrap-icons-map, \"door-open-fill\"); }\n.bi-door-open::before { content: map-get($bootstrap-icons-map, \"door-open\"); }\n.bi-dot::before { content: map-get($bootstrap-icons-map, \"dot\"); }\n.bi-download::before { content: map-get($bootstrap-icons-map, \"download\"); }\n.bi-droplet-fill::before { content: map-get($bootstrap-icons-map, \"droplet-fill\"); }\n.bi-droplet-half::before { content: map-get($bootstrap-icons-map, \"droplet-half\"); }\n.bi-droplet::before { content: map-get($bootstrap-icons-map, \"droplet\"); }\n.bi-earbuds::before { content: map-get($bootstrap-icons-map, \"earbuds\"); }\n.bi-easel-fill::before { content: map-get($bootstrap-icons-map, \"easel-fill\"); }\n.bi-easel::before { content: map-get($bootstrap-icons-map, \"easel\"); }\n.bi-egg-fill::before { content: map-get($bootstrap-icons-map, \"egg-fill\"); }\n.bi-egg-fried::before { content: map-get($bootstrap-icons-map, \"egg-fried\"); }\n.bi-egg::before { content: map-get($bootstrap-icons-map, \"egg\"); }\n.bi-eject-fill::before { content: map-get($bootstrap-icons-map, \"eject-fill\"); }\n.bi-eject::before { content: map-get($bootstrap-icons-map, \"eject\"); }\n.bi-emoji-angry-fill::before { content: map-get($bootstrap-icons-map, \"emoji-angry-fill\"); }\n.bi-emoji-angry::before { content: map-get($bootstrap-icons-map, \"emoji-angry\"); }\n.bi-emoji-dizzy-fill::before { content: map-get($bootstrap-icons-map, \"emoji-dizzy-fill\"); }\n.bi-emoji-dizzy::before { content: map-get($bootstrap-icons-map, \"emoji-dizzy\"); }\n.bi-emoji-expressionless-fill::before { content: map-get($bootstrap-icons-map, \"emoji-expressionless-fill\"); }\n.bi-emoji-expressionless::before { content: map-get($bootstrap-icons-map, \"emoji-expressionless\"); }\n.bi-emoji-frown-fill::before { content: map-get($bootstrap-icons-map, \"emoji-frown-fill\"); }\n.bi-emoji-frown::before { content: map-get($bootstrap-icons-map, \"emoji-frown\"); }\n.bi-emoji-heart-eyes-fill::before { content: map-get($bootstrap-icons-map, \"emoji-heart-eyes-fill\"); }\n.bi-emoji-heart-eyes::before { content: map-get($bootstrap-icons-map, \"emoji-heart-eyes\"); }\n.bi-emoji-laughing-fill::before { content: map-get($bootstrap-icons-map, \"emoji-laughing-fill\"); }\n.bi-emoji-laughing::before { content: map-get($bootstrap-icons-map, \"emoji-laughing\"); }\n.bi-emoji-neutral-fill::before { content: map-get($bootstrap-icons-map, \"emoji-neutral-fill\"); }\n.bi-emoji-neutral::before { content: map-get($bootstrap-icons-map, \"emoji-neutral\"); }\n.bi-emoji-smile-fill::before { content: map-get($bootstrap-icons-map, \"emoji-smile-fill\"); }\n.bi-emoji-smile-upside-down-fill::before { content: map-get($bootstrap-icons-map, \"emoji-smile-upside-down-fill\"); }\n.bi-emoji-smile-upside-down::before { content: map-get($bootstrap-icons-map, \"emoji-smile-upside-down\"); }\n.bi-emoji-smile::before { content: map-get($bootstrap-icons-map, \"emoji-smile\"); }\n.bi-emoji-sunglasses-fill::before { content: map-get($bootstrap-icons-map, \"emoji-sunglasses-fill\"); }\n.bi-emoji-sunglasses::before { content: map-get($bootstrap-icons-map, \"emoji-sunglasses\"); }\n.bi-emoji-wink-fill::before { content: map-get($bootstrap-icons-map, \"emoji-wink-fill\"); }\n.bi-emoji-wink::before { content: map-get($bootstrap-icons-map, \"emoji-wink\"); }\n.bi-envelope-fill::before { content: map-get($bootstrap-icons-map, \"envelope-fill\"); }\n.bi-envelope-open-fill::before { content: map-get($bootstrap-icons-map, \"envelope-open-fill\"); }\n.bi-envelope-open::before { content: map-get($bootstrap-icons-map, \"envelope-open\"); }\n.bi-envelope::before { content: map-get($bootstrap-icons-map, \"envelope\"); }\n.bi-eraser-fill::before { content: map-get($bootstrap-icons-map, \"eraser-fill\"); }\n.bi-eraser::before { content: map-get($bootstrap-icons-map, \"eraser\"); }\n.bi-exclamation-circle-fill::before { content: map-get($bootstrap-icons-map, \"exclamation-circle-fill\"); }\n.bi-exclamation-circle::before { content: map-get($bootstrap-icons-map, \"exclamation-circle\"); }\n.bi-exclamation-diamond-fill::before { content: map-get($bootstrap-icons-map, \"exclamation-diamond-fill\"); }\n.bi-exclamation-diamond::before { content: map-get($bootstrap-icons-map, \"exclamation-diamond\"); }\n.bi-exclamation-octagon-fill::before { content: map-get($bootstrap-icons-map, \"exclamation-octagon-fill\"); }\n.bi-exclamation-octagon::before { content: map-get($bootstrap-icons-map, \"exclamation-octagon\"); }\n.bi-exclamation-square-fill::before { content: map-get($bootstrap-icons-map, \"exclamation-square-fill\"); }\n.bi-exclamation-square::before { content: map-get($bootstrap-icons-map, \"exclamation-square\"); }\n.bi-exclamation-triangle-fill::before { content: map-get($bootstrap-icons-map, \"exclamation-triangle-fill\"); }\n.bi-exclamation-triangle::before { content: map-get($bootstrap-icons-map, \"exclamation-triangle\"); }\n.bi-exclamation::before { content: map-get($bootstrap-icons-map, \"exclamation\"); }\n.bi-exclude::before { content: map-get($bootstrap-icons-map, \"exclude\"); }\n.bi-eye-fill::before { content: map-get($bootstrap-icons-map, \"eye-fill\"); }\n.bi-eye-slash-fill::before { content: map-get($bootstrap-icons-map, \"eye-slash-fill\"); }\n.bi-eye-slash::before { content: map-get($bootstrap-icons-map, \"eye-slash\"); }\n.bi-eye::before { content: map-get($bootstrap-icons-map, \"eye\"); }\n.bi-eyedropper::before { content: map-get($bootstrap-icons-map, \"eyedropper\"); }\n.bi-eyeglasses::before { content: map-get($bootstrap-icons-map, \"eyeglasses\"); }\n.bi-facebook::before { content: map-get($bootstrap-icons-map, \"facebook\"); }\n.bi-file-arrow-down-fill::before { content: map-get($bootstrap-icons-map, \"file-arrow-down-fill\"); }\n.bi-file-arrow-down::before { content: map-get($bootstrap-icons-map, \"file-arrow-down\"); }\n.bi-file-arrow-up-fill::before { content: map-get($bootstrap-icons-map, \"file-arrow-up-fill\"); }\n.bi-file-arrow-up::before { content: map-get($bootstrap-icons-map, \"file-arrow-up\"); }\n.bi-file-bar-graph-fill::before { content: map-get($bootstrap-icons-map, \"file-bar-graph-fill\"); }\n.bi-file-bar-graph::before { content: map-get($bootstrap-icons-map, \"file-bar-graph\"); }\n.bi-file-binary-fill::before { content: map-get($bootstrap-icons-map, \"file-binary-fill\"); }\n.bi-file-binary::before { content: map-get($bootstrap-icons-map, \"file-binary\"); }\n.bi-file-break-fill::before { content: map-get($bootstrap-icons-map, \"file-break-fill\"); }\n.bi-file-break::before { content: map-get($bootstrap-icons-map, \"file-break\"); }\n.bi-file-check-fill::before { content: map-get($bootstrap-icons-map, \"file-check-fill\"); }\n.bi-file-check::before { content: map-get($bootstrap-icons-map, \"file-check\"); }\n.bi-file-code-fill::before { content: map-get($bootstrap-icons-map, \"file-code-fill\"); }\n.bi-file-code::before { content: map-get($bootstrap-icons-map, \"file-code\"); }\n.bi-file-diff-fill::before { content: map-get($bootstrap-icons-map, \"file-diff-fill\"); }\n.bi-file-diff::before { content: map-get($bootstrap-icons-map, \"file-diff\"); }\n.bi-file-earmark-arrow-down-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-arrow-down-fill\"); }\n.bi-file-earmark-arrow-down::before { content: map-get($bootstrap-icons-map, \"file-earmark-arrow-down\"); }\n.bi-file-earmark-arrow-up-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-arrow-up-fill\"); }\n.bi-file-earmark-arrow-up::before { content: map-get($bootstrap-icons-map, \"file-earmark-arrow-up\"); }\n.bi-file-earmark-bar-graph-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-bar-graph-fill\"); }\n.bi-file-earmark-bar-graph::before { content: map-get($bootstrap-icons-map, \"file-earmark-bar-graph\"); }\n.bi-file-earmark-binary-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-binary-fill\"); }\n.bi-file-earmark-binary::before { content: map-get($bootstrap-icons-map, \"file-earmark-binary\"); }\n.bi-file-earmark-break-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-break-fill\"); }\n.bi-file-earmark-break::before { content: map-get($bootstrap-icons-map, \"file-earmark-break\"); }\n.bi-file-earmark-check-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-check-fill\"); }\n.bi-file-earmark-check::before { content: map-get($bootstrap-icons-map, \"file-earmark-check\"); }\n.bi-file-earmark-code-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-code-fill\"); }\n.bi-file-earmark-code::before { content: map-get($bootstrap-icons-map, \"file-earmark-code\"); }\n.bi-file-earmark-diff-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-diff-fill\"); }\n.bi-file-earmark-diff::before { content: map-get($bootstrap-icons-map, \"file-earmark-diff\"); }\n.bi-file-earmark-easel-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-easel-fill\"); }\n.bi-file-earmark-easel::before { content: map-get($bootstrap-icons-map, \"file-earmark-easel\"); }\n.bi-file-earmark-excel-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-excel-fill\"); }\n.bi-file-earmark-excel::before { content: map-get($bootstrap-icons-map, \"file-earmark-excel\"); }\n.bi-file-earmark-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-fill\"); }\n.bi-file-earmark-font-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-font-fill\"); }\n.bi-file-earmark-font::before { content: map-get($bootstrap-icons-map, \"file-earmark-font\"); }\n.bi-file-earmark-image-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-image-fill\"); }\n.bi-file-earmark-image::before { content: map-get($bootstrap-icons-map, \"file-earmark-image\"); }\n.bi-file-earmark-lock-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-lock-fill\"); }\n.bi-file-earmark-lock::before { content: map-get($bootstrap-icons-map, \"file-earmark-lock\"); }\n.bi-file-earmark-lock2-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-lock2-fill\"); }\n.bi-file-earmark-lock2::before { content: map-get($bootstrap-icons-map, \"file-earmark-lock2\"); }\n.bi-file-earmark-medical-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-medical-fill\"); }\n.bi-file-earmark-medical::before { content: map-get($bootstrap-icons-map, \"file-earmark-medical\"); }\n.bi-file-earmark-minus-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-minus-fill\"); }\n.bi-file-earmark-minus::before { content: map-get($bootstrap-icons-map, \"file-earmark-minus\"); }\n.bi-file-earmark-music-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-music-fill\"); }\n.bi-file-earmark-music::before { content: map-get($bootstrap-icons-map, \"file-earmark-music\"); }\n.bi-file-earmark-person-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-person-fill\"); }\n.bi-file-earmark-person::before { content: map-get($bootstrap-icons-map, \"file-earmark-person\"); }\n.bi-file-earmark-play-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-play-fill\"); }\n.bi-file-earmark-play::before { content: map-get($bootstrap-icons-map, \"file-earmark-play\"); }\n.bi-file-earmark-plus-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-plus-fill\"); }\n.bi-file-earmark-plus::before { content: map-get($bootstrap-icons-map, \"file-earmark-plus\"); }\n.bi-file-earmark-post-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-post-fill\"); }\n.bi-file-earmark-post::before { content: map-get($bootstrap-icons-map, \"file-earmark-post\"); }\n.bi-file-earmark-ppt-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-ppt-fill\"); }\n.bi-file-earmark-ppt::before { content: map-get($bootstrap-icons-map, \"file-earmark-ppt\"); }\n.bi-file-earmark-richtext-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-richtext-fill\"); }\n.bi-file-earmark-richtext::before { content: map-get($bootstrap-icons-map, \"file-earmark-richtext\"); }\n.bi-file-earmark-ruled-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-ruled-fill\"); }\n.bi-file-earmark-ruled::before { content: map-get($bootstrap-icons-map, \"file-earmark-ruled\"); }\n.bi-file-earmark-slides-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-slides-fill\"); }\n.bi-file-earmark-slides::before { content: map-get($bootstrap-icons-map, \"file-earmark-slides\"); }\n.bi-file-earmark-spreadsheet-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-spreadsheet-fill\"); }\n.bi-file-earmark-spreadsheet::before { content: map-get($bootstrap-icons-map, \"file-earmark-spreadsheet\"); }\n.bi-file-earmark-text-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-text-fill\"); }\n.bi-file-earmark-text::before { content: map-get($bootstrap-icons-map, \"file-earmark-text\"); }\n.bi-file-earmark-word-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-word-fill\"); }\n.bi-file-earmark-word::before { content: map-get($bootstrap-icons-map, \"file-earmark-word\"); }\n.bi-file-earmark-x-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-x-fill\"); }\n.bi-file-earmark-x::before { content: map-get($bootstrap-icons-map, \"file-earmark-x\"); }\n.bi-file-earmark-zip-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-zip-fill\"); }\n.bi-file-earmark-zip::before { content: map-get($bootstrap-icons-map, \"file-earmark-zip\"); }\n.bi-file-earmark::before { content: map-get($bootstrap-icons-map, \"file-earmark\"); }\n.bi-file-easel-fill::before { content: map-get($bootstrap-icons-map, \"file-easel-fill\"); }\n.bi-file-easel::before { content: map-get($bootstrap-icons-map, \"file-easel\"); }\n.bi-file-excel-fill::before { content: map-get($bootstrap-icons-map, \"file-excel-fill\"); }\n.bi-file-excel::before { content: map-get($bootstrap-icons-map, \"file-excel\"); }\n.bi-file-fill::before { content: map-get($bootstrap-icons-map, \"file-fill\"); }\n.bi-file-font-fill::before { content: map-get($bootstrap-icons-map, \"file-font-fill\"); }\n.bi-file-font::before { content: map-get($bootstrap-icons-map, \"file-font\"); }\n.bi-file-image-fill::before { content: map-get($bootstrap-icons-map, \"file-image-fill\"); }\n.bi-file-image::before { content: map-get($bootstrap-icons-map, \"file-image\"); }\n.bi-file-lock-fill::before { content: map-get($bootstrap-icons-map, \"file-lock-fill\"); }\n.bi-file-lock::before { content: map-get($bootstrap-icons-map, \"file-lock\"); }\n.bi-file-lock2-fill::before { content: map-get($bootstrap-icons-map, \"file-lock2-fill\"); }\n.bi-file-lock2::before { content: map-get($bootstrap-icons-map, \"file-lock2\"); }\n.bi-file-medical-fill::before { content: map-get($bootstrap-icons-map, \"file-medical-fill\"); }\n.bi-file-medical::before { content: map-get($bootstrap-icons-map, \"file-medical\"); }\n.bi-file-minus-fill::before { content: map-get($bootstrap-icons-map, \"file-minus-fill\"); }\n.bi-file-minus::before { content: map-get($bootstrap-icons-map, \"file-minus\"); }\n.bi-file-music-fill::before { content: map-get($bootstrap-icons-map, \"file-music-fill\"); }\n.bi-file-music::before { content: map-get($bootstrap-icons-map, \"file-music\"); }\n.bi-file-person-fill::before { content: map-get($bootstrap-icons-map, \"file-person-fill\"); }\n.bi-file-person::before { content: map-get($bootstrap-icons-map, \"file-person\"); }\n.bi-file-play-fill::before { content: map-get($bootstrap-icons-map, \"file-play-fill\"); }\n.bi-file-play::before { content: map-get($bootstrap-icons-map, \"file-play\"); }\n.bi-file-plus-fill::before { content: map-get($bootstrap-icons-map, \"file-plus-fill\"); }\n.bi-file-plus::before { content: map-get($bootstrap-icons-map, \"file-plus\"); }\n.bi-file-post-fill::before { content: map-get($bootstrap-icons-map, \"file-post-fill\"); }\n.bi-file-post::before { content: map-get($bootstrap-icons-map, \"file-post\"); }\n.bi-file-ppt-fill::before { content: map-get($bootstrap-icons-map, \"file-ppt-fill\"); }\n.bi-file-ppt::before { content: map-get($bootstrap-icons-map, \"file-ppt\"); }\n.bi-file-richtext-fill::before { content: map-get($bootstrap-icons-map, \"file-richtext-fill\"); }\n.bi-file-richtext::before { content: map-get($bootstrap-icons-map, \"file-richtext\"); }\n.bi-file-ruled-fill::before { content: map-get($bootstrap-icons-map, \"file-ruled-fill\"); }\n.bi-file-ruled::before { content: map-get($bootstrap-icons-map, \"file-ruled\"); }\n.bi-file-slides-fill::before { content: map-get($bootstrap-icons-map, \"file-slides-fill\"); }\n.bi-file-slides::before { content: map-get($bootstrap-icons-map, \"file-slides\"); }\n.bi-file-spreadsheet-fill::before { content: map-get($bootstrap-icons-map, \"file-spreadsheet-fill\"); }\n.bi-file-spreadsheet::before { content: map-get($bootstrap-icons-map, \"file-spreadsheet\"); }\n.bi-file-text-fill::before { content: map-get($bootstrap-icons-map, \"file-text-fill\"); }\n.bi-file-text::before { content: map-get($bootstrap-icons-map, \"file-text\"); }\n.bi-file-word-fill::before { content: map-get($bootstrap-icons-map, \"file-word-fill\"); }\n.bi-file-word::before { content: map-get($bootstrap-icons-map, \"file-word\"); }\n.bi-file-x-fill::before { content: map-get($bootstrap-icons-map, \"file-x-fill\"); }\n.bi-file-x::before { content: map-get($bootstrap-icons-map, \"file-x\"); }\n.bi-file-zip-fill::before { content: map-get($bootstrap-icons-map, \"file-zip-fill\"); }\n.bi-file-zip::before { content: map-get($bootstrap-icons-map, \"file-zip\"); }\n.bi-file::before { content: map-get($bootstrap-icons-map, \"file\"); }\n.bi-files-alt::before { content: map-get($bootstrap-icons-map, \"files-alt\"); }\n.bi-files::before { content: map-get($bootstrap-icons-map, \"files\"); }\n.bi-film::before { content: map-get($bootstrap-icons-map, \"film\"); }\n.bi-filter-circle-fill::before { content: map-get($bootstrap-icons-map, \"filter-circle-fill\"); }\n.bi-filter-circle::before { content: map-get($bootstrap-icons-map, \"filter-circle\"); }\n.bi-filter-left::before { content: map-get($bootstrap-icons-map, \"filter-left\"); }\n.bi-filter-right::before { content: map-get($bootstrap-icons-map, \"filter-right\"); }\n.bi-filter-square-fill::before { content: map-get($bootstrap-icons-map, \"filter-square-fill\"); }\n.bi-filter-square::before { content: map-get($bootstrap-icons-map, \"filter-square\"); }\n.bi-filter::before { content: map-get($bootstrap-icons-map, \"filter\"); }\n.bi-flag-fill::before { content: map-get($bootstrap-icons-map, \"flag-fill\"); }\n.bi-flag::before { content: map-get($bootstrap-icons-map, \"flag\"); }\n.bi-flower1::before { content: map-get($bootstrap-icons-map, \"flower1\"); }\n.bi-flower2::before { content: map-get($bootstrap-icons-map, \"flower2\"); }\n.bi-flower3::before { content: map-get($bootstrap-icons-map, \"flower3\"); }\n.bi-folder-check::before { content: map-get($bootstrap-icons-map, \"folder-check\"); }\n.bi-folder-fill::before { content: map-get($bootstrap-icons-map, \"folder-fill\"); }\n.bi-folder-minus::before { content: map-get($bootstrap-icons-map, \"folder-minus\"); }\n.bi-folder-plus::before { content: map-get($bootstrap-icons-map, \"folder-plus\"); }\n.bi-folder-symlink-fill::before { content: map-get($bootstrap-icons-map, \"folder-symlink-fill\"); }\n.bi-folder-symlink::before { content: map-get($bootstrap-icons-map, \"folder-symlink\"); }\n.bi-folder-x::before { content: map-get($bootstrap-icons-map, \"folder-x\"); }\n.bi-folder::before { content: map-get($bootstrap-icons-map, \"folder\"); }\n.bi-folder2-open::before { content: map-get($bootstrap-icons-map, \"folder2-open\"); }\n.bi-folder2::before { content: map-get($bootstrap-icons-map, \"folder2\"); }\n.bi-fonts::before { content: map-get($bootstrap-icons-map, \"fonts\"); }\n.bi-forward-fill::before { content: map-get($bootstrap-icons-map, \"forward-fill\"); }\n.bi-forward::before { content: map-get($bootstrap-icons-map, \"forward\"); }\n.bi-front::before { content: map-get($bootstrap-icons-map, \"front\"); }\n.bi-fullscreen-exit::before { content: map-get($bootstrap-icons-map, \"fullscreen-exit\"); }\n.bi-fullscreen::before { content: map-get($bootstrap-icons-map, \"fullscreen\"); }\n.bi-funnel-fill::before { content: map-get($bootstrap-icons-map, \"funnel-fill\"); }\n.bi-funnel::before { content: map-get($bootstrap-icons-map, \"funnel\"); }\n.bi-gear-fill::before { content: map-get($bootstrap-icons-map, \"gear-fill\"); }\n.bi-gear-wide-connected::before { content: map-get($bootstrap-icons-map, \"gear-wide-connected\"); }\n.bi-gear-wide::before { content: map-get($bootstrap-icons-map, \"gear-wide\"); }\n.bi-gear::before { content: map-get($bootstrap-icons-map, \"gear\"); }\n.bi-gem::before { content: map-get($bootstrap-icons-map, \"gem\"); }\n.bi-geo-alt-fill::before { content: map-get($bootstrap-icons-map, \"geo-alt-fill\"); }\n.bi-geo-alt::before { content: map-get($bootstrap-icons-map, \"geo-alt\"); }\n.bi-geo-fill::before { content: map-get($bootstrap-icons-map, \"geo-fill\"); }\n.bi-geo::before { content: map-get($bootstrap-icons-map, \"geo\"); }\n.bi-gift-fill::before { content: map-get($bootstrap-icons-map, \"gift-fill\"); }\n.bi-gift::before { content: map-get($bootstrap-icons-map, \"gift\"); }\n.bi-github::before { content: map-get($bootstrap-icons-map, \"github\"); }\n.bi-globe::before { content: map-get($bootstrap-icons-map, \"globe\"); }\n.bi-globe2::before { content: map-get($bootstrap-icons-map, \"globe2\"); }\n.bi-google::before { content: map-get($bootstrap-icons-map, \"google\"); }\n.bi-graph-down::before { content: map-get($bootstrap-icons-map, \"graph-down\"); }\n.bi-graph-up::before { content: map-get($bootstrap-icons-map, \"graph-up\"); }\n.bi-grid-1x2-fill::before { content: map-get($bootstrap-icons-map, \"grid-1x2-fill\"); }\n.bi-grid-1x2::before { content: map-get($bootstrap-icons-map, \"grid-1x2\"); }\n.bi-grid-3x2-gap-fill::before { content: map-get($bootstrap-icons-map, \"grid-3x2-gap-fill\"); }\n.bi-grid-3x2-gap::before { content: map-get($bootstrap-icons-map, \"grid-3x2-gap\"); }\n.bi-grid-3x2::before { content: map-get($bootstrap-icons-map, \"grid-3x2\"); }\n.bi-grid-3x3-gap-fill::before { content: map-get($bootstrap-icons-map, \"grid-3x3-gap-fill\"); }\n.bi-grid-3x3-gap::before { content: map-get($bootstrap-icons-map, \"grid-3x3-gap\"); }\n.bi-grid-3x3::before { content: map-get($bootstrap-icons-map, \"grid-3x3\"); }\n.bi-grid-fill::before { content: map-get($bootstrap-icons-map, \"grid-fill\"); }\n.bi-grid::before { content: map-get($bootstrap-icons-map, \"grid\"); }\n.bi-grip-horizontal::before { content: map-get($bootstrap-icons-map, \"grip-horizontal\"); }\n.bi-grip-vertical::before { content: map-get($bootstrap-icons-map, \"grip-vertical\"); }\n.bi-hammer::before { content: map-get($bootstrap-icons-map, \"hammer\"); }\n.bi-hand-index-fill::before { content: map-get($bootstrap-icons-map, \"hand-index-fill\"); }\n.bi-hand-index-thumb-fill::before { content: map-get($bootstrap-icons-map, \"hand-index-thumb-fill\"); }\n.bi-hand-index-thumb::before { content: map-get($bootstrap-icons-map, \"hand-index-thumb\"); }\n.bi-hand-index::before { content: map-get($bootstrap-icons-map, \"hand-index\"); }\n.bi-hand-thumbs-down-fill::before { content: map-get($bootstrap-icons-map, \"hand-thumbs-down-fill\"); }\n.bi-hand-thumbs-down::before { content: map-get($bootstrap-icons-map, \"hand-thumbs-down\"); }\n.bi-hand-thumbs-up-fill::before { content: map-get($bootstrap-icons-map, \"hand-thumbs-up-fill\"); }\n.bi-hand-thumbs-up::before { content: map-get($bootstrap-icons-map, \"hand-thumbs-up\"); }\n.bi-handbag-fill::before { content: map-get($bootstrap-icons-map, \"handbag-fill\"); }\n.bi-handbag::before { content: map-get($bootstrap-icons-map, \"handbag\"); }\n.bi-hash::before { content: map-get($bootstrap-icons-map, \"hash\"); }\n.bi-hdd-fill::before { content: map-get($bootstrap-icons-map, \"hdd-fill\"); }\n.bi-hdd-network-fill::before { content: map-get($bootstrap-icons-map, \"hdd-network-fill\"); }\n.bi-hdd-network::before { content: map-get($bootstrap-icons-map, \"hdd-network\"); }\n.bi-hdd-rack-fill::before { content: map-get($bootstrap-icons-map, \"hdd-rack-fill\"); }\n.bi-hdd-rack::before { content: map-get($bootstrap-icons-map, \"hdd-rack\"); }\n.bi-hdd-stack-fill::before { content: map-get($bootstrap-icons-map, \"hdd-stack-fill\"); }\n.bi-hdd-stack::before { content: map-get($bootstrap-icons-map, \"hdd-stack\"); }\n.bi-hdd::before { content: map-get($bootstrap-icons-map, \"hdd\"); }\n.bi-headphones::before { content: map-get($bootstrap-icons-map, \"headphones\"); }\n.bi-headset::before { content: map-get($bootstrap-icons-map, \"headset\"); }\n.bi-heart-fill::before { content: map-get($bootstrap-icons-map, \"heart-fill\"); }\n.bi-heart-half::before { content: map-get($bootstrap-icons-map, \"heart-half\"); }\n.bi-heart::before { content: map-get($bootstrap-icons-map, \"heart\"); }\n.bi-heptagon-fill::before { content: map-get($bootstrap-icons-map, \"heptagon-fill\"); }\n.bi-heptagon-half::before { content: map-get($bootstrap-icons-map, \"heptagon-half\"); }\n.bi-heptagon::before { content: map-get($bootstrap-icons-map, \"heptagon\"); }\n.bi-hexagon-fill::before { content: map-get($bootstrap-icons-map, \"hexagon-fill\"); }\n.bi-hexagon-half::before { content: map-get($bootstrap-icons-map, \"hexagon-half\"); }\n.bi-hexagon::before { content: map-get($bootstrap-icons-map, \"hexagon\"); }\n.bi-hourglass-bottom::before { content: map-get($bootstrap-icons-map, \"hourglass-bottom\"); }\n.bi-hourglass-split::before { content: map-get($bootstrap-icons-map, \"hourglass-split\"); }\n.bi-hourglass-top::before { content: map-get($bootstrap-icons-map, \"hourglass-top\"); }\n.bi-hourglass::before { content: map-get($bootstrap-icons-map, \"hourglass\"); }\n.bi-house-door-fill::before { content: map-get($bootstrap-icons-map, \"house-door-fill\"); }\n.bi-house-door::before { content: map-get($bootstrap-icons-map, \"house-door\"); }\n.bi-house-fill::before { content: map-get($bootstrap-icons-map, \"house-fill\"); }\n.bi-house::before { content: map-get($bootstrap-icons-map, \"house\"); }\n.bi-hr::before { content: map-get($bootstrap-icons-map, \"hr\"); }\n.bi-hurricane::before { content: map-get($bootstrap-icons-map, \"hurricane\"); }\n.bi-image-alt::before { content: map-get($bootstrap-icons-map, \"image-alt\"); }\n.bi-image-fill::before { content: map-get($bootstrap-icons-map, \"image-fill\"); }\n.bi-image::before { content: map-get($bootstrap-icons-map, \"image\"); }\n.bi-images::before { content: map-get($bootstrap-icons-map, \"images\"); }\n.bi-inbox-fill::before { content: map-get($bootstrap-icons-map, \"inbox-fill\"); }\n.bi-inbox::before { content: map-get($bootstrap-icons-map, \"inbox\"); }\n.bi-inboxes-fill::before { content: map-get($bootstrap-icons-map, \"inboxes-fill\"); }\n.bi-inboxes::before { content: map-get($bootstrap-icons-map, \"inboxes\"); }\n.bi-info-circle-fill::before { content: map-get($bootstrap-icons-map, \"info-circle-fill\"); }\n.bi-info-circle::before { content: map-get($bootstrap-icons-map, \"info-circle\"); }\n.bi-info-square-fill::before { content: map-get($bootstrap-icons-map, \"info-square-fill\"); }\n.bi-info-square::before { content: map-get($bootstrap-icons-map, \"info-square\"); }\n.bi-info::before { content: map-get($bootstrap-icons-map, \"info\"); }\n.bi-input-cursor-text::before { content: map-get($bootstrap-icons-map, \"input-cursor-text\"); }\n.bi-input-cursor::before { content: map-get($bootstrap-icons-map, \"input-cursor\"); }\n.bi-instagram::before { content: map-get($bootstrap-icons-map, \"instagram\"); }\n.bi-intersect::before { content: map-get($bootstrap-icons-map, \"intersect\"); }\n.bi-journal-album::before { content: map-get($bootstrap-icons-map, \"journal-album\"); }\n.bi-journal-arrow-down::before { content: map-get($bootstrap-icons-map, \"journal-arrow-down\"); }\n.bi-journal-arrow-up::before { content: map-get($bootstrap-icons-map, \"journal-arrow-up\"); }\n.bi-journal-bookmark-fill::before { content: map-get($bootstrap-icons-map, \"journal-bookmark-fill\"); }\n.bi-journal-bookmark::before { content: map-get($bootstrap-icons-map, \"journal-bookmark\"); }\n.bi-journal-check::before { content: map-get($bootstrap-icons-map, \"journal-check\"); }\n.bi-journal-code::before { content: map-get($bootstrap-icons-map, \"journal-code\"); }\n.bi-journal-medical::before { content: map-get($bootstrap-icons-map, \"journal-medical\"); }\n.bi-journal-minus::before { content: map-get($bootstrap-icons-map, \"journal-minus\"); }\n.bi-journal-plus::before { content: map-get($bootstrap-icons-map, \"journal-plus\"); }\n.bi-journal-richtext::before { content: map-get($bootstrap-icons-map, \"journal-richtext\"); }\n.bi-journal-text::before { content: map-get($bootstrap-icons-map, \"journal-text\"); }\n.bi-journal-x::before { content: map-get($bootstrap-icons-map, \"journal-x\"); }\n.bi-journal::before { content: map-get($bootstrap-icons-map, \"journal\"); }\n.bi-journals::before { content: map-get($bootstrap-icons-map, \"journals\"); }\n.bi-joystick::before { content: map-get($bootstrap-icons-map, \"joystick\"); }\n.bi-justify-left::before { content: map-get($bootstrap-icons-map, \"justify-left\"); }\n.bi-justify-right::before { content: map-get($bootstrap-icons-map, \"justify-right\"); }\n.bi-justify::before { content: map-get($bootstrap-icons-map, \"justify\"); }\n.bi-kanban-fill::before { content: map-get($bootstrap-icons-map, \"kanban-fill\"); }\n.bi-kanban::before { content: map-get($bootstrap-icons-map, \"kanban\"); }\n.bi-key-fill::before { content: map-get($bootstrap-icons-map, \"key-fill\"); }\n.bi-key::before { content: map-get($bootstrap-icons-map, \"key\"); }\n.bi-keyboard-fill::before { content: map-get($bootstrap-icons-map, \"keyboard-fill\"); }\n.bi-keyboard::before { content: map-get($bootstrap-icons-map, \"keyboard\"); }\n.bi-ladder::before { content: map-get($bootstrap-icons-map, \"ladder\"); }\n.bi-lamp-fill::before { content: map-get($bootstrap-icons-map, \"lamp-fill\"); }\n.bi-lamp::before { content: map-get($bootstrap-icons-map, \"lamp\"); }\n.bi-laptop-fill::before { content: map-get($bootstrap-icons-map, \"laptop-fill\"); }\n.bi-laptop::before { content: map-get($bootstrap-icons-map, \"laptop\"); }\n.bi-layer-backward::before { content: map-get($bootstrap-icons-map, \"layer-backward\"); }\n.bi-layer-forward::before { content: map-get($bootstrap-icons-map, \"layer-forward\"); }\n.bi-layers-fill::before { content: map-get($bootstrap-icons-map, \"layers-fill\"); }\n.bi-layers-half::before { content: map-get($bootstrap-icons-map, \"layers-half\"); }\n.bi-layers::before { content: map-get($bootstrap-icons-map, \"layers\"); }\n.bi-layout-sidebar-inset-reverse::before { content: map-get($bootstrap-icons-map, \"layout-sidebar-inset-reverse\"); }\n.bi-layout-sidebar-inset::before { content: map-get($bootstrap-icons-map, \"layout-sidebar-inset\"); }\n.bi-layout-sidebar-reverse::before { content: map-get($bootstrap-icons-map, \"layout-sidebar-reverse\"); }\n.bi-layout-sidebar::before { content: map-get($bootstrap-icons-map, \"layout-sidebar\"); }\n.bi-layout-split::before { content: map-get($bootstrap-icons-map, \"layout-split\"); }\n.bi-layout-text-sidebar-reverse::before { content: map-get($bootstrap-icons-map, \"layout-text-sidebar-reverse\"); }\n.bi-layout-text-sidebar::before { content: map-get($bootstrap-icons-map, \"layout-text-sidebar\"); }\n.bi-layout-text-window-reverse::before { content: map-get($bootstrap-icons-map, \"layout-text-window-reverse\"); }\n.bi-layout-text-window::before { content: map-get($bootstrap-icons-map, \"layout-text-window\"); }\n.bi-layout-three-columns::before { content: map-get($bootstrap-icons-map, \"layout-three-columns\"); }\n.bi-layout-wtf::before { content: map-get($bootstrap-icons-map, \"layout-wtf\"); }\n.bi-life-preserver::before { content: map-get($bootstrap-icons-map, \"life-preserver\"); }\n.bi-lightbulb-fill::before { content: map-get($bootstrap-icons-map, \"lightbulb-fill\"); }\n.bi-lightbulb-off-fill::before { content: map-get($bootstrap-icons-map, \"lightbulb-off-fill\"); }\n.bi-lightbulb-off::before { content: map-get($bootstrap-icons-map, \"lightbulb-off\"); }\n.bi-lightbulb::before { content: map-get($bootstrap-icons-map, \"lightbulb\"); }\n.bi-lightning-charge-fill::before { content: map-get($bootstrap-icons-map, \"lightning-charge-fill\"); }\n.bi-lightning-charge::before { content: map-get($bootstrap-icons-map, \"lightning-charge\"); }\n.bi-lightning-fill::before { content: map-get($bootstrap-icons-map, \"lightning-fill\"); }\n.bi-lightning::before { content: map-get($bootstrap-icons-map, \"lightning\"); }\n.bi-link-45deg::before { content: map-get($bootstrap-icons-map, \"link-45deg\"); }\n.bi-link::before { content: map-get($bootstrap-icons-map, \"link\"); }\n.bi-linkedin::before { content: map-get($bootstrap-icons-map, \"linkedin\"); }\n.bi-list-check::before { content: map-get($bootstrap-icons-map, \"list-check\"); }\n.bi-list-nested::before { content: map-get($bootstrap-icons-map, \"list-nested\"); }\n.bi-list-ol::before { content: map-get($bootstrap-icons-map, \"list-ol\"); }\n.bi-list-stars::before { content: map-get($bootstrap-icons-map, \"list-stars\"); }\n.bi-list-task::before { content: map-get($bootstrap-icons-map, \"list-task\"); }\n.bi-list-ul::before { content: map-get($bootstrap-icons-map, \"list-ul\"); }\n.bi-list::before { content: map-get($bootstrap-icons-map, \"list\"); }\n.bi-lock-fill::before { content: map-get($bootstrap-icons-map, \"lock-fill\"); }\n.bi-lock::before { content: map-get($bootstrap-icons-map, \"lock\"); }\n.bi-mailbox::before { content: map-get($bootstrap-icons-map, \"mailbox\"); }\n.bi-mailbox2::before { content: map-get($bootstrap-icons-map, \"mailbox2\"); }\n.bi-map-fill::before { content: map-get($bootstrap-icons-map, \"map-fill\"); }\n.bi-map::before { content: map-get($bootstrap-icons-map, \"map\"); }\n.bi-markdown-fill::before { content: map-get($bootstrap-icons-map, \"markdown-fill\"); }\n.bi-markdown::before { content: map-get($bootstrap-icons-map, \"markdown\"); }\n.bi-mask::before { content: map-get($bootstrap-icons-map, \"mask\"); }\n.bi-megaphone-fill::before { content: map-get($bootstrap-icons-map, \"megaphone-fill\"); }\n.bi-megaphone::before { content: map-get($bootstrap-icons-map, \"megaphone\"); }\n.bi-menu-app-fill::before { content: map-get($bootstrap-icons-map, \"menu-app-fill\"); }\n.bi-menu-app::before { content: map-get($bootstrap-icons-map, \"menu-app\"); }\n.bi-menu-button-fill::before { content: map-get($bootstrap-icons-map, \"menu-button-fill\"); }\n.bi-menu-button-wide-fill::before { content: map-get($bootstrap-icons-map, \"menu-button-wide-fill\"); }\n.bi-menu-button-wide::before { content: map-get($bootstrap-icons-map, \"menu-button-wide\"); }\n.bi-menu-button::before { content: map-get($bootstrap-icons-map, \"menu-button\"); }\n.bi-menu-down::before { content: map-get($bootstrap-icons-map, \"menu-down\"); }\n.bi-menu-up::before { content: map-get($bootstrap-icons-map, \"menu-up\"); }\n.bi-mic-fill::before { content: map-get($bootstrap-icons-map, \"mic-fill\"); }\n.bi-mic-mute-fill::before { content: map-get($bootstrap-icons-map, \"mic-mute-fill\"); }\n.bi-mic-mute::before { content: map-get($bootstrap-icons-map, \"mic-mute\"); }\n.bi-mic::before { content: map-get($bootstrap-icons-map, \"mic\"); }\n.bi-minecart-loaded::before { content: map-get($bootstrap-icons-map, \"minecart-loaded\"); }\n.bi-minecart::before { content: map-get($bootstrap-icons-map, \"minecart\"); }\n.bi-moisture::before { content: map-get($bootstrap-icons-map, \"moisture\"); }\n.bi-moon-fill::before { content: map-get($bootstrap-icons-map, \"moon-fill\"); }\n.bi-moon-stars-fill::before { content: map-get($bootstrap-icons-map, \"moon-stars-fill\"); }\n.bi-moon-stars::before { content: map-get($bootstrap-icons-map, \"moon-stars\"); }\n.bi-moon::before { content: map-get($bootstrap-icons-map, \"moon\"); }\n.bi-mouse-fill::before { content: map-get($bootstrap-icons-map, \"mouse-fill\"); }\n.bi-mouse::before { content: map-get($bootstrap-icons-map, \"mouse\"); }\n.bi-mouse2-fill::before { content: map-get($bootstrap-icons-map, \"mouse2-fill\"); }\n.bi-mouse2::before { content: map-get($bootstrap-icons-map, \"mouse2\"); }\n.bi-mouse3-fill::before { content: map-get($bootstrap-icons-map, \"mouse3-fill\"); }\n.bi-mouse3::before { content: map-get($bootstrap-icons-map, \"mouse3\"); }\n.bi-music-note-beamed::before { content: map-get($bootstrap-icons-map, \"music-note-beamed\"); }\n.bi-music-note-list::before { content: map-get($bootstrap-icons-map, \"music-note-list\"); }\n.bi-music-note::before { content: map-get($bootstrap-icons-map, \"music-note\"); }\n.bi-music-player-fill::before { content: map-get($bootstrap-icons-map, \"music-player-fill\"); }\n.bi-music-player::before { content: map-get($bootstrap-icons-map, \"music-player\"); }\n.bi-newspaper::before { content: map-get($bootstrap-icons-map, \"newspaper\"); }\n.bi-node-minus-fill::before { content: map-get($bootstrap-icons-map, \"node-minus-fill\"); }\n.bi-node-minus::before { content: map-get($bootstrap-icons-map, \"node-minus\"); }\n.bi-node-plus-fill::before { content: map-get($bootstrap-icons-map, \"node-plus-fill\"); }\n.bi-node-plus::before { content: map-get($bootstrap-icons-map, \"node-plus\"); }\n.bi-nut-fill::before { content: map-get($bootstrap-icons-map, \"nut-fill\"); }\n.bi-nut::before { content: map-get($bootstrap-icons-map, \"nut\"); }\n.bi-octagon-fill::before { content: map-get($bootstrap-icons-map, \"octagon-fill\"); }\n.bi-octagon-half::before { content: map-get($bootstrap-icons-map, \"octagon-half\"); }\n.bi-octagon::before { content: map-get($bootstrap-icons-map, \"octagon\"); }\n.bi-option::before { content: map-get($bootstrap-icons-map, \"option\"); }\n.bi-outlet::before { content: map-get($bootstrap-icons-map, \"outlet\"); }\n.bi-paint-bucket::before { content: map-get($bootstrap-icons-map, \"paint-bucket\"); }\n.bi-palette-fill::before { content: map-get($bootstrap-icons-map, \"palette-fill\"); }\n.bi-palette::before { content: map-get($bootstrap-icons-map, \"palette\"); }\n.bi-palette2::before { content: map-get($bootstrap-icons-map, \"palette2\"); }\n.bi-paperclip::before { content: map-get($bootstrap-icons-map, \"paperclip\"); }\n.bi-paragraph::before { content: map-get($bootstrap-icons-map, \"paragraph\"); }\n.bi-patch-check-fill::before { content: map-get($bootstrap-icons-map, \"patch-check-fill\"); }\n.bi-patch-check::before { content: map-get($bootstrap-icons-map, \"patch-check\"); }\n.bi-patch-exclamation-fill::before { content: map-get($bootstrap-icons-map, \"patch-exclamation-fill\"); }\n.bi-patch-exclamation::before { content: map-get($bootstrap-icons-map, \"patch-exclamation\"); }\n.bi-patch-minus-fill::before { content: map-get($bootstrap-icons-map, \"patch-minus-fill\"); }\n.bi-patch-minus::before { content: map-get($bootstrap-icons-map, \"patch-minus\"); }\n.bi-patch-plus-fill::before { content: map-get($bootstrap-icons-map, \"patch-plus-fill\"); }\n.bi-patch-plus::before { content: map-get($bootstrap-icons-map, \"patch-plus\"); }\n.bi-patch-question-fill::before { content: map-get($bootstrap-icons-map, \"patch-question-fill\"); }\n.bi-patch-question::before { content: map-get($bootstrap-icons-map, \"patch-question\"); }\n.bi-pause-btn-fill::before { content: map-get($bootstrap-icons-map, \"pause-btn-fill\"); }\n.bi-pause-btn::before { content: map-get($bootstrap-icons-map, \"pause-btn\"); }\n.bi-pause-circle-fill::before { content: map-get($bootstrap-icons-map, \"pause-circle-fill\"); }\n.bi-pause-circle::before { content: map-get($bootstrap-icons-map, \"pause-circle\"); }\n.bi-pause-fill::before { content: map-get($bootstrap-icons-map, \"pause-fill\"); }\n.bi-pause::before { content: map-get($bootstrap-icons-map, \"pause\"); }\n.bi-peace-fill::before { content: map-get($bootstrap-icons-map, \"peace-fill\"); }\n.bi-peace::before { content: map-get($bootstrap-icons-map, \"peace\"); }\n.bi-pen-fill::before { content: map-get($bootstrap-icons-map, \"pen-fill\"); }\n.bi-pen::before { content: map-get($bootstrap-icons-map, \"pen\"); }\n.bi-pencil-fill::before { content: map-get($bootstrap-icons-map, \"pencil-fill\"); }\n.bi-pencil-square::before { content: map-get($bootstrap-icons-map, \"pencil-square\"); }\n.bi-pencil::before { content: map-get($bootstrap-icons-map, \"pencil\"); }\n.bi-pentagon-fill::before { content: map-get($bootstrap-icons-map, \"pentagon-fill\"); }\n.bi-pentagon-half::before { content: map-get($bootstrap-icons-map, \"pentagon-half\"); }\n.bi-pentagon::before { content: map-get($bootstrap-icons-map, \"pentagon\"); }\n.bi-people-fill::before { content: map-get($bootstrap-icons-map, \"people-fill\"); }\n.bi-people::before { content: map-get($bootstrap-icons-map, \"people\"); }\n.bi-percent::before { content: map-get($bootstrap-icons-map, \"percent\"); }\n.bi-person-badge-fill::before { content: map-get($bootstrap-icons-map, \"person-badge-fill\"); }\n.bi-person-badge::before { content: map-get($bootstrap-icons-map, \"person-badge\"); }\n.bi-person-bounding-box::before { content: map-get($bootstrap-icons-map, \"person-bounding-box\"); }\n.bi-person-check-fill::before { content: map-get($bootstrap-icons-map, \"person-check-fill\"); }\n.bi-person-check::before { content: map-get($bootstrap-icons-map, \"person-check\"); }\n.bi-person-circle::before { content: map-get($bootstrap-icons-map, \"person-circle\"); }\n.bi-person-dash-fill::before { content: map-get($bootstrap-icons-map, \"person-dash-fill\"); }\n.bi-person-dash::before { content: map-get($bootstrap-icons-map, \"person-dash\"); }\n.bi-person-fill::before { content: map-get($bootstrap-icons-map, \"person-fill\"); }\n.bi-person-lines-fill::before { content: map-get($bootstrap-icons-map, \"person-lines-fill\"); }\n.bi-person-plus-fill::before { content: map-get($bootstrap-icons-map, \"person-plus-fill\"); }\n.bi-person-plus::before { content: map-get($bootstrap-icons-map, \"person-plus\"); }\n.bi-person-square::before { content: map-get($bootstrap-icons-map, \"person-square\"); }\n.bi-person-x-fill::before { content: map-get($bootstrap-icons-map, \"person-x-fill\"); }\n.bi-person-x::before { content: map-get($bootstrap-icons-map, \"person-x\"); }\n.bi-person::before { content: map-get($bootstrap-icons-map, \"person\"); }\n.bi-phone-fill::before { content: map-get($bootstrap-icons-map, \"phone-fill\"); }\n.bi-phone-landscape-fill::before { content: map-get($bootstrap-icons-map, \"phone-landscape-fill\"); }\n.bi-phone-landscape::before { content: map-get($bootstrap-icons-map, \"phone-landscape\"); }\n.bi-phone-vibrate-fill::before { content: map-get($bootstrap-icons-map, \"phone-vibrate-fill\"); }\n.bi-phone-vibrate::before { content: map-get($bootstrap-icons-map, \"phone-vibrate\"); }\n.bi-phone::before { content: map-get($bootstrap-icons-map, \"phone\"); }\n.bi-pie-chart-fill::before { content: map-get($bootstrap-icons-map, \"pie-chart-fill\"); }\n.bi-pie-chart::before { content: map-get($bootstrap-icons-map, \"pie-chart\"); }\n.bi-pin-angle-fill::before { content: map-get($bootstrap-icons-map, \"pin-angle-fill\"); }\n.bi-pin-angle::before { content: map-get($bootstrap-icons-map, \"pin-angle\"); }\n.bi-pin-fill::before { content: map-get($bootstrap-icons-map, \"pin-fill\"); }\n.bi-pin::before { content: map-get($bootstrap-icons-map, \"pin\"); }\n.bi-pip-fill::before { content: map-get($bootstrap-icons-map, \"pip-fill\"); }\n.bi-pip::before { content: map-get($bootstrap-icons-map, \"pip\"); }\n.bi-play-btn-fill::before { content: map-get($bootstrap-icons-map, \"play-btn-fill\"); }\n.bi-play-btn::before { content: map-get($bootstrap-icons-map, \"play-btn\"); }\n.bi-play-circle-fill::before { content: map-get($bootstrap-icons-map, \"play-circle-fill\"); }\n.bi-play-circle::before { content: map-get($bootstrap-icons-map, \"play-circle\"); }\n.bi-play-fill::before { content: map-get($bootstrap-icons-map, \"play-fill\"); }\n.bi-play::before { content: map-get($bootstrap-icons-map, \"play\"); }\n.bi-plug-fill::before { content: map-get($bootstrap-icons-map, \"plug-fill\"); }\n.bi-plug::before { content: map-get($bootstrap-icons-map, \"plug\"); }\n.bi-plus-circle-dotted::before { content: map-get($bootstrap-icons-map, \"plus-circle-dotted\"); }\n.bi-plus-circle-fill::before { content: map-get($bootstrap-icons-map, \"plus-circle-fill\"); }\n.bi-plus-circle::before { content: map-get($bootstrap-icons-map, \"plus-circle\"); }\n.bi-plus-square-dotted::before { content: map-get($bootstrap-icons-map, \"plus-square-dotted\"); }\n.bi-plus-square-fill::before { content: map-get($bootstrap-icons-map, \"plus-square-fill\"); }\n.bi-plus-square::before { content: map-get($bootstrap-icons-map, \"plus-square\"); }\n.bi-plus::before { content: map-get($bootstrap-icons-map, \"plus\"); }\n.bi-power::before { content: map-get($bootstrap-icons-map, \"power\"); }\n.bi-printer-fill::before { content: map-get($bootstrap-icons-map, \"printer-fill\"); }\n.bi-printer::before { content: map-get($bootstrap-icons-map, \"printer\"); }\n.bi-puzzle-fill::before { content: map-get($bootstrap-icons-map, \"puzzle-fill\"); }\n.bi-puzzle::before { content: map-get($bootstrap-icons-map, \"puzzle\"); }\n.bi-question-circle-fill::before { content: map-get($bootstrap-icons-map, \"question-circle-fill\"); }\n.bi-question-circle::before { content: map-get($bootstrap-icons-map, \"question-circle\"); }\n.bi-question-diamond-fill::before { content: map-get($bootstrap-icons-map, \"question-diamond-fill\"); }\n.bi-question-diamond::before { content: map-get($bootstrap-icons-map, \"question-diamond\"); }\n.bi-question-octagon-fill::before { content: map-get($bootstrap-icons-map, \"question-octagon-fill\"); }\n.bi-question-octagon::before { content: map-get($bootstrap-icons-map, \"question-octagon\"); }\n.bi-question-square-fill::before { content: map-get($bootstrap-icons-map, \"question-square-fill\"); }\n.bi-question-square::before { content: map-get($bootstrap-icons-map, \"question-square\"); }\n.bi-question::before { content: map-get($bootstrap-icons-map, \"question\"); }\n.bi-rainbow::before { content: map-get($bootstrap-icons-map, \"rainbow\"); }\n.bi-receipt-cutoff::before { content: map-get($bootstrap-icons-map, \"receipt-cutoff\"); }\n.bi-receipt::before { content: map-get($bootstrap-icons-map, \"receipt\"); }\n.bi-reception-0::before { content: map-get($bootstrap-icons-map, \"reception-0\"); }\n.bi-reception-1::before { content: map-get($bootstrap-icons-map, \"reception-1\"); }\n.bi-reception-2::before { content: map-get($bootstrap-icons-map, \"reception-2\"); }\n.bi-reception-3::before { content: map-get($bootstrap-icons-map, \"reception-3\"); }\n.bi-reception-4::before { content: map-get($bootstrap-icons-map, \"reception-4\"); }\n.bi-record-btn-fill::before { content: map-get($bootstrap-icons-map, \"record-btn-fill\"); }\n.bi-record-btn::before { content: map-get($bootstrap-icons-map, \"record-btn\"); }\n.bi-record-circle-fill::before { content: map-get($bootstrap-icons-map, \"record-circle-fill\"); }\n.bi-record-circle::before { content: map-get($bootstrap-icons-map, \"record-circle\"); }\n.bi-record-fill::before { content: map-get($bootstrap-icons-map, \"record-fill\"); }\n.bi-record::before { content: map-get($bootstrap-icons-map, \"record\"); }\n.bi-record2-fill::before { content: map-get($bootstrap-icons-map, \"record2-fill\"); }\n.bi-record2::before { content: map-get($bootstrap-icons-map, \"record2\"); }\n.bi-reply-all-fill::before { content: map-get($bootstrap-icons-map, \"reply-all-fill\"); }\n.bi-reply-all::before { content: map-get($bootstrap-icons-map, \"reply-all\"); }\n.bi-reply-fill::before { content: map-get($bootstrap-icons-map, \"reply-fill\"); }\n.bi-reply::before { content: map-get($bootstrap-icons-map, \"reply\"); }\n.bi-rss-fill::before { content: map-get($bootstrap-icons-map, \"rss-fill\"); }\n.bi-rss::before { content: map-get($bootstrap-icons-map, \"rss\"); }\n.bi-rulers::before { content: map-get($bootstrap-icons-map, \"rulers\"); }\n.bi-save-fill::before { content: map-get($bootstrap-icons-map, \"save-fill\"); }\n.bi-save::before { content: map-get($bootstrap-icons-map, \"save\"); }\n.bi-save2-fill::before { content: map-get($bootstrap-icons-map, \"save2-fill\"); }\n.bi-save2::before { content: map-get($bootstrap-icons-map, \"save2\"); }\n.bi-scissors::before { content: map-get($bootstrap-icons-map, \"scissors\"); }\n.bi-screwdriver::before { content: map-get($bootstrap-icons-map, \"screwdriver\"); }\n.bi-search::before { content: map-get($bootstrap-icons-map, \"search\"); }\n.bi-segmented-nav::before { content: map-get($bootstrap-icons-map, \"segmented-nav\"); }\n.bi-server::before { content: map-get($bootstrap-icons-map, \"server\"); }\n.bi-share-fill::before { content: map-get($bootstrap-icons-map, \"share-fill\"); }\n.bi-share::before { content: map-get($bootstrap-icons-map, \"share\"); }\n.bi-shield-check::before { content: map-get($bootstrap-icons-map, \"shield-check\"); }\n.bi-shield-exclamation::before { content: map-get($bootstrap-icons-map, \"shield-exclamation\"); }\n.bi-shield-fill-check::before { content: map-get($bootstrap-icons-map, \"shield-fill-check\"); }\n.bi-shield-fill-exclamation::before { content: map-get($bootstrap-icons-map, \"shield-fill-exclamation\"); }\n.bi-shield-fill-minus::before { content: map-get($bootstrap-icons-map, \"shield-fill-minus\"); }\n.bi-shield-fill-plus::before { content: map-get($bootstrap-icons-map, \"shield-fill-plus\"); }\n.bi-shield-fill-x::before { content: map-get($bootstrap-icons-map, \"shield-fill-x\"); }\n.bi-shield-fill::before { content: map-get($bootstrap-icons-map, \"shield-fill\"); }\n.bi-shield-lock-fill::before { content: map-get($bootstrap-icons-map, \"shield-lock-fill\"); }\n.bi-shield-lock::before { content: map-get($bootstrap-icons-map, \"shield-lock\"); }\n.bi-shield-minus::before { content: map-get($bootstrap-icons-map, \"shield-minus\"); }\n.bi-shield-plus::before { content: map-get($bootstrap-icons-map, \"shield-plus\"); }\n.bi-shield-shaded::before { content: map-get($bootstrap-icons-map, \"shield-shaded\"); }\n.bi-shield-slash-fill::before { content: map-get($bootstrap-icons-map, \"shield-slash-fill\"); }\n.bi-shield-slash::before { content: map-get($bootstrap-icons-map, \"shield-slash\"); }\n.bi-shield-x::before { content: map-get($bootstrap-icons-map, \"shield-x\"); }\n.bi-shield::before { content: map-get($bootstrap-icons-map, \"shield\"); }\n.bi-shift-fill::before { content: map-get($bootstrap-icons-map, \"shift-fill\"); }\n.bi-shift::before { content: map-get($bootstrap-icons-map, \"shift\"); }\n.bi-shop-window::before { content: map-get($bootstrap-icons-map, \"shop-window\"); }\n.bi-shop::before { content: map-get($bootstrap-icons-map, \"shop\"); }\n.bi-shuffle::before { content: map-get($bootstrap-icons-map, \"shuffle\"); }\n.bi-signpost-2-fill::before { content: map-get($bootstrap-icons-map, \"signpost-2-fill\"); }\n.bi-signpost-2::before { content: map-get($bootstrap-icons-map, \"signpost-2\"); }\n.bi-signpost-fill::before { content: map-get($bootstrap-icons-map, \"signpost-fill\"); }\n.bi-signpost-split-fill::before { content: map-get($bootstrap-icons-map, \"signpost-split-fill\"); }\n.bi-signpost-split::before { content: map-get($bootstrap-icons-map, \"signpost-split\"); }\n.bi-signpost::before { content: map-get($bootstrap-icons-map, \"signpost\"); }\n.bi-sim-fill::before { content: map-get($bootstrap-icons-map, \"sim-fill\"); }\n.bi-sim::before { content: map-get($bootstrap-icons-map, \"sim\"); }\n.bi-skip-backward-btn-fill::before { content: map-get($bootstrap-icons-map, \"skip-backward-btn-fill\"); }\n.bi-skip-backward-btn::before { content: map-get($bootstrap-icons-map, \"skip-backward-btn\"); }\n.bi-skip-backward-circle-fill::before { content: map-get($bootstrap-icons-map, \"skip-backward-circle-fill\"); }\n.bi-skip-backward-circle::before { content: map-get($bootstrap-icons-map, \"skip-backward-circle\"); }\n.bi-skip-backward-fill::before { content: map-get($bootstrap-icons-map, \"skip-backward-fill\"); }\n.bi-skip-backward::before { content: map-get($bootstrap-icons-map, \"skip-backward\"); }\n.bi-skip-end-btn-fill::before { content: map-get($bootstrap-icons-map, \"skip-end-btn-fill\"); }\n.bi-skip-end-btn::before { content: map-get($bootstrap-icons-map, \"skip-end-btn\"); }\n.bi-skip-end-circle-fill::before { content: map-get($bootstrap-icons-map, \"skip-end-circle-fill\"); }\n.bi-skip-end-circle::before { content: map-get($bootstrap-icons-map, \"skip-end-circle\"); }\n.bi-skip-end-fill::before { content: map-get($bootstrap-icons-map, \"skip-end-fill\"); }\n.bi-skip-end::before { content: map-get($bootstrap-icons-map, \"skip-end\"); }\n.bi-skip-forward-btn-fill::before { content: map-get($bootstrap-icons-map, \"skip-forward-btn-fill\"); }\n.bi-skip-forward-btn::before { content: map-get($bootstrap-icons-map, \"skip-forward-btn\"); }\n.bi-skip-forward-circle-fill::before { content: map-get($bootstrap-icons-map, \"skip-forward-circle-fill\"); }\n.bi-skip-forward-circle::before { content: map-get($bootstrap-icons-map, \"skip-forward-circle\"); }\n.bi-skip-forward-fill::before { content: map-get($bootstrap-icons-map, \"skip-forward-fill\"); }\n.bi-skip-forward::before { content: map-get($bootstrap-icons-map, \"skip-forward\"); }\n.bi-skip-start-btn-fill::before { content: map-get($bootstrap-icons-map, \"skip-start-btn-fill\"); }\n.bi-skip-start-btn::before { content: map-get($bootstrap-icons-map, \"skip-start-btn\"); }\n.bi-skip-start-circle-fill::before { content: map-get($bootstrap-icons-map, \"skip-start-circle-fill\"); }\n.bi-skip-start-circle::before { content: map-get($bootstrap-icons-map, \"skip-start-circle\"); }\n.bi-skip-start-fill::before { content: map-get($bootstrap-icons-map, \"skip-start-fill\"); }\n.bi-skip-start::before { content: map-get($bootstrap-icons-map, \"skip-start\"); }\n.bi-slack::before { content: map-get($bootstrap-icons-map, \"slack\"); }\n.bi-slash-circle-fill::before { content: map-get($bootstrap-icons-map, \"slash-circle-fill\"); }\n.bi-slash-circle::before { content: map-get($bootstrap-icons-map, \"slash-circle\"); }\n.bi-slash-square-fill::before { content: map-get($bootstrap-icons-map, \"slash-square-fill\"); }\n.bi-slash-square::before { content: map-get($bootstrap-icons-map, \"slash-square\"); }\n.bi-slash::before { content: map-get($bootstrap-icons-map, \"slash\"); }\n.bi-sliders::before { content: map-get($bootstrap-icons-map, \"sliders\"); }\n.bi-smartwatch::before { content: map-get($bootstrap-icons-map, \"smartwatch\"); }\n.bi-snow::before { content: map-get($bootstrap-icons-map, \"snow\"); }\n.bi-snow2::before { content: map-get($bootstrap-icons-map, \"snow2\"); }\n.bi-snow3::before { content: map-get($bootstrap-icons-map, \"snow3\"); }\n.bi-sort-alpha-down-alt::before { content: map-get($bootstrap-icons-map, \"sort-alpha-down-alt\"); }\n.bi-sort-alpha-down::before { content: map-get($bootstrap-icons-map, \"sort-alpha-down\"); }\n.bi-sort-alpha-up-alt::before { content: map-get($bootstrap-icons-map, \"sort-alpha-up-alt\"); }\n.bi-sort-alpha-up::before { content: map-get($bootstrap-icons-map, \"sort-alpha-up\"); }\n.bi-sort-down-alt::before { content: map-get($bootstrap-icons-map, \"sort-down-alt\"); }\n.bi-sort-down::before { content: map-get($bootstrap-icons-map, \"sort-down\"); }\n.bi-sort-numeric-down-alt::before { content: map-get($bootstrap-icons-map, \"sort-numeric-down-alt\"); }\n.bi-sort-numeric-down::before { content: map-get($bootstrap-icons-map, \"sort-numeric-down\"); }\n.bi-sort-numeric-up-alt::before { content: map-get($bootstrap-icons-map, \"sort-numeric-up-alt\"); }\n.bi-sort-numeric-up::before { content: map-get($bootstrap-icons-map, \"sort-numeric-up\"); }\n.bi-sort-up-alt::before { content: map-get($bootstrap-icons-map, \"sort-up-alt\"); }\n.bi-sort-up::before { content: map-get($bootstrap-icons-map, \"sort-up\"); }\n.bi-soundwave::before { content: map-get($bootstrap-icons-map, \"soundwave\"); }\n.bi-speaker-fill::before { content: map-get($bootstrap-icons-map, \"speaker-fill\"); }\n.bi-speaker::before { content: map-get($bootstrap-icons-map, \"speaker\"); }\n.bi-speedometer::before { content: map-get($bootstrap-icons-map, \"speedometer\"); }\n.bi-speedometer2::before { content: map-get($bootstrap-icons-map, \"speedometer2\"); }\n.bi-spellcheck::before { content: map-get($bootstrap-icons-map, \"spellcheck\"); }\n.bi-square-fill::before { content: map-get($bootstrap-icons-map, \"square-fill\"); }\n.bi-square-half::before { content: map-get($bootstrap-icons-map, \"square-half\"); }\n.bi-square::before { content: map-get($bootstrap-icons-map, \"square\"); }\n.bi-stack::before { content: map-get($bootstrap-icons-map, \"stack\"); }\n.bi-star-fill::before { content: map-get($bootstrap-icons-map, \"star-fill\"); }\n.bi-star-half::before { content: map-get($bootstrap-icons-map, \"star-half\"); }\n.bi-star::before { content: map-get($bootstrap-icons-map, \"star\"); }\n.bi-stars::before { content: map-get($bootstrap-icons-map, \"stars\"); }\n.bi-stickies-fill::before { content: map-get($bootstrap-icons-map, \"stickies-fill\"); }\n.bi-stickies::before { content: map-get($bootstrap-icons-map, \"stickies\"); }\n.bi-sticky-fill::before { content: map-get($bootstrap-icons-map, \"sticky-fill\"); }\n.bi-sticky::before { content: map-get($bootstrap-icons-map, \"sticky\"); }\n.bi-stop-btn-fill::before { content: map-get($bootstrap-icons-map, \"stop-btn-fill\"); }\n.bi-stop-btn::before { content: map-get($bootstrap-icons-map, \"stop-btn\"); }\n.bi-stop-circle-fill::before { content: map-get($bootstrap-icons-map, \"stop-circle-fill\"); }\n.bi-stop-circle::before { content: map-get($bootstrap-icons-map, \"stop-circle\"); }\n.bi-stop-fill::before { content: map-get($bootstrap-icons-map, \"stop-fill\"); }\n.bi-stop::before { content: map-get($bootstrap-icons-map, \"stop\"); }\n.bi-stoplights-fill::before { content: map-get($bootstrap-icons-map, \"stoplights-fill\"); }\n.bi-stoplights::before { content: map-get($bootstrap-icons-map, \"stoplights\"); }\n.bi-stopwatch-fill::before { content: map-get($bootstrap-icons-map, \"stopwatch-fill\"); }\n.bi-stopwatch::before { content: map-get($bootstrap-icons-map, \"stopwatch\"); }\n.bi-subtract::before { content: map-get($bootstrap-icons-map, \"subtract\"); }\n.bi-suit-club-fill::before { content: map-get($bootstrap-icons-map, \"suit-club-fill\"); }\n.bi-suit-club::before { content: map-get($bootstrap-icons-map, \"suit-club\"); }\n.bi-suit-diamond-fill::before { content: map-get($bootstrap-icons-map, \"suit-diamond-fill\"); }\n.bi-suit-diamond::before { content: map-get($bootstrap-icons-map, \"suit-diamond\"); }\n.bi-suit-heart-fill::before { content: map-get($bootstrap-icons-map, \"suit-heart-fill\"); }\n.bi-suit-heart::before { content: map-get($bootstrap-icons-map, \"suit-heart\"); }\n.bi-suit-spade-fill::before { content: map-get($bootstrap-icons-map, \"suit-spade-fill\"); }\n.bi-suit-spade::before { content: map-get($bootstrap-icons-map, \"suit-spade\"); }\n.bi-sun-fill::before { content: map-get($bootstrap-icons-map, \"sun-fill\"); }\n.bi-sun::before { content: map-get($bootstrap-icons-map, \"sun\"); }\n.bi-sunglasses::before { content: map-get($bootstrap-icons-map, \"sunglasses\"); }\n.bi-sunrise-fill::before { content: map-get($bootstrap-icons-map, \"sunrise-fill\"); }\n.bi-sunrise::before { content: map-get($bootstrap-icons-map, \"sunrise\"); }\n.bi-sunset-fill::before { content: map-get($bootstrap-icons-map, \"sunset-fill\"); }\n.bi-sunset::before { content: map-get($bootstrap-icons-map, \"sunset\"); }\n.bi-symmetry-horizontal::before { content: map-get($bootstrap-icons-map, \"symmetry-horizontal\"); }\n.bi-symmetry-vertical::before { content: map-get($bootstrap-icons-map, \"symmetry-vertical\"); }\n.bi-table::before { content: map-get($bootstrap-icons-map, \"table\"); }\n.bi-tablet-fill::before { content: map-get($bootstrap-icons-map, \"tablet-fill\"); }\n.bi-tablet-landscape-fill::before { content: map-get($bootstrap-icons-map, \"tablet-landscape-fill\"); }\n.bi-tablet-landscape::before { content: map-get($bootstrap-icons-map, \"tablet-landscape\"); }\n.bi-tablet::before { content: map-get($bootstrap-icons-map, \"tablet\"); }\n.bi-tag-fill::before { content: map-get($bootstrap-icons-map, \"tag-fill\"); }\n.bi-tag::before { content: map-get($bootstrap-icons-map, \"tag\"); }\n.bi-tags-fill::before { content: map-get($bootstrap-icons-map, \"tags-fill\"); }\n.bi-tags::before { content: map-get($bootstrap-icons-map, \"tags\"); }\n.bi-telegram::before { content: map-get($bootstrap-icons-map, \"telegram\"); }\n.bi-telephone-fill::before { content: map-get($bootstrap-icons-map, \"telephone-fill\"); }\n.bi-telephone-forward-fill::before { content: map-get($bootstrap-icons-map, \"telephone-forward-fill\"); }\n.bi-telephone-forward::before { content: map-get($bootstrap-icons-map, \"telephone-forward\"); }\n.bi-telephone-inbound-fill::before { content: map-get($bootstrap-icons-map, \"telephone-inbound-fill\"); }\n.bi-telephone-inbound::before { content: map-get($bootstrap-icons-map, \"telephone-inbound\"); }\n.bi-telephone-minus-fill::before { content: map-get($bootstrap-icons-map, \"telephone-minus-fill\"); }\n.bi-telephone-minus::before { content: map-get($bootstrap-icons-map, \"telephone-minus\"); }\n.bi-telephone-outbound-fill::before { content: map-get($bootstrap-icons-map, \"telephone-outbound-fill\"); }\n.bi-telephone-outbound::before { content: map-get($bootstrap-icons-map, \"telephone-outbound\"); }\n.bi-telephone-plus-fill::before { content: map-get($bootstrap-icons-map, \"telephone-plus-fill\"); }\n.bi-telephone-plus::before { content: map-get($bootstrap-icons-map, \"telephone-plus\"); }\n.bi-telephone-x-fill::before { content: map-get($bootstrap-icons-map, \"telephone-x-fill\"); }\n.bi-telephone-x::before { content: map-get($bootstrap-icons-map, \"telephone-x\"); }\n.bi-telephone::before { content: map-get($bootstrap-icons-map, \"telephone\"); }\n.bi-terminal-fill::before { content: map-get($bootstrap-icons-map, \"terminal-fill\"); }\n.bi-terminal::before { content: map-get($bootstrap-icons-map, \"terminal\"); }\n.bi-text-center::before { content: map-get($bootstrap-icons-map, \"text-center\"); }\n.bi-text-indent-left::before { content: map-get($bootstrap-icons-map, \"text-indent-left\"); }\n.bi-text-indent-right::before { content: map-get($bootstrap-icons-map, \"text-indent-right\"); }\n.bi-text-left::before { content: map-get($bootstrap-icons-map, \"text-left\"); }\n.bi-text-paragraph::before { content: map-get($bootstrap-icons-map, \"text-paragraph\"); }\n.bi-text-right::before { content: map-get($bootstrap-icons-map, \"text-right\"); }\n.bi-textarea-resize::before { content: map-get($bootstrap-icons-map, \"textarea-resize\"); }\n.bi-textarea-t::before { content: map-get($bootstrap-icons-map, \"textarea-t\"); }\n.bi-textarea::before { content: map-get($bootstrap-icons-map, \"textarea\"); }\n.bi-thermometer-half::before { content: map-get($bootstrap-icons-map, \"thermometer-half\"); }\n.bi-thermometer-high::before { content: map-get($bootstrap-icons-map, \"thermometer-high\"); }\n.bi-thermometer-low::before { content: map-get($bootstrap-icons-map, \"thermometer-low\"); }\n.bi-thermometer-snow::before { content: map-get($bootstrap-icons-map, \"thermometer-snow\"); }\n.bi-thermometer-sun::before { content: map-get($bootstrap-icons-map, \"thermometer-sun\"); }\n.bi-thermometer::before { content: map-get($bootstrap-icons-map, \"thermometer\"); }\n.bi-three-dots-vertical::before { content: map-get($bootstrap-icons-map, \"three-dots-vertical\"); }\n.bi-three-dots::before { content: map-get($bootstrap-icons-map, \"three-dots\"); }\n.bi-toggle-off::before { content: map-get($bootstrap-icons-map, \"toggle-off\"); }\n.bi-toggle-on::before { content: map-get($bootstrap-icons-map, \"toggle-on\"); }\n.bi-toggle2-off::before { content: map-get($bootstrap-icons-map, \"toggle2-off\"); }\n.bi-toggle2-on::before { content: map-get($bootstrap-icons-map, \"toggle2-on\"); }\n.bi-toggles::before { content: map-get($bootstrap-icons-map, \"toggles\"); }\n.bi-toggles2::before { content: map-get($bootstrap-icons-map, \"toggles2\"); }\n.bi-tools::before { content: map-get($bootstrap-icons-map, \"tools\"); }\n.bi-tornado::before { content: map-get($bootstrap-icons-map, \"tornado\"); }\n.bi-trash-fill::before { content: map-get($bootstrap-icons-map, \"trash-fill\"); }\n.bi-trash::before { content: map-get($bootstrap-icons-map, \"trash\"); }\n.bi-trash2-fill::before { content: map-get($bootstrap-icons-map, \"trash2-fill\"); }\n.bi-trash2::before { content: map-get($bootstrap-icons-map, \"trash2\"); }\n.bi-tree-fill::before { content: map-get($bootstrap-icons-map, \"tree-fill\"); }\n.bi-tree::before { content: map-get($bootstrap-icons-map, \"tree\"); }\n.bi-triangle-fill::before { content: map-get($bootstrap-icons-map, \"triangle-fill\"); }\n.bi-triangle-half::before { content: map-get($bootstrap-icons-map, \"triangle-half\"); }\n.bi-triangle::before { content: map-get($bootstrap-icons-map, \"triangle\"); }\n.bi-trophy-fill::before { content: map-get($bootstrap-icons-map, \"trophy-fill\"); }\n.bi-trophy::before { content: map-get($bootstrap-icons-map, \"trophy\"); }\n.bi-tropical-storm::before { content: map-get($bootstrap-icons-map, \"tropical-storm\"); }\n.bi-truck-flatbed::before { content: map-get($bootstrap-icons-map, \"truck-flatbed\"); }\n.bi-truck::before { content: map-get($bootstrap-icons-map, \"truck\"); }\n.bi-tsunami::before { content: map-get($bootstrap-icons-map, \"tsunami\"); }\n.bi-tv-fill::before { content: map-get($bootstrap-icons-map, \"tv-fill\"); }\n.bi-tv::before { content: map-get($bootstrap-icons-map, \"tv\"); }\n.bi-twitch::before { content: map-get($bootstrap-icons-map, \"twitch\"); }\n.bi-twitter::before { content: map-get($bootstrap-icons-map, \"twitter\"); }\n.bi-type-bold::before { content: map-get($bootstrap-icons-map, \"type-bold\"); }\n.bi-type-h1::before { content: map-get($bootstrap-icons-map, \"type-h1\"); }\n.bi-type-h2::before { content: map-get($bootstrap-icons-map, \"type-h2\"); }\n.bi-type-h3::before { content: map-get($bootstrap-icons-map, \"type-h3\"); }\n.bi-type-italic::before { content: map-get($bootstrap-icons-map, \"type-italic\"); }\n.bi-type-strikethrough::before { content: map-get($bootstrap-icons-map, \"type-strikethrough\"); }\n.bi-type-underline::before { content: map-get($bootstrap-icons-map, \"type-underline\"); }\n.bi-type::before { content: map-get($bootstrap-icons-map, \"type\"); }\n.bi-ui-checks-grid::before { content: map-get($bootstrap-icons-map, \"ui-checks-grid\"); }\n.bi-ui-checks::before { content: map-get($bootstrap-icons-map, \"ui-checks\"); }\n.bi-ui-radios-grid::before { content: map-get($bootstrap-icons-map, \"ui-radios-grid\"); }\n.bi-ui-radios::before { content: map-get($bootstrap-icons-map, \"ui-radios\"); }\n.bi-umbrella-fill::before { content: map-get($bootstrap-icons-map, \"umbrella-fill\"); }\n.bi-umbrella::before { content: map-get($bootstrap-icons-map, \"umbrella\"); }\n.bi-union::before { content: map-get($bootstrap-icons-map, \"union\"); }\n.bi-unlock-fill::before { content: map-get($bootstrap-icons-map, \"unlock-fill\"); }\n.bi-unlock::before { content: map-get($bootstrap-icons-map, \"unlock\"); }\n.bi-upc-scan::before { content: map-get($bootstrap-icons-map, \"upc-scan\"); }\n.bi-upc::before { content: map-get($bootstrap-icons-map, \"upc\"); }\n.bi-upload::before { content: map-get($bootstrap-icons-map, \"upload\"); }\n.bi-vector-pen::before { content: map-get($bootstrap-icons-map, \"vector-pen\"); }\n.bi-view-list::before { content: map-get($bootstrap-icons-map, \"view-list\"); }\n.bi-view-stacked::before { content: map-get($bootstrap-icons-map, \"view-stacked\"); }\n.bi-vinyl-fill::before { content: map-get($bootstrap-icons-map, \"vinyl-fill\"); }\n.bi-vinyl::before { content: map-get($bootstrap-icons-map, \"vinyl\"); }\n.bi-voicemail::before { content: map-get($bootstrap-icons-map, \"voicemail\"); }\n.bi-volume-down-fill::before { content: map-get($bootstrap-icons-map, \"volume-down-fill\"); }\n.bi-volume-down::before { content: map-get($bootstrap-icons-map, \"volume-down\"); }\n.bi-volume-mute-fill::before { content: map-get($bootstrap-icons-map, \"volume-mute-fill\"); }\n.bi-volume-mute::before { content: map-get($bootstrap-icons-map, \"volume-mute\"); }\n.bi-volume-off-fill::before { content: map-get($bootstrap-icons-map, \"volume-off-fill\"); }\n.bi-volume-off::before { content: map-get($bootstrap-icons-map, \"volume-off\"); }\n.bi-volume-up-fill::before { content: map-get($bootstrap-icons-map, \"volume-up-fill\"); }\n.bi-volume-up::before { content: map-get($bootstrap-icons-map, \"volume-up\"); }\n.bi-vr::before { content: map-get($bootstrap-icons-map, \"vr\"); }\n.bi-wallet-fill::before { content: map-get($bootstrap-icons-map, \"wallet-fill\"); }\n.bi-wallet::before { content: map-get($bootstrap-icons-map, \"wallet\"); }\n.bi-wallet2::before { content: map-get($bootstrap-icons-map, \"wallet2\"); }\n.bi-watch::before { content: map-get($bootstrap-icons-map, \"watch\"); }\n.bi-water::before { content: map-get($bootstrap-icons-map, \"water\"); }\n.bi-whatsapp::before { content: map-get($bootstrap-icons-map, \"whatsapp\"); }\n.bi-wifi-1::before { content: map-get($bootstrap-icons-map, \"wifi-1\"); }\n.bi-wifi-2::before { content: map-get($bootstrap-icons-map, \"wifi-2\"); }\n.bi-wifi-off::before { content: map-get($bootstrap-icons-map, \"wifi-off\"); }\n.bi-wifi::before { content: map-get($bootstrap-icons-map, \"wifi\"); }\n.bi-wind::before { content: map-get($bootstrap-icons-map, \"wind\"); }\n.bi-window-dock::before { content: map-get($bootstrap-icons-map, \"window-dock\"); }\n.bi-window-sidebar::before { content: map-get($bootstrap-icons-map, \"window-sidebar\"); }\n.bi-window::before { content: map-get($bootstrap-icons-map, \"window\"); }\n.bi-wrench::before { content: map-get($bootstrap-icons-map, \"wrench\"); }\n.bi-x-circle-fill::before { content: map-get($bootstrap-icons-map, \"x-circle-fill\"); }\n.bi-x-circle::before { content: map-get($bootstrap-icons-map, \"x-circle\"); }\n.bi-x-diamond-fill::before { content: map-get($bootstrap-icons-map, \"x-diamond-fill\"); }\n.bi-x-diamond::before { content: map-get($bootstrap-icons-map, \"x-diamond\"); }\n.bi-x-octagon-fill::before { content: map-get($bootstrap-icons-map, \"x-octagon-fill\"); }\n.bi-x-octagon::before { content: map-get($bootstrap-icons-map, \"x-octagon\"); }\n.bi-x-square-fill::before { content: map-get($bootstrap-icons-map, \"x-square-fill\"); }\n.bi-x-square::before { content: map-get($bootstrap-icons-map, \"x-square\"); }\n.bi-x::before { content: map-get($bootstrap-icons-map, \"x\"); }\n.bi-youtube::before { content: map-get($bootstrap-icons-map, \"youtube\"); }\n.bi-zoom-in::before { content: map-get($bootstrap-icons-map, \"zoom-in\"); }\n.bi-zoom-out::before { content: map-get($bootstrap-icons-map, \"zoom-out\"); }\n.bi-bank::before { content: map-get($bootstrap-icons-map, \"bank\"); }\n.bi-bank2::before { content: map-get($bootstrap-icons-map, \"bank2\"); }\n.bi-bell-slash-fill::before { content: map-get($bootstrap-icons-map, \"bell-slash-fill\"); }\n.bi-bell-slash::before { content: map-get($bootstrap-icons-map, \"bell-slash\"); }\n.bi-cash-coin::before { content: map-get($bootstrap-icons-map, \"cash-coin\"); }\n.bi-check-lg::before { content: map-get($bootstrap-icons-map, \"check-lg\"); }\n.bi-coin::before { content: map-get($bootstrap-icons-map, \"coin\"); }\n.bi-currency-bitcoin::before { content: map-get($bootstrap-icons-map, \"currency-bitcoin\"); }\n.bi-currency-dollar::before { content: map-get($bootstrap-icons-map, \"currency-dollar\"); }\n.bi-currency-euro::before { content: map-get($bootstrap-icons-map, \"currency-euro\"); }\n.bi-currency-exchange::before { content: map-get($bootstrap-icons-map, \"currency-exchange\"); }\n.bi-currency-pound::before { content: map-get($bootstrap-icons-map, \"currency-pound\"); }\n.bi-currency-yen::before { content: map-get($bootstrap-icons-map, \"currency-yen\"); }\n.bi-dash-lg::before { content: map-get($bootstrap-icons-map, \"dash-lg\"); }\n.bi-exclamation-lg::before { content: map-get($bootstrap-icons-map, \"exclamation-lg\"); }\n.bi-file-earmark-pdf-fill::before { content: map-get($bootstrap-icons-map, \"file-earmark-pdf-fill\"); }\n.bi-file-earmark-pdf::before { content: map-get($bootstrap-icons-map, \"file-earmark-pdf\"); }\n.bi-file-pdf-fill::before { content: map-get($bootstrap-icons-map, \"file-pdf-fill\"); }\n.bi-file-pdf::before { content: map-get($bootstrap-icons-map, \"file-pdf\"); }\n.bi-gender-ambiguous::before { content: map-get($bootstrap-icons-map, \"gender-ambiguous\"); }\n.bi-gender-female::before { content: map-get($bootstrap-icons-map, \"gender-female\"); }\n.bi-gender-male::before { content: map-get($bootstrap-icons-map, \"gender-male\"); }\n.bi-gender-trans::before { content: map-get($bootstrap-icons-map, \"gender-trans\"); }\n.bi-headset-vr::before { content: map-get($bootstrap-icons-map, \"headset-vr\"); }\n.bi-info-lg::before { content: map-get($bootstrap-icons-map, \"info-lg\"); }\n.bi-mastodon::before { content: map-get($bootstrap-icons-map, \"mastodon\"); }\n.bi-messenger::before { content: map-get($bootstrap-icons-map, \"messenger\"); }\n.bi-piggy-bank-fill::before { content: map-get($bootstrap-icons-map, \"piggy-bank-fill\"); }\n.bi-piggy-bank::before { content: map-get($bootstrap-icons-map, \"piggy-bank\"); }\n.bi-pin-map-fill::before { content: map-get($bootstrap-icons-map, \"pin-map-fill\"); }\n.bi-pin-map::before { content: map-get($bootstrap-icons-map, \"pin-map\"); }\n.bi-plus-lg::before { content: map-get($bootstrap-icons-map, \"plus-lg\"); }\n.bi-question-lg::before { content: map-get($bootstrap-icons-map, \"question-lg\"); }\n.bi-recycle::before { content: map-get($bootstrap-icons-map, \"recycle\"); }\n.bi-reddit::before { content: map-get($bootstrap-icons-map, \"reddit\"); }\n.bi-safe-fill::before { content: map-get($bootstrap-icons-map, \"safe-fill\"); }\n.bi-safe2-fill::before { content: map-get($bootstrap-icons-map, \"safe2-fill\"); }\n.bi-safe2::before { content: map-get($bootstrap-icons-map, \"safe2\"); }\n.bi-sd-card-fill::before { content: map-get($bootstrap-icons-map, \"sd-card-fill\"); }\n.bi-sd-card::before { content: map-get($bootstrap-icons-map, \"sd-card\"); }\n.bi-skype::before { content: map-get($bootstrap-icons-map, \"skype\"); }\n.bi-slash-lg::before { content: map-get($bootstrap-icons-map, \"slash-lg\"); }\n.bi-translate::before { content: map-get($bootstrap-icons-map, \"translate\"); }\n.bi-x-lg::before { content: map-get($bootstrap-icons-map, \"x-lg\"); }\n.bi-safe::before { content: map-get($bootstrap-icons-map, \"safe\"); }\n.bi-apple::before { content: map-get($bootstrap-icons-map, \"apple\"); }\n.bi-microsoft::before { content: map-get($bootstrap-icons-map, \"microsoft\"); }\n.bi-windows::before { content: map-get($bootstrap-icons-map, \"windows\"); }\n.bi-behance::before { content: map-get($bootstrap-icons-map, \"behance\"); }\n.bi-dribbble::before { content: map-get($bootstrap-icons-map, \"dribbble\"); }\n.bi-line::before { content: map-get($bootstrap-icons-map, \"line\"); }\n.bi-medium::before { content: map-get($bootstrap-icons-map, \"medium\"); }\n.bi-paypal::before { content: map-get($bootstrap-icons-map, \"paypal\"); }\n.bi-pinterest::before { content: map-get($bootstrap-icons-map, \"pinterest\"); }\n.bi-signal::before { content: map-get($bootstrap-icons-map, \"signal\"); }\n.bi-snapchat::before { content: map-get($bootstrap-icons-map, \"snapchat\"); }\n.bi-spotify::before { content: map-get($bootstrap-icons-map, \"spotify\"); }\n.bi-stack-overflow::before { content: map-get($bootstrap-icons-map, \"stack-overflow\"); }\n.bi-strava::before { content: map-get($bootstrap-icons-map, \"strava\"); }\n.bi-wordpress::before { content: map-get($bootstrap-icons-map, \"wordpress\"); }\n.bi-vimeo::before { content: map-get($bootstrap-icons-map, \"vimeo\"); }\n.bi-activity::before { content: map-get($bootstrap-icons-map, \"activity\"); }\n.bi-easel2-fill::before { content: map-get($bootstrap-icons-map, \"easel2-fill\"); }\n.bi-easel2::before { content: map-get($bootstrap-icons-map, \"easel2\"); }\n.bi-easel3-fill::before { content: map-get($bootstrap-icons-map, \"easel3-fill\"); }\n.bi-easel3::before { content: map-get($bootstrap-icons-map, \"easel3\"); }\n.bi-fan::before { content: map-get($bootstrap-icons-map, \"fan\"); }\n.bi-fingerprint::before { content: map-get($bootstrap-icons-map, \"fingerprint\"); }\n.bi-graph-down-arrow::before { content: map-get($bootstrap-icons-map, \"graph-down-arrow\"); }\n.bi-graph-up-arrow::before { content: map-get($bootstrap-icons-map, \"graph-up-arrow\"); }\n.bi-hypnotize::before { content: map-get($bootstrap-icons-map, \"hypnotize\"); }\n.bi-magic::before { content: map-get($bootstrap-icons-map, \"magic\"); }\n.bi-person-rolodex::before { content: map-get($bootstrap-icons-map, \"person-rolodex\"); }\n.bi-person-video::before { content: map-get($bootstrap-icons-map, \"person-video\"); }\n.bi-person-video2::before { content: map-get($bootstrap-icons-map, \"person-video2\"); }\n.bi-person-video3::before { content: map-get($bootstrap-icons-map, \"person-video3\"); }\n.bi-person-workspace::before { content: map-get($bootstrap-icons-map, \"person-workspace\"); }\n.bi-radioactive::before { content: map-get($bootstrap-icons-map, \"radioactive\"); }\n.bi-webcam-fill::before { content: map-get($bootstrap-icons-map, \"webcam-fill\"); }\n.bi-webcam::before { content: map-get($bootstrap-icons-map, \"webcam\"); }\n.bi-yin-yang::before { content: map-get($bootstrap-icons-map, \"yin-yang\"); }\n.bi-bandaid-fill::before { content: map-get($bootstrap-icons-map, \"bandaid-fill\"); }\n.bi-bandaid::before { content: map-get($bootstrap-icons-map, \"bandaid\"); }\n.bi-bluetooth::before { content: map-get($bootstrap-icons-map, \"bluetooth\"); }\n.bi-body-text::before { content: map-get($bootstrap-icons-map, \"body-text\"); }\n.bi-boombox::before { content: map-get($bootstrap-icons-map, \"boombox\"); }\n.bi-boxes::before { content: map-get($bootstrap-icons-map, \"boxes\"); }\n.bi-dpad-fill::before { content: map-get($bootstrap-icons-map, \"dpad-fill\"); }\n.bi-dpad::before { content: map-get($bootstrap-icons-map, \"dpad\"); }\n.bi-ear-fill::before { content: map-get($bootstrap-icons-map, \"ear-fill\"); }\n.bi-ear::before { content: map-get($bootstrap-icons-map, \"ear\"); }\n.bi-envelope-check-1::before { content: map-get($bootstrap-icons-map, \"envelope-check-1\"); }\n.bi-envelope-check-fill::before { content: map-get($bootstrap-icons-map, \"envelope-check-fill\"); }\n.bi-envelope-check::before { content: map-get($bootstrap-icons-map, \"envelope-check\"); }\n.bi-envelope-dash-1::before { content: map-get($bootstrap-icons-map, \"envelope-dash-1\"); }\n.bi-envelope-dash-fill::before { content: map-get($bootstrap-icons-map, \"envelope-dash-fill\"); }\n.bi-envelope-dash::before { content: map-get($bootstrap-icons-map, \"envelope-dash\"); }\n.bi-envelope-exclamation-1::before { content: map-get($bootstrap-icons-map, \"envelope-exclamation-1\"); }\n.bi-envelope-exclamation-fill::before { content: map-get($bootstrap-icons-map, \"envelope-exclamation-fill\"); }\n.bi-envelope-exclamation::before { content: map-get($bootstrap-icons-map, \"envelope-exclamation\"); }\n.bi-envelope-plus-fill::before { content: map-get($bootstrap-icons-map, \"envelope-plus-fill\"); }\n.bi-envelope-plus::before { content: map-get($bootstrap-icons-map, \"envelope-plus\"); }\n.bi-envelope-slash-1::before { content: map-get($bootstrap-icons-map, \"envelope-slash-1\"); }\n.bi-envelope-slash-fill::before { content: map-get($bootstrap-icons-map, \"envelope-slash-fill\"); }\n.bi-envelope-slash::before { content: map-get($bootstrap-icons-map, \"envelope-slash\"); }\n.bi-envelope-x-1::before { content: map-get($bootstrap-icons-map, \"envelope-x-1\"); }\n.bi-envelope-x-fill::before { content: map-get($bootstrap-icons-map, \"envelope-x-fill\"); }\n.bi-envelope-x::before { content: map-get($bootstrap-icons-map, \"envelope-x\"); }\n.bi-explicit-fill::before { content: map-get($bootstrap-icons-map, \"explicit-fill\"); }\n.bi-explicit::before { content: map-get($bootstrap-icons-map, \"explicit\"); }\n.bi-git::before { content: map-get($bootstrap-icons-map, \"git\"); }\n.bi-infinity::before { content: map-get($bootstrap-icons-map, \"infinity\"); }\n.bi-list-columns-reverse::before { content: map-get($bootstrap-icons-map, \"list-columns-reverse\"); }\n.bi-list-columns::before { content: map-get($bootstrap-icons-map, \"list-columns\"); }\n.bi-meta::before { content: map-get($bootstrap-icons-map, \"meta\"); }\n.bi-mortorboard-fill::before { content: map-get($bootstrap-icons-map, \"mortorboard-fill\"); }\n.bi-mortorboard::before { content: map-get($bootstrap-icons-map, \"mortorboard\"); }\n.bi-nintendo-switch::before { content: map-get($bootstrap-icons-map, \"nintendo-switch\"); }\n.bi-pc-display-horizontal::before { content: map-get($bootstrap-icons-map, \"pc-display-horizontal\"); }\n.bi-pc-display::before { content: map-get($bootstrap-icons-map, \"pc-display\"); }\n.bi-pc-horizontal::before { content: map-get($bootstrap-icons-map, \"pc-horizontal\"); }\n.bi-pc::before { content: map-get($bootstrap-icons-map, \"pc\"); }\n.bi-playstation::before { content: map-get($bootstrap-icons-map, \"playstation\"); }\n.bi-plus-slash-minus::before { content: map-get($bootstrap-icons-map, \"plus-slash-minus\"); }\n.bi-projector-fill::before { content: map-get($bootstrap-icons-map, \"projector-fill\"); }\n.bi-projector::before { content: map-get($bootstrap-icons-map, \"projector\"); }\n.bi-qr-code-scan::before { content: map-get($bootstrap-icons-map, \"qr-code-scan\"); }\n.bi-qr-code::before { content: map-get($bootstrap-icons-map, \"qr-code\"); }\n.bi-quora::before { content: map-get($bootstrap-icons-map, \"quora\"); }\n.bi-quote::before { content: map-get($bootstrap-icons-map, \"quote\"); }\n.bi-robot::before { content: map-get($bootstrap-icons-map, \"robot\"); }\n.bi-send-check-fill::before { content: map-get($bootstrap-icons-map, \"send-check-fill\"); }\n.bi-send-check::before { content: map-get($bootstrap-icons-map, \"send-check\"); }\n.bi-send-dash-fill::before { content: map-get($bootstrap-icons-map, \"send-dash-fill\"); }\n.bi-send-dash::before { content: map-get($bootstrap-icons-map, \"send-dash\"); }\n.bi-send-exclamation-1::before { content: map-get($bootstrap-icons-map, \"send-exclamation-1\"); }\n.bi-send-exclamation-fill::before { content: map-get($bootstrap-icons-map, \"send-exclamation-fill\"); }\n.bi-send-exclamation::before { content: map-get($bootstrap-icons-map, \"send-exclamation\"); }\n.bi-send-fill::before { content: map-get($bootstrap-icons-map, \"send-fill\"); }\n.bi-send-plus-fill::before { content: map-get($bootstrap-icons-map, \"send-plus-fill\"); }\n.bi-send-plus::before { content: map-get($bootstrap-icons-map, \"send-plus\"); }\n.bi-send-slash-fill::before { content: map-get($bootstrap-icons-map, \"send-slash-fill\"); }\n.bi-send-slash::before { content: map-get($bootstrap-icons-map, \"send-slash\"); }\n.bi-send-x-fill::before { content: map-get($bootstrap-icons-map, \"send-x-fill\"); }\n.bi-send-x::before { content: map-get($bootstrap-icons-map, \"send-x\"); }\n.bi-send::before { content: map-get($bootstrap-icons-map, \"send\"); }\n.bi-steam::before { content: map-get($bootstrap-icons-map, \"steam\"); }\n.bi-terminal-dash-1::before { content: map-get($bootstrap-icons-map, \"terminal-dash-1\"); }\n.bi-terminal-dash::before { content: map-get($bootstrap-icons-map, \"terminal-dash\"); }\n.bi-terminal-plus::before { content: map-get($bootstrap-icons-map, \"terminal-plus\"); }\n.bi-terminal-split::before { content: map-get($bootstrap-icons-map, \"terminal-split\"); }\n.bi-ticket-detailed-fill::before { content: map-get($bootstrap-icons-map, \"ticket-detailed-fill\"); }\n.bi-ticket-detailed::before { content: map-get($bootstrap-icons-map, \"ticket-detailed\"); }\n.bi-ticket-fill::before { content: map-get($bootstrap-icons-map, \"ticket-fill\"); }\n.bi-ticket-perforated-fill::before { content: map-get($bootstrap-icons-map, \"ticket-perforated-fill\"); }\n.bi-ticket-perforated::before { content: map-get($bootstrap-icons-map, \"ticket-perforated\"); }\n.bi-ticket::before { content: map-get($bootstrap-icons-map, \"ticket\"); }\n.bi-tiktok::before { content: map-get($bootstrap-icons-map, \"tiktok\"); }\n.bi-window-dash::before { content: map-get($bootstrap-icons-map, \"window-dash\"); }\n.bi-window-desktop::before { content: map-get($bootstrap-icons-map, \"window-desktop\"); }\n.bi-window-fullscreen::before { content: map-get($bootstrap-icons-map, \"window-fullscreen\"); }\n.bi-window-plus::before { content: map-get($bootstrap-icons-map, \"window-plus\"); }\n.bi-window-split::before { content: map-get($bootstrap-icons-map, \"window-split\"); }\n.bi-window-stack::before { content: map-get($bootstrap-icons-map, \"window-stack\"); }\n.bi-window-x::before { content: map-get($bootstrap-icons-map, \"window-x\"); }\n.bi-xbox::before { content: map-get($bootstrap-icons-map, \"xbox\"); }\n.bi-ethernet::before { content: map-get($bootstrap-icons-map, \"ethernet\"); }\n.bi-hdmi-fill::before { content: map-get($bootstrap-icons-map, \"hdmi-fill\"); }\n.bi-hdmi::before { content: map-get($bootstrap-icons-map, \"hdmi\"); }\n.bi-usb-c-fill::before { content: map-get($bootstrap-icons-map, \"usb-c-fill\"); }\n.bi-usb-c::before { content: map-get($bootstrap-icons-map, \"usb-c\"); }\n.bi-usb-fill::before { content: map-get($bootstrap-icons-map, \"usb-fill\"); }\n.bi-usb-plug-fill::before { content: map-get($bootstrap-icons-map, \"usb-plug-fill\"); }\n.bi-usb-plug::before { content: map-get($bootstrap-icons-map, \"usb-plug\"); }\n.bi-usb-symbol::before { content: map-get($bootstrap-icons-map, \"usb-symbol\"); }\n.bi-usb::before { content: map-get($bootstrap-icons-map, \"usb\"); }\n.bi-boombox-fill::before { content: map-get($bootstrap-icons-map, \"boombox-fill\"); }\n.bi-displayport-1::before { content: map-get($bootstrap-icons-map, \"displayport-1\"); }\n.bi-displayport::before { content: map-get($bootstrap-icons-map, \"displayport\"); }\n.bi-gpu-card::before { content: map-get($bootstrap-icons-map, \"gpu-card\"); }\n.bi-memory::before { content: map-get($bootstrap-icons-map, \"memory\"); }\n.bi-modem-fill::before { content: map-get($bootstrap-icons-map, \"modem-fill\"); }\n.bi-modem::before { content: map-get($bootstrap-icons-map, \"modem\"); }\n.bi-motherboard-fill::before { content: map-get($bootstrap-icons-map, \"motherboard-fill\"); }\n.bi-motherboard::before { content: map-get($bootstrap-icons-map, \"motherboard\"); }\n.bi-optical-audio-fill::before { content: map-get($bootstrap-icons-map, \"optical-audio-fill\"); }\n.bi-optical-audio::before { content: map-get($bootstrap-icons-map, \"optical-audio\"); }\n.bi-pci-card::before { content: map-get($bootstrap-icons-map, \"pci-card\"); }\n.bi-router-fill::before { content: map-get($bootstrap-icons-map, \"router-fill\"); }\n.bi-router::before { content: map-get($bootstrap-icons-map, \"router\"); }\n.bi-ssd-fill::before { content: map-get($bootstrap-icons-map, \"ssd-fill\"); }\n.bi-ssd::before { content: map-get($bootstrap-icons-map, \"ssd\"); }\n.bi-thunderbolt-fill::before { content: map-get($bootstrap-icons-map, \"thunderbolt-fill\"); }\n.bi-thunderbolt::before { content: map-get($bootstrap-icons-map, \"thunderbolt\"); }\n.bi-usb-drive-fill::before { content: map-get($bootstrap-icons-map, \"usb-drive-fill\"); }\n.bi-usb-drive::before { content: map-get($bootstrap-icons-map, \"usb-drive\"); }\n.bi-usb-micro-fill::before { content: map-get($bootstrap-icons-map, \"usb-micro-fill\"); }\n.bi-usb-micro::before { content: map-get($bootstrap-icons-map, \"usb-micro\"); }\n.bi-usb-mini-fill::before { content: map-get($bootstrap-icons-map, \"usb-mini-fill\"); }\n.bi-usb-mini::before { content: map-get($bootstrap-icons-map, \"usb-mini\"); }\n.bi-cloud-haze2::before { content: map-get($bootstrap-icons-map, \"cloud-haze2\"); }\n.bi-device-hdd-fill::before { content: map-get($bootstrap-icons-map, \"device-hdd-fill\"); }\n.bi-device-hdd::before { content: map-get($bootstrap-icons-map, \"device-hdd\"); }\n.bi-device-ssd-fill::before { content: map-get($bootstrap-icons-map, \"device-ssd-fill\"); }\n.bi-device-ssd::before { content: map-get($bootstrap-icons-map, \"device-ssd\"); }\n.bi-displayport-fill::before { content: map-get($bootstrap-icons-map, \"displayport-fill\"); }\n.bi-mortarboard-fill::before { content: map-get($bootstrap-icons-map, \"mortarboard-fill\"); }\n.bi-mortarboard::before { content: map-get($bootstrap-icons-map, \"mortarboard\"); }\n.bi-terminal-x::before { content: map-get($bootstrap-icons-map, \"terminal-x\"); }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap/dist/css/bootstrap.min.css":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap/dist/css/bootstrap.min.css ***!
  \****************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M2 5l6 6 6-6%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M2 5l6 6 6-6%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10l3 3l6-6%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10l3 3l6-6%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_14___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_15___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
var ___CSS_LOADER_URL_REPLACEMENT_14___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_14___);
var ___CSS_LOADER_URL_REPLACEMENT_15___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_15___);
// Module
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.sass":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.sass ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0; }\n\nbody {\n  font-family: Comfortaa, Helvetica;\n  height: 100vh; }\n\n.navbar {\n  z-index: 1;\n  height: 10%;\n  background-color: #005691;\n  color: #FFFFFF; }\n\n#bellBtn {\n  position: relative; }\n\n.red-circle {\n  position: absolute;\n  transform: translate(125%, 50%);\n  background-color: red;\n  height: 10px;\n  width: 10px;\n  border-radius: 10px;\n  opacity: 0; }\n\n#notifList, #movingList {\n  width: 300px;\n  max-height: 200px;\n  overflow: auto;\n  white-space: nowrap; }\n  #notifList::-webkit-scrollbar, #movingList::-webkit-scrollbar {\n    width: 5px;\n    height: 5px; }\n  #notifList::-webkit-scrollbar-thumb, #movingList::-webkit-scrollbar-thumb {\n    background: #1f1f1f;\n    border-radius: 10px; }\n  #notifList li, #movingList li {\n    margin-bottom: 5px; }\n  #notifList li:last-child, #movingList li:last-child {\n    margin-bottom: none; }\n\nmain {\n  height: 90%; }\n\n#listsViewCont {\n  overflow-x: hidden;\n  width: 0;\n  border-right: 1px solid black;\n  background-color: #E8F1F5;\n  transition: 0.5s; }\n  #listsViewCont.expanded {\n    width: 30%;\n    transition: 0.5s; }\n\n#listsContent, #tasksContent {\n  overflow-y: auto; }\n  #listsContent::-webkit-scrollbar, #tasksContent::-webkit-scrollbar {\n    width: 5px; }\n  #listsContent::-webkit-scrollbar-thumb, #tasksContent::-webkit-scrollbar-thumb {\n    background: #1f1f1f;\n    border-radius: 10px; }\n\n.task {\n  overflow-x: auto;\n  white-space: nowrap; }\n  .task::-webkit-scrollbar {\n    height: 5px; }\n  .task::-webkit-scrollbar-thumb {\n    background: #1f1f1f;\n    border-radius: 10px; }\n\n.list {\n  cursor: pointer;\n  margin-bottom: 1%; }\n  .list.active {\n    border: 1px solid black;\n    border-radius: 5px;\n    background-color: #FFFFFF; }\n\n#listTools {\n  border-top: 1px solid black;\n  background-color: #B9E1F3; }\n\n.iconpicker-dropdown {\n  visibility: visible !important; }\n\n#tasksViewCont {\n  width: 100%; }\n  #tasksViewCont.shrinked {\n    width: 70%;\n    transition: 0.5s; }\n\n#navbarToggler, #listsToggler {\n  transition: 0.5s; }\n\n#listsToggler {\n  position: absolute;\n  left: 0%;\n  top: 50%;\n  transform: translate(-5%, -50%); }\n\n#infoHeader {\n  height: 15%; }\n\n#tasksContent {\n  height: 75%; }\n\n.list-label.hide {\n  position: absolute;\n  top: 0;\n  left: 0;\n  transform: translate(-200%, -200%); }\n\n.due {\n  color: red; }\n\n#taskBottom {\n  height: 7%; }\n\n#taskInput {\n  border: 1px solid gray;\n  border-radius: 3px;\n  box-shadow: 1px 1px 3px black; }\n  #taskInput * {\n    border: none;\n    outline: none; }\n  #taskInput > div {\n    border-right: 2px solid black;\n    border-radius: 3px;\n    padding: 0; }\n  #taskInput > div:nth-child(2), #taskInput div:nth-child(3) {\n    position: relative; }\n    #taskInput > div:nth-child(2) i, #taskInput div:nth-child(3) i {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      transform: translate(-50%, -50%); }\n    #taskInput > div:nth-child(2) input, #taskInput div:nth-child(3) input {\n      width: 100%;\n      height: 100%;\n      padding: 0; }\n      #taskInput > div:nth-child(2) input::-webkit-datetime-edit, #taskInput div:nth-child(3) input::-webkit-datetime-edit {\n        display: none; }\n      #taskInput > div:nth-child(2) input::-webkit-calendar-picker-indicator, #taskInput div:nth-child(3) input::-webkit-calendar-picker-indicator {\n        width: 100%;\n        height: 100%;\n        margin: 0;\n        opacity: 0;\n        border: 1px solid blue; }\n  #taskInput a.active-priority {\n    border: 3px solid black; }\n  #taskInput a:active {\n    background: none; }\n  #taskInput > div.btn {\n    border: 1px solid black; }\n    #taskInput > div.btn:active {\n      filter: brightness(85%); }\n\n.high {\n  background-color: rgba(255, 0, 0, 0.5); }\n\n.medium {\n  background-color: rgba(255, 123, 0, 0.5); }\n\n.low {\n  background-color: rgba(200, 200, 200, 0.5); }\n\n@media screen and (max-width: 576px) {\n  #listsViewCont.expanded {\n    width: 100%;\n    transition: 0.5s; }\n  #infoHeader {\n    max-height: 7%; }\n  #tasksContent {\n    height: 82.5%; }\n  #tasksViewCont.shrinked {\n    width: 0%;\n    overflow-x: hidden;\n    transition: 0.5s; }\n  #taskConfirmBtn, #taskCancelBtn {\n    border-top: 2px solid black;\n    border-bottom: 2px solid black; } }\n", "",{"version":3,"sources":["webpack://./src/style.sass"],"names":[],"mappings":"AAUA;;;EAGI,sBAAsB;EACtB,UAAU;EACV,SAAS,EAAA;;AAEb;EACI,iCAhB+B;EAiB/B,aAAa,EAAA;;AAEjB;EACI,UAAU;EACV,WAAW;EACX,yBArBwB;EAsBxB,cApBmB,EAAA;;AAsBvB;EACI,kBAAkB,EAAA;;AAEtB;EACI,kBAAkB;EAClB,+BAA+B;EAC/B,qBAAqB;EACrB,YAAY;EACZ,WAAW;EACX,mBAAmB;EACnB,UAAU,EAAA;;AAEd;EACI,YAAY;EACZ,iBAAiB;EACjB,cAAc;EACd,mBAAmB,EAAA;EAJvB;IAOQ,UAAU;IACV,WAAW,EAAA;EARnB;IAUQ,mBAAmB;IACnB,mBAAmB,EAAA;EAX3B;IAcQ,kBAAkB,EAAA;EAd1B;IAiBQ,mBAAmB,EAAA;;AAE3B;EACI,WAAW,EAAA;;AAEf;EACI,kBAAkB;EAClB,QAAQ;EACR,6BAA6B;EAC7B,yBAAyB;EACzB,gBAAgB,EAAA;EALpB;IAQQ,UAAU;IACV,gBAAgB,EAAA;;AAExB;EACI,gBAAgB,EAAA;EADpB;IAIQ,UAAU,EAAA;EAJlB;IAOQ,mBAAmB;IACnB,mBAAmB,EAAA;;AAE3B;EACI,gBAAgB;EAChB,mBAAmB,EAAA;EAFvB;IAKQ,WAAW,EAAA;EALnB;IAQQ,mBAAmB;IACnB,mBAAmB,EAAA;;AAE3B;EACI,eAAe;EACf,iBAAiB,EAAA;EAFrB;IAKQ,uBAAuB;IACvB,kBAAkB;IAClB,yBA/Fe,EAAA;;AAiGvB;EACI,2BAA2B;EAC3B,yBApG0B,EAAA;;AAsG9B;EACI,8BAA8B,EAAA;;AAElC;EACI,WAAW,EAAA;EADf;IAIQ,UAAU;IACV,gBAAgB,EAAA;;AAExB;EACI,gBAAgB,EAAA;;AAEpB;EACI,kBAAkB;EAClB,QAAQ;EACR,QAAQ;EACR,+BAA+B,EAAA;;AAEnC;EACI,WAAW,EAAA;;AAEf;EACI,WAAW,EAAA;;AAEf;EAEQ,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,kCAAkC,EAAA;;AAE1C;EACI,UAAU,EAAA;;AAEd;EACI,UAAU,EAAA;;AAEd;EACI,sBAAsB;EACtB,kBAAkB;EAClB,6BAA6B,EAAA;EAHjC;IAMQ,YAAY;IACZ,aAAa,EAAA;EAPrB;IAUQ,6BAA6B;IAC7B,kBAAkB;IAClB,UAAU,EAAA;EAZlB;IAeQ,kBAAkB,EAAA;IAf1B;MAkBY,kBAAkB;MAClB,QAAQ;MACR,SAAS;MACT,gCAAgC,EAAA;IArB5C;MAwBY,WAAW;MACX,YAAY;MACZ,UAAU,EAAA;MA1BtB;QA6BgB,aAAa,EAAA;MA7B7B;QAgCgB,WAAW;QACX,YAAY;QACZ,SAAS;QACT,UAAU;QACV,sBAAsB,EAAA;EApCtC;IAuCQ,uBAAuB,EAAA;EAvC/B;IA0CQ,gBAAgB,EAAA;EA1CxB;IA6CQ,uBAAuB,EAAA;IA7C/B;MAgDY,uBAAuB,EAAA;;AAEnC;EACI,sCA7L6B,EAAA;;AA+LjC;EACI,wCA/LiC,EAAA;;AAiMrC;EACI,0CAjMgC,EAAA;;AAmMpC;EACI;IAEQ,WAAW;IACX,gBAAgB,EAAA;EAExB;IACI,cAAc,EAAA;EAElB;IACI,aAAa,EAAA;EAEjB;IAEQ,SAAS;IACT,kBAAkB;IAClB,gBAAgB,EAAA;EAExB;IACI,2BAA2B;IAC3B,8BAA8B,EAAA,EAAG","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap');\n\n$primary-font: Comfortaa, Helvetica;\n$background-primary: #005691;\n$background-secondary: #B9E1F3;\n$color-primary: #FFFFFF;\n$high-color: rgba(255, 0, 0, 0.5);\n$medium-color: rgba(255, 123, 0, 0.5);\n$low-color: rgba(200, 200, 200, 0.5);\n\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n    padding: 0;\n    margin: 0; }\n\nbody {\n    font-family: $primary-font;\n    height: 100vh; }\n\n.navbar {\n    z-index: 1;\n    height: 10%;\n    background-color: $background-primary;\n    color: $color-primary; }\n\n#bellBtn {\n    position: relative; }\n\n.red-circle {\n    position: absolute;\n    transform: translate(125%, 50%);\n    background-color: red;\n    height: 10px;\n    width: 10px;\n    border-radius: 10px;\n    opacity: 0; }\n\n#notifList, #movingList {\n    width: 300px;\n    max-height: 200px;\n    overflow: auto;\n    white-space: nowrap;\n\n    &::-webkit-scrollbar {\n        width: 5px;\n        height: 5px; }\n    &::-webkit-scrollbar-thumb {\n        background: #1f1f1f;\n        border-radius: 10px; }\n\n    li {\n        margin-bottom: 5px; }\n\n    li:last-child {\n        margin-bottom: none; } }\n\nmain {\n    height: 90%; }\n\n#listsViewCont {\n    overflow-x: hidden;\n    width: 0;\n    border-right: 1px solid black;\n    background-color: #E8F1F5;\n    transition: 0.5s;\n\n    &.expanded {\n        width: 30%;\n        transition: 0.5s; } }\n\n#listsContent, #tasksContent {\n    overflow-y: auto;\n\n    &::-webkit-scrollbar {\n        width: 5px; }\n\n    &::-webkit-scrollbar-thumb {\n        background: #1f1f1f;\n        border-radius: 10px; } }\n\n.task {\n    overflow-x: auto;\n    white-space: nowrap;\n\n    &::-webkit-scrollbar {\n        height: 5px; }\n\n    &::-webkit-scrollbar-thumb {\n        background: #1f1f1f;\n        border-radius: 10px; } }\n\n.list {\n    cursor: pointer;\n    margin-bottom: 1%;\n\n    &.active {\n        border: 1px solid black;\n        border-radius: 5px;\n        background-color: $color-primary; } }\n\n#listTools {\n    border-top: 1px solid black;\n    background-color: $background-secondary; }\n\n.iconpicker-dropdown {\n    visibility: visible !important; }\n\n#tasksViewCont {\n    width: 100%;\n\n    &.shrinked {\n        width: 70%;\n        transition: 0.5s; } }\n\n#navbarToggler, #listsToggler {\n    transition: 0.5s; }\n\n#listsToggler {\n    position: absolute;\n    left: 0%;\n    top: 50%;\n    transform: translate(-5%, -50%); }\n\n#infoHeader {\n    height: 15%; }\n\n#tasksContent {\n    height: 75%; }\n\n.list-label {\n    &.hide {\n        position: absolute;\n        top: 0;\n        left: 0;\n        transform: translate(-200%, -200%); } }\n\n.due {\n    color: red; }\n\n#taskBottom {\n    height: 7%; }\n\n#taskInput {\n    border: 1px solid gray;\n    border-radius: 3px;\n    box-shadow: 1px 1px 3px black;\n\n    & * {\n        border: none;\n        outline: none; }\n\n    & > div {\n        border-right: 2px solid black;\n        border-radius: 3px;\n        padding: 0; }\n\n    & > div:nth-child(2), div:nth-child(3) {\n        position: relative;\n\n        i {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%); }\n\n        input {\n            width: 100%;\n            height: 100%;\n            padding: 0;\n\n            &::-webkit-datetime-edit {\n                display: none; }\n\n            &::-webkit-calendar-picker-indicator {\n                width: 100%;\n                height: 100%;\n                margin: 0;\n                opacity: 0;\n                border: 1px solid blue; } } }\n\n    a.active-priority {\n        border: 3px solid black; }\n\n    a:active {\n        background: none; }\n\n    & > div.btn {\n        border: 1px solid black;\n\n        &:active {\n            filter: brightness(85%); } } }\n\n.high {\n    background-color: $high-color; }\n\n.medium {\n    background-color: $medium-color; }\n\n.low {\n    background-color: $low-color; }\n\n@media screen and ( max-width: 576px ) {\n    #listsViewCont {\n        &.expanded {\n            width: 100%;\n            transition: 0.5s; } }\n\n    #infoHeader {\n        max-height: 7%; }\n\n    #tasksContent {\n        height: 82.5%; }\n\n    #tasksViewCont {\n        &.shrinked {\n            width: 0%;\n            overflow-x: hidden;\n            transition: 0.5s; } }\n\n    #taskConfirmBtn, #taskCancelBtn {\n        border-top: 2px solid black;\n        border-bottom: 2px solid black; } }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/bootstrap-icons/font/bootstrap-icons.scss":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/font/bootstrap-icons.scss ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js!../../sass-loader/dist/cjs.js!./bootstrap-icons.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap-icons/font/bootstrap-icons.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/bootstrap/dist/css/bootstrap.min.css":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap/dist/css/bootstrap.min.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../css-loader/dist/cjs.js!../../../sass-loader/dist/cjs.js!./bootstrap.min.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/bootstrap/dist/css/bootstrap.min.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_sass_loader_dist_cjs_js_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.sass":
/*!************************!*\
  !*** ./src/style.sass ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_sass__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./style.sass */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/style.sass");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_sass__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_sass__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_sass__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_style_sass__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _task_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./task_factory */ "./src/task_factory.js");
/* harmony import */ var _list_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list_factory */ "./src/list_factory.js");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer */ "./src/renderer.js");





/**
 * The module provides handling-API for the Renderer module and
 * facilitates the support of local storage.
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  let Renderer;
  let lists;

  /**
   * Checks whether the given task is overdue or not.
   *
   * @param task - task to be checked
   * @returns {boolean}
   */
  function isDue(task) {
    const givenDate = task.getDate();
    const givenTime = task.getTime();

    const timeStamp = new Date();
    const hourShift = givenTime[0] < 12 && givenTime[2] === 'PM' ? 12 : 0;

    timeStamp.setFullYear(
      Number(givenDate[2]),
      Number(givenDate[0]) - 1,
      Number(givenDate[1]),
    );
    timeStamp.setHours(hourShift + Number(givenTime[0]), Number(givenTime[1]));

    return timeStamp <= new Date(Date.now());
  }

  /**
   * Checks if there's a list that has given credentials
   */
  function hasSameList(listName, listIcon) {
    let result = false;
    const listArr = Object.values(lists);

    for (let i = 0; i < listArr.length; i += 1) {
      if (
        listArr[i].getName() === listName
        && listArr[i].getIcon() === listIcon
      ) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Updates the 'localStorage' object.
   *
   * @param update - update to be performed
   */
  function updateStorage(update) {
    const storage = JSON.parse(localStorage.getItem('listStorage')) ?? {};
    const evalSwitch = {
      'list.add': () => {
        storage[update.list.getID()] = {
          name: update.list.getName(),
          icon: update.list.getIcon(),
          tasks: {},
        };
      },
      'list.remove': () => {
        delete storage[update.list_id];
      },
      'list.edit': () => {
        storage[update.list.getID()].name = update.list.getName();
        storage[update.list.getID()].icon = update.list.getIcon();
      },
      'task.add_or_edit': () => {
        storage[update.list_id].tasks[update.task.getID()] = {
          name: update.task.getName(),
          date: update.task.getDate(),
          time: update.task.getTime(),
          priority: update.task.getPriority(),
          is_due: update.task.getDue(),
        };
      },
      'task.remove': () => {
        delete storage[update.list_id].tasks[update.task_id];
      },
      'task.move': () => {
        const taskCopy = {
          ...storage[update.old_list_id].tasks[update.task_id],
        };
        delete storage[update.old_list_id].tasks[update.task_id];
        storage[update.new_list_id].tasks[update.task_id] = taskCopy;
      },
    };

    evalSwitch[update.type]();
    localStorage.setItem('listStorage', JSON.stringify(storage));
  }

  /**
   * Deserializes data from 'localStorage'.
   *
   * @returns revivedStorage - deserialized storage
   */
  function reviveStorage() {
    const revivedStorage = {};
    const jsonStorage = JSON.parse(localStorage.getItem('listStorage'));
    let revivedList;
    let revivedTask;

    Object.keys(jsonStorage).forEach((listID) => {
      revivedList = (0,_list_factory__WEBPACK_IMPORTED_MODULE_1__["default"])(
        listID,
        jsonStorage[listID].name,
        jsonStorage[listID].icon,
      );

      Object.keys(jsonStorage[listID].tasks).forEach((taskID) => {
        revivedTask = (0,_task_factory__WEBPACK_IMPORTED_MODULE_0__["default"])(
          revivedList,
          taskID,
          jsonStorage[listID].tasks[taskID].name,
          jsonStorage[listID].tasks[taskID].date,
          jsonStorage[listID].tasks[taskID].time,
          jsonStorage[listID].tasks[taskID].priority,
          jsonStorage[listID].tasks[taskID].is_due,
        );

        revivedList.appendTask(revivedTask);
      });

      revivedStorage[listID] = revivedList;
    });

    return revivedStorage;
  }

  /**
   * Handles a list-selection.
   *
   * @param current_list_id - currently displayed list
   * @param selectedListId - list to be rendered
   * @param displayedTasks - tasks that are currently displayed
   */
  function listView(selectedListId, displayedTasks) {
    let tasks;
    let task;

    // Erase all displayed tasks
    if (displayedTasks) {
      Object.keys(displayedTasks).forEach((taskID) => {
        task = lists[displayedTasks[taskID]].getTask(taskID);

        Renderer.eraseTask(taskID);
        if (task.getDue()) {
          Renderer.updateDueCount(-1);
        }
      });
    }

    // Render all the tasks
    const drawCode = () => {
      Object.keys(tasks).forEach((taskID) => {
        task = tasks[taskID];

        if (isDue(task)) {
          Renderer.drawNotification(task);
          Renderer.updateDueCount(+1);

          task.setDue(true);
          updateStorage({
            type: 'task.add_or_edit',
            list_id: task.getList().getID(),
            task,
          });
        }

        Renderer.drawTask(task);
      });
    };

    if (selectedListId === 'homeList') {
      Object.keys(lists).forEach((listID) => {
        tasks = lists[listID].getAllTasks();
        drawCode();
      });
    } else {
      tasks = lists[selectedListId].getAllTasks();
      drawCode();
    }
  }

  /**
   * Handles searching of displayed tasks of a given list.
   *
   * @param givenListId - id of a list where to search for tasks
   * @param searchTerm - token that describes tasks
   * @param displayedTasks - currently displayed tasks
   */
  function searchView(givenListId, searchTerm, displayedTasks) {
    let matchedTasks;

    // Obtain matched tasks
    if (givenListId === 'homeList') {
      matchedTasks = {};
      Object.keys(lists).forEach((listID) => {
        matchedTasks = Object.assign(
          matchedTasks,
          lists[listID].searchTasks(searchTerm),
        );
      });
    } else {
      matchedTasks = lists[givenListId].searchTasks(searchTerm);
    }

    // Erase tasks which are displayed
    let task;
    Object.keys(displayedTasks).forEach((taskID) => {
      task = lists[displayedTasks[taskID]].getTask(taskID);
      Renderer.eraseTask(taskID);

      if (task.getDue()) {
        Renderer.updateDueCount(-1);
      }
    });

    // Draw tasks matched tasks
    Object.keys(matchedTasks).forEach((taskID) => {
      task = matchedTasks[taskID];
      Renderer.drawTask(task);

      if (task.getDue()) {
        Renderer.updateDueCount(+1);
      }
    });
  }

  /**
   * Handles creation of a new list.
   *
   * @param listData - data associated with a new list
   */
  function addList(listData) {
    const listName = listData.name;
    const listIcon = listData.icon;

    // Validate
    if (hasSameList(listName, listIcon)) {
      return false;
    }

    // Create a list object
    const newList = (0,_list_factory__WEBPACK_IMPORTED_MODULE_1__["default"])((0,uuid__WEBPACK_IMPORTED_MODULE_3__["default"])(), listName, listIcon);
    lists[newList.getID()] = newList;

    updateStorage({
      type: 'list.add',
      list: newList,
    });
    Renderer.drawList(newList);

    return true;
  }

  /**
   * Handles removal of a list.
   *
   * @param givenListId - id of a list to be removed
   */
  function removeList(givenListId) {
    // Update the display
    Renderer.eraseList(givenListId);
    Renderer.updateTaskCount(
      'homeList',
      -Object.values(lists[givenListId].getAllTasks()).length,
    );
    Object.keys(lists[givenListId].getAllTasks()).forEach((taskID) => {
      Renderer.eraseTask(taskID);
      if (lists[givenListId].getTask(taskID).getDue()) {
        Renderer.updateDueCount(-1);
        Renderer.eraseNotification(taskID);
      }
    });

    // Update the model
    delete lists[givenListId];
    updateStorage({
      type: 'list.remove',
      list_id: givenListId,
    });
  }

  /**
   * Handles modifications of a given list.
   *
   * @param givenListId - id a list to be modified
   * @param updatedList - data of the list to be modified
   */
  function editList(givenListId, updatedList) {
    const newName = updatedList.name;
    const newIcon = updatedList.icon;

    // Check if the user didn't modify anything
    if (
      lists[givenListId].getName() === newName
      && lists[givenListId].getIcon() === newIcon
    ) {
      return true;
    }

    // Validate
    if (hasSameList(newName, newIcon)) {
      return false;
    }

    lists[givenListId].setName(newName);
    lists[givenListId].setIcon(newIcon);

    updateStorage({
      type: 'list.edit',
      list: lists[givenListId],
    });
    Renderer.redrawList(lists[givenListId]);

    return true;
  }

  /**
   * Handles creation of a new task.
   *
   * @param listId - id of the task's list
   * @param taskData - data of the new task
   */
  function addTask(listId, taskData) {
    const taskID = (0,uuid__WEBPACK_IMPORTED_MODULE_3__["default"])();
    const taskName = taskData.name;
    const taskDate = taskData.date;
    const taskTime = taskData.time;
    const taskPriority = taskData.priority;
    const newTask = (0,_task_factory__WEBPACK_IMPORTED_MODULE_0__["default"])(
      lists[listId],
      taskID,
      taskName,
      taskDate,
      taskTime,
      taskPriority,
      false,
    );

    lists[listId].appendTask(newTask);

    updateStorage({
      type: 'task.add_or_edit',
      list_id: listId,
      task: newTask,
    });
    Renderer.drawTask(newTask);
    Renderer.updateTaskCount(listId, +1);
    if (listId !== 'homeList') {
      Renderer.updateTaskCount('homeList', +1);
    }
  }

  /**
   * Handles removal of a task.
   *
   * @param listId - id of the task's list
   * @param taskId - task's id
   */
  function removeTask(listId, taskId) {
    const list = lists[listId];
    const task = list.getTask(taskId);

    // Remove it

    Renderer.eraseTask(taskId);
    Renderer.updateTaskCount(list.getID(), -1);
    if (listId !== 'homeList') {
      Renderer.updateTaskCount('homeList', -1);
    }

    if (task.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.updateDueCount(-1);
    }

    list.popTask(taskId);
    updateStorage({
      type: 'task.remove',
      list_id: list.getID(),
      task_id: taskId,
    });
  }

  /**
   * Handles modification of a task.
   *
   * @param listId - id of the task's list
   * @param taskId - id of the task
   * @param updatedTask - modified data of the task
   */
  function editTask(listId, taskId, updatedTask) {
    const list = lists[listId];
    const targetTask = list.getTask(taskId);

    // Remove the task's due indicators
    if (targetTask.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.updateDueCount(-1);
    }

    // Update it

    const newName = updatedTask.name;
    const newDate = updatedTask.date;
    const newTime = updatedTask.time;
    const newPriority = updatedTask.priority;

    targetTask.setName(newName);
    targetTask.setDate(newDate);
    targetTask.setTime(newTime);
    targetTask.setPriority(newPriority);
    targetTask.setDue(false);

    updateStorage({
      type: 'task.add_or_edit',
      list_id: list.getID(),
      task: targetTask,
    });

    Renderer.redrawTask(targetTask);
  }

  /**
   * Handles moving of a task from a list to another list.
   *
   * @param oldListId - id of a list the task is currently in
   * @param newListId - id of a list where task needs to be moved to
   * @param taskId - id of the task
   */
  function moveTask(oldListId, newListId, taskId, redraw) {
    const oldList = lists[oldListId];
    const targetTask = oldList.getTask(taskId);

    // Copy before removal
    const movedTask = { ...targetTask };
    movedTask.setList(lists[newListId]);

    // Update the display

    if (redraw) {
      Renderer.redrawTask(movedTask);
    } else {
      Renderer.eraseTask(taskId);
    }

    // Update the task's indicators

    if (targetTask.getDue()) {
      Renderer.eraseNotification(taskId);
      Renderer.drawNotification(targetTask);
      if (!redraw) {
        Renderer.updateDueCount(-1);
      }
    }
    if (oldListId !== 'homeList') {
      Renderer.updateTaskCount(oldListId, -1);
    }
    if (newListId !== 'homeList') {
      Renderer.updateTaskCount(newListId, +1);
    }

    // Update the model

    lists[oldListId].popTask(taskId);
    lists[newListId].appendTask(movedTask);

    updateStorage({
      type: 'task.move',
      old_list_id: oldList.getID(),
      new_list_id: newListId,
      task_id: taskId,
    });
  }

  /**
   * Handles sorting of tasks.
   *
   * @param criteria - specifies how to sort tasks
   * @param list_id - id of currently selected list
   * @param givenTaskIDs - ids of displayed tasks
   */
  function sortTasks(criteria, givenTaskIDs) {
    const sorted = [];

    // Obtain task objects
    Object.keys(givenTaskIDs).forEach((taskID) => {
      sorted.push(lists[givenTaskIDs[taskID]].getTask(taskID));
    });
    // Define sorting
    let compareFn;
    if (criteria === 'Name') {
      compareFn = (task1, task2) => {
        const name1 = task1.getName().toUpperCase();
        const name2 = task2.getName().toUpperCase();
        let result = 0;

        if (name1 < name2) {
          result = -1;
        } else if (name1 > name2) {
          result = 1;
        }

        return result;
      };
    } else if (criteria === 'Date') {
      compareFn = (task1, task2) => {
        const date1 = new Date();
        const givenDate1 = task1.getDate();
        date1.setFullYear(
          Number(givenDate1[2]),
          Number(givenDate1[0]) - 1,
          Number(givenDate1[1]),
        );

        const date2 = new Date();
        const givenDate2 = task2.getDate();
        date1.setFullYear(
          Number(givenDate2[2]),
          Number(givenDate2[0]) - 1,
          Number(givenDate2[1]),
        );

        // eslint-disable-next-line no-nested-ternary
        return date1 < date2 ? -1 : date1 === date2 ? 0 : 1;
      };
    } else if (criteria === 'Time') {
      compareFn = (task1, task2) => {
        const time1 = new Date();
        const givenTime1 = task1.getTime();
        const givenHours1 = givenTime1[0] < 12 && givenTime1[2] === 'PM'
          ? 12 + Number(givenTime1[0])
          : Number(givenTime1[0]);
        const givenMinutes1 = Number(givenTime1[1]);

        time1.setHours(givenHours1, givenMinutes1);

        const time2 = new Date();
        const givenTime2 = task2.getTime();
        const givenHours2 = givenTime2[0] < 12 && givenTime2[2] === 'PM'
          ? 12 + Number(givenTime2[0])
          : Number(givenTime2[0]);
        const givenMinutes2 = Number(givenTime2[1]);

        time2.setHours(givenHours2, givenMinutes2);

        // eslint-disable-next-line no-nested-ternary
        return time1 < time2 ? -1 : time1 === time2 ? 0 : 1;
      };
    } else if (criteria === 'Priority') {
      compareFn = (task1, task2) => {
        let priority1 = task1.getPriority();
        priority1 = priority1.slice(0, priority1.indexOf(' '));

        let priority2 = task2.getPriority();
        priority2 = priority2.slice(0, priority2.indexOf(' '));

        let result = 0;
        if (
          (priority1 === 'High'
            && (priority2 === 'Medium' || priority2 === 'Low'))
          || (priority1 === 'Medium' && priority2 === 'Low')
        ) {
          result = 1;
        } else if (
          (priority2 === 'High'
            && (priority1 === 'Medium' || priority1 === 'Low'))
          || (priority2 === 'Medium' && priority1 === 'Low')
        ) {
          result = -1;
        }

        return result;
      };
    }

    // Sort
    sorted.sort(compareFn);

    // Erase displayed non-sorted tasks
    sorted.forEach((task) => Renderer.eraseTask(task.getID()));

    // Draw sorted tasks
    sorted.forEach((task) => Renderer.drawTask(task));
  }

  /**
   * Initialization code.
   */
  function init() {
    Renderer = (0,_renderer__WEBPACK_IMPORTED_MODULE_2__["default"])(this);

    if (Object.keys(localStorage).includes('listStorage')) {
      lists = reviveStorage();

      let currentCount = 0;
      let totalCount = 0;
      // Draw the lists

      Object.keys(lists).forEach((listID) => {
        currentCount = Object.values(lists[listID].getAllTasks()).length;
        if (listID !== 'homeList') {
          Renderer.drawList(lists[listID]);
          Renderer.updateTaskCount(listID, currentCount);
        }

        totalCount += currentCount;
      });

      // Render the 'Home' list
      Renderer.updateTaskCount('homeList', totalCount);
      listView('homeList');
    } else {
      lists = {};
      lists.homeList = (0,_list_factory__WEBPACK_IMPORTED_MODULE_1__["default"])('homeList', 'Home', '🏠️');

      updateStorage({
        type: 'list.add',
        list: lists.homeList,
      });
    }
  }

  return {
    init,
    listView,
    searchView,
    addList,
    removeList,
    editList,
    addTask,
    removeTask,
    editTask,
    moveTask,
    sortTasks,
  };
}


/***/ }),

/***/ "./src/list_factory.js":
/*!*****************************!*\
  !*** ./src/list_factory.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * List model API.
 *
 * @param {string} listId
 * @param {string} listName
 * @param {string} listIcon
 * @returns {object} list
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(listId, listName, listIcon) {
  const tasks = {};

  function getID() {
    return listId;
  }

  function getName() {
    return listName;
  }

  function setName(newName) {
    listName = newName;
  }

  function getIcon() {
    return listIcon;
  }

  function setIcon(newIcon) {
    listIcon = newIcon;
  }

  function getTask(taskId) {
    return tasks[taskId];
  }

  function getAllTasks() {
    return tasks;
  }

  function searchTasks(pattern) {
    if (pattern === /./) {}

    const matched = {};
    const regex = new RegExp(pattern, 'i');
    let taskName;
    Object.keys(tasks).forEach((taskID) => {
        taskName = tasks[taskID].getName();
        if (taskName.match(regex) != null) {
          matched[taskID] = tasks[taskID];
        }
    });

    return matched;
  }

  function appendTask(task) {
    tasks[task.getID()] = task;
  }

  function popTask(taskId) {
    delete tasks[taskId];
  }

  return {
    getID,
    getName,
    setName,
    getIcon,
    setIcon,
    getTask,
    getAllTasks,
    searchTasks,
    appendTask,
    popTask,
  };
}


/***/ }),

/***/ "./src/renderer.js":
/*!*************************!*\
  !*** ./src/renderer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap/js/dist/popover */ "./node_modules/bootstrap/js/dist/popover.js");
/* harmony import */ var bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0__);


/**
 * The module is dealing with DOM-manipulation.
 *
 * @param Controller - object associated with the back-end logic.
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(Controller) {
    const searchInputEl = document.querySelector('#taskSearchInput');
    const notificationListEl = document.querySelector('#notifList');
    const notificationProtoEl = document.querySelector('#notifProto');

    const taskProtoEl = document.querySelector('#taskProto');
    const taskViewEl = document.querySelector('#tasksViewCont');
    const tasksContentEl = document.querySelector('#tasksContent');
    const taskBottomEl = document.querySelector('#taskBottom');
    const taskToolsEl = document.querySelector('#taskTools');
    const taskInputEl = document.querySelector('#taskInput');
    const taskNameInputEl = document.querySelector('#taskNameInput');
    const taskDateInputEl = document.querySelector('#taskDateInput');
    const taskTimeInputEl = document.querySelector('#taskTimeInput');
    const taskPriorityListEl = document.querySelectorAll('.priority');
    const addTaskBtnEl = document.querySelector('#addTaskBtn');
    const removeTaskBtnEl = document.querySelector('#removeTaskBtn');
    const editTaskBtnEl = document.querySelector('#editTaskBtn');
    const moveTaskBtnEl = document.querySelector('#moveTaskBtn');
    const moveToProtoEl = document.querySelector('#moveToProto');
    const cancelTaskBtn = document.querySelector('#taskCancelBtn');

    const listsTogglerEl = document.querySelector('#listsToggler');
    const navTogglerEl = document.querySelector('#navbarToggler');

    const listProtoEl = document.querySelector('#listProto');
    const listViewEl = document.querySelector('#listsViewCont');
    const listsContentEl = document.querySelector('#listsContent');
    const listToolsEl = document.querySelector('#listTools');
    const listInputEl = document.querySelector('#listInput');
    const listNameInputEl = document.querySelector('#listNameInput');
    const listIconPickEl = document.querySelector('#listIconPick');
    const addListBtnEl = document.querySelector('#addListBtn');
    const removeListBtnEl = document.querySelector('#removeListBtn');
    const editListBtnEl = document.querySelector('#editListBtn');
    const confirmListBtnEl = document.querySelector('#listConfirmBtn');
    const cancelListBtnEl = document.querySelector('#listCancelBtn');

    const tasksContentHeight = tasksContentEl.clientHeight;
    const popoverOptions = {
        animation: true,
        placement: 'top',
        fallbackPlacements: ['top', 'right', 'bottom', 'left'],
        trigger: 'focus',
        customClass: 'border border-dark',
    };

    let currentPriority = taskPriorityListEl[0];
    let currentList = document.querySelector('#homeList');

    let prevSearchTerm = '';
    const displayedTasks = {};

    let editListMode = false;
    let editTaskMode = false;

    // eslint-disable-next-line no-use-before-define
    init();

    function showListInput() {
        listToolsEl.remove();
        listViewEl.append(listInputEl);
    }

    function showTaskInput() {
        // Show input
        taskToolsEl.remove();
        taskBottomEl.appendChild(taskInputEl);

        // Responsive behavior
        if (window.innerWidth < 576) {
            const newHeight = tasksContentHeight - taskInputEl.clientHeight + 35;
            tasksContentEl.style.height = `${newHeight}px`;
        }
    }

    /**
     * Responds to the add-list click.
     */
    function handleAddList() {
        // Clear input
        listIconPickEl.innerHTML = '🔵';
        listNameInputEl.value = '';

        showListInput();
    }

    /**
     * Responds to the remove-list click and forwards its handling to Controller.
     */
    function handleRemoveList() {
        const removedList = currentList;
        handleSelectList(document.getElementById('homeList'));
        Controller.removeList(removedList.id);
    }

    /**
     * Responds to the edit-list click.
     */
    function handleEditList() {
        // Sanitize the input
        const listIcon = currentList.querySelector('.list-icon').innerHTML;
        const listName = currentList.querySelector('.list-name').innerHTML;

        // Set the input
        listIconPickEl.innerHTML = listIcon;
        listNameInputEl.value = listName;

        // Update the mode-flag
        if (!editListMode) {
            editListMode = true;
            showListInput();
        }
    }

    /**
     * Responds to the confirm-list click and forwards its handling to Controller.
     */
    function handleConfirmList() {
        // Grab the name
        const givenName = listNameInputEl.value;

        // Validate the name
        if (givenName === '') {
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(listNameInputEl)?.hide();
            popoverOptions.content = 'List name has to have at least one character.';
            popoverOptions.container = listInputEl;
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getOrCreateInstance(listNameInputEl, popoverOptions).show();
            return;
        }

        // Grab the icon
        const givenIcon = listIconPickEl.innerHTML;

        // Pack it up
        const options = {
            name: givenName,
            icon: givenIcon,
        };

        // Forward it
        const validList = editListMode
            ? Controller.editList(currentList.id, options)
            : Controller.addList(options);

        if (!validList) {
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(listNameInputEl)?.hide();
            popoverOptions.content = 'Two lists with the same credentials are not allowed.';
            popoverOptions.container = listInputEl;
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getOrCreateInstance(listNameInputEl, popoverOptions).show();
        } else {
            handleCancelList();
        }
    }

    /**
     * Resets the list-input mode.
     */
    function handleCancelList() {
        listInputEl.remove();
        listViewEl.appendChild(listToolsEl);

        // Reset the mode-flag
        editListMode = false;

        bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(listNameInputEl)?.hide();
    }

    /**
     * Responds to the add-task click.
     */
    function handleAddTask() {
        showTaskInput();

        // Obtain the date

        const now = new Date(Date.now());
        const year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        month = '0'.repeat(2 - month.length) + month;
        let day = now.getDate().toString();
        day = '0'.repeat(2 - day.length) + day;

        let hours = now.getHours();
        hours = '0'.repeat(2 - hours.length) + hours;
        let minutes = now.getMinutes().toString();
        minutes = '0'.repeat(2 - minutes.length) + minutes;

        // Set input
        taskNameInputEl.value = '';
        taskDateInputEl.value = `${year}-${month}-${day}`;
        taskTimeInputEl.value = `${hours}:${minutes}`;
    }

    /**
     * Responds to the remove-task click and forwards its handling to Controller.
     */
    function handleRemoveTask() {
        let parentEl;
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((elTask) => {
                parentEl = elTask.parentElement.parentElement;
                Controller.removeTask(
                    parentEl.querySelector('.list-label').id.slice(9),
                    parentEl.id,
                );
            });
    }

    /**
     * Responds to the edit-task click.
     */
    function handleEditTask() {
        showTaskInput();

        // Sanitize the input

        const selectedTask = document.querySelector(
            'input[type="checkbox"]:checked',
        ).parentElement.parentElement;

        const taskName = selectedTask.querySelector('.name-label').innerHTML;
        const taskPriority = selectedTask.querySelector('.priority-label').innerHTML;
        let taskDate = selectedTask.querySelector('.date-field').innerHTML;
        const taskTime = selectedTask.querySelector('.time-field').innerHTML;

        taskNameInputEl.value = taskName;

        let priorityID;

        if (taskPriority.startsWith('Low')) {
            priorityID = 'low';
        } else if (taskPriority.startsWith('Medium')) {
            priorityID = 'medium';
        } else if (taskPriority.startsWith('High')) {
            priorityID = 'high';
        }

        handleSelectPriority(document.getElementById(priorityID));

        // mm/dd/yyyy -> yyyy-mm-dd
        taskDate = taskDate.split('/');
        taskDateInputEl.value = `${taskDate[2]}-${'0'.repeat(
            2 - taskDate[0].length,
        )}${taskDate[0]}-${'0'.repeat(2 - taskDate[1].length)}${taskDate[1]}`;

        // HH:MM AM/PM (12 hr) -> HH:MM (24 hr)
        const colon = taskTime.indexOf(':');
        let hours = taskTime.slice(0, colon);
        hours = taskTime.endsWith('PM') && hours < 12 ? 12 + Number(hours) : hours;
        const minutes = taskTime.slice(colon + 1, colon + 3);

        taskTimeInputEl.value = `${hours}:${minutes}`;

        // Update the mode-flag
        editTaskMode = true;
    }

    /**
     * Responds to the move-task click and forwards its handling to Controller.
     *
     * @param {string} destListID - id of a list where the task needs to be moved to
     */
    function handleMoveTask(destListID) {
        let taskID;
        let listID;
        const redraw = currentList.id === 'homeList';
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((elTask) => {
                taskID = elTask.id.slice(0, -5);
                listID = elTask.parentElement.parentElement
                    .querySelector('.list-label')
                    .id.slice(9);
                Controller.moveTask(listID, destListID, taskID, redraw);
            });
    }

    /**
     * Responds to the confirm-task click and forwards its handling to Controller.
     */
    function handleConfirmTask() {
        let isValid = true;

        // Validate name

        const givenName = taskNameInputEl.value;

        if (givenName === '') {
            popoverOptions.content = 'Name has to have at least one character.';
            popoverOptions.container = taskNameInputEl.parentElement;
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getOrCreateInstance(taskNameInputEl, popoverOptions).show();

            isValid = false;
        }

        // Validate time

        let givenDate;
        const now = new Date(Date.now());
        if (taskDateInputEl.value === '') {
            givenDate = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        } else {
            givenDate = taskDateInputEl.value.split('-');
        }

        const givenYear = givenDate[0];
        const givenMonth = givenDate[1];
        const givenDay = givenDate[2];

        const givenHours = taskTimeInputEl.value.slice(0, 2);
        const givenMinutes = taskTimeInputEl.value.slice(3);

        const givenTimestamp = new Date();

        givenTimestamp.setFullYear(
            Number(givenYear),
            Number(givenMonth - 1),
            Number(givenDay),
        );
        givenTimestamp.setHours(Number(givenHours), Number(givenMinutes));

        if (givenTimestamp <= now) {
            popoverOptions.content = 'Time set has to be in the future!';
            popoverOptions.container = taskNameInputEl.parentElement;
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getOrCreateInstance(taskDateInputEl, popoverOptions).show();

            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Grab the priority
        const givenPriority = currentPriority.innerHTML;

        // Ship it

        const options = {
            name: givenName,
            date: [givenMonth, givenDay, givenYear],
            time: [
                givenHours > 12 ? givenHours - 12 : givenHours,
                givenMinutes,
                givenHours >= 12 ? 'PM' : 'AM',
            ],
            priority: givenPriority,
        };

        if (editTaskMode) {
            const elTaskCheck = document.querySelector(
                'input[type="checkbox"]:checked',
            );
            const taskID = elTaskCheck.id.slice(0, -5);
            const listID = elTaskCheck.parentElement.parentElement
                .querySelector('.list-label')
                .id.slice(9);

            Controller.editTask(listID, taskID, options);
        } else {
            Controller.addTask(currentList.id, options);
        }

        // Remove the input
        handleCancelTask();
    }

    /**
     * Resets the task-input mode.
     */
    function handleCancelTask() {
        // Responsive behavior
        if (window.innerWidth < 576) {
            tasksContentEl.style.height = `${tasksContentHeight}px`;
        }

        bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(taskNameInputEl)?.hide();
        bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(taskDateInputEl)?.hide();

        taskInputEl.remove();
        taskBottomEl.appendChild(taskToolsEl);
        editTaskMode = false;
    }

    /**
     * Responds to the opening/closing of the list-menu.
     */
    function handleToggleLists() {
        if (window.innerWidth > 576) {
            if (listsTogglerEl.classList.contains('bi-arrow-right')) {
                listsTogglerEl.classList.remove('bi-arrow-right');
                listsTogglerEl.classList.add('bi-arrow-left');
            } else {
                listsTogglerEl.classList.remove('bi-arrow-left');
                listsTogglerEl.classList.add('bi-arrow-right');
            }
        } else if (navTogglerEl.classList.contains('bi-list')) {
            navTogglerEl.classList.remove('bi-list');
            navTogglerEl.classList.add('bi-x');
        } else {
            navTogglerEl.classList.remove('bi-x');
            navTogglerEl.classList.add('bi-list');
        }

        listViewEl.classList.toggle('expanded');
        taskViewEl.classList.toggle('shrinked');
    }

    /**
     * Responds to a list-selection and forwards its handling to Controller.
     *
     * @param {HTMLElement} selectedList - list to be rendered
     */
    function handleSelectList(selectedList) {
        if (
            currentList === selectedList
            || (selectedList.id === 'homeList' && editListMode)
        ) {
            return;
        }

        // Close the input
        if (taskInputEl.isConnected) {
            handleCancelTask();
        }

        // Reset the moving-list
        if (currentList.id !== 'homeList') {
            moveTaskBtnEl.nextElementSibling.querySelector(
                `#moveTo${currentList.id}`,
            ).style.display = 'block';
        }
        if (selectedList.id !== 'homeList') {
            moveTaskBtnEl.nextElementSibling.querySelector(
                `#moveTo${selectedList.id}`,
            ).style.display = 'none';
        }

        // Responsive behavior of list-tools
        if (selectedList.id === 'homeList') {
            removeListBtnEl.remove();
            editListBtnEl.remove();
        } else if (listToolsEl.children.length === 1) {
            listToolsEl.appendChild(removeListBtnEl);
            listToolsEl.appendChild(editListBtnEl);
        }

        // Reset task-tools
        document
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((checkInput) => {
                checkInput.checked = false;
            });
        handleSelectTask();

        // Update classes of lists
        currentList.classList.remove('active');
        selectedList.classList.add('active');

        // Update the title
        document.getElementById('infoHeader').querySelector('.title').innerHTML = selectedList.querySelector('.list-name').innerHTML;

        // Reset the state
        currentList = selectedList;

        // Render the new list
        Controller.listView(selectedList.id, displayedTasks);

        if (editListMode) {
            handleEditList();
        }
    }

    /**
     * Responds to a task-selection.
     */
    function handleSelectTask() {
        // Responsive behavior of task-tools

        const nSelected = document.querySelectorAll(
            'input[type="checkbox"]:checked',
        ).length;

        if (nSelected === 0) {
            removeTaskBtnEl.parentElement.remove();
            editTaskBtnEl.parentElement.remove();
            moveTaskBtnEl.parentElement.remove();
        } else if (nSelected === 1) {
            if (taskToolsEl.children.length === 3) {
                taskToolsEl.insertBefore(
                    editTaskBtnEl.parentElement,
                    moveTaskBtnEl.parentElement,
                );
            } else {
                taskToolsEl.appendChild(removeTaskBtnEl.parentElement);
                taskToolsEl.appendChild(editTaskBtnEl.parentElement);
                taskToolsEl.appendChild(moveTaskBtnEl.parentElement);
            }
        } else {
            editTaskBtnEl.parentElement.remove();
        }
    }

    /**
     * Responds to a priority-selection from task-input.
     *
     * @param {HTMLElement} elPriorityInput - element associated with a selected priority
     */
    function handleSelectPriority(elPriorityInput) {
        if (currentPriority === elPriorityInput) {
            return;
        }

        currentPriority.removeAttribute('aria-current');
        currentPriority.classList.remove('active-priority');

        elPriorityInput.setAttribute('aria-current', 'true');
        elPriorityInput.classList.add('active-priority');

        currentPriority = elPriorityInput;
    }

    /**
     * Responds to a search and forwards its handling to Controller.
     */
    function handleSearch() {
        let searchTerm = this.value;

        if (prevSearchTerm === '' && searchTerm === '') {
            return;
        }
        if (prevSearchTerm !== '' && searchTerm === '') {
            searchTerm = /./;
        }

        Controller.searchView(currentList.id, searchTerm, displayedTasks);
        prevSearchTerm = searchTerm;
    }

    /**
     * Responds to a sort and forwards its handling to Controller.
     *
     * @param {string} criteria
     */
    function handleFilter(criteria) {
        Controller.sortTasks(criteria, displayedTasks);
    }

    /**
     * Creates a new DOM-element for a new list and populates it with given data.
     *
     * @param {List} list - object of a new list
     */
    function drawList(list) {
        // Copy the template
        const elNewList = listProtoEl.cloneNode(true);

        // Configure the new element

        elNewList.id = list.getID();
        elNewList.addEventListener(
            'click',
            handleSelectList.bind(null, elNewList),
        );
        elNewList.children[0].innerHTML = list.getIcon();
        elNewList.children[1].innerHTML = list.getName();

        listsContentEl.appendChild(elNewList);

        // Add the reference to the moving-list

        const elListRef = moveToProtoEl.cloneNode(true);
        elListRef.id = `moveTo${list.getID()}`;
        elListRef.addEventListener(
            'click',
            handleMoveTask.bind(null, list.getID()),
        );
        elListRef.children[0].innerHTML = `${list.getIcon()} ${list.getName()}`;

        moveTaskBtnEl.nextElementSibling.appendChild(elListRef);
    }

    /**
     * Removes a DOM-element of a given list.
     *
     * @param {string} givenListId - id of a list to be removed
     */
    function eraseList(givenListId) {
        document.getElementById(givenListId).remove();
    }

    /**
     * Updates a DOM-element of a given list.
     *
     * @param {List} updatedList - object of a list to be updated
     */
    function redrawList(updatedList) {
        const elUpdatedList = document.getElementById(updatedList.getID());

        elUpdatedList.querySelector('.list-icon').innerHTML = updatedList.getIcon();
        elUpdatedList.querySelector('.list-name').innerHTML = updatedList.getName();
    }

    /**
     * Creates a DOM-element of a given task.
     *
     * @param {Task} task - object of a task to be created
     */
    function drawTask(task) {
        // Copy the template
        const elNewTask = taskProtoEl.cloneNode(true);

        // Configure the new element

        // Add name
        elNewTask.id = task.getID();
        elNewTask.addEventListener(
            'click',
            handleSelectTask.bind(null, elNewTask),
        );
        elNewTask.querySelector('input').id = `${task.getID()}Check`;
        elNewTask.querySelector('.name-label').innerHTML = task.getName();
        elNewTask
            .querySelector('.name-label')
            .setAttribute('for', `${task.getID()}Check`);

        // Add priority
        const givenPriority = task.getPriority();
        elNewTask.querySelector('.priority-label').innerHTML = givenPriority;
        if (givenPriority.startsWith('High')) {
            elNewTask.querySelector('.priority-label').classList.add('high');
        } else if (givenPriority.startsWith('Medium')) {
            elNewTask.querySelector('.priority-label').classList.add('medium');
        } else if (givenPriority.startsWith('Low')) {
            elNewTask.querySelector('.priority-label').classList.add('low');
        }

        // Add list
        elNewTask.querySelector('.list-label').innerHTML = `${task
            .getList()
            .getIcon()} ${task.getList().getName()}`;
        elNewTask.querySelector('.list-label').id = `listLabel${task
            .getList()
            .getID()}`;
        if (currentList.id === 'homeList') {
            elNewTask.querySelector('.list-label').classList.remove('hide');
        } else {
            elNewTask.querySelector('.list-label').classList.add('hide');
        }

        // Add date
        const givenDate = task.getDate();
        elNewTask.querySelector(
            '.date-field',
        ).innerHTML = `${givenDate[0]}/${givenDate[1]}/${givenDate[2]}`;

        // Add time
        const givenTime = task.getTime();
        const givenHours = givenTime[0];
        const givenMinutes = givenTime[1];
        const givenPeriod = givenTime[2];

        elNewTask.querySelector(
            '.time-field',
        ).innerHTML = `${givenHours}:${givenMinutes} ${givenPeriod}`;

        if (task.getDue()) {
            elNewTask.querySelector('.time-field').classList.add('due');
            elNewTask.querySelector('.date-field').classList.add('due');
        }

        // Add to the map
        displayedTasks[task.getID()] = task.getList().getID();
        tasksContentEl.appendChild(elNewTask);
    }

    /**
     * Removes a DOM-element of a given task.
     *
     * @param {string} givenTaskId - id of a task to be removed
     */
    function eraseTask(givenTaskId) {
        // Update the display
        document.getElementById(givenTaskId).remove();
        delete displayedTasks[givenTaskId];
    }

    /**
     * Updates a DOM-element of a given task.
     *
     * @param {Task} updatedTask - object of a task to be updated
     */
    function redrawTask(updatedTask) {
        const taskID = updatedTask.getID();

        // Update the name
        document.getElementById(taskID).querySelector('.name-label').innerHTML = updatedTask.getName();

        // Update the priority

        const newPriority = updatedTask.getPriority();
        const oldPriority = document
            .getElementById(taskID)
            .querySelector('.priority-label').innerHTML;
        let newClass;
        let oldClass;

        if (newPriority.startsWith('High')) {
            newClass = 'high';
        } else if (newPriority.startsWith('Medium')) {
            newClass = 'medium';
        } else if (newPriority.startsWith('Low')) {
            newClass = 'low';
        }

        if (oldPriority.startsWith('High')) {
            oldClass = 'high';
        } else if (oldPriority.startsWith('Medium')) {
            oldClass = 'medium';
        } else if (oldPriority.startsWith('Low')) {
            oldClass = 'low';
        }

        document
            .getElementById(taskID)
            .querySelector('.priority-label')
            .classList.remove(oldClass);
        document
            .getElementById(taskID)
            .querySelector('.priority-label')
            .classList.add(newClass);
        document.getElementById(taskID).querySelector('.priority-label').innerHTML = newPriority;

        // Update the list
        document
            .getElementById(taskID)
            .querySelector('.list-label').innerHTML = `${updatedTask
                .getList()
                .getIcon()} ${updatedTask.getList().getName()}`;
        document
            .getElementById(taskID)
            .querySelector('.list-label').id = `listLabel${updatedTask
                .getList()
                .getID()}`;

        // Update the date

        const givenDate = updatedTask.getDate();
        document
            .getElementById(taskID)
            .querySelector(
                '.date-field',
            ).innerHTML = `${givenDate[0]}/${givenDate[1]}/${givenDate[2]}`;

        // Update the time

        const givenTime = updatedTask.getTime();
        document
            .getElementById(taskID)
            .querySelector(
                '.time-field',
            ).innerHTML = `${givenTime[0]}:${givenTime[1]} ${givenTime[2]}`;

        document
            .getElementById(taskID)
            .querySelector('.date-field')
            .classList.remove('due');
        document
            .getElementById(taskID)
            .querySelector('.time-field')
            .classList.remove('due');

        // Update the map
        displayedTasks[updatedTask.getID()] = updatedTask.getList().getID();
    }

    /**
     * Creates a DOM-element of a notification of a given task.
     *
     * @param {Task} task - notification's task
     */
    function drawNotification(task) {
        // Check if the element is already exist
        if (document.querySelector(`#notif${task.getID()}`) != null) {
            return;
        }

        const list = task.getList();

        // Update the bell with the red circle
        document.querySelector('.red-circle').style.opacity = '1';

        // Copy the template
        const elNotif = notificationProtoEl.cloneNode(true);

        // Configure the element
        elNotif.id = `notif${task.getID()}`;
        elNotif.children[0].innerHTML = `${list.getIcon()} ${list.getName()}`;
        elNotif.children[1].innerHTML = `${task.getName()} is due`;

        notificationListEl.appendChild(elNotif);
    }

    /**
     * Removes a DOM-element of a task's notification
     *
     * @param {string} givenTaskId - id of a notification's task
     */
    function eraseNotification(givenTaskId) {
        document.querySelector(`#notif${givenTaskId}`).remove();

        // Update the bell with the red circle
        if (notificationListEl.children.length === 0) {
            document.querySelector('.red-circle').style.opacity = '0';
        }
    }

    /**
     * Updates a DOM-element that displays task count of a given list.
     *
     * @param {string} givenListId - id of a list that associated with the count
     * @param {number} change - update for the count
     */
    function updateTaskCount(givenListId, change) {
        const elTaskCount = document
            .getElementById(givenListId)
            .querySelector('.task-count');
        const count = Number(elTaskCount.innerHTML) + change;
        elTaskCount.innerHTML = count;
    }

    /**
     * Updates the DOM-element that displays count of due-tasks.
     *
     * @param {number} change - update for the count
     */
    function updateDueCount(change) {
        let count;

        if (change === 0) {
            count = 0;
        } else {
            count = Number(document.querySelector('#dueCount').innerHTML) + change;
        }

        document.querySelector('#dueCount').innerHTML = count;
    }

    /**
     * Configures global variables.
     */
    function init() {
        document.querySelector('#bellBtn').addEventListener('click', () => {
            document.querySelector('.red-circle').style.opacity = '0';
        });
        document.querySelectorAll('.filterLink').forEach((filter) => {
            filter.addEventListener(
                'click',
                handleFilter.bind(null, filter.innerHTML),
            );
        });
        searchInputEl.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
        searchInputEl.addEventListener(
            'input',
            handleSearch.bind(searchInputEl, null),
        );

        addListBtnEl.addEventListener('click', handleAddList);
        removeListBtnEl.addEventListener('click', handleRemoveList);
        editListBtnEl.addEventListener('click', handleEditList);
        confirmListBtnEl.addEventListener('click', handleConfirmList);
        cancelListBtnEl.addEventListener('click', handleCancelList);
        document
            .querySelector('emoji-picker')
            .addEventListener('emoji-click', (event) => {
                listIconPickEl.innerHTML = event.detail.unicode;
            });
        document.querySelectorAll('.list').forEach((list) => {
            list.addEventListener('click', handleSelectList.bind(null, list));
        });

        addTaskBtnEl.addEventListener('click', handleAddTask);
        removeTaskBtnEl.addEventListener('click', handleRemoveTask);
        editTaskBtnEl.addEventListener('click', handleEditTask);
        taskInputEl.addEventListener('submit', (e) => {
            e.preventDefault();
            handleConfirmTask();
        });
        taskNameInputEl.addEventListener('click', () => {
            bootstrap_js_dist_popover__WEBPACK_IMPORTED_MODULE_0___default().getInstance(taskNameInputEl)?.hide();
        });
        cancelTaskBtn.addEventListener('click', handleCancelTask);
        taskPriorityListEl.forEach((priority) => {
            priority.addEventListener(
                'click',
                handleSelectPriority.bind(null, priority),
            );
        });

        listsTogglerEl.addEventListener('click', handleToggleLists);
        navTogglerEl.addEventListener('click', handleToggleLists);

        const now = new Date(Date.now());
        taskDateInputEl.setAttribute(
            'min',
            `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        );

        notificationProtoEl.remove();
        moveToProtoEl.remove();
        taskProtoEl.remove();
        listProtoEl.remove();
        taskInputEl.remove();
        listInputEl.remove();
        removeListBtnEl.remove();
        editListBtnEl.remove();
        removeTaskBtnEl.parentElement.remove();
        editTaskBtnEl.parentElement.remove();
        moveTaskBtnEl.parentElement.remove();
    }

    return {
        drawList,
        redrawList,
        eraseList,
        drawTask,
        eraseTask,
        redrawTask,
        drawNotification,
        eraseNotification,
        updateTaskCount,
        updateDueCount,
    };
}


/***/ }),

/***/ "./src/task_factory.js":
/*!*****************************!*\
  !*** ./src/task_factory.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Task model API.
 *
 * @param {string} taskId
 * @param {string} taskName
 * @param {string} taskDate
 * @param {string} taskTime
 * @param {string} taskPriority
 * @param {boolean} isDue
 * @returns {object} task
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(taskList, taskId, taskName, taskDate, taskTime, taskPriority, isDue) {
  function getList() {
    return taskList;
  }

  function setList(newList) {
    taskList = newList;
  }

  function getID() {
    return taskId;
  }

  function getName() {
    return taskName;
  }

  function setName(newName) {
    taskName = newName;
  }

  function getDate() {
    return taskDate;
  }

  function setDate(newDate) {
    taskDate = newDate;
  }

  function getTime() {
    return taskTime;
  }

  function setTime(newTime) {
    taskTime = newTime;
  }

  function getPriority() {
    return taskPriority;
  }

  function setPriority(newPriority) {
    taskPriority = newPriority;
  }

  function getDue() {
    return isDue;
  }

  function setDue(newIsDue) {
    isDue = newIsDue;
  }

  return {
    getList,
    setList,
    getID,
    getName,
    setName,
    getDate,
    setDate,
    getTime,
    setTime,
    getPriority,
    setPriority,
    getDue,
    setDue,
  };
}


/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%272%27 fill=%27%23fff%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e":
/*!*********************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e ***!
  \*********************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%2386b7fe%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27%23fff%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e":
/*!***********************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e ***!
  \***********************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%27-4 -4 8 8%27%3e%3ccircle r=%273%27 fill=%27rgba%280, 0, 0, 0.25%29%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath d=%27M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%230c63e4%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23212529%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M2 5l6 6 6-6%27/%3e%3c/svg%3e":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M2 5l6 6 6-6%27/%3e%3c/svg%3e ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M2 5l6 6 6-6%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10h8%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10l3 3l6-6%27/%3e%3c/svg%3e":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10l3 3l6-6%27/%3e%3c/svg%3e ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27M6 10l3 3l6-6%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%280, 0, 0, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e":
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3e%3cpath stroke=%27rgba%28255, 255, 255, 0.55%29%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3e%3c/svg%3e";

/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e";

/***/ }),

/***/ "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2?30af91bf14e37666a085fb8a161ff36d":
/*!********************************************************************************************************!*\
  !*** ./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2?30af91bf14e37666a085fb8a161ff36d ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2b56e79ae5013246de29.woff2?30af91bf14e37666a085fb8a161ff36d";

/***/ }),

/***/ "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff?30af91bf14e37666a085fb8a161ff36d":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff?30af91bf14e37666a085fb8a161ff36d ***!
  \*******************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "38c4d2499557ae0379fd.woff?30af91bf14e37666a085fb8a161ff36d";

/***/ }),

/***/ "./node_modules/emoji-picker-element/database.js":
/*!*******************************************************!*\
  !*** ./node_modules/emoji-picker-element/database.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function assertNonEmptyString (str) {
  if (typeof str !== 'string' || !str) {
    throw new Error('expected a non-empty string, got: ' + str)
  }
}

function assertNumber (number) {
  if (typeof number !== 'number') {
    throw new Error('expected a number, got: ' + number)
  }
}

const DB_VERSION_CURRENT = 1;
const DB_VERSION_INITIAL = 1;
const STORE_EMOJI = 'emoji';
const STORE_KEYVALUE = 'keyvalue';
const STORE_FAVORITES = 'favorites';
const FIELD_TOKENS = 'tokens';
const INDEX_TOKENS = 'tokens';
const FIELD_UNICODE = 'unicode';
const INDEX_COUNT = 'count';
const FIELD_GROUP = 'group';
const FIELD_ORDER = 'order';
const INDEX_GROUP_AND_ORDER = 'group-order';
const KEY_ETAG = 'eTag';
const KEY_URL = 'url';
const KEY_PREFERRED_SKINTONE = 'skinTone';
const MODE_READONLY = 'readonly';
const MODE_READWRITE = 'readwrite';
const INDEX_SKIN_UNICODE = 'skinUnicodes';
const FIELD_SKIN_UNICODE = 'skinUnicodes';

const DEFAULT_DATA_SOURCE = 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json';
const DEFAULT_LOCALE = 'en';

// like lodash's uniqBy but much smaller
function uniqBy (arr, func) {
  const set = new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set.has(key)) {
      set.add(key);
      res.push(item);
    }
  }
  return res
}

function uniqEmoji (emojis) {
  return uniqBy(emojis, _ => _.unicode)
}

function initialMigration (db) {
  function createObjectStore (name, keyPath, indexes) {
    const store = keyPath
      ? db.createObjectStore(name, { keyPath })
      : db.createObjectStore(name);
    if (indexes) {
      for (const [indexName, [keyPath, multiEntry]] of Object.entries(indexes)) {
        store.createIndex(indexName, keyPath, { multiEntry });
      }
    }
    return store
  }

  createObjectStore(STORE_KEYVALUE);
  createObjectStore(STORE_EMOJI, /* keyPath */ FIELD_UNICODE, {
    [INDEX_TOKENS]: [FIELD_TOKENS, /* multiEntry */ true],
    [INDEX_GROUP_AND_ORDER]: [[FIELD_GROUP, FIELD_ORDER]],
    [INDEX_SKIN_UNICODE]: [FIELD_SKIN_UNICODE, /* multiEntry */ true]
  });
  createObjectStore(STORE_FAVORITES, undefined, {
    [INDEX_COUNT]: ['']
  });
}

const openReqs = {};
const databaseCache = {};
const onCloseListeners = {};

function handleOpenOrDeleteReq (resolve, reject, req) {
  // These things are almost impossible to test with fakeIndexedDB sadly
  /* istanbul ignore next */
  req.onerror = () => reject(req.error);
  /* istanbul ignore next */
  req.onblocked = () => reject(new Error('IDB blocked'));
  req.onsuccess = () => resolve(req.result);
}

async function createDatabase (dbName) {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION_CURRENT);
    openReqs[dbName] = req;
    req.onupgradeneeded = e => {
      // Technically there is only one version, so we don't need this `if` check
      // But if an old version of the JS is in another browser tab
      // and it gets upgraded in the future and we have a new DB version, well...
      // better safe than sorry.
      /* istanbul ignore else */
      if (e.oldVersion < DB_VERSION_INITIAL) {
        initialMigration(req.result);
      }
    };
    handleOpenOrDeleteReq(resolve, reject, req);
  });
  // Handle abnormal closes, e.g. "delete database" in chrome dev tools.
  // No need for removeEventListener, because once the DB can no longer
  // fire "close" events, it will auto-GC.
  // Unfortunately cannot test in fakeIndexedDB: https://github.com/dumbmatter/fakeIndexedDB/issues/50
  /* istanbul ignore next */
  db.onclose = () => closeDatabase(dbName);
  return db
}

function openDatabase (dbName) {
  if (!databaseCache[dbName]) {
    databaseCache[dbName] = createDatabase(dbName);
  }
  return databaseCache[dbName]
}

function dbPromise (db, storeName, readOnlyOrReadWrite, cb) {
  return new Promise((resolve, reject) => {
    // Use relaxed durability because neither the emoji data nor the favorites/preferred skin tone
    // are really irreplaceable data. IndexedDB is just a cache in this case.
    const txn = db.transaction(storeName, readOnlyOrReadWrite, { durability: 'relaxed' });
    const store = typeof storeName === 'string'
      ? txn.objectStore(storeName)
      : storeName.map(name => txn.objectStore(name));
    let res;
    cb(store, txn, (result) => {
      res = result;
    });

    txn.oncomplete = () => resolve(res);
    /* istanbul ignore next */
    txn.onerror = () => reject(txn.error);
  })
}

function closeDatabase (dbName) {
  // close any open requests
  const req = openReqs[dbName];
  const db = req && req.result;
  if (db) {
    db.close();
    const listeners = onCloseListeners[dbName];
    /* istanbul ignore else */
    if (listeners) {
      for (const listener of listeners) {
        listener();
      }
    }
  }
  delete openReqs[dbName];
  delete databaseCache[dbName];
  delete onCloseListeners[dbName];
}

function deleteDatabase (dbName) {
  return new Promise((resolve, reject) => {
    // close any open requests
    closeDatabase(dbName);
    const req = indexedDB.deleteDatabase(dbName);
    handleOpenOrDeleteReq(resolve, reject, req);
  })
}

// The "close" event occurs during an abnormal shutdown, e.g. a user clearing their browser data.
// However, it doesn't occur with the normal "close" event, so we handle that separately.
// https://www.w3.org/TR/IndexedDB/#close-a-database-connection
function addOnCloseListener (dbName, listener) {
  let listeners = onCloseListeners[dbName];
  if (!listeners) {
    listeners = onCloseListeners[dbName] = [];
  }
  listeners.push(listener);
}

// list of emoticons that don't match a simple \W+ regex
// extracted using:
// require('emojibase-data/en/data.json').map(_ => _.emoticon).filter(Boolean).filter(_ => !/^\W+$/.test(_))
const irregularEmoticons = new Set([
  ':D', 'xD', ":'D", 'o:)',
  ':x', ':p', ';p', 'xp',
  ':l', ':z', ':j', '8D',
  'xo', '8)', ':B', ':o',
  ':s', ":'o", 'Dx', 'x(',
  'D:', ':c', '>0)', ':3',
  '</3', '<3', '\\m/', ':E',
  '8#'
]);

function extractTokens (str) {
  return str
    .split(/[\s_]+/)
    .map(word => {
      if (!word.match(/\w/) || irregularEmoticons.has(word)) {
        // for pure emoticons like :) or :-), just leave them as-is
        return word.toLowerCase()
      }

      return word
        .replace(/[)(:,]/g, '')
        .replace(/’/g, "'")
        .toLowerCase()
    }).filter(Boolean)
}

const MIN_SEARCH_TEXT_LENGTH = 2;

// This is an extra step in addition to extractTokens(). The difference here is that we expect
// the input to have already been run through extractTokens(). This is useful for cases like
// emoticons, where we don't want to do any tokenization (because it makes no sense to split up
// ">:)" by the colon) but we do want to lowercase it to have consistent search results, so that
// the user can type ':P' or ':p' and still get the same result.
function normalizeTokens (str) {
  return str
    .filter(Boolean)
    .map(_ => _.toLowerCase())
    .filter(_ => _.length >= MIN_SEARCH_TEXT_LENGTH)
}

// Transform emoji data for storage in IDB
function transformEmojiData (emojiData) {
  const res = emojiData.map(({ annotation, emoticon, group, order, shortcodes, skins, tags, emoji, version }) => {
    const tokens = [...new Set(
      normalizeTokens([
        ...(shortcodes || []).map(extractTokens).flat(),
        ...tags.map(extractTokens).flat(),
        ...extractTokens(annotation),
        emoticon
      ])
    )].sort();
    const res = {
      annotation,
      group,
      order,
      tags,
      tokens,
      unicode: emoji,
      version
    };
    if (emoticon) {
      res.emoticon = emoticon;
    }
    if (shortcodes) {
      res.shortcodes = shortcodes;
    }
    if (skins) {
      res.skinTones = [];
      res.skinUnicodes = [];
      res.skinVersions = [];
      for (const { tone, emoji, version } of skins) {
        res.skinTones.push(tone);
        res.skinUnicodes.push(emoji);
        res.skinVersions.push(version);
      }
    }
    return res
  });
  return res
}

// helper functions that help compress the code better

function callStore (store, method, key, cb) {
  store[method](key).onsuccess = e => (cb && cb(e.target.result));
}

function getIDB (store, key, cb) {
  callStore(store, 'get', key, cb);
}

function getAllIDB (store, key, cb) {
  callStore(store, 'getAll', key, cb);
}

function commit (txn) {
  /* istanbul ignore else */
  if (txn.commit) {
    txn.commit();
  }
}

// like lodash's minBy
function minBy (array, func) {
  let minItem = array[0];
  for (let i = 1; i < array.length; i++) {
    const item = array[i];
    if (func(minItem) > func(item)) {
      minItem = item;
    }
  }
  return minItem
}

// return an array of results representing all items that are found in each one of the arrays

function findCommonMembers (arrays, uniqByFunc) {
  const shortestArray = minBy(arrays, _ => _.length);
  const results = [];
  for (const item of shortestArray) {
    // if this item is included in every array in the intermediate results, add it to the final results
    if (!arrays.some(array => array.findIndex(_ => uniqByFunc(_) === uniqByFunc(item)) === -1)) {
      results.push(item);
    }
  }
  return results
}

async function isEmpty (db) {
  return !(await get(db, STORE_KEYVALUE, KEY_URL))
}

async function hasData (db, url, eTag) {
  const [oldETag, oldUrl] = await Promise.all([KEY_ETAG, KEY_URL]
    .map(key => get(db, STORE_KEYVALUE, key)));
  return (oldETag === eTag && oldUrl === url)
}

async function doFullDatabaseScanForSingleResult (db, predicate) {
  // This batching algorithm is just a perf improvement over a basic
  // cursor. The BATCH_SIZE is an estimate of what would give the best
  // perf for doing a full DB scan (worst case).
  //
  // Mini-benchmark for determining the best batch size:
  //
  // PERF=1 yarn build:rollup && yarn test:adhoc
  //
  // (async () => {
  //   performance.mark('start')
  //   await $('emoji-picker').database.getEmojiByShortcode('doesnotexist')
  //   performance.measure('total', 'start')
  //   console.log(performance.getEntriesByName('total').slice(-1)[0].duration)
  // })()
  const BATCH_SIZE = 50; // Typically around 150ms for 6x slowdown in Chrome for above benchmark
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    let lastKey;

    const processNextBatch = () => {
      emojiStore.getAll(lastKey && IDBKeyRange.lowerBound(lastKey, true), BATCH_SIZE).onsuccess = e => {
        const results = e.target.result;
        for (const result of results) {
          lastKey = result.unicode;
          if (predicate(result)) {
            return cb(result)
          }
        }
        if (results.length < BATCH_SIZE) {
          return cb()
        }
        processNextBatch();
      };
    };
    processNextBatch();
  })
}

async function loadData (db, emojiData, url, eTag) {
  try {
    const transformedData = transformEmojiData(emojiData);
    await dbPromise(db, [STORE_EMOJI, STORE_KEYVALUE], MODE_READWRITE, ([emojiStore, metaStore], txn) => {
      let oldETag;
      let oldUrl;
      let todo = 0;

      function checkFetched () {
        if (++todo === 2) { // 2 requests made
          onFetched();
        }
      }

      function onFetched () {
        if (oldETag === eTag && oldUrl === url) {
          // check again within the transaction to guard against concurrency, e.g. multiple browser tabs
          return
        }
        // delete old data
        emojiStore.clear();
        // insert new data
        for (const data of transformedData) {
          emojiStore.put(data);
        }
        metaStore.put(eTag, KEY_ETAG);
        metaStore.put(url, KEY_URL);
        commit(txn);
      }

      getIDB(metaStore, KEY_ETAG, result => {
        oldETag = result;
        checkFetched();
      });

      getIDB(metaStore, KEY_URL, result => {
        oldUrl = result;
        checkFetched();
      });
    });
  } finally {
  }
}

async function getEmojiByGroup (db, group) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    const range = IDBKeyRange.bound([group, 0], [group + 1, 0], false, true);
    getAllIDB(emojiStore.index(INDEX_GROUP_AND_ORDER), range, cb);
  })
}

async function getEmojiBySearchQuery (db, query) {
  const tokens = normalizeTokens(extractTokens(query));

  if (!tokens.length) {
    return []
  }

  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
    // get all results that contain all tokens (i.e. an AND query)
    const intermediateResults = [];

    const checkDone = () => {
      if (intermediateResults.length === tokens.length) {
        onDone();
      }
    };

    const onDone = () => {
      const results = findCommonMembers(intermediateResults, _ => _.unicode);
      cb(results.sort((a, b) => a.order < b.order ? -1 : 1));
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const range = i === tokens.length - 1
        ? IDBKeyRange.bound(token, token + '\uffff', false, true) // treat last token as a prefix search
        : IDBKeyRange.only(token); // treat all other tokens as an exact match
      getAllIDB(emojiStore.index(INDEX_TOKENS), range, result => {
        intermediateResults.push(result);
        checkDone();
      });
    }
  })
}

// This could have been implemented as an IDB index on shortcodes, but it seemed wasteful to do that
// when we can already query by tokens and this will give us what we're looking for 99.9% of the time
async function getEmojiByShortcode (db, shortcode) {
  const emojis = await getEmojiBySearchQuery(db, shortcode);

  // In very rare cases (e.g. the shortcode "v" as in "v for victory"), we cannot search because
  // there are no usable tokens (too short in this case). In that case, we have to do an inefficient
  // full-database scan, which I believe is an acceptable tradeoff for not having to have an extra
  // index on shortcodes.

  if (!emojis.length) {
    const predicate = _ => ((_.shortcodes || []).includes(shortcode.toLowerCase()));
    return (await doFullDatabaseScanForSingleResult(db, predicate)) || null
  }

  return emojis.filter(_ => {
    const lowerShortcodes = (_.shortcodes || []).map(_ => _.toLowerCase());
    return lowerShortcodes.includes(shortcode.toLowerCase())
  })[0] || null
}

async function getEmojiByUnicode (db, unicode) {
  return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => (
    getIDB(emojiStore, unicode, result => {
      if (result) {
        return cb(result)
      }
      getIDB(emojiStore.index(INDEX_SKIN_UNICODE), unicode, result => cb(result || null));
    })
  ))
}

function get (db, storeName, key) {
  return dbPromise(db, storeName, MODE_READONLY, (store, txn, cb) => (
    getIDB(store, key, cb)
  ))
}

function set (db, storeName, key, value) {
  return dbPromise(db, storeName, MODE_READWRITE, (store, txn) => {
    store.put(value, key);
    commit(txn);
  })
}

function incrementFavoriteEmojiCount (db, unicode) {
  return dbPromise(db, STORE_FAVORITES, MODE_READWRITE, (store, txn) => (
    getIDB(store, unicode, result => {
      store.put((result || 0) + 1, unicode);
      commit(txn);
    })
  ))
}

function getTopFavoriteEmoji (db, customEmojiIndex, limit) {
  if (limit === 0) {
    return []
  }
  return dbPromise(db, [STORE_FAVORITES, STORE_EMOJI], MODE_READONLY, ([favoritesStore, emojiStore], txn, cb) => {
    const results = [];
    favoritesStore.index(INDEX_COUNT).openCursor(undefined, 'prev').onsuccess = e => {
      const cursor = e.target.result;
      if (!cursor) { // no more results
        return cb(results)
      }

      function addResult (result) {
        results.push(result);
        if (results.length === limit) {
          return cb(results) // done, reached the limit
        }
        cursor.continue();
      }

      const unicodeOrName = cursor.primaryKey;
      const custom = customEmojiIndex.byName(unicodeOrName);
      if (custom) {
        return addResult(custom)
      }
      // This could be done in parallel (i.e. make the cursor and the get()s parallelized),
      // but my testing suggests it's not actually faster.
      getIDB(emojiStore, unicodeOrName, emoji => {
        if (emoji) {
          return addResult(emoji)
        }
        // emoji not found somehow, ignore (may happen if custom emoji change)
        cursor.continue();
      });
    };
  })
}

// trie data structure for prefix searches
// loosely based on https://github.com/nolanlawson/substring-trie

const CODA_MARKER = ''; // marks the end of the string

function trie (arr, itemToTokens) {
  const map = new Map();
  for (const item of arr) {
    const tokens = itemToTokens(item);
    for (const token of tokens) {
      let currentMap = map;
      for (let i = 0; i < token.length; i++) {
        const char = token.charAt(i);
        let nextMap = currentMap.get(char);
        if (!nextMap) {
          nextMap = new Map();
          currentMap.set(char, nextMap);
        }
        currentMap = nextMap;
      }
      let valuesAtCoda = currentMap.get(CODA_MARKER);
      if (!valuesAtCoda) {
        valuesAtCoda = [];
        currentMap.set(CODA_MARKER, valuesAtCoda);
      }
      valuesAtCoda.push(item);
    }
  }

  const search = (query, exact) => {
    let currentMap = map;
    for (let i = 0; i < query.length; i++) {
      const char = query.charAt(i);
      const nextMap = currentMap.get(char);
      if (nextMap) {
        currentMap = nextMap;
      } else {
        return []
      }
    }

    if (exact) {
      const results = currentMap.get(CODA_MARKER);
      return results || []
    }

    const results = [];
    // traverse
    const queue = [currentMap];
    while (queue.length) {
      const currentMap = queue.shift();
      const entriesSortedByKey = [...currentMap.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1);
      for (const [key, value] of entriesSortedByKey) {
        if (key === CODA_MARKER) { // CODA_MARKER always comes first; it's the empty string
          results.push(...value);
        } else {
          queue.push(value);
        }
      }
    }
    return results
  };

  return search
}

const requiredKeys$1 = [
  'name',
  'url'
];

function assertCustomEmojis (customEmojis) {
  const isArray = customEmojis && Array.isArray(customEmojis);
  const firstItemIsFaulty = isArray &&
    customEmojis.length &&
    (!customEmojis[0] || requiredKeys$1.some(key => !(key in customEmojis[0])));
  if (!isArray || firstItemIsFaulty) {
    throw new Error('Custom emojis are in the wrong format')
  }
}

function customEmojiIndex (customEmojis) {
  assertCustomEmojis(customEmojis);

  const sortByName = (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;

  //
  // all()
  //
  const all = customEmojis.sort(sortByName);

  //
  // search()
  //
  const emojiToTokens = emoji => (
    [...new Set((emoji.shortcodes || []).map(shortcode => extractTokens(shortcode)).flat())]
  );
  const searchTrie = trie(customEmojis, emojiToTokens);
  const searchByExactMatch = _ => searchTrie(_, true);
  const searchByPrefix = _ => searchTrie(_, false);

  // Search by query for custom emoji. Similar to how we do this in IDB, the last token
  // is treated as a prefix search, but every other one is treated as an exact match.
  // Then we AND the results together
  const search = query => {
    const tokens = extractTokens(query);
    const intermediateResults = tokens.map((token, i) => (
      (i < tokens.length - 1 ? searchByExactMatch : searchByPrefix)(token)
    ));
    return findCommonMembers(intermediateResults, _ => _.name).sort(sortByName)
  };

  //
  // byShortcode, byName
  //
  const shortcodeToEmoji = new Map();
  const nameToEmoji = new Map();
  for (const customEmoji of customEmojis) {
    nameToEmoji.set(customEmoji.name.toLowerCase(), customEmoji);
    for (const shortcode of (customEmoji.shortcodes || [])) {
      shortcodeToEmoji.set(shortcode.toLowerCase(), customEmoji);
    }
  }

  const byShortcode = shortcode => shortcodeToEmoji.get(shortcode.toLowerCase());
  const byName = name => nameToEmoji.get(name.toLowerCase());

  return {
    all,
    search,
    byShortcode,
    byName
  }
}

// remove some internal implementation details, i.e. the "tokens" array on the emoji object
// essentially, convert the emoji from the version stored in IDB to the version used in-memory
function cleanEmoji (emoji) {
  if (!emoji) {
    return emoji
  }
  delete emoji.tokens;
  if (emoji.skinTones) {
    const len = emoji.skinTones.length;
    emoji.skins = Array(len);
    for (let i = 0; i < len; i++) {
      emoji.skins[i] = {
        tone: emoji.skinTones[i],
        unicode: emoji.skinUnicodes[i],
        version: emoji.skinVersions[i]
      };
    }
    delete emoji.skinTones;
    delete emoji.skinUnicodes;
    delete emoji.skinVersions;
  }
  return emoji
}

function warnETag (eTag) {
  if (!eTag) {
    console.warn('emoji-picker-element is more efficient if the dataSource server exposes an ETag header.');
  }
}

const requiredKeys = [
  'annotation',
  'emoji',
  'group',
  'order',
  'tags',
  'version'
];

function assertEmojiData (emojiData) {
  if (!emojiData ||
    !Array.isArray(emojiData) ||
    !emojiData[0] ||
    (typeof emojiData[0] !== 'object') ||
    requiredKeys.some(key => (!(key in emojiData[0])))) {
    throw new Error('Emoji data is in the wrong format')
  }
}

function assertStatus (response, dataSource) {
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error('Failed to fetch: ' + dataSource + ':  ' + response.status)
  }
}

async function getETag (dataSource) {
  const response = await fetch(dataSource, { method: 'HEAD' });
  assertStatus(response, dataSource);
  const eTag = response.headers.get('etag');
  warnETag(eTag);
  return eTag
}

async function getETagAndData (dataSource) {
  const response = await fetch(dataSource);
  assertStatus(response, dataSource);
  const eTag = response.headers.get('etag');
  warnETag(eTag);
  const emojiData = await response.json();
  assertEmojiData(emojiData);
  return [eTag, emojiData]
}

// TODO: including these in blob-util.ts causes typedoc to generate docs for them,
/**
 * Convert an `ArrayBuffer` to a binary string.
 *
 * Example:
 *
 * ```js
 * var myString = blobUtil.arrayBufferToBinaryString(arrayBuff)
 * ```
 *
 * @param buffer - array buffer
 * @returns binary string
 */
function arrayBufferToBinaryString(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var length = bytes.byteLength;
    var i = -1;
    while (++i < length) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
/**
 * Convert a binary string to an `ArrayBuffer`.
 *
 * ```js
 * var myBuffer = blobUtil.binaryStringToArrayBuffer(binaryString)
 * ```
 *
 * @param binary - binary string
 * @returns array buffer
 */
function binaryStringToArrayBuffer(binary) {
    var length = binary.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    var i = -1;
    while (++i < length) {
        arr[i] = binary.charCodeAt(i);
    }
    return buf;
}

// generate a checksum based on the stringified JSON
async function jsonChecksum (object) {
  const inString = JSON.stringify(object);
  const inBuffer = binaryStringToArrayBuffer(inString);
  // this does not need to be cryptographically secure, SHA-1 is fine
  const outBuffer = await crypto.subtle.digest('SHA-1', inBuffer);
  const outBinString = arrayBufferToBinaryString(outBuffer);
  const res = btoa(outBinString);
  return res
}

async function checkForUpdates (db, dataSource) {
  // just do a simple HEAD request first to see if the eTags match
  let emojiData;
  let eTag = await getETag(dataSource);
  if (!eTag) { // work around lack of ETag/Access-Control-Expose-Headers
    const eTagAndData = await getETagAndData(dataSource);
    eTag = eTagAndData[0];
    emojiData = eTagAndData[1];
    if (!eTag) {
      eTag = await jsonChecksum(emojiData);
    }
  }
  if (await hasData(db, dataSource, eTag)) ; else {
    if (!emojiData) {
      const eTagAndData = await getETagAndData(dataSource);
      emojiData = eTagAndData[1];
    }
    await loadData(db, emojiData, dataSource, eTag);
  }
}

async function loadDataForFirstTime (db, dataSource) {
  let [eTag, emojiData] = await getETagAndData(dataSource);
  if (!eTag) {
    // Handle lack of support for ETag or Access-Control-Expose-Headers
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers#Browser_compatibility
    eTag = await jsonChecksum(emojiData);
  }

  await loadData(db, emojiData, dataSource, eTag);
}

class Database {
  constructor ({ dataSource = DEFAULT_DATA_SOURCE, locale = DEFAULT_LOCALE, customEmoji = [] } = {}) {
    this.dataSource = dataSource;
    this.locale = locale;
    this._dbName = `emoji-picker-element-${this.locale}`;
    this._db = undefined;
    this._lazyUpdate = undefined;
    this._custom = customEmojiIndex(customEmoji);

    this._clear = this._clear.bind(this);
    this._ready = this._init();
  }

  async _init () {
    const db = this._db = await openDatabase(this._dbName);

    addOnCloseListener(this._dbName, this._clear);
    const dataSource = this.dataSource;
    const empty = await isEmpty(db);

    if (empty) {
      await loadDataForFirstTime(db, dataSource);
    } else { // offline-first - do an update asynchronously
      this._lazyUpdate = checkForUpdates(db, dataSource);
    }
  }

  async ready () {
    const checkReady = async () => {
      if (!this._ready) {
        this._ready = this._init();
      }
      return this._ready
    };
    await checkReady();
    // There's a possibility of a race condition where the element gets added, removed, and then added again
    // with a particular timing, which would set the _db to undefined.
    // We *could* do a while loop here, but that seems excessive and could lead to an infinite loop.
    if (!this._db) {
      await checkReady();
    }
  }

  async getEmojiByGroup (group) {
    assertNumber(group);
    await this.ready();
    return uniqEmoji(await getEmojiByGroup(this._db, group)).map(cleanEmoji)
  }

  async getEmojiBySearchQuery (query) {
    assertNonEmptyString(query);
    await this.ready();
    const customs = this._custom.search(query);
    const natives = uniqEmoji(await getEmojiBySearchQuery(this._db, query)).map(cleanEmoji);
    return [
      ...customs,
      ...natives
    ]
  }

  async getEmojiByShortcode (shortcode) {
    assertNonEmptyString(shortcode);
    await this.ready();
    const custom = this._custom.byShortcode(shortcode);
    if (custom) {
      return custom
    }
    return cleanEmoji(await getEmojiByShortcode(this._db, shortcode))
  }

  async getEmojiByUnicodeOrName (unicodeOrName) {
    assertNonEmptyString(unicodeOrName);
    await this.ready();
    const custom = this._custom.byName(unicodeOrName);
    if (custom) {
      return custom
    }
    return cleanEmoji(await getEmojiByUnicode(this._db, unicodeOrName))
  }

  async getPreferredSkinTone () {
    await this.ready();
    return (await get(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE)) || 0
  }

  async setPreferredSkinTone (skinTone) {
    assertNumber(skinTone);
    await this.ready();
    return set(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE, skinTone)
  }

  async incrementFavoriteEmojiCount (unicodeOrName) {
    assertNonEmptyString(unicodeOrName);
    await this.ready();
    return incrementFavoriteEmojiCount(this._db, unicodeOrName)
  }

  async getTopFavoriteEmoji (limit) {
    assertNumber(limit);
    await this.ready();
    return (await getTopFavoriteEmoji(this._db, this._custom, limit)).map(cleanEmoji)
  }

  set customEmoji (customEmojis) {
    this._custom = customEmojiIndex(customEmojis);
  }

  get customEmoji () {
    return this._custom.all
  }

  async _shutdown () {
    await this.ready(); // reopen if we've already been closed/deleted
    try {
      await this._lazyUpdate; // allow any lazy updates to process before closing/deleting
    } catch (err) { /* ignore network errors (offline-first) */ }
  }

  // clear references to IDB, e.g. during a close event
  _clear () {
    // We don't need to call removeEventListener or remove the manual "close" listeners.
    // The memory leak tests prove this is unnecessary. It's because:
    // 1) IDBDatabases that can no longer fire "close" automatically have listeners GCed
    // 2) we clear the manual close listeners in databaseLifecycle.js.
    this._db = this._ready = this._lazyUpdate = undefined;
  }

  async close () {
    await this._shutdown();
    await closeDatabase(this._dbName);
  }

  async delete () {
    await this._shutdown();
    await deleteDatabase(this._dbName);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Database);


/***/ }),

/***/ "./node_modules/emoji-picker-element/index.js":
/*!****************************************************!*\
  !*** ./node_modules/emoji-picker-element/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Picker": () => (/* reexport safe */ _picker_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Database": () => (/* reexport safe */ _database_js__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _picker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./picker.js */ "./node_modules/emoji-picker-element/picker.js");
/* harmony import */ var _database_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./database.js */ "./node_modules/emoji-picker-element/database.js");





/***/ }),

/***/ "./node_modules/emoji-picker-element/picker.js":
/*!*****************************************************!*\
  !*** ./node_modules/emoji-picker-element/picker.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _database_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./database.js */ "./node_modules/emoji-picker-element/database.js");


function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

// via https://unpkg.com/browse/emojibase-data@6.0.0/meta/groups.json
const allGroups = [
  [-1, '✨', 'custom'],
  [0, '😀', 'smileys-emotion'],
  [1, '👋', 'people-body'],
  [3, '🐱', 'animals-nature'],
  [4, '🍎', 'food-drink'],
  [5, '🏠️', 'travel-places'],
  [6, '⚽', 'activities'],
  [7, '📝', 'objects'],
  [8, '⛔️', 'symbols'],
  [9, '🏁', 'flags']
].map(([id, emoji, name]) => ({ id, emoji, name }));

const groups = allGroups.slice(1);
const customGroup = allGroups[0];

const MIN_SEARCH_TEXT_LENGTH = 2;
const NUM_SKIN_TONES = 6;

/* istanbul ignore next */
const rIC = typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout;

// check for ZWJ (zero width joiner) character
function hasZwj (emoji) {
  return emoji.unicode.includes('\u200d')
}

// Find one good representative emoji from each version to test by checking its color.
// Ideally it should have color in the center. For some inspiration, see:
// https://about.gitlab.com/blog/2018/05/30/journey-in-native-unicode-emoji/
//
// Note that for certain versions (12.1, 13.1), there is no point in testing them explicitly, because
// all the emoji from this version are compound-emoji from previous versions. So they would pass a color
// test, even in browsers that display them as double emoji. (E.g. "face in clouds" might render as
// "face without mouth" plus "fog".) These emoji can only be filtered using the width test,
// which happens in checkZwjSupport.js.
const versionsAndTestEmoji = {
  '🥲': 13.1, // smiling face with tear, technically from v13 but see note above
  '🥻': 12.1, // sari, technically from v12 but see note above
  '🥰': 11,
  '🤩': 5,
  '👱‍♀️': 4,
  '🤣': 3,
  '👁️‍🗨️': 2,
  '😀': 1,
  '😐️': 0.7,
  '😃': 0.6
};

const TIMEOUT_BEFORE_LOADING_MESSAGE = 1000; // 1 second
const DEFAULT_SKIN_TONE_EMOJI = '🖐️';
const DEFAULT_NUM_COLUMNS = 8;

// Based on https://fivethirtyeight.com/features/the-100-most-used-emojis/ and
// https://blog.emojipedia.org/facebook-reveals-most-and-least-used-emojis/ with
// a bit of my own curation. (E.g. avoid the "OK" gesture because of connotations:
// https://emojipedia.org/ok-hand/)
const MOST_COMMONLY_USED_EMOJI = [
  '😊',
  '😒',
  '♥️',
  '👍️',
  '😍',
  '😂',
  '😭',
  '☺️',
  '😔',
  '😩',
  '😏',
  '💕',
  '🙌',
  '😘'
];

const FONT_FAMILY = '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",' +
  '"Twemoji Mozilla","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';

/* istanbul ignore next */
const DEFAULT_CATEGORY_SORTING = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// Test if an emoji is supported by rendering it to canvas and checking that the color is not black

const getTextFeature = (text, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;

  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = `100px ${FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.scale(0.01, 0.01);
  ctx.fillText(text, 0, 0);

  return ctx.getImageData(0, 0, 1, 1).data
};

const compareFeatures = (feature1, feature2) => {
  const feature1Str = [...feature1].join(',');
  const feature2Str = [...feature2].join(',');
  // This is RGBA, so for 0,0,0, we are checking that the first RGB is not all zeroes.
  // Most of the time when unsupported this is 0,0,0,0, but on Chrome on Mac it is
  // 0,0,0,61 - there is a transparency here.
  return feature1Str === feature2Str && !feature1Str.startsWith('0,0,0,')
};

function testColorEmojiSupported (text) {
  // Render white and black and then compare them to each other and ensure they're the same
  // color, and neither one is black. This shows that the emoji was rendered in color.
  const feature1 = getTextFeature(text, '#000');
  const feature2 = getTextFeature(text, '#fff');
  return feature1 && feature2 && compareFeatures(feature1, feature2)
}

// rather than check every emoji ever, which would be expensive, just check some representatives from the

function determineEmojiSupportLevel () {
  const entries = Object.entries(versionsAndTestEmoji);
  try {
    // start with latest emoji and work backwards
    for (const [emoji, version] of entries) {
      if (testColorEmojiSupported(emoji)) {
        return version
      }
    }
  } catch (e) { // canvas error
  } finally {
  }
  // In case of an error, be generous and just assume all emoji are supported (e.g. for canvas errors
  // due to anti-fingerprinting add-ons). Better to show some gray boxes than nothing at all.
  return entries[0][1] // first one in the list is the most recent version
}

// Check which emojis we know for sure aren't supported, based on Unicode version level
const emojiSupportLevelPromise = new Promise(resolve => (
  rIC(() => (
    resolve(determineEmojiSupportLevel()) // delay so ideally this can run while IDB is first populating
  ))
));
// determine which emojis containing ZWJ (zero width joiner) characters
// are supported (rendered as one glyph) rather than unsupported (rendered as two or more glyphs)
const supportedZwjEmojis = new Map();

const VARIATION_SELECTOR = '\ufe0f';
const SKINTONE_MODIFIER = '\ud83c';
const ZWJ = '\u200d';
const LIGHT_SKIN_TONE = 0x1F3FB;
const LIGHT_SKIN_TONE_MODIFIER = 0xdffb;

// TODO: this is a naive implementation, we can improve it later
// It's only used for the skintone picker, so as long as people don't customize with
// really exotic emoji then it should work fine
function applySkinTone (str, skinTone) {
  if (skinTone === 0) {
    return str
  }
  const zwjIndex = str.indexOf(ZWJ);
  if (zwjIndex !== -1) {
    return str.substring(0, zwjIndex) +
      String.fromCodePoint(LIGHT_SKIN_TONE + skinTone - 1) +
      str.substring(zwjIndex)
  }
  if (str.endsWith(VARIATION_SELECTOR)) {
    str = str.substring(0, str.length - 1);
  }
  return str + SKINTONE_MODIFIER + String.fromCodePoint(LIGHT_SKIN_TONE_MODIFIER + skinTone - 1)
}

function halt (event) {
  event.preventDefault();
  event.stopPropagation();
}

// Implementation left/right or up/down navigation, circling back when you
// reach the start/end of the list
function incrementOrDecrement (decrement, val, arr) {
  val += (decrement ? -1 : 1);
  if (val < 0) {
    val = arr.length - 1;
  } else if (val >= arr.length) {
    val = 0;
  }
  return val
}

// like lodash's uniqBy but much smaller
function uniqBy (arr, func) {
  const set = new Set();
  const res = [];
  for (const item of arr) {
    const key = func(item);
    if (!set.has(key)) {
      set.add(key);
      res.push(item);
    }
  }
  return res
}

// We don't need all the data on every emoji, and there are specific things we need
// for the UI, so build a "view model" from the emoji object we got from the database

function summarizeEmojisForUI (emojis, emojiSupportLevel) {
  const toSimpleSkinsMap = skins => {
    const res = {};
    for (const skin of skins) {
      // ignore arrays like [1, 2] with multiple skin tones
      // also ignore variants that are in an unsupported emoji version
      // (these do exist - variants from a different version than their base emoji)
      if (typeof skin.tone === 'number' && skin.version <= emojiSupportLevel) {
        res[skin.tone] = skin.unicode;
      }
    }
    return res
  };

  return emojis.map(({ unicode, skins, shortcodes, url, name, category }) => ({
    unicode,
    name,
    shortcodes,
    url,
    category,
    id: unicode || name,
    skins: skins && toSimpleSkinsMap(skins),
    title: (shortcodes || []).join(', ')
  }))
}

// import rAF from one place so that the bundle size is a bit smaller
const rAF = requestAnimationFrame;

// Svelte action to calculate the width of an element and auto-update

let resizeObserverSupported = typeof ResizeObserver === 'function';

function calculateWidth (node, onUpdate) {
  let resizeObserver;
  if (resizeObserverSupported) {
    resizeObserver = new ResizeObserver(entries => (
      onUpdate(entries[0].contentRect.width)
    ));
    resizeObserver.observe(node);
  } else { // just set the width once, don't bother trying to track it
    rAF(() => (
      onUpdate(node.getBoundingClientRect().width)
    ));
  }

  // cleanup function (called on destroy)
  return {
    destroy () {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    }
  }
}

// get the width of the text inside of a DOM node, via https://stackoverflow.com/a/59525891/680742
function calculateTextWidth (node) {
  /* istanbul ignore else */
  {
    const range = document.createRange();
    range.selectNode(node.firstChild);
    return range.getBoundingClientRect().width
  }
}

let baselineEmojiWidth;

function checkZwjSupport (zwjEmojisToCheck, baselineEmoji, emojiToDomNode) {
  for (const emoji of zwjEmojisToCheck) {
    const domNode = emojiToDomNode(emoji);
    const emojiWidth = calculateTextWidth(domNode);
    if (typeof baselineEmojiWidth === 'undefined') { // calculate the baseline emoji width only once
      baselineEmojiWidth = calculateTextWidth(baselineEmoji);
    }
    // On Windows, some supported emoji are ~50% bigger than the baseline emoji, but what we really want to guard
    // against are the ones that are 2x the size, because those are truly broken (person with red hair = person with
    // floating red wig, black cat = cat with black square, polar bear = bear with snowflake, etc.)
    // So here we set the threshold at 1.8 times the size of the baseline emoji.
    const supported = emojiWidth / 1.8 < baselineEmojiWidth;
    supportedZwjEmojis.set(emoji.unicode, supported);
  }
}

// Measure after style/layout are complete

const requestPostAnimationFrame = callback => {
  rAF(() => {
    setTimeout(callback);
  });
};

// like lodash's uniq

function uniq (arr) {
  return uniqBy(arr, _ => _)
}

/* src/picker/components/Picker/Picker.svelte generated by Svelte v3.40.2 */

const { Map: Map_1 } = globals;

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[63] = list[i];
	child_ctx[65] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[66] = list[i];
	child_ctx[65] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[63] = list[i];
	child_ctx[65] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[69] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[72] = list[i];
	child_ctx[65] = i;
	return child_ctx;
}

// (44:38) {#each skinTones as skinTone, i (skinTone)}
function create_each_block_4(key_1, ctx) {
	let div;
	let t_value = /*skinTone*/ ctx[72] + "";
	let t;
	let div_id_value;
	let div_class_value;
	let div_aria_selected_value;
	let div_title_value;
	let div_aria_label_value;

	return {
		key: key_1,
		first: null,
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "id", div_id_value = "skintone-" + /*i*/ ctx[65]);

			attr(div, "class", div_class_value = "emoji hide-focus " + (/*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]
			? 'active'
			: ''));

			attr(div, "aria-selected", div_aria_selected_value = /*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]);
			attr(div, "role", "option");
			attr(div, "title", div_title_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]]);
			attr(div, "tabindex", "-1");
			attr(div, "aria-label", div_aria_label_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]]);
			this.first = div;
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*skinTones*/ 512 && t_value !== (t_value = /*skinTone*/ ctx[72] + "")) set_data(t, t_value);

			if (dirty[0] & /*skinTones*/ 512 && div_id_value !== (div_id_value = "skintone-" + /*i*/ ctx[65])) {
				attr(div, "id", div_id_value);
			}

			if (dirty[0] & /*skinTones, activeSkinTone*/ 1049088 && div_class_value !== (div_class_value = "emoji hide-focus " + (/*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]
			? 'active'
			: ''))) {
				attr(div, "class", div_class_value);
			}

			if (dirty[0] & /*skinTones, activeSkinTone*/ 1049088 && div_aria_selected_value !== (div_aria_selected_value = /*i*/ ctx[65] === /*activeSkinTone*/ ctx[20])) {
				attr(div, "aria-selected", div_aria_selected_value);
			}

			if (dirty[0] & /*i18n, skinTones*/ 513 && div_title_value !== (div_title_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]])) {
				attr(div, "title", div_title_value);
			}

			if (dirty[0] & /*i18n, skinTones*/ 513 && div_aria_label_value !== (div_aria_label_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]])) {
				attr(div, "aria-label", div_aria_label_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (54:33) {#each groups as group (group.id)}
function create_each_block_3(key_1, ctx) {
	let button;
	let div;
	let t_value = /*group*/ ctx[69].emoji + "";
	let t;
	let button_aria_controls_value;
	let button_aria_label_value;
	let button_aria_selected_value;
	let button_title_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[49](/*group*/ ctx[69]);
	}

	return {
		key: key_1,
		first: null,
		c() {
			button = element("button");
			div = element("div");
			t = text(t_value);
			attr(div, "class", "nav-emoji emoji");
			attr(button, "role", "tab");
			attr(button, "class", "nav-button");
			attr(button, "aria-controls", button_aria_controls_value = "tab-" + /*group*/ ctx[69].id);
			attr(button, "aria-label", button_aria_label_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name]);
			attr(button, "aria-selected", button_aria_selected_value = !/*searchMode*/ ctx[4] && /*currentGroup*/ ctx[13].id === /*group*/ ctx[69].id);
			attr(button, "title", button_title_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name]);
			this.first = button;
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, div);
			append(div, t);

			if (!mounted) {
				dispose = listen(button, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*groups*/ 4096 && t_value !== (t_value = /*group*/ ctx[69].emoji + "")) set_data(t, t_value);

			if (dirty[0] & /*groups*/ 4096 && button_aria_controls_value !== (button_aria_controls_value = "tab-" + /*group*/ ctx[69].id)) {
				attr(button, "aria-controls", button_aria_controls_value);
			}

			if (dirty[0] & /*i18n, groups*/ 4097 && button_aria_label_value !== (button_aria_label_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name])) {
				attr(button, "aria-label", button_aria_label_value);
			}

			if (dirty[0] & /*searchMode, currentGroup, groups*/ 12304 && button_aria_selected_value !== (button_aria_selected_value = !/*searchMode*/ ctx[4] && /*currentGroup*/ ctx[13].id === /*group*/ ctx[69].id)) {
				attr(button, "aria-selected", button_aria_selected_value);
			}

			if (dirty[0] & /*i18n, groups*/ 4097 && button_title_value !== (button_title_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name])) {
				attr(button, "title", button_title_value);
			}
		},
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (94:100) {:else}
function create_else_block_1(ctx) {
	let img;
	let img_src_value;

	return {
		c() {
			img = element("img");
			attr(img, "class", "custom-emoji");
			if (!src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) attr(img, "src", img_src_value);
			attr(img, "alt", "");
			attr(img, "loading", "lazy");
		},
		m(target, anchor) {
			insert(target, img, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && !src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) {
				attr(img, "src", img_src_value);
			}
		},
		d(detaching) {
			if (detaching) detach(img);
		}
	};
}

// (94:40) {#if emoji.unicode}
function create_if_block_1(ctx) {
	let t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*currentEmojisWithCategories, currentSkinTone*/ 33024 && t_value !== (t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (89:53) {#each emojiWithCategory.emojis as emoji, i (emoji.id)}
function create_each_block_2(key_1, ctx) {
	let button;
	let button_role_value;
	let button_aria_selected_value;
	let button_aria_label_value;
	let button_title_value;
	let button_class_value;
	let button_id_value;

	function select_block_type(ctx, dirty) {
		if (/*emoji*/ ctx[63].unicode) return create_if_block_1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			button = element("button");
			if_block.c();
			attr(button, "role", button_role_value = /*searchMode*/ ctx[4] ? 'option' : 'menuitem');

			attr(button, "aria-selected", button_aria_selected_value = /*searchMode*/ ctx[4]
			? /*i*/ ctx[65] == /*activeSearchItem*/ ctx[5]
			: '');

			attr(button, "aria-label", button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]));
			attr(button, "title", button_title_value = /*emoji*/ ctx[63].title);

			attr(button, "class", button_class_value = "emoji " + (/*searchMode*/ ctx[4] && /*i*/ ctx[65] === /*activeSearchItem*/ ctx[5]
			? 'active'
			: ''));

			attr(button, "id", button_id_value = "emo-" + /*emoji*/ ctx[63].id);
			this.first = button;
		},
		m(target, anchor) {
			insert(target, button, anchor);
			if_block.m(button, null);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(button, null);
				}
			}

			if (dirty[0] & /*searchMode*/ 16 && button_role_value !== (button_role_value = /*searchMode*/ ctx[4] ? 'option' : 'menuitem')) {
				attr(button, "role", button_role_value);
			}

			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem*/ 32816 && button_aria_selected_value !== (button_aria_selected_value = /*searchMode*/ ctx[4]
			? /*i*/ ctx[65] == /*activeSearchItem*/ ctx[5]
			: '')) {
				attr(button, "aria-selected", button_aria_selected_value);
			}

			if (dirty[0] & /*currentEmojisWithCategories, currentSkinTone*/ 33024 && button_aria_label_value !== (button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]))) {
				attr(button, "aria-label", button_aria_label_value);
			}

			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && button_title_value !== (button_title_value = /*emoji*/ ctx[63].title)) {
				attr(button, "title", button_title_value);
			}

			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem*/ 32816 && button_class_value !== (button_class_value = "emoji " + (/*searchMode*/ ctx[4] && /*i*/ ctx[65] === /*activeSearchItem*/ ctx[5]
			? 'active'
			: ''))) {
				attr(button, "class", button_class_value);
			}

			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && button_id_value !== (button_id_value = "emo-" + /*emoji*/ ctx[63].id)) {
				attr(button, "id", button_id_value);
			}
		},
		d(detaching) {
			if (detaching) detach(button);
			if_block.d();
		}
	};
}

// (70:36) {#each currentEmojisWithCategories as emojiWithCategory, i (emojiWithCategory.category)}
function create_each_block_1(key_1, ctx) {
	let div0;

	let t_value = (/*searchMode*/ ctx[4]
	? /*i18n*/ ctx[0].searchResultsLabel
	: /*emojiWithCategory*/ ctx[66].category
		? /*emojiWithCategory*/ ctx[66].category
		: /*currentEmojisWithCategories*/ ctx[15].length > 1
			? /*i18n*/ ctx[0].categories.custom
			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]) + "";

	let t;
	let div0_id_value;
	let div0_class_value;
	let div1;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let div1_role_value;
	let div1_aria_labelledby_value;
	let div1_id_value;
	let each_value_2 = /*emojiWithCategory*/ ctx[66].emojis;
	const get_key = ctx => /*emoji*/ ctx[63].id;

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
	}

	return {
		key: key_1,
		first: null,
		c() {
			div0 = element("div");
			t = text(t_value);
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "id", div0_id_value = "menu-label-" + /*i*/ ctx[65]);

			attr(div0, "class", div0_class_value = "category " + (/*currentEmojisWithCategories*/ ctx[15].length === 1 && /*currentEmojisWithCategories*/ ctx[15][0].category === ''
			? 'gone'
			: ''));

			attr(div0, "aria-hidden", "true");
			attr(div1, "class", "emoji-menu");
			attr(div1, "role", div1_role_value = /*searchMode*/ ctx[4] ? 'listbox' : 'menu');
			attr(div1, "aria-labelledby", div1_aria_labelledby_value = "menu-label-" + /*i*/ ctx[65]);
			attr(div1, "id", div1_id_value = /*searchMode*/ ctx[4] ? 'search-results' : '');
			this.first = div0;
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t);
			insert(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*searchMode, i18n, currentEmojisWithCategories, currentGroup*/ 40977 && t_value !== (t_value = (/*searchMode*/ ctx[4]
			? /*i18n*/ ctx[0].searchResultsLabel
			: /*emojiWithCategory*/ ctx[66].category
				? /*emojiWithCategory*/ ctx[66].category
				: /*currentEmojisWithCategories*/ ctx[15].length > 1
					? /*i18n*/ ctx[0].categories.custom
					: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]) + "")) set_data(t, t_value);

			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div0_id_value !== (div0_id_value = "menu-label-" + /*i*/ ctx[65])) {
				attr(div0, "id", div0_id_value);
			}

			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div0_class_value !== (div0_class_value = "category " + (/*currentEmojisWithCategories*/ ctx[15].length === 1 && /*currentEmojisWithCategories*/ ctx[15][0].category === ''
			? 'gone'
			: ''))) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem, labelWithSkin, currentSkinTone, unicodeWithSkin*/ 402686256) {
				each_value_2 = /*emojiWithCategory*/ ctx[66].emojis;
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div1, destroy_block, create_each_block_2, null, get_each_context_2);
			}

			if (dirty[0] & /*searchMode*/ 16 && div1_role_value !== (div1_role_value = /*searchMode*/ ctx[4] ? 'listbox' : 'menu')) {
				attr(div1, "role", div1_role_value);
			}

			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = "menu-label-" + /*i*/ ctx[65])) {
				attr(div1, "aria-labelledby", div1_aria_labelledby_value);
			}

			if (dirty[0] & /*searchMode*/ 16 && div1_id_value !== (div1_id_value = /*searchMode*/ ctx[4] ? 'search-results' : '')) {
				attr(div1, "id", div1_id_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div0);
			if (detaching) detach(div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (104:94) {:else}
function create_else_block(ctx) {
	let img;
	let img_src_value;

	return {
		c() {
			img = element("img");
			attr(img, "class", "custom-emoji");
			if (!src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) attr(img, "src", img_src_value);
			attr(img, "alt", "");
			attr(img, "loading", "lazy");
		},
		m(target, anchor) {
			insert(target, img, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*currentFavorites*/ 1024 && !src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) {
				attr(img, "src", img_src_value);
			}
		},
		d(detaching) {
			if (detaching) detach(img);
		}
	};
}

// (104:34) {#if emoji.unicode}
function create_if_block(ctx) {
	let t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*currentFavorites, currentSkinTone*/ 1280 && t_value !== (t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (100:102) {#each currentFavorites as emoji, i (emoji.id)}
function create_each_block(key_1, ctx) {
	let button;
	let button_aria_label_value;
	let button_title_value;
	let button_id_value;

	function select_block_type_1(ctx, dirty) {
		if (/*emoji*/ ctx[63].unicode) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			button = element("button");
			if_block.c();
			attr(button, "role", "menuitem");
			attr(button, "aria-label", button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]));
			attr(button, "title", button_title_value = /*emoji*/ ctx[63].title);
			attr(button, "class", "emoji");
			attr(button, "id", button_id_value = "fav-" + /*emoji*/ ctx[63].id);
			this.first = button;
		},
		m(target, anchor) {
			insert(target, button, anchor);
			if_block.m(button, null);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(button, null);
				}
			}

			if (dirty[0] & /*currentFavorites, currentSkinTone*/ 1280 && button_aria_label_value !== (button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]))) {
				attr(button, "aria-label", button_aria_label_value);
			}

			if (dirty[0] & /*currentFavorites*/ 1024 && button_title_value !== (button_title_value = /*emoji*/ ctx[63].title)) {
				attr(button, "title", button_title_value);
			}

			if (dirty[0] & /*currentFavorites*/ 1024 && button_id_value !== (button_id_value = "fav-" + /*emoji*/ ctx[63].id)) {
				attr(button, "id", button_id_value);
			}
		},
		d(detaching) {
			if (detaching) detach(button);
			if_block.d();
		}
	};
}

function create_fragment(ctx) {
	let section;
	let div0;
	let div4;
	let div1;
	let input;
	let input_placeholder_value;
	let input_aria_expanded_value;
	let input_aria_activedescendant_value;
	let label;
	let t0_value = /*i18n*/ ctx[0].searchLabel + "";
	let t0;
	let span0;
	let t1_value = /*i18n*/ ctx[0].searchDescription + "";
	let t1;
	let div2;
	let button0;
	let t2;
	let button0_class_value;
	let div2_class_value;
	let span1;
	let t3_value = /*i18n*/ ctx[0].skinToneDescription + "";
	let t3;
	let div3;
	let each_blocks_3 = [];
	let each0_lookup = new Map_1();
	let div3_class_value;
	let div3_aria_label_value;
	let div3_aria_activedescendant_value;
	let div3_aria_hidden_value;
	let div5;
	let each_blocks_2 = [];
	let each1_lookup = new Map_1();
	let div5_aria_label_value;
	let div7;
	let div6;
	let div8;
	let t4;
	let div8_class_value;
	let div10;
	let div9;
	let each_blocks_1 = [];
	let each2_lookup = new Map_1();
	let div10_class_value;
	let div10_role_value;
	let div10_aria_label_value;
	let div10_id_value;
	let div11;
	let each_blocks = [];
	let each3_lookup = new Map_1();
	let div11_class_value;
	let div11_aria_label_value;
	let button1;
	let section_aria_label_value;
	let mounted;
	let dispose;
	let each_value_4 = /*skinTones*/ ctx[9];
	const get_key = ctx => /*skinTone*/ ctx[72];

	for (let i = 0; i < each_value_4.length; i += 1) {
		let child_ctx = get_each_context_4(ctx, each_value_4, i);
		let key = get_key(child_ctx);
		each0_lookup.set(key, each_blocks_3[i] = create_each_block_4(key, child_ctx));
	}

	let each_value_3 = /*groups*/ ctx[12];
	const get_key_1 = ctx => /*group*/ ctx[69].id;

	for (let i = 0; i < each_value_3.length; i += 1) {
		let child_ctx = get_each_context_3(ctx, each_value_3, i);
		let key = get_key_1(child_ctx);
		each1_lookup.set(key, each_blocks_2[i] = create_each_block_3(key, child_ctx));
	}

	let each_value_1 = /*currentEmojisWithCategories*/ ctx[15];
	const get_key_2 = ctx => /*emojiWithCategory*/ ctx[66].category;

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key_2(child_ctx);
		each2_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
	}

	let each_value = /*currentFavorites*/ ctx[10];
	const get_key_3 = ctx => /*emoji*/ ctx[63].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key_3(child_ctx);
		each3_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			section = element("section");
			div0 = element("div");
			div4 = element("div");
			div1 = element("div");
			input = element("input");
			label = element("label");
			t0 = text(t0_value);
			span0 = element("span");
			t1 = text(t1_value);
			div2 = element("div");
			button0 = element("button");
			t2 = text(/*skinToneButtonText*/ ctx[21]);
			span1 = element("span");
			t3 = text(t3_value);
			div3 = element("div");

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				each_blocks_3[i].c();
			}

			div5 = element("div");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			div7 = element("div");
			div6 = element("div");
			div8 = element("div");
			t4 = text(/*message*/ ctx[18]);
			div10 = element("div");
			div9 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			div11 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			button1 = element("button");
			button1.textContent = "😀";
			attr(div0, "class", "pad-top");
			attr(input, "id", "search");
			attr(input, "class", "search");
			attr(input, "type", "search");
			attr(input, "role", "combobox");
			attr(input, "enterkeyhint", "search");
			attr(input, "placeholder", input_placeholder_value = /*i18n*/ ctx[0].searchLabel);
			attr(input, "autocapitalize", "none");
			attr(input, "autocomplete", "off");
			attr(input, "spellcheck", "true");
			attr(input, "aria-expanded", input_aria_expanded_value = !!(/*searchMode*/ ctx[4] && /*currentEmojis*/ ctx[1].length));
			attr(input, "aria-controls", "search-results");
			attr(input, "aria-owns", "search-results");
			attr(input, "aria-describedby", "search-description");
			attr(input, "aria-autocomplete", "list");

			attr(input, "aria-activedescendant", input_aria_activedescendant_value = /*activeSearchItemId*/ ctx[26]
			? `emo-${/*activeSearchItemId*/ ctx[26]}`
			: '');

			attr(label, "class", "sr-only");
			attr(label, "for", "search");
			attr(span0, "id", "search-description");
			attr(span0, "class", "sr-only");
			attr(div1, "class", "search-wrapper");
			attr(button0, "id", "skintone-button");
			attr(button0, "class", button0_class_value = "emoji " + (/*skinTonePickerExpanded*/ ctx[6] ? 'hide-focus' : ''));
			attr(button0, "aria-label", /*skinToneButtonLabel*/ ctx[23]);
			attr(button0, "title", /*skinToneButtonLabel*/ ctx[23]);
			attr(button0, "aria-describedby", "skintone-description");
			attr(button0, "aria-haspopup", "listbox");
			attr(button0, "aria-expanded", /*skinTonePickerExpanded*/ ctx[6]);
			attr(button0, "aria-controls", "skintone-list");

			attr(div2, "class", div2_class_value = "skintone-button-wrapper " + (/*skinTonePickerExpandedAfterAnimation*/ ctx[19]
			? 'expanded'
			: ''));

			attr(span1, "id", "skintone-description");
			attr(span1, "class", "sr-only");
			attr(div3, "id", "skintone-list");

			attr(div3, "class", div3_class_value = "skintone-list " + (/*skinTonePickerExpanded*/ ctx[6]
			? ''
			: 'hidden no-animate'));

			set_style(div3, "transform", "translateY(" + (/*skinTonePickerExpanded*/ ctx[6]
			? 0
			: 'calc(-1 * var(--num-skintones) * var(--total-emoji-size))') + ")");

			attr(div3, "role", "listbox");
			attr(div3, "aria-label", div3_aria_label_value = /*i18n*/ ctx[0].skinTonesLabel);
			attr(div3, "aria-activedescendant", div3_aria_activedescendant_value = "skintone-" + /*activeSkinTone*/ ctx[20]);
			attr(div3, "aria-hidden", div3_aria_hidden_value = !/*skinTonePickerExpanded*/ ctx[6]);
			attr(div4, "class", "search-row");
			attr(div5, "class", "nav");
			attr(div5, "role", "tablist");
			set_style(div5, "grid-template-columns", "repeat(" + /*groups*/ ctx[12].length + ", 1fr)");
			attr(div5, "aria-label", div5_aria_label_value = /*i18n*/ ctx[0].categoriesLabel);
			attr(div6, "class", "indicator");
			set_style(div6, "transform", "translateX(" + (/*isRtl*/ ctx[24] ? -1 : 1) * /*currentGroupIndex*/ ctx[11] * 100 + "%)");
			attr(div7, "class", "indicator-wrapper");
			attr(div8, "class", div8_class_value = "message " + (/*message*/ ctx[18] ? '' : 'gone'));
			attr(div8, "role", "alert");
			attr(div8, "aria-live", "polite");

			attr(div10, "class", div10_class_value = "tabpanel " + (!/*databaseLoaded*/ ctx[14] || /*message*/ ctx[18]
			? 'gone'
			: ''));

			attr(div10, "role", div10_role_value = /*searchMode*/ ctx[4] ? 'region' : 'tabpanel');

			attr(div10, "aria-label", div10_aria_label_value = /*searchMode*/ ctx[4]
			? /*i18n*/ ctx[0].searchResultsLabel
			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]);

			attr(div10, "id", div10_id_value = /*searchMode*/ ctx[4]
			? ''
			: `tab-${/*currentGroup*/ ctx[13].id}`);

			attr(div10, "tabindex", "0");
			attr(div11, "class", div11_class_value = "favorites emoji-menu " + (/*message*/ ctx[18] ? 'gone' : ''));
			attr(div11, "role", "menu");
			attr(div11, "aria-label", div11_aria_label_value = /*i18n*/ ctx[0].favoritesLabel);
			set_style(div11, "padding-inline-end", /*scrollbarWidth*/ ctx[25] + "px");
			attr(button1, "aria-hidden", "true");
			attr(button1, "tabindex", "-1");
			attr(button1, "class", "abs-pos hidden emoji");
			attr(section, "class", "picker");
			attr(section, "aria-label", section_aria_label_value = /*i18n*/ ctx[0].regionLabel);
			attr(section, "style", /*pickerStyle*/ ctx[22]);
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div0);
			append(section, div4);
			append(div4, div1);
			append(div1, input);
			set_input_value(input, /*rawSearchText*/ ctx[2]);
			append(div1, label);
			append(label, t0);
			append(div1, span0);
			append(span0, t1);
			append(div4, div2);
			append(div2, button0);
			append(button0, t2);
			append(div4, span1);
			append(span1, t3);
			append(div4, div3);

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				each_blocks_3[i].m(div3, null);
			}

			/*div3_binding*/ ctx[48](div3);
			append(section, div5);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(div5, null);
			}

			append(section, div7);
			append(div7, div6);
			append(section, div8);
			append(div8, t4);
			append(section, div10);
			append(div10, div9);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div9, null);
			}

			/*div10_binding*/ ctx[50](div10);
			append(section, div11);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div11, null);
			}

			append(section, button1);
			/*button1_binding*/ ctx[51](button1);
			/*section_binding*/ ctx[52](section);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[47]),
					listen(input, "keydown", /*onSearchKeydown*/ ctx[30]),
					listen(button0, "click", /*onClickSkinToneButton*/ ctx[35]),
					listen(div3, "focusout", /*onSkinToneOptionsFocusOut*/ ctx[38]),
					listen(div3, "click", /*onSkinToneOptionsClick*/ ctx[34]),
					listen(div3, "keydown", /*onSkinToneOptionsKeydown*/ ctx[36]),
					listen(div3, "keyup", /*onSkinToneOptionsKeyup*/ ctx[37]),
					listen(div5, "keydown", /*onNavKeydown*/ ctx[32]),
					action_destroyer(/*calculateEmojiGridStyle*/ ctx[29].call(null, div9)),
					listen(div10, "click", /*onEmojiClick*/ ctx[33]),
					listen(div11, "click", /*onEmojiClick*/ ctx[33])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*i18n*/ 1 && input_placeholder_value !== (input_placeholder_value = /*i18n*/ ctx[0].searchLabel)) {
				attr(input, "placeholder", input_placeholder_value);
			}

			if (dirty[0] & /*searchMode, currentEmojis*/ 18 && input_aria_expanded_value !== (input_aria_expanded_value = !!(/*searchMode*/ ctx[4] && /*currentEmojis*/ ctx[1].length))) {
				attr(input, "aria-expanded", input_aria_expanded_value);
			}

			if (dirty[0] & /*activeSearchItemId*/ 67108864 && input_aria_activedescendant_value !== (input_aria_activedescendant_value = /*activeSearchItemId*/ ctx[26]
			? `emo-${/*activeSearchItemId*/ ctx[26]}`
			: '')) {
				attr(input, "aria-activedescendant", input_aria_activedescendant_value);
			}

			if (dirty[0] & /*rawSearchText*/ 4) {
				set_input_value(input, /*rawSearchText*/ ctx[2]);
			}

			if (dirty[0] & /*i18n*/ 1 && t0_value !== (t0_value = /*i18n*/ ctx[0].searchLabel + "")) set_data(t0, t0_value);
			if (dirty[0] & /*i18n*/ 1 && t1_value !== (t1_value = /*i18n*/ ctx[0].searchDescription + "")) set_data(t1, t1_value);
			if (dirty[0] & /*skinToneButtonText*/ 2097152) set_data(t2, /*skinToneButtonText*/ ctx[21]);

			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && button0_class_value !== (button0_class_value = "emoji " + (/*skinTonePickerExpanded*/ ctx[6] ? 'hide-focus' : ''))) {
				attr(button0, "class", button0_class_value);
			}

			if (dirty[0] & /*skinToneButtonLabel*/ 8388608) {
				attr(button0, "aria-label", /*skinToneButtonLabel*/ ctx[23]);
			}

			if (dirty[0] & /*skinToneButtonLabel*/ 8388608) {
				attr(button0, "title", /*skinToneButtonLabel*/ ctx[23]);
			}

			if (dirty[0] & /*skinTonePickerExpanded*/ 64) {
				attr(button0, "aria-expanded", /*skinTonePickerExpanded*/ ctx[6]);
			}

			if (dirty[0] & /*skinTonePickerExpandedAfterAnimation*/ 524288 && div2_class_value !== (div2_class_value = "skintone-button-wrapper " + (/*skinTonePickerExpandedAfterAnimation*/ ctx[19]
			? 'expanded'
			: ''))) {
				attr(div2, "class", div2_class_value);
			}

			if (dirty[0] & /*i18n*/ 1 && t3_value !== (t3_value = /*i18n*/ ctx[0].skinToneDescription + "")) set_data(t3, t3_value);

			if (dirty[0] & /*skinTones, activeSkinTone, i18n*/ 1049089) {
				each_value_4 = /*skinTones*/ ctx[9];
				each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx, each_value_4, each0_lookup, div3, destroy_block, create_each_block_4, null, get_each_context_4);
			}

			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && div3_class_value !== (div3_class_value = "skintone-list " + (/*skinTonePickerExpanded*/ ctx[6]
			? ''
			: 'hidden no-animate'))) {
				attr(div3, "class", div3_class_value);
			}

			if (dirty[0] & /*skinTonePickerExpanded*/ 64) {
				set_style(div3, "transform", "translateY(" + (/*skinTonePickerExpanded*/ ctx[6]
				? 0
				: 'calc(-1 * var(--num-skintones) * var(--total-emoji-size))') + ")");
			}

			if (dirty[0] & /*i18n*/ 1 && div3_aria_label_value !== (div3_aria_label_value = /*i18n*/ ctx[0].skinTonesLabel)) {
				attr(div3, "aria-label", div3_aria_label_value);
			}

			if (dirty[0] & /*activeSkinTone*/ 1048576 && div3_aria_activedescendant_value !== (div3_aria_activedescendant_value = "skintone-" + /*activeSkinTone*/ ctx[20])) {
				attr(div3, "aria-activedescendant", div3_aria_activedescendant_value);
			}

			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && div3_aria_hidden_value !== (div3_aria_hidden_value = !/*skinTonePickerExpanded*/ ctx[6])) {
				attr(div3, "aria-hidden", div3_aria_hidden_value);
			}

			if (dirty[0] & /*groups, i18n, searchMode, currentGroup*/ 12305 | dirty[1] & /*onNavClick*/ 1) {
				each_value_3 = /*groups*/ ctx[12];
				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx, each_value_3, each1_lookup, div5, destroy_block, create_each_block_3, null, get_each_context_3);
			}

			if (dirty[0] & /*groups*/ 4096) {
				set_style(div5, "grid-template-columns", "repeat(" + /*groups*/ ctx[12].length + ", 1fr)");
			}

			if (dirty[0] & /*i18n*/ 1 && div5_aria_label_value !== (div5_aria_label_value = /*i18n*/ ctx[0].categoriesLabel)) {
				attr(div5, "aria-label", div5_aria_label_value);
			}

			if (dirty[0] & /*isRtl, currentGroupIndex*/ 16779264) {
				set_style(div6, "transform", "translateX(" + (/*isRtl*/ ctx[24] ? -1 : 1) * /*currentGroupIndex*/ ctx[11] * 100 + "%)");
			}

			if (dirty[0] & /*message*/ 262144) set_data(t4, /*message*/ ctx[18]);

			if (dirty[0] & /*message*/ 262144 && div8_class_value !== (div8_class_value = "message " + (/*message*/ ctx[18] ? '' : 'gone'))) {
				attr(div8, "class", div8_class_value);
			}

			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem, labelWithSkin, currentSkinTone, unicodeWithSkin, i18n, currentGroup*/ 402694449) {
				each_value_1 = /*currentEmojisWithCategories*/ ctx[15];
				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx, each_value_1, each2_lookup, div9, destroy_block, create_each_block_1, null, get_each_context_1);
			}

			if (dirty[0] & /*databaseLoaded, message*/ 278528 && div10_class_value !== (div10_class_value = "tabpanel " + (!/*databaseLoaded*/ ctx[14] || /*message*/ ctx[18]
			? 'gone'
			: ''))) {
				attr(div10, "class", div10_class_value);
			}

			if (dirty[0] & /*searchMode*/ 16 && div10_role_value !== (div10_role_value = /*searchMode*/ ctx[4] ? 'region' : 'tabpanel')) {
				attr(div10, "role", div10_role_value);
			}

			if (dirty[0] & /*searchMode, i18n, currentGroup*/ 8209 && div10_aria_label_value !== (div10_aria_label_value = /*searchMode*/ ctx[4]
			? /*i18n*/ ctx[0].searchResultsLabel
			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name])) {
				attr(div10, "aria-label", div10_aria_label_value);
			}

			if (dirty[0] & /*searchMode, currentGroup*/ 8208 && div10_id_value !== (div10_id_value = /*searchMode*/ ctx[4]
			? ''
			: `tab-${/*currentGroup*/ ctx[13].id}`)) {
				attr(div10, "id", div10_id_value);
			}

			if (dirty[0] & /*labelWithSkin, currentFavorites, currentSkinTone, unicodeWithSkin*/ 402654464) {
				each_value = /*currentFavorites*/ ctx[10];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx, each_value, each3_lookup, div11, destroy_block, create_each_block, null, get_each_context);
			}

			if (dirty[0] & /*message*/ 262144 && div11_class_value !== (div11_class_value = "favorites emoji-menu " + (/*message*/ ctx[18] ? 'gone' : ''))) {
				attr(div11, "class", div11_class_value);
			}

			if (dirty[0] & /*i18n*/ 1 && div11_aria_label_value !== (div11_aria_label_value = /*i18n*/ ctx[0].favoritesLabel)) {
				attr(div11, "aria-label", div11_aria_label_value);
			}

			if (dirty[0] & /*scrollbarWidth*/ 33554432) {
				set_style(div11, "padding-inline-end", /*scrollbarWidth*/ ctx[25] + "px");
			}

			if (dirty[0] & /*i18n*/ 1 && section_aria_label_value !== (section_aria_label_value = /*i18n*/ ctx[0].regionLabel)) {
				attr(section, "aria-label", section_aria_label_value);
			}

			if (dirty[0] & /*pickerStyle*/ 4194304) {
				attr(section, "style", /*pickerStyle*/ ctx[22]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(section);

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				each_blocks_3[i].d();
			}

			/*div3_binding*/ ctx[48](null);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].d();
			}

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].d();
			}

			/*div10_binding*/ ctx[50](null);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*button1_binding*/ ctx[51](null);
			/*section_binding*/ ctx[52](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { skinToneEmoji } = $$props;
	let { i18n } = $$props;
	let { database } = $$props;
	let { customEmoji } = $$props;
	let { customCategorySorting } = $$props;

	// private
	let initialLoad = true;

	let currentEmojis = [];
	let currentEmojisWithCategories = []; // eslint-disable-line no-unused-vars
	let rawSearchText = '';
	let searchText = '';
	let rootElement;
	let baselineEmoji;
	let tabpanelElement;
	let searchMode = false; // eslint-disable-line no-unused-vars
	let activeSearchItem = -1;
	let message; // eslint-disable-line no-unused-vars
	let skinTonePickerExpanded = false;
	let skinTonePickerExpandedAfterAnimation = false; // eslint-disable-line no-unused-vars
	let skinToneDropdown;
	let currentSkinTone = 0;
	let activeSkinTone = 0;
	let skinToneButtonText; // eslint-disable-line no-unused-vars
	let pickerStyle; // eslint-disable-line no-unused-vars
	let skinToneButtonLabel = ''; // eslint-disable-line no-unused-vars
	let skinTones = [];
	let currentFavorites = []; // eslint-disable-line no-unused-vars
	let defaultFavoriteEmojis;
	let numColumns = DEFAULT_NUM_COLUMNS;
	let isRtl = false;
	let scrollbarWidth = 0; // eslint-disable-line no-unused-vars
	let currentGroupIndex = 0;
	let groups$1 = groups;
	let currentGroup;
	let databaseLoaded = false; // eslint-disable-line no-unused-vars
	let activeSearchItemId; // eslint-disable-line no-unused-vars

	//
	// Utils/helpers
	//
	const focus = id => {
		rootElement.getRootNode().getElementById(id).focus();
	};

	// fire a custom event that crosses the shadow boundary
	const fireEvent = (name, detail) => {
		rootElement.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
	};

	// eslint-disable-next-line no-unused-vars
	const unicodeWithSkin = (emoji, currentSkinTone) => currentSkinTone && emoji.skins && emoji.skins[currentSkinTone] || emoji.unicode;

	// eslint-disable-next-line no-unused-vars
	const labelWithSkin = (emoji, currentSkinTone) => uniq([
		emoji.name || unicodeWithSkin(emoji, currentSkinTone),
		...emoji.shortcodes || []
	]).join(', ');

	// Detect a skintone option button
	const isSkinToneOption = element => (/^skintone-/).test(element.id);

	//
	// Determine the emoji support level (in requestIdleCallback)
	//
	emojiSupportLevelPromise.then(level => {
		// Can't actually test emoji support in Jest/JSDom, emoji never render in color in Cairo
		/* istanbul ignore next */
		if (!level) {
			$$invalidate(18, message = i18n.emojiUnsupportedMessage);
		}
	});

	//
	// Calculate the width of the emoji grid. This serves two purposes:
	// 1) Re-calculate the --num-columns var because it may have changed
	// 2) Re-calculate the scrollbar width because it may have changed
	//   (i.e. because the number of items changed)
	// 3) Re-calculate whether we're in RTL mode or not.
	//
	// The benefit of doing this in one place is to align with rAF/ResizeObserver
	// and do all the calculations in one go. RTL vs LTR is not strictly width-related,
	// but since we're already reading the style here, and since it's already aligned with
	// the rAF loop, this is the most appropriate place to do it perf-wise.
	//
	// eslint-disable-next-line no-unused-vars
	function calculateEmojiGridStyle(node) {
		return calculateWidth(node, width => {
			/* istanbul ignore next */
			if (true) {
				// jsdom throws errors for this kind of fancy stuff
				// read all the style/layout calculations we need to make
				const style = getComputedStyle(rootElement);

				const newNumColumns = parseInt(style.getPropertyValue('--num-columns'), 10);
				const newIsRtl = style.getPropertyValue('direction') === 'rtl';
				const parentWidth = node.parentElement.getBoundingClientRect().width;
				const newScrollbarWidth = parentWidth - width;

				// write to Svelte variables
				$$invalidate(46, numColumns = newNumColumns);

				$$invalidate(25, scrollbarWidth = newScrollbarWidth); // eslint-disable-line no-unused-vars
				$$invalidate(24, isRtl = newIsRtl); // eslint-disable-line no-unused-vars
			}
		});
	}

	function checkZwjSupportAndUpdate(zwjEmojisToCheck) {
		const rootNode = rootElement.getRootNode();
		const emojiToDomNode = emoji => rootNode.getElementById(`emo-${emoji.id}`);
		checkZwjSupport(zwjEmojisToCheck, baselineEmoji, emojiToDomNode);

		// force update
		$$invalidate(1, currentEmojis = currentEmojis); // eslint-disable-line no-self-assign
	}

	function isZwjSupported(emoji) {
		return !emoji.unicode || !hasZwj(emoji) || supportedZwjEmojis.get(emoji.unicode);
	}

	async function filterEmojisByVersion(emojis) {
		const emojiSupportLevel = await emojiSupportLevelPromise;

		// !version corresponds to custom emoji
		return emojis.filter(({ version }) => !version || version <= emojiSupportLevel);
	}

	async function summarizeEmojis(emojis) {
		return summarizeEmojisForUI(emojis, await emojiSupportLevelPromise);
	}

	async function getEmojisByGroup(group) {

		if (typeof group === 'undefined') {
			return [];
		}

		// -1 is custom emoji
		const emoji = group === -1
		? customEmoji
		: await database.getEmojiByGroup(group);

		return summarizeEmojis(await filterEmojisByVersion(emoji));
	}

	async function getEmojisBySearchQuery(query) {
		return summarizeEmojis(await filterEmojisByVersion(await database.getEmojiBySearchQuery(query)));
	}

	// eslint-disable-next-line no-unused-vars
	function onSearchKeydown(event) {
		if (!searchMode || !currentEmojis.length) {
			return;
		}

		const goToNextOrPrevious = previous => {
			halt(event);
			$$invalidate(5, activeSearchItem = incrementOrDecrement(previous, activeSearchItem, currentEmojis));
		};

		switch (event.key) {
			case 'ArrowDown':
				return goToNextOrPrevious(false);
			case 'ArrowUp':
				return goToNextOrPrevious(true);
			case 'Enter':
				if (activeSearchItem !== -1) {
					halt(event);
					return clickEmoji(currentEmojis[activeSearchItem].id);
				} else if (currentEmojis.length) {
					$$invalidate(5, activeSearchItem = 0);
				}
		}
	}

	//
	// Handle user input on nav
	//
	// eslint-disable-next-line no-unused-vars
	function onNavClick(group) {
		$$invalidate(2, rawSearchText = '');
		$$invalidate(44, searchText = '');
		$$invalidate(5, activeSearchItem = -1);
		$$invalidate(11, currentGroupIndex = groups$1.findIndex(_ => _.id === group.id));
	}

	// eslint-disable-next-line no-unused-vars
	function onNavKeydown(event) {
		const { target, key } = event;

		const doFocus = el => {
			if (el) {
				halt(event);
				el.focus();
			}
		};

		switch (key) {
			case 'ArrowLeft':
				return doFocus(target.previousSibling);
			case 'ArrowRight':
				return doFocus(target.nextSibling);
			case 'Home':
				return doFocus(target.parentElement.firstChild);
			case 'End':
				return doFocus(target.parentElement.lastChild);
		}
	}

	//
	// Handle user input on an emoji
	//
	async function clickEmoji(unicodeOrName) {
		const emoji = await database.getEmojiByUnicodeOrName(unicodeOrName);
		const emojiSummary = [...currentEmojis, ...currentFavorites].find(_ => _.id === unicodeOrName);
		const skinTonedUnicode = emojiSummary.unicode && unicodeWithSkin(emojiSummary, currentSkinTone);
		await database.incrementFavoriteEmojiCount(unicodeOrName);

		fireEvent('emoji-click', {
			emoji,
			skinTone: currentSkinTone,
			...skinTonedUnicode && { unicode: skinTonedUnicode },
			...emojiSummary.name && { name: emojiSummary.name }
		});
	}

	// eslint-disable-next-line no-unused-vars
	async function onEmojiClick(event) {
		const { target } = event;

		if (!target.classList.contains('emoji')) {
			return;
		}

		halt(event);
		const id = target.id.substring(4); // replace 'emo-' or 'fav-' prefix

		/* no await */
		clickEmoji(id);
	}

	//
	// Handle user input on the skintone picker
	//
	// eslint-disable-next-line no-unused-vars
	async function onSkinToneOptionsClick(event) {
		const { target } = event;

		if (!isSkinToneOption(target)) {
			return;
		}

		halt(event);
		const skinTone = parseInt(target.id.slice(9), 10); // remove 'skintone-' prefix
		$$invalidate(8, currentSkinTone = skinTone);
		$$invalidate(6, skinTonePickerExpanded = false);
		focus('skintone-button');
		fireEvent('skin-tone-change', { skinTone });

		/* no await */
		database.setPreferredSkinTone(skinTone);
	}

	// eslint-disable-next-line no-unused-vars
	async function onClickSkinToneButton(event) {
		$$invalidate(6, skinTonePickerExpanded = !skinTonePickerExpanded);
		$$invalidate(20, activeSkinTone = currentSkinTone);

		if (skinTonePickerExpanded) {
			halt(event);
			rAF(() => focus(`skintone-${activeSkinTone}`));
		}
	}

	// eslint-disable-next-line no-unused-vars
	function onSkinToneOptionsKeydown(event) {
		if (!skinTonePickerExpanded) {
			return;
		}

		const changeActiveSkinTone = async nextSkinTone => {
			halt(event);
			$$invalidate(20, activeSkinTone = nextSkinTone);
			await tick();
			focus(`skintone-${activeSkinTone}`);
		};

		switch (event.key) {
			case 'ArrowUp':
				return changeActiveSkinTone(incrementOrDecrement(true, activeSkinTone, skinTones));
			case 'ArrowDown':
				return changeActiveSkinTone(incrementOrDecrement(false, activeSkinTone, skinTones));
			case 'Home':
				return changeActiveSkinTone(0);
			case 'End':
				return changeActiveSkinTone(skinTones.length - 1);
			case 'Enter':
				// enter on keydown, space on keyup. this is just how browsers work for buttons
				// https://lists.w3.org/Archives/Public/w3c-wai-ig/2019JanMar/0086.html
				return onSkinToneOptionsClick(event);
			case 'Escape':
				halt(event);
				$$invalidate(6, skinTonePickerExpanded = false);
				return focus('skintone-button');
		}
	}

	// eslint-disable-next-line no-unused-vars
	function onSkinToneOptionsKeyup(event) {
		if (!skinTonePickerExpanded) {
			return;
		}

		switch (event.key) {
			case ' ':
				// enter on keydown, space on keyup. this is just how browsers work for buttons
				// https://lists.w3.org/Archives/Public/w3c-wai-ig/2019JanMar/0086.html
				return onSkinToneOptionsClick(event);
		}
	}

	// eslint-disable-next-line no-unused-vars
	async function onSkinToneOptionsFocusOut(event) {
		// On blur outside of the skintone options, collapse the skintone picker.
		// Except if focus is just moving to another skintone option, e.g. pressing up/down to change focus
		const { relatedTarget } = event;

		if (!relatedTarget || !isSkinToneOption(relatedTarget)) {
			$$invalidate(6, skinTonePickerExpanded = false);
		}
	}

	function input_input_handler() {
		rawSearchText = this.value;
		$$invalidate(2, rawSearchText);
	}

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			skinToneDropdown = $$value;
			$$invalidate(7, skinToneDropdown);
		});
	}

	const click_handler = group => onNavClick(group);

	function div10_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			tabpanelElement = $$value;
			$$invalidate(3, tabpanelElement);
		});
	}

	function button1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			baselineEmoji = $$value;
			$$invalidate(17, baselineEmoji);
		});
	}

	function section_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			rootElement = $$value;
			$$invalidate(16, rootElement);
		});
	}

	$$self.$$set = $$props => {
		if ('skinToneEmoji' in $$props) $$invalidate(40, skinToneEmoji = $$props.skinToneEmoji);
		if ('i18n' in $$props) $$invalidate(0, i18n = $$props.i18n);
		if ('database' in $$props) $$invalidate(39, database = $$props.database);
		if ('customEmoji' in $$props) $$invalidate(41, customEmoji = $$props.customEmoji);
		if ('customCategorySorting' in $$props) $$invalidate(42, customCategorySorting = $$props.customCategorySorting);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[1] & /*customEmoji, database*/ 1280) {
			/* eslint-enable no-unused-vars */
			//
			// Set or update the customEmoji
			//
			{
				if (customEmoji && database) {
					$$invalidate(39, database.customEmoji = customEmoji, database);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*i18n*/ 1 | $$self.$$.dirty[1] & /*database*/ 256) {
			//
			// Set or update the database object
			//
			{
				// show a Loading message if it takes a long time, or show an error if there's a network/IDB error
				async function handleDatabaseLoading() {
					let showingLoadingMessage = false;

					const timeoutHandle = setTimeout(
						() => {
							showingLoadingMessage = true;
							$$invalidate(18, message = i18n.loadingMessage);
						},
						TIMEOUT_BEFORE_LOADING_MESSAGE
					);

					try {
						await database.ready();
						$$invalidate(14, databaseLoaded = true); // eslint-disable-line no-unused-vars
					} catch(err) {
						console.error(err);
						$$invalidate(18, message = i18n.networkErrorMessage);
					} finally {
						clearTimeout(timeoutHandle);

						if (showingLoadingMessage) {
							// Seems safer than checking the i18n string, which may change
							showingLoadingMessage = false;

							$$invalidate(18, message = ''); // eslint-disable-line no-unused-vars
						}
					}
				}

				if (database) {
					/* no await */
					handleDatabaseLoading();
				}
			}
		}

		if ($$self.$$.dirty[0] & /*groups*/ 4096 | $$self.$$.dirty[1] & /*customEmoji*/ 1024) {
			{
				if (customEmoji && customEmoji.length) {
					$$invalidate(12, groups$1 = [customGroup, ...groups]);
				} else if (groups$1 !== groups) {
					$$invalidate(12, groups$1 = groups);
				}
			}
		}

		if ($$self.$$.dirty[0] & /*rawSearchText*/ 4) {
			/* eslint-enable no-unused-vars */
			//
			// Handle user input on the search input
			//
			{
				rIC(() => {
					$$invalidate(44, searchText = (rawSearchText || '').trim()); // defer to avoid input delays, plus we can trim here
					$$invalidate(5, activeSearchItem = -1);
				});
			}
		}

		if ($$self.$$.dirty[0] & /*groups, currentGroupIndex*/ 6144) {
			//
			// Update the current group based on the currentGroupIndex
			//
			$$invalidate(13, currentGroup = groups$1[currentGroupIndex]);
		}

		if ($$self.$$.dirty[0] & /*databaseLoaded, currentGroup*/ 24576 | $$self.$$.dirty[1] & /*searchText*/ 8192) {
			//
			// Set or update the currentEmojis. Check for invalid ZWJ renderings
			// (i.e. double emoji).
			//
			{
				async function updateEmojis() {

					if (!databaseLoaded) {
						$$invalidate(1, currentEmojis = []);
						$$invalidate(4, searchMode = false);
					} else if (searchText.length >= MIN_SEARCH_TEXT_LENGTH) {
						const currentSearchText = searchText;
						const newEmojis = await getEmojisBySearchQuery(currentSearchText);

						if (currentSearchText === searchText) {
							// if the situation changes asynchronously, do not update
							$$invalidate(1, currentEmojis = newEmojis);

							$$invalidate(4, searchMode = true);
						}
					} else if (currentGroup) {
						const currentGroupId = currentGroup.id;
						const newEmojis = await getEmojisByGroup(currentGroupId);

						if (currentGroupId === currentGroup.id) {
							// if the situation changes asynchronously, do not update
							$$invalidate(1, currentEmojis = newEmojis);

							$$invalidate(4, searchMode = false);
						}
					}
				}

				/* no await */
				updateEmojis();
			}
		}

		if ($$self.$$.dirty[0] & /*groups, searchMode*/ 4112) {
			//
			// Global styles for the entire picker
			//
			/* eslint-disable no-unused-vars */
			$$invalidate(22, pickerStyle = `
  --font-family: ${FONT_FAMILY};
  --num-groups: ${groups$1.length}; 
  --indicator-opacity: ${searchMode ? 0 : 1}; 
  --num-skintones: ${NUM_SKIN_TONES};`);
		}

		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database*/ 256) {
			//
			// Set or update the preferred skin tone
			//
			{
				async function updatePreferredSkinTone() {
					if (databaseLoaded) {
						$$invalidate(8, currentSkinTone = await database.getPreferredSkinTone());
					}
				}

				/* no await */
				updatePreferredSkinTone();
			}
		}

		if ($$self.$$.dirty[1] & /*skinToneEmoji*/ 512) {
			$$invalidate(9, skinTones = Array(NUM_SKIN_TONES).fill().map((_, i) => applySkinTone(skinToneEmoji, i)));
		}

		if ($$self.$$.dirty[0] & /*skinTones, currentSkinTone*/ 768) {
			/* eslint-disable no-unused-vars */
			$$invalidate(21, skinToneButtonText = skinTones[currentSkinTone]);
		}

		if ($$self.$$.dirty[0] & /*i18n, currentSkinTone*/ 257) {
			$$invalidate(23, skinToneButtonLabel = i18n.skinToneLabel.replace('{skinTone}', i18n.skinTones[currentSkinTone]));
		}

		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database*/ 256) {
			/* eslint-enable no-unused-vars */
			//
			// Set or update the favorites emojis
			//
			{
				async function updateDefaultFavoriteEmojis() {
					$$invalidate(45, defaultFavoriteEmojis = (await Promise.all(MOST_COMMONLY_USED_EMOJI.map(unicode => database.getEmojiByUnicodeOrName(unicode)))).filter(Boolean)); // filter because in Jest tests we don't have all the emoji in the DB
				}

				if (databaseLoaded) {
					/* no await */
					updateDefaultFavoriteEmojis();
				}
			}
		}

		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database, numColumns, defaultFavoriteEmojis*/ 49408) {
			{
				async function updateFavorites() {
					const dbFavorites = await database.getTopFavoriteEmoji(numColumns);
					const favorites = await summarizeEmojis(uniqBy([...dbFavorites, ...defaultFavoriteEmojis], _ => _.unicode || _.name).slice(0, numColumns));
					$$invalidate(10, currentFavorites = favorites);
				}

				if (databaseLoaded && defaultFavoriteEmojis) {
					/* no await */
					updateFavorites();
				}
			}
		}

		if ($$self.$$.dirty[0] & /*currentEmojis, tabpanelElement*/ 10) {
			// Some emojis have their ligatures rendered as two or more consecutive emojis
			// We want to treat these the same as unsupported emojis, so we compare their
			// widths against the baseline widths and remove them as necessary
			{
				const zwjEmojisToCheck = currentEmojis.filter(emoji => emoji.unicode).filter(emoji => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode)); // filter custom emoji

				if (zwjEmojisToCheck.length) {
					// render now, check their length later
					rAF(() => checkZwjSupportAndUpdate(zwjEmojisToCheck));
				} else {
					$$invalidate(1, currentEmojis = currentEmojis.filter(isZwjSupported));

					rAF(() => {
						// Avoid Svelte doing an invalidation on the "setter" here.
						// At best the invalidation is useless, at worst it can cause infinite loops:
						// https://github.com/nolanlawson/emoji-picker-element/pull/180
						// https://github.com/sveltejs/svelte/issues/6521
						// Also note tabpanelElement can be null if the element is disconnected
						// immediately after connected, hence `|| {}`
						(tabpanelElement || {}).scrollTop = 0; // reset scroll top to 0 when emojis change
					});
				}
			}
		}

		if ($$self.$$.dirty[0] & /*currentEmojis, currentFavorites*/ 1026 | $$self.$$.dirty[1] & /*initialLoad*/ 4096) {
			{
				// consider initialLoad to be complete when the first tabpanel and favorites are rendered
				/* istanbul ignore next */
				if (false) {}
			}
		}

		if ($$self.$$.dirty[0] & /*searchMode, currentEmojis*/ 18 | $$self.$$.dirty[1] & /*customCategorySorting*/ 2048) {
			//
			// Derive currentEmojisWithCategories from currentEmojis. This is always done even if there
			// are no categories, because it's just easier to code the HTML this way.
			//
			{
				function calculateCurrentEmojisWithCategories() {
					if (searchMode) {
						return [{ category: '', emojis: currentEmojis }];
					}

					const categoriesToEmoji = new Map();

					for (const emoji of currentEmojis) {
						const category = emoji.category || '';
						let emojis = categoriesToEmoji.get(category);

						if (!emojis) {
							emojis = [];
							categoriesToEmoji.set(category, emojis);
						}

						emojis.push(emoji);
					}

					return [...categoriesToEmoji.entries()].map(([category, emojis]) => ({ category, emojis })).sort((a, b) => customCategorySorting(a.category, b.category));
				}

				// eslint-disable-next-line no-unused-vars
				$$invalidate(15, currentEmojisWithCategories = calculateCurrentEmojisWithCategories());
			}
		}

		if ($$self.$$.dirty[0] & /*activeSearchItem, currentEmojis*/ 34) {
			//
			// Handle active search item (i.e. pressing up or down while searching)
			//
			/* eslint-disable no-unused-vars */
			$$invalidate(26, activeSearchItemId = activeSearchItem !== -1 && currentEmojis[activeSearchItem].id);
		}

		if ($$self.$$.dirty[0] & /*skinTonePickerExpanded, skinToneDropdown*/ 192) {
			// To make the animation nicer, change the z-index of the skintone picker button
			// *after* the animation has played. This makes it appear that the picker box
			// is expanding "below" the button
			{
				if (skinTonePickerExpanded) {
					skinToneDropdown.addEventListener(
						'transitionend',
						() => {
							$$invalidate(19, skinTonePickerExpandedAfterAnimation = true); // eslint-disable-line no-unused-vars
						},
						{ once: true }
					);
				} else {
					$$invalidate(19, skinTonePickerExpandedAfterAnimation = false); // eslint-disable-line no-unused-vars
				}
			}
		}
	};

	return [
		i18n,
		currentEmojis,
		rawSearchText,
		tabpanelElement,
		searchMode,
		activeSearchItem,
		skinTonePickerExpanded,
		skinToneDropdown,
		currentSkinTone,
		skinTones,
		currentFavorites,
		currentGroupIndex,
		groups$1,
		currentGroup,
		databaseLoaded,
		currentEmojisWithCategories,
		rootElement,
		baselineEmoji,
		message,
		skinTonePickerExpandedAfterAnimation,
		activeSkinTone,
		skinToneButtonText,
		pickerStyle,
		skinToneButtonLabel,
		isRtl,
		scrollbarWidth,
		activeSearchItemId,
		unicodeWithSkin,
		labelWithSkin,
		calculateEmojiGridStyle,
		onSearchKeydown,
		onNavClick,
		onNavKeydown,
		onEmojiClick,
		onSkinToneOptionsClick,
		onClickSkinToneButton,
		onSkinToneOptionsKeydown,
		onSkinToneOptionsKeyup,
		onSkinToneOptionsFocusOut,
		database,
		skinToneEmoji,
		customEmoji,
		customCategorySorting,
		initialLoad,
		searchText,
		defaultFavoriteEmojis,
		numColumns,
		input_input_handler,
		div3_binding,
		click_handler,
		div10_binding,
		button1_binding,
		section_binding
	];
}

class Picker extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				skinToneEmoji: 40,
				i18n: 0,
				database: 39,
				customEmoji: 41,
				customCategorySorting: 42
			},
			null,
			[-1, -1, -1]
		);
	}
}

const DEFAULT_DATA_SOURCE = 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json';
const DEFAULT_LOCALE = 'en';

var enI18n = {
  categoriesLabel: 'Categories',
  emojiUnsupportedMessage: 'Your browser does not support color emoji.',
  favoritesLabel: 'Favorites',
  loadingMessage: 'Loading…',
  networkErrorMessage: 'Could not load emoji.',
  regionLabel: 'Emoji picker',
  searchDescription: 'When search results are available, press up or down to select and enter to choose.',
  searchLabel: 'Search',
  searchResultsLabel: 'Search results',
  skinToneDescription: 'When expanded, press up or down to select and enter to choose.',
  skinToneLabel: 'Choose a skin tone (currently {skinTone})',
  skinTonesLabel: 'Skin tones',
  skinTones: [
    'Default',
    'Light',
    'Medium-Light',
    'Medium',
    'Medium-Dark',
    'Dark'
  ],
  categories: {
    custom: 'Custom',
    'smileys-emotion': 'Smileys and emoticons',
    'people-body': 'People and body',
    'animals-nature': 'Animals and nature',
    'food-drink': 'Food and drink',
    'travel-places': 'Travel and places',
    activities: 'Activities',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags'
  }
};

const PROPS = [
  'customEmoji',
  'customCategorySorting',
  'database',
  'dataSource',
  'i18n',
  'locale',
  'skinToneEmoji'
];

class PickerElement extends HTMLElement {
  constructor (props) {
    super();
    this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ":host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.custom-emoji,.emoji,button.emoji{height:var(--total-emoji-size);width:var(--total-emoji-size)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;line-height:1;overflow:hidden;font-family:var(--font-family);cursor:pointer}@media (hover:hover)and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.custom-emoji{padding:var(--emoji-padding);object-fit:contain;pointer-events:none;background-repeat:no-repeat;background-position:center center;background-size:var(--emoji-size) var(--emoji-size)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}";
    this.shadowRoot.appendChild(style);
    this._ctx = {
      // Set defaults
      locale: DEFAULT_LOCALE,
      dataSource: DEFAULT_DATA_SOURCE,
      skinToneEmoji: DEFAULT_SKIN_TONE_EMOJI,
      customCategorySorting: DEFAULT_CATEGORY_SORTING,
      customEmoji: null,
      i18n: enI18n,
      ...props
    };
    // Handle properties set before the element was upgraded
    for (const prop of PROPS) {
      if (prop !== 'database' && Object.prototype.hasOwnProperty.call(this, prop)) {
        this._ctx[prop] = this[prop];
        delete this[prop];
      }
    }
    this._dbFlush(); // wait for a flush before creating the db, in case the user calls e.g. a setter or setAttribute
  }

  connectedCallback () {
    this._cmp = new Picker({
      target: this.shadowRoot,
      props: this._ctx
    });
  }

  disconnectedCallback () {
    this._cmp.$destroy();
    this._cmp = undefined;

    const { database } = this._ctx;
    if (database) {
      database.close()
        // only happens if the database failed to load in the first place, so we don't care)
        .catch(err => console.error(err));
    }
  }

  static get observedAttributes () {
    return ['locale', 'data-source', 'skin-tone-emoji'] // complex objects aren't supported, also use kebab-case
  }

  attributeChangedCallback (attrName, oldValue, newValue) {
    // convert from kebab-case to camelcase
    // see https://github.com/sveltejs/svelte/issues/3852#issuecomment-665037015
    this._set(
      attrName.replace(/-([a-z])/g, (_, up) => up.toUpperCase()),
      newValue
    );
  }

  _set (prop, newValue) {
    this._ctx[prop] = newValue;
    if (this._cmp) {
      this._cmp.$set({ [prop]: newValue });
    }
    if (['locale', 'dataSource'].includes(prop)) {
      this._dbFlush();
    }
  }

  _dbCreate () {
    const { locale, dataSource, database } = this._ctx;
    // only create a new database if we really need to
    if (!database || database.locale !== locale || database.dataSource !== dataSource) {
      this._set('database', new _database_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ locale, dataSource }));
    }
  }

  // Update the Database in one microtask if the locale/dataSource change. We do one microtask
  // so we don't create two Databases if e.g. both the locale and the dataSource change
  _dbFlush () {
    Promise.resolve().then(() => (
      this._dbCreate()
    ));
  }
}

const definitions = {};

for (const prop of PROPS) {
  definitions[prop] = {
    get () {
      if (prop === 'database') {
        // in rare cases, the microtask may not be flushed yet, so we need to instantiate the DB
        // now if the user is asking for it
        this._dbCreate();
      }
      return this._ctx[prop]
    },
    set (val) {
      if (prop === 'database') {
        throw new Error('database is read-only')
      }
      this._set(prop, val);
    }
  };
}

Object.defineProperties(PickerElement.prototype, definitions);

customElements.define('emoji-picker', PickerElement);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PickerElement);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"init": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ "./node_modules/bootstrap/dist/css/bootstrap.min.css");
/* harmony import */ var bootstrap_dist_js_bootstrap_bundle_min__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.bundle.min */ "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js");
/* harmony import */ var bootstrap_dist_js_bootstrap_bundle_min__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_bundle_min__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bootstrap_icons_font_bootstrap_icons_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bootstrap-icons/font/bootstrap-icons.scss */ "./node_modules/bootstrap-icons/font/bootstrap-icons.scss");
/* harmony import */ var emoji_picker_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! emoji-picker-element */ "./node_modules/emoji-picker-element/index.js");
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controller */ "./src/controller.js");
/* harmony import */ var _style_sass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.sass */ "./src/style.sass");







(0,_controller__WEBPACK_IMPORTED_MODULE_4__["default"])().init();

})();

/******/ })()
;