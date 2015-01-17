/*
*
* grid控件用的格式化js脚本
*
* 根据配置信息，对td里的内容进行各种格式化
*
* 1、把标识替换成文字(固定)
* 2、把标识替换成文字(数据库)
* 3、把标识替换成文字(json)
* 4、把半角空格替换成全角空格
* 5、显示图片
* 6、超链接
* 7、限制宽高
*
*/

//给表格进行格式化

Nature.Controls.Grid.prototype.formatGrid = function (format, tdText, jsonNumCol, dataRow, colIndex) {

    var imgUrl = "";

    var formatFunc = {};
    formatFunc.toTxtByCus = function () {
        //把数字标记变成文字，根据format里的设置
        for (var keys in fm.item) {
            if (tdText == keys) tdText = fm.item[keys];
        }

    };
    
    formatFunc.toTxtByData = function () {
        //把数字标记变成文字，根据服务
        if (typeof (fm.mpvid) != "undefined") {
            //主字段
            if (typeof (jsonNumCol["j" + fm.columnKey]) == "undefined") {
                jsonNumCol["j" + fm.columnKey] = {
                    para: fm,
                    colIndex: colIndex,
                    colOther: {},   /*关联其他的字段*/
                    key: tdText
                };
            } else {
                jsonNumCol["j" + fm.columnKey].key += "," + tdText;
            }
        } else {
            //扩展字段，把自己的位置告诉主字段。
            if (typeof (jsonNumCol["j" + fm.columnKey]) == "undefined") {
                //还没有运行主字段。
            } else {
                jsonNumCol["j" + fm.columnKey].colOther[colIndex] = fm.colID;
            }
        }
    };
    
    formatFunc.toTxtByMeta = function () {
        //模块ID、视图ID、表ID的替换，替换为文字
        if (typeof (fm.metaKind) != "undefined") {
            //主字段
            if (typeof (jsonNumCol["j" + fm.columnKey]) == "undefined") {
                jsonNumCol["j" + fm.columnKey] = {
                    para: fm,
                    colIndex: colIndex,
                    colOther: {},   /*关联其他的字段*/
                    key: tdText
                };
            } else {
                jsonNumCol["j" + fm.columnKey].key += "," + tdText;
            }
        } else {
            //扩展字段，把自己的位置告诉主字段。
            if (typeof (jsonNumCol["j" + fm.columnKey]) == "undefined") {
                //还没有运行主字段。
            } else {
                jsonNumCol["j" + fm.columnKey].colOther[colIndex] = fm.colID;
            }
        }
    };

    formatFunc.toSpace = function () {
        //把半角空格变成全角空格
        var regSpace = new RegExp(" ", "g");
        tdText = tdText.replace(regSpace, "　");
    };

    formatFunc.imgName = function () {
        //图片，字段里存放的是图片名称(可以有路径)
        tdText = "<a href=\"" + fm.url + tdText + "\" target=\"_blank\"><img broder=0 style=\"height:" + fm.height + "\" src=\"" + fm.url + tdText + "\"></a>";

    };

    formatFunc.imgCode = function () {
        //图片，存放的是图片ID

        var tmpIds = tdText.split(",");
        var tmpId = "0";
        if (tmpIds.length >= 2) tmpId = tmpIds[1];
        imgUrl = fm.url.replace(/{id}/g, tmpId);
        tdText = "<a href=\"" + imgUrl + "\" target=\"_blank\"><img broder=0 style=\"height:" + fm.height + "\" src=\"" + imgUrl + "\"></a>";

    };

    formatFunc.imgTmp = function () {
        //图片，存放的是图片ID
        var ss = tdText.substring(0, 1);
        if (ss != ss * 1) {
            tdText = "<a href=\"" + fm.tmpurl + tdText + "\" target=\"_blank\"><img broder=0 style=\"height:" + fm.height + "\" src=\"" + fm.tmpurl + tdText + "\"></a>";
        } else {
            var tmpIds = tdText.split(",");
            var tmpId = "0";
            if (tmpIds.length >= 2) tmpId = tmpIds[1];
            imgUrl = fm.url.replace(/{id}/g, tmpId);
            tdText = "<a href=\"" + imgUrl.replace("&source=2", "&source=1") + "\" target=\"_blank\"><img broder=0 style=\"height:" + fm.height + "\" src=\"" + imgUrl + "\"></a>";
        }

    };

    formatFunc.link = function () {
        //超链接 连接自己
        tdText = "<a href=\"" + tdText + "\" target=\"_blank\">" + tdText + "</a>";

    };

    formatFunc.linkByCol = function () {
        //超链接 连接某地址
        var url = fm.url;
        url = url.replace(/{id}/g, dataRow["_id"]);

        var reg = /\d{7}/g;
        var re = url.match(reg);

        if (typeof (re) != "undefined") {
            for (var i = 0; i < re.length; i++) {
                var reg2 = new RegExp("\\{" + re[i] + "\\}", "g");
                url = url.replace(reg2, dataRow[re[i]]);
            }
        }
        tdText = "<a href=\"" + url + "\" target=\"_blank\">" + tdText + "</a>";

    };
    formatFunc.div = function () {
        //设置最大高度
        var style = "overflow:hidden;word-break:break-all";
        if (typeof (fm.maxHeight) != "undefined")
            style += ";height:" + fm.maxHeight;
        if (typeof (fm.maxWidth) != "undefined")
            style += ";width:" + fm.maxWidth;

        tdText = "<div style=\"" + style + ";\">" + tdText + "</div>";

    };
    formatFunc.addCss = function () {
        //添加指定的css
        tdText = "<div style=\"" + fm.css + ";\">" + tdText + "</div>";

    };
    formatFunc.timeFormat = function () {
        //时间的格式化
        var time = new Date(tdText);
        tdText = time.format(fm.format);

        if (typeof fm.isTiXing != "undefined") {
            //提醒
            time = new Date(tdText);

            var nowDay = new Date();
            var tixing = "";

            var dayCount = nowDay.DayCount(time);
            
            //alert(dayCount);
            /*判断是不是过期*/
            if (dayCount < 0) {//过期
                tixing = "（<span style='color:red;font-weight:bold'>已经过期了!</span>）";
            } else if (dayCount == 0) {
                tixing = "（<span style='color:red;font-weight:bold'>今天</span>）";
            } else if (dayCount == 1) {
                tixing = "（<span style='color:red;font-weight:bold'>明天</span>）";
            } else if (dayCount == 2) {
                tixing = "（<span style='color:red;font-weight:bold'>后天</span>）";
            } else if (dayCount == 3) {
                tixing = "（<span style='color:blue;font-weight:bold'>大后天</span>）";
            } else if (dayCount <= 10) {
                tixing = "（<span style='color:blue;font-weight:bold'>还有" + dayCount + "天</span>）";
            } else if (dayCount <= 20 ) {
                tixing = "（<span style='color:blue'>还有" + dayCount + "天</span>）";
            } else if (dayCount <= 30) {
                tixing = "（<span style='color:blue'>还有" + dayCount + "天</span>）";
            } else if (dayCount <= 60) {
                tixing = "（<span style='color:blue'>还有" + dayCount + "天</span>）";
            } else {
                tixing = "（还有" + dayCount + "天）";
            }

            tdText += tixing;

        }
    };

    /*数字格式化 可以加逗号，和控制小数位数
    s：要格式化的数字
    n：小数位数 0,2-20。0：不要小数
    d：逗号的间隔，一般是千分位，但是万分位更好的可读性，所以两种都实现了。0：不加逗号；3：千分位；4：万分位
    */
    formatFunc.numberFormat = function () {
        var fmt = fm.format;
       
        var hasPercent = false;//       没有百分号
        
        //判断有没有%
        if (fmt.indexOf('%') > 0) {
            //有百分号
            hasPercent = true ;
            fmt = fmt.replace('%', '');
        }
         
        var xiaoshudian = fmt.split(".");

        var s = tdText;
        var n = 0; /*默认没有小数*/
        var d = 0; /*默认不加逗号*/

        if (xiaoshudian.length == 2) /*有小数*/ n = xiaoshudian[1].length;

        var douhao = xiaoshudian[0].split(",");
        if (douhao.length == 2) /*有逗号*/ d = douhao[1].length;

        //前面的符号
        var head = "";
        var first = fmt.toString().substring(1, 0);
        if (first != first * 1) head = first;

        tdText = head + Nature.numFormat(s, n, d);

        if (hasPercent == true)
            tdText += "%";

    };
  

    //格式化
    if (format.length == 0) {
        return tdText;
    }

    //alert(format);
    var fm = eval("(" + format + ")");
    var kind = fm.kind;


    formatFunc[kind]();

    return tdText;



};


