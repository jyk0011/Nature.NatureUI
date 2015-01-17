/*
 
 客服代开报单的添加菜品

*/

var myId;
var myDbId;
var myDoc;

/* 给下拉列表框加change事件，ajax获取品牌和类型 */
function cusJsLoad(  formEvent ) {

    myDbId = formEvent.dataBaseId;
    myDoc = formEvent.win.document;

    var div = $("#div_Mod_16502", top.document);

    div.css("left", "50px");


    var txtCai = $("#ctrl_4086040_txt", myDoc);
    txtCai.click();
    
     
    
    var divCaiList = $("#div_Mod_16511", top.document);

    divCaiList.css("left", "470px");


    var btnClose = $("#BtnClose", myDoc);

    formEvent.win.setTimeout(function() {
        btnClose.unbind("click");
        btnClose.click(function() {
            divCaiList.remove();
        });

    },500);

}
 
      