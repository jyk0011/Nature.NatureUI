/*
* 获取url参数，返回json格式。
* 
* {key1:value,key:value}
* ?mdid=128&mpvid=12801&fpvid=12802&bid=12606&id=103&frid=103#123
* {mdid:128,mpvid:12801,fpvid:12802,bid:12606,id:103,frid:103,WellNo:123}
*/

        
jQuery.extend({
    getUrlParameter: function (doc) {
        
        var url = location.href;
        
        if (typeof doc != "undefined")
            url = doc.location.href;
        
        //判断有没有参数
        if (url.indexOf("?") == -1) {
            return {};
        }
        
        var paraString = url.substring(url.indexOf("?") + 1, url.length);
        var arrPara = paraString.split('#');
        paraString = arrPara[0];

        paraString = paraString.replace(/=/g, ":'");
        paraString = paraString.replace(/&/g, "',");

        paraString = paraString.replace(/%22/g, "\"");

        var param;
        
        try {
            param = eval("({" + paraString + "'})");
        } catch(e) {
            param = {};
        } 
        
        //合并外键
        if (arrPara.length == 2)
            param.Sharp = arrPara[1];

        return param;
    },
    
    //获取指定id对应的表的最大ID 
    getIdMax:function(ajaxData) {
        $.ajax({
            type: "GET",
            dataType: Nature.AjaxConfig.ajaxDataType,
            cache: false,
            xhrFields: {    //允许跨域访问是添加cookie
                withCredentials: true
            },
            url: Nature.AjaxConfig.UrlResource + ajaxData.url,
            data: ajaxData.data,
            //timeout: 2000,
            error: function() {
                alert("获取最大id的时候发生错误！");
                if (typeof top.spinStop != "undefined")
                    top.spinStop();
            },

            success: function(msg) {
                if (typeof (parent.DebugSet) != "undefined")
                    parent.DebugSet(msg.debug);
                ajaxData.success(msg);

            }
        });
    },
    
    /*获取div中最大的 z-index */
    getDivIndexHighest: function(ids, doc1) {
        var indexMax = 0;
        if (typeof(ids) == "undefined") {
            ids = "|,foo,";
        } else {
            ids = "|," + ids + ",";
        }

        var doc = doc1;
        if (typeof doc == 'undefined')
            doc = document;

        $("div", doc).each(function() {
            var tmpId = this.id;
            tmpId = "," + tmpId + ",";
            var tmpIndex;

            if (ids.indexOf(tmpId) <= 0) {
                tmpIndex = $(this).css("z-index");
                if (tmpIndex != "auto" && tmpIndex != 2e9)
                    if (indexMax < tmpIndex * 1)
                        indexMax = tmpIndex * 1;
            }
        });

        return indexMax;
    }    
});

