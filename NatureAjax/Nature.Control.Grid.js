 /*
* 创建数据列表，
* table 

*/

//moduleId, mpvid, fpvid, url
//绑定数据
//var dataSource = {
//    "getTime": "2012-10-11 10:41:45",
//    "useTime": "获取页面视图：1.29100毫秒，获取字段ID和字段名称：0.41390毫秒，拼接分页SQL：0.05060毫秒，统计总记录数：0.19460毫秒，获取记录：0.42070毫秒",
//    "data": [{ "1000010": 1, "1000060": "系统管理", "1000090": "#", "1000116": "", "1000117": "", "1000120": 0, "1000130": false, "1000140": 10000 },
//             { "1000010": 103, "1000060": "　　资源角色里的用户", "1000090": "\/CommonPage\/DataList.aspx", "1000116": "", "1000117": "", "1000120": 0, "1000130": false, "1000140": 10016 }
//    ]
//};


Nature.Controls.Grid = function (gEvent) {


    //gird的事件和属性
    var gridEvent = gEvent;
    //{
    gridEvent.selectDataID =  -2;
    gridEvent.selectDataIDs = "";
    //    window: window,
    //    control: $("#divDataList"),              //存放表格控件的div
    //    btnControl: $("#divButton"),
    //    divID: "divDataList",     //存放表格控件的div
    gridEvent.table = "";                //表格
    //    moduleID: "",              //对应的模块ID
    //    masterPageViewID: "",     //主页面视图ID

    gridEvent.gridMeta = {}; //表格控件的配置信息
    gridEvent.dataSet = {};    //数据源和附带信息，data：数据源
    gridEvent.isUseCheck = false; /*是否使用复选框*/
        
    //    //选中的记录ID集合
    gridEvent.DataIdarr = [];
    gridEvent.DataIds = "";

    gridEvent.myself = {};
    //    callback: function () { }

    //};

    this.gridEvent = gridEvent;

    var urlPara = gEvent.urlPara;
    var self = this;


    //页面控件的共用事件和属性
    //var commandControlInfo = {
    //    onTimeOut: function () { alert("没有设置超时事件"); },
    //    dataBaseId: ""
    //};

    var load = new Nature.Data.Cache();
     
  
    //加载元数据
    var loadData = function () {
        //到父页面的缓存里查找，是否有缓存。有缓存直接用。

        load.ajaxGetMeta({
            urlPara: {
                action: "grid",
                mdid: urlPara.moduleID,
                mpvid: urlPara.masterPageViewID,
                dbid: gridEvent.dataBaseId,
                cacheKey: urlPara.masterPageViewID
            },
            title: "数据列表元数据",
            success: function (info) {
                gridEvent.gridMeta = info;
                if (info.err != undefined)
                    alert(info.err);
                else
                    createGrid();
            }
        });
    };



    //初始化，函数入口
    this.CreateTable = function () {
        //加载元数据，并且创建表格控件
        loadData();

    };

    //获取选择的记录ID
    this.getSelectDataID = function () {
        return gridEvent.selectDataID;
    };


    //获取复选框选择的记录ID集合
    this.getDataIds = function () {
        return gridEvent.DataIds;
    };
    this.dataIdArr = function () {
        return gridEvent.DataIdarr;
    };

    //把数据变成table的形式
    this.DataBind = function (dataSet, callback) {
        //获取字段的替换json
        bind(dataSet, callback);
    };

    //单击复选框的事件
    this.checkClick = function (me) {
        //记录表格里面选中的复选框对应的ID
        var index = 0;
        gridEvent.DataIds = "";
        gridEvent.DataIdarr = [];
        gridEvent.control.find("input[type='checkbox']").each(function () {
            //alert(this.id);
            var ids = this.id.split("_");
            if (ids[0] == "chk") {
                if (this.checked) {
                    var tmpId = ids[2];
                    gridEvent.DataIdarr[index++] = tmpId;
                    gridEvent.DataIds += tmpId + ",";
                }
            }
        });

        if (gridEvent.DataIds.length > 1)
            gridEvent.DataIds = gridEvent.DataIds.substring(0, gridEvent.DataIds.length - 1);
        //alert(gridEvent.DataIds);
    };

    var checkClick = this.checkClick;
    
    //创建表格，也就是创建<table>
    var createGrid = function () {

        gridEvent.table = $("<table id='grid' rules='all' class='table_default1' >");
        var tr = "<tr ID='tr0'>{th}</tr>";

        //把table添加到页面里
        gridEvent.control.append(gridEvent.table);

        var tmpTr;
        var tmpTh = "";
        var key = Nature.CommonFunction.GetPermissionKey(gridEvent.gridMeta.datakeys, gridEvent.gridMeta.colRole);

        var viewExtends = gridEvent.gridMeta.ViewExtend;

        var viewExtend ;

        try {
            viewExtend = eval("(" + viewExtends + ")");
        
        } catch(e) {
           viewExtend = {};
        }

        if (typeof viewExtend.isUseCheck != "undefined")
            gridEvent.isUseCheck = viewExtend.isUseCheck;
  
        
        /*判断是否显示复选框*/
        if (gridEvent.isUseCheck)
            tmpTh = "<th style=\"text-align:center;\" width=\"40px\"><input type=\"checkbox\" id=\"chk_0_" + gridEvent.divID + "\" name=\"n{ID}\" ></th>";

        for (var i = 0; i < key.length; i++) {
            var colMeta = gridEvent.gridMeta.data[key[i]];
            if (colMeta.ColWidth == 0) {
                tmpTh += "<th>";
            } else {
                tmpTh += "<th width=\"" + colMeta.ColWidth + "px\">";
            }

            var title = colMeta.ColTitle.length == 0 ? colMeta.ColName : colMeta.ColTitle;
            tmpTh += title + "</th>";
        }
        tmpTr = tr.replace(/\{th\}/g, tmpTh);

        gridEvent.table.append(tmpTr);

        //给表头里的复选框加事件
        if (gridEvent.isUseCheck)
            gridEvent.control.find("#chk_0_" + gridEvent.divID ).click(function (e1) {
                e1.stopPropagation();
                var isChecked = this.checked;
                gridEvent.control.find("input[id^='chk_" + gridEvent.divID + "']").each(function () {
                    this.checked = isChecked;
                });

            });

        if (typeof (gridEvent.callback) != "undefined")
            gridEvent.callback();


    };

    //绑定数据
    function bind(dataSet, callback) {
        
        var divMain = $("#divMain", gridEvent.win.document);
        
        var trData = "<tr ID='tr{dataID}' index=\"{index}\" >{td}</tr>";

        //$("#grid .css_tr_c1,#grid .css_tr_c2,#grid .css_tr_CK").remove();
        gridEvent.table.find("tr").each(function (index) {
            if (index != 0) {
                $(this).remove();
            }
        });

        var tmpTr;
        var tmpTd = "";
        var key = Nature.CommonFunction.GetPermissionKey(gridEvent.gridMeta.datakeys, gridEvent.gridMeta.colRole);

        var chk = " <input type=\"checkbox\" id=\"chk_" + gridEvent.divID + "_{ID}\" name=\"n" + gridEvent.divID + "\" > ";

        //记录需要替换的数字标记的列
        var jsonNumCol = {};

        var dataSource = dataSet.data;

        gridEvent.dataSet = dataSet;
        
        if (typeof (dataSource) == "undefined") {
            alert("没有找到数据！");
            return;
        }
        for (var j = 0; j < dataSource.length; j++) {
            tmpTd = "";

            var dataRow = dataSource[j];

            if (gridEvent.isUseCheck)
                tmpTd = "<td id=\"tdCheck\" style=\"text-align:center;\">" + chk.replace(/{ID}/g, dataRow._id) + "</td>";
            
            for (var i = 0; i < key.length; i++) {
                var gridMeta = gridEvent.gridMeta.data[key[i]];
                var tdText = dataRow[key[i]];
                
                //格式化
                var format = gridMeta.Format;
                if (format != "")
                    tdText = self.formatGrid(format, tdText, jsonNumCol, dataRow, i);
                if (typeof (tdText) == "undefined" || tdText == "undefined") tdText = "";


                if (tdText === "") {
                    tdText = "&nbsp;";
                } else {
                   
                    //max，截取字符串，
                    var max = gridMeta.MaxLength;
                    if (max != 0) {
                        if (tdText.length > max) {
                            tdText = "<span title='" + tdText + "'>" + tdText.substring(0, max) + "…</span>";
                        }
                    }
                }
                
                //设置宽度
                var tdWidth = "";
                if (gridMeta.ColWidth != 0) {
                    tdWidth = " width=\"" + gridMeta.ColWidth + "px\"";
                }

                //对齐方式
                tmpTd += "<td id=\"td" + gridMeta.ColumnID + "\" style=\"text-align:" + gridMeta.ColAlign + ";\" " + tdWidth + ">" + tdText + "</td>";

            }
            tmpTr = trData.replace(/\{td\}/g, tmpTd);

            tmpTr = tmpTr.replace(/\{dataID\}/g, dataRow._id);
            tmpTr = tmpTr.replace(/\{index\}/g, j);
 

            tmpTr = $(tmpTr);

            //设置tr的事件
            tmpTr.click({ id: dataRow._id }, function (data) {
                if (typeof gridEvent.win.isEditing != "undefined") {
                    if (gridEvent.win.isEditing == true) {
                        if (data.data.id != gridEvent.win.editDataId)
                        {
                            alert("正在修改数据，不能更改选中行。请先保存数据，或者取消修改！");
                            return;
                        }
                    }
                }
                self.trClick(this, data.data.id);
            });
            tmpTr.dblclick({ ctrl: self.gridEvent.btnControl }, function (data) {
                if (typeof gridEvent.win.isEditing != "undefined") {
                    if (gridEvent.win.isEditing == true) {
                        alert("正在修改数据，不能打开窗口。请先保存数据，或者取消修改！");
                        return;
                    }
                }
                
                self.dblClick(data.data.ctrl);
            });

            gridEvent.table.append(tmpTr);

            //加复选框的单击事件
            gridEvent.control.find("input[type='checkbox']").click({ checkClick: checkClick }, function (eventInfo) {
                eventInfo.data.checkClick(this);
                //eventInfo.stopPropagation();
            });

        }

        //定义一个数组
        var arrNumCol = [];
        
        //表格显示完毕，修改数字标记，根据json变成文字
        for (var jKey in jsonNumCol) {
            //记录到数组，便于递归
            arrNumCol.push(jsonNumCol[jKey]);
           
        }
        
        //开始递归
        digui(0,function() {

            //设置表格css
            self.setTableCss(gridEvent.control);

            //$("#divMain").slideDown("normal");

            divMain.show(); //"normal"

            //开始锁定
            self.lock();

             
            if (typeof (callback) != "undefined")
                callback();
        });
        

        //实现递归
        function digui(index,callbackDiGui) {

            if (index >= arrNumCol.length) {
                callbackDiGui();
                return;
            }

            var info = arrNumCol[index];
            
            //判断是客户数据还是元数据
            if (typeof info.para.metaKind != "undefined")
                meta(info, function () {
                    digui(index + 1, callbackDiGui);
                });
            else
                cus(info,function() {
                    digui(index + 1, callbackDiGui);
                });
        }
        //递归结束
        
        //元数据 
        function meta(info, callbackMeta) {
            //加载数据   
            Nature.Controls.Grid.loadMetaJson(info, self.gridEvent, function (data, jsonNumColInfo) {

                var module = data.Module;
                var view = data.PageView;
                var button = data.Button;
                var table = data.Table;

                var colIndex = jsonNumColInfo.colIndex;

                var fm = jsonNumColInfo.para;

                /*判断第一行是否是复选框*/
                var chkFrist = gridEvent.table.find("tr").find("input[type='checkbox']");
                if (chkFrist.length > 0)
                    colIndex += 1;

                var rowIndex = 0; //行数

                //遍历列，修改数据显示
                gridEvent.table.find("tr").each(function() {
                    $(this).find("td:eq(" + colIndex + ")").each(function() {

                        //循环table的列
                        var keyNum = $(this).html();

                        var isChange = false;

                        var defKey = jsonNumColInfo.para.defKey;
                        var defValue = jsonNumColInfo.para.defValue;
                        var isShowFlag = jsonNumColInfo.para.isShowFlag;
                        var metaId = keyNum;

                        if (typeof(defKey) != "undefined") {
                            if (typeof(defValue) != "undefined") {
                                if (defKey == keyNum) {
                                    $(this).html(defValue);
                                    isChange = true;
                                }
                            }
                        }

                        if (isChange == false) {
                            var tt = "";
                            switch (fm.metaKind) {
                            //模块
                            case 1:
                                if (typeof module[metaId] != "undefined") tt = module[metaId].ModuleName;
                                break;
                            //视图
                            case 2:
                                if (typeof module[metaId] != "undefined") tt = view[metaId].PVTitle;
                                break;
                            //按钮
                            case 3:
                                if (typeof module[metaId] != "undefined") tt = button[metaId].BtnTitle;
                                break;
                            //表
                            case 4:
                                if (typeof module[metaId] != "undefined") tt = table[metaId].TableName;
                                break;
                            }

                            if (typeof(isShowFlag) == "undefined" || isShowFlag == "") {
                                $(this).html(tt);
                            } else {
                                $(this).html(keyNum + isShowFlag + tt);
                            }
                        }

                        rowIndex++;
                    });
                });

                callbackMeta();
            });
        }

        //客户数据
        function cus(info , callbackCus) {

            //加载数据  //加载数字标记对应的汉字显示
            Nature.Controls.Grid.loadFormatJson(info, self.gridEvent, function (data, jsonNumColInfo) {

                var isCheck = 0;
                var colIndex = jsonNumColInfo.colIndex;

                /*判断第一行是否是复选框*/
                var chkFrist = gridEvent.table.find("tr").find("input[type='checkbox']");
                if (chkFrist.length > 0) {
                    colIndex += 1;
                    isCheck = 1;
                }
                var rowIndex = 0; //行数

                //遍历列，修改数据显示
                gridEvent.table.find("tr").each(function() {
                    $(this).find("td:eq(" + colIndex + ")").each(function() {
                        //循环table的列
                        var keyNum = $(this).html();
                        var isChange = false;

                        var defKey = jsonNumColInfo.para.defKey;
                        var defValue = jsonNumColInfo.para.defValue;
                        var isShowFlag = jsonNumColInfo.para.isShowFlag;
                        var colId = jsonNumColInfo.para.colID;
                        var colOther = jsonNumColInfo.colOther;

                        if (typeof(defKey) != "undefined") {
                            if (typeof(defValue) != "undefined") {
                                if (defKey == keyNum) {
                                    $(this).html(defValue);
                                    isChange = true;
                                }
                            }
                        }

                        if (isChange == false) {
                            var myData = data;
                            if (typeof(myData) != "undefined") {

                                var tt = "";
                                if (typeof(myData[keyNum]) != "undefined") {
                                    if (typeof(myData[keyNum][colId]) != "undefined") {

                                        tt = myData[keyNum][colId];
                                        if (typeof(isShowFlag) == "undefined" || isShowFlag == "") {
                                            $(this).html(tt);
                                        } else {
                                            $(this).html(keyNum + isShowFlag + tt);
                                        }

                                        //遍历扩展字段
                                        if (typeof(colOther) != "undefined") {
                                            for (var otherKey in colOther) {
                                                var tmpData = myData[keyNum][colOther[otherKey]];
                                                gridEvent.table.find("tr").eq(rowIndex).find("td").eq(parseInt(otherKey) + isCheck).html(tmpData);

                                            }
                                        }
                                    }
                                }

                            }
                        }
                    });

                    rowIndex++;
                });
                 
                callbackCus();
            });
        }

         
        
    }
    

    this.lock = function () {
        var lockInfo = gridEvent.gridMeta;
        if (lockInfo.LockColumns + lockInfo.LockRows > 0)
            gridEvent.table.lock({ tableWidth: lockInfo.TableWidth, window: gridEvent.win});
          
    };

};
