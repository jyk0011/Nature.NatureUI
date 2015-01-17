/*
* 实现拖拽功能。
* $("#divID").drag();// divID：要移动的容器的ID
* $("#divID").drag("spanID");// divID：要移动的容器的ID；spanID：移动是拖拽的对象

var act = document.activeElement.id;  

*/

jQuery.fn.extend({
    drag: function (info) {
        var isDraging = false;          //是否在拖拽中
        var oldXy = { x: 0, y: 0 };          //开始拖拽是光标的坐标
        var oldOff = { top: 1, legt: 1 };   //移动对象一开始的左上角的坐标
        var indexMax = 1; // $.getDivIndexHighest(); z-index属性。
        var thisDrag;           //实时拖拽的对象
        var xy = { old: { top: 0, left: 0 }, now: { top: 0, left: 0} };

        var tip;        //显示信息
        
        //默认设置
        var defaultConfig = {
            titleBar: "",           //拖拽对象的ID
            dragType: "down",        //拖拽方式。down ：按下鼠标拖拽，抬起鼠标结束；click：单击鼠标开始，再次单击鼠标结束。
            isDragTmpDiv: true,
            isShowBg: true,           //是否设置透明背景
            lockXy: "",               //锁定方向。"":不锁定；"x":锁定x方向，只能上下拖拽；"y":锁定y方向，只能左右拖动
            window:window ,           //所在的窗口
            document: document,           //所在的窗口
            callback: function (xy) {
            }                           //回调事件
        };

        if (typeof (info) == "undefined")
            info = defaultConfig;
        else {
            if (typeof (info.dragType) == "undefined") 
                info.dragType = defaultConfig.dragType;
            
            if (typeof (info.isDragTmpDiv) == "undefined") 
                info.isDragTmpDiv = defaultConfig.isDragTmpDiv;
            
            if (typeof (info.titleBar) == "undefined") 
                info.titleBar = defaultConfig.titleBar;
            
            if (typeof (info.lockXy) == "undefined") 
                info.lockXy = defaultConfig.lockXy;
            
            if (typeof (info.window) == "undefined")
                info.window = window;

            if (typeof (info.document) == "undefined")
                info.document = document;
           
            info.jDoc = $(info.document);
            info.jBody = $(info.document.body);
            
            if (typeof (info.isShowBg) == "undefined") 
                info.isShowBg = defaultConfig.isShowBg;
            
        }

        this.each(function () {
            var objMove = $(this, info.jDoc); //移动对象
            var objDrag = objMove; //拖拽对象
            //如果没有设置拖拽对象，那么把移动对象看做拖拽对象

            //alert(typeof(info.titleBar));
            if (typeof (info.titleBar) == "string") {
                if (info.titleBar.length > 0) objDrag = $("#" + info.titleBar, info.document );
            } else if (typeof (info.titleBar) != "undefined") {
                objDrag = info.titleBar;
            }
            info.jDoc.mousemove(function (e) {
                dragIng(e);
                //e.stopPropagation();
            }).dblclick(function(e) {
                //双击鼠标，强制结束拖拽
                dragEnd();
                //e.stopPropagation();
            });

            objDrag.mousemove(function (e) {
                //鼠标经过，改变光标样式
                objDrag.css("cursor", "move");
                //e.stopPropagation();
            });

            //设置拖拽方式
            if (info.dragType == "down") {
                //按下开始，抬起结束
                objDrag.mousedown(function (e) {
                    //开始拖拽
                    //e.stopPropagation();
                    
                    //window.setTimeout(function () {
                    //    if ($("#" + objMove[0].id).length > 0)
                    //        dragStart(e);
                    //}, 150);
                    
                    window.setTimeout(function () {
                        dragStart(e);
                    }, 20);
                    
                    //dragStart(e);

                    return false;

                }).mouseup(function (e) {
                    //结束拖拽
                    dragEnd();
                    //e.stopPropagation();
                   
                });

            } else if (info.dragType == "click") {
                //单击开始，再次单击结束
                objDrag.click(function (e) {
                    if (isDraging == false) {
                        //原来没有拖拽，单击一下，开始拖拽
                        dragStart(e);
                        isDraging = true;
                    } else {
                        dragEnd();

                    }
                });

            }

            function dragStart(e) {
                //如果是IE，设置不可选中（chrome里面怎么设置不允许选中呀？）
                if (info.document.all)
                    info.document.onselectstart = new Function("return false");
                else {
                    info.jBody.css("-moz-user-select", "none");
                    objDrag.css("-moz-user-select", "none");
                    objMove.css("-moz-user-select", "none");
                    //thisDrag.css("-moz-user-select", "none");
                }
                indexMax = $.getDivIndexHighest(undefined , info.document );
                objMove.css("z-index", indexMax + 2);

                var doc = info.jDoc;
                var divBg = $("<div>");     //设置一个透明背景层
                divBg.attr("id", "divdropBG").html("")  //设置一些属性
                    .css("position", "absolute").css("left", 0).css("top", 0)
                    .width(doc.width()).height(doc.height())
                    .css("z-index", indexMax + 1);

                if (info.isShowBg)
                    info.jBody.append(divBg);

                var padding;
                var widthOff = 0;
                var heightOff = 0;

                padding = objMove.css("padding-top");
                if (typeof padding != "undefined")
                    heightOff += padding.replace("px", "") * 1;
                 
                padding = objMove.css("padding-bottom");
                if (typeof padding != "undefined")
                    heightOff += padding.replace("px", "") * 1;

                padding = objMove.css("padding-left");
                if (typeof padding != "undefined")
                    widthOff += padding.replace("px", "") * 1;

                padding = objMove.css("padding-right");
                if (typeof padding != "undefined")
                    widthOff += padding.replace("px", "") * 1;
                   
                var tmpDragDiv = $("<div>");
                tmpDragDiv.html("拖拽中").attr("id", "divdrop")
                    .css("position", "absolute").css("background-color", "#fff")
                    .css("opacity", ".60").css("filter", "alpha(opacity=60)/9")
                    .css("border", "1px solid #99bbe8").css("cursor", "move")
                    .css("margin-left","auto").css("margin-right","auto")
                    .css("text-algin", "center")
                    .offset(objMove.offset())
                    .width(objMove.width() * 1 + widthOff * 1).height(objMove.height() * 1 + heightOff * 1)
                    .css("z-index", indexMax + 3);

                tip = tmpDragDiv;
                if (info.isDragTmpDiv) {
                    //拖拽替身
                    thisDrag = tmpDragDiv;
                    info.jBody.append(thisDrag); //把替身加到页面
                } else {
                    //拖拽自己
                    thisDrag = objMove;
                }

                //设置拖拽方式
                if (info.dragType == "down") {
                    //按下开始，抬起结束。这里是抬起事件，结束拖拽
                    tmpDragDiv.mouseup(dragEnd);
                } else if (info.dragType == "click") {
                    //单击开始，再次单击结束
                    if (info.isDragTmpDiv) {
                        thisDrag.click(function (e) {
                            if (isDraging) {
                                //拖拽中，单击一下，结束拖拽
                                dragEnd();
                            } else {
                                //原来没有拖拽，单击一下，开始拖拽
                                //dragStart(e);
                            }
                        });
                    }
                }

                isDraging = true;    //开始拖拽
                //记录当前鼠标的坐标
                oldXy.x = e.pageX;
                oldXy.y = e.pageY;

                oldOff = objMove.offset();

                return false;
            }

            function dragIng(e) {
                if (!isDraging) return;

                //拖拽中，记录鼠标偏移量
                var x = e.pageX - oldXy.x;
                var y = e.pageY - oldXy.y;

                var off = { top: 0, legt: 0 }; //oldOff.clone(); // objMove.offset();

                if (info.lockXy == "x") {
                    //上下移动
                    off.left = oldOff.left;
                    off.top = oldOff.top + y;
                } else if (info.lockXy == "y") {
                    //左右移动
                    off.left = oldOff.left + x;
                    off.top = oldOff.top;
                } else {
                    off.left = oldOff.left + x;
                    off.top = oldOff.top + y;
                }

                //移动替身
                thisDrag.offset(off);

                //tip.html("X:" + e.pageX + " Y:" + e.pageY);
            }

            function dragEnd() {
                if (!isDraging) return;
                //结束拖拽
                isDraging = false;

                if (info.isDragTmpDiv) {//拖拽替身，设置原型的位置
                    objMove.offset(thisDrag.offset());
                }

                if (typeof (xy) != "undefined") {   //记录左上角坐标
                    xy.now = objMove.offset();
                    xy.old = oldOff;
                }

                $("#divdrop,#divdropBG", info.document).remove();
                indexMax = $.getDivIndexHighest(undefined,info.document );
                objMove.css("z-index", indexMax + 1);

                //如果是IE，恢复可选中。（如果一开始就是不允许选中的话，那么这里就……）
                if (info.document .all)
                    info.document.onselectstart = new Function("return true");
                else {
                    info.jBody.css("-moz-user-select", "");
                    objDrag.css("-moz-user-select", "");
                    objMove.css("-moz-user-select", "");
                }

                if (typeof (info.callback) != "undefined") {
                    info.callback(xy);
                }
            }

        });
    }
});


 