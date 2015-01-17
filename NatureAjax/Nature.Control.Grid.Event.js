/*
 
 设置表格的css样式和tr的事件
 
 */

var oldCss;
var oldTR;

var TR_Active = {};

var cssClick = "tr-green";
var cssMove = "tr-blue";
var cssTr1 = "alt";
var cssTr2 = "css_tr_c2";
var cssTable = "table_default1";
var cssTh = "first";

Nature.Controls.Grid.prototype.setTableCss = function(table) {
    //alert(isShowSearch);
    var doc = this.gridEvent.win.document;
    var key = doc.URL;

    var self = this;
    
    //设置事件
    var tblTr = table.find("tr");
    tblTr.unbind("mousemove", "mouseout");
    tblTr.mousemove(function() { over(this); });
    tblTr.mouseout(function() { out(this); });

    //设置属性
    //if ($("#divLeft").length > 0) {
    //    $("#divLeft tr:odd").attr("myclass", cssTr1).addClass(cssTr1);
    //    $("#divLeft tr:even").attr("myclass", cssTr2).addClass(cssTr2);

    //}
    table.find("tr:odd").addClass(cssTr1).attr("myclass", cssTr1);
    table.find("tr:even").addClass(cssTr2).attr("myclass", cssTr2);
    tblTr.first().removeClass(cssTr2).addClass(cssTh).attr("myclass", cssTh);

    /*鼠标在tr上面 over */
    var over = function(me) {
        if (oldTR == null) {
            oldTR = me;
            me.className = cssMove;
        } else //if (oldTR != me)
        {
            oldTR = me;

            if (TR_Active[key] != me) {
                me.className = cssMove;

                var tmpId = me.id;
                if (tmpId.indexOf("_l") > 0)
                    tmpId = tmpId.replace("_l", "");
                else
                    tmpId += "_l";

                if ($("#" + tmpId,doc).length > 0)
                    $("#" + tmpId, doc)[0].className = cssMove;
            }
        }


    };

    /*鼠标离开了tr over */
    var out = function(me) {
        //var a = document.getElementById("dd");
        //a.innerHTML += oldTR.myclass;

        if (oldTR != null) {
            //a.innerHTML += "Out设置CSS：" + oldCss+"<BR>";
            if (TR_Active[key] != me) {
                me.className = me.getAttribute("myclass");
                var tmpId = me.id;
                if (tmpId.indexOf("_l") > 0)
                    tmpId = tmpId.replace("_l", "");
                else
                    tmpId += "_l";

                if ($("#" + tmpId, doc).length > 0)
                    $("#" + tmpId, doc)[0].className = me.getAttribute("myclass");
            }
            oldTR = me;
        }

    };
};

/* 设置按钮不可用 */
var btn = function(doc) {
    var oForm = doc.getElementsByTagName("input");
    //alert(oForm.length  );  //.item(0).length
    //遍历所有表元素
    for (var i = 0; i < oForm.length; i++) {
        if (oForm.item(i).type == "button") {
            oForm[i].disabled = false;
            oForm[i].title = "";
            oForm[i].className = "input_01";
        }
    }
};

/*鼠标在tr上面 单击，选择了一条记录 */
Nature.Controls.Grid.prototype.trClick = function(me,id) {
    var doc = this.gridEvent.win.document;
    var key = doc.URL;

    var self = this;

    this.gridEvent.selectDataID = id;
    if (TR_Active[key]) {
        TR_Active[key].className = TR_Active[key].getAttribute("myclass");
        var tmpId = TR_Active[key].id;
        if (tmpId.indexOf("_l") > 0)
            tmpId = tmpId.replace("_l", "");
        else
            tmpId += "_l";

        var tr = $("#" + tmpId, doc);
        if (tr.length > 0)
            tr[0].className = TR_Active[key].getAttribute("myclass");
         
       
    }
    me.className = cssClick;

    tmpId = me.id;
    if (tmpId.indexOf("_l") > 0)
        tmpId = tmpId.replace("_l", "");
    else
        tmpId += "_l";

    if ($("#" + tmpId, doc).length > 0)
        $("#" + tmpId, doc)[0].className = cssClick;

    TR_Active[key] = me;

    var isChecked ;
    var divId = self.gridEvent.divID;
    
    /*设置复选框*/
    var chk = $("#chk_" + divId + "_" + id, doc);
    if (chk.length > 0) {
        chk[0].checked = !chk[0].checked;
        isChecked = chk[0].checked;
    }

    
    //锁定列里的check
    chk = $("#chk_" + divId + "_" + id + "_l", doc);
    if (chk.length > 0) {
        if (typeof isChecked == "undefined")
            chk[0].checked = !chk[0].checked;
        else
            chk[0].checked = isChecked;

    }

    self.checkClick();
    
    btn(doc);
};

/*鼠标在tr上面 双击，打开默认按钮 */
Nature.Controls.Grid.prototype.dblClick = function (divButton) {
    divButton.children().each(function() {
        var btn = $(this);
        switch (btn.attr("btnType")) {
        case "t401":
        //查看数据
        case "t403":
        //修改数据
        case "t408":
            //单击按钮
            btn.click();
            return false;
            break;
        }
    });

};
 
 
//function myScroll(me)
//{
//    var divT = $("#divTop")[0];
//    var divL = $("#divLeft")[0];

//    divT.scrollLeft = me.scrollLeft;
//    divL.scrollTop = me.scrollTop;

//}