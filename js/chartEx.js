/**
 * Created by v-kshe on 6/19/2015.
 */

var ChartEx = Class.create();
ChartEx.prototype = {
    initialize: function (type, data, canvasId, options, callback) {
        this.type = type;
        this.data = data;
        this.context = new Chart(document.getElementById(canvasId).getContext("2d"));
        this.options = options;
        this.callback = callback;
        if(this.type == 'bar') return this.context.Bar(this.data, this.options);
        if(this.type == 'line') return this.context.Line(this.data, this.options);
        if(this.type == 'pie') return this.context.Pie(this.data, this.options);
        if(this.type == 'polarArea') return this.context.PolarArea(this.data, this.options);
        if(this.type == 'radar') return this.context.Radar(this.data, this.options);
    }
};