/*
* ajax删除记录
 2013-2-25
*/

 
//moduleId, mpvid, fpvid, url

Nature.Page.DeleteData = {
    //物理删除记录 btnInfo
    del: function (btnInfo, dataId, dataBaseId, callback) {
        //绑定数据

        var action = "logic";
        if (btnInfo.BtnTypeID == 404)
            action = "physically";
        var loadM = new Nature.Data.Manager();

        loadM.ajaxDeleteData({
            url: btnInfo.URL,
            urlPara: {
                "action": action,
                "mdid": btnInfo.OpenModuleID,
                "mpvid": btnInfo.OpenPageViewID,
                "id": dataId,
                "dbid": dataBaseId
            },
            success: function (msg) {
                //alert(msg);
                callback(msg);
            }
        });

    }


}

 