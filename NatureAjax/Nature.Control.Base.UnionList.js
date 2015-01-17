/*
* n级联动列表框
* n级的，
* 各种列表框，比如下来的，列表的，单选组，多选组等。
* 
*/

Nature.Controls.BaseControl.prototype.UnionList = function (ulEvent) {
    //联动列表框的默认事件和默认属性
    var lstEvent = {
        lstIds: [],     //联动下拉列表的id集合，数组形式
        lstObjects: [],  //对象的列表框集合
        list: {},//列表框集合
        ajaxPara: [{}],        //提取json用的参数
        
        //列表框的change事件。
        //selectValue：列表框选择的值，
        //lst：下一个列表框的对象，
        //ajaxPara：调用下一个列表框需要的参数
        //callback：回调函数，触发列表框的change事件，也可以直接写lst.change();
        lstChange: function (selectValue, lst,ajaxPara, callback) { } //任意一个下拉列表的option变化时触发的事件

    };

    //item的change事件
    var lstChange = function () {
        //alert(this.type);
        var listId = this.id;                  //触发change的listID
        
        //触发change的列表框对象
        var thisList = lstEvent.list[listId];  
        
        //记录选项
        var selectedValue = $(this).val();
        thisList.selectedValue = selectedValue;

        //判断是不是最后一个列表框
        if (typeof (thisList.nextList) == "undefined") {
            //最后一个列表框，结束
            return;
        }

        //不是最后一个列表框，触发change事件，联动下一个列表框
        //下一个列表框
        var nextList = thisList.nextList;        
        var nextListId = nextList[0].id;
        var ajaxPara = lstEvent.list[nextListId].ajaxPara;
       
        //清空选项
        nextList[0].options.length = 0;
        
        if (typeof (lstEvent.list[nextListId].setValue) != "undefined") {
            //有预设选项
            nextList.setValue = lstEvent.list[nextListId].setValue;
            //避免影响正常联动
            lstEvent.list[nextListId].setValue = undefined;

        }

        //选择的值、下一个列表框对象、ajaxPara
        lstEvent.lstChange(selectedValue, nextList, ajaxPara, function (lst) {
            //绑定了下一个列表框，触发change
            lst.change();
        });

    };
    
    //根据id集合初始化列表框
    var setListByIds = function() {

        for (var i = 0; i < lstEvent.lstIds.length; i++) {
            // 
            var tmpId = lstEvent.lstIds[i];
            //创建列表框
            if (typeof (lstEvent.list[tmpId]) == "undefined") {

                var tmp = $("#" + tmpId);
                lstEvent.list[tmpId] = {
                    index: i,               //数组的下标
                    thisList:tmp,           //当前列表框
                    selectedValue: 0,      //选择的值
                    setValue: undefined,    //预设的选项，undefined 表示没有预设值
                    valueArray: [],         //如果是多选的话，值记在这里
                    cache: {},              //缓存
                    ajaxPara: {}            //请求json的参数
                };

                //下一个列表框
                if (i < lstEvent.lstIds.length - 1) {
                    lstEvent.list[tmpId].nextList = $("#" + lstEvent.lstIds[i + 1]);
                }

                //参数
                if (typeof lstEvent.ajaxPara != "undefined")  
                    if (typeof lstEvent.ajaxPara[i] != "undefined")  
                        lstEvent.list[tmpId].ajaxPara = lstEvent.ajaxPara[i];
                    
                //加事件
                tmp.change(lstChange);
            }
        }
    };
    
    //根据 opbject 初始化列表框
    var setListByObjects = function () {

        for (var i = 0; i < lstEvent.lstObjects.length; i++) {
            // 
            var tmpLst = lstEvent.lstObjects[i];
            var tmpId = tmpLst.attr("id");
            //创建列表框
            if (typeof (lstEvent.list[tmpId]) == "undefined") {
                lstEvent.list[tmpId] = {
                    index: i,               //数组的下标
                    thisList: tmpLst,           //当前列表框
                    selectedValue: 0,      //选择的值
                    setValue: undefined,    //预设的选项，undefined 表示没有预设值
                    valueArray: [],         //如果是多选的话，值记在这里
                    cache: {},              //缓存
                    ajaxPara: {}            //请求json的参数
                };
    
                //记录下一个列表框
                if (i < lstEvent.lstObjects.length - 1) {
                    lstEvent.list[tmpId].nextList = lstEvent.lstObjects[i + 1];
                }

                //参数
                if (typeof lstEvent.ajaxPara != "undefined")  
                    if (typeof lstEvent.ajaxPara[i] != "undefined") 
                        lstEvent.list[tmpId].ajaxPara = lstEvent.ajaxPara[i];
                     
                //加事件
                tmpLst.change(lstChange);
            }
        }
    };
    
    //设置列表框
    var setList = function() {
        if (lstEvent.lstIds.length > 0) setListByIds();
        if (lstEvent.lstObjects.length > 0) setListByObjects();
       
    };
    
    //设置按钮的事件和属性
    var init = function () {
        if (typeof (ulEvent.lstIds) != "undefined") lstEvent.lstIds = ulEvent.lstIds;
        if (typeof (ulEvent.lstObjects) != "undefined") lstEvent.lstObjects = ulEvent.lstObjects;
        if (typeof (ulEvent.lstChange) != "undefined") lstEvent.lstChange = ulEvent.lstChange;
        if (typeof (ulEvent.ajaxPara) != "undefined") lstEvent.ajaxPara = ulEvent.ajaxPara;

        //使用id集合，设置idIndex 和 list。
        setList();
        
    };

    //初始化
    init();

    //加入一个新的列表框，排在最后联动
    this.addListById = function(lstId) {
        //最后一个列表框的下一个列表框
        lstEvent.list[lstEvent.lstIds.length - 1].nextList = $("#" + lstId);
        //追加
        lstEvent.lstIds.push(lstId);
        //设置属性
        setListByIds();
    };

    //加入一个新的列表框，排在最后联动
    this.addListByObject = function (lst, ajaxPara) {
        var lastId = lstEvent.lstObjects[lstEvent.lstObjects.length - 1].attr("id");
        //最后一个列表框的下一个列表框
        lstEvent.list[lastId].nextList = lst;
        //追加
        lstEvent.lstObjects.push(lst);
        lstEvent.ajaxPara.push(ajaxPara);
        //设置属性
        setListByObjects();
    };

    //设置预设选项
    this.setValue = function(lstId,value) {
        lstEvent.list[lstId].setValue = value;
    };
    
    //获取选择的选项的id值
    this.getValue = function (keyName) {
        if (typeof keyName == "undefined") keyName = "name";
        var vv = {};
        
        for(var key in lstEvent.list) {
            var lst = lstEvent.list[key];
            vv[lst.thisList.attr(keyName)] = lst.selectedValue;
        }

        return vv;
    };
    
    //获取指定的列表框
    this.getListById = function(id) {
        return lstEvent.list[id].thisList;
    };
    
    //获取第一个列表框
    this.getFristList = function () {
        for (var key in lstEvent.list) {
            var lst = lstEvent.list[key];
            return lst.thisList;
        }
         
    };

    return this;
    
}