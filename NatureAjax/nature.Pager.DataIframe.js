
var dataID = -2;
var frid = -2;
 
var para;
   
function myIframeLoad() {
    //alert("js加载完毕，可以进行后续操作");
    if (typeof (top) != "undefined")
        top.spinStart();

    para = $.getUrlParameter(document);
          
    //注册层级关系
    if (typeof(para.bid) == "undefined") {
        //tab自带的列表，不处理
    } else {
        //列表页打开的列表
        if (typeof (top.mainEvent.tab["tab" + para.ppvid]) != "undefined") {
            //第一层
            top.mainEvent.tabDiv["btn" + para.bid] = {
                "parentIdPath": [para.ppvid],
                "sonId": []
            };

        } else {
            //大于第一层
            //父节点
            var parentPv = top.mainEvent.tabDiv["btn" + para.ppvid];

            if (typeof parentPv != "undefined") {
                var tmpPath = parentPv.parentIdPath.concat();
                tmpPath.push(para.ppvid);

                //创建本节点，并且设置父节点路径
                top.mainEvent.tabDiv["btn" + para.bid] = {
                    "parentIdPath": tmpPath,
                    "sonId": []
                };
            }
        }
    }

}

     
function listCloseSon() {
    //alert("closeSon");
}
 