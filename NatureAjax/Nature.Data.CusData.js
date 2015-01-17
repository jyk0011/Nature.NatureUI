
/*
* ajax的方式维护客户数据。
* 

*/

/*
参数格式：
*/

var ajaxData = {
    title: "",              /* 如果访问出错，弹出提示框的标题和提示信息，建议不要省略 */
    url: "",                /* 访问的url地址，省略的话采用默认值 “/Data/GetData.ashx” */
    cache: true,            /* false \ true*/
    urlPata: {},               /* url参数 */
    formPata: {},               /* 发送的数据 */
    success: function () {   /* 访问成功执行的函数 */
    },
    error: function () {   /* 访问失败执行的函数 */
    }
};

Nature.Data.CusData = function () {

    var ajax = Nature.Ajax;
    
    this.ajaxSaveData = function (ajaxData) {
        
        ajaxData.url = "/SSOapp/PostData.ashx?url=data&" + ajaxData.urlPara;
        ajaxData.cache = false;
        ajaxData.formData = ajaxData.data;

        ajax(ajaxData);
         
        
    };
     
    //获取客户数据
    this.ajaxGetData = function(ajaxData) {

        //增删改查服务的网址
        var url = Nature.resourceUrl;
        if (typeof ajaxData.url == "undefined")
            url += "/Data/GetData.ashx";
        else
            url += ajaxData.url;

        ajaxData.url = url;
        ajaxData.cache = false;

        ajax(ajaxData);
        
    };
    
    /*删除数据*/
    this.ajaxDeleteData = function (ajaxData) {
        var url = Nature.resourceUrl;
        
        if (typeof ajaxData.url == "undefined")
            url += "/Data/GetData.ashx";
        else
            url += ajaxData.url;
        
        ajaxData.url = url;
        ajaxData.cache = false;

        ajax(ajaxData);
    };
    

}