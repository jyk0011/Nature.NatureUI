/*
* 加载分页数据，和分页控件配合使用
* 自动缓存上次的查询条件
* 2013-5-8 jyk
*/


Nature.Controls.DataSource = function(dInfo) {

    //数据信息
    var dataInfo = dInfo;
    //{
    dataInfo.action = "list";
    //    moduleID: "",            //对应的模块ID
    //    masterPageViewID: "",    //列表页面视图ID
    //    findPageViewID: "",      //查询页面视图ID
    //    foreignID: "",           //外键id
    //    foreignIDs: "",           //外键id集合
    dataInfo.thisPageIndex = 1; //页号，从 1 开始

    dataInfo.query = undefined; //上次的查询条件
     //    }
    //};
    
    var ajax = new Nature.Data.Manager();
    var urlPara = dInfo.urlPara;

    //加载数据
    this.LoadData = function(pageIndex, query, callback) {

        var rdKey = "RecordCount_" + urlPara.moduleID + '_' + urlPara.masterPageViewID + '_' + urlPara.findPageViewID;

        //第一页，强制更新缓存
        if (pageIndex == 1) top.__cache[rdKey] = "0";

        var hasKey = 0;
        if (typeof(query) == "undefined") {
            //没有传递查询条件，看看有没有缓存查询条件
            if (typeof(dataInfo.query) != "undefined") {
                //有缓存查询条件
                query = dataInfo.query;
                hasKey = 1;
            }
        } else {
            //有查询条件，更新缓存
            dataInfo.query = query;
            hasKey = 1;
            top.__cache[rdKey] = "0";
        }

        var lcRecordCount = top.__cache[rdKey];
        if (typeof lcRecordCount == "undefined") lcRecordCount = "0";

        //if (typeof (Nature.Page.QuickPager.alwaysQuery) != "") {
        //    //加固定查询条件
        //    if (typeof (Nature.Page.QuickPager.postQuery) == "undefined") {
        //        Nature.Page.QuickPager.postQuery = {};
        //        Nature.Page.QuickPager.postQuery.formValue = Nature.Page.QuickPager.alwaysQuery;
        //    } else {
        //        if (typeof (Nature.Page.QuickPager.postQuery.formValue) == "undefined")
        //            Nature.Page.QuickPager.postQuery.formValue = {};

        //        var aQuery = Nature.Page.QuickPager.alwaysQuery;
        //        for (var key in aQuery) {
        //            Nature.Page.QuickPager.postQuery.formValue[key] = aQuery[key];
        //        }
        //    }
        //}

        dataInfo.thisPageIndex = 1;
        //判断页号是否是数字
        if ($.isNumeric(pageIndex)) dataInfo.thisPageIndex = parseInt(pageIndex);

        //提交的数据
        var myData;
        if (typeof(query) == "undefined") myData = {}; else myData = query.formValue;

        myData["action"] = "list";
        myData["mdid"] = urlPara.moduleID;
        myData["mpvid"] = urlPara.masterPageViewID;
        myData["fpvid"] = urlPara.findPageViewID;
        myData["frid"] = urlPara.foreignID || "-2";
        myData["frids"] = urlPara.foreignIDs || "-2";
        myData["pageno"] = dataInfo.thisPageIndex;
        myData["pagerc"] = lcRecordCount;
        myData["hasKey"] = hasKey;
        myData["dbid"] = dataInfo.dataBaseId;

        ajax.ajaxGetData({
            title: "数据源",
            urlPara: myData,
            //timeout: 2000,
            success: function(msg) {
                //收到反馈信息，判断是否发生异常
                if (msg.err != undefined)
                    alert(msg.err);
                else {
                    //保存总记录数
                    // var rdKey = urlPara.moduleID + '_' + urlPara.masterPageViewID + '_' + urlPara.findPageViewID;

                    top.__cache[rdKey] = msg.pageTurn.recordCount;

                    if (typeof(callback) != "undefined")
                        callback(msg);
                }
            }
        });
    };
    
};
 
     
 