

//封装一下
function animate(obj, target, callback) {
    //当我们不断的点击按钮，这个元素的速度会越来越快，因为点击一次btn就会执行一次函数，会开启了太多的定时器
    clearInterval(obj.go);//每次点击btn时第一步先清除定时器
    obj.go = setInterval(move, 10);//给obj对象添加go属性，这样每次调用函数不会声明同一个对象
    function move() {
        var step = (target - obj.offsetLeft) / 10;//步长值写到定时器里面
        step = step > 0 ? Math.ceil(step) : Math.floor(step);//三目运算符
        // Math.ceil(step);
        if (obj.offsetLeft == target) {//为什么判断条件要写在定时器里面呢？因为需要在里面判断  
            clearInterval(obj.go);
            if (callback) {
                callback();//回调函数 在定时器结束后执行回调函数
            }
        } else { obj.style.left = obj.offsetLeft + step + 'px'; }
    }
}