Nature.Controls.Grid.loadMetaJson = function (jsonInfo, commandControlInfo, callback2) {
    var load = new Nature.Data.Cache();
    var cacheKey = "metaForLog_" + commandControlInfo.dataBaseId;

    var dbid = commandControlInfo.dataBaseId;
    //if (dbid.split(",").length > 1)
    //    dbid = dbid.split(",")[1];
    
    if (typeof top.__cache[cacheKey] != "undefined") {
        callback2(top.__cache[cacheKey], jsonInfo);
    } else {
        load.ajaxGetMeta({
            urlPara: { action: "datachange", mdid: 0, mpvid: -3, bid: -3, dbid: dbid, cacheKey: "metaForLog_" + dbid },
            title: "模块、视图、按钮等的名称",
            success: function (info) {
                callback2(info, jsonInfo);
            }
        });

    }
};

Nature.Controls.Grid.loadFormatJson = function (jsonInfo,commandControlInfo, callback2) {
    
    var para = jsonInfo.para;
    var cacheKey = para.cacheKey;//缓存标识
    
    if (cacheKey == "no")
        cacheKey = Math.floor(Math.random() * 1000000).toString() + "_" + para.mpvid.toString();
    
    cusData();
    
    /*客户的数据*/
    function cusData() {
        var cache = new Nature.Data.Cache.Control();
          
        var info = {
            mdid: para.mdid,
            mpvid: para.mpvid,
            fpvid: para.fpvid,
            query: para.query,
            dataBaseId: commandControlInfo.dataBaseId
        };

        var key = [];
        if (typeof jsonInfo.key != "undefined")
            key = jsonInfo.key.toString().split(',');
        
        //检查参数是否有需要，用url参数替换
        var query = jsonInfo.para.query;
        if (typeof query != "undefined") {
            for (var i = 0; i < query.length; i++) {
                var arr = query[i].split(',');
                if (arr.length == 2) {
                    switch (arr[i]) {
                    case "frid":
                        query[i] = arr[0] + ',' + commandControlInfo.urlPara.foreignID;
                        break;
                    default:
                    }
                }
            }
        }

        //
        cache.getData("listkey", info, cacheKey, key, function (data) {
            callback2(data, jsonInfo);
        });
    }
    

/* 这里的都不要了，换成新的方式
    function cusData() {
        if (typeof(para.mpvid) != "undefined") {
            //需要数据
            //判断是否可以使用缓存，如果可以使用，检查是否有缓存。
            if (cacheKey != "no") {
                //可以使用缓存，判断是否有缓存
                if (typeof(parent) != "undefined") {
                    if (typeof(parent.mainEvent) != "undefined") {
                        if (typeof(parent.mainEvent.cacheNumberSymbol[cacheKey]) != "undefined") {
                            //有缓存
                            callback2(parent.mainEvent.cacheNumberSymbol[cacheKey], jsonInfo);
                            return;
                        }
                    }
                }
            }
        }

        //没有缓存，加载
        var myData = {
            action: "listkey",
            mdid: para.mdid,
            mpvid: para.mpvid,
            fpvid: para.fpvid,
            hasKey: 0,
            dbid: commandControlInfo.dataBaseId,
            frid: para.frid,
            pageno: 1
        };

        if (typeof(para.query) != "undefined") {
            //有查询条件
            myData.hasKey = 1;
            var arr = para.query; //;

            for (var index = 0; index < arr.length; index++) {
                var tmpKey = arr[index];
                var tmpKeys = tmpKey.split(",");
                if (tmpKeys.length > 1) {
                    myData[tmpKeys[0]] = tmpKeys[1];
                } else {
                    myData[tmpKeys[0]] = jsonInfo.key;
                }
            }

        }

        if (typeof(para.dbid) != "undefined") {
            myData.dbid = para.dbid;
        }

        $.ajaxGetData({
            title: "数据源",
            data: myData, // { mpvid: para.mpvid, frid: para.frid, pageno: Nature.Page.QuickPager.thisPageIndex },
            success: function(msg) {
                if (typeof(parent) != "undefined") {
                    if (typeof(parent.mainEvent) != "undefined") {
                        if (cacheKey != "no") {
                            //放入缓存
                            parent.mainEvent.cacheNumberSymbol[cacheKey] = msg;
                        }
                    }
                }

                callback2(msg, jsonInfo);
            }
        });

    }*/
    
};
 