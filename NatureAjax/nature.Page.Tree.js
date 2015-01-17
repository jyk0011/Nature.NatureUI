/*
* 创建树状功能菜单
*  

*/

var oldNodeID = 0;

Nature.Page.Tree = {
    onTimeOut: function () { },
    showDivId: "a",     /*默认展开的节点*/

    Create: function (onTimeOut, dataBaseId, projectId, callback) {

        if (typeof (Nature.Page.Tree.onTimeOut) != "undefined")
            Nature.Page.Tree.onTimeOut = onTimeOut;

        //$.ajaxGetMeta({
        //    data: { action: "tree", mdid: 0, dbid: dataBaseId, ProjectID: projectId },
        //    title: "树",
        //    debug: DebugSet,
        //    success: function (msg) {
        //        create2(msg.data);
        //    }
        //});

        var load = new Nature.Data.Cache();

        load.ajaxGetMeta({
            urlPara: { action: "tree", mdid: 0, dbid: dataBaseId, ProjectID: projectId, cacheKey: 0 },
            title: "树",
            success: function (msg) {
                
                if (typeof top.__cache == "undefined")
                    top.__cache = {};/* 开辟缓存空间 */
                 
                top.__cache.treeMeta = msg.data;
                
                create2(msg.data);
            }
        });

        function create2(treeJson) {
            var tmpTree1 = "<div id='divTree_{id}' onclick=\"Nature.Page.Tree.tree1Click({id})\" class=\"tree{level}\">{name}</div>";
            var tmpTree2 = "<div id='divTree_{id}' onclick=\"Nature.Page.Tree.tree2Click({id},{mpvid},{fpvid},'{url}','{name}')\" class='tree{level}'>{name}</div>";
            var tmpKuang = "<div id='divTree_Kuang_{0}' style='display:none;'></div>";
            var tmp = "";
            var oldMouleId = 0;
            var fristKuang = "a";
            for (var i = 0; i < treeJson.length; i++) {
                if (treeJson[i].ModuleLevel == 1) {
                    //第一级
                    tmp = tmpTree1.replace(/\{id\}/g, treeJson[i].ModuleID);
                    tmp = tmp.replace(/\{level\}/g, treeJson[i].ModuleLevel);
                    tmp = tmp.replace(/\{name\}/g, treeJson[i].ModuleName);
                    $("#div_Tree").append(tmp);

                    //加框
                    tmp = tmpKuang.replace(/\{0\}/g, treeJson[i].ModuleID);
                    $("#div_Tree").append(tmp);
                    if (fristKuang == "a")
                        fristKuang = treeJson[i].ModuleID;

                    oldMouleId = treeJson[i].ModuleID;
                } else {
                    //第二级
                    tmp = tmpTree2.replace(/\{id\}/g, treeJson[i].ModuleID);
                    tmp = tmp.replace(/\{level\}/g, treeJson[i].ModuleLevel);
                    tmp = tmp.replace(/\{name\}/g, treeJson[i].ModuleName);
                    tmp = tmp.replace(/\{url\}/g, treeJson[i].URL.replace("/CommonPage/", ""));
                    tmp = tmp.replace(/\{mpvid\}/g, treeJson[i].GridPageViewID);
                    tmp = tmp.replace(/\{fpvid\}/g, treeJson[i].FindPageViewID);

                    //alert(oldMouleID);
                    $("#divTree_Kuang_" + oldMouleId).append(tmp);

                }
            }
            oldNodeID = treeJson[0].ModuleID;

            var showKuang = "#divTree_Kuang_";
            if (Nature.Page.Tree.showDivId == "a")
                showKuang += fristKuang;
            else {
                showKuang += Nature.Page.Tree.showDivId;
            }
            $(showKuang).slideDown("normal"); //+ oldNodeID

            if (typeof callback == "function")
                callback();
        }
    },

    tree1Click: function (moduleId) {
        //$("#divTree_Kuang_" + oldNodeID).slideUp("fast");
        $("#divTree_Kuang_" + oldNodeID).hide();

        if ($("#divTree_Kuang_" + moduleId)[0].style.display == "none")
            $("#divTree_Kuang_" + moduleId).slideDown("normal");
        else
            $("#divTree_Kuang_" + moduleId).slideUp("normal");

        oldNodeID = moduleId;
    },

    tree2Click: function (moduleId, mpvid, fpvid, url, title) {
        
        if (moduleId == "159") {
            //在新窗口里打开链接
            window.open(url);
            return;
        }
        
        //检查是否登录
        Nature.CommonFunction.isTimeOut(function (info) {
            if (info.id != "")
                Nature.Page.Tab.Create(moduleId, mpvid, fpvid, url, title);
            else
                Nature.Page.Tree.onTimeOut();

        });

    }
};