/**
 * Created by v-kshe on 6/18/2015.
 */

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function getElement(by, from) {
    if(by == '') return from;
    var s = by.charAt(0);
    // if '#id':
    if(s == '#') return document.getElementById(by.substr(1));
    var eleArr = [];
    // if 'tag.class...':
    if(s != '.') {
        var classbegin = by.indexOf('.');
        var tagname = (classbegin == -1 ? by : by.substring(0, classbegin));
        if(isArray(from) == false) return from.getElementsByTagName(tagname);
        for(var i = 0; i < from.length; i++) {
            var tmpArr = from[i].getElementsByTagName(tagname);
            while(tmpArr.length > 0)
                eleArr.push(tmpArr.shift());
        }
        if(classbegin == -1) return eleArr;
        return getElement(by.substr(classbegin), eleArr);
    }
    // if '.class...':
    var nextclassbegin = by.indexOf('.', 1);
    var classname = (nextclassbegin == -1 ? by.substr(1) : by.substring(1, nextclassbegin));
    if(isArray(from) == false) return from.getElementsByClassName(classname);
    for(var i = 0; i < from.length; i++) {
        var tmpArr = from[i].getElementsByClassName(classname);
        while(tmpArr.length > 0)
            eleArr.push(tmpArr.shift());
    }
    if(nextclassbegin == -1) return eleArr;
    return getElement(by.substr(nextclassbegin), eleArr);
}

/**
 * ??????
 * ??? tag, #id, .class ?? tag.class, .class1.class2
 * @param sels
 * @param parent
 * @returns {*}
 */
function $(sels, parent) {
    if(parent) parent = document;
    var selectors = sels.split(' ');
    while(selectors.length > 0) {
        var s = selectors.shift();
        if(s == '') continue;
        parent = getElement(s, parent);
    }
    return parent;
}

/**
 * ?????????????
 * @param e
 */
function editStyle(e) {
    var newStyle = prompt('input css styles', e.getAttribute('style'));
    if (newStyle != null && newStyle != '') {
        e.setAttribute('style', newStyle);
    }
}