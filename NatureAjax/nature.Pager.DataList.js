

//列表页面的辅助设置
Nature.Pager.DataList = function(win, dbid) {

    var dataId = -2;
    
    this.btnBar = {}; //按钮组
    this.find = {}; //查询控件
    this.grid = {}; //表格控件
    this.pagerTurn = {}; //分页控件
    this.dataSource = {}; //加载分页数据

    this.cmdInfo = {}; //根据URL参数生成url的参数信息

    this.dbid = "";
    
    var self = this;

    this.ListLoad = function (callback) {
        self.callback = callback;
        
        //alert("js加载完毕，可以进行后续操作");
        if (typeof top != "undefined")
            top.spinStart();

        this.cmdInfo = new Nature.CommandInfo(win); //根据URL参数生成url的参数信息
        this.cmdInfo.dataBaseId = dbid;
        this.dbid = dbid;
        
        self.btnBar = createButtonBar(); //创建按钮
        self.find = createFind(); //创建查询
        self.grid = createTableHead(); //创建表格（只有表头，没有数据）

        //数据信息
        var dataInfo = jQuery.extend(true, {}, self.cmdInfo);
        self.dataSource = new Nature.Controls.DataSource(dataInfo);

        self.pagerTurn = createPager(); //分页控件

        //注册分页的键盘事件
        var keys = [33, 34, 36, 35, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        var onKey = new Nature.ShortcutKey();
        onKey.reg(keys, self.pagerTurn.onKeyBefore, undefined, win.document);

        self.btnBar.Create(); //开始创建按钮

        regEvent(); //注册事件
        regLevel(); //注册层级关系


        //=========================函数实现部分=========================
        //创建按钮

        function createButtonBar() {
            var btnInfo = jQuery.extend(true, {}, self.cmdInfo);
            btnInfo.divID = $("#divButton", win.document);
            btnInfo.callback = buttonCallback;
            btnInfo.openWeb = openWeb;
            btnInfo.onSearch = openSearch;
            btnInfo.onDelete = onDelete;
            btnInfo.onOutput = onOutput;

            return new Nature.Controls.ButtonBar(btnInfo);
        }

        //创建查询
        function createFind() {
            var findEvent = jQuery.extend(true, {}, self.cmdInfo);
            findEvent.control = $("#divSearch", win.document);
            findEvent.floatControl = $("#divFloatSearch", win.document); //存放浮动查询的div
            findEvent.pageSearchClick = onSearch; //外部的查询事件
            findEvent.callback = findCallback; //回调函数

            return new Nature.Controls.Find(findEvent);
        }

        //创建表格（只有表头，没有数据）
        function createTableHead() {
            var gridEvent = jQuery.extend(true, {}, self.cmdInfo);
            gridEvent.control = $("#divDataList", win.document);
            gridEvent.btnControl = $("#divButton", win.document);
            gridEvent.callback = gridCallback;
            return new Nature.Controls.Grid(gridEvent);
        }

        //分页控件
        function createPager() {
            var pagerEvent = {
                divID: ["divQuickPage", "divQuickPage1"],
                control: [$("#divQuickPage", win.document), $("#divQuickPage1", win.document)],
                //加载状态开始
                spinStart: top.spinStart,
                //加载状态结束
                spinStop: top.spinStop,
                onPagerTurn: function(newIndex, oldIndex) {
                    top.spinStart();
                    //alert(oldIndex);
                    PagerTurn(newIndex);
                }
            };
            return new Nature.Controls.QuickPager(pagerEvent);
        }

        //注册在top里注册iframe
        function regPagerList() {
            var key = self.cmdInfo.urlPara.moduleID + "_";
            if (typeof(self.cmdInfo.urlPara.buttonId) == "undefined") {
                //tab自带的列表，用模块ID作为标识
                top.Pagers[key] = {
                    doc: self.cmdInfo.win.document,
                    kind: "tab",    //在标签里
                    parentId: "0",
                    sonIds: []
                };
            } else {
                //列表页打开的列表，用按钮ID作为标识
                key += self.cmdInfo.urlPara.buttonId;
                top.Pagers[key] = {
                    doc: self.cmdInfo.win.document,
                    kind: "div",    //在打开的div（窗口里）
                    sonIds: []
                };
            }
            
            //注册事件，便于其他窗口的访问
            top.Pagers[key].events = {
                LoadFirst: self.listLoadFirst,  //重新加载第一页
                LoadThis: self.listLoadThis,    //重新加载当前页
                CloseSon: self.listCloseSon,    //关闭子页
                reload: self.reload                 //菜单栏单击事件，页面重置
            };
            
            //如果是子窗口，要向父窗口注册自己

        }
        
        //注册事件
        function regEvent() {
            if (typeof (self.cmdInfo.urlPara.buttonId) == "undefined") {
                //tab自带的列表，用模块ID作为标识
                top.mainEvent.divEvent["btn" + self.cmdInfo.urlPara.moduleID] = {
                    "listLoadFirst": self.listLoadFirst,
                    "listLoadThis": self.listLoadThis,
                    "listCloseSon": self.listCloseSon,
                    doc: self.cmdInfo.win.document,
                    reload: self.reload
                };
            } else {
                //列表页打开的列表，用按钮ID作为标识
                top.mainEvent.divEvent["btn" + self.cmdInfo.urlPara.buttonId] = {
                    "listLoadFirst": self.listLoadFirst,
                    "listLoadThis": self.listLoadThis,
                    "listCloseSon": self.listCloseSon,
                    doc: document
                };
            }
        }

        //注册层级关系

        function regLevel() {
            if (typeof (self.cmdInfo.urlPara.buttonId) == "undefined") {
                //tab自带的列表，不处理
            } else {
                //列表页打开的列表
                if (typeof (top.mainEvent.tab["tab" + self.cmdInfo.urlPara.ppvid]) != "undefined") {
                    //第一层
                    top.mainEvent.tabDiv["btn" + self.cmdInfo.urlPara.buttonId] = {
                        "parentIdPath": [self.cmdInfo.urlPara.ppvid],
                        "sonId": []
                    };

                } else {
                    //大于第一层
                    //父节点
                    var parentPv = top.mainEvent.tabDiv["btn" + self.cmdInfo.urlPara.ppvid];

                    if (typeof parentPv != "undefined") {
                        var tmpPath = parentPv.parentIdPath.concat();
                        tmpPath.push(self.cmdInfo.urlPara.ppvid);

                        //创建本节点，并且设置父节点路径
                        top.mainEvent.tabDiv["btn" + self.cmdInfo.urlPara.buttonId] = {
                            "parentIdPath": tmpPath,
                            "sonId": []
                        };
                    }
                }
            }
        }


        //按钮创建完毕，创建查询

        function buttonCallback() {
            self.find.Create();

        }

        //查询创建完毕，创建表格

        function findCallback() {
            self.grid.CreateTable();

        }


        //加载Grid之后的函数
        //表格绘制完毕（只有标头没有数据），创建分页控件（加载分页模板）

      
    };

    function gridCallback() {
        top.spinStart();

        //查看url参数，是否指定查询条件
        var urlQuery = self.cmdInfo.urlPara.query;
        var urlQuerys;

        if (typeof urlQuery != "undefined") {

            urlQuery = urlQuery.replace(/:/g, "\":\"");
            //urlQuery = urlQuery.replace(/,/g, "\",\"");
            urlQuery = urlQuery.replace(/{date}/g, "" + new Date().format("yyyy-MM-dd") + "");
            urlQuery = urlQuery.replace(/{datetime}/g, "" + new Date().format("yyyy-MM-dd HH:mm") + "");

            urlQuerys = eval("({\"" + urlQuery + "\"})");

        }

        //获取第一页的记录集（ajax获取数据）
        if (typeof (aQuery) == "undefined")
            if (typeof urlQuerys == "undefined") {
                loadPagerData(1, undefined);
            } else {
                loadPagerData(1, { formValue: urlQuerys });
            }
        else {
            //进行替换
            for (var key in aQuery) {
                switch (aQuery[key]) {
                    case "{date}":
                        aQuery[key] = new Date().format("yyyy-MM-dd");
                        break;
                    case "{datetime}":
                        aQuery[key] = new Date().format("yyyy-MM-dd HH:mm");
                        break;
                    default:
                }
            }
            var tmpQuery = {
                formValue: aQuery
            };
            loadPagerData(1, tmpQuery);
        }
    }


    function loadPagerData(pageIndex, query) {
        self.dataSource.LoadData(pageIndex, query, function (reDataSource) {
            //第一次加载页面，清空总记录数
            var rdKey = "RecordCount_" + self.cmdInfo.urlPara.moduleID + '_' + self.cmdInfo.urlPara.masterPageViewID + '_' + self.cmdInfo.urlPara.findPageViewID;
            top.__cache[rdKey] = "0";

            //加载分页UI的模板
            self.pagerTurn.LoadPagerTemplate(function () {
                //重新绘制分页UI
                self.pagerTurn.setPagerUI(reDataSource.pageTurn, function () {
                    //绑定表格（显示数据）
                    self.grid.DataBind(reDataSource, function () {
                        if (typeof (top) != "undefined")
                            top.spinStop();

                        $("#divMain", win.document).fadeIn("normal", function () {
                            top.spinStop();
                        });

                        if (typeof self.callback == "function") {

                            self.callback();
                        }


                    });
                });

            });
        });
    }


    function PagerTurn(pageIndex, query) {
        if (typeof top.window.isEditing != "undefined") {
            if (top.window.isEditing == true) {
                alert("正在修改数据，不能翻页。请先保存数据，或者取消修改！");
                return;
            }
        }

        top.spinStart();
        self.dataSource.LoadData(pageIndex, query, function (reDataSource) {
            //重新绘制分页UI
            self.pagerTurn.setPagerUI(reDataSource.pageTurn, function () {
                //绑定表格（显示数据）
                self.grid.DataBind(reDataSource, function () {
                    if (typeof (top) != "undefined")
                        top.spinStop();

                    //判断是否导出excel
                    if (isExcel == true) {

                        //导出excel状态
                        var pagerIndex = self.pagerTurn.getPagerInfo.thisPageIndex;
                        var pagerCount = outputExcel.info.pagerNoEnd;

                        outputExcel.inputExcelData(pagerIndex);

                        if (pagerIndex < pagerCount) {
                            PagerTurn(pagerIndex + 1); //翻到下一页
                        } else {
                            //这是最后一页，把状态改回来
                            isExcel = false;
                            //保存
                            outputExcel.saveExcel("excel.xls");

                            //翻到第一页
                            PagerTurn(1);
                        }
                    }

                    if (typeof self.callback == "function") {

                        self.callback();
                    }
                     
                });
            });
        });
    }


    this.listLoadFirst = function() {
        //alert("loadFirst");
        PagerTurn(1, undefined);
    };

    this.listLoadThis = function() {
        //alert("loadThis");
        PagerTurn(self.pagerTurn.getPageIndex(), undefined);

    };

    this.listCloseSon = function() {
        //alert("closeSon");
    };

    this.reload = function(moduleId) {
        win.document.location.reload();
        //去掉tab打开的窗口
        if (typeof(top.mainEvent.tab["tab" + moduleId]) != "undefined") {
            var tabSonDiv = top.mainEvent.tab["tab" + moduleId].btnIDs;
            for (var key in tabSonDiv) {
                if (tabSonDiv[key] == 1) {
                    $("#" + key, parent.document).remove();
                }
            }
        }
    };


    function openWeb(btnInfo) {

        dataId = self.grid.getSelectDataID();
        
        var frid = "";
        var frids = "";
        var urlParam = self.cmdInfo.urlPara;
        var ids = self.grid.getDataIds();

        //判断其他外键
        if (typeof (urlParam.dataID) == "undefined") {
            //第一个列表页面的情况
            frid = dataId;
            frids = dataId;
        } else {
            //不是第一个页面
            frid = dataId;
            frids = urlParam.foreignIDs.replace(/"/g, "") + "," + (dataId + "\"").replace(/"/g, "");
        }

        //alert(frids);

        if (btnInfo.BtnTypeID == 411) {
            window.open(btnInfo.URL + "?id=" + dataId);
        } else {
            top.IndexOpenWeb(btnInfo, dataId, frid, frids, ids);
        }
        return;

    }

    function openSearch() {
        var divSearch = $("#divFloatSearch", win.document);
        if (divSearch[0].style.display == "none") {
            var zIndex = $.getDivIndexHighest(undefined, win.document);
            divSearch.css("z-index", zIndex + 1).show();
            var off1 = { top: 50, left: 100 };
            divSearch.offset(off1);

            var winHeight = $(window).height();

            var height = divSearch.find("#tblFind").height() + 80;
            if (height > winHeight - 60) height = winHeight - 62;

            divSearch.height(height + "px");


        } else
            divSearch.hide();
    }

    function onSearch(query) {
        //开始查询
        //alert(query.formName);
        switch (query.formName) {
        case "dataForm1":
            break;
        case "dataForm2":
            //高级查询，设置快速查询
            var colIds = "";
            for (var key in query.formValue) {
                var tmpValue = query.formValue[key];
                if (tmpValue.length > 0 && tmpValue != "-99999" && tmpValue != "`") {
                    var id = key.substring(1, key.length);
                    colIds += "{\"id\":\"" + id + "\",\"val\":\"" + $("#divFloatSearchDetail #ctrl_" + id, win.document).val() + "\"},";
                }
            }

            if (colIds.length > 0) {
                colIds = colIds.substring(0, colIds.length - 1);
                var tmp = eval("([" + colIds + "])");
                self.find.QuickFind(tmp);
            }
            break;
        }

        //调用分页控件，提交表单
        PagerTurn(1, query);
        //隐藏高级查询
        $("#divFloatSearch", win.document).hide();
    }

    function onDelete(btnInfo) {
        if (confirm('您确定要删除吗？')) {
            dataId = self.grid.getSelectDataID();

            Nature.Page.DeleteData.del(btnInfo, dataId, self.dbid , function (msg) {
                if (msg.msg == "") {
                    //删除成功
                    //alert("删除成功!");
                    self.listLoadThis();
                    btnBar.resetButtonState();
                } else {
                    //删除不成功
                    alert(msg.msg);
                }
            });
        }
    }

    var girdTable;

    var outputExcel;
    var isExcel = false;

    function onOutput(btnInfo) {
        //alert("导出");
        var info = btnInfo.data; //模块ID、视图ID等

        //设置状态
        isExcel = true;
        var excelTip = $("#excelText", win.document);
        if (excelTip.length == 0) {
            excelTip = $("<span id=\"excelText\"></span>");
            $("#divQuickPage", win.document).after(excelTip);
        }

        outputExcel = new Nature.Control.OutputExcel(window);
        outputExcel.info.gridTable = $("#divDataList", win.document);
        outputExcel.info.pagerNoEnd = self.pagerTurn.getPagerInfo.lastPageno;
        outputExcel.info.hideDiv.push($("#divQuickPage,#divQuickPage1,#divHead,#divLeft,#divMid", win.document));
        outputExcel.init();

        if (self.pagerTurn.getPagerInfo.lastPageno > 1) {
            //翻到第一页
            PagerTurn(1);
        } else {
            //这是最后一页，把状态改回来
            isExcel = false;
            outputExcel.inputExcelData(1);
            outputExcel.saveExcel("excel.xls");
        }

    }


    /*分页的压力测试
    startNo：开始页号,
    endNo：结束页号,
    userCount：测试人数
    */

    function StressTestPagerTurn(startNo, endNo, testCount, userCount) {

        if (typeof testCount == "undefined")
            testCount = 10;

        if (typeof userCount == "undefined")
            userCount = 1;

        top.st = {
            testCount: testCount,   /*每人访问次数*/
            userCount: userCount,   /*模拟人数*/
            browerMS: 0,            /*浏览器端总共用时*/
            serverMS: 0,            /*浏览器端总共用时*/
            mini: 99999,            /*单次访问服务器端的最少用时*/
            max: 0,                 /*单次访问服务器端的最大用时*/
            startTime: new Date(),  /*测试开始时间*/
            endTime: new Date(),    /*测试结束时间*/
            sendCount: 0,           /*发送总次数*/
            errorCount: 0,          /*出错的次数*/
            successCount: 0         /*成功的次数*/
        };

        var alreadyTestCount = [];

        for (var i = 0; i < userCount; i++) {
            alreadyTestCount.push(testCount);
            load(i, startNo);
        }

        function load(userIndex, pageIndex) {
            self.dataSource.LoadData(pageIndex, undefined, function (reDataSource) {
                // 
                alreadyTestCount[userIndex]--;
                if (alreadyTestCount[userIndex] > 0) {
                    var pageNo = pageIndex + 1;
                    if (pageNo > endNo) pageNo = startNo;
                    load(userIndex, pageNo);
                } else {
                    end();
                }

            });
        }

        function end() {
            top.st.endTime = new Date();
            top.st.browerMS = top.st.endTime - top.st.startTime;

            top.DebugSet({
                Title: "[压力测试]" + "",
                UserId: -9,
                StartTime: top.st.startTime.format("yyyy-MM-dd hh:mm:ss"),
                UseTime: "0毫秒",
                Url: "",
                Detail: [
                    { Title: "模拟人数", UseTime: top.st.userCount + "人" },
                    { Title: "每人访问", UseTime: top.st.testCount + "次" },
                    { Title: "开始时间", UseTime: top.st.startTime.format("yyyy-MM-dd hh:mm:ss") },
                    { Title: "结束时间", UseTime: top.st.endTime.format("yyyy-MM-dd hh:mm:ss") },
                    { Title: "客户端总用时", UseTime: Nature.numFormat(top.st.browerMS, 0, 3) + "毫秒" },
                    { Title: "服务器总用时", UseTime: Nature.numFormat(top.st.serverMS, 0, 3) + "毫秒" },
                    { Title: "总计访问", UseTime: Nature.numFormat(top.st.sendCount, 0, 4) + "次" },
                    { Title: "成功次数", UseTime: Nature.numFormat(top.st.successCount, 0, 4) + "次" },
                    { Title: "失败次数", UseTime: Nature.numFormat(top.st.errorCount, 0, 4) + "次" },
                    { Title: "最少用时", UseTime: Nature.numFormat(top.st.mini, 0, 4) + " 毫秒" },
                    { Title: "最大用时", UseTime: Nature.numFormat(top.st.max, 0, 4) + " 毫秒" },
                    { Title: "平均用时", UseTime: Nature.numFormat((top.st.serverMS / top.st.sendCount), 4, 4) + "毫秒/次" },
                    { Title: "每秒人次", UseTime: Nature.numFormat((top.st.sendCount * 1000 / top.st.serverMS), 4, 4) + "  次/秒" }
                ]
            });

        }

    }

};