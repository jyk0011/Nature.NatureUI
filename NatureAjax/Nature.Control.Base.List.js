/*
* 列表框类的，包括下拉列表框、列表框、checkboxlist等
* 各种列表框，比如下来的，列表的，单选组，多选组等。
* 
*/

function setListOption(lst,val,text) {
    var arrText = text.split('`');
    if (arrText.length <= 1)
        lst.append("<option value='" + val + "'>" + arrText[0] + "</option>");
    else {
        lst.append("<option value='" + val + "' style=\"" + arrText[1] + "\">" + arrText[0] + "</option>");
    }
}

//ctl250
Nature.Controls.BaseControl.prototype.DropDownList = function (controlInfo, controlExtend, cmdInfo) {
    //下拉列表框
    var lst = $("<select class=\"select_s1\"/>");
    lst.attr("name", "c" + controlInfo.ColumnID)
       .attr("id", "ctrl_" + controlInfo.ColumnID);


    if (typeof (controlExtend) != "undefined") {
        switch (controlExtend.isChange * 1) {
            case -1:
                //不显示
                break;
            case -2:
                //显示
                lst.append("<option value='-99999'>请选择</option>");
                break;
            case 0:
                //默认
                break;
        }

        if (typeof controlExtend.width != "undefined") {
            if (parseInt(controlExtend.width) != 0) {
                lst.css("width", controlExtend.width + "px");
            }
        }

        var i = 0;
        if (typeof controlExtend.item != "undefined") {
            for (i = 0; i < controlExtend.item.length; i++) {
                setListOption(lst, controlExtend.item[i].val, controlExtend.item[i].txt);
            }
        }

        if (typeof controlExtend.ajax != "undefined") {
            /*ajax的方式获取item*/
            var jsonInfo = {
                para: controlExtend.ajax
            };

            Nature.Controls.Grid.loadFormatJson(jsonInfo, cmdInfo, function(data, jsonNumColInfo) {
                var myData = data.data;

                //                var isChange = false;

                //                var defKey = jsonNumColInfo.para.defKey;
                //                var defValue = jsonNumColInfo.para.defValue;
                //                var isShowFlag = jsonNumColInfo.para.isShowFlag;
                var colId = jsonNumColInfo.para.colID;

                if (typeof(myData) != "undefined") {
                    for (var key in myData) {
                        setListOption(lst, key, myData[key][colId]);
                    }

                }
            });
        }
    }
    return lst;

};

//252 联动
Nature.Controls.BaseControl.prototype.UList = function (controlInfo, controlExtend, baseInfo, cmdInfo) {
    //级联列表

    var lst = this.DropDownList(controlInfo, controlExtend, cmdInfo);
    if (typeof controlExtend.size != "undefined")
        lst[0].size = controlExtend.size;

    //获取联动列表框信息
    var info = controlExtend;

    //ajax的参数
    var ajaxPara = eval("(" + controlExtend.para + ")");
    
    if (typeof baseInfo.unionList[info.union] == "undefined") {
        
        //没有对应的列表框，创建
        var lstEvent = {
            lstObjects: [lst],     //联动列表的id集合，数组形式
            ajaxPara: [ajaxPara],
            //change事件。selectValue：列表框选择的值，lst：下一个列表框的jQuery对象，callback：回调函数，触发列表框的change事件，也可以直接写lst.change();
            lstChange: function (selectValue, lst1,para, callback) {
                //alert(selectValue);
                //使用ajax获取数据，先强行设置为不用缓存，因为key没有区分好。
                para.cacheKey = "no";
                
                Nature.Controls.Grid.loadFormatJson({ para: para, key: selectValue }, cmdInfo, function (data, jsonNumColInfo) {
                    //使用data填充item
                    var myData = data;
                    if (typeof (myData) != "undefined") {
                        var colId = jsonNumColInfo.para.colID;
                         
                        if (baseInfo.kind == "find") {
                            setListOption(lst1, "-99999","全部");
                        }
                        
                        for (var key in myData) {
                            if (typeof myData[key] != "undefined" && typeof (myData[key][colId]) != "undefined")
                                setListOption(lst1, key, myData[key][colId]);
                        }
                        
                        if (lst1.find("option").length == 1) {
                            lst1.append("<option value='0'>没有对应的数据！</option>");
                        }
                        
                        if (typeof lst1.setValue == "undefined") {
                            //选择第一个
                            lst1[0].options[0].selected = true;
                        }
                        else {
                            lst1.val(lst1.setValue);
                        }
                        callback(lst1);
                    }
                });
            },
            setSelectForUpdate:function() {
                
            }
        };

        baseInfo.unionList[info.union] = this.UnionList(lstEvent, cmdInfo);
    } else {
        //有了，追加一个
        baseInfo.unionList[info.union].addListByObject(lst, ajaxPara);
    }

    return lst; //baseInfo.unionList[info.union];

};


