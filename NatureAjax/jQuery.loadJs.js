/*
动态加载js文件

1、jsURL：js文件的调用网址，设置别名方便修改和调用

2、loadJs：加载js，加载完毕执行回调函数

eg:
$.loadJs("command2", "drag",……, function () {
     alert("js加载完毕，可以进行后续操作");
     $("#div1").drag();
 });

3、loadCss：加载css文件


*/

var Nature = {};

Nature.ssoUrl = "http://lcnatureservice.517.cn";
Nature.resourceUrl = "http://lcNatureResource.517.cn";
Nature.sendDateType = "jsonp";

if (typeof(natureResource) != "undefined")
    Nature.resourceUrl = natureResource;
    

var jsURL = {
    "my97":                 Nature.resourceUrl + "/Scripts/My97DatePicker/WdatePicker.js?v=1.0",
    "spin":                 Nature.resourceUrl + "/Scripts/spin.min.js?v=1.0",
    "command":              Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.command.js" + ver,
    "lockTable":            Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.lockTable.js" + ver,
    "drag":                 Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.drag.js" + ver,
    "dragClick":            Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.dragClick.js" + ver,
    "nAjax":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.ajax.js" + ver,
    "nKey":                 Nature.resourceUrl + "/Scripts/NatureAjax/Nature.ShortcutKey.js" + ver,
    "nHead":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.head.js" + ver,
    "nIndex":               Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.Index.js" + ver,
    "nDataList":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.DataList.js" + ver,
    "nDataForm":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.DataForm.js" + ver,
    "nButton":              Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Button.js" + ver,
    "nCtrl":                Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Base.js" + ver,
    "nCtrl1":               Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Base.List.js" + ver,
    "nCtrl2":               Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Base.Text.js" + ver,
    "nCtrl3":               Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Base.UnionList.js" + ver,
    "newButton":            Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.ButtonBar.js" + ver,
    "newFind":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Find.js" + ver,
    "newForm":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Form.js" + ver,
    "nFormPost":            Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Form.Post.js" + ver,

    "newGrid":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Grid.js" + ver,
    "newGridf":             Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Grid.Format.js" + ver,
    "nDataSource":          Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.DataSource.js" + ver,
    "nDel":                 Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.DeleteData.js" + ver,
    "nTab":                 Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Tab.js" + ver,
    "nTree":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Tree.js" + ver,
    "qPager":               Nature.resourceUrl + "/Scripts/NatureAjax/nature.QuickPager.js" + ver,
    "qnewPager":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.QuickPager2.0.js" + ver,
    "debug":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.Debug.js" + ver,
    "TableTR":              Nature.resourceUrl + "/Scripts/Nature/TableTR.js" + ver,
    "check":                Nature.resourceUrl + "/Scripts/Nature/check.js" + ver,
    "role1":                Nature.resourceUrl + "/Scripts/NatureRole/nature.CommonModule.ModuleForRole.js" + ver,
    "role2":                Nature.resourceUrl + "/Scripts/NatureRole/nature.CommonModule.ModuleForRoleColumns.js" + ver,
    "cookie":               Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.cookie.js" + ver,
                            
    "upload1":              Nature.resourceUrl + "/Scripts/upload/swfobject.js?v=1.0",
    "upload2":              Nature.resourceUrl + "/Scripts/upload/jquery.uploadify.v2.1.0.min.js?v=1.0",
                            
    "edit1":                Nature.resourceUrl + "/Scripts/kindeditor/kindeditor-min.js?v=1.0",
    "edit2":                Nature.resourceUrl + "/Scripts/kindeditor/lang/zh_CN.js?v=1.0",
    "ssoClient":            Nature.ssoUrl + "/SSOApp/mangoSSO.js"  + ver
                             
};                         

var cssURL = {
    "pager":            Nature.resourceUrl + "/Scripts/QuickPager/skin/default/pager.css" + ver,
    "css":              Nature.resourceUrl + "/Scripts/css/css.css" + ver,
    "cssIndex":         Nature.resourceUrl + "/Scripts/css/cssIndex.css" + ver,
    "cssForm":          Nature.resourceUrl + "/Scripts/css/cssForm.css" + ver,
    "cssList":          Nature.resourceUrl + "/Scripts/css/cssList.css" + ver,
    "upload1":          Nature.resourceUrl + "/Scripts/upload/css/default.css" + ver,
    "upload2":          Nature.resourceUrl + "/Scripts/upload/css/uploadify.css" + ver,
    "cssIndexList":     Nature.resourceUrl + "/Scripts/css/cssIndexList.css" + ver
};

jQuery.extend({
    getScriptCache: function (url, callback) {
        var tmpCache = true;
        if (url.indexOf("ver.js") > 1) tmpCache = false;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "script",
            cache: tmpCache,
            success: function () {
                callback();
            }
        });
    }
});

jQuery.extend({
    /*加载列表页面js文件*/
    loadListJs: function (callback) {
        $.loadJs("my97",
            "cookie",
            "nKey",
            "nHead",
            "drag",
            "lockTable",
            "TableTR",
            "command",
            "newButton",
            "newGrid","newGridf",
            "nDataSource",
            "nDel",
            "qnewPager",
            "newFind",
            "nCtrl", "nCtrl1", "nCtrl2", "nCtrl3",
             
            "nDataList",
            callback);
    },

    /*加载表单页面js文件*/
    loadFormJs: function (callback) {
        $.loadJs("my97",
            "edit1",
            "edit2",
            "cookie",
            "nHead",
            "spin",
            "drag",
            "command", "newGrid", "newGridf","nDataSource",
            "nCtrl", "nCtrl1", "nCtrl2", "nCtrl3", "newForm","nFormPost",
             
            "nDataForm",
            "check",
            callback);
    },
    /*加载界面页js文件*/
    loadIndexJs: function (callback) {
        $.loadJs(
            "spin",
            "cookie",
            "nHead",
            "command",
            "drag",
            "nTab",
            "nTree",
            "debug",
            "nIndex",
             
            callback);
    },
    /*加载登录页面js文件*/
    loadLoginJs: function (callback) {
        $.loadJs(
            "cookie",
            "nHead",
            "command",
            "debug",
            
            callback);
    },
    
    /*加载js文件*/
    loadJs: function () {

        /*加载第一个js*/
        load(0, arguments);

        /*递归加载js，最后调用回调函数*/
        function load(index, args) {
            var arg = args[index];
            if (typeof (arg) == "string") {
                /*字符串，加载js*/
                if (typeof (jsURL[arg]) == "undefined") {
                    alert("配置信息里没有" + arg);
                    /*加载下一个*/
                    if (index < args.length - 1) {
                        load(index + 1, args);
                    }
                } else {
                    $.getScriptCache(jsURL[arg], function () {
                        //alert(arg);
                        if (index < args.length - 1)
                            load(index + 1, args);
                    });
                }
            } else {
                /*回调函数*/
                arg();
            }
        }

    },

    /*加载第css文件*/
    loadCss: function () {
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (typeof (cssURL[arg]) == "undefined") {
                alert("配置信息里没有" + arg);
            } else {
                load(cssURL[arg]);
            }
        }

        function load(cssUrl) {
            var container = document.getElementsByTagName("head")[0];
            var addStyle = document.createElement("link");
            addStyle.rel = "stylesheet";
            addStyle.type = "text/css";
            addStyle.media = "screen";
            addStyle.href = cssUrl;
            container.appendChild(addStyle);
        }
    }
});