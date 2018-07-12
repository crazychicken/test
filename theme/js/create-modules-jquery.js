;(function($) {
    // $('body').append("<p>TUDS</p>")
    "use strict";
    var my_plugin = function(link, opts) {

        var $this = this, img, o={};

        var defaults = {
            color: 'rgb(255, 0, 0)'
        };

        $.extend(this, $.fn, {

            init : function () {
                o = $.extend(defaults, opts);
                link.on('click', $this.changeColor);
            },
            
            changeColor : function (e) {
                // console.log(link.css('color'));
                // if( link.css('color') == o.color) {
                //     link.css('color', 'blue');
                // } else {
                //     link.css('color', o.color);
                //     $this.triggerChange();
                // }
                $this.triggerChange();
            },
            triggerChange : function () {
                link.trigger('custom');
            }
        });

        this.init();
    };

    $.fn.my_plugin = function(opts) {
        new my_plugin(this, opts);
        return this;
    };

})(jQuery);

jQuery(document).ready( function($) {
    var test1 = $('#test1').my_plugin({
        color: 'red'
    });
    test1.on('custom', function (){ 
        // do something
        console.log('custom');
    });
});







