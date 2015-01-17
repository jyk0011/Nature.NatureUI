
/*tab
Show: function () {
},
Hide: function () {
},
Close: function () {
*/

/*grid
loadFrist: function () {
},
loadThis: function () {
},
closeSon: function () {
*/

Nature.Event = {
    
    //注册tab的事件
    TabEvents: {},
    addTabEvent: function (moduleId, e1, e2, e3) {
        Nature.Event.TabEvents[moduleId].show = e1;
        Nature.Event.TabEvents[moduleId].hide = e2;
        Nature.Event.TabEvents[moduleId].close = e3;

    },

    //注册列表页面的事件
    GridEvents: {},
    addGridEvents: function (moduleId, e1, e2, e3) {
        Nature.Event.GridEvents[moduleId] = {};
        Nature.Event.GridEvents[moduleId].listloadFirst = e1;
        Nature.Event.GridEvents[moduleId].listLoadThis = e2;
        Nature.Event.GridEvents[moduleId].listCloseSon = e3;

    }
    



}