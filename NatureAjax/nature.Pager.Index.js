var mainEvent = {
    //标签
    tab: {
        "tabModuleID": {
            "preTab": 0,
            "nextTab": 0,
            "btnIDs": { "id": "状态"} //标签对应的divID的集合，用于切换标签的时候的显示和隐藏
        }
    },
     
    //标签里的div打开的窗口
    tabDiv: {
        "btnID": {
            "parentIdPath": [],  //父节点ID集合。第一级是tab里的div（模块id），后面的是打开的div（按钮ID）
            "sonId": []          //子节点ID集合，仅一级
        }
    },

    //列表页面里的事件
    divEvent: {
        "btnID": {
            "listLoadFirst": function () { alert("没实现listLoadFirst"); },
            "listLoadThis": function () { alert("没有实现listLoadThis"); },
            "listCloseSon": function () { alert("没有实现listCloseSon"); }
        }
    },
    
    //div里的iframe里面的window对象，便于子窗口访问父窗口里的dom
    divWindow: {
        "btnID": {
            "window":window
        }
    },
    
    //上传图片的对外事件
    uploadPicEvent: {
        "ColID": {
            upload: "",       //上传控件
            edit: "",       //上传控件对应的在线编辑器
            insertImg:function (img){}
        }  
    },
  
    //在线编辑器的对外事件
    editEvent: {
        "ColID": {edit: ""       //在线编辑器
        }
    },

    //数字标记的缓存
    cacheNumberSymbol: {"pvID":{}},

    //按钮元数据的缓存
    cacheMetaButton: {"pvID": {}},

    //列表元数据的缓存
    cacheMetaDataList: {"pvID": {}},

    //表单元数据的缓存
    cacheMetaDataForm: {"pvID": {}},

    //查询元数据的缓存
    cacheMetaDataFind: {"pvID": {}},

    //总记录数的缓存
    cacheDataCount: {"pvID": {}}
};

//记录打开的窗口的信息
var windowInfo = {

};


$(window).ready(setHeight);
$(window).resize(setHeight);

var frid = -2;
var debug = new Nature.Debug();

function setHeight() {
    var h = 22;
    var winHeight = $(window).height() - 27;
    $("#div_Show").height(winHeight + "px");
    $("#div_Tree,#div_Main").height(winHeight - h + "px");
    $("#divf0").height(winHeight - h - 30 + "px");
    //$("#div_Tree").height(winHeight - h + 40);

    var winWidth = $(window).width() - 30;
    $("#div_Main").width(winWidth - $("#div_Tree").width() + 23 + "px");

    var offsetDebug = { top: 500, left: 5 };
    offsetDebug.top = winHeight - $("#div_Debug").height() - $("#div_Copyright").height();
    $("#div_Debug").offset(offsetDebug);
    $("#div_Debug").width(winWidth - 100 + "px");
    $("#div_Debug").width(winWidth - 100 + "px");

    //调试信息的显示和隐藏
    $("#div_Debug span a").mousedown(function (e) {
        e.stopPropagation();
        //alert('sss');
        $("#div_Debug").hide();
    });
    //cache信息的显示和隐藏
    $("#div_Cache span a").mousedown(function (e) {
        e.stopPropagation();
        $("#div_Cache").hide();
    });
}

//显示当前登录人
function showme() {
    $.ajax({
        url: "/ssoapp/getUserName.ashx",
        dataType:"json",
        cache:true,
        success: function (info) {
            var userInfo = info.userInfo;
            var msg = "欢迎 " + userInfo.departmentName + " 的 " + userInfo.name + "（" + userInfo.id + "）";
            //alert(msg);
            $("#showMe").html(msg);
            
            if (typeof top.__cache == "undefined") {
                top.__cache = {};
            }

            top.__cache["userId"] = userInfo.id;
            top.__cache["userInfos"] = userInfo;

            
        }
    });
    
    //$.ajaxWhoAmI({
    //    title: "获取当前人是谁",
    //    success: function (data) {
    //        var info = data;
    //        var msg = "欢迎：" + info.UserName + "（" + info.UserJobNumber + "）";
    //        //alert(msg);
    //        $("#showMe").html(msg);
    //    }
    //});
     
}


function start(isWriteCookie) {
    //alert("登录完成");

    top.Pagers = {};
    
    $("#divLoginBg").hide();
    $("#divLogin").hide();

    
    spinStop();

    if ($("#div_Tree").children().length < 2) {
        
        if (typeof(isWriteCookie) == "undefined") {
            //登录页面
            //alert("登录页面");
            createTree();
        } else {
            //主页面
            //alert("主页面");
            var ck = $.cookie("userIDserviceByck");
            //alert(ck);

            if (typeof(ck) == "undefined") {
                sso.WriteServiceCK(Nature.AjaxConfig.Urlsso, function () {
                    createTree();
                });
            } else {
                createTree();

            }
        }
    }
}

