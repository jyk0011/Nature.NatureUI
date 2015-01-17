////////////////////////////////////////////////////////////////////////////////
/*
 *--------------- 客户端表单通用验证CheckForm(oForm) -----------------
 * 功能:通用验证所有的表单元素.
 * 使用:
 *    <form name="form1" onsubmit="return CheckForm(this)">
 *    <input type="text" name="id" check="^S+$" warning="id不能为空,且不能含有空格">
 *    <input type="submit">
 *    </form>
 * author:wanghr100(灰豆宝宝.net)
 * email:wanghr100@126.com
 * update:19:28 2004-8-23
 * 注意:写正则表达式时一定要小心.不要让"有心人"有空子钻.
 * 已实现功能:
 * 对text,password,hidden,file,textarea,select,radio,checkbox进行合法性验证
 * 待实现功能:把正则表式写成个库.
 *--------------- 客户端表单通用验证CheckForm(oForm) -----------------
 */
////////////////////////////////////////////////////////////////////////////////

//主函数
function CheckForm() {
    
	var oForm;
	if (window.navigator.appName.toLowerCase().indexOf("microsoft") > -1) {
	    oForm = document.forms["dataForm"];
	}
	else {
		oForm = document.forms["dataForm"];
	}
    var els = oForm.elements;
    //遍历所有表元素
    for(var i=0;i<els.length;i++) {
        //是否需要验证
        var myCheck = els[i].getAttribute("check");
        if (typeof (myCheck) != "undefined" && typeof (myCheck) != "object")
        {
            //取得验证的正则字符串
            var sReg = myCheck;
            //取得表单的值,用通用取值函数
            var sVal = GetValue(els[i]);
            //字符串->正则表达式,不区分大小写
            var reg = new RegExp(sReg,"i");
            if(!reg.test(sVal))
            {
                //验证不通过,弹出提示warning
                alert(els[i].getAttribute("warning"));
                //该表单元素取得焦点,用通用返回函数
                GoBack(els[i]);
                return false;
            }
        }
    }
    return true;
}

//通用取值函数分三类进行取值
//文本输入框,直接取值el.value
//单多选,遍历所有选项取得被选中的个数返回结果"00"表示选中两个
//单多下拉菜单,遍历所有选项取得被选中的个数返回结果"0"表示选中一个
function GetValue(el)
{
    //取得表单元素的类型
    var sType = el.type;
    switch(sType)
    {
        case "text":
        case "hidden":
        case "password":
        case "file":
        case "textarea": return el.value;
        case "checkbox":
        case "radio": return getValueChoose(el);
        case "select-one":return el.value;
        case "select-multiple": return getValueSel(el);
    }
    //取得radio,checkbox的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
    function getValueChoose(el)
    {
        var sValue = "";
        //取得第一个元素的name,搜索这个元素组
        var tmpels = document.getElementsByName(el.name);
        for(var i=0;i<tmpels.length;i++)
        {
            if(tmpels[i].checked)
            {
                sValue += "0";
            }
        }
        return sValue;
    }
    //取得select的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
    function getValueSel(el)
    {
        var sValue = "";
        for(var i=0;i<el.options.length;i++)
        {
            //单选下拉框提示选项设置为value=""
            if(el.options[i].selected && el.options[i].value!="")
            {
                sValue += "0";
            }
        }
        return sValue;
    }
}

//通用返回函数,验证没通过返回的效果.分三类进行取值
//文本输入框,光标定位在文本输入框的末尾
//单多选,第一选项取得焦点
//单多下拉菜单,取得焦点
function GoBack(el) {
    //取得表单元素的类型
    var sType = el.type;
    switch (sType) {
        case "text":
        case "hidden":
        case "password":
        case "file":
        case "textarea":
            el.focus();
            //var rng = el.createTextRange();
            //rng.collapse(false);
            //rng.select();
            break;
        case "checkbox":
        case "radio": var els = document.getElementsByName(el.name); els[0].focus();
            break;

        case "select-one":
        case "select-multiple": el.focus();
            break;

    }
}


//========================================

var   sel="",timer=null;

function go() {
    var k = window.event.keyCode;

    if (k == 13) {
        window.event.keyCode = 9;
    }

}

function SelectPY() {
    with (window.event) {
        with (srcElement) {
            //alert(keyCode);
            //if(keyCode<48)return;   
            //if(keyCode>95)keyCode-=48   
            aaa = keyCode + 32;
            sel += String.fromCharCode(aaa);
            window.status = sel;
            for (i = 0; i < length; i++) {
                if (options[i].text.indexOf(sel) == 0) {
                    selectedIndex = i;
                    break;
                }
            }
        }
        returnValue = false;
        clearTimeout(timer);
        timer = setTimeout("sel=''", 1000);
    }
}

function GoAndSelectPY() {
    var k = window.event.keyCode;

    if (k == 13) {
        window.event.keyCode = 9;
    } else {
        with (window.event) {
            with (srcElement) {
                //alert(keyCode);
                if (keyCode < 48) return;
                //if(keyCode>95)keyCode-=48   
                aaa = keyCode + 32;
                sel += String.fromCharCode(aaa);
                window.status = sel;
                for (i = 0; i < length; i++) {
                    if (options[i].text.indexOf(sel) == 0) {
                        selectedIndex = i;
                        break;
                    }
                }
            }
            returnValue = false;
            clearTimeout(timer);
            timer = setTimeout("sel=''", 1500);
        }
    }
}

function GoAndNum()               
{
	var   k=window.event.keyCode;   
								
	if  ((k==46)||(k==8)||(k==189)||(k==109)||(k==190)||(k==110)|| (k>=48 && k<=57)||(k>=96 && k<=105)||(k>=37 && k<=40)) 
	{}
	else if(k==13)
	{
		window.event.keyCode = 9;
	}
	else
	{
	
		window.event.returnValue = false;
	}
}
function onlyNum()     
{
	var   k=window.event.keyCode;   
								
	if  ((k==46)||(k==8)||(k==189)||(k==109)||(k==190)||(k==110)|| (k>=48 && k<=57)||(k>=96 && k<=105)||(k>=37 && k<=40)) 
	{}
	
	else
	{
		window.event.returnValue = false;
	}
}
