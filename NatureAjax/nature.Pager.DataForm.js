


//表单页面的辅助设置
Nature.Pager.DataForm = function(win, dbid) {

    var dataId = -2;
  
    var para;
    var control;

    this.form = {}; //表单控件
    this.dataSource = {}; //数据访问，提取数据和保存数据
     
    var self = this;

    this.FormLoad = function(callback) {
        self.callback = callback;

        self.cmdInfo = new Nature.CommandInfo(win); //根据URL参数生成url的参数信息
        self.cmdInfo.dataBaseId = dbid;

        para = self.cmdInfo.urlPara;

        //创建数据访问
        self.dataSource = new Nature.Controls.DataSource({});

        //创建表单
        var formEvent = self.cmdInfo;

        formEvent.control = $("#divForm", win.document);
        formEvent.urlPara = para; 
        formEvent.callback = formCallback; //回调函数
        formEvent.KindEditor = win.KindEditor,

        top.spinStart();

        self.form = new Nature.Controls.Form(formEvent );
        self.form.create();

         
        regEvent(); //注册事件
        regLevel(); //注册层级关系

        win.myClose = this.myClose;

        //注册事件
        function regEvent() {
            if (typeof (self.cmdInfo.urlPara.buttonId) == "undefined") {
                //tab自带的列表，用模块ID作为标识
                top.mainEvent.divEvent["btn" + self.cmdInfo.urlPara.moduleID] = {
                    "listLoadFirst": function () {    },
                    "listLoadThis": function () { },
                    "listCloseSon": function () { },
                    doc: self.cmdInfo.win.document,
                    reload: function () { }
                };
            } else {
                //列表页打开的列表，用按钮ID作为标识
                top.mainEvent.divEvent["btn" + self.cmdInfo.urlPara.buttonId] = {
                    "listLoadFirst": function () { },
                    "listLoadThis": function () { },
                    "listCloseSon": function () { },
                    doc: self.cmdInfo.win.document
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

    };

    function formCallback(formState) {
        var myDoc = self.cmdInfo.win.document;
        
        switch (formState) {
            case 401:
                //查看
                $("#BtnSave",myDoc).hide();
                $("#BtnSave2",myDoc).hide();
                break;
            case 402:
                //添加
                $("#BtnSave",myDoc).show();
                $("#BtnSave2",myDoc).show();
                break;
            case 403:
            case 408:
                //修改
                $("#BtnSave", myDoc).val("保存并更新").show();
                $("#BtnSave2", myDoc).hide();
                break;
            case -99:
                formLoadThisPage();
                //修改
                break;
        }

        $("#divFormMain", myDoc).fadeIn("normal", function () {
            top.spinStop();
        });
        
        top.spinStop();
        
        if (typeof self.callback == "function") {
            self.callback();
        }
        
    }

    this.myClear = function() {
        self.form.clear();
    };

    this.myClose = function() {
        top.formClose(para.buttonId);
    };

    //重新加载第一页的数据

    this.formLoadFirst = function() {
        var tmpEvent = top.mainEvent.divEvent["btn" + para.ppvid];
        tmpEvent.listLoadFirst();
    };

    //重新加载当前页的数据

    this.formLoadThis = function() {
        var tmpEvent = top.mainEvent.divEvent["btn" + para.ppvid];
        tmpEvent.listLoadThis();
    };

}