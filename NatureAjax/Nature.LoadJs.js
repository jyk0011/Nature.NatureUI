/*
动态加载js文件

2、Nature.loadScript：加载js，加载完毕执行回调函数

eg:
Nature.loadScript.js("js的Url地址",function () {
     alert("js加载完毕，可以进行后续操作");
     $("#div1").drag();
 });

 Nature.load.loadJs("command2", "drag",……, function () {
     alert("js加载完毕，可以进行后续操作");
     $("#div1").drag();
 });

3、loadCss：加载css文件


*/
 
var urlJs = top.Nature.AjaxConfig.Urljs;
var ver = Nature.jsVer;
var jsURL = {
    "jQuery":       urlJs + '/Scripts/jquery-1.8.2.min.js',
    "my97":         urlJs + "/Scripts/My97DatePicker/WdatePicker.js?v=1.1",
    "spin":         urlJs + "/Scripts/spin.min.js?v=1.0",
    "cookie":       urlJs + "/Scripts/jQuery.cookie.js" + ver,
    "command":      urlJs + "/Scripts/NatureAjax/jQuery.command.js" + ver,
    "lockTable":    urlJs + "/Scripts/NatureAjax/jQuery.lockTable.js" + ver,
    "drag":         urlJs + "/Scripts/NatureAjax/jQuery.drag.js" + ver,
    "dragClick":    urlJs + "/Scripts/NatureAjax/jQuery.dragClick.js" + ver,
    "nAjax":        urlJs + "/Scripts/NatureAjax/nature.ajax.js" + ver,
    "nKey":         urlJs + "/Scripts/NatureAjax/Nature.ShortcutKey.js" + ver,
    "nHead":        urlJs + "/Scripts/NatureAjax/nature.head.js" + ver,
    "nIndex":       urlJs + "/Scripts/NatureAjax/nature.Pager.Index.js" + ver,
    "nDataIframe":  urlJs + "/Scripts/NatureAjax/nature.Pager.DataIframe.js" + ver,
    "nDataList":    urlJs + "/Scripts/NatureAjax/nature.Pager.DataList.js" + ver,
    "nDataForm":    urlJs + "/Scripts/NatureAjax/nature.Pager.DataForm.js" + ver,
    "nButton":      urlJs + "/Scripts/NatureAjax/Nature.Control.ButtonBar.js" + ver,
    "nCtrl":        urlJs + "/Scripts/NatureAjax/Nature.Control.Base.js" + ver,
    "nCtrl1":       urlJs + "/Scripts/NatureAjax/Nature.Control.Base.List.js" + ver,
    "nCtrl2":       urlJs + "/Scripts/NatureAjax/Nature.Control.Base.Text.js" + ver,
    "nCtrl3":       urlJs + "/Scripts/NatureAjax/Nature.Control.Base.UnionList.js" + ver,
    "nFind":        urlJs + "/Scripts/NatureAjax/Nature.Control.Find.js" + ver,
    "nForm":        urlJs + "/Scripts/NatureAjax/Nature.Control.Form.js" + ver,
    "nExcel":       urlJs + "/Scripts/NatureAjax/Nature.Control.OutputExcel.js" + ver,
    "nFormCheck":   urlJs + "/Scripts/NatureAjax/Nature.Control.Form.check.js" + ver,
    "nFormPost":    urlJs + "/Scripts/NatureAjax/Nature.Control.Form.Post.js" + ver,
    "nGridForm":    urlJs + "/Scripts/NatureAjax/Nature.Control.GridForm.js" + ver,
    "nGrid":        urlJs + "/Scripts/NatureAjax/Nature.Control.Grid.js" + ver,
    "nGridf":       urlJs + "/Scripts/NatureAjax/Nature.Control.Grid.Format.js" + ver,
    "TableTR":      urlJs + "/Scripts/NatureAjax/Nature.Control.Grid.Event.js" + ver,
    "nDataSource":  urlJs + "/Scripts/NatureAjax/Nature.Control.DataSource.js" + ver,
    "nCache":       urlJs + "/Scripts/NatureAjax/Nature.Data.Cache.js" + ver,
    "nLoadData":    urlJs + "/Scripts/NatureAjax/Nature.Data.Manager.js" + ver,
    //"nLoadData2":   urlJs + "/Scripts/NatureAjax/Nature.Data.MetaData.js" + ver,
    //"nLoadData3":   urlJs + "/Scripts/NatureAjax/Nature.Data.CusData.js" + ver,
    "Adapter":      urlJs + "/Scripts/NatureAjax/Nature.Adapter.js" + ver,

    "nDel":         urlJs + "/Scripts/NatureAjax/nature.Page.DeleteData.js" + ver,
    "nTab":         urlJs + "/Scripts/NatureAjax/nature.Page.Tab.js" + ver,
    "nTree":        urlJs + "/Scripts/NatureAjax/nature.Page.Tree.js" + ver,
    "qPager":       urlJs + "/Scripts/NatureAjax/nature.QuickPager2.0.js" + ver,
    "debug":        urlJs + "/Scripts/NatureAjax/nature.Debug.js" + ver,
    "role1":        urlJs + "/Scripts/NatureRole/nature.CommonModule.ModuleForRole.js" + ver,
    "role2":        urlJs + "/Scripts/NatureRole/nature.CommonModule.ModuleForRoleColumns.js" + ver,

    "upload1":      urlJs + "/Scripts/upload/swfobject.js?v=1.0",
    "upload2":      urlJs + "/Scripts/upload/jquery.uploadify.v2.1.0.min.js?v=1.0",

    "edit1":        urlJs + "/Scripts/kindeditor/kindeditor-min.js?v=1.0",
    "edit2":        urlJs + "/Scripts/kindeditor/lang/zh_CN.js?v=1.0",
    "ssoClient":    urlJs + "/SSOApp/mangoSSO.js" + ver,
    "ssoClient2":   urlJs + "/SSOApp/mangoSSO.ajax.js" + ver

};