//253 单选组
Nature.Controls.BaseControl.prototype.RadioBoxList = function (controlInfo, controlExtend, setCheck, cmdInfo) {

    var nfRadio = function (colId, value, index) {
        //单选
        var em = document.createElement("input");
        em.id = "ctrl_" + colId + "_" + index;
        em.type = "radio";
        em.name = "c" + colId;
        em.value = value;

        var dom = $(em);
        dom.addClass("radio_g_s");
        setCheck(dom, controlInfo);

        return dom;

    };
    
    //单选组
    var tt = $("<table>");

    var itemRows = controlExtend.itemRows;
    if (!$.isNumeric(itemRows))
        itemRows = 20;

    for (var i = 0; i < controlExtend.item.length; i++) {

        var tr = $("<tr>");
        for (var j = 0; j < itemRows; j++) {
            var td = $("<td>");
            var r = nfRadio(controlInfo.ColumnID, controlExtend.item[i].val, i);
            td.append(r);

            var lbl = "<label for=\"ctrl_" + controlInfo.ColumnID + "_" + i + "\" class=\"radio_g_t\">" + controlExtend.item[i].txt + "</label>";
            td.append(lbl);
            tr.append(td);

            i++;
            if (i == controlExtend.item.length)
                break;
        }
        i--;
        tt.append(tr);
    }

    return tt;
    
};

//254 多选组
Nature.Controls.BaseControl.prototype.CheckBoxList = function (controlInfo, controlExtend, setCheck, cmdInfo) {

    var nfCheck = function (colId, value, index) {
        //多选
        var em = document.createElement("input");
        em.id = "ctrl_" + colId + "_" + index;
        em.type = "checkbox";
        em.name = "c" + colId;
        em.value = value;

        var dom = $(em);
        dom.addClass("checkbox_g_s");

        setCheck(dom, controlInfo);

        return dom;

    };
    
    //多选组

    var tt = $("<table>");
    var itemRows = controlExtend.itemRows;
    if (!$.isNumeric(itemRows)) itemRows = 20;

    for (var i = 0; i < controlExtend.item.length; i++) {

        var tr = $("<tr>");

        for (var j = 0; j < itemRows; j++) {
            var td = $("<td>");
            var rad = nfCheck(controlInfo.ColumnID, controlExtend.item[i].val, i);
            td.append(rad);

            var lbl = "<label for=\"ctrl_" + controlInfo.ColumnID + "_" + i + "\" class=\"checkbox_g_t\">" + controlExtend.item[i].txt + "</label>";
            td.append(lbl);
            tr.append(td);

            i++;
            if (i == controlExtend.item.length)
                break;
        }
        i--;

        tt.append(tr);
    }

    return tt;

};

//255
Nature.Controls.BaseControl.prototype.CheckBox = function (controlInfo, controlExtend, setCheck, cmdInfo) {
    //复选
    var em = document.createElement("input");
    em.id = "ctrl_" + controlInfo.ColumnID;
    em.type = "checkbox";
    em.name = "c" + controlInfo.ColumnID;
    em.value = controlExtend.item[0].val;

    var dom = $(em);
    dom.addClass("checkbox_g_s");
    setCheck(dom, controlInfo);

    var sp = $("<span>");
    sp.append(dom);
    var lbl = "<label for=\"ctrl_" + controlInfo.ColumnID + "\" class=\"checkbox_g_t\">" + controlExtend.item[0].txt + "</label>";
    sp.append(lbl);

    return sp;

};


//ctl256
Nature.Controls.BaseControl.prototype.ListBox = function (controlInfo, controlExtend, baseInfo, cmdInfo) {
    //列表框
    var lst = this.DropDownList(controlInfo, controlExtend, cmdInfo);
    lst[0].size = controlExtend.size;
    return lst;

};
