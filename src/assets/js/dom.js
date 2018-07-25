import Vue from 'vue'

const isServer = Vue.prototype.$isServer
const ieVersion = isServer ? 0 : Number(document.documentMode)
// eslint-disable-next-line
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/* istanbul ignore next */
export function hasClass(element, className) {
  if (!element || !className) return false
  if (className.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (element.classList) {
    return element.classList.contains(className)
  } else {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass(element, className) {
  if (!element) return
  var curClass = element.className
  var classes = (className || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (element.classList) {
      element.classList.add(clsName)
    } else if (!hasClass(element, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!element.classList) {
    element.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(element, className) {
  if (!element || !className) return
  var classes = className.split(' ')
  var curClass = ' ' + element.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (element.classList) {
      element.classList.remove(clsName)
    } else if (hasClass(element, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!element.classList) {
    element.className = trim(curClass)
  }
}

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
    case 'opacity':
      try {
        return element.filters.item('alpha').opacity / 100
      } catch (e) {
        return 1.0
      }
    default:
      return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null)
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function (element, styleName) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      element.style[styleName] = value
    }
  }
}
