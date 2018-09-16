//依赖于deskapi.js
//依赖于functionLibrary.js
//需要等待网页加载完成
//确保以上情况下执行此js

var deskfun={};

//系统内部调用方法，禁止应用调用
deskfun._iconclick=function(e){
    var _this=this;
    var appname=e.currentTarget.dataset.on;
    var approot='app/'+appname+'/';
    functionLibrary.ajax_get(approot+'main.json',function(e){
        var cou=JSON.parse(e);
        cou.zindex=10000+_this.windows.length;
        cou.handle=true;
        cou.ico = cou.ico.replace(/\<root\>/,'/app/'+appname);
        cou.val = cou.val.replace(/\<root\>/,'/app/'+appname);
        _this.windows.push(cou);
        deskapi.window_getfocus(_this.windows.length-1);
    })
};
deskfun._windowdown=function(cla){
    var tn=this.nowwindowchange;
    tn.status=true;
    tn.cursor='default',
    tn.index=cla.idx;
    tn.type=10;
    tn.pos=[cla.x,cla.y,0,0];
    deskapi.window_getfocus(cla.idx);//获取窗口焦点
};
deskfun._windowmove=function(e){
    var tw=this.windows[this.nowwindowchange.index];
    var tn=this.nowwindowchange;
    if(tn.type==10){
        this.windows[tn.index].pos=[
            e.clientY-tn.pos[1],
            e.clientX-tn.pos[0],
            this.windows[tn.index].pos[2],
            this.windows[tn.index].pos[3]
        ];
    }else if(tn.type>=20 && tn.type<=29){
        var pos=[
            tn.pos[0],tn.pos[1],tn.pos[2],tn.pos[3],
        ];
        switch(tn.type){
            case 21:case 25:case 26: //N
                pos[0]=e.clientY;
                pos[3]=tn.pos[3]-e.clientY+tn.pos[0];
                break;
            case 22:case 27:case 28: //S
                pos[3]=e.clientY-tn.pos[0];
                break;
        }
        switch(tn.type){
            case 23:case 25:case 27: //W
                pos[1]=e.clientX;
                pos[2]=tn.pos[2]-e.clientX+tn.pos[1];
                break;
            case 24:case 26:case 28: //E
                pos[2]=e.clientX-tn.pos[1];
                break;
        }
        this.windows[tn.index].pos=pos;
    }
};
deskfun._windowup=function(e){
    this.nowwindowchange.status=false;
};
deskfun._windowresize=function(cla){
    var tn=this.nowwindowchange;
    tn.status=true;
    tn.index=cla.idx;
    tn.type=20+parseInt(cla.type);
    switch(parseInt(cla.type)){
        case 1:case 2:
            tn.cursor='n-resize';break;
        case 3:case 4:
            tn.cursor='e-resize';break;
        case 5:case 8:
            tn.cursor='se-resize';break;
        case 6:case 7:
            tn.cursor='sw-resize';break;
    }
    var pos=[
        this.windows[cla.idx].pos[0],
        this.windows[cla.idx].pos[1],
        this.windows[cla.idx].pos[2],
        this.windows[cla.idx].pos[3]
    ];
    this.nowwindowchange.pos=pos;
    deskapi.window_getfocus(cla.idx);//获取窗口焦点
};
deskfun._windowclose=function(cla){
    this.windows.splice(cla.idx,1);
};
deskfun._windowgetfocus=function(cla){
    deskapi.window_getfocus(cla.idx);
};


//ICON与WINDOW网页代码模板
deskfun.window_template=`
    <div class='window' :class="{'window-handle':val.handle}" :style="{
        top:val.pos[0]+'px',
        left:val.pos[1]+'px',
        width:val.pos[2]+'px',
        height:val.pos[3]+'px',
        minWidth:val.min[0]+'px',
        minHeight:val.min[1]+'px',
        maxWidth:val.max[0]+'px',
        maxHeight:val.max[1]+'px',
        zIndex:val.zindex
    }">
    <div class="window-resize" v-if="val.resize" @mousedown="resize">
        <div class="window-resize-n" data-t="1"></div>
        <div class="window-resize-s" data-t="2"></div>
        <div class="window-resize-w" data-t="3"></div>
        <div class="window-resize-e" data-t="4"></div>
        <div class="window-resize-nw" data-t="5"></div>
        <div class="window-resize-ne" data-t="6"></div>
        <div class="window-resize-sw" data-t="7"></div>
        <div class="window-resize-se" data-t="8"></div>
    </div>
    <div class="window-border" v-if="val.style==0">
        <div class="window-icon"
            :style="{backgroundImage:'url('+val.ico+')'}"
            @mousedown="move"
        ></div>
        <div class="window-title" @mousedown="move">
            {{val.name}}
        </div>
        <div class="window-close" @click="close"></div>
    </div>
    <div class="window-val" @mousedown="getfocus" :style="{}">
        <iframe :src="val.val"></iframe>
    </div>
    <div class="window-cover" @mousedown="getfocus"></div>
</div>
`;
deskfun.icon_template=`
    <div class='icon' :data-on="val.on" @click="cli">
            <div class="icon-ico" 
                :style="{backgroundImage:'url('+val.ico+')'}"
            ></div>
            <div class="icon-name">{{val.name}}</div>
    </div>
`;


