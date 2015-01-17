/*
* 批量修改，
* grid + form 
* 在表格控件的基础上，加上表单控件

*/
 

Nature.Controls.GridForm = function (info) {

    var gridFormInfo = info;
    
    gridFormInfo.urlPara = info.pagerList.cmdInfo.urlPara;
    //{
    gridFormInfo.btnEsc = $("<span> <button class=\"buttonSta01 bZ\"> 取消 </button> </span>"), /* 取消按钮*/
    gridFormInfo.btnSave = $("<span> <button class=\"buttonSta02 bZ\"> 保存 </button> </span>"), /* 保存按钮*/
    gridFormInfo.rowIndex = 0, /*选择了第几行*/
    gridFormInfo.selectTr = {}, /*选择的行*/

    gridFormInfo.win = info.win,
    gridFormInfo.doc = info.win.document;
    
    gridFormInfo.divId = "divDataList", //存放表格控件的div

    gridFormInfo.grid = {}, /*表格控件，外面生成*/
    gridFormInfo.dataSource = info.pagerList.grid.gridEvent.dataSet.data; /*记录集*/

    gridFormInfo.form = {}, /*对应的表单控件，内部生成*/

    gridFormInfo.moduleID = gridFormInfo.urlPara.moduleID;//修改数据使用的视图ID
    gridFormInfo.gridFormViewID = gridFormInfo.urlPara.gridFormViewID;
    
    gridFormInfo.updateDataIdc = ""; /*当前修改的记录的ID值*/
     
    //        //commandInfoGridForm : {
    //    //    onTimeOut: parent.showLoginDiv,
    //    //    dataBaseId: dbid
    //    //},
    
     
    this.gridFormInfo = gridFormInfo;

};



/*设置初始环境，设置单击事件*/
Nature.Controls.GridForm.prototype.init = function () {
    var self = this;

    self.gridFormInfo.win.isEditing = false;
    
    var trIndex = 0;

    $("#" + self.gridFormInfo.divId + " #grid tr", self.gridFormInfo.doc).each(function () {
        var tr = $(this);

        if (trIndex == 0)/*第一行，标题行，设置空位*/
            tr.append($("<td style=\"width:100px;\"> &nbsp; </td>"));
        else { /*其他行，设置td，准备放操作按钮*/
            tr.append($("<td id=\"opeater\"> </td>"));
            if (tr.css("height").replace("px") * 1 < 20)
                tr.css("height", "20px");
        }

        /*设置单击事件*/
        self.setTrClick(tr);

        trIndex++;
    });
     
    self.bindForm();
};


/*翻页后设置事件*/
Nature.Controls.GridForm.prototype.onPager = function () {
    var self = this;
    self.gridFormInfo.win.isEditing = false;
    
    self.gridFormInfo.dataSource = self.gridFormInfo.pagerList.grid.gridEvent.dataSet.data;
    
    var trIndex = 0;

    $("#" + self.gridFormInfo.divId + " #grid tr", self.gridFormInfo.doc).each(function () {
        var tr = $(this);

        if (trIndex != 0) { /*其他行，设置td，准备放操作按钮*/
            tr.append($("<td id=\"opeater\"> </td>"));
        }

        /*设置单击事件*/
        self.setTrClick(tr);

        trIndex++;
    });
 
};


