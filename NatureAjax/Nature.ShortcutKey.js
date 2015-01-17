/*
* 注册快捷键 
* 先注册快捷键，然后当按了对应的按钮的时候，可以触发对应的事件。
* by jyk 2013-5-21
*/

Nature.ShortcutKey = function () {

    var self = this;
    
    this.keyPress = {
        key: {
            arguments: "",
            event: function() {
            }
        }
    };
    
    //注册快捷键。按钮的ascii码，
    this.reg = function(key, event, args,doc) {

        //注册快捷键
        switch (typeof(key)) {
        case "number":
            //数字
            self.keyPress[key] = { arguments: args, event: event };
            break;
        case "string":
            //字符串
            self.keyPress[key] = { arguments: args, event: event };
        case "object":
            //数组，不详细判断了。
            for (var i = 0; i < key.length; i++) {
                self.keyPress[key[i]] = { arguments: args, event: event };
            }
            break;
        }

        var doc1 = doc;
        if (typeof doc1 == "undefined") doc1 = document;
        
        $(doc1).keydown(function (e) {
            e.stopPropagation();
            var ikeyCode = e.keyCode;
            //if (ikeyCode == 116)
            //    return false;

            //假如下面类型的dom获得焦点，不触发事件
            var src = e.srcElement || e.currentTarget;
            switch (src.type) {
                case "text":
                case "hidden":
                case "password":
                case "file":
                case "textarea":
                case "checkbox":
                case "radio":
                case "select-one":
                case "select-multiple":
                    if (ikeyCode == 13) {
                        return false;
                    } else
                        return;
                    break;
            }

            if (typeof (self.keyPress[ikeyCode]) != "undefined") {
                var arg = self.keyPress[ikeyCode].arguments;
                if (typeof arg == "undefined")
                    self.keyPress[ikeyCode].event(ikeyCode, arg);
                else {
                    self.keyPress[ikeyCode].event(arg);
                }
            }
            //alert(ikeyCode);

        });
    };
    

    
    
};
