/*
 使用iframe + form 实现跨域post提交
 现在想实现text的历史记录
*/


Nature.Controls.Form.prototype.Post = function (jsonValue, urlPara) {
    if (typeof top != "undefined")
        if (typeof top.spinStart != "undefined")
            top.spinStart();
    
    //创建iframe
    var ifrm = $("<iframe id=\"" + this.formEvent.divID + "_ifrmPost\" style=\"height:1px;\" >").appendTo($(this.formEvent.window.document.body));
    //var body = ifrm.children()[0][1];
    var content = "<html><head>" +
            "<head><body>ddddd<div id=\"postForm\"></div></body></html>";

    var iframe = ifrm[0];
    
    //注意：ie必须要用javascript:window["contents"]的方式来让其执行js，否则会报init未找到方法
    if (jQuery.browser.msie) {
        iframe.contentWindow.contents = content;
        iframe.src = "javascript:window[\"contents\"]";
    } else {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(content);
        iframe.contentWindow.document.close();
    }
  
    //创建body

    //创建表单
    var div = iframe.contentWindow.document.getElementById("postForm");
    div = $(div);

    var arrPath = location.pathname.split('/');
    var path = "/";
    for (var index = 0; index < arrPath.length - 1; index++) {
        path += arrPath[index] + '/';
    }
    
    var reUrl = "http://" + location.host + path + "repost.htm";
    var myForm = $("<form id=\"form1\" action=\"" + Nature.AjaxConfig.UrlResource + "/data/PostData.ashx?action=savedata&reurl=" + reUrl + "&" + urlPara + "\" method=\"POST\">");
    div.append(myForm);
    
    //创建表单元素，hidden 没有历史记录，text可以有历史记录
    for (var key in jsonValue) {
        myForm.append("<input type=\"text\" name=\"" + key + "\" value=\"" + jsonValue[key] + "\"/>");
    }

    //for (index = 0; index < jsonValue.length; index++) {
    //    var val = jsonValue[index].value;
        
    //    //myForm.append("<input type=\"text\" name=\"" + jsonValue[index].name + "\" value=\"" + jsonValue[index].value + "\"/>");
    //    myForm.append("<input type=\"hidden\" name=\"" + jsonValue[index].name + "\" value=\"" + jsonValue[index].value + "\"/>");
    //}
    
    myForm.append(" <button id=\"submit\" type=\"submit\">提交</button>");

    //提交表单
    div.find("#submit").click();

}