/*设置tr的单击事件*/
Nature.Controls.GridForm.prototype.setTrClick = function (tr) {
    var self = this;

    /*去掉tr的单击事件和双击事件*/
    //tr.unbind("click");
    tr.unbind("dblclick");

    /*注册tr的单击事件*/
    tr.dblclick(function () {

        var thisTr = $(this);
        
        if (self.gridFormInfo.win.isEditing) /*是否在编辑状态，在编辑状态则不执行*/
            return;

        self.gridFormInfo.win.isEditing = true;
        
        self.gridFormInfo.rowIndex = tr.attr("index"); /*单击了第几行*/
        self.gridFormInfo.win.editDataId = self.gridFormInfo.dataSource[self.gridFormInfo.rowIndex]._id;

        self.gridFormInfo.selectTr = tr;  /*单击的行*/

        /*取消按钮的事件*/
        self.setEsc();

        /*保存按钮的事件*/
        self.setSave();

        /*设置操作按钮*/
        if (self.trIndex != 0) {
            var tdcc = tr.find("#opeater");
            tdcc.append(self.gridFormInfo.btnSave);
            tdcc.append(self.gridFormInfo.btnEsc);

            self.gridFormInfo.selectTr.append(tdcc);
        }

        /*遍历选中行的td*/
        var tds = tr.find("td");

        var index = 0;
        tds.each(function () {
            if (this.id != "tdCheck") { /*td里不是复选框*/
                var colId = this.id.replace("td", ""); /*字段ID*/

                /*在表单控件里寻找对应的控件*/
                var tmpCtrl = $("#divForm #ctrl_" + colId, self.gridFormInfo.doc).clone(true);

                /*根据记录集设置值*/
                tmpCtrl.val(self.gridFormInfo.dataSource[self.gridFormInfo.rowIndex][colId]);
                /*修改高度*/
                if (typeof tmpCtrl.attr("type") != "undefined") {
                    if (tmpCtrl.attr("type") == "text") ;
                    tmpCtrl.css("height", "17px");
                }
                
                if (tmpCtrl.length > 0) {
                    tmpCtrl.click(function (e) {
                        /*不冒泡*/
                        e.stopPropagation();
  
                    });
                    

                    /*如果有fun的话，加keydown事件*/
                    var fun2 = tmpCtrl.data("fun");
                    if (typeof fun2 != "undefined") {

                        tmpCtrl.keyup(function (e) {
                            /*不冒泡*/
                            e.stopPropagation();
                            var ctrl = $(this);
                            /*判断有没有计算公式*/
                            var funs = ctrl.data("fun");
                            if (typeof funs != "undefined") {

                                try {
                                    //拆分 = ，左面的是要赋值的控件ID，右面是计算公式
                                    var gongshi = funs.split('=');
                                    //找到赋值控件
                                    var setValueId = gongshi[0].replace(/ /g, "").replace("#", "#ctrl_");
                                    var setValueCtrl = $(setValueId, thisTr);

                                    //处理公式
                                    var str = gongshi[1];
                                    var reg = /#[0-9]+/ig; // 创建正则表达式模式。
                                    var r = str.match(reg); // 尝试去匹配搜索字符串。 
                                     
                                    for (var key in r) {
                                        var tmpId = r[key].replace(/ /g, "").replace("#", "#ctrl_");
                                        var tmpValue = $(tmpId, thisTr).val();
                                        
                                        if (tmpValue.replace(/ /g, "") === "") {
                                            str = "";
                                            return false;
                                        }
                                        
                                        if (tmpValue != tmpValue * 1) {
                                            alert("请输入数字！");
                                            str = "";
                                            return false;
                                        }
                                        str = str.replace(r[key], tmpValue);
                                    }  
                                    
                                    var reVal = eval("(" + str + ")");
                                    
                                    setValueCtrl.val(reVal);

                                } catch(e) {
                                    _alert(funs);
                                }
                            }
                        });
                    }

                    /*td里的文本，变控件*/
                    $(this).html(tmpCtrl);
                }
                index++;
            }
        });

    });

};


