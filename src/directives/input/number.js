const anyNumber = {
  inserted: function(el, binding) {
    el.addEventListener('keypress', function(e) {
      e = e || window.event
      let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode
      let re = /\d/
      // 正整数
      if (binding.arg === 'positiveInteger') {
        if (
          !re.test(String.fromCharCode(charcode)) &&
          charcode > 9 &&
          !e.ctrlKey
        ) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }
        // 正数
      } else if (binding.arg === 'positiveNumber') {
        if (charcode == 46) {
          if (el.value.includes('.')) {
            e.preventDefault()
          }
          return
        } else if (
          !re.test(String.fromCharCode(charcode)) &&
          charcode > 9 &&
          !e.ctrlKey
        ) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }
      } else {
        // 任何数字
        if (el.value === '' && charcode === 45) {
          return true
        } else if (el.value !== '' && charcode === 45) {
          e.preventDefault()
          return false
        }
        if (charcode === 46) {
          if (el.value.includes('.')) {
            e.preventDefault()
          }
          return true
        } else if (
          !re.test(String.fromCharCode(charcode)) &&
          charcode > 9 &&
          !e.ctrlKey
        ) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }
      }
    })
  }
}

export default anyNumber
