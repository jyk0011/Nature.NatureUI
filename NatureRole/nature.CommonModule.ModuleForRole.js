/*
* 创建添加修改角色（角色到模块、按钮、字段）用的模块列表，
* 先获取各种数据，都获取完，在一起创建表格、控件
* 获取模块信息
* 获取按钮信息
* 

*/


Nature.CommonModule.ModuleForRole = {
    RoleModuleInfo: {},   //模块信息

    RoleModuleButtonInfo: {},   //模块对应的按钮信息

    //提交数据的结构
    roleInfo: {
        unUseModuleID: ""   //没有选中的模块ID：1,2,3
        , UseModuleID: ""   //选中的模块ID：4,5,6

    },
    //入口函数，加载全部功能节点
    CreateModuleGrid: function (para) {

        //获取模块信息
        getModuleInfo(function () {
            //获取按钮信息
            getButtonInfo(function () {
                //创建表头
                createTable();
                //创建表格
                createGrid();

                //创建模块里的按钮
                createButton();

                //提取角色到模块、按钮等的信息，然后绑定
                getData(function (msg) {
                    Nature.CommonModule.ModuleForRole.DataBind(msg);
                });
            });
        });

        //数据绑定前的提取数据
        function getData(callback) {
            // 绑定
            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false ,
                url: "/CommonModule/Role/GetRoleData.ashx?action=metalistrole&mdid=2&hasKey=1&mpvid=-20101&fpvid=-20102&id=" + para.id,     //math.random()
                //data: { c1000070: 1 },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的用于修改的信息的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    callback(msg);
                }
            });
        }

        //获取模块信息
        function getModuleInfo(callback) {
            //申请模块数据
            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "/JsonServer/GetData.ashx?action=metalistrole&mdid=2&hasKey=1&mpvid=-20101&fpvid=-20102&pageno=1",     //math.random()
                //data: { c1000070: 1 },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的模块列表的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    RoleModuleInfo = msg;
                    callback();
                }
            });
        }

        //获取按钮信息
        function getButtonInfo(callback) {
            $.ajax({
                type: "GET",
                dataType: "json",
                cache: true,
                url: "/JsonServer/GetData.ashx?action=metalistrole&v=" + Math.random() + "&mdid=2&mpvid=-20103&fpvid=-20104&pageno=1",     //math.random()
                //data: { c1012020: moduleIds },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的模块列表的按钮列表的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    RoleModuleButtonInfo = msg;
                    callback();
                }
            });
        }

        //创建表头
        function createTable() {
            var table = $("<table id='moduleGrid' rules='all' class='cssTable' >");
            var tmpTr;

            tmpTr = "<tr ID='tr0'><th width=\"200px\">功能模块</th><th width=\"500px\">功能按钮</th></tr>";
            table.append(tmpTr);
            $("#divRole").append(table);

        }

        //创建表格
        function createGrid() {
            var tmpTd = "";
            var tmpTr;

            var tr = "<tr ID='tr{moduleID}' style=\"{display}\" parentIDAll=\"{parentIdAll}\">{th}</tr>";
            var td = "<td id=\"t{moduleID}\" class=\"tree{level}\"><input type=\"checkbox\" id=\"chk{moduleID}\" name=\"moduleID\" onclick=\"Nature.CommonModule.ModuleForRole.Check{click}Click(this)\" ><span onclick=\"Nature.CommonModule.ModuleForRole.Module{click}Click(this)\">{title}</span></td>";

            var key = RoleModuleInfo.datakeys;
            for (var i = 0; i < key.length; i++) {
                var colMeta = RoleModuleInfo.data[key[i]];
                tmpTd = td.replace(/\{moduleID\}/g, colMeta.ModuleID);
                tmpTd = tmpTd.replace(/\{moduleID\}/g, colMeta.ModuleID);
                tmpTd = tmpTd.replace(/\{title\}/g, colMeta.ModuleName);
                tmpTd = tmpTd.replace(/\{level\}/g, colMeta.ModuleLevel);

                if (colMeta.ModuleLevel == 1) {
                    tmpTd = tmpTd.replace(/\{click\}/g, "");
                } else {
                    tmpTd = tmpTd.replace(/\{click\}/g, "2");
                }
                tmpTd += "<td id=\"b" + colMeta.ModuleID + "\">&nbsp; </td>";

                tmpTr = tr.replace(/\{th\}/g, tmpTd);
                tmpTr = tmpTr.replace(/\{moduleID\}/g, colMeta.ModuleID);
                tmpTr = tmpTr.replace(/\{parentIdAll\}/g, "," + colMeta.ParentIDAll + ",");

                if (colMeta.ModuleLevel == 1) {
                    tmpTr = tmpTr.replace(/\{display\}/g, "");
                } else {
                    tmpTr = tmpTr.replace(/\{display\}/g, "display:none");
                }

                $("#moduleGrid").append(tmpTr);

                var tmpId = para.id;
                tmpId = tmpId.replace(/"/g, "");
                //角色到字段
                var tdModule = $("#t" + colMeta.ModuleID);
                if (colMeta.GridPageViewID != 0) {
                    var tdGridCol = $("<a id=\"os" + colMeta.GridPageViewID + "\" class=\"csscol\" href=\"javascript:void(0);\" onclick=\"Nature.CommonModule.ModuleForRoleColumns.ShowColumns('" + colMeta.GridPageViewID + "','" + colMeta.ModuleID + "','os" + colMeta.GridPageViewID + "','" + tmpId + "',2)\">[列表]</a>");
                    tdModule.append(tdGridCol);
                }
                if (colMeta.FindPageViewID != 0) {
                    var tdFindCol = $("<a id=\"os" + colMeta.FindPageViewID + "\" class=\"csscol\" href=\"javascript:void(0);\" onclick=\"Nature.CommonModule.ModuleForRoleColumns.ShowColumns('" + colMeta.FindPageViewID + "','" + colMeta.ModuleID + "','os" + colMeta.FindPageViewID + "','" + tmpId + "',2)\">[查询]</a>");
                    tdModule.append(tdFindCol);
                }
                if (colMeta.GridPageViewID != 0) {
                    var tdFindCol2 = $("<a id=\"fl" + colMeta.GridPageViewID + "\" class=\"csscol\" href=\"javascript:void(0);\" onclick=\"Nature.CommonModule.ModuleForRoleColumns.ShowFilterForPageView('" + colMeta.GridPageViewID + "','" + colMeta.ModuleID + "','fl" + colMeta.GridPageViewID + "','" + tmpId + "',2)\">[过滤]</a>");
                    tdModule.append(tdFindCol2);
                }
            }

        }

        //创建模块里的按钮
        function createButton() {
            var tmpBtn = "";
            var btn = "<label ><input type=\"checkbox\" id=\"chkBtn{buttonID}\" name=\"buttonID\" onclick=\"Nature.CommonModule.ModuleForRole.ButtonClick(this)\" >{title}</label>";
            var arrModuleId = RoleModuleInfo.datakeys;
            for (var i = 0; i < arrModuleId.length; i++) {
                var key = RoleModuleButtonInfo.datakeys;
                for (var a = 0; a < key.length; a++) {
                    var btnMeta = RoleModuleButtonInfo.data[key[a]];
                    if (arrModuleId[i] == btnMeta.ModuleID) {
                        //添加按钮
                        tmpBtn = btn.replace(/\{buttonID\}/g, btnMeta.ButtonID);
                        tmpBtn = tmpBtn.replace(/\{title\}/g, btnMeta.BtnTitle);

                        $("#b" + arrModuleId[i]).append(tmpBtn);

                        //角色到字段
                        var title = "";
                        switch (btnMeta.BtnTypeID) {
                            case 401: title = "查看用字段"; break;
                            case 402: title = "添加用字段"; break;
                            case 403: title = "修改用字段"; break;
                            case 406: title = "导出数据"; break;
                            case 407: title = "导出数据"; break;
                            case 408: title = "修改用字段"; break;
                        }

                        var tdModule = $("#b" + arrModuleId[i]);
                        if (title.length > 0) {
                            if (btnMeta.OpenPageViewID != 0) {
                                var tmpId = para.id;
                                tmpId = tmpId.replace(/"/g, "");
                                var tdGridCol = $("<a id=\"rolecol" + btnMeta.ButtonID + "\" class=\"csscol\" href=\"javascript:void(0);\" onclick=\"Nature.CommonModule.ModuleForRoleColumns.ShowColumns('" + btnMeta.OpenPageViewID + "','" + btnMeta.OpenModuleID + "','rolecol" + btnMeta.ButtonID + "','" + tmpId + "'," + btnMeta.ButtonID + ")\">[表单字段]</a>");
                                tdModule.append(tdGridCol);
                            }
                        } else {
                            tdModule.append("&nbsp;&nbsp;&nbsp;");
                        }
                    }
                }
            }

        }
    },

    //一级节点复选框的单击
    CheckClick: function (me) {
        //调用一级节点的单击
        var moduleId = $(me).parent()[0].id.replace("t", "");
        var moduleInfo = RoleModuleInfo.data[moduleId];
        var parentIdAll = moduleInfo.ParentIDAll;

        var query = parentIdAll + "," + moduleId + ",";
        //查找所有子节点
        var sonModule = Nature.CommonModule.ModuleForRole.FindSonModule("," + parentIdAll + ",", moduleId);

        sonModule.show();

        //设置复选框
        var checked = me.checked;
        sonModule.find("input").each(function () {
            this.checked = checked;
        });

    },

    //一级模块的单击
    ModuleClick: function (me) {
        var moduleId = $(me).parent()[0].id.replace("t", "");
        var moduleInfo = RoleModuleInfo.data[moduleId];
        var parentIdAll = moduleInfo.ParentIDAll;

        //查找所有子节点
        var sonModule = Nature.CommonModule.ModuleForRole.FindSonModule("," + parentIdAll + ",", moduleId);

    },

    //非一级节点复选框的单击
    Check2Click: function (me) {
        var moduleId = me.id.replace("chk", "");
        //alert(moduleId);
        //找到父节点里的复选框
        var parentIds = $("#tr" + moduleId).attr("parentidall");
        //设置父节点的复选框为选中
        parentIds = "#chk" + parentIds.replace(/,/g, ",#chk");
        $(parentIds).each(function () {
            this.checked = true;
        });
        /*
        var pId = parentIds.split(',');
        //alert(pId[pId.length -2]);
        
        for (var index = 1; index < pId.length - 1; index++) {
        $("#chk" + pId[index]).each(function () {
        this.checked = true;
        });
        }
        */

        var isCheck = $("#chk" + moduleId)[0].checked;

        //设置右面的按钮是否选中
        $("#b" + moduleId + " input").each(function () {
            this.checked = isCheck;
        });

        //设置复选框
        var tr = $(me).parent().parent();
        var parentIdAll = tr.attr("parentIdAll");

        var sonModule = Nature.CommonModule.ModuleForRole.FindSonModule(parentIdAll, moduleId);
        var checked = me.checked;
        sonModule.show();
        sonModule.find("input").each(function () {
            this.checked = checked;
        });
    },

    //非一级节点的单击
    Module2Click: function (me) {
        var tr = $(me).parent().parent();
        var moduleId = tr[0].id.replace("tr", "");
        var parentIdAll = tr.attr("parentIdAll");

        Nature.CommonModule.ModuleForRole.FindSonModule(parentIdAll, moduleId);

    },

    //操作按钮的单击事件
    ButtonClick: function (me) {
        //alert(me.id);
        var moduleId = me.id.substring(6, me.id.length -2);
        //alert(moduleId);
        //找到父节点里的复选框
        var parentIds = $("#tr" + moduleId).attr("parentidall");
        //设置父节点的复选框为选中
        parentIds = "#chk" + moduleId + parentIds.replace( /,/g , ",#chk");
        $(parentIds).each(function () {
            this.checked = true;
        });
    },

    //查找指定节点的所有子子节点
    FindSonModule: function (parentIdAll, moduleId) {
        var tmpPath = parentIdAll + moduleId;
        var trSon = $("#moduleGrid tr[parentIdAll*='" + tmpPath + ",']");
        if (trSon.length > 0) {
            if (trSon[0].style.display == "none")
                trSon.show();
            else
                trSon.hide();
        }
        return trSon;

    },

    //提交到服务器保存数据
    SaveData: function () {
        //遍历模块复选框

        var roleInfo = Nature.CommonModule.ModuleForRole.roleInfo;
        roleInfo.unUseModuleID = "";
        roleInfo.UseModuleID = "";


        $("#moduleGrid input[name='moduleID'] ").each(function () {
            var moduleId = this.id.replace("chk", "");
            if (!this.checked) {
                //没选中
                roleInfo.unUseModuleID += moduleId + ",";

            } else {
                //选中了
                roleInfo.UseModuleID += moduleId + ",";

                //看对应的按钮是否选中
                roleInfo["btn" + moduleId] = "";
                var hasInput = 0;
                $("#b" + moduleId + " input").each(function () {
                    hasInput = 1;
                    var buttonId = this.id.replace("chkBtn", "");
                    if (this.checked) {
                        //选中了
                        roleInfo["btn" + moduleId] += buttonId + ",";
                    }
                });

                if (roleInfo["btn" + moduleId].length == 0 && hasInput == 1)
                    roleInfo["btn" + moduleId] = "-9";

            }
        });

        //提交数据
        var para = $.getUrlParameter();
        //保存角色到模块、按钮
        var urlPara = "action=RoleInfo&mdid=" + para.mdid + "&mpvid=" + para.mpvid + "&fpvid=" + para.fpvid + "&bid=" + para.bid + "&id=" + para.id + "&frid=" + para.frid;

        $.ajax({
            type: "POST",
            url: "PostRoleData.ashx?" + urlPara,
            data: roleInfo,
            dataType: "text",
            cache: false,
            //timeout: 2000,
            error: function () {
                alert('提交表单信息的时候发生错误！');
                if (typeof top.spinStop != "undefined")
                    top.spinStop();
            },

            success: function (msg) {
                //alert(msg);
                var re = eval("(" + msg + ")");
                if (re.err.length == 0) {
                    alert("保存成功！");
                    //清空表单
                } else {
                    alert(re.err);
                }

                if (typeof (callback) != "undefined") {
                    callback();
                }
            }
        });


    },


    //修改的时候绑定数据
    DataBind: function (dataSource) {
        //alert(RoleModuleInfo.datakeys);

        //设置以及节点是否选中，加载选中的节点的子子节点，然后绑定子子节点，还有按钮，要绑定的太多了。
        var i = 0;
        var moduleIds = dataSource.moduleIDs;

        //设置选中节点
        for (i = 0; i < moduleIds.length; i++) {
            $("#chk" + moduleIds[i])[0].checked = true;
        }

        var btnKey = dataSource.roleModuleButtonIDskeys;

        for (i = 0; i < btnKey.length; i++) {
            var buttonIds = dataSource.roleModuleButtonIDs[btnKey[i]].ButtonIDs.split(",");
            //设置选中节点
            for (var j = 0; j < buttonIds.length; j++) {
                if ($("#chkBtn" + buttonIds[j]).length > 0)
                    $("#chkBtn" + buttonIds[j])[0].checked = true;
            }
        }
    }
};
     