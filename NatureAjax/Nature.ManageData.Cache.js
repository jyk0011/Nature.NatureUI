/*
*  获取记录集。
*  先判断有无缓存，有：取缓存；无：告知调用者
*  2014-1-16 by jyk
*/

//缓存的操作
Nature.ManagerData.Cache = function() {
    var canUseCache = false;

    //var load = new Nature.Data.LoadData();

    //检查是否可以访问 父页
    try {
        if (typeof parent == "undefined")
            canUseCache = false;
        else {
            top.t_m_p = "tmp";
            if (top.t_m_p != "tmp") /*chrome里，抓不住这个异常，只好这么判断了*/
                canUseCache = false;
            else {
                if (typeof top.__cache == "undefined")
                    top.__cache = {};/* 开辟缓存空间 */

                canUseCache = true;
            }

        }
    } catch (e) {
        /* 出异常，不允许访问，不缓存了。*/
        canUseCache = false;
    }

    //获取页面视图的元数据
    this.GetMetaByCache = function (ajaxData) {
        var cacheKey = ajaxData.data.cacheKey;

        if (canUseCache && cacheKey != "undefined") {
            //可以使用缓存，检查缓存里是否有记录
            if (typeof top.__cache[cacheKey] != "undefined") {
                //有对应的缓存数据
                if (typeof (parent.DebugSet) != "undefined") {
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

        /*加载数据*/
       

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

            spanCacheClear.click(function () {
                var cacheKey2 = this.parentElement.id;
                cacheKey2 = cacheKey2.replace("cc_", "");
                //alert(cacheKey2);
                top.__cache[cacheKey2] = undefined;

                /*去掉改节点*/
                var thisDom = this.parentElement;
                this.parentElement.parentElement.removeChild(thisDom);
            });

            divMetaCache.append(divPv);

        };
    };
};