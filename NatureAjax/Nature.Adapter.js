/*
* 适配器，适应本页加载js和使用父页js的情况
* 如果可以访问top.js，那么就使用父页的js；
* 如果不能访问，则本页加载js。

* 但是要统一对外接口，这就是适配的作用


* 命名约定

* ButtonBar ：Nature.Controls.ButtonBar
* Nature.Controls.Find
* Nature.Controls.Grid 
* Nature.Controls.DataSource
* 
* 
* 
* 
* 



var btnBar; //按钮组
var find;   //查询控件
var grid;   //表格控件
var pager;  //分页控件
var dataSource; //加载分页数据

 btnBar = Nature.Controls.ButtonBar;
    find = Nature.Controls.Find;
    grid = Nature.Controls.Grid;
    pager = Nature.Controls.QuickPager;
    dataSource = Nature.Controls.DataSource;

 */

Nature.Adapter = function(win) {
    if (Nature.isSelfJs) {
        /*本页加载js文件*/

    } else {
        /*使用父页的js文件*/

        var selfNature = win.Nature; /*保留自己的Nature*/
        win.Nature = top.Nature; /*把父页的Nature弄过来*/
        var key;
        for (key in selfNature) { /*再把自己的nature的信息追加上*/
            Nature[key] = selfNature[key];
        }

        win._alert = win.alert;
        win.alert = top.window.alert;

        win.$ = win.jQuery = function (select, doc1) {
            var doc = document;
            if (typeof doc1 != "undefined") doc = doc1;
            return top.window.$(select, doc);
        };

        var tmp = top.window.$;
        if (typeof tmp != "undefined") {
            for (key in tmp) {
                $[key] = tmp[key];
            }
        }

        //date加了format 函数。
        win.Date = top.Date;

        //else {
        //    if (loadCount < 3) {
        //        loadCount++;
        //        window.setTimeout(loadjQueryExtend, 50);
        //    }
        //}

        //var loadCount = 0;
        //window.setTimeout(function loadjQueryExtend() {

        //}, 50);

    }
}