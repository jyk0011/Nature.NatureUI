 /*
* 创建表单
* table 实现添加、修改、查看的功能

*/

Nature.Controls.Form = function (fEvent) {
    
    //按钮的事件和属性
    var formEvent = fEvent;
    //{
    formEvent.id = "form";                      /*自己的ID，一个页面多个表单，提交后回调的区分标识*/
    //    control: $("#divForm"),              //存放表格控件的div
    formEvent.divID = "divForm";       //存放表单控件的div
    //    window: window,
    formEvent.titleID = "span_title";             //表单div里标题的ID
    //    moduleID: "",                    //对应的模块ID
    //    masterPageViewID: "",           //主页面视图ID
    //    findPageViewID: "",             //查询视图ID

    //    buttonId: "",                   //对应的按钮ID
    //    dataID: "",                     //记录ID
    //    foreignID: "",                   //外键ID
    formEvent.baseControl = {};            //创建基础控件

    formEvent.editControl = {}; //在线编辑器集合
    formEvent.uploadControl = {};          //上传控件集合
    formEvent.unionControl = {};           //联动列表框
    formEvent.ctrlJsonMeta = {};      //表单控件需要的元数据

    //    dbid: "2,4",             //获取图片id、删除图片使用。直营和加盟用不同的数据库

    formEvent.isBatch = false;          //是否用于批量修改

    //    //直营的图片 type：上传分类；例如新闻是17；id：图片ID； source：=1读大图 = 2 读小图
    formEvent.readPic = "http://mango-attach2.517.cn/ReadPic.aspx?type=17&id={id}&source={source}";
        
    //    //加盟的图片type：上传分类；例如新闻是17；id：图片ID； source：=1读大图 = 2 读小图
    formEvent.readPicJm = "http://mango-attach2-jm.517.cn/ReadPic.aspx?type=17&id={id}&source={source}";

    formEvent.jsLoad = {};     //记录加载了哪些自定义js文件
    //    callback: function () { },
    formEvent.data = "";            /*修改时，表单的值*/
    formEvent.tmpCallback = {};

    //};

    this.formEvent = formEvent;
    var self = this;
     
    var load = new Nature.Data.Cache();
    var loadM = new Nature.Data.Manager();
     

    //设置按钮的事件和属性
    var init = function () {
       
        if (typeof (fEvent.isBatch) != "undefined") formEvent.isBatch = fEvent.isBatch;

        if (typeof (fEvent.urlPara) != "undefined") formEvent.urlPara = fEvent.urlPara;

        if (typeof (fEvent.divID) != "undefined") formEvent.divID = fEvent.divID; 
        if (typeof (fEvent.KindEditor) != "undefined") formEvent.KindEditor = fEvent.KindEditor;
        if (typeof (fEvent.control) != "undefined") {
            formEvent.control = fEvent.control;
            formEvent.divID = fEvent.control.attr("id");
        }
        if (typeof (fEvent.callback) != "undefined") formEvent.callback = fEvent.callback;
         
        formEvent.baseControl = new Nature.Controls.BaseControl(formEvent);

    };

    //初始化
    init();

    //加载元数据
    var loadData = function () {
        //到父页面的缓存里查找，是否有缓存。有缓存直接用。
        //获取表格控件的元数据

        load.ajaxGetMeta({
            urlPara: {
                action: "form",
                mdid: formEvent.urlPara.moduleID,
                mpvid: formEvent.urlPara.masterPageViewID,
                bid: formEvent.urlPara.buttonId,
                dbid: formEvent.dataBaseId,
                cacheKey: formEvent.urlPara.masterPageViewID + "_" + formEvent.urlPara.buttonId
            },
            title: "表单信息",
            success: function (info) {
                $(formEvent.win).find("#" + formEvent.titleID).html(info.formTitle);
                formEvent.ctrlJsonMeta = info;
                if (info.err != undefined)
                    alert(info.err);
                else
                    createForm(info);
            }
        });
    };

    //创建添加、修改用的表单.初始化，函数入口
    this.create = function () {
        //加载元数据，并且创建表格控件
        loadData();

    };

    function createForm(json) {
        var controlInfo = json.controlInfo;
        var controlExtend = json.controlExtend;
        var table = $("<table id=\"tblForm\" rules=\"all\" class=\"table_default1\">");
        formEvent.control.append(table);

        //判断是否加载自定义js
        switch (json.isLoadCustomerJs) {
            case "1":
            case "3":
                if (typeof formEvent.jsLoad[formEvent.urlPara.masterPageViewID] == "undefined") {
                    formEvent.jsLoad[formEvent.urlPara.masterPageViewID] = true;
                    //加载验证js
                    var loadJs = new Nature.LoadScript(formEvent.win.document);
                    loadJs.js("/Scripts/customer/check/check" + formEvent.urlPara.masterPageViewID + ".js" + Nature.jsVer, function () {

                    });
                } 
                break;

        }

        //var key = json.controlInfokeys;
        //加载有权限的字段
        var key = Nature.CommonFunction.GetPermissionKey(json.controlInfokeys, json.colRole);

        var prevTr = undefined; /*上一个要合并进入的容器*/

        //开始遍历
        for (var i = 0; i < key.length; i++) {

            var tr = $("<tr >");
            table.append(tr);
            for (var j = 0; j < json.columnCount; j++) {
                var colId = key[i];
                tr.attr("id", "tr" + colId);

                var ctrlInfo = controlInfo[colId];          //基本信息
                var ctrlExt = controlExtend[colId];         //扩展信息
                var title = ctrlInfo.ColTitle.length == 0 ? ctrlInfo.ColName : ctrlInfo.ColTitle;

                var tdTitle = $("<td>").attr("align", "right").css("text-align", "right").html(title + "："); //.appendTo(tr);
                var ctrl = formEvent.baseControl.create(ctrlInfo, ctrlExt, formEvent.dataBaseId, formEvent.win, formEvent.urlPara.buttonId, formEvent.isBatch);
                var tdCol = $("<td>");

                tdCol.append(ctrl); //.appendTo();

                /*是否合并tr*/
                if (ctrlInfo.ClearTDStart == 0) {
                    //不合并到上一个tr，本行tr添加两个td
                    tr.append(tdTitle);
                }

                /*是否加下一行*/
                if (ctrlInfo.ClearTDEnd == 1) {
                    //下一个字段合并到这个tr里，做一个table作为容器。如果已经有容器了，就是用上一个
                    if (typeof prevTr == "undefined") {
                        var pTable = $("<table>");
                        var pTr = $("<tr>");
                        var pTd = $("<td>");
                        pTd.append(ctrl);
                        pTr.append(pTd);
                        pTable.append(pTr);
                        /*记录tr容器*/
                        prevTr = pTr;

                        tdCol.append(pTable);
                        tr.append(tdCol);
                    }
                } else {
                    /*下一个字段不合并，直接添加*/
                    tr.append(tdCol);
                }

                /*是否合并tr*/
                if (ctrlInfo.ClearTDStart != 0) {
                    //合并到上一个tr，添加到上一个td里。
                    if (typeof prevTr != "undefined") {
                        for (var spacei = 0; spacei < ctrlInfo.ClearTDStart; spacei++) {
                            tdTitle.before("&nbsp;");
                        }
                        prevTr.append(tdTitle);
                        prevTr.append(tdCol);

                    }
                }

                /*清掉prevTr*/
                if (ctrlInfo.ClearTDEnd == 0) {
                    //下一个字段不合并到这个tr里
                    prevTr = undefined;
                }

                var tdspan = ctrlInfo.TDColspan;
                if (tdspan > 1) {
                    //一个字段占多列
                    tdCol.attr("colspan", tdspan);
                    j += (tdspan - 1) / 2;
                }

                switch (ctrlInfo.ControlTypeID) {
                    case 208:
                        //在线编辑'#ctrl_' + colId
                        var edit = formEvent.KindEditor.create('#ctrl_' + colId, {
                            width: '900px',
                            height: '400px',
                            items: ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'cut', 'copy', 'paste',
                                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                                'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                                'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
                                'table', 'hr', 'emoticons', 'anchor', 'link', 'unlink', '|', 'about'],
                            filterMode: true
                        });

                        formEvent.editControl[colId] = {
                            areaTextCtrl: ctrl,
                            editCtrl: edit
                        };

                        if (typeof (parent) != "undefined") {
                            if (typeof (parent.mainEvent) != "undefined") {
                                parent.mainEvent.editEvent[colId] = {
                                    edit: edit
                                };
                            }
                        }
                        break;
                    case 206:
                        //上传图片
                        formEvent.uploadControl[ctrlInfo.ColumnID] = {
                            uploadCtrl: ctrl,
                            ctrlExt: ctrlExt
                        };
                        break;

                    case 252:
                        //联动列表框
                        formEvent.unionControl[ctrlInfo.ColumnID] = {
                            unionList: formEvent.baseControl.getUnionList(ctrlExt.union)
                        };
                }



                //默认值
                if (json.type == 402) {
                    //添加
                    var defValue = ctrlInfo.DefaultValue;

                    if (defValue != "") {
                        if (ctrlInfo.ControlTypeID == 253 || ctrlInfo.ControlTypeID == 254) {
                            //radio、checkbox
                            var ctrlrdo = formEvent.control.find("input[name='c" + ctrlInfo.ColumnID + "']");
                            if (ctrlrdo.length > 0) {
                                for (var cc in ctrlrdo) {
                                    if (ctrlrdo[cc].value == defValue) {
                                        ctrlrdo[cc].checked = true;
                                    }
                                }

                            }
                        } else {
                            switch (defValue) {
                                case "yearmonth":
                                case "date":
                                case "datetime":
                                case "time":
                                    loadM.ajaxGetData({
                                        data: { action: defValue },
                                        title: "获取服务器时间",
                                        ctrlId: ctrl[0].id,
                                        success: function (ctrlId, time) {
                                            formEvent.control.find("#" + ctrlId).val(time.re);
                                        }
                                    });
                                    break;
                                case "userid":
                                    //获取登录账户
                                    getOnlineUser(ctrl, function (ctrlVal, userId) {
                                        ctrlVal.val(userId);
                                    });
                                    break;
                                case "orgid":
                                    //先获取登录账户，然后在获取登录人所在部门ID
                                    getOnlineUser(ctrl, function (ctrlVal, userId) {
                                        getOnlineUsersOrgId(ctrlVal, userId, function (ctrlVal2, userOrgId2) {
                                            //ctrlVal.val(data.name + "(" + data.id + "," + data.userCode + ")");
                                            ctrlVal2.val(userOrgId2);
                                        });
                                         
                                    });
                                    break;
                                    
                                default:
                                    //拆分默认值，如果可以用“,”分割，判断第一个元素。
                                    var arrDefaultValue = defValue.split(',');
                                    if (arrDefaultValue.length >= 2) {
                                        switch (arrDefaultValue[0]) {
                                            case "frids":
                                                var frids = formEvent.urlPara.foreignIDs.replace(/\"/g, "").split(",");
                                                if (frids.length > arrDefaultValue[1]) {//避免溢出
                                                    ctrl.val(frids[arrDefaultValue[1]]);
                                                }
                                                break;
                                            case  "id":
                                                ctrl.val(formEvent.urlPara.dataID);
                                                break;
                                            case "ids":
                                                ctrl.val(formEvent.urlPara.dataIDs);
                                                break;
                                        }

                                    } else {
                                        ctrl.val(defValue);
                                    }
                                    break;
                            }
                        }
                    }
                }

                //帮助信息
                switch (ctrlInfo.HelpStation) {
                    case 902:
                        //左
                        tdTitle.append("<br>");
                        tdTitle.append(ctrlInfo.ColHelp);
                        break;
                    case 903:
                        //右
                        if (ctrlInfo.ControlTypeID != 206) {
                            tdTitle.append("&nbsp;");
                            tdCol.append(ctrlInfo.ColHelp);
                        }
                        break;
                }


                //状态
                switch (ctrlInfo.ControlState) {
                    case 1:
                        //正常
                        break;
                    case 2:
                        //只读
                        ctrl.attr('readonly', 'true');
                        break;
                    case 3:
                        //不可用
                        tdCol.children().each(function () {
                            $(this).attr('disabled', 'disabled');
                        });
                        break;
                    case 4:
                        //隐藏
                        tr.hide();
                        break;
                }

                //设置添加人
                if (ctrlInfo.ColumnID == 1000150) {
                    switch (json.type) {
                        case 402:
                            //获取登录账户
                            getOnlineUser(ctrl, function (ctrlVal, userId) {
                                //ctrlVal.val(data.name + "(" + data.id + "," + data.userCode + ")");
                                ctrlVal.val(userId);
                            });
                            break;
                        default:
                            //getUserCode(undefined, ctrl, function (ctrlVal, userCode) {
                            //    ctrlVal.val(userCode);
                            //});
                            break;
                    }
                }

                i++;
                if (i >= key.length)
                    break;
            }
            i--;
        }


        //遍历在线编辑器
        //setOnlineEdit();

        //遍历上传图片
        setUploadPic();

        if (json.type != 402) {
            //修改、查询：绑定表单
            bindData(function () {
                //遍历上传图片的控件
                updateSetPic(function () {
                    //formEvent.spinStop();
                });
                //formEvent.spinStop();

                //加载修改表单的js
                switch (formEvent.ctrlJsonMeta.isLoadCustomerJs) {
                    case "2":
                    case "3":
                        if (typeof formEvent.jsLoad[formEvent.urlPara.masterPageViewID] == "undefined") {
                            formEvent.jsLoad[formEvent.urlPara.masterPageViewID] = true;
                            //加载验证js
                            var loadJs = new Nature.LoadScript(formEvent.win.document);
                            loadJs.js("/Scripts/customer/formBind/formBind" + formEvent.urlPara.masterPageViewID + ".js" + Nature.jsVer, function () {
                                if (typeof formEvent.win.cusJsLoad != "undefined")
                                    formEvent.win.cusJsLoad(formEvent);
                                formEvent.callback(json.type);

                            });
                        } else {
                            formEvent.callback(json.type);
                        }
                        break;
                        
                    default:
                        formEvent.callback(json.type);
                        break;
                }
                
                
            });
        } else {
            //遍历上传图片的控件
            updateSetPic(function () {
                //formEvent.spinStop();
            });
            //formEvent.spinStop();

            //加载修改表单的js
            switch (formEvent.ctrlJsonMeta.isLoadCustomerJs) {
                case "2":
                case "3":
                    if (typeof formEvent.jsLoad[formEvent.urlPara.masterPageViewID] == "undefined") {
                        formEvent.jsLoad[formEvent.urlPara.masterPageViewID] = true;
                        //加载验证js
                        var loadJs = new Nature.LoadScript(formEvent.win.document);
                        loadJs.js("/Scripts/customer/formBind/formBind" + formEvent.urlPara.masterPageViewID + ".js" + Nature.jsVer, function () {
                            if (typeof formEvent.win.cusJsLoad != "undefined")
                                formEvent.win.cusJsLoad(formEvent);
                            
                            formEvent.callback(json.type);

                        });
                    } else {
                        formEvent.callback(json.type);
                    }
                    break;
                    
                default:
                    formEvent.callback(json.type);
                    break;
            }

            
        }

        //函数区
        //遍历上传图片控件
        function setUploadPic() {
            //遍历上传图片的控件
            for (var key2 in formEvent.uploadControl) {
                var uploadExt = formEvent.uploadControl[key2].ctrlExt;
                var uploadCtrl = formEvent.uploadControl[key2].uploadCtrl;

                if (typeof (uploadExt) == "undefined")
                    break;

                var editCtrl;
                if (typeof (uploadExt.editId) != "undefined")
                    editCtrl = formEvent.editControl[uploadExt.editId].editCtrl;
                else {
                    editCtrl = undefined;
                }

                if (typeof (parent) != "undefined") {
                    if (typeof (parent.mainEvent) != "undefined") {
                        parent.mainEvent.uploadPicEvent[key2] = {
                            upload: uploadCtrl,
                            edit: editCtrl,
                            insertImg: function (uploadId, imgIds, isJm) {
                                var src = formEvent.readPic.replace("{source}", "1");
                                var imgHtml = "<p><img src=\"" + src + "\" alt=\"{id}\" title=\"{id}\" /></p>";

                                if (typeof (parent.mainEvent.uploadPicEvent[uploadId].edit) != "undefined") {
                                    //插入到在线编辑器
                                    var editImg = "";
                                    for (var aa in imgIds) {
                                        editImg = imgHtml.replace(/{id}/g, aa);
                                        parent.mainEvent.uploadPicEvent[uploadId].edit.insertHtml(editImg);
                                    }
                                }

                                //图片操作栏 $("#divPic_" + key2)
                                setPicBar(formEvent.control.find("#divPic_" + uploadId), imgIds, parent.mainEvent.uploadPicEvent[uploadId].edit, uploadId,isJm);

                            }
                        };
                    }
                }


            }

        }

        //设置图片操作栏
        function setPicBar(editPic2, imgIds, edit2, uploadId, isJm) {
            var hasEditor = false;
            var editCtrl = "undefined";
            if (typeof (edit2) != "undefined") {
                hasEditor = true;
                editCtrl = edit2;
            }

            if (editPic2.html() == "显示上传后的图片")
                editPic2.html("");

            var src = formEvent.readPic.replace("{source}", "2");

            if (isJm)
                src = formEvent.readPicJm.replace("{source}", "2");
            
            var imgBarHtml = "<div id=\"imgbar{id}\" style='float:left;margin-right:4px;line-height:20px;'><img  height=\"70px \" align=\"left\" hspace=\"4\" src=\"" + src + "\" alt=\"{id}\" title=\"{id}\" /></div>";

            for (var imgKey in imgIds) {
                var tmpImgBar = imgBarHtml.replace(/{id}/g, imgKey);
                var imgBar = $(tmpImgBar);

                editPic2.append(imgBar);

                var spanFengMian = $("<span id='fm" + imgKey + "' style='cursor:pointer'>[封面]</span>");
                imgBar.append(spanFengMian);
                imgBar.append("<br/>");

                //把图片设置为封面
                spanFengMian.click({ imgId: imgKey }, function (info) {
                    //遍历上传控件集合
                    var uploadCtrl = formEvent.control.find("#ctrl_" + uploadId);

                    var picId = uploadCtrl.val().split(",")[0];
                    var imgId = info.data.imgId;

                    uploadCtrl.val(picId + "," + imgId);

                    //alert("设置为封面");

                });

                if (hasEditor) {
                    var spanAdd = $("<span id='add" + imgKey + "' style='cursor:pointer'>[插入]</span>");
                    imgBar.append(spanAdd);
                    imgBar.append("<br/>");

                    //把图片加入到在线编辑器
                    spanAdd.click({ edit: editCtrl, imgId: imgKey }, function (info) {
                        var imgId = info.data.imgId;
                        src = formEvent.readPic.replace("{source}", "1");
                        if (isJm)
                            src = formEvent.readPicJm.replace("{source}", "1");
                        
                        var imgHtml = "<p><img src=\"" + src + "\" alt=\"{id}\" title=\"{id}\" /></p>";

                        info.data.edit.insertHtml(imgHtml.replace(/{id}/g, imgId));

                    });
                }

                var spanDel = $("<span id='del" + imgKey + "' style='cursor:pointer'>[删除]</span>");
                imgBar.append(spanDel);
                imgBar.append("<br/>");

                //删除图片
                spanDel.click({ edit: editCtrl, imgId: imgKey, isJm: isJm }, function (info) {
                    if (!window.confirm("确定要删除这张图片吗？")) {
                        return;
                    }

                    var imgId = info.data.imgId;
                    var edit5 = info.data.edit;
                    var isJm2 = info.data.isJm;

                    var myDbid = formEvent.dbid;
                    if (isJm2)
                        myDbid = "2,14";
                    else 
                        myDbid = "2,4";
                     
                    $.ajaxGetData({
                        title: "删除图片",
                        data: { action: "picdel", dbid: myDbid, id: imgId },
                        success: function (data) {
                            //收到反馈信息，判断是否发生异常
                            if (data.err != undefined)
                                alert(data.err);
                            else {
                                //alert("删除成功！");
                                formEvent.control.find("#imgbar" + imgId).remove();

                                if (edit5 != "undefined") {
                                    var tmpHtml = edit5.html();
                                    src = formEvent.readPic.replace("{source}", "1");
                                    if (isJm)
                                        src = formEvent.readPicJm.replace("{source}", "1");
                                    
                                    src = src.replace("{id}", imgId);
                                    src = src.replace(/\//g, "\/");
                                    src = src.replace(/\./g, "\\.");
                                    src = src.replace(/\?/g, "\\?");
                                    src = src.replace(/\&/g, "\\&");

                                    var re = new RegExp("<img.*src=\"" + src + ".*>", "g");

                                    tmpHtml = tmpHtml.replace(re, "");
                                    tmpHtml = tmpHtml.replace(/<p>\s*<\/p>/g, "");
                                    edit5.html(tmpHtml);
                                }

                                //查看封面里是否使用了这个图片
                                var uploadCtrl = formEvent.control.find("#ctrl_" + uploadId);
                                var picIds = uploadCtrl.val().split(",");

                                if (picIds.length > 1) {
                                    if (picIds[1] == imgId) {
                                        uploadCtrl.val(picIds[0]);
                                    }
                                }
                            }
                        }
                    });
                });
            }

            editPic2.append("<div id=\"clear\">");

            //return spanImg;

        }

        //修改时加载图片id后的处理
        function updateSetPic(callback2) {
            //遍历上传图片的控件
            for (var key2 in formEvent.uploadControl) {
                var uploadExt = formEvent.uploadControl[key2];
                var uploadCtrl = formEvent.control.find("#ctrl_" + key2);

                if (typeof (uploadExt) == "undefined")
                    break;

                if (json.type == 403) {
                    //修改状态，获取对应的图片列表，做操作栏
                    var mapId = uploadCtrl.val();
                    if (mapId == "") {
                        callback2();
                    } else {
                        getPicList(mapId, uploadExt, key2, function (ext, img,isJm) {
                            //图片操作栏
                            setPicBar(formEvent.control.find("#divPic_" + key2), img.AttachIds, parent.mainEvent.uploadPicEvent[key2].edit, key2,isJm);
                            callback2();
                        });
                    }
                } else
                    callback2();
            }
            callback2();
        }

        //获取图片id
        function getPicList(mapId, ext, colId3, callbackUp) {
            var tmpId = mapId.split(",")[0];
            if (tmpId != tmpId * 1) {
                //tmpId = -999;
                //callbackUp(ext, {});
                return;
            }

            $.ajaxGetData({
                title: "获取图片id 直营",
                data: { action: "piclist", dbid: "2,4", classid: ext.ctrlExt.type, mapid: tmpId },
                //timeout: 2000,
                success: function (msg) {
                    //收到反馈信息，判断是否发生异常
                    if (msg.err != undefined)
                        alert(msg.err);
                    else {
                        callbackUp(ext, msg,false );
                    }
                }
            });


            $.ajaxGetData({
                title: "获取图片id 加盟",
                data: { action: "piclist", dbid: "2,14", classid: ext.ctrlExt.type, mapid: tmpId },
                //timeout: 2000,
                success: function (msg) {
                    //收到反馈信息，判断是否发生异常
                    if (msg.err != undefined)
                        alert(msg.err);
                    else {
                        callbackUp(ext, msg,true);
                    }
                }
            });

            /*
            $.ajax({
            type: "GET",
            dataType: "JSON",
            cache: false,
            url: "/CommonModule/Upload/PicInfoold.ashx",
            data: { action: "piclist", id: tmpId, colId: colId3 },
            //timeout: 2000,
            error: function () {
            alert("获取图片ID列表的时候发生错误！");
            },

            success: function (data) {
            callbackUp(ext, data);
            }
            });
            */

        }

    }

    //修改数据时，填充要修改的数据
    this.bind = function (callback) {
        bindData(callback);
    };

    var bindData = function (callback) {
        loadM.ajaxGetData({
            urlPara: {
                action: "one",
                mdid: formEvent.urlPara.moduleID,
                mpvid: formEvent.urlPara.masterPageViewID,
                id: formEvent.urlPara.dataID,
                bid: formEvent.urlPara.buttonId,
                dbid: formEvent.dataBaseId
            },
            title: "绑定表单数据",
            success: function (json) {
                //得到记录，绑定到控件
                var value = formEvent.data = json.data[0];
                var fristUnionList = undefined;

                for (var key in value) {
                    var ctrl = formEvent.control.find("#ctrl_" + key);
                    if (ctrl.length > 0) {
                        if (key == 1000150) {
                            //getUserCode(value[key], ctrl, function (ctrlVal, userCode) {
                            //    ctrlVal.val(userCode);
                            //});
                            ctrl.val(value[key]);
                        } else {
                            ctrl.val(value[key]);
                        }
                        
                        if (value[key] == "1900-01-01 00:00") {
                            ctrl.val("");
                        }
                        
                    } else {
                        //radio、checkbox
                        ctrl = formEvent.control.find("input[name='c" + key + "']");
                        if (ctrl.length > 0) {
                            var arrValue = [];
                            if (typeof value[key] == "string") {
                                /*如果是字符串，拆分成数组*/
                                arrValue = value[key].split(','); /*复选框组的绑定*/
                            } else {
                                /*是数字，加入数组*/
                                arrValue.push(value[key]);
                            }

                            for (var cc in ctrl) {
                                for (var i = 0; i < arrValue.length; i++) {
                                    if (ctrl[cc].value == arrValue[i]) {
                                        ctrl[cc].checked = true;
                                    }
                                }
                            }
                        }
                    }

                    //在线编辑器
                    if (typeof (formEvent.editControl[key]) != "undefined") {
                        formEvent.editControl[key].editCtrl.html(value[key]);
                    }
                    //联动列表框
                    if (typeof formEvent.unionControl[key] != "undefined") {
                        formEvent.unionControl[key].unionList.setValue("ctrl_" + key, value[key]);

                        if (typeof fristUnionList == "undefined") {
                            fristUnionList = ctrl;
                        }
                    };
                }

                //联动开始change
                if (typeof fristUnionList != "undefined") {
                    fristUnionList.change();
                }

                //加载修改表单的js
                switch (formEvent.ctrlJsonMeta.isLoadCustomerJs) {
                    case "2":
                    case "3":
                        if (typeof formEvent.jsLoad[formEvent.urlPara.masterPageViewID] == "undefined") {
                            formEvent.jsLoad[formEvent.urlPara.masterPageViewID] = true;
                            //加载验证js
                            var loadJs = new Nature.LoadScript(formEvent.win.document);
                            loadJs.js("/Scripts/customer/formBind/formBind" + formEvent.urlPara.masterPageViewID + ".js" + Nature.jsVer, function () {
                                if (typeof formEvent.win.cusJsLoad != "undefined")
                                    formEvent.win.cusJsLoad(formEvent);
                            });
                        } 
                        break;
                }

                if (typeof (callback) != "undefined")
                    callback();
                else {
                    //formEvent.spinStop();
                }


            }
        });
    };

    //根据divID获取里面的值
    this.getValueByDiv = function () {
        //同步
        for (var key2 in formEvent.editControl) {
            formEvent.editControl[key2].editCtrl.sync();
        }
        
        var json = formEvent.ctrlJsonMeta;
        var controlInfo = json.controlInfo;
        var controlExtend = json.controlExtend;

        //var key = json.controlInfokeys;
        //加载有权限的字段
        var key = Nature.CommonFunction.GetPermissionKey(json.controlInfokeys, json.colRole);

        var formValue = {}; /*返回值对象*/

        //开始遍历
        for (var i = 0; i < key.length; i++) {
            var colId = key[i];

            var ctrlInfo = controlInfo[colId];          //基本信息
            var ctrlExt = controlExtend[colId];         //扩展信息

            //("#ctrl_" + colId, formEvent.win.document).val();
            var ctrl = formEvent.control.find("#ctrl_" + colId);
            var tmpValue = "";

            if (ctrl.length > 0) {
                if (colId == 1000150) {
                    //getUserCode(value[key], ctrl, function (ctrlVal, userCode) {
                    //    ctrlVal.val(userCode);
                    //});
                    tmpValue = ctrl.val();
                } else {
                    tmpValue = ctrl.val();
                }
                
                if (ctrlInfo.ControlTypeID == 202 || ctrlInfo.ControlTypeID == 208) {
                    /*多行文本框，url编码*/
                    tmpValue = encodeURIComponent(tmpValue);
                }
                
            } else {
                //radio、checkbox
                ctrl = formEvent.control.find("input[name='c" + colId + "']");
                if (ctrl.length > 0) {

                    for (var j = 0; j < ctrl.length; j++) {
                        if (ctrl[j].checked) {
                            tmpValue += ctrl[j].value + ",";
                        }
                    }

                    if (tmpValue.length > 1) {
                        tmpValue = tmpValue.substring(0, tmpValue.length-1);
                    }
                }
            }
            formValue["c" + colId] = tmpValue;

        }

        formValue.formId = formEvent.id;

        return formValue;

    };

    //获取表单里控件的值
    this.getValue = function (formName) {
        //同步
        for (var key in formEvent.editControl) {
            formEvent.editControl[key].editCtrl.sync();
        }

        var myForm = formEvent.control.parent().parent().find("#" + formName);

        var dataResult1 = myForm.serialize();
        var tmp = dataResult1.replace(/&/g, "\",");
        tmp = tmp.replace(/=/g, ":\"");
        var jsonValue = eval("({" + tmp + "\"})");

        //修正复选组的取值问题，同name的只能取一个而不能取多个。
        //遍历表单里的复选框，jsonValue里对于的值设置为 空
        myForm.find("input[type='checkbox']").each(function () {
            jsonValue[this.name] = "";
        });

        //遍历表单里的复选框，根据name合并选择，逗号分割
        myForm.find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var n = this.name;
                var v = this.value;

                if (jsonValue[n] == "") {
                    jsonValue[n] = v;
                } else {
                    jsonValue[n] += "," + v;
                }
            }
        });


        //var dataResult = formEvent.control.parent().parent().find("#" + formName).serializeArray();

        jsonValue.formId = formEvent.id;

        return jsonValue;

        /* var tmp = dataResult.replace(/&/g, "\",");
        tmp = tmp.replace(/=/g, ":\"");
        var jsonValue = eval("({" + tmp + "\"})");
        */

    };

    //保存数据
    this.savaData = function (callback) {
        //formEvent.spinStart(); 

        //var jsonValue = this.getValue("dataForm");

        var jsonValue = this.getValueByDiv();

        var ajaxUrlPara = {
            "dbid": formEvent.dataBaseId,
            "mdid": formEvent.urlPara.moduleID,
            "mpvid": formEvent.urlPara.masterPageViewID,
            "fpvid": formEvent.urlPara.findPageViewID,
            "bid": formEvent.urlPara.buttonId,
            "id": formEvent.urlPara.dataID,
            "frid": formEvent.urlPara.foreignID
        };

        formEvent.tmpCallback = callback;

        //this.Post(jsonValue, ajaxUrlPara);    以前的跨域post的解决方案，现在换成cors的跨域方式。

       
           //提交表单
        loadM.ajaxSaveData({
            formData: jsonValue,
            urlPara: ajaxUrlPara,
            title: "保存表单",
            success: function(data) {
                //alert(msg);
                if (data.err.length == 0) {
                    //alert("保存成功！");
                    //清空表单
                    self.clear();
                } else {
                    alert(data.err);
                }

                if (typeof callback == "function") {
                    callback(data,data.id);
                }

                //formEvent.spinStop();

            }
        });


    };

    //this.formPostCallback = function (kind, id) {
    //    if (typeof formEvent.tmpCallback == "function") {
    //        formEvent.control.find("#" + this.formEvent.divID + "_ifrmPost").remove();
    //        formEvent.tmpCallback(kind, id);
    //    }
    //};

    //按照设置，清空允许清空的控件的值
    this.clear = function () {
        for (var i = 0; i < formEvent.ctrlJsonMeta.controlInfokeys.length; i++) {
            var key = formEvent.ctrlJsonMeta.controlInfokeys[i];
            if (formEvent.ctrlJsonMeta.controlInfo[key].IsClear) {
                formEvent.control.find("#ctrl_" + formEvent.ctrlJsonMeta.controlInfo[key].ColumnID).val("");
            }
        }

    };

    //获取联动列表框
    this.getUnionList = function (colKey) {
        return formEvent.unionControl[colKey].unionList;
    };

    //获取当前登录人信息
    function getOnlineUser(ctrlVal, callback) {
        var onlineUserId = top.__cache["__onlineUserId"];

        if (typeof (onlineUserId) == "undefined") {
            $.ajaxWhoAmI({
                title: "获取当前人是谁",
                success: function(data) {
                    if (typeof(data) == "undefined") {
                        callback(ctrlVal, "没有登录");
                    } else {
                        top.__cache["__onlineUserId"] = data.userInfo.id;
                        callback(ctrlVal, data.userInfo.id);
                    }
                }
            });
        } else {
            callback(ctrlVal, onlineUserId);
        }

    };

    //获取当前登录人的所在部门ID 
    function getOnlineUsersOrgId(ctrlVal, userId1, callback) {

        if (userId1 * 1 == 1)
            userId1 = 15318;

        var userOrgId = top.__cache["userOrgId"];

        if (typeof (userOrgId) == "undefined") {
            loadM.ajaxGetData({
                data: { action: "one", mdid: 543, mpvid: 54310, id: userId1, bid: 54301, dbid: formEvent.dataBaseId },
                title: "获取部门信息by用户",
                success: function (json) {
                    //得到记录 
                    var userOrgId2 = json.data[0]["5554010"];
                    top.__cache["userOrgId"] = userOrgId2;
                    callback(ctrlVal, userOrgId2);
                }
            });
        } else {
            callback(ctrlVal, userOrgId);
        }

    }
    
    var getUserCode = function (userId, ctrlVal, callback) {

        //获取webAppID
        Nature.SSO.getSSOinfo(function (info) {
            //获取当前登录人
            Nature.SSO.isLoginApp(function (userState) {
                var userAppIDs = userState.userAppID;
                if (typeof userId != "undefined") userAppIDs = userId;

                //获取登录账户
                loadM.ajaxGetData({
                    data: { action: "user", mdid: 1, mpvid: 1, dbid: "2,2", webappID: info.WebAppID, userAppID: userAppIDs },
                    title: "获取指定人的账户",
                    success: function (user) {
                        if (typeof (user.data) == "undefined") {
                            callback(ctrlVal, "没有找到ID为“" + userAppID + "”的用户");
                        } else {
                            if (user.data.length > 0)
                                callback(ctrlVal, user.data[0].UserCode);
                            else
                                callback(ctrlVal, "没有找到ID为“" + userAppID + "”的用户");
                        }
                    }
                });
            });
        });
    };
};
 

Nature.Controls.getUserOnline = function(userAppID, ctrl, callback) {
    //获取webAppID
    Nature.SSO.getSSOinfo(function(info) {
        //获取当前登录人
        Nature.SSO.isLoginApp(function(userState) {
            //获取登录账户
            loadM.ajaxGetData({
                data: { action: "user", mdid: 1, mpvid: 1, dbid: "2,2", webappID: info.WebAppID, userAppID: userAppID },
                title: "获取指定人的账户",
                success: function(user) {
                    if (typeof(user.data) == "undefined") {
                        callback(ctrl, "-1");
                    } else {
                        if (user.data.length > 0)
                            callback(ctrl, user.data[0]);
                        else
                            callback(ctrl, "-1");
                    }
                }
            });
        });
    });
};