/*保存按钮，设置单击事件*/
Nature.Controls.GridForm.prototype.setSave = function () {
    var self = this;

    self.gridFormInfo.btnSave.unbind("click");
    
    self.gridFormInfo.btnSave.click(function (e) { /*保存操作*/
        /*不冒泡*/
        e.stopPropagation();
        self.gridFormInfo.win.isEditing = false;

        /*去掉操作按钮*/
        self.gridFormInfo.selectTr.find("#opeater").children().remove();

        /*去掉td里的控件*/
        /*遍历选中行的td*/
        var tds = self.gridFormInfo.selectTr.find("td");

        tds.each(function () {
            var tmpTd = $(this);
            if (this.id != "tdCheck") { /*td里不是复选框*/
                var colId = this.id.replace("td", ""); /*字段ID*/

                /*在表单控件里寻找对应的控件，然后移除*/
                var tmpCtrl = tmpTd.find("#ctrl_" + colId);
                if (tmpCtrl.length > 0) {
                    var newValue = tmpCtrl.val();
                    $("#divForm #ctrl_" + colId, self.gridFormInfo.doc).val(newValue);
                    /*恢复td的原来的值*/
                    tmpTd.html(newValue);

                    tmpCtrl.remove();
                }

            }
        });

        self.gridFormInfo.form.formEvent.urlPara.DataId = self.gridFormInfo.dataSource[self.gridFormInfo.rowIndex]._id;
        self.gridFormInfo.updateDataId = self.gridFormInfo.dataSource[self.gridFormInfo.rowIndex]._id;
        self.gridFormInfo.saveData(function (kind, id) {
            //保存结
            alert(kind);
            //myClear();
            self.gridFormInfo.reloadData();
            window.setTimeout(function() {
                self.gridFormInfo.dataSource = self.gridFormInfo.pagerList.grid.gridEvent.dataSet.data;

            },500);
        });
        
    });
};

/*取消按钮，设置单击事件*/
Nature.Controls.GridForm.prototype.setEsc = function() {
    var self = this;

    self.gridFormInfo.btnEsc.click(function (e) { /*取消操作*/
        /*不冒泡*/
        e.stopPropagation();
        self.gridFormInfo.win.isEditing = false;

        /*去掉操作按钮*/
        self.gridFormInfo.selectTr.find("#opeater").children().remove();

        /*去掉td里的控件*/
        /*遍历选中行的td*/
        var tds = self.gridFormInfo.selectTr.find("td");

        tds.each(function() {
            var tmpTd = $(this);
            if (this.id != "tdCheck") { /*td里不是复选框*/
                var colId = this.id.replace("td", ""); /*字段ID*/

                /*在表单控件里寻找对应的控件，然后移除*/
                tmpTd.find("#ctrl_" + colId).remove();

                /*恢复td的原来的值*/
                tmpTd.html(self.gridFormInfo.dataSource[self.gridFormInfo.rowIndex][colId]);

            }
        });
        
        self.gridFormInfo.reloadData();

    });
};

/*设置表单控件的属性*/
Nature.Controls.GridForm.prototype.bindForm = function() {
    var self = this;

    //创建表单
    
    var formEvent = {
        urlPara: {
            moduleID: self.gridFormInfo.moduleID,
            masterPageViewID: self.gridFormInfo.gridFormViewID,
            findPageViewID: 0,//
            buttonId: self.gridFormInfo.urlPara.buttonId,
            dataID: 0,
            foreignID: "-2",
        }, 
        dataBaseId: self.gridFormInfo.dataBaseId,

        control: $("#divForm", self.gridFormInfo.doc),
      
        window: self.gridFormInfo.win,
        isBatch:true,

        callback: function (formState) {
            switch (formState) {
                case 401:
                    //查看
                    //$("#BtnSave").hide();
                    //$("#BtnSave2").hide();
                    break;
                case 402:
                    //添加
                    $("#BtnSave").show();
                    $("#BtnSave2").show();
                    break;
                case 403:
                case 408:
                    //修改
                    $("#BtnSave").val("保存并更新").show();
                    $("#BtnSave2").hide();
                    break;

            }
        }   //回调函数
    };

    self.gridFormInfo.form = new Nature.Controls.Form(formEvent);
    self.gridFormInfo.form.create();
    
};

  