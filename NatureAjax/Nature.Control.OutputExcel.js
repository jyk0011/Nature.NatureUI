/*
*  导出excel的脚本，目前只支持chrome
*  利用UI和ajax来实现
*  
*  
*  
*/

Nature.Control.OutputExcel = function (win) {
    var self = this;
    this.info = {
        win: win,                   //所在window
        doc: win.document,          //所在document
        hideDiv: [],                //需要隐藏的对象数组
        excelTipDiv: "",            //进度提示
        excelTip: "",               //进度提示
        gridTable: undefined,       //显示数据的表格
        excelTitle: undefined,      //excel用的table的表头
        excelData: [],              //excel用的数据，记录多了的话，无法一次导出，所以分成多份，每页一个数组
        excelMaxLength: 1800000,       //一个excel文件的最大值 差不多1.5MB
        hasCheckBox: false,         //第一列是否有复选框
        pagerNoStart: 1,            //开始导出的页号
        pagerNoEnd: 1               //结束导出的页号
    };

    var info = this.info;
    //<div class="System-prompts"> </div>
    var tipInit = function () {
        info.excelTipDiv = $('<div class="prompts_01 p_position" style=\"z-index:100000;margin-left:200px;\"><h2 class="promapts_title">导出excel<a href="#">X</a></h2><p id="outputTip">进度提示</p><div class="prompts_btn"><a href="javascript:void(0)">&nbsp;</a></div></div><div class="prompts_yy"></div>');
        $(info.doc.body).append(info.excelTipDiv);

        info.excelTip = $("#outputTip", info.doc);

    };

    var setTip = function (tip) {
        info.excelTip.html(tip);
    };

    //初始化设置
    this.init = function () {
        this.info.gridTable.hide();
        for (var i = 0; i < info.hideDiv.length; i++) {
            info.hideDiv[i].hide();
        }

        if (this.info.gridTable.find("input[type='checkbox']").length > 0)
            this.info.hasCheckBox = true;

        //创建table，并且导入表头
        this.info.excelTitle = $("<table>");
        var th = this.info.gridTable.find("tr:first").clone();
        if (this.info.hasCheckBox == true)
            th.find("th:first").remove();

        this.info.excelTitle.append(th);

        tipInit();
    };

    //把当前页的数据保存到excelData 
    this.inputExcelData = function (pagerIndex) {
        if (pagerIndex == info.pagerNoEnd) {
          
        } else
            setTip("一共" + info.pagerNoEnd + "页，正在导出第 " + pagerIndex + " 页...");

        var tmpTable = $("<table>");
        self.info.gridTable.find("tr").each(function (j) {
            if (j == 0) return true;
            var tr = $(this);
            if (self.info.hasCheckBox) tr.find("td:first").remove();
            tmpTable.append(tr);
            return true;
        });
        
        self.info.excelData.push(tmpTable);
    };

    //保存excel文件
    this.saveExcel = function (fileName) {
        //把每一份 excelData 变成字符串，累加统计，看看是否超出，和分成几份文件
        //如果一份直接输出
        //如果多份。先输出头，在输出身体，最后输出结尾。最最后输出copy.bat文件

        var excelCount = 1;         //分成了多少份。
        
        var excel = '<table rules="all"   border="1">' ;
        
        var tableBody = [];
        var tmpTableBody = "";
        var tableBodyIndex = 0;

        var tables = self.info.excelData;

        var allowLength = info.excelMaxLength;
        
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i].html();
            if (allowLength - table.length > 0) {
                //没超出，记录限额。
                allowLength = allowLength - table.length;
                tmpTableBody += table;

            } else {
                //超出了结算
                tableBody.push(tmpTableBody);
                allowLength = info.excelMaxLength - table.length;  //重置限额
                tmpTableBody = table;      //清空后记录
                
            }
        }
        
        tableBody.push(tmpTableBody);
        
        //给出提示
        if (tableBody.length == 1) {
            setTip("一共" + info.pagerNoEnd + "页，已经全部导出！<br>3秒后自动关闭本对话框。");

            for (var i1 = 0; i1 < info.hideDiv.length; i1++) {
                info.hideDiv[i1].show();
            }
             
            info.win.setTimeout(function() {
                info.excelTipDiv.remove();
                info.gridTable.show();

            }, 3000);
        } else {
            setTip("由于数据比较多，所以分成" + tableBody.length + "份文件导出。请先保存文件，然后单击 “合并文件”， 把多份excel文件合并成一个excel文件。<br>6秒后自动关闭本对话框。");
            for (var i1 = 0; i1 < info.hideDiv.length; i1++) {
                info.hideDiv[i1].show();
            }

            info.win.setTimeout(function () {
                info.excelTipDiv.remove();
                info.gridTable.show();

            }, 6000);
        }
        //提示完毕

        //判断是几份文件
        if (tableBody.length == 1) {
            //只有一份
            outputExcel("<table rules=\"all\"   border=\"1\">" + self.info.excelTitle.html() + tmpTableBody + "</table>", fileName);
        } else {
            
            //有多份，先输出表头，在输出多个身体，最后输出结尾，最后是合并文件
          
            //合并文件的脚本
            var dosCopy = "copy /b " + fileName + ".1 ";
            
            for (var j = 0;j< tableBody.length ;j++) {
                var fileNames = fileName + "." + (j + 1);
                
                if (j == 0) {
                    //第一个
                    //表头
                    outputExcel("<table rules=\"all\"   border=\"1\">" + self.info.excelTitle.html() + tableBody[j], fileNames);
                }
                else if (j == tableBody.length - 1) {
                    //最后一个
                    outputExcel(tableBody[j] + "</table>", fileNames);
                    dosCopy += " + " + fileNames;
                } else {
                    //不是最后一个
                    outputExcel(tableBody[j], fileNames);
                    dosCopy += " + " + fileNames;
                }
            }

            outputExcel(dosCopy + " " + fileName, "合并文件.bat");

        }

        //导出了
        function outputExcel(excels, file) {

            var feff = "";
            if (file.indexOf(".xls") > 1) feff = "\ufeff";
            
            var uri = 'data:text/csv;charset=utf-8,' + feff + excels;//+ "</table>"; \ufeff
            var downloadLink = info.doc.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = file; //"export.xls"; 
            info.doc.body.appendChild(downloadLink);
            downloadLink.click();
            info.doc.body.removeChild(downloadLink);
        }
    };

};