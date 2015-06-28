/**
 * Created by v-kshe on 6/18/2015.
 */

var Util = function () {
    return {
        IsArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        GetElement: function (by, from) {
            if (by == '') return from;
            var s = by.charAt(0);
            // if '#id':
            if (s == '#') return document.getElementById(by.substr(1));
            var eleArr = [];
            // if 'tag.class...':
            if (s != '.') {
                var classbegin = by.indexOf('.');
                var tagname = (classbegin == -1 ? by : by.substring(0, classbegin));
                if (this.IsArray(from) === false) return from.getElementsByTagName(tagname);
                var fromLen = from.length;
                for (var i = 0; i < fromLen; i++) {
                    var tmpArr = from[i].getElementsByTagName(tagname);
                    var tmpArrLen = tmpArr.length;
                    while (tmpArrLen > 0) {
                        eleArr.push(tmpArr.shift());
                        tmpArrLen--;
                    }
                }
                if (classbegin == -1) return eleArr;
                return this.GetElement(by.substr(classbegin), eleArr);
            }
            // if '.class...':
            var nextclassbegin = by.indexOf('.', 1);
            var classname = (nextclassbegin == -1 ? by.substr(1) : by.substring(1, nextclassbegin));
            if (this.IsArray(from) === false) return from.getElementsByClassName(classname);
            var fromLen = from.length;
            for (var i = 0; i < fromLen; i++) {
                var tmpArr = from[i].getElementsByClassName(classname);
                var tmpArrLen = tmpArr.length;
                while (tmpArrLen > 0) {
                    eleArr.push(tmpArr.shift());
                    tmpArrLen--;
                }
            }
            if (nextclassbegin == -1) return eleArr;
            return this.GetElement(by.substr(nextclassbegin), eleArr);
        },

        /**
         * a simple implementation of selector
         * only support tag, #id, .class, and tag.class, .class1.class2 as a piece of selector
         * @param sels
         * @param parent
         * @returns {*}
         */
        Select: function (sels, parent) {
            if (!parent) {
                if (sels.charAt(0) == '#') return document.getElementById(sels.substr(1));
                if (sels.charAt(0) == '.' && sels.indexOf(' ') == -1) return document.getElementsByClassName(sels.substr(1));
                parent = document;
            }
            var selectors = sels.split(' ');
            var len = selectors.length;
            while (len > 0) {
                var s = selectors.shift();
                len--;
                if (s == '') continue;
                parent = this.GetElement(s, parent);
            }
            return parent;
        }
    };
}();

/**
 * Below is by Dean Edwards.
 */
function addEvent (element, type, handler) {
    // 为每一个事件处理函数分派一个唯一的ID
    if (!handler.$$guid) handler.$$guid = addEvent.guid++;
    // 为元素的事件类型创建一个哈希表
    if (!element.events) element.events = {};
    // 为每一个"元素/事件"对创建一个事件处理程序的哈希表
    var handlers = element.events[type];
    if (!handlers) {
        handlers = element.events[type] = {};
        // 存储存在的事件处理函数(如果有)
        if (element["on" + type]) {
            handlers[0] = element["on" + type];
        }
    }
    // 将事件处理函数存入哈希表
    handlers[handler.$$guid] = handler;
    // 指派一个全局的事件处理函数来做所有的工作
    element["on" + type] = handleEvent;
};
// 用来创建唯一的ID的计数器
addEvent.guid = 1;
function removeEvent (element, type, handler) {
    // 从哈希表中删除事件处理函数
    if (element.events && element.events[type]) {
        delete element.events[type][handler.$$guid];
    }
};
function handleEvent (event) {
    var returnValue = true;
    // 抓获事件对象(IE使用全局事件对象)
    event = event || fixEvent(window.event);
    // 取得事件处理函数的哈希表的引用
    var handlers = this.events[event.type];
    // 执行每一个处理函数
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};
// 为IE的事件对象添加一些“缺失的”函数
function fixEvent (event) {
    // 添加标准的W3C方法
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function () {
    this.returnValue = false;
};
fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
};