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
  },
  refreshData(data) {
    const temp = this.clone(data)
    data = temp
  },
  uuid32() {
    return this.uuid(32, 16)
  },
  uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = []
    var i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      // rfc4122, version 4 form
      var r

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }

    return uuid.join('')
  }
}
