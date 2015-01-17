/*
* 文本框类的，包括日期，上传等
* 
*/

Nature.Controls.BaseControl.prototype.SingleLineTextBox = function (controlInfo, controlExtend, isBatch) {
    //单行文本框
    var em = document.createElement("input");
    em.id = "ctrl_" + controlInfo.ColumnID;
    em.name = "c" + controlInfo.ColumnID;
    em.value = controlInfo.DefaultValue;
    em.type = "text";
    em.className = "cssTxt";
    em.maxLength = controlExtend.maxlen;
    em.size = controlExtend.size;

    if (isBatch) {
        if (typeof controlExtend.batchSize != "undefined")
            em.size = controlExtend.batchSize;
    }
    return $(em).addClass("input_t1");

};

Nature.Controls.BaseControl.prototype.MultiLineTextBox = function (controlInfo, controlExtend, isBatch) {
    //多行文本、文本域
    var em = document.createElement("textarea");
    em.id = "ctrl_" + controlInfo.ColumnID;
    em.name = "c" + controlInfo.ColumnID;
    em.value = controlInfo.DefaultValue;
    em.className = "cssTxt";
    em.rows = controlExtend.rows;
    em.cols = controlExtend.cols;
    
    if (isBatch) {
        if (typeof controlExtend.batchRows != "undefined")
            em.rows = controlExtend.batchRows;
        if (typeof controlExtend.batchSize != "undefined")  
            em.cols = controlExtend.batchSize;
    }
    return $(em);
};

Nature.Controls.BaseControl.prototype.PasswordTextBox = function (controlInfo, controlExtend) {
    //密码框
    var em = this.SingleLineTextBox(controlInfo, controlExtend);
    em.attr("type", "password");
    return em;
};

//204 
Nature.Controls.BaseControl.prototype.DateTimeTextBox = function (controlInfo, controlExtend, win, buttonId) {
    //日期选择
    var emDateTime = this.SingleLineTextBox(controlInfo, controlExtend);
    if (controlExtend.my97) {
        //emDateTime.click(controlExtend.my97, WdatePicker);
        emDateTime.click({param:controlExtend.my97},function (info) {
            var pp = eval("(" + info.data.param + ")");
            WdatePicker(pp, undefined, win);
        });
    } else {
        emDateTime.click({ ctrl: emDateTime }, function (para) {
          
            WdatePicker(undefined,undefined,win);
             
            /*把日期控件弄到表单页面里
            window.setTimeout(function() {
                var divMy97 = $("div").last();
                //判断是不是日期控件
                

                var offsetTimeText = para.data.ctrl.offset();

                var divMod = $("#div_Mod_" + buttonId);
                if (divMod.length == 0)
                    divMod = $("#divf" + buttonId);
                
                var offsetDivMod = divMod.offset();

                var offset = {
                    top: offsetTimeText.top + offsetDivMod.top + 54 + para.data.ctrl.height(),
                    left: offsetTimeText.left + offsetDivMod.left
                };
                divMy97.offset(offset);
                
            },300);
            */
            
        });
    }
    return emDateTime;
};

//205
Nature.Controls.BaseControl.prototype.UploadFile1 = function (controlInfo, controlExtend,  doc) {
    var em = this.SingleLineTextBox(controlInfo, controlExtend);
    return em;
};