function createTree() {
    Nature.Page.Tree.Create(showLoginDiv, dataBaseId, projectId, function () {
        /*看看是不是要自动打开节点*/
        var para = $.getUrlParameter(document);
        var modId = para.mid;
        if (typeof modId != "undefined")
            $("#divTree_" + modId)[0].click();
        
        /*如果节点数小于10，则全部打开*/
        var divTree = $("#div_Tree div[id^=divTree_Kuang_]");
        if (divTree.length < 3)
            divTree.show();

    });
    $("#div_Debug").drag({ titleBar: "span_debugTitle" });
    $("#div_Cache").drag({ titleBar: "span_cacheTitle" });
    showme();
}

function divLoginBghide() {
    //alert("登录完成");
    $("#divLoginBg").hide();
    $("#divLogin").hide();


}

//显示登录的表单，修改提交的url和webappID

function showLoginDiv() {
    setTimeout(showLoginDiv1, 100);
}

function showLoginDiv1(){

//alert("弹出登录页面");
    var maxIndex = $.getDivIndexHighest();
    var doc = $(document);
    var divBg = $("<div id=\"divLoginBg\">");     //设置一个透明背景层
    divBg.html("")  .css("position", "absolute").css("left", 0).css("top", 0).css("background", "#fff")
                    .css("opacity", ".50").css("filter", "alpha(opacity=50)/9")
                    .width(doc.width()).height(doc.height())
                    .css("z-index", maxIndex);

    //创建iframe，加载登录页面
    var div = $("<div id=\"divLogin\" class=\"layer_div_c\" >");
    div.css("position", "absolute").css("left", doc.width() / 2 - 200).css("top", doc.height() / 2 - 80).css("background", "#fff")
                    .width(400).height(230)
                    .css("z-index", maxIndex + 1);

    div.append("<span id=\"span_LoginTitle\" class=\"layer_title\" >登录<a href=\"javascript:void(0)\" id=\"Alo\">X</a></span>");

    var ifrm = $("<iframe id=\"ifrm_Mod\" width=\"100%\" height=\"196px\" src=\"\" frameborder=\"0\" scrolling=\"no\" ></iframe>");

    div.append(ifrm);
    //$(document.body).append(divBg);
    $(document.body).append(div);
    ifrm.attr("src", "/LeLianManage/logins/login.aspx");
    div.show();
    div.drag({ titleBar: "span_LoginTitle" });
    
    spinStop();

    div.find("a").mousedown(function(e) {
        //移除
        e.stopPropagation();
        $("#divLoginBg").remove();
        $("#divLogin").remove();

    });

}

function DebugSet(debugInfo) {

    debug.write("div_Debug", debugInfo);

}

//弹出层，在屏幕中间
function popup(popupName) {
    var _windowHeight = $(window).height();//获取当前窗口高度 
    var _windowWidth = $(window).width();//获取当前窗口宽度 
    var _popupHeight = popupName.height();//获取弹出层高度
    var _popupWeight = popupName.width();//获取弹出层宽度 
    var _posiTop = (_windowHeight - _popupHeight) / 2 + window.scrollY;
    var _posiLeft = (_windowWidth - _popupWeight) / 2;
    
    var indexMax = $.getDivIndexHighest(undefined, document);

    popupName.css({ "left": _posiLeft + "px", "top": _posiTop + "px", "display": "block", "z-index": indexMax + 1 });//设置position 
}

//显示调试信息
function DebugShow() {
    if ($("#div_Debug")[0].style.display == "none")
        popup($("#div_Debug").show());
    else
        $("#div_Debug").hide();

}

//显示缓存信息
function DebugCache() {
    if ($("#div_Cache")[0].style.display == "none")
        popup($("#div_Cache").show());
    else
        $("#div_Cache").hide();

}
 
//关闭打开的窗口
function formClose(id) {
    //alert(id);
    $("#div_Mod_" + id).remove();
}

