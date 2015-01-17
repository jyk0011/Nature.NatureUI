/*
* 在网页里动态创建控件的插件。
* 根据json格式的控件属性，创建文本框、下拉列表框等控件
*  

*/

//控件描述信息的格式

var controlInfo = {
    "ColumnID": 1000020,
    "ColTitle": "父级ID",
    "ColHelp": "",
    "HelpStation": 1,
    "DefaultValue": "",
    "ControlState": 1,
    "Ser_FindKindID": 2001,
    "IsClear":true ,
    "ControlTypeID": 250

};
var controlExtend = {
//文本框
    maxlen: 20,
    size: 100,

    //多行文本框
    rows: 5,
    cols: 50,
    //日期控件
    my97: { dateFmt: 'yyyy-MM-dd HH:mm' },
    
    //列表框
    itemSize:4, //下拉框的选项显示的数量
    itemRows:4, //radioBox、checkbox 选项的列数
    item:
        [{ val: 1, txt: "选项一" },
         { val: 2, txt: "选项二" }]
};


Nature.Controls.BaseControl = function (cmdInfo) {

    var baseInfo = {
        unionList: {}
    };
    
    //页面控件的共用事件和属性
    var commandControlInfo = {
        kind:"form",            /*form：表单；find：查询*/
        onTimeOut: function () {   },
        dataBaseId:""
    };

    //设置按钮的事件和属性
    var init = function () {
        if (typeof (cmdInfo.onTimeOut) != "undefined") commandControlInfo.onTimeOut = cmdInfo.onTimeOut;
        if (typeof (cmdInfo.dataBaseId) != "undefined") commandControlInfo.dataBaseId = cmdInfo.dataBaseId;
        if (typeof (cmdInfo.kind) != "undefined") commandControlInfo.kind = cmdInfo.kind;

        baseInfo.kind = commandControlInfo.kind;
        
    };

    var self = this;
    
    //初始化
    init();

    this.create = function (controlInfo, controlExtend,dbid,win,buttonId,isBatch) {
        //根据属性，调用函数，创建控件
        //var a = this["ctl" + controlInfo.ControlTypeID](controlInfo, controlExtend, commandControlInfo);
        //return Nature.Control.ctl250();

        var newCtrl = {} ;// eval("ctl" + controlInfo.ControlTypeID + "()");

        var isCheck = true;
        
        switch (parseInt(controlInfo.ControlTypeID)) {
            case 201://单行文本框
                newCtrl = self.SingleLineTextBox(controlInfo, controlExtend, isBatch); break;
            case 202://多行文本、文本域
                newCtrl = self.MultiLineTextBox(controlInfo, controlExtend, isBatch); break;
            case 203://密码框
                newCtrl = self.PasswordTextBox(controlInfo, controlExtend); break;
            case 204://日期选择
                newCtrl = self.DateTimeTextBox(controlInfo, controlExtend, win, buttonId); break;
            case 205://上传文件
                newCtrl = self.UploadFile(controlInfo, controlExtend, win.document); break;
            case 206://上传图片
                newCtrl = self.UploadImage(controlInfo, controlExtend, commandControlInfo, win.document); break;
            case 207://弹窗选择记录
                newCtrl = self.ChangeDataId(controlInfo, controlExtend, commandControlInfo, win.document); break;
            case 208://在线编辑器
                newCtrl = self.MultiLineTextBox(controlInfo, controlExtend, isBatch); break;
            case 250://下拉列表框
                newCtrl = self.DropDownList(controlInfo, controlExtend, cmdInfo); break;
            case 251://登录人，暂时不用了。
                newCtrl = self.DropDownList(controlInfo, controlExtend); break;
            case 252://联动
                newCtrl = self.UList(controlInfo, controlExtend,baseInfo, cmdInfo); break;
            case 253://单选组
                newCtrl = self.RadioBoxList(controlInfo, controlExtend, setCheck, cmdInfo); break;
            case 254://多选组
                newCtrl = self.CheckBoxList(controlInfo, controlExtend, setCheck, cmdInfo); break;
            case 255://复选
                newCtrl = self.CheckBox(controlInfo, controlExtend, setCheck, cmdInfo); break;
            case 256://列表框
                newCtrl = self.ListBox(controlInfo, controlExtend); break;
           
        }

        if (isCheck)
            //加验证信息
            setCheck(newCtrl, controlInfo);

        //加扩展信息里的fun
        if (typeof controlExtend.fun != "undefined") {
            newCtrl.data("fun", controlExtend.fun);
        }
        return newCtrl;
           
         
        function setCheck(dom, ctrlInfo) {
            //验证信息
            var jdom = dom;
            switch (ctrlInfo.CheckTypeID) {
                case 101: //不验证
                    break;
                case 102: //自然数
                    jdom.attr("check", "^[0-9]+$");
                    break;
                case 103: //整数
                    jdom.attr("check", "^[-\\+]?\\d+$");
                    break;
                case 104: //小数
                    jdom.attr("check", "^[-\\+]?\\d+(\\.\\d+)?$");
                    break;
                case 105: //日期
                    jdom.attr("check", "^d{4}-d{1,2}-d{1,2}$");
                    break;
                case 106: //必填
                    jdom.attr("check", ".+");
                    break;

            }

            jdom.attr("warning", controlInfo.CheckTip);

            if (controlInfo.CheckUserDefined != "") {
                //自定义验证
                jdom.attr("check", controlInfo.CheckUserDefined);
            }
        }

    };
    
    //获取指定的联动列表框
    this.getUnionList = function(flag) {
        return baseInfo.unionList[flag];
    };
};