Nature.Controls.BaseControl.prototype.UploadFile = function (controlInfo, controlExtend, doc) {

    Nature.loadFile.loadCss("upload1", "upload2");

    var ctrl = this.SingleLineTextBox(controlInfo, controlExtend);

    //加事件
    ctrl.click({ ext: controlExtend, divId: "divUpload" }, function (info) {
        alert(info.data.ext);
        var divUpload = $("#" + info.data.divId, doc);
        divUpload.show();

    });

    var doc1 = $(doc);
    var left = doc1.width() / 2 - 200;
    var top = doc1.height() / 2 - 40;

    var div = "<div id=\"divUpload\" style=\"display:none;position:absolute;background:#fff;left:" + left + "px;top:" + top + "px;\">"
        + "<div id=\"fileQueue\"></div>"
        + "<input type=\"file\" name=\"uploadify\" id=\"uploadify\" />"
        + "<p><a href=\"javascript:$('#uploadify').uploadifyUpload()\">上传</a>| "
        + "   <a href=\"javascript:$('#uploadify').uploadifyClearQueue()\">取消上传</a></p>"
        + "</div>";
    //+ "<div id=\"divImg\" style=\"float:left;overflow:auto ;width:300px;height:260px;\">"
    //+ "    <img id=\"myImg\"/>"
    //+ "</div>";

    $(doc.body).append(div);

    var loads = new Nature.LoadScript(doc);       //把本页面作为参数传递进去。

    loads.js("upload1",  function() {
        loads.js("upload2", function() {

            $("#uploadify").uploadify({
                'uploader': '/Scripts/upload/uploadify.swf',
                'script': Nature.AjaxConfig.UrlResource + '/data/UploadHandler.ashx',
                'cancelImg': Nature.AjaxConfig.UrlResource + '/Scripts/upload/cancel.png',
                'folder': '11',
                'queueID': 'fileQueue',
                'auto': false,
                'multi': true,
                //'buttonText': '选择文件',
                //'buttonImg': '/aspnet_client/jquery/cancel.png',
                'fileDesc': '请选择图片文件',
                'fileExt': '*.jpg;*.gif',
                'onError': function() {
                    alert(fileObj.size);

                },
                'onSelect': function(e, queueId, fileObj) {
                    alert("唯一标识:" + queueId + "\r\n" + "文件名：" + fileObj.name + "\r\n" + "文件大小：" + fileObj.size + "\r\n" + "创建时间：" + fileObj.creationDate + "\r\n" + "最后修改时间：" + fileObj.modificationDate + "\r\n" + "文件类型：" + fileObj.type);

                    //alert($("#uploadify")[0].value);
                    //$("#myImg")[0].src = $("#uploadify")[0].value;

                },
                'onComplete': function(event, queueId, fileObj, response, data) {
                    var a = response.toString().split('`');
                    $("#myImg")[0].src = a[0];
                    alert("上传完毕");

                }
            });

            window.setTimeout(function() {
                $("#divUpload p a", doc).click();

            }, 1000);

        });
    });
    return ctrl;
};

