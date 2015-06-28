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
var MessageQueue = [];

/**
 * Dialog 类
 */
var Dialog = Class.create();
Dialog.prototype = {
    initialize: function (type, title, content, choices, callback) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_dialog'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.type = type || 'warning';
        this.title = title || 'dialog';
        this.content = content || '';
        this.choices = choices || ['CANCEL', 'OK'];
        this.callback = callback || function () {};
    },
    render: function () { // 成员函数，渲染显示
        var dialogDom = this.getDialog(this.id);
        document.body.appendChild(dialogDom);
        document.body.appendChild(GetOverlay(this.overlayId));
        document.body.style.overflow = 'hidden';
        dialogDom.style.display = 'block';
    },
    getDialog: function (timestamp) { // 返回构造的节点
        var dlg = document.getElementById(timestamp);
        if (dlg) document.body.removeChild(dlg);
        dlg = document.createElement('div');
        dlg.id = timestamp;
        dlg.className = 'dialog';
        dlg.innerHTML = this.getDialogHTML();
        (function () {
            dlg.onclick = function () {
                document.body.removeChild(this);
                if (document.getElementById(timestamp + '_dialog')) document.body.removeChild(document.getElementById(timestamp + '_dialog'));
                document.body.style.overflow = 'auto';
            };
        })();
        return dlg;
    },
    getDialogHTML: function() { // dialog HTML 模板
        return '<div style="position: relative; left: -50%; top: -50%;">'
            + this.content
            + this.getChoiceHTML()
            + '</div>';
    },
    getChoiceHTML: function() { // choice HTML 模板
        var choiceNum = this.choices.length;
        if(choiceNum != 1 && choiceNum != 2) return '';
        var choiceStr = '<div style="text-align: center; height: 32px; line-height: 32px;">';
        if(choiceNum == 1) {
            choiceStr += '<div class="single">'
                + this.choices[0]
                + '</div>'
                + '</div>';
        } else if(choiceNum == 2) {
            choiceStr += '<div class="cancel">'
                + this.choices[0]
                + '</div>'
                + '<div class="ok">'
                + this.choices[1]
                + '</div>'
                + '</div>';
        }
        return choiceStr;
    }
};

/**
 * Drawer 类
 */
var Drawer = Class.create();
Drawer.prototype = {
    initialize: function (menus, type) { // 构造函数
        this.id = (new Date().getTime()).toString(); // 时间戳
        this.overlayId = this.id + '_drawer'; // 遮罩层的 id 由宿主元素的时间戳和类型构成
        this.type = type;
        this.menus = menus || [
                {
                    name: 'item1',
                    type: 'normal',
                    content: '',
                    callback: function () {
                        history.go(0)
                    }
                },
                {
                    name: 'item2',
                    type: 'warning',
                    content: '',
                    callback: function () {
                        history.go(-1)
                    }
                }
            ];
    },
    render: function () { // 成员函数
        var drawerDom = this.getDrawer(this.id);
        document.body.appendChild(drawerDom);
        document.body.appendChild(GetOverlay(this.overlayId));

        document.body.style.overflow = 'hidden';
        drawerDom.style.display = 'block';
    },
    getDrawer: function (timestamp) {
        var drw = document.getElementById(timestamp);
        if (drw) document.body.removeChild(drw);
        drw = document.createElement('div');
        drw.id = timestamp;
        drw.className = 'drawer';
        var menuList = document.createElement('ul');
        var itemNum = this.menus.length;
        for(var i = 0; i < itemNum; i++) {
            var menuItem = document.createElement('li');
            menuItem.setAttribute('data-index', i.toString());
            menuItem.innerHTML = (this.menus[i].content == '' ? this.menus[i].name : this.menus[i].content);
            var callback = this.menus[i].callback;
            (function () { // 每个菜单项点击事件
                menuItem.onclick = function () {
                    callback();
                    var drwNode = this.parentNode;
                    while(drwNode.className != 'drawer') {
                        drwNode = drwNode.parentNode;
                        if(drwNode == document.body) return;
                    }
                    document.body.removeChild(drwNode);
                    if (document.getElementById(drwNode.id + '_drawer')) document.body.removeChild(document.getElementById(drwNode.id + '_drawer'));
                    document.body.style.overflow = 'auto';
                };
            })();
            menuList.appendChild(menuItem);
        }
        drw.appendChild(menuList);
        return drw;
    },
    getDrawerHTML: function() { // dialog HTML 模板
        var drawerStr = '<ul>';
        var itemNum = this.menus.length;
        for(var i = 0; i < itemNum; i++)
            drawerStr += this.getItemHTML(i, this.menus[i].name, this.menus[i].type, this.menus[i].content);
        drawerStr += '</ul>';
        return drawerStr;
    },
    getItemHTML: function(index, name, type, content) { // menu-item HTML 模板
        var itemStr = '<li data-index="' + index + '">'
            + (content == '' ? name : content)
            + '</li>';
        return itemStr;
    }
};

