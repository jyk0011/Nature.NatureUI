/*
* js文件和css文件的路径，和对应的代号。
* 可以通过更改版本号（ver = "?v=1.0"）来更新客户端的缓存。
* 1、jsURL：js文件的调用网址，设置别名方便修改和调用

*/


var ver = "?v=1.0";

var jsURL = {
    "jQuery":               Nature.resourceUrl + '/Scripts/jquery-1.8.2.min.js', 
    "my97":                 Nature.resourceUrl + "/Scripts/My97DatePicker/WdatePicker.js?v=1.0",
    "spin":                 Nature.resourceUrl + "/Scripts/spin.min.js?v=1.0",
    "command":              Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.command.js" + ver,
    "lockTable":            Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.lockTable.js" + ver,
    "drag":                 Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.drag.js" + ver,
    "dragClick":            Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.dragClick.js" + ver,
    "nAjax":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.ajax.js" + ver,
    "nKey":                 Nature.resourceUrl + "/Scripts/NatureAjax/Nature.ShortcutKey.js" + ver,
    "nHead":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.head.js" + ver,
    "nIndex":               Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.Index.js" + ver,
    "nDataList":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.DataList.js" + ver,
    "nDataForm":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.Pager.DataForm.js" + ver,
    "nButton":              Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Button.js" + ver,
    "nCrCtrl":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Base.js" + ver,
    "newButton":            Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.ButtonBar.js" + ver,
    "newFind":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Find.js" + ver,
    "newForm":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Form.js" + ver,
    "newGrid":              Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Grid.js" + ver,
    "newGridf":             Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.Grid.Format.js" + ver,
    "nDataSource":          Nature.resourceUrl + "/Scripts/NatureAjax/Nature.Control.DataSource.js" + ver,
    "nDel":                 Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.DeleteData.js" + ver,
    "nTab":                 Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Tab.js" + ver,
    "nTree":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.Page.Tree.js" + ver,
    "qPager":               Nature.resourceUrl + "/Scripts/NatureAjax/nature.QuickPager.js" + ver,
    "qnewPager":            Nature.resourceUrl + "/Scripts/NatureAjax/nature.QuickPager2.0.js" + ver,
    "debug":                Nature.resourceUrl + "/Scripts/NatureAjax/nature.Debug.js" + ver,
    "TableTR":              Nature.resourceUrl + "/Scripts/Nature/TableTR.js" + ver,
    "check":                Nature.resourceUrl + "/Scripts/Nature/check.js" + ver,
    "role1":                Nature.resourceUrl + "/Scripts/NatureRole/nature.CommonModule.ModuleForRole.js" + ver,
    "role2":                Nature.resourceUrl + "/Scripts/NatureRole/nature.CommonModule.ModuleForRoleColumns.js" + ver,
    "cookie":               Nature.resourceUrl + "/Scripts/NatureAjax/jQuery.cookie.js" + ver,
                            
    "upload1":              Nature.resourceUrl + "/Scripts/upload/swfobject.js?v=1.0",
    "upload2":              Nature.resourceUrl + "/Scripts/upload/jquery.uploadify.v2.1.0.min.js?v=1.0",
                            
    "edit1":                Nature.resourceUrl + "/Scripts/kindeditor/kindeditor-min.js?v=1.0",
    "edit2":                Nature.resourceUrl + "/Scripts/kindeditor/lang/zh_CN.js?v=1.0",
    "ssoClient":            Nature.ssoUrl + "/SSOApp/mangoSSO.js"  + ver
                             
};                         

var cssURL = {
    "pager":            Nature.resourceUrl + "/Scripts/QuickPager/skin/default/pager.css" + ver,
    "css":              Nature.resourceUrl + "/Scripts/css/css.css" + ver,
    "cssIndex":         Nature.resourceUrl + "/Scripts/css/cssIndex.css" + ver,
    "cssForm":          Nature.resourceUrl + "/Scripts/css/cssForm.css" + ver,
    "cssList":          Nature.resourceUrl + "/Scripts/css/cssList.css" + ver,
    "upload1":          Nature.resourceUrl + "/Scripts/upload/css/default.css" + ver,
    "upload2":          Nature.resourceUrl + "/Scripts/upload/css/uploadify.css" + ver,
    "cssIndexList":     Nature.resourceUrl + "/Scripts/css/cssIndexList.css" + ver
};