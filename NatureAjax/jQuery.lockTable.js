/*
* 锁定talbe的行列，即冻结窗口。
* $("#tableID").drag();// tableID：要锁定的talbe
*  

创建三个div
创建三个table

copy内容，设置宽高

*/

jQuery.fn.extend({
    lock: function (info) {

        if (this.parent().is(":hidden"))
            return;

        //默认设置
        var defaultConfig = {
            divWidth: 0,
            tableWidth: 1000,
            lockRowCount: 1,           //锁定行数，默认1行
            lockColCount: 1,        //锁定列数，默认1列。
            padding: 7

        };

        //浮动的div和table
        var divHead = ""; var tblHead = "";
        var divLeft = ""; var tblLeft = "";
        var divMid = " "; var tblMid = "";

        //要锁定的table外面的div
        var divMain = this.parent();

        var lockInfo = {
            tableWidthSum:0 ,       //td的宽度合计
            tableHeightSum:0,       //td的高度合计
            divHeadHeight:0,        //
            divLeftWidth: 0,        //
            
            divWidth:0,        //
            divHeight:0        //
            
        };

        //设置默认值
        setDefault();

        if ($("#divHead", info.window.document).length == 0) {
            //定义浮动的div和里面的table
            dingyiTable();

            //加到body里面
            //alert("没添加");
            //设置div和table的关系，加到body里面
            guanlianDiv();

            //加滚动事件
            divMain.scroll(function () {
                divHead.scrollLeft(divMain.scrollLeft());
                divLeft.scrollTop(divMain.scrollTop());
            });
            //设置外面的div可以出滚动条
            divMain.css("overflow", "auto");
       
        } else {
            //查找对应的对象
            //alert("添加了");
            divHead = $("#divHead", info.window.document); tblHead = divHead.find("table");
            divLeft = $("#divLeft", info.window.document); tblLeft = divLeft.find("table");
            divMid = $("#divMid", info.window.document); tblMid = divMid.find("table");

        }

        divMain.scrollTop(0);//滚动到头

        var winWidth = $(info.window).width();
        
        //设置表格的宽度
        if (info.tableWidth > winWidth - 34)
            this.width(info.tableWidth);
        else
            this.width(winWidth - 34);


        //复制表格
        copyTable(this);

        //设定宽高
        setWidth(this);

        
        var mainWidth = info.divWidth;

        if (mainWidth == 0)
            mainWidth = winWidth;

        divMain.width(mainWidth - 17);
        divHead.width(mainWidth - "34");

        //divMain.parent().width(mainWidth);

        var mainHeight = $(info.window).height();
        
        divMain.height(mainHeight - 170);
        divLeft.height(mainHeight - 190);

        //定位
        this.resize(info.window.document);

        
        function setWidth(tt) {
        
            //复制表格属性
            myMergeAttributes(tblHead[0], tt[0]);
            myMergeAttributes(tblLeft[0], tt[0]);
            myMergeAttributes(tblMid[0], tt[0]);

            myMergeAttributes(divHead[0], divMain[0]);
            //myMergeAttributes(divLeft[0], divMain[0]);
            //myMergeAttributes(divMid[0], divMain[0]);

            divHead.css("overflow", "hidden");
            
            var width = divMain.width();
            var height = divMain.height();

            divHead.width(width - 14 + "px");
            divLeft.height(height - 16 + "px");

            //tblHead.width(info.tableWidth);
            //tt.width(info.tableWidth);


            //修改head的每一列的宽度
            var tdth;
            if (tblHead.find("tr:eq(0)").find("th").length == 0)
                tdth = "td";
            else
                tdth = "th";

            var leftWidth = 10;     //左侧table的宽度
            //var allWidth = 0;       //整个表格的宽度

            tblHead.find("tr:eq(0)").find(tdth).each(function (i) {
                var tWidth = tt.find("tr:eq(0)").find(tdth).eq(i).width();    //表格第一行指定列的宽度
                //var tWidth = tt.find("tr:eq(0)").find(tdth).eq(i)[0].offsetWidth ;//.width();    //表格第一行指定列的宽度
            //    var hWidth = $(this).width();                                   //head 的第一行指定列的宽度

            //    //数据表格比head宽
            //    $(this).width(tWidth + 1 + "px");
                if (i < info.lockColCount)
                    leftWidth += tWidth;
            //    allWidth += tWidth + info.padding;


            });

            tblLeft.width(leftWidth);
            tblMid.width(leftWidth);

            divLeft.width(leftWidth);
            divMid.width(leftWidth * 1 + 30);

            //alert("原表格宽度：" + tt.width() + "。td相加的宽度 ：" + allWidth);

            var headWidth = tt.width();
            //if (headWidth < allWidth) headWidth = allWidth;
            //if (headWidth < info.tableWidth) headWidth = info.tableWidth;
            //tblHead.width(headWidth);
            
            //设置行高
            leftWidth = 0;
            tblLeft.find("tr").each(function (i) {
                var trHeight = tt.find("tr").eq(i).height();
                $(this, info.window.document).height(trHeight);

                if (i < info.lockRowCount) {
                    tblMid.find("tr").eq(i).height(trHeight);
                }

                //设置左侧的td的宽度
                $(this, info.window.document).find("td").each(function (j) {
                    var tdWidth = tt.find("tr").eq(i).find("td").eq(j).width();
                    //alert(this.innerHTML);
                    $(this, info.window.document).width(tdWidth);

                    if (i < info.lockRowCount && j < info.lockColCount) {
                        tblMid.find("tr").eq(i).find("td").eq(j).width(tdWidth);
                        leftWidth += tdWidth;
                    }
                });

            });

            //tblMid.width(leftWidth);
            //divMid.width(leftWidth);

            //设置div的高度
            var divHeight = 0;
            for (var b = 0; b < info.lockRowCount; b++) {
                divHeight += tt.find("tr").eq(b).height() + info.padding;
            }

            divHead.height(divHeight - 6);
            divMid.height(divHeight);

           
        }

        function copyTable(tt) {
            //创建锁定行、列
            //tblHead.children().remove();
            tblLeft.children().remove();
            tblMid.children().remove();

            //把整个表格都放入到head里，避免宽度对不齐（当然效率很低了）
            divHead.html(tt.clone());

            tblHead = divHead.find("table");
            
            tt.find("tr").each(function (i) {
                var thisTr = $(this, info.window.document);
                var td; var th;
                var tr1 = $("<tr>");
                var tr2 = $("<tr>");

                var trHeight = tt.find("tr").eq(i).height();
                //创建行
                if (i < info.lockRowCount) {
                    //tblHead.append(thisTr.clone());

                    //创建锁定行列重叠的部分
                    for (var a = 0; a < info.lockColCount; a++) {
                        if (thisTr.find("td").length > 0) {
                            td = thisTr.find("td").eq(a).clone();
                            tr2.append(td);
                        } else {
                            th = thisTr.find("th").eq(a).clone();
                            tr2.append(th);
                        }

                        tr2.height(trHeight);
                    }
                    tblMid.append(tr2);
                }

                //创建列
                tr1 = thisTr.clone(true);
                tr1.attr("id", tr1.attr("id") + "_l");
                
                tr1.height(trHeight);

                if (tr1.find("th").length > 0) {
                    tr1.find("th").each(function (c) {
                        if (c >= info.lockColCount) {
                            $(this, info.window.document).remove();
                        }
                    });
                } else if (tr1.find("td").length > 0) {
                    tr1.find("td").each(function (b) {
                        if (b >= info.lockColCount) {
                            $(this, info.window.document).remove();
                        } else {
                            this.id = this.id + "_l";
                            var chk = $(this).find("input[type='checkbox']");
                            if (chk.length >0)
                                chk.attr("id", chk.attr("id") + "_l");
                        }
                    });
                }
                tblLeft.append(tr1);
            });
            
            //表格右面加一个div，占位
            tt.css("float", "left");
            divMain.append("<div style='width:25px;clear:both'></div>");
            

        }



        //赋值对象属性的函数。IE 里可以用 mergeAttributes，但是其他浏览器不支持，所以只好用遍了的办法。
        function myMergeAttributes(target, source) {
            if (document.all) {
                target.mergeAttributes(source);
            }
            else {
                var attrs = source.attributes, i = attrs.length - 1;

                for (; i >= 0; i--) {
                    var name = attrs[i].name;

                    switch (name.toLowerCase()) {
                        case 'id':
                        case 'height':
                        case 'width':
                            continue;

                    }

                    if (attrs[i].value != null) {
                        target.setAttribute(name, attrs[i].value);
                    }
                }
            }


        }

        //设置默认值
        function setDefault() {
            if (typeof (info) == "undefined")
                info = defaultConfig;
            else {
                if (typeof (info.divWidth) == "undefined") {
                    info.divWidth = defaultConfig.divWidth;
                }
                if (typeof (info.tableWidth) == "undefined") {
                    info.tableWidth = defaultConfig.tableWidth;
                }
                if (typeof (info.lockRowCount) == "undefined") {
                    info.lockRowCount = defaultConfig.lockRowCount;
                }
                if (typeof (info.lockColCount) == "undefined") {
                    info.lockColCount = defaultConfig.lockColCount;
                }
                if (typeof (info.padding) == "undefined") {
                    info.padding = defaultConfig.padding;
                }
            }
        } //end function

        //定义浮动的div和里面的table
        function dingyiTable() {
            divHead = $("<div id=\"divHead\" style=\"overflow:hidden;position: absolute;top:0px;left:0px;\">");
            tblHead = $("<table>");

            divLeft = $("<div id=\"divLeft\" style=\"overflow:hidden;position: absolute;top:0px;left:0px;\">");
            tblLeft = $("<table>");

            divMid = $("<div id=\"divMid\" style=\"overflow:hidden;position: absolute;top:0px;left:0px;z-index:20;\">");
            tblMid = $("<table>");
        } //end function

        function guanlianDiv() {
            divHead.html(tblHead);
            divLeft.html(tblLeft);
            divMid.html(tblMid);

            $(info.window.document.body).append(divHead);
            $(info.window.document.body).append(divLeft);
            $(info.window.document.body).append(divMid);
        }

    },

    //设置浮动的div的定位
    resize: function (doc) {
        //要锁定的table外面的div
        var divMain = this.parent();

        var offset = divMain.offset();
        $("#divHead", doc).offset(offset);
        $("#divLeft", doc).offset(offset);
        $("#divMid", doc).offset(offset);
    }

});


 