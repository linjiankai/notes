/* ========================================================================
 * Bootstrap: button.js v3.3.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

   // 类定义  button类构造函数 
  var Button = function (element, options) {
    this.$element  = $(element)
    //jQuery的扩展方法，插件必备：将options合并到Button.DEFAULTS中
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    //为了兼容<button>Submit</button>和<input type="button" value="submit">的两种写法
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit

   //$.proxy()该方法通常用于向上下文指向不同对象的元素添加事件。保证了this指向，避免作用域改变而导致错误  
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    //closest表示从this.$element开始检索拥有data-toggle="buttons"属性的标签  
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      //arai盲人无障碍阅读属性  
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      //Bootstrap的对象数据缓存
      // 获取存储的Button对象，如果是第一次执行变量data的值为undefined  
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option
      // 创建Button对象: new Button(this, options)，  
      // 并赋值给变量data: data = new Button(this, options)  
      // 存储在元素的jQuery对象上的‘bs.button’数据字段 $this.data('bs.button', data) 
      if (!data) $this.data('bs.button', (data = new Button(this, options)))
      // data是一个Button对象，可以调用Button的原生方法  
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

// Bootstrap的防止冲突
// 将原先的button插件对象赋值给一个临时变量old  
  var old = $.fn.bsbutton
  // 插件定义 
  $.fn.bsbutton             = Plugin
   // 类赋值到jQuery button对象的Constructor属性,可以通过这个为插件做自定义扩展
  $.fn.bsbutton.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  // 执行该函数，恢复原先的button定义，并返回Bootstrap定义的button插件  
  $.fn.bsbutton.noConflict = function () {
    $.fn.bsbutton = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', e.type == 'focus')
    })

}(jQuery);
