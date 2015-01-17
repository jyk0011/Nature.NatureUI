/*
* 创建查询控件
* table 实现查询的功能 
* 快速查询和高级查询。
* 快速查询：在列表页面里显示常用（高级查询里使用）的查询条件，当离开焦点、changed事件后立即查询数据
* 高级查询：打开div，显示所有查询条件，选择多个查询条件，然后单击查询按钮开始查询。并且把当前查询条件设置到快速查询里面
*/

Nature.Controls.Find = function (fEvent) {

    //按钮的事件和属性
    var findEvent = fEvent;
     
    //{
    //    control: $("#divSearch"),              //存放常用查询条件的div
    //    floatControl: $("#divFloatSearch"),    //存放浮动查询的div
    //    window: window,

    //    moduleID:"",                    //对应的模块ID
    //    masterPageViewID: "",           //主页面视图ID
    //    findPageViewID: "",             //查询视图ID

    findEvent.baseControlFindAll = {};         //创建全部查询条件
    findEvent.baseControlQuick = {};           //创建快速查询条件
    findEvent.ctrlJsonMeta = {};               //查询控件的配置信息

    findEvent.findKeys = [];                   /*查询条件的key的数组*/
        
    //    callback: function () { },
    //    pageSearchClick: function () { alert("外部的查询事件"); } //外部的查询事件
        
    //};

    var urlPara = fEvent.urlPara;
    
    //页面控件的共用事件和属性
    //var commandControlInfo = {
    //    onTimeOut: function () { alert("没有设置超时事件"); },
    //    dataBaseId:""
    //};
    
    var load = new Nature.Data.Cache();
    
    //设置按钮的事件和属性
    var init = function () {
         
        findEvent.kind = "find";
        findEvent.baseControlFindAll = new Nature.Controls.BaseControl(findEvent);
        findEvent.baseControlQuick = new Nature.Controls.BaseControl(findEvent);

        //注册快捷键
        //Nature.ShortcutKey.reg(70, function(keyCode) {
        //    //打开查询div,临时处理
        //    var ff = $("#btn_SearchMore");
        //    if (ff.length > 0) {
        //        ff.click();
        //    }
           
        //});

    };

    //初始化
    init();

    var self = this;
    

    //加载元数据
    var loadData = function () {
        //到父页面的缓存里查找，是否有缓存。有缓存直接用。
        load.ajaxGetMeta({
            urlPara: {
                action: "find",
                mdid: urlPara.moduleID,
                mpvid: urlPara.masterPageViewID,
                fpvid: urlPara.findPageViewID,
                dbid: findEvent.dataBaseId,
                cacheKey: urlPara.findPageViewID
            },
            title: "查询控件元数据",
            success: function (info) {
                findEvent.ctrlJsonMeta = info;
                createForm();

                var colKeys = [];
                
                /*获取前四个查询条件，作为默认查询条件*/
                var i = 0;
                for (i = 0; i < self.findKeys.length;i++) {
                    colKeys.push({
                        id: self.findKeys[i].toString(),
                        val: ""
                    });
                    if (i>3) break;
                }
                self.QuickFind(colKeys);
            }
        });
    };

    //创建查询用的表单
    this.Create = function () {
        //加载元数据，并且创建查询控件
        loadData();
       
    },

    //清空查询条件
    this.Clear = function () {
        for (var i = 0; i < findEvent.ctrlJsonMeta.controlInfokeys.length; i++) {
            var key = findEvent.ctrlJsonMeta.controlInfokeys[i];
            var ctrl = findEvent.ctrlJsonMeta.controlInfo[key];
            if (ctrl.IsClear) {
                $("#ctrl_" + ctrl.ColumnID).val("");
            }
        }

    },

    //获取查询条件
    this.GetValue = function (ctrl,formName) {
        return getValue(ctrl, formName);
    },

    //创建快速查询
    this.QuickFind = function (colKeys) {
        var controlInfo = findEvent.ctrlJsonMeta.controlInfo;
        var controlExtend = findEvent.ctrlJsonMeta.controlExtend;
        var table = $("<table id=\"tblFindQuick\"  class=\"sortable\">");

        var colCount = findEvent.ctrlJsonMeta.columnCount;
        
        /*根据屏幕宽度计算*/
        var pmWidth = $(findEvent.win).width();
        var tdWidth = 230;
        colCount = Math.floor(pmWidth / tdWidth);
        
        for (var i = 0; i < colKeys.length; i++) {
            var tr = $("<tr>");
            table.append(tr);
            for (var j = 0; j < colCount; j++) {
                if (i == colKeys.length) break;
                
                var tmpId = colKeys[i].id;
                if (tmpId.substring(tmpId.length - 2, tmpId.length) == "_2") {
                    //范围查询，第二个值的控件
                    tmpCtrl.change(function () {
                        var query = getValue( findEvent.control,"dataForm1");
                        findEvent.pageSearchClick(query);
                    });
                    
                    i++;
                    continue;
                }

                var crlInfo = controlInfo[tmpId];
                var title = crlInfo.ColTitle.length == 0 ? crlInfo.ColName : crlInfo.ColTitle;
                $("<td>").css("text-align", "right").html(title + "：").appendTo(tr);

                if (typeof (controlExtend[tmpId]) != "undefined") {
                    //日期控件，调整参数
                    if (controlInfo[tmpId].ControlTypeID == 204) {
                        if (typeof controlExtend[tmpId].my97 != "undefined")
                            if (controlExtend[tmpId].my97.indexOf("HH:mm") >0 )
                                controlExtend[tmpId].my97 = "";
                    }
                    
                    var tmpCtrl = findEvent.baseControlQuick.create(crlInfo, controlExtend[tmpId], findEvent.dataBaseId, findEvent.win, urlPara.moduleID);
                    switch (tmpCtrl[0].type) {
                        case "select-one":
                            switch (controlInfo[tmpId].ControlTypeID) {
                                case 252:/*联动列表框，不加自动查询事件*/
                                    var oldChange = findEvent.win.oldChange;
                                    if (typeof oldChange == "undefined")
                                        oldChange = findEvent.win.oldChange = tmpCtrl[0].change;

                                    tmpCtrl.change({ oldChange: oldChange }, function (info) {
                                        var oldChg = info.data.oldChange;
                                        if (typeof oldChg == "function") oldChg();

                                        var query = getValue(findEvent.control, "dataForm1");
                                        findEvent.pageSearchClick(query);
                                    });
                                    break;
                                default:
                                    tmpCtrl.change(function () {
                                        var query = getValue(findEvent.control, "dataForm1");
                                        findEvent.pageSearchClick(query);
                                    });
                                    break;
                            }
                            
                            break;
                        default:
                            switch (controlInfo[tmpId].ControlTypeID) {
                                case 204:/*日期控件，使用change事件*/
                                    tmpCtrl.change(function () {
                                        var query = getValue(findEvent.control, "dataForm1");
                                        findEvent.pageSearchClick(query);
                                    });
                                    break;
                                default:/*一般的文本框，失去焦点的时候自动查询*/
                                    tmpCtrl.blur(function() {
                                        var query = getValue(findEvent.control, "dataForm1");
                                        findEvent.pageSearchClick(query);
                                    });
                                    break;
                            }
                            break;
                    }

                    tmpCtrl.val(colKeys[i].val);

                    var tdCol = $("<td>").html(tmpCtrl);

                    //
                    var findKind = controlInfo[tmpId].Ser_FindKindID * 1;
                    if (findKind >= 2101 && findKind <= 2105) {
                        tdCol.append(" 至 ");
                        var tmpExtend = controlExtend[tmpId];
                        var tmpcrlInfo = crlInfo;
                        tmpcrlInfo.ColumnID = tmpcrlInfo.ColumnID + "_2";
                        var tmpKey2 = findEvent.baseControlFindAll.create(crlInfo, tmpExtend, findEvent.dataBaseId, findEvent.win, urlPara.moduleID);
                        tdCol.append(tmpKey2);
                        tmpcrlInfo.ColumnID = tmpcrlInfo.ColumnID.replace("_2", "");
                        
                        tmpKey2.val(colKeys[i].val);

                    }
                    tr.append(tdCol);

                    var tdspan = crlInfo.TDColspan;
                    if (tdspan > 1) {
                        //一个字段占多列
                        tdCol.attr("colspan", tdspan);
                        j += (tdspan - 1) / 2;
                    }
                }
                i++;
                if (i >= colKeys.length)
                    break;
            } i--;
        }

        findEvent.control.find("#divSearchDetail").html(table);
    };

    var createForm = function () {
        var winHeight = $(findEvent.win).height();
        var winWidth = $(findEvent.win).width();

        var width = 1400;

        if (width > winWidth - 20) width = winWidth - 100;
        
        var controlInfo = findEvent.ctrlJsonMeta.controlInfo;
        var controlExtend = findEvent.ctrlJsonMeta.controlExtend;
        var table = $("<table id=\"tblFind\"  class=\"table_default2\">");

        //var key = ctrlJsonMeta.controlInfokeys;
        var key = Nature.CommonFunction.GetPermissionKey(findEvent.ctrlJsonMeta.controlInfokeys, findEvent.ctrlJsonMeta.colRole);
        self.findKeys = key;
        
        var colCount = findEvent.ctrlJsonMeta.columnCount;

        /*根据屏幕宽度计算*/
        var pmWidth = width;
        var tdWidth = 300;
        colCount = Math.floor(pmWidth / tdWidth);
        
        for (var i = 0; i < key.length; i++) {
            var tr = $("<tr>");
            table.append(tr);
            for (var j = 0; j < colCount; j++) {
                var crlInfo = controlInfo[key[i]];
                var title = crlInfo.ColTitle.length == 0 ? crlInfo.ColName : crlInfo.ColTitle;
                $("<td>").attr("align", "right").css("text-align", "right").html(title + "：").appendTo(tr);

                if (typeof (controlExtend[key[i]]) != "undefined") {
                    switch (crlInfo.ControlTypeID) {
                        case 202: //多行
                        case 203: //密码
                        case 205: //上传文件
                        case 206: //上传图片
                        //case 207: //选择
                        case 208: //在线编辑器
                            crlInfo.ControlTypeID = 201;
                            break;
                        case 253: //单选组变成下拉列表框
                            crlInfo.ControlTypeID = 250;
                            break;
                    }

                    var tmpCtrl = findEvent.baseControlFindAll.create(crlInfo, controlExtend[key[i]], findEvent.dataBaseId, findEvent.win, urlPara.moduleID);
                    tmpCtrl.mousedown(function(e) {
                        //事件不冒泡
                        e.stopPropagation();
                    });
                    
                    var tdCol = $("<td>").html(tmpCtrl).appendTo(tr);

                    var tdspan = crlInfo.TDColspan;
                    if (tdspan > 1) {
                        //一个字段占多列
                        tdCol.attr("colspan", tdspan);
                        j += (tdspan - 1) / 2;
                    } //Ser_FindKindID

                    var findKind = controlInfo[key[i]].Ser_FindKindID * 1;
                    if (findKind >= 2101 && findKind <= 2105) {
                        tdCol.append(" 至 ");
                        var tmpExtend = controlExtend[key[i]];
                        var tmpcrlInfo = crlInfo;
                        tmpcrlInfo.ColumnID = tmpcrlInfo.ColumnID + "_2";
                        tdCol.append(findEvent.baseControlFindAll.create(crlInfo, tmpExtend, findEvent.dataBaseId, findEvent.win, urlPara.moduleID));
                        tmpcrlInfo.ColumnID = tmpcrlInfo.ColumnID.replace("_2", "");
                    }

                }

                i++;
                if (i >= key.length)
                    break;
            } i--;
        }

        var btn = $("<input id=\"btn_SearchSuper\" type=\"button\" class=\"input_01\" value=\"查询\">");
        btn.click(function () {
            var query = getValue(findEvent.floatControl,"dataForm2");
            findEvent.pageSearchClick(query);
        });

        findEvent.floatControl.find("#divFloatSearchDetail").append(table);
        findEvent.floatControl.find("#btnFind").append(btn);

        var btn2 = $("<input id=\"btn_SearchSimple\" type=\"button\" class=\"input_01\" value=\"快速查询\">");
        btn2.click(function () {
            var query = getValue(findEvent.control, "dataForm1");
            findEvent.pageSearchClick(query);
        });

        findEvent.control.find("#divSearchBtn").append(btn2);

        /* 高级查询，暂时不在这里用了。*/
        //打开、关闭高级查询div
        var btn3 = $("<input id=\"btn_SearchMore\" type=\"button\" class=\"input_01\" value=\"高级查询\">");
        btn3.click(function () {
            if (findEvent.floatControl[0].style.display == "none") {
                //var off1 = btn3.offset(); //{ top: 0, left: 0 };
                //off1.top += 30;
                //findEvent.floatControl.offset(off1);
                var zIndex = $.getDivIndexHighest(undefined,findEvent.win.document);
                findEvent.floatControl.css("z-index", zIndex + 1).show();
            } else
                findEvent.floatControl.hide();
        });

        findEvent.control.find("#divSearchBtn").append(btn3);
        
        var height = table.height() + 50;
        if (height > winHeight - 60) height = winHeight - 62;

        findEvent.floatControl.width(width + "px").height(height + "px");

        //创建完毕，执行回调函数
        findEvent.callback();
        
    }; //end create

    var getValue = function (ctrl,formName) {
        var dataResult = ctrl.find("#" + formName).serialize();
        //alert(dataResult);
        var tmp = dataResult.replace(/&/g, "\",");
        tmp = tmp.replace(/=/g, ":\"");
        if (tmp.length > 0) tmp += "\"";
        tmp = "{\"formName\":\"" + formName + "\",\"formValue\":{" + tmp + "}}";
        var jsonValue = eval("(" + tmp + ")");
        //alert(jsonValue);

        var tmpValue = jsonValue.formValue;
        for (var key in tmpValue) {
            if (key.substring(key.length - 2, key.length) == "_2") {
                tmpValue[key.substring(0, key.length - 2)] += "`" + tmpValue[key];
            }
        }
        return jsonValue;
    };
};