function IndexOpenWeb(info, dataID, frid, frids, ids, other) {
    if (typeof other == "undefined")
        other = "1=1";
    
    var tmp = $("#div_Mod_" + info.ButtonID);
    var divForm;
    var openUrl;
    
    if (tmp.length == 0) {
        divForm = $("#div_Mod").clone();
        divForm.attr("id", "div_Mod_" + info.ButtonID);
        divForm.find("iframe").attr("id", "ifrm_Mod_" + info.ButtonID).show();
        var title = divForm.find("span:eq(0)").attr("id", "span_title_" + info.ButtonID);       //.html(info.BtnTitle);
        title.html(info.BtnTitle.split('_')[0]);

        var titleA = $("<a href=\"javascript:void(0)\" id=\"A3\">X</a>");
        titleA.mousedown(function (e) {
            divForm.remove();
            e.stopPropagation();
        });
        title.append(titleA);
        
        $("#div_Mod").after(divForm);

        divForm.drag({ titleBar: "span_title_" + info.ButtonID });

        //alert(dataID);
        //divOpen(url, mdId, gpvId, fpvId, btnId, w, h);
        var width = info.WebWidth;
        var height = info.WebHeight;

        var winHeight = $(window).height();
        var winWidth = $(window).width();

        if (info.WebHeight > winHeight - 60) height = winHeight - 62;
        if (info.WebWidth > winWidth - 40) width = winWidth - 42;

        var off = { top: 0, left: 0 };
        off.top = (winHeight - height + 2) / 2.0;
        off.left = (winWidth - width + 2) / 2.0;

        divForm.offset(off).width(width + "px").height(height + "px");

        //替换URL，访问ajax后台页面
        openUrl = info.URL = info.URL.replace("CommonPage/", "CommonPageJs/");

        var spUrl = openUrl.split("?");
        openUrl = spUrl[0];
        
        var tmpUrl = openUrl + Nature.jsVer + "&mdid=" + info.OpenModuleID + "&ppvid=" + info.parentPVid + "&mpvid=" + info.OpenPageViewID + "&fpvid=" + info.FindPageViewID + "&bid=" + info.ButtonID + "&id=" + dataID + "&frid=\"" + frid + "\"&frids=\"" + frids + "\"&ids=" + ids + "&" + other;
        //url = url + "?mdid=" + mid + "&pid=" + pvID + "&bid=" + btnID + "&id=" + dataID;

        if (spUrl.length > 1)
            tmpUrl += "&" + spUrl[1];
        
        $("#ifrm_Mod_" + info.ButtonID)
                    .width(width - 18 + "px").height((height - 60) + "px")
                    .attr("src", tmpUrl);

    } else {
        // 已经创建了
        divForm = tmp;
        openUrl = info.URL = info.URL.replace("CommonPage/", "CommonPageJs/");
        var spUrl2 = openUrl.split("?");
        openUrl = spUrl2[0];

        openUrl = info.URL + Nature.jsVer + "&mdid=" + info.OpenModuleID + "&ppvid=" + info.parentPVid + "&mpvid=" + info.OpenPageViewID + "&fpvid=" + info.FindPageViewID + "&bid=" + info.ButtonID + "&id=" + dataID + "&frid=\"" + frid + "\"&frids=\"" + frids + "\"&ids=" + ids + "&" + other;
        //url = url + "?mdid=" + mid + "&pid=" + pvID + "&bid=" + btnID + "&id=" + dataID;

        if (spUrl2.length > 1)
            tmpUrl += "&" + spUrl2[1];

        divForm.find("iframe").attr("src", openUrl).show();

    }
    var indexHigh = $.getDivIndexHighest();
    divForm.css("z-index", indexHigh + 1).show();

}

//打开上传窗口
function openUpload(url, editId) {

    var info = {
        ButtonID: editId,
        BtnTitle: "上传图片",
        WebHeight: 800,
        WebWidth: 1100,
        url: url
    };
    
    var tmp = $("#div_Mod_" + info.ButtonID);
    var divForm;
    if (tmp.length == 0) {
        divForm = $("#div_Mod").clone();
        divForm.attr("id", "div_Mod_" + info.ButtonID);
        divForm.find("iframe").attr("id", "ifrm_Mod_" + info.ButtonID).show();
        var title = divForm.find("span").attr("id", "span_title_" + info.ButtonID);
        title.html(title.html().replace("{title}",info.BtnTitle));

        divForm.find("a").mousedown(function (e) {
            divForm.remove();
            e.stopPropagation();
        });
        
        $("#div_Mod").after(divForm);

        divForm.drag({ titleBar: "span_title_" + info.ButtonID });

        var width = info.WebWidth;
        var height = info.WebHeight;

        var winHeight = $(window).height();
        var winWidth = $(window).width();

        if (info.WebHeight > winHeight - 60) height = winHeight - 62;
        if (info.WebWidth > winWidth - 40) width = winWidth - 42;

        var off = { top: 0, left: 0 };
        off.top = (winHeight - height + 2) / 2.0;
        off.left = (winWidth - width + 2) / 2.0;

        divForm.offset(off).width(width + "px").height(height + "px");

        url += "&_=1";
        $("#ifrm_Mod_" + info.ButtonID).width(width - 8 + "px").height(height - 30 + "px").attr("src", url);

    } else {
        // 已经创建了
        divForm = tmp;
        url += "&_=" + Math.random();
        tmp.find("iframe").attr("src", url).show();

    }
    var indexHigh = $.getDivIndexHighest();
    divForm.css("z-index", indexHigh + 1).show();

}

//退出登录
function logout() {
    sso.logoutSSO(function () { window.location.reload(); });

}

function spinStart() {
    var target = document.getElementById('foo');
    target.style.display = "block";

}
function spinStop() {
    var target = document.getElementById('foo');
    target.style.display = "none";
}

function mySpin() {
    var opts = {
        lines: 8, // The number of lines to draw
        length: 0, // The length of each line
        width: 7, // The line thickness
        radius: 13, // The radius of the inner circle
        corners: 0.8, // Corner roundness (0..1)
        rotate: 28, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#FF6600', // #rgb or #rrggbb
        speed: 0.8, // Rounds per second
        trail: 79, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '300', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    var target = document.getElementById('foo');
    target.style.display = "block";
    var spinner = new Spinner(opts).spin(target);

}