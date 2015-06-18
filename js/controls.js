/**
 * Created by v-kshe on 6/18/2015.
 */

/**
 * 全局静态类
 * 用于声明一个新的类并提供构造函数支持
 * @type {{create: Function}}
 */
var Class = {
    create: function () {
        return function () { // 返回一个函数，代表这个新声明的类的构造函数
            // 一个命名为 initialize 的函数将被这个类实现作为类的构造函数
            this.initialize.apply(this, arguments); // initialize 函数将在实例化一个变量的时候被调用执行
        }
    }
};

/**
 * 消息队列
 * @type {Array}
 */
var messageQueue = [];

/**
 * Dialog 类
 */
var Dialog = Class.create();
Dialog.prototype = {
    initialize: function (type, title, content, choices, callback) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_dialog'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.type = type | 'warning';
        this.title = title | 'dialog';
        this.content = content | '';
        this.choices = choices | ['CANCEL', 'OK'];
        this.callback = callback | function(){};
    },
    render: function () { // 成员函数
        var dialogDom = this.getDialog(this.id, this.content, this.style);
        document.body.appendChild(dialogDom);
        document.body.appendChild(GetOverlay(this.overlayId));

        document.body.style.overflow = 'hidden';
        dialogDom.style.display = 'block';
    },
    getDialog: function (timestamp, content, style) {
        var dlg = document.getElementById(timestamp);
        if(dlg) document.body.removeChild(dlg);
        dlg = document.createElement('div');
        dlg.id = timestamp;
        dlg.setAttribute('class', 'dialog');
        dlg.innerHTML = content;
        dlg.setAttribute('style', style);
        (function() {
            dlg.onclick = function() {
                document.body.removeChild(this);
                if(document.getElementById(timestamp + '_dialog')) document.body.removeChild(document.getElementById(timestamp + '_dialog'));
                document.body.style.overflow = 'auto';
            }
        })();
        return dlg;
    }
};

/**
 * Drawer 类
 */
var Drawer = Class.create();
Drawer.prototype = {
    initialize: function (type, title, content, choices, callback) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_dialog'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.type = type | 'warning';
        this.title = title | 'drawer';
        this.content = content | '';
        this.choices = choices | ['CANCEL', 'OK'];
        this.callback = callback | function(){};
    },
    render: function () { // 成员函数
        var drawerDom = this.getDrawer(this.id, this.content, this.style);
        document.body.appendChild(drawerDom);
        document.body.appendChild(GetOverlay(this.overlayId));

        document.body.style.overflow = 'hidden';
        drawerDom.style.display = 'block';
    },
    getDrawer: function (timestamp, content, style) {
        var drw = document.getElementById(timestamp);
        if(drw) document.body.removeChild(drw);
        drw = document.createElement('div');
        drw.id = timestamp;
        drw.setAttribute('class', 'drawer');
        drw.innerHTML = content;
        drw.setAttribute('style', style);
        (function() {
            drw.onclick = function() {
                document.body.removeChild(this);
                if(document.getElementById(timestamp + '_drawer')) document.body.removeChild(document.getElementById(timestamp + '_drawer'));
                document.body.style.overflow = 'auto';
            }
        })();
        return drw;
    }
};

/**
 * 根据命名，生成遮罩层 Dom 节点
 * @param overlayId
 * @returns {Element}
 * @constructor
 */
var GetOverlay = function(overlayId) {
    var hostId = overlayId.split('_')[0]; // 根据 overlay 的命名规则得到其宿主元素 id
    var overlay = document.getElementById(overlayId);
    if(overlay) document.body.removeChild(overlay);
    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.setAttribute('class', 'overlay');
    (function() {
        overlay.onclick = function() {
            if(document.getElementById(hostId)) document.body.removeChild(document.getElementById(hostId));
            document.body.removeChild(this);
            document.body.style.overflow = 'auto';
        }
    })();
    return overlay;
};
