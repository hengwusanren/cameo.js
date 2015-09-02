/**
 * Created by shen on 15-6-28.
 */

var Test = function () {
    return {
        /**
         * edit the style of element
         * @param e
         */
        editStyle: function (e) {
            if(!e) return;
            var newStyle = prompt('input css styles', e.hasAttribute('style') ? e.getAttribute('style') : 'color: orange;');
            if (newStyle != null && newStyle != '') {
                e.setAttribute('style', newStyle);
            }
        }
    };
}();