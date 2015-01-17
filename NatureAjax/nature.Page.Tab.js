/*
* 创建tab标签
* div + iframe  

*/

var arrModuleIDs = new Array();
var selectTag = "selectTag";
      
Nature.Page.Tab = {
    Create: function (moduleId, mpvid, fpvid, url, title) {
        if (arrModuleIDs.length == 0)
            arrModuleIDs.push("0");
        
        if ($("." + selectTag).length > 0) {
            var tabId = $("." + selectTag)[0].id.replace("tab", "");
            $("#divf" + tabId).hide();
            //标签里的其他div也隐藏
            Nature.Page.Tab.hideDiv(tabId);

        }

        //把以前选中的变成未选中 tagContent
        $("." + selectTag).removeClass(selectTag);

        //处理标签
        if ($("#tab" + moduleId).length != 0) {
            //有标签，设置为已选择
            //alert(moduleId);
            $("#tab" + moduleId).addClass(selectTag);
            //显示标签包含的div
            Nature.Page.Tab.showDiv(moduleId);

        } else {
            //没有标签，创建
            //alert("aa");
            //$("#ulTab").append("<li id=\"tab" + moduleId + "\" class=\""+selectTag+"\"><a onclick=\"Nature.Page.Tab.tabClick(" + moduleId + ")\" href=\"javascript:void(0)\">" + title + "&nbsp;<img border=\"0\" onclick=\"Nature.Page.Tab.closeTab(" + moduleId + ")\"   /></a></li>");
            $("#ulTab").append("<li id=\"tab" + moduleId + "\" class=\"" + selectTag + "\"><a onclick=\"Nature.Page.Tab.tabClick(" + moduleId + ")\" href=\"javascript:void(0)\">" + title + "&nbsp;<em class=\"arrup\" onclick=\"Nature.Page.Tab.closeTab(" + moduleId + ")\">x</em></a></li>");
            arrModuleIDs.push(moduleId);

            //注册标签
            //alert(mainEvent);
            mainEvent.tab["tab" + moduleId] = {
                "preTab": 0,
                "nextTab": 0,
                "btnIDs": {}    //直接打开的div的ID的集合
            };

        }


        //创建一个div + iframe
        var tmpUrl = "";
        if ($("#divf" + moduleId).length != 0) {
            //有iframe
            if (typeof top.mainEvent.divEvent["btn" + moduleId] != "undefined")
                if (typeof top.mainEvent.divEvent["btn" + moduleId].reload == "function")
                    top.mainEvent.divEvent["btn" + moduleId].reload(moduleId);
            
            $("#ifrm" + moduleId + ",#divf" + moduleId).show();
            //重新加载


        } else {
            //拆分url
            var tmpUrls = url.split('?');
            
            tmpUrl = tmpUrls[0] + Nature.jsVer + "&mdid=" + moduleId + "&mpvid=" + mpvid + "&fpvid=" + fpvid;
            if (tmpUrls.length == 2)
                tmpUrl += "&" + tmpUrls[1];
            
            //没有iframe，创建
            var divifrm = $("<div>");
            divifrm.attr("id", "divf" + moduleId).addClass("tagContent").addClass(selectTag);
            divifrm.append("<iframe id=\"ifrm" + moduleId + "\" src=\"" + tmpUrl + "\" frameborder=\"0\"  allowtransparency=\"true\"  scrolling=\"no\" >");
            $("#divIframe").append(divifrm);
            $("#ifrm" + moduleId).show();

            setIframe(moduleId);
        }

        function setIframe() {
            var winHeight = $(window).height();
            $("#ifrm" + moduleId).height(winHeight - 90 + "px").width("100%");
            $("#divf" + moduleId).height(winHeight - 88 + "px").width("100%");
        }
    },

    tabClick: function (moduleId) {

        if ($("#tab" + moduleId).length == 0)
            return;

        var tabId = $("." + selectTag)[0].id.replace("tab", "");
        $("#divf" + tabId).hide();
        //标签里的其他div也隐藏
        Nature.Page.Tab.hideDiv(tabId);

        $("." + selectTag).removeClass(selectTag);
        $("#tab" + moduleId).addClass(selectTag);

        $("#divf" + moduleId + ",#ifrm" + moduleId).show();

        //显示标签包含的div
        Nature.Page.Tab.showDiv(moduleId);

    },

    closeTab: function (moduleId) {
        //alert(moduleId);
        var tmpModuleId = 0;
        $.each(arrModuleIDs, function (num, item) {
            //alert(num); //数组下标
            //alert(item); //数组元素值
            if (item == moduleId) {
                if (num == 0) {
                    if (arrModuleIDs.length == 1)
                        tmpModuleId = arrModuleIDs[0];
                    else
                        tmpModuleId = arrModuleIDs[1];
                } else {
                    tmpModuleId = arrModuleIDs[num - 1];
                }

                arrModuleIDs.splice(num, 1);
                //return false;
            }
            //return true;
        });

        $("." + selectTag).removeClass(selectTag);
        $("#tab" + tmpModuleId).addClass(selectTag);
        $("#divf" + tmpModuleId + ",#ifrm" + tmpModuleId).show();

        $("#tab" + moduleId + ",#ifrm" + moduleId + ",#divf" + moduleId).remove();

        //去掉标签里打开的div
        Nature.Page.Tab.removeDiv(moduleId);
    },

    //显示指定的tab里的div
    showDiv: function (moduleId) {
        if (typeof (mainEvent.tab["tab" + moduleId]) != "undefined") {
            var tabSonDiv = mainEvent.tab["tab" + moduleId].btnIDs;
            for (var key in tabSonDiv) {
                if (tabSonDiv[key] == 1) {
                    $("#" + key).show();
                }
            }

        }
    },

    //隐藏指定的tab里的div
    hideDiv: function (moduleId) {
        if (typeof (mainEvent.tab["tab" + moduleId]) != "undefined") {
            var tabSonDiv = mainEvent.tab["tab" + moduleId].btnIDs;
            for (var key in tabSonDiv) {
                if (tabSonDiv[key] == 1) {
                    $("#" + key).hide();
                }
            }
        }
    },

    //删除指定的tab里的div
    removeDiv: function (moduleId) {
        if (typeof (mainEvent.tab["tab" + moduleId]) != "undefined") {
            var tabSonDiv = mainEvent.tab["tab" + moduleId].btnIDs;
            for (var key in tabSonDiv) {
                if (tabSonDiv[key] == 1) {
                    $("#" + key).remove();
                }
            }
        }
    }

};