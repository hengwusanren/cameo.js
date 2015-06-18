/**
 * Created by v-kshe on 6/18/2015.
 */

var Class = { // 全局静态类，用于声明一个新的类并提供构造函数支持
    create: function () {
        return function () { // 返回一个函数，代表这个新声明的类的构造函数
            // 一个命名为 initialize 的函数将被这个类实现作为类的构造函数
            this.initialize.apply(this, arguments); // initialize 函数将在实例化一个变量的时候被调用执行
        }
    }
};

var messageQueue = [];

var Dialog = Class.create(); // Dialog 类的声明
Dialog.prototype = {
    initialize: function (type, title, content, choices, callback) { // 构造函数
        this.type = type;
        this.title = title;
        this.content = content;
        this.choices = choices;
        this.callback = callback;
    },
    printName: function () { // 成员函数
        alert(this.name);
    }
};

