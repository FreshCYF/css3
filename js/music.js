function $(id){
    return document.getElementById(id);
}
//获取audio
var audioDom=$('audio');
window.onload=function(){
    //调用面向对象里的方法
    lrc.init( $("lrccontext").value);
    //监听当前的播放时间
    //timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
    //timeupdate 事件通常与 Audio/Video 对象的 currentTime 属性一起使用，该属性返回音频/视频（audio/video）的播放位置（以秒计）。
    audioDom.ontimeupdate=function(){
        var t=parseInt(this.currentTime);
        // console.log(t);
        lrc.jump(t);
    };
}

//字面量的方法声明一个对象
var lrc={
     regex_trim:/^\s+|\s+$/,    //正则的方式来去掉首尾的空格
     // 给对象添加解析歌词的方法
     init:function(lrctext){
        var html="";
        var arr=lrctext.split('\n');   //将歌词以回车键来进行切割
        // console.log(arr);
        //遍历
        for(var i=0;i<arr.length;i++){
            //将切割下来的每一句歌词的空格变为空
            var item =arr[i].replace(this.regex_trim,"");
            //用]来分割成时间和歌词两部分
            var ms=item.split("]");
            // console.log(ms);

            //将每一个的ms的前半部分的时间用[替换为空
            var mt= ms[0].replace("[","");
            // console.log(mt);

            //将得到的时间用：来进行切割
            var m=mt.split(":");
            // console.log(m);
            //将得到的时间转换为秒
            var num=parseInt(m[0]*60+m[1]*1);
            // console.log(num);

            //后半部分的歌词
            var lrc=ms[1];
            //如果歌词存在就把时间对应的歌词添加到变量html中去
            if(lrc){
                html +="<li id='t_"+num+"'>"+lrc+"</li>";
            };
        };
        $("lrc_list").innerHTML +=html;
     },

    // 歌词跳动的函数
    jump:function(duration){
        // console.log(duration);
        // 行参duration是audio当前播放的时间
        //获取当前监听到的li,当前的时间作为他的id
        var dom=$("t_"+duration);
            // console.log(dom);

        //获取ul
        var lrcbox=$("lrc_list");
        if(dom){
            //调用siblings()函数来获取到的li兄弟
            var arr=this.siblings(dom);
            //遍历
            for(var i=0;i<arr.length;i++){
                arr[i].className="";
            }
            dom.className="hover";
            //调用idnexof的函数来当前li的下标    this指代的的当前的li
            var index=this.indexof(dom)-4;
            //将歌词通过margin值来进行移动
            lrcbox.style.marginTop=(index<0?0:index)*-28+"px";
        }
    },

    //判断下标
    indexof:function(dom){
        var listDoms=dom.parentElement.children;
        var index=0;
        for(var i=0;i<listDoms.length;i++){
            //判断当前的播放的时间和转换的时间是否相等
            if(listDoms[i] == dom){
                index=i;
                break;
            }
        }
        return  index;
    },

    //判断同辈元素
    siblings:function(dom){
        var listDoms=dom.parentElement.children;
        var arr=[];
        for(var i=0;i<listDoms.length;i++){
            if(listDoms[i]!= dom){
                arr.push(listDoms[i]);
            }
        }
        return arr;
    }
}