/*
* 缓存数据，
* 如果缓存里没有，那么用ajax加载，加载后缓存到 top 里。

*/

//管理页面json的缓存
Nature.Data.Cache = function() {
    var self = this;

    var canUseCache = false;

    var load = new Nature.Data.Manager();

    //检查是否可以访问 父页
    try {
        if (typeof parent == "undefined")
            canUseCache = false;
        else {
            top.t_m_p = "tmp";
            if (top.t_m_p != "tmp") /*chrome里，抓不住这个异常，只好这么判断了*/
                canUseCache = false;
            else {
                if (typeof top.__cache == "undefined") {
                    top.__cache = {}; /* 开辟元数据的缓存空间 */
                    top.__cacheCusData = {}; /* 开辟客户数据的缓存空间 */
                }
                canUseCache = true;
            }

        }
    } catch(e) {
        /* 出异常，不允许访问，不缓存了。*/
        canUseCache = false;
    }

    //获取页面视图的元数据
    this.ajaxGetMeta = function(ajaxData) {
        var cacheKey = ajaxData.urlPara.cacheKey;

        if (canUseCache && cacheKey != "undefined") {
            //可以使用缓存，检查缓存里是否有记录
            if (typeof top.__cache[cacheKey] != "undefined") {
                //有对应的缓存数据
                if (typeof(parent.DebugSet) != "undefined") {
                    var myDate = new Date();
                    parent.DebugSet({
                        Title: "[客户端缓存,key:" + cacheKey + "]" + ajaxData.title,
                        UserId: -8,
                        StartTime: myDate.toLocaleString(),
                        UseTime: "0毫秒",
                        Url: "",
                        Detail: []
                    });
                }

                ajaxData.success(top.__cache[cacheKey]);
                return;
            }
        }

        /*加载元数据*/
        load.ajaxGetMeta({
            title: ajaxData.title,
            urlPara: ajaxData.urlPara,
            success: function(data) {
                //alert("得到数据，缓存数据");
                if (canUseCache) {
                    top.__cache[cacheKey] = data;
                }
                setCacheFlag(ajaxData, cacheKey);
                ajaxData.success(data);
            }
        });

        function setCacheFlag(ajaxData1, cacheKey1) {

            var divCache = $("#div_Cache");
            var divMetaCache = divCache.find("#div_cache_meta");
            if (divMetaCache.length == 0) {
                divMetaCache = $("<div id=\"div_cache_meta\" class=\"tt_frame_debug\" style=\"mapping:3px;clear:both;max-height:350px; overflow:auto\">元数据缓存：<br/>");
                divCache.append(divMetaCache);
            }

            var divPv = $("<div id=\"cc_" + cacheKey1 + "\" class=\"title_bug\">");
            divPv.append(ajaxData.title + '#' + cacheKey1 + " ");
            var spanCacheClear = $("<span style=\"cursor:pointer;float:right;\">清除</span>");
            divPv.append(spanCacheClear);
            divPv.append("<br>");

            spanCacheClear.click(function() {
                var cacheKey2 = this.parentElement.id;
                cacheKey2 = cacheKey2.replace("cc_", "");
                //alert(cacheKey2);
                top.__cache[cacheKey2] = undefined;

                /*去掉改节点*/
                var thisDom = this.parentElement;
                this.parentElement.parentElement.removeChild(thisDom);
            });

            divMetaCache.append(divPv);

        }

        ;
    };

    //客户数据的缓存
    this.returnCache = {};
    
    //获取缓存数据，返回没有缓存的id的集合，如果集合为空，表示都缓存了。
    this.getDataByIDs = function (key, ids) {

        var tmpIds = ids;
        
        if (typeof top.__cacheCusData[key] == "undefined") return ids;

        var notHaveIds = []; //没有缓存的id集合
        var notHaveId = {}; //没有缓存的id集合，避免重复
        
        self.returnCache = {};
        
        for (var i = 0; i < tmpIds.length ;i++) {
            if (typeof top.__cacheCusData[key][tmpIds[i]] == "undefined") {
                //检查是否有key，和是否有重复的key
                if (tmpIds[i] != "") {
                    notHaveId[tmpIds[i]] = "1";
                }
            }
                
            else {
                //有缓存数据，加到返回的集合里。
                self.returnCache[tmpIds[i]] = top.__cacheCusData[key][tmpIds[i]];
            }
        }
        
        //变成数组
        for (var key2 in notHaveId) {
            notHaveIds.push(key2);
        }

        return notHaveIds;//没有缓存的id的集合，如果没有，表示都缓存了。
        
    };
    

    //获取指定的数据，如果没有返回 null。

    this.getData = function(key, id) {

        if (typeof top.__cacheCusData[key] == "undefined")
            return null;
        if (typeof top.__cacheCusData[key][id] == "undefined")
            return null;

        return top.__cacheCusData[key][id];
    };
    

    //设置指定的值，就是缓存数据了。
    this.setData = function(key, id, value) {
        if (typeof top.__cacheCusData[key] == "undefined")
            top.__cacheCusData[key] = {};
        if (typeof top.__cacheCusData[key][id] == "undefined")
            top.__cacheCusData[key][id] = {};

        top.__cacheCusData[key][id] = value;
    };

};
 