//上传图片 206
    Nature.Controls.BaseControl.prototype.UploadImage = function (controlInfo, controlExtend, commandControlInfo, doc) {
    //外框
    var divUpload = $("<div>");
    divUpload.id = "divUp_" + controlInfo.ColumnID;

    //上传文本框
    var ctrl = this.SingleLineTextBox(controlInfo, controlExtend);
    ctrl.click({ colId: controlInfo.ColumnID, type: controlExtend.type, city: controlExtend.city }, uploadClick);
    divUpload.append(ctrl);

    //加按钮
    var btnUpload = $("<input type=\"button\" class=\"input_01\" value=\"上传图片\">");
    btnUpload.click({ colId: controlInfo.ColumnID, type: controlExtend.type, city: controlExtend.city }, uploadClick);
    divUpload.append(btnUpload);

    //帮助信息
    switch (controlInfo.HelpStation) {
        case 903://右
            divUpload.append(" ");
            divUpload.append(controlInfo.ColHelp);
            break;
    }

    //图片区域
    var divPic = $("<div id=\"divPic_" + controlInfo.ColumnID + "\">");
    //divPic.id = "divPic_" + controlInfo.ColumnID;
    divPic.html("显示上传后的图片");
    divUpload.append(divPic);

    return divUpload;
    
    //上传控件的单击事件
    function uploadClick(info) {
        //alert(info.data.ext);
        var id = info.data.colId;
        var ctrlUpload = $("#ctrl_" + id, doc);

        var maxId = "";
        var isGetMaxId = true;

        var city = 1;
        if (typeof (info.data.city) != "undefined") {
            city = $("#ctrl_" + info.data.city, doc).val();
        }

        if (ctrlUpload.val() != "") {
            /*有值，拆分、判断值的类型*/
            maxId = ctrlUpload.val().split(",")[0];
            if (maxId == maxId * 1) {
                /*是数字，打开窗口，判断是否有城市控件，有的话设置city参数*/

                var url = "/CommonModule/upload/up.aspx?id=" + maxId + "&colID=" + info.data.colId + "&type=" + info.data.type + "&city=" + city;
                openUpload(url, id);
                isGetMaxId = false;
            }

        }

        if (isGetMaxId) {
            /*没有值或者不是数字*/
            getIdMax(ctrlUpload, info.data.colId, info.data.type, function (ctrlUpload2, colId2, type2, maxId2) {
                ctrlUpload2.val(maxId2);
                var url1 = "/CommonModule/upload/up.aspx?id=" + maxId2 + "&colID=" + colId2 + "&type=" + type2 + "&city=" + city;
                openUpload(url1, colId2);

            });
        }

    }
    
    //获取指定的表的最大记录ID
    function getIdMax(ctlUpload, colId, type, callback) {
        //提交表单
        $.getIdMax({
            data: { mdid: 1, dbid: commandControlInfo.dataBaseId },
            url: "/data/getid.ashx",
            title: "表单信息",
            success: function (data) {
                //alert(msg);
                var maxId = data.id;

                if (typeof (callback) != "undefined") {
                    callback(ctlUpload, colId, type, maxId);
                }

            }
        });

    }

    //打开上传的窗口
    function openUpload(url, editId) {
        if (typeof (parent) != "undefined") {
            if (typeof (parent.openUpload) != "undefined") {
                parent.openUpload(url, editId);
            }
        }
    }
    
};

//207 弹窗选择记录 
    Nature.Controls.BaseControl.prototype.ChangeDataId = function (controlInfo, controlExtend, commandControlInfo, doc) {

        var em1 = this.SingleLineTextBox(controlInfo, controlExtend);
        var em2 = this.SingleLineTextBox(controlInfo, controlExtend);

        em2.attr("id", "ctrl_" + controlInfo.ColumnID + "_txt" );
        em2.attr("name", "c" + controlInfo.ColumnID + "_txt");

        var divSelect = $("<div>");
        divSelect.append(em1);
        divSelect.append(em2);


        em2.click({ modID: controlExtend.moduleID, btnID: controlExtend.buttonID, columnID: controlInfo.ColumnID, query: controlExtend.query }, function (info) {
            /*从缓存里获取按钮信息*/
            var cacheKey = info.data.modID;
           
            var load = new Nature.Data.Cache();
            load.ajaxGetMeta({
                urlPara: { action: "button", mdid: cacheKey, dbid: commandControlInfo.dataBaseId, cacheKey: cacheKey },
                title: "选择记录，获取按钮信息",
                success: function (btnInfos) {
                    var btnInfo = btnInfos.data[info.data.btnID];

                    /*注册回调事件 cacheKey + "_" +*/
                    top.__cache[info.data.columnID] = {
                        setValue: function (id, value, txt, otherInfo) {
                            var ctrl = $("#ctrl_" + id, doc);
                            ctrl.val(value);
                            $("#ctrl_" + id + "_txt", doc).val(txt);

                            if (typeof ctrl[0].fireEvent == "function")
                                ctrl[0].fireEvent("onchange");
                            else {
                                if (typeof ctrl[0].onchange == "function") {
                                    ctrl[0].onchange(otherInfo);
                                }
                            }
                        }
                    };

                    var myQuery = undefined;
                    if (typeof info.data.query != "undefined")
                        myQuery = "query=" + info.data.query;

                    //查看一下是否已经打开了，如果已经打开了就不再次打开。

                    var openDivId = "div_Mod_" + info.data.btnID;
                    var openDiv = $(openDivId ,top.document);

                    if (openDiv.length == 0)
                        parent.IndexOpenWeb(btnInfo, -2, "-2", "-2", controlInfo.ColumnID, myQuery);
                    

                }
            });
           
            
        });
        return divSelect;
    };
 


