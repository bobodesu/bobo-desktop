deskapi={};

//获取窗口焦点
deskapi.window_getfocus=function(idx){
    var win=desktop.windows;
    var idxz=parseInt(win[idx].zindex);
    for(i in win){
        if(idx==i){
            win[i].handle=true;
            win[i].zindex=10000+win.length-1;
        }else {
            win[i].handle=false;
            if(win[i].zindex>idxz)win[i].zindex=win[i].zindex-1;
        }
    }
}