/**
 * 根据命名，生成遮罩层 Dom 节点
 * @param overlayId
 * @returns {Element}
 * @constructor
 */
var GetOverlay = function (overlayId) {
    var hostId = overlayId.split('_')[0]; // 根据 overlay 的命名规则得到其宿主元素 id
    var overlay = document.getElementById(overlayId);
    if (overlay) document.body.removeChild(overlay);
    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'overlay';
    (function () {
        overlay.onclick = function () {
            if (document.getElementById(hostId)) document.body.removeChild(document.getElementById(hostId));
            document.body.removeChild(this);
            document.body.style.overflow = 'auto';
        };
    })();
    return overlay;
};

/**
 * Table 类
 */
var Table = Class.create();
Table.prototype = {
    initialize: function (id, type, title, headers, data, style) {
        this.id = (id != '') ? id : ((new Date().getTime()).toString() + '_table');
        this.type = type; // 'h': horizon, 'v': vertical.
        this.title = title;
        this.headers = headers;
        this.data = data;
        this.style = style || '';
        this.fieldCount = headers.length;
        this.itemCount = data.length;
        this.context = Table.CreateTable(this.id, this.type, this.title, this.headers, this.data, this.style);
    },
    node: function () { return this.context }, // 返回创建的 Dom 节点，同时也作为对象自我操作的上下文
    append: function (item) {
        this.itemCount = this.itemCount + 1;

        var newItem = this.context.insertRow(this.itemCount);
        var curField;
        var itemLen = item.length;
        for(var i = 0; i < itemLen; i++) {
            curField = newItem.insertCell(i);
            curField.innerHTML = item[i];
        }
    },
    insert: function () {},
    clear: function () {
        this.itemCount = 0;

        var tds = this.context.getElementsByTagName('td');
        var len = tds.length;
        while(len > 0) {
            tds[0].parentNode.removeChild(tds[0]);
            len--;
        }

        var trs = this.context.getElementsByTagName('tr');
        len = trs.length;
        var i = 0;
        while(len > 0 && i < len) {
            if(trs[i].innerHTML == '') {
                this.context.removeChild(trs[i]);
                len--;
                continue;
            }
            i++;
        }
    },
    find: function (key) {},
    remove: function () {},
    destroy: function () {
        this.context.parentNode.removeChild(this.context);
    }
};
Table.CreateTable = function (id, type, title, headers, data, style) {
    var tbl = document.createElement('table');
    tbl.id = id;
    tbl.setAttribute('width', '100%');
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellpadding', '2');
    tbl.setAttribute('cellspacing', '1');
    tbl.style.tableLayout = 'fixed';
    if(title != '') {
        var cap = tbl.createCaption();
        cap.innerHTML = title;
    }
    var tr = document.createElement('tr');
    var th;
    for(var i in headers) {
        th = document.createElement('th');
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }
    tbl.appendChild(tr);
    var td;
    for(var i in data) {
        tr = document.createElement('tr');
        for(var j in data[i]) {
            td = document.createElement('td');
            td.innerHTML = data[i][j];
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
    return tbl;
};