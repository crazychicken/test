'use strict';

(function($) {
    $.fn.my_function_1 = function( options ) {
        var defaults = {
            mouseover_color: '#ff0000',
            mouseout_color: '#333'
        }
        var a = this;
        var fnAction = {
            fnT: function test(argument) {
                // console.log(this)
                a.mouseover(function(){
                    $(this).css('color', argument.mouseover_color);
                });

                a.mouseout(function(){
                    $(this).css('color', argument.mouseout_color);
                });

                return this;
            }
        }
        fnAction.fnT($.extend(defaults, options))
    }
}( jQuery ));