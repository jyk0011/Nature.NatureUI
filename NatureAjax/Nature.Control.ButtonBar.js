/*
* 创建操作按钮
* 创建添加、修改、删除等操作按钮，添加按钮js事件，添加按钮css
* 换一种写法，结构更合理一些，一个页面可以添加多个控件。
* 2013-5-6
*/

Nature.Controls.ButtonBar = function (btnEvent) {
    //按钮的事件和属性
    var buttonEvent = btnEvent;
    
    //页面控件的共用事件和属性
    //var commandControlInfo = {
    //    onTimeOut: function () { alert("没有设置超时事件"); },
    //    dataBaseId:""
    //};

    if (typeof buttonEvent.onTimeOut != "function")
        buttonEvent.onTimeOut =
            function() { alert("没有设置超时事件"); };


    var load = new Nature.Data.Cache();
    
    //按钮的配置信息
    var buttonMetaInfo = {};

    //对外接口
    this.Create = function () {
        //加载元数据，然后创建按钮
        loadData();
    };

    //翻页后重新设置按钮是否可用
    this.resetButtonState = function () {
        //$("#" + buttonEvent.divID + " .input_01").each(function () {
        buttonEvent.divID.find(".input_01").each(function () {
                var id = this.id.replace("btn", "");
            var btn = $(this);
            if (typeof (buttonMetaInfo[id]) != "undefined") {
                if (buttonMetaInfo[id].IsNeedSelect == true) {
                    btn.removeClass("input_01").addClass("btn_disabled");
                    this.disabled = "disabled";
                }
            }
        });
    };
   
    //加载元数据
    function loadData() {
        
        //到父页面的缓存里查找，是否有缓存。有缓存直接用。
        //获取按钮元数据
        load.ajaxGetMeta({
            urlPara: {
                action: "button",
                mdid: buttonEvent.urlPara.moduleID,
                dbid: buttonEvent.dataBaseId,
                cacheKey: buttonEvent.urlPara.moduleID
            },
            title: "按钮信息",
            success: function (info) {
                buttonMetaInfo = info.data;
                createButton(info);
            }
        });
        
    };

    function createButton(info) {
        //按钮的json格式，点“.”可以出提示
        var button = {
            "-20002": {
                "ButtonID": -20002,     /*按钮编号*/
                "ModuleID": -200,       /*模块编号*/
                "OpenModuleID": -200,   /*单击按钮打开的模块编号*/
                "OpenPageViewID": -20004, /*单击按钮打开的列表视图编号*/
                "FindPageViewID": 0,    /*单击按钮打开的查询视图编号*/
                "BtnTitle": "添加角色", /*按钮的名称*/
                "BtnTypeID": 402,       /*按钮类型：添加、修改、删除等*/
                "BtnKind": 1,           /*按钮形式：按钮*/
                "URL": "\/CommonPage\/DataForm.aspx", /*打开的页面*/
                "WebWidth": 700,        /*打开div的宽度*/
                "WebHeight": 500,       /*打开div的高度*/
                "IsNeedSelect": false   /*是否需要先选择记录*/
            }
        };

        button = info.data;

        var onKey = new Nature.ShortcutKey();

        if (button.length == 0) {
            //页面里没有按钮，调用回调函数
            buttonEvent.callBack();
            return;
        }

        var key = Nature.CommonFunction.GetPermissionKey2(info.datakeys, info.buttonRole);

        var buttonTemplet = "<input type='button' id='btn{id}' value='{BtnTitle}' class='{cssbtn}' {CanUse} title=\"{title}\" btnType=\"{btnType}\" />";
        var tmp = "";

        for (var i = 0; i < key.length; i++) {
            var tmpBtn = button[key[i]];
            if (typeof tmpBtn != "undefined") {

                tmp = buttonTemplet.replace(/\{id\}/g, tmpBtn.ButtonID);
                tmp = tmp.replace(/\{BtnTitle\}/g, tmpBtn.BtnTitle);
                tmp = tmp.replace(/\{btnType\}/g, "t" + tmpBtn.BtnTypeID);

                if (tmpBtn.IsNeedSelect) {
                    //需要选择记录，设置为不可用 btnEnable
                    tmp = tmp.replace(/\{CanUse\}/g, "disabled=\"disabled\" ");
                    tmp = tmp.replace(/\{title\}/g, "请先选择记录，然后再单击按钮。");
                    tmp = tmp.replace(/\{cssbtn\}/g, "btn_disabled");
                } else {
                    tmp = tmp.replace(/\{CanUse\}/g, "");
                    tmp = tmp.replace(/\{title\}/g, "");
                    tmp = tmp.replace(/\{cssbtn\}/g, "input_01");
                }

                var tmpButton = $(tmp);

                var btnValue = tmpButton.val();
                var btnValues = btnValue.split('_');

                //添加是否需要选择记录的标记，翻页后重置按钮状态
                //需要选择记录，设置为不可用 btnEnable
                tmpButton.data("IsNeedSelect", tmpBtn.IsNeedSelect);

                //按钮的单击事件
                switch (tmpBtn.BtnTypeID) {
                case 401:
                //查看数据
                case 402:
                //添加数据
                case 403:
                //修改数据
                case 408:
                    //如果没有数据，则先添加一条空数据，然后修改数据
                        //tmpButton.click(tmpBtn, openWeb);
                    if (typeof(buttonEvent.urlPara.buttonId) == "undefined")
                        tmpBtn.parentPVid = buttonEvent.urlPara.moduleID;
                    else
                        tmpBtn.parentPVid = buttonEvent.urlPara.buttonId;

                    tmpButton.click(
                        { btnInfo: tmpBtn, onClick: buttonEvent.openWeb },
                        function(eventInfo) {
                            Nature.CommonFunction.isTimeOut(function(infos) {
                                if (infos.state == "1") {
                                    var tmpBtnInfo = eventInfo.data.btnInfo;
                                    eventInfo.data.onClick(tmpBtnInfo);
                                    //注册tab的信息
                                    var tmpTab = parent.mainEvent.tab["tab" + tmpBtnInfo.ModuleID];
                                    if (typeof(tmpTab) != "undefined") {
                                        //tab里的列表
                                        tmpTab.btnIDs["div_Mod_" + tmpBtnInfo.ButtonID] = 1;
                                    } else {
                                        //打开的列表，寻找父节点路径
                                        var parentPv = parent.mainEvent.tabDiv["btn" + tmpBtnInfo.parentPVid];

                                        //设置tab的 btnIDs 
                                        //parent.mainEvent.tab["tab" + parentPv.parentIdPath[0]].btnIDs["div_Mod_" + tmpBtnInfo.ButtonID] = 1;

                                    }

                                } else
                                    buttonEvent.onTimeOut();
                            });
                        });

                    /*设置按钮的快捷键*/
                    if (btnValues.length > 1) {
                        tmpButton.val(btnValues[0] + "(" + btnValues[1] + ")");
                        onKey.reg(btnValues[1].toLocaleUpperCase().charCodeAt(), buttonEvent.openWeb, tmpBtn, buttonEvent.win.document);
                    }

                    break;
                case 404:
                //物理删除数据
                case 412:
                    //逻辑删除数据
                    tmpButton.click(
                        { btnInfo: tmpBtn, onClick: buttonEvent.onDelete },
                        function(eventInfo) {
                            Nature.CommonFunction.isTimeOut(function(infos) {
                                if (infos.state == "1")
                                    eventInfo.data.onClick(eventInfo.data.btnInfo);
                                else
                                    buttonEvent.onTimeOut();
                            });
                        });
                    break;
                case 405:
                    //打开查询界面 
                        //tmpButton.hide();
                    tmpButton.click(
                        { btnInfo: tmpBtn, onClick: buttonEvent.onSearch },
                        function(eventInfo) {
                            eventInfo.data.onClick(eventInfo.data.btnInfo);
                        });

                    /*设置按钮的快捷键*/
                    if (btnValues.length > 1) {
                        tmpButton.val(btnValues[0] + "(" + btnValues[1] + ")");
                        onKey.reg(btnValues[1].toLocaleUpperCase().charCodeAt(), buttonEvent.onSearch, tmpBtn, buttonEvent.win.document);
                    }

                    break;
                case 406:
                //导出到Excel
                case 407:
                    //导出到Access
                        //tmpButton.click(tmpBtn, onOutput);
                    tmpButton.click(
                        { btnInfo: tmpBtn, onClick: buttonEvent.onOutput },
                        function(eventInfo) {
                            Nature.CommonFunction.isTimeOut(function(infos) {
                                if (infos.state == "1")
                                    eventInfo.data.onClick(eventInfo.data.btnInfo);
                                else
                                    buttonEvent.onTimeOut();
                            });
                        });
                    break;
                case 411:
                    //超链接
                        //tmpButton.click(tmpBtn, btnOpenWeb);
                    tmpButton.click(
                        { btnInfo: tmpBtn, onClick: buttonEvent.openWeb },
                        function(eventInfo) {
                            Nature.CommonFunction.isTimeOut(function(infos) {
                                if (infos.state == "1") {
                                    var tmpBtnInfo = eventInfo.data.btnInfo;
                                    eventInfo.data.onClick(tmpBtnInfo);

                                } else
                                    buttonEvent.onTimeOut();
                            });
                        });
                    break;
                }

                //判断类型
                switch (tmpBtn.BtnKind) {
                case 1:
                    //按钮
                    break;
                case 2:
                    //连接
                    break;
                case 3:
                    //隐藏不显示
                    tmpButton.hide();
                    break;
                }
                //$("#" + buttonEvent.divID).append(tmpButton);
                buttonEvent.divID.append(tmpButton);
            }


        }

        //创建完毕，执行回调函数
        if (typeof buttonEvent.callback == "function")  buttonEvent.callback();
    };

    
};
    
