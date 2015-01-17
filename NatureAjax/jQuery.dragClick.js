/*
* 实现拖拽功能。
* $("#divID").drag();// divID：要移动的容器的ID
* $("#divID").drag("spanID");// divID：要移动的容器的ID；spanID：移动是拖拽的对象

*/

jQuery.fn.extend({
    dragDown: function(objDragId,callback) {
        //var bool = false;
        var pageX = 0;
        var pageY = 0;
        var oldOff = { top: 1, legt: 1 };
        var indexMax = $.getDivIndexHighest();

        var isDrag = false;

        this.each(function() {
            var objMove = $(this); //移动对象

            var objDrag = objMove; //拖拽对象
            if (objDragId) objDrag = $("#" + objDragId);

            $(document).mousemove(function(e) {
                 if (isDrag)
                     dragMove(e);
            }).dblclick(function(e) {
                
               if (isDrag == false) {
                    //原来没有拖拽，单击一下，开始拖拽
                    //alert(objDrag[0].id);
                    //dragDown(e);
                    //isDrag = true;
                } else {
                    //拖拽中，单击后结束拖拽
                    isDrag = false;
                    drapUp();
                    callback();
                }

            });

            objDrag.click(function(e) {
                if (isDrag == false) {
                    //原来没有拖拽，单击一下，开始拖拽
                    //alert(objDrag[0].id);
                    dragDown(e);
                    
                    setTimeout(function(){isDrag = true;}, 100);
                    
                } else {
                    //拖拽中，单击后结束拖拽
                    //drapUp();
                   // isDrag = false;
                }

            })
                .mousemove(function () {
                    objDrag.css("cursor", "move");
                });

            function dragDown(e) {

                if (document.all)
                    document.onselectstart = new Function("return false");

                objMove.css("z-index", indexMax + 2);

                var tmpdiv = $("<div>");
                tmpdiv.html("拖拽中").attr("id", "divdrop")
                    .css("position", "absolute").css("background-color", "#fff")
                    .css("opacity", ".90").css("filter", "alpha(opacity=90)/9")
                    .css("border", "1px solid #99bbe8").css("cursor", "move")
                    .offset(objMove.offset())
                    .width(objMove.width() + 10 + "px").height(objMove.height()+ 10 + "px")
                    .mouseup(function () {
                        if (isDrag == false) {
                            //原来没有拖拽，单击一下，开始拖拽
                            //alert(objDrag[0].id);
                            //dragDown(e);
                            //isDrag = true;
                        } else {
                            //拖拽中，单击后结束拖拽
                            isDrag = false;
                            drapUp();
                            callback();
                        }
                    })
                    .css("z-index", indexMax + 3);

                //objMove.after(tmpdiv); //.css("position", "absolute");
                $(document.body).append(tmpdiv); //.css("position", "absolute");

                //bool = true;
                pageX = e.pageX;
                pageY = e.pageY;

                oldOff = objMove.offset();

                return false;
            }

            function dragMove(e) {
                
                var x = e.pageX - pageX;
                var y = e.pageY - pageY;

                var off = { top: 1, legt: 1 }; //oldOff.clone(); // objMove.offset();
                off.left = oldOff.left + x;
                off.top = oldOff.top + y;
                $("#divdrop").offset(off);
            }

            function drapUp() {
                //bool = false;

                objMove.offset($("#divdrop").offset());
                $("#divdrop,#divdropBG").remove();
                indexMax = $.getDivIndexHighest();
                objMove.css("z-index", indexMax + 1);
                if (document.all)
                    document.onselectstart = new Function("return true");

            }


        });

    }
});
 
 