//上传图片后显示图片
//设置图片操作栏
function setPicBar(editPic2, imgIds, editText, colId) {
    var src = Nature.Page.Form.readPic.replace("{source}", "2");

    var imgBarHtml = "<div id=\"imgbar{id}\" style='float:left;margin-right:4px;line-height:20px;'><img  height=\"70px \" align=\"left\" hspace=\"4\" src=\"" + src + "\" alt=\"{id}\" title=\"{id}\" /></div>";

    for (var imgKey in imgIds) {
        var tmpImgBar = imgBarHtml.replace(/{id}/g, imgKey);
        var imgBar = $(tmpImgBar);

        var spanFengMian = $("<span id='fm" + imgKey + "' style='cursor:pointer'>[封面]</span>");
        imgBar.append(spanFengMian);
        imgBar.append("<br/>");

        var spanAdd = $("<span id='add" + imgKey + "' style='cursor:pointer'>[插入]</span>");
        imgBar.append(spanAdd);
        imgBar.append("<br/>");

        var spanDel = $("<span id='del" + imgKey + "' style='cursor:pointer'>[删除]</span>");
        imgBar.append(spanDel);
        imgBar.append("<br/>");

        editPic2.append(imgBar);

        //加事件
        //把图片设置为封面
        spanFengMian.click({ imgId: imgKey }, function (info) {
            //遍历上传控件集合
            var uploadCtrl = "";
            var imgId = info.data.imgId;

            for (var key2 in Nature.Page.Form.uploadControl) {
                var uploadExt = Nature.Page.Form.uploadControl[key2];
                uploadCtrl = $("#ctrl_" + key2);

                if (uploadExt.editId == colId)
                    break;

            }

            var picId = uploadCtrl.val().split(",")[0];

            uploadCtrl.val(picId + "," + imgId);

            //alert("设置为封面");

        });
        //把图片加入到在线编辑器
        spanAdd.click({ edit: editText, imgId: imgKey }, function (info) {
            var imgId = info.data.imgId;
            src = Nature.Page.Form.readPic.replace("{source}", "1");
            var imgHtml = "<p><img src=\"" + src + "\" alt=\"{id}\" title=\"{id}\" /></p>";

            info.data.edit.insertHtml(imgHtml.replace(/{id}/g, imgId));

        });
        //删除图片
        spanDel.click({ edit: editText, imgId: imgKey }, function (info) {
            var imgId = info.data.imgId;
            var edit = info.data.edit;

            $.ajax({
                type: "GET",
                dataType: "JSON",
                cache: false,
                url: "/CommonModule/Upload/PicInfo.ashx",
                data: { action: "picdel", id: imgId },
                error: function () {
                    alert("删除图片记录的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },

                success: function (data) {
                    //alert("删除成功！");
                    $("#imgbar" + imgId).remove();

                    var tmpHtml = edit.html();
                    src = Nature.Page.Form.readPic.replace("{source}", "1");
                    src = src.replace("{id}", imgId);
                    src = src.replace(/\//g, "\/");
                    src = src.replace(/\./g, "\\.");
                    src = src.replace(/\?/g, "\\?");
                    src = src.replace(/\&/g, "\\&");

                    var re = new RegExp("<img.*src=\"" + src + ".*>", "g");

                    tmpHtml = tmpHtml.replace(re, "");
                    tmpHtml = tmpHtml.replace(/<p>\s*<\/p>/g, "");
                    edit.html(tmpHtml);

                }
            });
        });
    }

    editPic2.append("<div id=\"clear\">");

    //return spanImg;

}
//显示图片处理结束
