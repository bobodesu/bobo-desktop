# app -> main.json 规范
```js
{
    "name":"百度", //APP名称
    "ico":"<root>/baidu.svg", //图标地址
    "pos":[50,50,800,600], //出生位置
    "min":[300,600], //最小窗口尺寸
    "max":[1200,1200], //最大窗口尺寸
    "style":0,
    /*
        style可以为下列值：
        0：为默认窗口样式，不支持自定义，不允许系统交互
        1：为默认窗口样式，允许在基础的环境下改造，允许系统交互
    */
    "resize":true, //是否可改变窗口尺寸
    "val":"https://www.baidu.com" // 初始网页地址,
    /*
        代码需遵守app -> val规范
        * 若此类style属性为0，则默认加载当中的iframe页面
        * 若此类style属性为1，则将该网页源代码嵌入到内容中

    */
    "onload":"<root>/index.js" //应用加载完成执行的JS脚本
    /*
        代码需遵守app -> js规范
        * 若此类style属性为0，此属性无效
        * 若此类style属性为1，则在程序加载完成后执行此脚本
    */
}
```
> 提示：  
> 1. ico、val、onload属性值可以添加相关标识符来简化文本：  
>    * \<root\> : 应用程序的根目录 (/app/xxx)

# app -> val 规范

# app -> js 规范

# config -> icon.json 规范
```js
[
    {
        "name": "百度", //app名称
        "ico": "<root>/baidu.svg", //LOGO地址, 尽量用相对路径
        /*
            字符串里可以添加相关标识符来简化文本
            <root> : 应用程序的根目录 (/app/xxx)
        */
        "on": "baidu.search" // 应用启动地址
    }
]
```