window.addEventListener('load', function () {
    //获取元素
    var arrowl = document.querySelector('.arrow-l');
    var arrowr = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focuswidth = focus.offsetWidth;//focus的宽度，相当于图片的宽度
    //鼠标经过
    focus.addEventListener('mouseenter', function () {
        arrowl.style.visibility = 'visible';
        arrowr.style.visibility = 'visible';
        clearInterval(go);
        go = null;//请空这个变量
    });
    //鼠标离开
    focus.addEventListener('mouseleave', function () {
        arrowl.style.visibility = 'hidden';
        arrowr.style.visibility = 'hidden';
        go = setInterval(function () {
            arrowr.click();
        }, 2500);
    });

    //动态添加小圆点
    var ul = focus.querySelector('ul');
    var circle = document.querySelector('.circle');
    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li');//创建元素（节点）li
        li.setAttribute('index', i);//设置自定义属性index
        circle.appendChild(li);//将新创建的元素li插入到父元素类名为“circle”里面
        circle.children[0].className = 'current';//在这里加是因为需要第一个圆点默认显示
        li.addEventListener('click', function () {
            for (var i = 0; i < circle.children.length; i++) {
                circle.children[i].className = '';
            }
            this.className = 'current';
            //点击小圆圈，移动图片 当然移动的是ul
            //算法： ul的移动距离:小圆圈的索引号乘以图片的宽度。注意是负值，因为是从右往左移动
            var index = this.getAttribute('index');//获得li的自定义属性 一定要用this！！！不然他就会用最后一个li
            num = index;
            add = index;
            console.log(index);
            console.log(focuswidth);

            animate(ul, -index * focuswidth);
        });
    };


    //添加滚动按钮事件
    //克隆第一张li，把它放在ul的最后面;
    //lastChild.cloneNode(true)
    var newli = ul.children[0].cloneNode(true);//拷贝ul的第一个孩子li,深拷贝,会拷贝里面的子节点
    ul.appendChild(newli);//将newli放在ul的最后面
    var num = 0;//声明此变量是为了每次点击按钮图片变换一次
    var add = 0;
    //节流阀，使轮播图的上一个图片播放完才放下一个图片
    var flag = true;
    arrowr.addEventListener('click', function () {
        if (flag == true) {//判断flag=true吗，如果成立才执行代码
            // flag = flase; 目前用了没反应
            if (num == ul.children.length - 1) {
                ul.style.left = 0;//无缝滚动,需要多设置一张li,然后滚动到最后一张的时候将ul的left为0,这样最后一张就变成了第一张
                num = 0;//变成第一张后让num=0，又可以从新开始滚动.
            }
            num++;
            animate(ul, - num * focuswidth, function () {//后面这个是回调函数，等动画执行完才执行
                flag = true;
            });

            add++;
            if (add == circle.children.length) {
                add = 0;
            }
            circleChange();
        }
    });


    arrowl.addEventListener('click', function () {
        if (flag == true) {
            // flag = flase; 目前用了没反应
            if (num == 0) {
                num = ul.children.length - 1;//4
                ul.style.left = -num * focuswidth + 'px';
            }
            num--;
            animate(ul, -num * focuswidth, function () {
                flag = true;
            });

            add--;
            if (add < 0) {
                add = circle.children.length - 1;
            }
            circleChange();
        }
    });

    var go = setInterval(function () {
        //手动调用事件
        arrowr.click();
    }, 4000);//添加定时器，使轮播图自动播放

    function circleChange() {
        for (var i = 0; i < circle.children.length; i++) {
            circle.children[i].className = '';
        }
        circle.children[add].className = 'current';
    }
});

$(function () {
    var flag = true;//互斥锁(节流阀)
    //电梯模块淡入淡出
    function toggleTool() {
        if ($(document).scrollTop() >= $(".recom").offset().top) {
            $(".fixedtool").fadeIn();
        } else {
            $(".fixedtool").fadeOut();
        }
    };

    toggleTool();//页面一加载调用这个函数

    $(window).scroll(function () {
        toggleTool();//页面滚动时调用这个函数
        //页面滚动到某个内容区域，左侧电梯导航小li相对应添加和删除current类名
        if (flag) {//互斥锁(节流阀) false后不执行下面代码，就不会出现点击进行页面滚动时添加删除类，li的背景就不会跳
            $(".floor .w").each(function (i, ele) {
                var s = $(ele).offset().top;
                if ($(document).scrollTop() >= (s - 10)) {
                    $(".fixedtool ul li").eq(i).addClass("currents").siblings().removeClass();
                } else {
                    return;
                }
            })
        }
    });


    $(".fixedtool ul li").click(function () {
        flag = false;//互斥锁(节流阀) 点击时关闭
        console.log($(this).index());
        var n = $(".floor .w").eq($(this).index()).offset().top;
        $("body,html").stop().animate({
            scrollTop: n,
        }, 500, function () {
            flag = true;
        });
        $(this).addClass("currents").siblings().removeClass();//添加类移除类不需要加".";犯了这个错误所以没反应
    });


})
