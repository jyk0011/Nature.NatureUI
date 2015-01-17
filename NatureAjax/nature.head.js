/*
* 定义。
* 
 
*/

Nature.jsState = "";    //加载js的几种情况，1：本页加载，2：父页加载

Nature.Event = { };     //index页面用的事件注册
Nature.Control = {};    // 表单里的子控件，文本框、下拉列表框等
Nature.Controls = {};   // 按钮组、表单控件、查询控件、分页控件等
Nature.Debug = { };     //显示debug信息
Nature.Page = {};
Nature.Data = {};

Nature.ManagerData = {};  //新的数据管理类库，数据缓存和数据加载等。

Nature.Controls.ButtonBar = {};    // 操作按钮
Nature.Controls.Find = {};      // 查询控件
Nature.Controls.Form = {};      // 添加、修改表单
Nature.Controls.Grid = {};      // 数据列表
Nature.Controls.QuickPager = {};// 分页控件

Nature.Page.Tab = {};       // 标签tab
Nature.Page.Tree = {};      // 树状功能菜单

Nature.Pager = {};          //页面基类

// 分页需要的信息
//Nature.Page.QuickPager.PageInfo = function () {
//};

Nature.CommonModule = {}; //共用模块
Nature.CommonModule.ModuleForRole = {};         //角色维护里的模块列表、功能按钮
Nature.CommonModule.ModuleForRoleColumns = {};  //角色维护里的列表字段，表单字段等

Nature.CommonFunction = {};
 
Nature.CommonFunction = {
    /*判断使用哪个key。全都没打挑，视为都可以使用*/
    GetPermissionKey: function (colAll, colPermission) {
        var key = "";
        if (colPermission != undefined) {
            if (colPermission == "admin")
                key = colAll;
            else {
                if (colPermission.length == 0)
                    key = colAll;
                else
                    key = colPermission;

            }
        }
        else
            key = [];

        return key;

    },
    
    /*必须打挑的才能用*/
    GetPermissionKey2: function (colAll, colPermission) {
        var key = "";
        if (colPermission != undefined) {
            if (colPermission == "admin")
                key = colAll;
            else {
                key = colPermission;
            }
        }
        else
            key = [];

        return key;

    },
    
    //判断是否超时，回调返回状态
    isTimeOut: function (callback) {
        
        $.ajax({
            url: "/ssoapp/getUserName.ashx",
            type: "GET",
            dataType: "text",
            data: {},
            error: function () {
                alert("出错了");
            },
            success: function (data) {
                var info = {};
                if (data.substring(0, 2) == "{,") {
                    info.state = "3";
                } else {
                    info = eval("(" + data + ")");
                    if (info.msg == "没有登录")
                        info.state = "3";

                    else if (info.id != "")
                        info.state = "1";

                }

                callback(info);
            }
        });
         
    }
    
   
};


