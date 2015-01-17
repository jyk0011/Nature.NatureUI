/*
* 显示debug
*/


Nature.Debug = function (){
    var index = 0;
    var remarkDiv = "<div id=\"remarkDivTitle\" class=\"div_help\" style=\"display: none;\"><i class=\"help_lefticon\"></i><p>{0}</p></div>";
    var remarkWen = "<a href=\"javascript:;\" class=\"input_help\">?</a>";

    this.write = function (divId, debugInfo) {
        if (typeof debugInfo == "undefined")
            return;
        
        var divFloatDebug = $("#" + divId);  //浮动外框id

        var divDebug;
        if ($("#tblDebug").length == 0) {
            //创建内框
            divDebug = $("<div id=\"tblDebug\" class=\"tt_frame_debug\" style=\"clear:both;max-height:350px; overflow:auto\">");
            divFloatDebug.append(divDebug);
        } else {
            //已经有内框，获取内框
            divDebug = $("#tblDebug");
        }

        var debugOne = $("<div>");   //一条debug信息
        
        index++;
        var debugSpan = "<span id=\"spanTitle\" class='title_bug'>" + index + "、[" + debugInfo.UserId + "] " + debugInfo.Title + "。";

        if (debugInfo.StartTime != "0")
            debugSpan += "访问时间：" + debugInfo.StartTime.split(' ')[1] + "。用时：" + debugInfo.UseTime + "( + " + debugInfo.debugToJsonTime + ")";

        debugSpan += "</span>";
        
        debugOne.append(debugSpan);
        
        var arrDetail = debugInfo.Detail;
        if (typeof arrDetail != "undefined") {
            if (arrDetail.length > 0) {
                var span = $("<span style='color:red;font-size:12px;cursor:pointer'>&nbsp;&nbsp;[" + arrDetail.length + "个子步骤 详细]</span>");
                debugOne.find("#spanTitle").append(span);

                var div = $("<div style=\"border:1px #36C solid;display:none;padding-left:50px;\">");
                for (var i = 0; i < arrDetail.length; i++) {
                    showDetail(div, arrDetail[i], 2);
                }

                debugOne.append(div);
                span.click({ div: div }, function(info) {
                    var tmpDiv = info.data.div;
                    if (tmpDiv.css("display") == "none")
                        tmpDiv.show();
                    else
                        tmpDiv.hide();

                });
            }
        }
        
        //加入
        if (divDebug.children().length == 0)
            divDebug.append(debugOne);
        else {
            $(divDebug.children()[0]).before(debugOne);
        }

         
        //记录过多，删除最先加载的
        if (divDebug.children().length > 18) {
            var lastIndex = divDebug.children().length;
            $(divDebug.children()[lastIndex]).remove();
        }

    };

    var showDetail = function (divOne,detail,deep) {
        //标题和时间
        var detailDiv = $("<div >" + detail.Title + "： " + detail.UseTime + "。</div>");
        divOne.append(detailDiv);

        if (typeof detail.Remark != "undefined" && detail.Remark.length > 0) {
            //加问号提示
            var remarkTitle = $(remarkDiv.replace("{0}", detail.Remark));
            var remarkWenHao = $(remarkWen);
            var isClose = true;
            remarkWenHao.mouseover(function () {
                remarkTitle.show();
                var offset = remarkWenHao.offset();
                offset.left += 20;
                offset.top -= 20;
                remarkTitle.offset(offset);
            });
            remarkWenHao.mouseout(function () {
                window.setTimeout(function () {
                    if (isClose) remarkTitle.hide();
                }, 200);
            });
            
            remarkTitle.mouseover(function () {
                isClose = false;
                remarkTitle.show();
            });
            remarkTitle.mouseout(function () {
                isClose = true;
                remarkTitle.hide();
            });
            
            //拖拽
            if (typeof remarkTitle.drag == "function")
                remarkTitle.drag({ isDragTmpDiv: false, isShowBg: false });
            
            detailDiv.append(remarkWenHao).append(remarkTitle);
        }
        
        //检查是否有子步骤
        var arrDetail = detail.Detail;
        if (typeof arrDetail != "undefined" && arrDetail.length >0) {
            var span = $("<span style='color:red;font-size:12px;cursor:pointer'>&nbsp;[" + arrDetail.length + "个子步骤 详细]</span>");
            detailDiv.append(span);

            var div = $("<div class=\"debugDetail\">");
            for (var i = 0; i < arrDetail.length ; i++) {
                showDetail(div, arrDetail[i], deep +1);
            }

            detailDiv.append(div);
            span.click({ div: div }, function (info) {
                var tmpDiv = info.data.div;
                if (tmpDiv.css("display") == "none")
                    tmpDiv.show();
                else
                    tmpDiv.hide();
            });

        }
        
    };
};
    
