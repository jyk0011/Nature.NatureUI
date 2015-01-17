/*
* 角色管理里的角色到字段的增删改
* 角色 到 列表字段、查询字段、表单字段
* 

*/

Nature.CommonModule.ModuleForRoleColumns = {
    RoleModuleInfo: {},   //模块信息

    RoleModuleButtonInfo: {},   //模块对应的按钮信息

    pvId: "",
    mId: "",
    rId: "",
    btnId: "",

    pvIdFt: "",
    mIdFt: "",
    rIdFt: "",
    btnIdFt: "",
    osIDFt: "",
    //
    ShowColumns: function (pageViewId, moduleId, osId, roleId, buttonId) {
        pvId = pageViewId;
        mId = moduleId,
        rId = roleId;
        btnId = buttonId;

        //获取页面视图字段信息
        getColumnsInfo(function (msg) {
            getRoleToColumns(function (msg2) {
                //alert($("#gridCol").length);
                //创建角色到字段的div
                $("#gridCol").show();
                $("#filterList").hide();

                createRoleColumns(msg, msg2);

            });
        });

        function createRoleColumns(msg, msg2) {
            var key = msg.datakeys;
            var gridCol; var btnSave; var btnEsc;

            if ($("#gridCol").length == 0) {
                var zindex = $.getDivIndexHighest();
                //绘制一个div
                gridCol = $("<div>");
                gridCol.html("<span>一个都不选，表示不做权限到字段<br></span><div id=\"divcheck\"><div>").attr("id", "gridCol")  //设置一些属性
                        .css("position", "absolute").css("border", "1px solid #99bbe8").css("padding", "5px")
                        .width("300").css("z-index", zindex + 1);

                $(document.body).append(gridCol);

                btnSave = $("<input type=\"button\" value=\"保存权限到字段\">");
                gridCol.append(btnSave);
                btnEsc = $("<input type=\"button\" value=\" 取 消 \">");
                gridCol.append(btnEsc);

                btnSave.click(function () {
                    //保存权限到字段
                    saveRoleCol(gridCol);
                });

                btnEsc.click(function () {
                    //取消，
                    $("#gridCol").hide();
                });

            } else {
                gridCol = $("#gridCol");
                btnSave = gridCol.find("input:button").eq(0);
                btnEsc = gridCol.find("input:button").eq(1);
                gridCol.find("label").remove();
            }

            //没有字段，不显示
            if (key.length == 0) {
                gridCol.hide();
                return;
            } else {
                gridCol.show();
            }
            //定位
            var tdOffset = $("#" + osId).offset();
            tdOffset.top += 30;
            tdOffset.left -= 5;

            gridCol.offset(tdOffset);

            gridCol.height(key.length * 20 + 50);
            gridCol.drag({ isDragTmpDiv: false, isShowBg: false });

            //添加列表
            var checkbox = "<label style=\"\"><input type=\"checkbox\" id=\"chkcol{columnID}\" name=\"chkcol\" {check}>{title}<br></label>";    //{过滤方案的下拉列表框}
            var tmpCheckbox;

            var roleCols = "";
            if (msg2.datakeys.length > 0)
                roleCols = msg2.data[msg2.datakeys[0]].ColumnIDs;   //角色到字段，选中的字段

            var divcheck2 = $("#divcheck");
            for (var i = 0; i < key.length; i++) {
                var colMeta = msg.data[key[i]];
                tmpCheckbox = checkbox.replace(/\{columnID\}/g, colMeta.ColumnID);
                tmpCheckbox = tmpCheckbox.replace(/\{title\}/g, colMeta.ColName);
                var tmpColId = colMeta.ColumnID + "c";
                tmpColId = tmpColId.replace("c", "");
                if (roleCols.indexOf(tmpColId) >= 0) {
                    tmpCheckbox = tmpCheckbox.replace(/\{check\}/g, "checked=\"checked\"");
                } else {
                    tmpCheckbox = tmpCheckbox.replace(/\{check\}/g, "");
                }
                divcheck2.append(tmpCheckbox);
            }
        }

        //保存权限到字段
        function saveRoleCol(gridCol) {
            var col = gridCol.find("input:checkbox");
            var colIds = "";
            col.each(function (a) {
                if (this.checked) {
                    var colId = this.id.replace("chkcol", "");
                    colIds += colId + ",";
                }
            });

            if (colIds.length > 1)
                colIds = colIds.substring(0, colIds.length - 1);

            var roleCol = {
                PVId: pvId,
                buttonId: btnId,
                moduleId: mId,
                roleId: rId,
                ColumnIDs: colIds
            };

            //保存权限到字段
            var urlPara = "action=SaveRoleCol&mdid=-201&mpvid=" + pvId + "&fpvid=0&bid=0&id=" + rId + "&frid=-2";

            Nature.CommonModule.ModuleForRoleColumns.SavePermission(urlPara, roleCol, function () {
                if (typeof (callback) != "undefined") {
                    callback();
                }
            });
             
        }

        //提取视图的字段
        function getColumnsInfo(callback) {
            //绑定
            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "/JsonServer/GetData.ashx?action=metalistrole&mdid=2&hasKey=1&mpvid=-20105&fpvid=-20106&id=" + pvId,     //math.random()
                data: { c1010020: pvId },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的页面视图的字段信息的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    callback(msg);
                }
            });
        }

        //提取角色涉及的字段
        function getRoleToColumns(callback) {
            //如果是修改角色的话，绑定

            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "/JsonServer/GetData.ashx?action=rolelist&mdid=2&hasKey=1&mpvid=-20108&fpvid=-20109&id=" + pvId,     //math.random()
                data: { c1104020: rId, c1104030: mId, c1104050: pvId, c1104055: btnId },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的页面视图的字段信息的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    callback(msg);
                }
            });
        }

    },

    //选择过滤方案，for列表视图
    ShowFilterForPageView: function (pageViewId, moduleId, osId, roleId, buttonId) {
        //V_FU_List_FilterForRolePageView
        pvIdFt = pageViewId;
        mIdFt = moduleId,
        rIdFt = roleId;
        btnIdFt = buttonId;
        osIDFt = osId;

        getFilterPv(function (msg) {
            getFilterPv2(function (msg2) {
                $("#gridCol").hide();
                $("#filterList").show();
                createFilter(msg, msg2);

            });
        });

        //创建过滤方案列表
        function createFilter(msg, msg2) {
            var key = msg.datakeys;

            var filterList; var btnFilterSave; var btnFilterEsc;

            if ($("#filterList").length == 0) {
                var zindex = $.getDivIndexHighest();
                //绘制一个div
                filterList = $("<div>");
                filterList.html(" <div id=\"divcheckFilter\"><div>").attr("id", "filterList")  //设置一些属性
                        .css("position", "absolute").css("border", "1px solid #99bbe8").css("padding", "5px")
                        .width("300").css("z-index", zindex + 1);

                $(document.body).append(filterList);

                btnFilterSave = $("<input type=\"button\" value=\"保存列表过滤方案\">");
                filterList.append(btnFilterSave);
                btnFilterEsc = $("<input type=\"button\" value=\" 取 消 \">");
                filterList.append(btnFilterEsc);

                btnFilterSave.click(function () {
                    //保存权限到字段
                    saveFilterList(filterList);
                });

                btnFilterEsc.click(function () {
                    //取消，
                    $("#filterList").hide();
                });

            } else {
                filterList = $("#filterList");
                btnFilterSave = filterList.find("input:button").eq(0);
                btnFilterEsc = filterList.find("input:button").eq(1);
                filterList.find("label").remove();
            }

            var divcheck2 = $("#divcheckFilter");

            //没有字段，不显示
            divcheck2.find("#spNoFilter").remove();
            if (key.length == 0) {
                divcheck2.append("<span id=\"spNoFilter\">没有对应的过滤方案</span>");
            }
            //定位
            var tdOffsetFt = $("#" + osIDFt).offset();
            tdOffsetFt.top += 30;
            tdOffsetFt.left -= 5;

            filterList.offset(tdOffsetFt);

            filterList.height(key.length * 20 + 50);
            filterList.drag({ isDragTmpDiv: false, isShowBg: false });

            //添加列表
            var checkbox = "<label style=\"\"><input type=\"radio\" id=\"rdo{columnID}\" name=\"rdo\" {check}>{title}<br></label>";
            var tmpCheckbox;

            var roleCols = "";
            if (typeof(msg2.datakeys) != "undefined" )
                if (msg2.datakeys.length > 0)
                    roleCols = msg2.data[msg2.datakeys[0]].FilterCaseID;   //角色到字段，选中的字段

            if (key.length > 0) {
                //添加不选的选项
                var checkbox2 = "<label style=\"\"><input type=\"radio\" id=\"rdo0\" name=\"rdo\" >不选择<br></label>";
                divcheck2.append(checkbox2);
            }

            for (var i = 0; i < key.length; i++) {
                var colMeta = msg.data[key[i]];
                tmpCheckbox = checkbox.replace(/\{columnID\}/g, colMeta.FilterCaseID);
                tmpCheckbox = tmpCheckbox.replace(/\{title\}/g, colMeta.FilterCaseName);
                var tmpColId = colMeta.FilterCaseID;
                if (roleCols == tmpColId) {
                    tmpCheckbox = tmpCheckbox.replace(/\{check\}/g, "checked=\"checked\"");
                } else {
                    tmpCheckbox = tmpCheckbox.replace(/\{check\}/g, "");
                }
                divcheck2.append(tmpCheckbox);

            }


        }

        //保存列表的过滤方案
        function saveFilterList(gridCol) {
            var col = gridCol.find("input:radio");
            var filterId = "";
            col.each(function (a) {
                if (this.checked) {
                    var colId = this.id.replace("rdo", "");
                    filterId += colId + ",";
                }
            });

            if (filterId.length > 1)
                filterId = filterId.substring(0, filterId.length - 1);

            alert(filterId);
            var roleCol = {
                roleId: rIdFt,
                moduleId: mIdFt,
                PVId: pvIdFt,
                FilterID: filterId
            };

            //保存列表页面视图的过滤方案
            var urlPara = "action=ListPageViewFilter&mdid=-201&mpvid=" + pvIdFt + "&fpvid=0&bid=0&id=" + rIdFt + "&frid=-2";

            Nature.CommonModule.ModuleForRoleColumns.SavePermission(urlPara, roleCol, function() {
                if (typeof (callback) != "undefined") {
                    callback();
                }
            });
            
            
        }

        //提取页面视图的过滤方案
        function getFilterPv(callback) {
            //如果是修改角色的话，绑定

            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "/JsonServer/GetData.ashx?action=rolelist&mdid=2&hasKey=1&mpvid=-20110&fpvid=-20111&id=" + pvIdFt,     //math.random()
                data: { c1110030: pvIdFt },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的页面视图的字段信息的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    callback(msg);
                }
            });
        }

        //提取页面视图的涉及的字段
        function getFilterPv2(callback) {
            //如果是修改角色的话，绑定

            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "/JsonServer/GetData.ashx?action=rolelist&mdid=2&hasKey=1&mpvid=-20112&fpvid=-20113&id=" + pvIdFt,     //math.random()
                data: { 1114020: rIdFt, c1114030: mIdFt, c1114050: pvIdFt },
                //timeout: 2000,
                error: function () {
                    alert("获取角色维护里的页面视图的字段信息的时候发生错误！");
                    if (typeof top.spinStop != "undefined")
                        top.spinStop();
                },
                success: function (msg) {
                    callback(msg);
                }
            });
        }

    },

    SavePermission: function (urlPara, roleCol, callback) {
        $.ajax({
            type: "POST",
            url: "PostRoleData.ashx?" + urlPara,
            data: roleCol,
            dataType: "text",
            cache: false,
            //timeout: 2000,
            error: function () {
                alert('提交表单信息的时候发生错误！');
                if (typeof top.spinStop != "undefined")
                    top.spinStop();
            },

            success: function (msgre) {
                //alert(msg);
                var re = eval("(" + msgre + ")");
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

    }
};
     