//VUE load
window.desktop=new Vue({
    el:".desktop",
    data:{
        bg:"image/desktopbg.jpg",
        nowwindowchange:{
            status:false,
            cursor:'default',
            index:null,
            type:null,
            pos:[0,0,0,0]
        },
        icons:[],
        windows:[]
    },
    methods:{
        iconclick:deskfun._iconclick,
        windowdown:deskfun._windowdown,
        windowmove:deskfun._windowmove,
        windowup:deskfun._windowup,
        windowresize:deskfun._windowresize,
        windowclose:deskfun._windowclose,
        windowgetfocus:deskfun._windowgetfocus
    },
    components:{
        icon:{
            props:["val"],
            template:deskfun.icon_template,
            methods:{
                cli:function(e){this.$emit("cli",e);}
            }
        },
        window:{
            props:["val"],
            template:deskfun.window_template,
            methods:{
                resize:function(e){
                    var id=e.target.parentNode.parentNode;
                    var idx=id.dataset.index;
                    var _thiswindow=this.windows;
                    this.$emit("windowresize",{
                        idx:id.dataset.index,
                        x:e.clientX-id.offsetLeft,
                        y:e.clientY-id.offsetTop,
                        type:e.target.dataset.t
                    });
                },
                move:function(e){
                    var id=e.currentTarget.parentNode.parentNode;
                    this.$emit("windowmove",{
                        idx:id.dataset.index,
                        x:e.clientX-id.offsetLeft,
                        y:e.clientY-id.offsetTop
                    });
                },
                close:function(e){
                    var id=e.currentTarget.parentNode.parentNode;
                    this.$emit("windowclose",{
                        idx:id.dataset.index
                    });
                },
                getfocus:function(e){
                    var id=e.currentTarget.parentNode;
                    this.$emit("windowgetfocus",{
                        idx:id.dataset.index
                    });
                }
            }
        }
    }
});


//获取桌面图标
functionLibrary.ajax_get("config/icon.json",function(e){
    var cou=JSON.parse(e);
    for(i in cou){
        cou[i].ico = cou[i].ico.replace(/\<root\>/,'/app/'+cou[i].on);
    }
    desktop.icons=cou;
});

//注册全屏按钮
deskfun.fullscreen=false;
document.getElementsByClassName('footer-fullscreen')[0].onclick=function(e){
    if(deskfun.fullscreen){
        deskfun.fullscreen=false;
        if(document.exitFullscreen)document.exitFullscreen();  
        else if(document.mozCancelFullScreen)document.mozCancelFullScreen();
        else if(document.webkitCancelFullScreen)document.webkitCancelFullScreen();
        else if(document.msExitFullscreen)document.msExitFullscreen();
    }else{
        deskfun.fullscreen=true;
        var docElm = document.documentElement;
        if(docElm.requestFullscreen)docElm.requestFullscreen(); 
        else if (docElm.mozRequestFullScreen)docElm.mozRequestFullScreen(); 
        else if (docElm.webkitRequestFullScreen)docElm.webkitRequestFullScreen(); 
        else if (elem.msRequestFullscreen)elem.msRequestFullscreen();
    }
}

//注册时间更新
deskfun.time=new Date();
setInterval(function(){
    var t=new Date();
    if(t.getMinutes()!=deskfun.time.getMinutes()){
        document.getElementsByClassName('footer-time')[0].innerHTML=''+
        (t.getHours()<10?'0':'') + t.getHours() + ':' +
        (t.getMinutes()<10?'0':'') + t.getMinutes() + '<br>'+
        (t.getFullYear()-2000) + '/' + (t.getMonth()+1) + '/' + t.getDate();
        deskfun.time=t;
    }
},1000);