	 
	function btnSearch()
	{
		var sch = document.getElementById("div_Search");
		
		if (sch.style.display == "none")
			sch.style.display = "";
		else
			sch.style.display = "none";
			
		if (document.getElementById("divMain"))
		{
			divInit();
		}
		
		if (parent)
		{
			if (parent.document.getElementById("iFrm_List"))
				parent.document.getElementById("iFrm_List").height = document.body.scrollHeight*1 +10;
			
			if (parent.parent)
			{
				if (parent.parent.document.getElementById("iFrm_Tab"))
					parent.parent.document.getElementById("iFrm_Tab").height = document.body.scrollHeight*1 +40;
			}
		}
		
	}

	function DeleteData(url, mdId, dpvId, btnId) {
	    //alert(DataID);
		if (confirm('您确定要删除吗？'))
		{
			//var re = "height=10,width=10,top=-200,left=-200,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no,directories=no";
		    var tmpUrl = url + "?mdid=" + mdId + "&mpvid=" + dpvId + "&fpvid=0&bid=" + btnId + "&id=" + DataID + "&frid=-2";
		    parent.document.getElementById("ifrm_Del").src = tmpUrl;
			
		}
	}
	
	function btnExcel()
	{
		document.getElementById("Btn_ToExcel").click();
	}
	
	function btnAccess()
	{
		document.getElementById("Btn_ToAccess").click();
}


function ReloadForDel(isClose) {
    //alert("ReloadForDel");
    //parent.window.ReloadForDel(isClose);
}

function ReloadForUpdate() {
    //alert("ReloadForUpdate");
    //parent.window.ReloadForUpdate();
}
function ReloadFirst(isClose) {
    //alert("ReloadFirst");
    //parent.window.ReloadFirst(isClose);
}
  

function myEsc(kind) {
    if (kind)
        if (kind == "reload") {
            var btn = opener.document.getElementById("Btn_Reload");
            btn.click();
        }

    if (opener)
        window.close();
    else
        parent.window.close();
}
