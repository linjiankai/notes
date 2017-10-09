//函数节流和函数防抖
//作用：优化高频率执行js代码

//函数节流是指一定时间内js方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。

//函数防抖是指频繁触发的情况下，只有足够的空闲时间，才执行代码一次。
//比如生活中的坐公交，就是一定时间内，如果有人陆续刷卡上车，司机就不会开车。只有别人没刷卡了，司机才开车。

/* 正常滚动 */
document.getElementById("normal").onscroll = function(){
    console.log("普通滚动");
};
/* 函数节流 */
//mousemove,onscroll,onresize时间触发的频率很高，很消耗性能。所以我们限制300毫秒触发
var canRun = true;
document.getElementById("throttle").onscroll = function(){
    if(!canRun){
        // 判断是否已空闲，如果在执行中，则直接return
        return;
    }

    canRun = false;
    setTimeout(function(){
        console.log("函数节流");
        canRun = true;
    }, 300);
};
/* 函数防抖 */
//就是巧用setTimeout做缓存池，而且可以轻易地清除待执行的代码。说白了就是执行最后一次。
var timer = false;
document.getElementById("debounce").onscroll = function(){
    clearTimeout(timer); // 清除未执行的代码，重置回初始化状态

    timer = setTimeout(function(){
        console.log("函数防抖");
    }, 300);
};	





//onmousemove其他案例
var count = 0;
function beginCount() {
    count++;
    console.log(count);
}
function delayFn(method, thisArg) {
    clearTimeout(method.props);
    method.props = setTimeout(function () {
        method.call(thisArg)
    },100)
}
document.onmousemove = function () {
    // delayFn(beginCount)
};
//上述方法在不断触发停下来等待100ms才开始执行，中间操作得太快直接无视。

function delayFn2 (fn, delay, mustDelay){
    var timer = null;
    var t_start;
    return function(){
        var context = this, args = arguments, t_cur = +new Date();
        //先清理上一次的调用触发（上一次调用触发事件不执行）
        clearTimeout(timer);
        //如果不存触发时间，那么当前的时间就是触发时间
        if(!t_start){
            t_start = t_cur;
        }
        //如果当前时间-触发时间大于最大的间隔时间（mustDelay），触发一次函数运行函数
        if(t_cur - t_start >= mustDelay){
            fn.apply(context, args);
            t_start = t_cur;
        }
        //否则延迟执行
        else {
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        }
    };
}
var count=0;
function fn1(){
   count++;
   console.log(count)
} 
//100ms内连续触发的调用，后一个调用会把前一个调用的等待处理掉，但每隔200ms至少执行一次
// document.onmousemove=delayFn2(fn1,100,200)

