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
 * 判断数据类型
 */
var Is = {
    types: [
        "Array",
        "Boolean",
        "Date",
        "Number",
        "Object",
        "RegExp",
        "String",
        "Window",
        "HTMLDocument"
    ]
};
for(var i = 0, c; c = Is.types[i++]; ) {
    Is[c] = (function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    })(c);
}

/**
 * 为字符串生成hash值
 */
String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var Util = {
	isArray: function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	
	getElement: function (by, from) {
		if (by == '') return from;
		var s = by.charAt(0);
		// if '#id':
		if (s == '#') return document.getElementById(by.substr(1));
		var eleArr = [];
		// if 'tag.class...':
		if (s != '.') {
			var classbegin = by.indexOf('.');
			var tagname = (classbegin == -1 ? by : by.substring(0, classbegin));
			if (Util.isArray(from) === false) return from.getElementsByTagName(tagname);
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
			return Util.getElement(by.substr(classbegin), eleArr);
		}
		// if '.class...':
		var nextclassbegin = by.indexOf('.', 1);
		var classname = (nextclassbegin == -1 ? by.substr(1) : by.substring(1, nextclassbegin));
		if (Util.isArray(from) === false) return from.getElementsByClassName(classname);
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
		return Util.getElement(by.substr(nextclassbegin), eleArr);
	},
	/**
	 * a simple implementation of selector
	 * only support tag, #id, .class, and tag.class, .class1.class2 as a piece of selector
	 * @param sels
	 * @param parent
	 * @returns {*}
	 */
	select: function (sels, parent) {
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
			parent = Util.getElement(s, parent);
		}
		return parent;
	},

	parseISO8601DateTime: function (string) {
		var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
			"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
			"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
		if (string) {
			var d = string.match(new RegExp(regexp));
			var offset = 0;
			var date = new Date(d[1], 0, 1);

			if (d[3]) {
				date.setMonth(d[3] - 1);
			}
			if (d[5]) {
				date.setDate(d[5]);
			}
			if (d[7]) {
				date.setHours(d[7]);
			}
			if (d[8]) {
				date.setMinutes(d[8]);
			}
			if (d[10]) {
				date.setSeconds(d[10]);
			}
			if (d[12]) {
				date.setMilliseconds(Number("0." + d[12]) * 1000);
			}
			if (d[14]) {
				offset = (Number(d[16]) * 60) + Number(d[17]);
				offset *= ((d[15] == '-') ? 1 : -1);
			}
			offset -= date.getTimezoneOffset();
			date.setTime(Number(Number(date) + (offset * 60 * 1000)));
			return date;
		} else {
			return new Date();
		}
	},
	parseISO8601DTToString: function (string) {
		var dt = this.parseISO8601DateTime(string);
		return dt.getFullYear() + "年" + (dt.getMonth() + 1) + "月" + dt.getDate() + "日";
	},
	
	getURLParameter: function (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	getUrlHash: function (url) {
		if(!url) var url = window.location.href;
		if(url.indexOf('#') < 0) return '';
		return url.substring(url.indexOf('#') + 1);
	},
	removeURLParameter: function (name, url) {
		var hash = (url.indexOf('#') < 0 ? '' : url.substring(url.indexOf('#')));
		var urlparts = url.split('?');   
		if (urlparts.length >= 2) {
			var prefix = encodeURIComponent(name) + '=';
			var pars = urlparts[1].split(/[&;]/g);
			
			for (var i = pars.length; i-- > 0;) {
				if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
					pars.splice(i, 1);
				}
			}

			url = urlparts[0] + (pars.length > 0 ? '?' : '') + pars.join('&') + hash;
			return url;
		} else {
			return url + hash;
		}
	},
	
	clone: function (obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},
	
	typeOfFile: function (url) {
		var arr = url.split('.');
		if (arr.length == 0) return 'unknown';
		var ext = arr[arr.length - 1].toLowerCase();
		return ext;
	},
	nameOfFile: function (url) {
		var arr = url.split('/');
		if (arr.length == 0) return '';
		return arr[arr.length - 1];
	},
	parseFileSize: function (bytes) {
		if (Is['String'](bytes)) bytes = parseInt(bytes);
		if (bytes < 1000) return bytes.toString() + 'b';
		bytes /= 1000;
		bytes = Math.round(bytes * 100) / 100;
		if (bytes < 1000) return bytes.toString() + 'kb';
		bytes /= 1000;
		bytes = Math.round(bytes * 100) / 100;
		if (bytes < 1000) return bytes.toString() + 'mb';
		bytes /= 1000;
		bytes = Math.round(bytes * 100) / 100;
		return bytes.toString() + 'gb';
	},
	
	guid: function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		  s4() + '-' + s4() + s4() + s4();
	},
	
	isMobile: {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		}
	}
};

/**
 * sessionStorage
 */
var SessionData = function () {
    return {
        has: function (key) {
            return sessionStorage.getItem(key);
        },
        get: function (key) {
            return JSON.parse(sessionStorage.getItem(key));
        },
        getStr: function (key) {
            return sessionStorage.getItem(key);
        },
        set: function (key, value) {
            if(Is.String(value)) sessionStorage.setItem(key, value);
            else sessionStorage.setItem(key, JSON.stringify(value));
            return value;
        },
        remove: function (key) {
            sessionStorage.removeItem(key);
        }
    };
}();

/**
 * localStorage
 */
var LocalData = function () {
    return {
        has: function (key) {
            return localStorage.getItem(key);
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        getStr: function (key) {
            return localStorage.getItem(key);
        },
        set: function (key, value) {
            if(Is.String(value)) localStorage.setItem(key, value);
            else localStorage.setItem(key, JSON.stringify(value));
            return value;
        },
        remove: function (key) {
            localStorage.removeItem(key);
        }
    };
}();

/**
 * cookie
 */
var CookieData = new function () {
    this.set = function (key, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = key + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    };
    this.get = function (key) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(key + "=");
            if (c_start != -1) {
                c_start = c_start + key.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    };
};

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

/**
 * selector
 */
function $(sels, parent) {
    return Util.select(sels, parent);
}