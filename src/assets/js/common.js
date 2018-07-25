export default {
  isValidIP(ip) {
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
  },
  isEmail(email) {
    let reg = new RegExp(
      '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
    )
    return reg.test(email)
  },
  isEmpty(obj) {
    return typeof obj === 'undefined' || obj === null || obj === ''
  },
  clone(obj) {
    // Handle the 3 simple types, and null or undefined or function
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    // Handle Date
    if (obj instanceof Date) {
      var date = new Date()
      date.setTime(obj.getTime())
      return date
    }
    // Handle Array or Object
    if (obj instanceof Array | obj instanceof Object) {
      var dest = (obj instanceof Array) ? [] : {}
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          dest[attr] = this.clone(obj[attr])
        }
      }
      return dest
    }
    throw new Error("Unable to clone obj! Its type isn't supported.")
  },
  expandUrl(url, obj) {
    for (var key in obj) {
      url = url.replace(new RegExp('{' + key + '}', 'g'), obj[key])
    }
    return url
  }
}