var cssURL = {
    //"mangoGlobal": top.Nature.AjaxConfig.Urlcss + "/websiteStyle/mangoGlobal.css" + cssver,
    //"mis-style-p": Nature.cssUrl + "/misStyle/misUICss/misStyle/mis-style-p.css" + cssver,
    //"MisStyle_v2": Nature.cssUrl + "/misStyle/misUICss/misStyle/MisStyle_v2.css" + cssver, //MisStyle_v2.css"

    //"MisStyle_v2": urlJs + "/Scripts/css/MisStyle_v2.css" + cssver, //MisStyle_v2.css"
    //"mis-style-p": urlJs + "/Scripts/css/mis-style-p.css" + cssver,

    "debugCss": top.Nature.AjaxConfig.Urlcss + "/misStyle/debugCss/css.css" + Nature.cssVer,
    "css": urlJs + "/Scripts/css/css2.css" + Nature.cssVer,
    "upload1": urlJs + "/Scripts/upload/css/default.css" + Nature.cssVer,
    "upload2": urlJs + "/Scripts/upload/css/uploadify.css" + Nature.cssVer
};

//加载js用的函数
Nature.LoadScript = function(doc) {
    if (typeof doc == "undefined")
        doc = document;
    //通过script加载js文件
    this.js = function (url, callback) {
        var s = doc.createElement('script');
        s.type = "text/javascript";
        s.src = url;
        s.expires = 1;
        load(s, callback);
    };
    //通过link加载css文件
    this.css = function (url, callback) {
        var l = doc.createElement('link');
        l.type = "text/css";
        l.rel = "stylesheet";
        l.media = "screen";
        l.href = url;
        //doc.getElementsByTagName('head')[0].appendChild(l);
        load(l, callback);
    };
    //加载后的回调
    function load(s, callback) {
        switch (doc.documentMode) {
            case 9:case 10:case 11:
                s.onerror = s.onload = loaded;
                break;
            default:
                s.onreadystatechange = ready;
                s.onerror = s.onload = loaded;
                break;
        }
        doc.getElementsByTagName('head')[0].appendChild(s);

        function ready() { /*IE7.0/IE10.0*/
            if (s.readyState == 'loaded' || s.readyState == 'complete') {
                if (typeof callback == "function") callback();
            }
        }

        function loaded() { /*chrome/IE10.0*/
            if (typeof callback == "function") callback();
        }
    }
    
};

