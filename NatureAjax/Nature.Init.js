/*
*  自然框架需要的js的初始化
*/

//页面里的控件，比如按钮组、表单控件、分页控件等
Nature.Controls = {};


Function.prototype.before = function(func) {
    var __self = this;
    return function() {
        if (func.apply(this, arguments) === false) {
            return false;
        }
        return __self.apply(this, arguments);
    };
};


Function.prototype.before = function (func) {
    var __self = this;
    return function () {
        var ret = __self.apply(this, arguments);
        if (ret === false) {
            return false;
        }
        func.apply(this, arguments);
        return ret;
    };
};
