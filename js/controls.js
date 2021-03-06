/**
 * Created by v-kshe on 6/18/2015.
 */

/**
 * 全局静态类
 * 用于声明一个新的类并提供构造函数支持
 * @type {{create: Function}}
 */
var Class = {
    create: function() {
        return function() { // 返回一个函数，代表这个新声明的类的构造函数
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
    initialize: function(options) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_dialog'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.type = options.type || 'warning';
        this.title = options.title || 'dialog';
        this.content = options.content || '';
        this.choices = options.choices || ['OK', 'Cancel'];
        this.okCallback = options.yes || function() {};
        this.cancelCallback = options.no || function() {};
        this.onSuccess = options.success || function() {};
        this.render();
    },
    render: function() { // 成员函数
        var dialogDom = this.getDialog(this.id, this.content, this.style);
        document.body.appendChild(dialogDom);
        this.setDialogOffset(dialogDom);
        document.body.appendChild(GetOverlay(this.overlayId));

        (function(dialogId, callback0, callback1) {
            var thisDialog = document.getElementById(dialogId);
            if(thisDialog.getElementsByClassName('single').length > 0) {
                thisDialog.getElementsByClassName('single')[0].onclick = function() {
                    Dialog.close(dialogId);
                    callback0();
                }
            }
            if(thisDialog.getElementsByClassName('ok').length > 0) {
                thisDialog.getElementsByClassName('ok')[0].onclick = function() {
                    Dialog.close(dialogId);
                    callback0();
                }
            }
            if(thisDialog.getElementsByClassName('cancel').length > 0) {
                thisDialog.getElementsByClassName('cancel')[0].onclick = function() {
                    Dialog.close(dialogId);
                    callback1();
                }
            }
        })(this.id, this.okCallback, this.cancelCallback);

        document.body.style.overflow = 'hidden';
        document.getElementById(this.overlayId).style.display = 'block';
        dialogDom.style.visibility = 'visible';

        this.onSuccess(dialogDom);
    },
    getDialog: function(timestamp, content, style) {
        var dlg = document.getElementById(timestamp);
        if (dlg) document.body.removeChild(dlg);
        dlg = document.createElement('div');
        dlg.id = timestamp;
        dlg.setAttribute('class', 'dialog');
        dlg.innerHTML = '<div class="dialog-wrapper"><div class="dialog-content">'
            + '<div class="dialog-form">' + content + '</div>'
            + '<div class="dialog-btns">' + this.getChoiceString() + '</div>'
            + '</div></div>';
        dlg.setAttribute('style', style);
        return dlg;
    },
    setDialogOffset: function(dialogDom) {
        var content = dialogDom.childNodes[0];
        dialogDom.style.width = '100%';//content.offsetWidth + 'px';
        dialogDom.style.height = content.offsetHeight + 'px';
    },
    getChoiceString: function() {
        if (this.choices.length == 1) {
            return '<div class="btn">' + this.choices[0] + '</div>';
        }
        if (this.choices.length == 2) {
            return '<div class="btn-half cancel">' + this.choices[1] + '</div>' + '<div class="btn-half ok">' + this.choices[0] + '</div>';
        }
        return '';
    }
};
Dialog.close = function (dialogId) {
    document.body.removeChild(document.getElementById(dialogId));
    if (document.getElementById(dialogId + '_dialog')) document.body.removeChild(document.getElementById(dialogId + '_dialog'));
    document.body.style.overflow = 'auto';
};
Dialog.alert = function (text) {
    new Dialog({
        type: 'normal',
        title: 'a pop-up dialog',
        content: '<p>' + text + '</p>',
        choices: ['确认'],
        yes: function () {},
        no: function () {},
        success: function(dlg){}
    });
};

/**
 * Drawer 类
 */
var Drawer = Class.create();
Drawer.prototype = {
    initialize: function(menus) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_drawer'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.menus = menus || [{
            name: 'menuItem1',
            type: 'normal',
            style: '',
            callback: function() {
                history.go(0)
            }
        }, {
            name: 'menuItem2',
            type: 'warning',
            style: '',
            callback: function() {
                history.go(-1)
            }
        }];
    },
    render: function() { // 成员函数
        var drawerDom = this.getDrawer(this.id, this.content, this.style);
        document.body.appendChild(drawerDom);
        document.body.appendChild(GetOverlay(this.overlayId));

        document.body.style.overflow = 'hidden';
        drawerDom.style.display = 'block';
    },
    getDrawer: function(timestamp, content, style) {
        var drw = document.getElementById(timestamp);
        if (drw) document.body.removeChild(drw);
        drw = document.createElement('div');
        drw.id = timestamp;
        drw.setAttribute('class', 'drawer');
        drw.innerHTML = content;
        drw.setAttribute('style', style);
        (function() {
            drw.onclick = function() {
                document.body.removeChild(this);
                if (document.getElementById(timestamp + '_drawer')) document.body.removeChild(document.getElementById(timestamp + '_drawer'));
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
var GetOverlay = function(overlayId, clickHide) {
    var hostId = overlayId.split('_')[0]; // 根据 overlay 的命名规则得到其宿主元素 id
    var overlay = document.getElementById(overlayId);
    if (overlay) document.body.removeChild(overlay);
    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.setAttribute('class', 'overlay');
    if(clickHide) {
        (function (hId) {
            overlay.onclick = function () {
                if (document.getElementById(hId)) document.body.removeChild(document.getElementById(hId));
                document.body.removeChild(this);
                document.body.style.overflow = 'auto';
            }
        })(hostId);
    }
    return overlay;
};

/**
 * Table 类
 */
var Table = Class.create();
Table.prototype = {
    initialize: function(id, type, title, headers, data, style) {
        this.id = (id != '') ? id : ((new Date().getTime()).toString() + '_table');
        this.type = type; // 'h': horizon, 'v': vertical.
        this.title = title;
        this.headers = headers;
        this.data = [];
        this.style = style || '';
        this.fieldCount = headers.length;
        this.itemCount = 0;//data.length;


        this.build(data);
    },
    node: function() {
        return this.context
    }, // 返回创建的 Dom 节点，同时也作为对象自我操作的上下文
    build: function(data) {
        this.context = document.createElement('table');
        this.context.id = this.id;
        this.context.setAttribute('width', '100%');
        this.context.setAttribute('border', '1');
        this.context.setAttribute('cellpadding', '2');
        this.context.setAttribute('cellspacing', '1');
        this.context.style.tableLayout = 'fixed';
        if (this.title != '') {
            var cap = this.context.createCaption();
            cap.innerHTML = this.title;
        }

        var tr = document.createElement('tr');
        var th;
        for (var i in this.headers) {
            th = document.createElement('th');
            th.innerHTML = this.headers[i];
            tr.appendChild(th);
        }
        this.context.appendChild(tr);

        for (var i in data) {
            this.append(data[i]);
        }
        return this.context;
    },
    append: function(item) {
        this.itemCount = this.itemCount + 1;

        var newItem = this.context.insertRow(this.itemCount);
        var curField;
        for (var i = 0; i < item.length; i++) {
            curField = newItem.insertCell(i);
            curField.innerHTML = item[i];
            //curField.onclick = function() {
            //    var v = prompt('input new value:', '');
            //    this.innerHTML = v;

            //};
        }
        this.data.push(item);
    },
    insert: function() {},
    clear: function() {
        this.itemCount = 0;

        var tds = this.context.getElementsByTagName('td');
        var len = tds.length;
        while (len > 0) {
            tds[0].parentNode.removeChild(tds[0]);
            len--;
        }

        var trs = this.context.getElementsByTagName('tr');
        len = trs.length;
        var i = 0;
        while (len > 0 && i < len) {
            if (trs[i].innerHTML == '') {
                this.context.removeChild(trs[i]);
                len--;
                continue;
            }
            i++;
        }
        this.data = [];
    },
    find: function(key) {},
    remove: function() {},
    destroy: function() {
        this.context.parentNode.removeChild(this.context);
    }
};
Table.getTable = function(id, type, title, headers, data, style) {
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.setAttribute('width', '100%');
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellpadding', '2');
    tbl.setAttribute('cellspacing', '1');
    tbl.style.tableLayout = 'fixed';
    if (title != '') {
        var cap = tbl.createCaption();
        cap.innerHTML = title;
    }
    var tr = document.createElement('tr');
    var th;
    for (var i in headers) {
        th = document.createElement('th');
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }
    tbl.appendChild(tr);
    var td;
    for (var i in data) {
        tr = document.createElement('tr');
        for (var j in data[i]) {
            td = document.createElement('td');
            td.innerHTML = data[i][j];
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
    return tbl;
};