//控制缓存的。外部调用control。
Nature.Data.Cache.Control = function() {
    var self = this;

    var cache = new Nature.Data.Cache();

    var load = new Nature.Data.Manager();

    //获取数据，外部调用。
    // funAjax：获取数据的ajax函数。如果写 listkey 则表示使用默认的函数
    // ajaxInfo：调用ajax的参数
    // key：缓存标识
    // ids：要得到的数据的ID集合，数组形式
    // callback：回调函数，返回保存ids的对象集合
    //
    this.getData = function (funAjax, ajaxInfo, key, ids, callback) {
        //判断缓存里是否有，从缓存里提取已经有的
        //找到没有的ID集合，调用fun获取数据
        //得到数据后加上，然后返回

        //先到缓存里取数据
        var notHaveIds = cache.getDataByIDs(key, ids);
        //记录取到的数据
        var returnCache = cache.returnCache;

        if (notHaveIds.length == 0) {
            //都在缓存里呢，可以返回了
            callback(returnCache);
            
        } else {
            //去掉重复的key - value
            var tmpKey = {};
            for (var i = 0; i < notHaveIds.length; i++) {
                tmpKey[notHaveIds[i]] = 1;
            }
            notHaveIds = [];
            for (var k in tmpKey) {
                notHaveIds.push(k);
            }

            if (notHaveIds.length == 1 && notHaveIds[0] == 0) {
                //需要获取key的值为 0 。默认为找不到数据，所以就不ajax了。
                callback(returnCache);
            } else {
                //还有不在缓存里的，需要调用 funAjax 去获取
                var fun = funAjax;
                if (typeof fun != "function") {//检查是不是函数
                    switch (fun) {
                        case "listkey":
                            fun = self.loadDataByAjaxListKey;
                            break;
                    }
                }

                //ajax获取记录
                fun(notHaveIds, ajaxInfo, function (notHaveIds2,data) {
                    //得到数据，计入缓存
                    for (var key3 in data) {
                        cache.setData(key, key3, data[key3]);
                        returnCache[key3] = data[key3];
                        
                    }
                    
                    //查看是否都有值了，如果有没有值得，指定为空
                    for (var i2 = 0; i2 < notHaveIds2.length; i2++) {
                        var key2 = notHaveIds2[i2];
                        if (typeof returnCache[key2] == "undefined") {
                            //没有，设置为空，避免再次查询
                            returnCache[key2] = "";
                            cache.setData(key, key2, "");
                        }
                    }

                    //返回
                    callback(returnCache);
                });
            }
          
        }


    };


    //加载数据，需要外部提供具体的方法，这里采用委托的概念。
     
    //默认的加载数据的方法（listkey）。这个方法要由外部提供的，符合要求就行
    this.loadDataByAjaxListKey = function(ids, ajaxInfo, callback) {
        //ids：要提取数据的数字标识（一般是主键值）
        //没有缓存，加载
        var myData = {
            action: "listkey",
            mdid: ajaxInfo.mdid,
            mpvid: ajaxInfo.mpvid,
            fpvid: ajaxInfo.fpvid,
            hasKey: 0,
            dbid: ajaxInfo.dataBaseId,
            //frid: ajaxInfo.frid,
            pageno: 1
        };

        if (typeof(ajaxInfo.query) != "undefined") {
            //有查询条件
            myData.hasKey = 1;
            var arr = ajaxInfo.query; //;

            for (var index = 0; index < arr.length; index++) {
                var tmpKey = arr[index];
                var tmpKeys = tmpKey.split(",");
                if (tmpKeys.length > 1) {
                    myData[tmpKeys[0]] = tmpKeys[1];
                } else {
                    //按照ids，提取数据，需要ajaxInfo.query配合（填写查询字段的id）
                    myData[tmpKeys[0]] = ids.join(',');
                }
            }

        }
         
        load.ajaxGetData({
            title: "数据源",
            urlPara: myData, // { mpvid: para.mpvid, frid: para.frid, pageno: Nature.Page.QuickPager.thisPageIndex },
            success: function(msg) {
                //得到数据，生成缓存格式
                var dataCache = {};
                if (typeof msg.data != "undefined") {
                    var tmpData = msg.data;
                    for (var key in tmpData) {
                        dataCache[key] = tmpData[key];

                        //获取第一个属性作为title
                        for (var key2 in tmpData[key]) {
                            dataCache[key].title = tmpData[key][key2];
                            break;
                        }
                    }
                }

                //回调
                callback(ids, dataCache, ajaxInfo);

            }
        });

    };

};
