/**
 * Common function library
 * http://bobodesu.cn/publiccode/FunctionLibrary-js/
 * https://github.com/bobodesu/
 * 
 * @version 1.0
 * @author bobodesu
 * @date 2018-08-13
 * 
 * @description Implement some commonly used functions
 * 
 * Please keep the information here.
 * Thank for your reading.
 */

var functionLibrary=new Object();

//const

//function
functionLibrary.ajax_get=function(url,callback){
    var request = new XMLHttpRequest();
    request.open("GET",url);
    request.onreadystatechange = function(){
        if(request.readyState !==4) return;
        if(request.status === 200)
            callback(request.responseText);
    }
    request.send();
}
functionLibrary.ajax_post=function(url,postdata,callback){
    var request = new XMLHttpRequest();
    request.open("GET",url);
    request.onreadystatechange = function(){
        if(request.readyState !==4) return;
        if(request.status === 200)
            callback(request.responseText);
    }
    request.send(postdata);
}

//other