Date.prototype.format = function (format) {

    if (this * 1 == -2209017600000)
        return "未设置";
    
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


Date.prototype.AddDays = function( value) {
    this.setDate(this.getDate() + value * 1);
    return this;
};

// 增加月
Date.prototype.AddMonths = function( value) {
    this.setMonth(this.getMonth() + value * 1);
    return this;
};

// 增加年
Date.prototype.AddYears = function( value) {
    this.setFullYear(this.getFullYear() + value * 1);
    return this;
};

// 是否为今天 
Date.prototype.IsToday = function() {
    return this.IsDateEquals( new Date());
};


//计算相差的天数。
// date :年月日，不能带时间。date比this晚了多少天
Date.prototype.DayCount = function (date) {
    var re = (date - new Date(this.format("yyyy-MM-dd"))) / 3600000 / 24;
    return re;
};


// 判断日期是否相等 
Date.prototype.IsDateEquals = function( date2) {
    return this.getDate() == date2.getDate() && this.IsMonthEquals(date2);
};

// 是否为当月 
Date.prototype.IsThisMonth = function () {
    return this.IsMonthEquals(this, new Date());
};

// 两个日期的年是否相等 
Date.prototype.IsMonthEquals = function (date2) {
    return this.getMonth() == date2.getMonth() && this.getFullYear() == date2.getFullYear();
};

// 返回某个日期对应的月份的天数 
Date.prototype.GetMonthDayCount = function() {
    switch (this.getMonth() + 1) {
    case 1:case 3:case 5:case 7:case 8:case 10:case 12:
        return 31;
    case 4:case 6:case 9:case 11:
        return 30;
    }
    //feb: 
    date = new Date(date);
    var lastd = 28;
    this.setDate(29);
    while (date.getMonth() == 1) {
        lastd++;
        AddDays(date, 1);
    }
    return lastd;
};

// 返回两位数的年份 
Date.prototype.GetHarfYear = function() {
    var v = this.getYear();
    if (v > 9) return v.toString();
    return "0" + v;
};

// 返回月份（修正为两位数） 
Date.prototype.GetFullMonth = function() {
    var v = this.getMonth() + 1;
    if (v > 9) return v.toString();
    return "0" + v;
};

// 返回日 （修正为两位数） 
Date.prototype.GetFullDate = function() {
    var v = this.getDate();
    if (v > 9) return v.toString();
    return "0" + v;
};

/*数字格式化*/
/*数字格式化 可以加逗号，和控制小数位数
  s：要格式化的数字
  n：小数位数 0,2-20。0：不要小数
  d：逗号的间隔，一般是千分位，但是万分位更好的可读性，所以两种都实现了。0：不加逗号；3：千分位；4：万分位
  */
Nature.numFormat = function (s, n, d) {
    var zhengshu; var xiaoshu; var i; var j; var t = s;
    if (typeof s == "undefined") {
        return 0;
    }
    
    s = s.toString();
    if (s == "") {
        return 0;
    }
    
    if (n == 0) {
        if (d != 0) {
            /*整数的格式化*/
            zhengshu = s.split(".")[0].split(""),
            t = "";
            j = 1;
            for (i = zhengshu.length - 1; i >= 0; i--) {
                t = zhengshu[i] + t;

                if (j++ == d && i != 0)
                    t = "," + t;

                if (j > d) j = 1;
            }
        }
        return t.replace("-,", "-");
        
    } else {
        /*小数的格式化*/
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        zhengshu = s.split(".")[0].split("").reverse(),
        xiaoshu = s.split(".")[1];
        t = "";
        for (i = 0; i < zhengshu.length; i++) {
            t += zhengshu[i] + ((i + 1) % d == 0 && (i + 1) != zhengshu.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + xiaoshu;
    }

};

/*定义自己的alert*/
window._alert = window.alert;
window.alert = function(msg,callback) {

    var indexMax = $.getDivIndexHighest(undefined, top.window.document);

    var myBody = $(top.window.document.body);

    var bg = $('<div id="Masklayer"  ></div>');
    var layerBox = $('<div id="layerBox" style="">');
    var layerTitle = $('<div class="layerBoxTitle"><span>温馨提示</span></div>');
    var layerClose = $('<a href="#" class="layerBoxclosebtn" >关闭</a>');
    var layerHtml = $('<div class="layerBoxCon">' + msg + '</div>');
    var autoClose = $('<span><br><br>3秒后自动关闭。点击停止计时。<span>');

    if (layerBox.length == 0){
        _alert(msg);
        return;
    }
    
    /*可以拖拽*/
    layerBox.drag({ titleBar: layerTitle });
    /*事件冒泡*/
    layerClose.mousedown(function (e) {
        e.stopPropagation();
    });
    
    /*整合div*/
    layerTitle.append(layerClose);
    layerHtml.append(autoClose);

    layerBox.append(layerTitle);
    layerBox.append(layerHtml);

    /*背景div*/
    var bh = myBody.height();
    var bw = myBody.width();
    bg.css({ height: bh, width: bw,"z-index":indexMax,background: "#fff"});
    layerBox.css({ "z-index": indexMax + 1, display: "block",cursor:"point" });

    /*追加到最外面的window*/
    myBody.append(bg);
    myBody.append(layerBox);

    /*背景淡出*/
    bg.fadeIn("fast");

    /*关闭对话框*/
    layerClose.click(function () {
        layerBox.remove();
        bg.remove();
        if (typeof callback == "function") callback();
    });

    /*停止倒计时*/
    autoClose.click(function () {
        isStop = true;
    });
    
    /*自动关闭*/
    var closeTime = 3000;
    var step = 1000;
    var isStop = false;
    
    function ct() {
        if (isStop) {/*倒计时是可以停止的*/
            autoClose.html('<span style=""><br><br>已经停止倒计时。<span>');
            return;
        }
        
        if (closeTime == 0) {
            layerBox.remove();
            bg.remove();
            if (typeof callback == "function") callback();
        } else {
            closeTime -= step;
            //autoClose.html('<span style="cursor:pointer;"><br><br>' + Nature.numFormat(closeTime / 1000,0 ) + '秒后自动关闭。点击停止计时。<span>');
            if (!isStop)
                top.window.setTimeout(ct, step);
        }
    }
    
    top.window.setTimeout(ct, 10);

}