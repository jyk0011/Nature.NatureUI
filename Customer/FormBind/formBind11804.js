/*
 添加菜品的销售清单。
 表单处理
 2013-11-26

*/

var myId;
var myDbId;
var myDoc;

/* 给下拉列表框加change事件，ajax获取品牌和类型 */
function cusJsLoad(  formEvent ) {

    myDbId = formEvent.dataBaseId;
    myDoc = formEvent.win.document;
   
    var manMd = new ManageModle(formEvent.win.doc); //var prodCate = new ProductCategory(formEvent, commandControlInfo);

    manMd.init(formEvent);
 

}


var ManageModle = function (doc) {
    //this.loadM = new Nature.Data.Manager();
    var self = this;
    this.doc = doc;
    
    var trtd = $("#tr4014020", doc);
    trtd.find("td:eq(0)").attr("width", "100px");
    $("#tr4014075").hide();

    this.unit1 = $("#ctrl_4014050", doc);   //称重单位
    this.unit2 = $("#ctrl_4014040", doc);   //销售单位
    this.singeHight = $("#ctrl_4014060", doc);   //单个重量
    this.guige = $("#ctrl_4014080", doc);   //单个重量

    this.baozhuang = $("#ctrl_4014070", doc); //包装方式
    
    this.tr = self.unit1.parent().parent();

    this.yuan = this.tr.find("td:eq(1)");
    this.yuan.html(this.yuan.html().replace("：", ""));
    this.an = this.tr.find("td:eq(3)");
    this.an.html(this.an.html().replace("：", ""));
    hideSingeHight();
    
    this.unit1.change(function() {
        var u1 = $(this);
        var u2 = self.unit2;
         
        if (u1.val() == u2.val()) {
            hideSingeHight();
        } else {
            showSingeHight(u2.val());
        }
    });
    
    this.unit2.change(function () {
        var u2 = $(this);
        var u1 = self.unit1;
        
        if (u1.val() == u2.val()) {
            hideSingeHight();
        } else {
            showSingeHight(u2.val());
        }
    });
    
    //包装方式的变化，引起一斤占箱数的显示和隐藏
    this.baozhuang.change(function () {
        var lst = $(this);

        if (lst.val() == "1") {
            $("#tr4014075").hide(300);
            $("#ctrl_4014075").val(0);

        } else {
            $("#tr4014075").show(300);
        }
    });


    function hideSingeHight() {
        self.singeHight.val(1).hide();
        self.tr.find("td:eq(5),td:eq(6),td:eq(7)").hide();
    }
    
    function showSingeHight(unit) {
        self.singeHight.show();
        self.tr.find("td:eq(5),td:eq(6),td:eq(7)").show();
        self.tr.find("td:eq(5)").html("一" + unit);

        if (self.guige.val() == "") {
            self.guige.val("一" + unit + "xx到xx");
        }

    }
};

ManageModle.prototype.init = function (formEvent) {
    var self = this;

  
    
};
      