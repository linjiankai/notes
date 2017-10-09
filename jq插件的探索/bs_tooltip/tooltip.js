+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================


  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.0'

  Tooltip.TRANSITION_DURATION = 150

  //默认参数
  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  //初始化
  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    //初始化参数
    this.options   = this.getOptions(options)

    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    //多个触发器 即触发函数
    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        //绑定事件处理程序
        //事件命名空间 'click.tooltip'
        //触发时执行$.proxy(this.toggle, this)返回的函数
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  //获得初始化参数
  Tooltip.prototype.getOptions = function (options) {
    // this.$element.data() data-key = value 形式的属性获取 
    // 返回一个对象{key:value}
    // options > 元素属性  > 默认  
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    //delay 为数字 特殊处理
    //delay 为对象  delay:{ show: 500, hide: 100 }
    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  //提示框显示
  Tooltip.prototype.enter = function (obj) {
    //obj是否是tooltip的实例
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    //$tip.is(':visible') 该div是否可见
    //可见时 只更新状态  然后直接返回
    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    //self 不存在
    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    //上次点击延时未显示 则取消显示
    clearTimeout(self.timeout)

    //设置状态
    self.hoverState = 'in'

    //delay: 数字 (默认 0) 或   对象  { show: 500, hide: 100 }
    //没有delay delay.show 时  直接显示 
    if (!self.options.delay || !self.options.delay.show) return self.show()

    //延时显示  self.options.delay.show:延时时间
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  //提示框隐藏
  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  //提示框显示核心方法
  Tooltip.prototype.show = function () {
    console.info(this)  
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      //判断是否在根节点中
      //this.$element[0] 转换为DOM对象
      //.ownerDocument Document文档对象
      //.documentElement 根节点 HTML标签
      //$.contains 一个DOM节点是否包含另一个DOM节点。
      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])

      //调用preventDefault 或 不在根节点  return
      //事件对象中是否调用过 event.preventDefault()
      //event.preventDefault():阻止元素发生默认的行为
      //如  当点击提交按钮时阻止对表单的提交 、 阻止以下 URL 的链接
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)
      //设置提示框的title
      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)
      //参数animation
      if (this.options.animation) $tip.addClass('fade')

      //参数placement 提示框的位置 top bottom left right
      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      // 判断placement是否包含"auto"
      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      //包含 "auto"时
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        //detach() 删除匹配的对象  与remove()不同的是，所有绑定的事件、附加的数据等都会保留下来
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)
      //参数 container 向指定元素添加该提示框
      //没有 添加到当前元素后面
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      //位置对象pos pos =  {top: , right: , bottom: , left: , width: ,scroll:}
      var pos          = this.getPosition()
      //提示框自身实际的 width height
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      //计算提示框的偏移量 {top: , left: }
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      //应用并设置偏移量
      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    //获得提示框自身的外边距的值
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    //是否是非数字
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    //计算的偏移量 + 自身的外边距
    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    // 应用了offset.setOffset方法，传入了using参数，因为offset设置值的时候，不能四舍五入
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    //添加 in class 让提示框显示
    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    //获取显示后的提示框的宽和高  检查是否调整了自身的大小
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight


    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  //设置提示框的title
  Tooltip.prototype.setContent = function () {
    //div
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  //获取位置
  Tooltip.prototype.getPosition = function ($element) {
    //不传入 则为当前点击元素
    $element   = $element || this.$element

    //转换为DOM对象
    var el     = $element[0]
    //是否是body元素
    var isBody = el.tagName == 'BODY'
    //获取元素各边与页面上边和左边的距离 left right top bottom height width
    var elRect    = el.getBoundingClientRect()
    //兼容IE8 没有 width height 则计算
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    //当前元素相对于文档的偏移量
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    //垂直滚动条的距离
    //document.documentElement.scrollTop 和 document.body.scrollTop 浏览器兼容 
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null
    //合并 
    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  //计算偏移量
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {

    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }


  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }

    //默认参数
    //viewport: {
    //  selector: 'body',
    //  padding: 0
    //}
    //默认的话  this.$viewport = 'body'
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    //this.$viewport = 'body' width height为 window的
    var viewportDimensions = this.getPosition(this.$viewport)
    console.info(viewportDimensions)
    if (/right|left/.test(placement)) {

      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {

      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  //提示框的title
  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options
    //先获取当前元素的data-original-title属性
    //否则获取参数title
    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  //随机生成唯一id  0 -- 100000 id值   
  Tooltip.prototype.getUID = function (prefix) {
    //~~ 去掉小数部分
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  //生成提示框的div
  //不存在 则用模板
  //<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>
  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  //click 事件触发时执行的函数
  Tooltip.prototype.toggle = function (e) {
    //this tooltip实例对象
    var self = this
    if (e) {
      //e.currentTarget  返回注册该事件处理程序的元素
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }
    //判断提示框当前的状态
    //true 当前显示 需要隐藏
    //false 相反
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      //所选元素是否有  key为:bs.tooltip 对应的value值
      //Bootstrap的对象数据缓存
      var data     = $this.data('bs.tooltip')
      //option为对象 options:option
      //option为字符串 则是方法 options:false 
      var options  = typeof option == 'object' && option
      //option是对象 执行初始化 ，并提供了选择器
      var selector = options && options.selector

      //是destroy 方法 不执行
      if (!data && option == 'destroy') return
      //tooltip初始化
      if (selector) {
        //存在选择器，则将当前点击元素 bs.tooltip = {} 即去掉Tooltip实例
        if (!data) $this.data('bs.tooltip', (data = {}))
        //给选择器加上Tooltip实例
        if (!data[selector]) data[selector] = new Tooltip(this, options)

      } else {
        //没有value值时，则加上 bs.tooltip = data(new Tooltip(this, options))  
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }

      //执行方法
      if (typeof option == 'string') data[option]()
    })
  }

  //缓存以前$.fn上的tooltip
  //将原先的tooltip插件对象赋值给一个临时变量old,防止插件冲突
  var old = $.fn.tooltip

  //添加到jQuery对象上
  //插件的定义
  $.fn.tooltip             = Plugin
  // 类赋值到jQuery tooltip对象的Constructor属性
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  //tooltip冲突时 调用该方法
  //var other = $("#aa").tooltip().noConflict();
  // 执行该函数，恢复原先的tooltip定义，并返回Bootstrap定义的tooltip插件 
  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);