/*
* QuickPager分页控件的js处理
* 加载模板、设置模板、读取数据、绑定事件

*  

*/


Nature.Controls.QuickPager = function (pEvent) {

    //分页的事件
    var pagerEvent = {
        control: [],            //存放分页控件的div的jQuery对象，可以是多个，上下分页效果
        ctrlJsonMeta: {},       //查询控件的配置信息
         
        lastPageno: 0,          //最后一页页号
        thisPageIndex: 1,       //页号，从 1 开始

        timeSpace:800,          //两次按键的时间间隔的允许间隔，超过间隔无效
        onkeyStart: 0,          //按键开始的时间
        pNo:""  ,               //快捷键，要翻的页号

        //分页模板的路径
        UIPath: "/Scripts/QuickPager/PageTurn1.htm" + Nature.jsVer,
        //加载状态开始
        spinStart: function () {},
        //加载状态结束
        spinStop: function () {},

        
        onPagerTurn: function () { }
        
    };
   
    //按钮的jQuery对象
    var pagerUI = { };
    
    //设置按钮的事件和属性
    var init = function ( ) {
        
        if (typeof(pEvent.divID) == "undefined") {
            pagerEvent.divID = [];
            pagerEvent.divID.push("divQuickPage");
        } else {
            pagerEvent.divID = pEvent.divID;
        }
        
        if (typeof (pEvent.control) == "undefined") {
            pagerEvent.control = [];
            pagerEvent.control.push($("#divQuickPage"));
        } else {
            pagerEvent.control = pEvent.control;
        }
        
        if (typeof (pEvent.UIPath) != "undefined") pagerEvent.UIPath = pEvent.UIPath;

        if (typeof (pEvent.onPagerTurn) != "undefined") pagerEvent.onPagerTurn = pEvent.onPagerTurn;
        if (typeof (pEvent.spinStart) != "undefined") pagerEvent.spinStart = pEvent.spinStart;
        if (typeof (pEvent.spinStop) != "undefined") pagerEvent.spinStop = pEvent.spinStop;
         
        var pager = pagerEvent.control[0];
        
        pagerUI = {
            pager: pager,
            recordCount:pager.find("#recordCount"),
            pagerCount: pager.find("#pagerCount"),
            pagerIndex: pager.find("#pagerIndex"),
            pagerSize:  pager.find("#pagerSize"),
            navi:       pager.find("#navi"),
            first:      pager.find("#first"),
            prev:       pager.find("#prev"),
            next:       pager.find("#next"),
            last:       pager.find("#last"),
            txtGo:      pager.find("#txtGo"),
            spanGo:     pager.find("#spanGo")
        };
        
        //regKey();
    };

    this.onKeyBefore = function(keyCode) {
        switch (keyCode) {
            case 33:case 34:/*home*/case 36:/*end*/case 35:
                pageNext(keyCode);
                break;
            default:
                var tmpNo = "";
                if (keyCode == 48 || keyCode == 96) {
                    tmpNo = 0;  
                }else if (keyCode >= 49 && keyCode <= 57) {
                    tmpNo = keyCode - 48;
                }else if (keyCode >= 97 && keyCode <= 105) {
                    tmpNo = keyCode - 96;
                }
                
                if (pagerEvent.onkeyStart == 0) {
                    //第一次按钮
                    pagerEvent.pNo = tmpNo;
                    window.setTimeout(function () {
                        pagerEvent.onkeyStart = 0;
                        onKey(pagerEvent.pNo);
                    }, pagerEvent.timeSpace);
                    pagerEvent.onkeyStart = 1;
                } else {
                    //第二次按钮
                    pagerEvent.onkeyStart = 1;
                    pagerEvent.pNo = pagerEvent.pNo.toString() + tmpNo.toString();
                    
                }
              
                break;
        }
    };

    //上下页
    var pageNext = function (keyCode) {
        var txt = pagerUI.txtGo;
        var oldNo = parseInt(txt.val());
        switch (keyCode) {
            //case 37:
            case 33: fristOnKey(oldNo, txt, 2);  break;
                //case 39:
            case 34: nextOnKey(oldNo, txt, 3);   break;
                /*home*/
            case 36: fristOnKey(oldNo, txt, 1);  break;
                /*end*/
            case 35: nextOnKey(oldNo, txt, 4);   break;
        }

        var newNo = parseInt(txt.val());
        if (newNo < 1) newNo = 1;
        if (newNo > pagerEvent.lastPageno) newNo = pagerEvent.lastPageno;
        txt.val(newNo);
        if (oldNo != newNo)
            pagerEvent.onPagerTurn(newNo, pagerEvent.thisPageIndex);

    };
    
    //直接进入指定页
    var onKey = function(pNo) {
        
        var oldNo = parseInt(pagerUI.txtGo.val());

        var newNo = parseInt(pNo);
        if (newNo < 1) newNo = 1;
        if (newNo > pagerEvent.lastPageno) newNo = pagerEvent.lastPageno;
        pagerUI.txtGo.val(newNo);
        if (oldNo != newNo)
            pagerEvent.onPagerTurn(newNo, pagerEvent.thisPageIndex); 

    };

    //上一页、首页
    var fristOnKey = function (oldNo, txt, kind) {
        if (kind == 2) {
            //上一页
            if (oldNo > 1) {
                oldNo = oldNo - 1;
                txt.val(oldNo);
                return;
            }
        } else if (kind == 1) {
            //首页
            txt.val(1);
            return;
        }

        if (oldNo == 1) {
            var isF = window.confirm("已经是第一页了，您要翻到最后一页吗？\n单击“确定”：按钮翻到最后一页。\n单击“取消”不翻页");
            if (isF) txt.val(pagerEvent.lastPageno);
        } 
    };
    
    //下一页、末页
    var nextOnKey = function (oldNo, txt, kind) {
        if (kind == 3) {
            //下一页
            if (oldNo <= pagerEvent.lastPageno - 1) {
                oldNo = oldNo + 1;
                txt.val(oldNo);
                return;
            }
        } else if (kind == 4) {
            //末页
            txt.val(pagerEvent.lastPageno);
            return;
        }

        if (oldNo == pagerEvent.lastPageno) {
            var isF = window.confirm("已经是最后一页了，您要翻到第一页吗？\n单击“确定”：按钮翻到第一页。\n单击“取消”不翻页");
            if (isF) txt.val(1);
        }
    };

    //初始化
    init();

    //获取当前页号
    this.getPageIndex = function() {
        return pagerEvent.thisPageIndex;
    };
    
    //获取分页信息
    this.getPagerInfo = pagerEvent;

    //开始加载模板
    this.LoadPagerTemplate = function (callback) {
        $.get(pagerEvent.UIPath, function (data) {
            pagerUI.pager.html(data);
           
            if (typeof(callback) != "undefined")
                callback();
           
        });
    },
    
    //设置分页UI
    this.setPagerUI = function (pageTurn, callback) {

        var pager = pagerUI.pager;

        pagerUI.recordCount = pager.find("#recordCount");
        pagerUI.pagerCount = pager.find("#pagerCount");
        pagerUI.pagerIndex = pager.find("#pagerIndex");
        pagerUI.pagerSize = pager.find("#pagerSize");
        pagerUI.navi = pager.find("#navi");
        pagerUI.first = pager.find("#first");
        pagerUI.prev = pager.find("#prev");
        pagerUI.next = pager.find("#next");
        pagerUI.last = pager.find("#last");
        pagerUI.txtGo = pager.find("#txtGo");
        pagerUI.spanGo = pager.find("#spanGo");
        
        //计算页数
        pageTurn.pageCount = Math.floor((pageTurn.recordCount + pageTurn.pageSize - 1) / pageTurn.pageSize);    //+ (pageTurn.recordCount % pageTurn.pageSize) ==0;

        if (pagerEvent.thisPageIndex > pageTurn.pageCount) {
            pageTurn.pageIndex = pageTurn.pageCount;
            pagerEvent.thisPageIndex = pageTurn.pageCount;
        }
        //先移除原先的事件
        pagerUI.first.unbind("click");
        pagerUI.prev.unbind("click");
        pagerUI.next.unbind("click");
        pagerUI.last.unbind("click");
        pagerUI.spanGo.unbind("click");
        
        //设置按钮事件
        pagerUI.first.click(function () {
            pagerEvent.onPagerTurn(1, pagerEvent.thisPageIndex);
        });
        pagerUI.last.click(function () {
            pagerEvent.onPagerTurn(pageTurn.pageCount, pagerEvent.thisPageIndex);
        });
        pagerUI.next.one("click", function () {
            var indexNext = pagerEvent.thisPageIndex + 1;
            if (indexNext > pageTurn.pageCount) indexNext = pageTurn.pageCount;
            pagerEvent.onPagerTurn(indexNext, pagerEvent.thisPageIndex);
        });
        pagerUI.prev.click(function () {
            var indexPrev = pagerEvent.thisPageIndex - 1;
            if (indexPrev < 1) indexPrev = 1;
            pagerEvent.onPagerTurn(indexPrev, pagerEvent.thisPageIndex);
        });

        pagerUI.spanGo.click(function () {
            var pNo = pagerUI.txtGo.val();
            if (pNo < 1) pNo = 1;
            if (pNo > pageTurn.pageCount) pNo = pageTurn.pageCount;
            pagerEvent.onPagerTurn(pNo, pagerEvent.thisPageIndex);
        });

        pagerUI.recordCount.html(pageTurn.recordCount);
        pagerUI.pagerIndex.html(pageTurn.pageIndex);
        pagerUI.pagerCount.html(pageTurn.pageCount);
        pagerUI.pagerSize.html(pageTurn.pageSize);

        pagerUI.txtGo.val(pageTurn.pageIndex);

        pagerEvent.lastPageno = pageTurn.pageCount;
        pagerEvent.thisPageIndex = pageTurn.pageIndex;

        pagerUI.pager.find("span").css("cursor", "pointer");

        switch (pageTurn.pageIndex) {
        case 1:
            //第一页
            pagerUI.first.addClass("disabled");
            pagerUI.prev.addClass("disabled");
            if (pageTurn.pageCount > 1) {
                pagerUI.next.removeClass("disabled");
                pagerUI.last.removeClass("disabled");
            }
            break;
            
        case pageTurn.pageCount:
            //最后一页
            if (pageTurn.pageCount > 1) {
                pagerUI.first.removeClass("disabled");
                pagerUI.prev.removeClass("disabled");
            }
            pagerUI.next.addClass("disabled");
            pagerUI.last.addClass("disabled");
            break;
        default:
            //不是第一页、最后一页
            pagerUI.first.removeClass("disabled");
            pagerUI.next.removeClass("disabled");
            pagerUI.prev.removeClass("disabled");
            pagerUI.last.removeClass("disabled");
            break;
        }
        
        //页号导航
        var n1 = "<a >{text}</a>"; // $("#P_b1");
        var n2 = "<span class=\"current\">{text}</span>"; // $("#P_b1");
        pagerUI.navi.empty();
        var i;var temp;var s1;var s2;var naviButton;
        
        var naviCount2;
        if ((pageTurn.naviCount % 2) == 1) {
            naviCount2 = pageTurn.naviCount / 2 | 0;
        } else {
            naviCount2 = pageTurn.naviCount / 2;
        }
        if ((pageTurn.pageIndex - naviCount2) < 1) {
            s1 = 1;
            s2 = pageTurn.naviCount;
        } else if ((pageTurn.pageIndex + naviCount2) >= pageTurn.pageCount) {
            s1 = pageTurn.pageCount - pageTurn.naviCount + 1;
            s2 = pageTurn.pageCount;

            if (s1 < 1) s1 = 1;
        } else {
            s1 = pageTurn.pageIndex - naviCount2;
            s2 = pageTurn.pageIndex + naviCount2;

            if (s2 > pageTurn.pageCount) s2 = pageTurn.pageCount;
        }

        if (s2 > pageTurn.pageCount)
            s2 = pageTurn.pageCount;

        if (s1 >= 2) {
            naviButton = $(n1.replace("{text}", 1));
            naviButton.click({ newNo: 1 }, function (info) {
                pagerEvent.onPagerTurn(info.data.newNo, pagerEvent.thisPageIndex);
            });
            pagerUI.navi.append(naviButton);
        }
        
        if (s1 >= 3) {
            naviButton = $(n1.replace("{text}", "…"));
            naviButton.click({ newNo: (s1 - naviCount2 + 1) }, function (info) {
                pagerEvent.onPagerTurn(info.data.newNo, pagerEvent.thisPageIndex);
            });
            pagerUI.navi.append(naviButton);
        }

        for (i = s1; i <= s2; i++) {
            if (i == pageTurn.pageIndex) {/*当前页*/
                temp = n2.replace("{text}", i);
            } else {
                temp = n1.replace("{text}", i);
            }
            
            naviButton = $(temp);
            naviButton.click({ newNo: i }, function (info) {
                pagerEvent.onPagerTurn(info.data.newNo, pagerEvent.thisPageIndex);
            });
            pagerUI.navi.append(naviButton);
        }

        if (s2 <= pageTurn.pageCount - 2) {
            naviButton = $(n1.replace("{text}", "…"));
            naviButton.click({ newNo: (s2 + naviCount2 - 1) }, function (info) {
                pagerEvent.onPagerTurn(info.data.newNo, pagerEvent.thisPageIndex);
            });
            pagerUI.navi.append(naviButton);
        }
        
        if (s2 <= pageTurn.pageCount - 1) {
            temp = n1.replace("{text}", pageTurn.pageCount);
            naviButton = $(temp);
            naviButton.click({ newNo:  pageTurn.pageCount }, function (info) {
                pagerEvent.onPagerTurn(info.data.newNo, pagerEvent.thisPageIndex);
            });
            pagerUI.navi.append(naviButton);
        }

        //设置分页UI的副本
        if (pagerEvent.control.length > 1) {
            var pagerDiv =  pagerEvent.control[0].clone(true);
            for (var iDiv = 1; iDiv < pagerEvent.control.length; iDiv++) {
                pagerEvent.control[iDiv].html(pagerDiv);
            }
        }

        if (typeof(callback) != "undefined")
            callback();
    };
};
 