//ajax的方式，获取记录集，不缓存数据
jQuery.extend({
    ajaxData: {
        data: {},
        urlPara:{},
        title: "",
        success: function () { } 
    },

    //获取当前用的信息
    ajaxWhoAmI: function (ajaxData) {
        $.ajax({
            type: "GET",
            dataType: Nature.AjaxConfig.ajaxDataType,
            cache: false,
            xhrFields: {    //允许跨域访问是添加cookie
                withCredentials: true
            },
            //url: Nature.AjaxConfig.Urlsso + "/SSOAuth/SSOAuth.ashx?action=WhoAmI",   改从app端获取
            url: "/SSOApp/getUserName.ashx?action=WhoAmI",
            //timeout: 2000,
            error: function () {
                alert("获取" + ajaxData.title + "的时候发生错误！");
                if (typeof top.spinStop != "undefined")
                    top.spinStop();
            },

            success: function(msg) {
                ajaxData.success(msg);
            }
        });
    },

    
    //ajaxGetData: function (ajaxData) {
    //    var url = Nature.AjaxConfig.UrlResource;
    //    if (typeof ajaxData.url == "undefined")
    //        url += "/Data/GetData.ashx";
    //    else
    //        url += ajaxData.url;
      
    //    if (typeof top.st != "undefined") {/*压力测试模式，记录发送次数*/
    //        top.st.sendCount++;
    //    }
      
    //    $.ajax({
    //        type: "GET",
    //        dataType: Nature.AjaxConfig.ajaxDataType,
    //        cache: false,
    //        xhrFields: {    //允许跨域访问是添加cookie
    //            withCredentials: true
    //        },
    //        url: url,               /*Nature.AjaxConfig.UrlResource + "/Data/GetData.ashx",*/
    //        data: ajaxData.data,
    //        //timeout: 2000,
    //        error: function () {
    //            if (typeof top.st != "undefined") {/*压力测试模式，记录失败次数*/
    //                top.st.errorCount++;
    //                ajaxData.success({});
    //            } else {
    //                alert("获取" + ajaxData.title + "的时候发生错误！");
    //                if (typeof top.spinStop != "undefined")
    //                    top.spinStop();
    //            }
              
    //        },

    //        success: function (msg) {

    //            if (typeof top.st != "undefined") {/*压力测试模式，记录成功次数*/
    //                top.st.successCount++;
    //                var ms = msg.debug.UseTime.replace("毫秒","") * 1;

    //                top.st.serverMS += ms;
                  
    //                if (ms < top.st.mini) {
    //                    top.st.mini = ms;
    //                }
    //                if (ms > top.st.max) {
    //                    top.st.max = ms;
    //                }

    //            }

    //            if (typeof (parent.DebugSet) != "undefined")
    //                parent.DebugSet(msg.debug);
              
    //            if (typeof(ajaxData.ctrlId) == "undefined"  )
    //                ajaxData.success(msg);
    //            else {
    //                ajaxData.success(ajaxData.ctrlId,msg);

    //            }

    //        }
    //    });
    //},

    //ajaxSaveData: function (ajaxData ) {
    //    $.ajax({
    //        type: "GET",
    //        dataType: Nature.AjaxConfig.ajaxDataType,
    //        cache: false,
    //        xhrFields: {    //允许跨域访问是添加cookie
    //            withCredentials: true
    //        },
    //        url: Nature.AjaxConfig.UrlResource + "/data/PostData.ashx?action=savedata&" + ajaxData.urlPara,
    //        data: ajaxData.data,
    //        //timeout: 2000,
    //        error: function () {
    //            alert("提交" + ajaxData.title + "的时候发生错误！");
    //            if (typeof top.spinStop != "undefined")
    //                top.spinStop();
    //        },

    //        success: function (msg) {
    //            if (typeof (parent.DebugSet) != "undefined")
    //                parent.DebugSet(msg.debug);
    //            ajaxData.success(msg);

    //        }
    //    });
    //},

    //ajaxDelete: {
    //    data: "",
    //    url: "",
    //    success: function () { } 
    //},
    //ajaxDeleteData: function (ajaxData) {
    //    $.ajax({
    //        type: "GET",
    //        dataType: Nature.AjaxConfig.ajaxDataType,
    //        cache: false,
    //        xhrFields: {    //允许跨域访问是添加cookie
    //            withCredentials: true
    //        },
    //        url: Nature.AjaxConfig.UrlResource + ajaxData.url,
    //        data: ajaxData.data,
    //        //timeout: 2000,
    //        error: function () {
    //            alert("删除记录的时候发生错误！");
    //            if (typeof top.spinStop != "undefined")
    //                top.spinStop();
    //        },

    //        success: function (msg) {
    //            if (typeof (parent.DebugSet) != "undefined")
    //                parent.DebugSet(msg.debug);
    //            ajaxData.success(msg);

    //        }
    //    });
    //},
    
    
    
});

//ajax的方式获取元数据，利用自带缓存
//jQuery.extend({
//     ajaxMeta : {
//        data:"",
//        title: "",
//        success: function () {} 
//    },
//    ajaxGetMeta: function (ajaxMeta) {
        
//        $.ajax({
//            type: "GET",
//            dataType: Nature.AjaxConfig.ajaxDataType,
//            cache: true,
//            xhrFields: {    //允许跨域访问是添加cookie
//                withCredentials: true
//            },
//            url: Nature.AjaxConfig.UrlResource + "/MetaData/GetMeta.ashx",
//            data: ajaxMeta.data,
//            //timeout: 2000,
//            error: function () {
//                alert("获取" + ajaxMeta.title + "的时候发生错误！");
//                if (typeof top.spinStop != "undefined")
//                    top.spinStop();
//            },

