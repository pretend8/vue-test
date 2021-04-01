const debounce = {
  inserted: function(el, binding) {
    let timer
    el.addEventListener('mousedown', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 300)
    })
  }
}

export default debounce