//依次加载js
Nature.loadFile = function (doc) {
    var self = this;
    var loadJsByUrl = new Nature.LoadScript(doc);
    
    //加载login需要的js
    //加载可以直接复用的js
    //加载不可以直接复用的js
    
    //加载login需要的js
    this.loadJsForLogin = function() {
        self.loadJs("jQuery", "spin", "cookie", "nHead", "command", "debug",
          "drag", "nIndex",    "nCache",
          callback);
    };
    
    //加载可以直接复用的js
    this.loadJsForLoginGoOn = function () {
        self.loadJs("my97","nTab", "nTree",  "nKey","nLoadData",
          "nButton", "nGrid", "nGridf", "TableTR", "lockTable", "nDataSource", "nDel",
          "qPager", "nFind", "nCtrl", "nCtrl1", "nCtrl2", "nCtrl3", "nDataList",
          "nForm", "nFormPost", "nFormCheck", "nDataForm", "nGridForm", "nExcel",
          callback);
        
    };
    

    //开始加载其他js
    this.startLoadJs = function(kind, callback) {
        /*判断top页面是否已经加载js，如果已经加载就不用再次加载了。*/
        var isJsLoad = false;
        if (typeof top != "undefined") {
            if (typeof top.Nature != "undefined") {
                if (typeof top.Nature.jsState != "undefined") {
                    //已经加载了，加载适配
                    isJsLoad = true;
                    Nature.isSelfJs = false;
                }
            }
        }

        if (isJsLoad) {
            /*父页已经加载js，加载适配*/
            switch (kind) {
            case "iframe":
                self.loadJs( "nDataIframe", callback);
                break;
            case "index":
                self.loadJs("Adapter", "nIndex", callback);
                break;
            case "list":
                self.loadJs("Adapter", callback);
                break;
            case "form":
                self.loadJs("Adapter", "edit1", "edit2", callback);
                break;
            case "login":
                //"jQuery", "cookie", "nHead", "command",  
                self.loadJs("Adapter", callback);
                break;
            case "loginGoGo":
                //"jQuery", "cookie", "nHead", "command",  
                self.loadJs("Adapter", callback);
                break;
            }

        } else {
            switch (kind) {
                case "loginGoGo":
                    /*gogo登录页，没加载js，自己加载js文件*/
                    self.loadJs("jQuery", "cookie", "nHead", "command", callback);
                    break;
                case "wap":
                    /*网页登录后台的处理*/
                    self.loadJs("jQuery", "spin", "cookie",   "nHead", "command", "debug",
                           "nAjax", "nIndex",
                           "nLoadData", "nCache",
                            "nDataSource",  
                           callback);
                    break;
                default:
                    /*没加载js，自己加载js文件*/
                    self.allJs(callback);
                    break;
            }
        }
    };

    /*加载全部js文件*/
    this.allJs = function(callback) {
        self.loadJs("jQuery", "spin", "cookie", "my97", "nHead", "command", "debug",
            "drag", "nAjax", "nTab", "nTree", "nIndex",    "nKey",
            "nLoadData", "nCache",
            "nButton", "nGrid", "nGridf", "TableTR", "lockTable", "nDataSource", "nDel",  
            "qPager", "nFind", "nCtrl", "nCtrl1", "nCtrl2", "nCtrl3", "nDataList",
            "nForm", "nFormPost", "nFormCheck", "nDataForm", "nGridForm", "nExcel", "upload1", "upload2",
            callback);
    };

    /*根据标识加载js文件*/
    this.loadJs = function () {
        
        /*加载第一个js*/
        load(0, arguments);

        /*递归加载js，最后调用回调函数*/

        function load(index, args) {
            var arg = args[index];
            if (typeof(arg) == "string") {
                /*参数是字符串，视为标识。根据该标识加载js*/
                if (typeof(jsURL[arg]) == "undefined") {
                    alert("配置信息里没有" + arg);
                    if (index < args.length - 1) /*继续加载下一个*/
                        load(index + 1, args);

                } else {
                    loadJsByUrl.js(jsURL[arg], function () {
                        //alert(arg);
                        if (index < args.length - 1)/*继续加载下一个*/
                            load(index + 1, args);
                    });
                }
            } else {
                /*开启jQuery的cors跨域模式*/
                if (typeof jQuery != "undefined") $.support.cors = true;
                /*最后一个参数，必须是回调函数*/
                if (typeof arg == "function")
                    arg();
            }
        }

    };
};

/*加载css文件*/
Nature.loadFile.loadCss = function () {
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof(cssURL[arg]) == "undefined") {
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
};
  

if (top != window) {
    window.setTimeout(function() {
        if (typeof isRepost == "undefined") {
            //加载css文件
            Nature.loadFile.loadCss("mangoGlobal", "mis-style-p", "MisStyle_v2", "debugCss", "css"); //, "upload1", "upload2"
        }
    },2);
}

//判断父页是否已经加载js文件