//            success: function (msg) {
//                //alert(msg);
//                if (typeof (parent.DebugSet) != "undefined")
//                    parent.DebugSet(msg.debug);
//                ajaxMeta.success(msg);
//            }
//        });
//    }
//});



//判断鼠标进入的方向，上下左右
function fangxiang() {
    $("#wrap").bind("mouseenter mouseleave", function(e) {
        var w = $(this).width();
        var h = $(this).height();
        var x = (e.pageX - this.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
        var y = (e.pageY - this.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
        var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4; //direction的值为“0,1,2,3”分别对应着“上，右，下，左”
        var eventType = e.type;
        var dirName = new Array('上方', '右侧', '下方', '左侧');
        if (e.type == 'mouseenter') {
            $("#result").html(dirName[direction] + '进入');
        } else {
            $('#result').html(dirName[direction] + '离开');
        }
    });
}

//公共信息的处理
Nature.CommandInfo = function(win) {
    var self = this;

    var info = {
        win: win,
        doc: win.document
    };

    //获取URL里面的参数
    this.getUrlPara = function(doc) {
        var re = {};

        var para = $.getUrlParameter(doc);

        if (typeof para.mdid != "undefined") re.moduleID = para.mdid; //对应的模块ID
        if (typeof para.mpvid != "undefined") re.masterPageViewID = para.mpvid; //主页面视图ID
        if (typeof para.fpvid != "undefined") re.findPageViewID = para.fpvid; //查询视图ID
        if (typeof para.bid != "undefined") re.buttonId = para.bid; //对应的按钮ID
        if (typeof para.query != "undefined") re.query = para.query; //url里的查询条件

        if (typeof para.ppvid != "undefined") re.ppvid = para.ppvid; //上一个页面的pvid

        if (typeof para.id != "undefined") {
            re.dataID = para.id; //记录ID
            if (re.dataID != re.dataID * 1) re.dataID = re.dataID.replace(/"/g, "");
        }

        if (typeof para.frid != "undefined") {
            re.foreignID = para.frid; //外键ID
            if (re.foreignID != re.foreignID * 1) re.foreignID = re.foreignID.replace(/"/g, "");
        }

        if (typeof para.frids != "undefined") {
            re.foreignIDs = para.frids; //外键IDs
            re.foreignIDs = re.foreignIDs.replace(/"/g, "");
        }

        if (typeof para.fmid != "undefined") {
            re.gridFormViewID = para.fmid; //批量修改的formID
            if (re.gridFormViewID != re.gridFormViewID * 1) re.gridFormViewID = re.gridFormViewID.replace(/"/g, "");
        }


        return re;
    };

    info.urlPara = this.getUrlPara(info.doc);

    return info;


};

//子页面注册自己和其事件
Nature.RegPager = function (sonPager) {
    var urlPara = sonPager.cmdInfo.urlPara;
    
    var key = urlPara.moduleID + "_";

    regEvent(); //注册页面和事件
    regSon();   //向父页面注册自己
    
    //注册页面和事件
    function regEvent() {
        if (typeof(urlPara.buttonId) == "undefined") {
            //tab自带的列表，用模块ID作为标识
            top.Pagers[key] = {
                doc: sonPager.cmdInfo.win.document,
                kind: "tab",    //在标签里
                parentId: "0",
                sonIds: []
            };
        } else {
            //列表页打开的列表，用按钮ID作为标识
            key += urlPara.buttonId;
            top.Pagers[key] = {
                doc: sonPager.cmdInfo.win.document,
                kind: "div",    //在打开的div（窗口里）
                sonIds: []
            };
        }

        //注册事件，便于其他窗口的访问
        top.Pagers[key].events = {
            LoadFirst: sonPager.listLoadFirst,  //重新加载第一页
            LoadThis: sonPager.listLoadThis,    //重新加载当前页
            CloseSon: sonPager.listCloseSon,    //关闭子页
            reload: sonPager.reload                 //菜单栏单击事件，页面重置
        };
    }

    //如果是子窗口，要向父窗口注册自己
    function regSon() {
        if (typeof (urlPara.buttonId) != "undefined") {
            //列表页打开的列表，用按钮ID作为标识，需要向父页面注册自己
            //找到父页面的sonIds，把自己加进去
            
        }
    }

};
