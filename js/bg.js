//获取canvas对象
var c=document.getElementById("canvas");
//获取绘画环境
var ctx=c.getContext("2d");
//设置画布的大小
var w=c.width=window.innerWidth;
var h=c.height=window.innerHeight;
// console.log(w+" "+h);
//设置渐变颜色
var clearColor='rgba(0,0,0,.1)';
//设置水滴的初始值
var max=30;
//定义数组来存放水滴
var drops = [];

//定义随机函数
function random(min,max){
    return Math.random()*(max-min)+min;
}

//定义构造函数
function O(){};
//设置函数原型
O.prototype={
    init:function(){
        //下落的坐标
        this.x=random(0,w);
        this.y=0;
        /*
        H： Hue(色调)。0(或360)  表示红色，120表示绿色，240表示蓝色，
            也可取其他数值来指定颜色。取值为：0 - 360
        S： Saturation(饱和度)。取值为：0.0% - 100.0%
        L：Lightness(亮度)。取值为：0.0% - 100.0%
       */
        this.color="hsl(180,100%,50%)";   //颜色
        this.w=2;  //设置椭圆初始的宽度
        this.h=1;   //设置椭圆初始的高度
        this.vw=3;   //椭圆的水平扩散的速度
        this.vh=1;     //椭圆的竖直扩散的速度

        this.vy=random(4,5);  //水滴的下落的速度 this.vy=Math.randow()*(5-4)+4
        this.size=2;   //水滴的宽度
        this.hit=random(h*0.8,h*0.9);    //水滴下落的最大高度this.hit=Math.randow()*(0.1)*window.innerHeight +0.8*windowinnerHeight
        this.a=1;    //透明度
        this.va=0.96;   //透明度的渐变度
    },

    draw:function(){
        // 如果雨滴的坐标达到y，画圆圈。
        if(this.y>this.hit){
            //开始绘画
            ctx.beginPath();
            //绘画起点
            ctx.moveTo(this.x,this.y-this.h/2);
            //贝赛尔曲线画上半圆，下半圆（我看不懂）
            //bezierCurveTo()方法通过使用表示三次贝塞尔曲线的指定控制点， 向当前路径添加一个点。
            //提示：三次贝塞尔曲线需要三个点。前两个点是用于三次贝塞尔计算中的控制点，第三个点是曲线的结束点。曲线的开始点是当前路径中最后一个点。如果路径不存在，那么请使用 beginPath() 和 moveTo() 方法来定义开始点。
            //右半圆
            ctx.bezierCurveTo(
                this.x+this.w/2,this.y-this.h/2,
                this.x+this.w/2,this.y+this.h/2,
                this.x,this.y+this.h/2        //结束点
             );
            //左半圆
            ctx.bezierCurveTo(
                this.x-this.w/2,this.y+this.h/2,
                this.x-this.w/2,this.y-this.h/2,
                this.x,this.y-this.h/2
            );

            //上色
            ctx.strokeStyle="hsla(180,100%,50%,"+this.a+")";
            ctx.stroke();
            //关闭路径
            ctx.closePath();
        }else{
            //水滴画矩形
            ctx.fillStyle=this.color;
            //矩形语法：context.fillRect(x,y,width,height);
            ctx.fillRect(this.x,this.y,this.size,this.size*5);
        }
        this.update();
    },
    //gengxin
    update:function(){
        if(this.y<this.hit){    //水滴在下落过程中改变y的值
            this.y +=this.vy;
        }else{
            if(this.a >0.03){   //水滴下落过程中透明度大于0.03
                this.w +=this.vw;   //改变椭圆的宽度
                this.h +=this.vh;   //改变椭圆的高度

                if(this.w>100){   //当椭圆的宽度到达100时
                    this.a *=this.va;    //透明度变浅
                    this.w *=0.98;   //椭圆的宽度变化
                    this.h *=0.98;    //椭圆的高度变化
                }
            }else{
                //椭圆的透明度小于0.03时,恢复初始值
                //调用初始化函数
                this.init();

            }
        }
    }
}


//窗口的改变
function resize(){
    w=c.width=window.innerWidth;
    h=c.height=window.innerHeight;
}

//初始化数组，在不同的时间存放入数组
function setup(){
    for (var i = 0; i < max; i++) {
        //使用闭包
        (function(j){
            setTimeout(function(){
                //创建面向对象
                var o=new O();
                o.init();
                drops.push(o);
            }, j*200);
        })(i);
    };
}

//调用数组中的原型方法
function anim(){
    ctx.fillStyle=clearColor;
    ctx.fillRect(0,0,w,h);
    for(var i in drops){
        drops[i].draw();
    }
    //通过requestAnimationFrame()，JS动画能够和CSS动画/变换或SVG SMIL动画同步发生。另外，如果在一个浏览器标签页里运行一个动画，当这个标签页不可见时，浏览器会暂停它，这会减少CPU，内存的压力，节省电池电量。
    requestAnimationFrame(anim);
}

//监听事件
window.addEventListener("load",resize);
setup();
anim();