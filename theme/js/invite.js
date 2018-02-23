// landing GTBB
$(document).ready(function(){
    //on click, input value select all
    $('.copy-code').on('click', function(){
        $(this).select();
    });

    //function button copy
    $('.copy-method').on('click','.btn-main', function(){
        var btn = $(this),
            btn_text = $(this).text();

        btn.parents('.copy-method').find('.copy-code').select();
        document.execCommand("Copy");
        

        setTimeout(function() {
            btn.html('<span class="done">Xong!</span>');
        }, 200);

        setTimeout(function() {
            $( ".done" ).animate({
                opacity: 0,
            }, 500, function() {
                $( '.done' ).text(btn_text);
                $( '.done' ).animate({
                    opacity: 1,
                }, 150, function() {
                    btn.text(btn_text);
                });
            });
        }, 500);

    });

    //function share method
    $('[data-validate]').each(function(){
        var method = $(this),
            list = $(this).find('.input-list'),
            placeholder = 'Nhập Email/Số điện thoại của bạn bè';
        
        //append input for email
        list.append($('<li class="input-item"></li>').append(('<input placeholder="' + placeholder + '">')));

        // var of main input-item and it's input & validate Regex
        var item = list.find('.input-item'),
            input = item.find('input');
        
        function validateEmail (email) {
            var regex = /^[a-zA-Z0-9_]([\.-]?[a-zA-Z0-9_])*@[a-zA-Z0-9_]([\.-]?[a-zA-Z0-9_])*(\.\w{2,3})+$/;
            return regex.test(email);
        };
        function validatePhone (phone) {
            var regex = /^(01[2689]|09)[0-9]{8}$|^088[0-9]{7}$/;
            return regex.test(phone);
        };

        //input auto resize
        function inputResize (input, helper_text) {
            input.on('focus', function(){
                if(input.parent().find('.input-helper').length === 0) {
                    input.before($('<span class="input-helper"></span>').hide());
                    var helper = input.parent().find('.input-helper');
                    if(input.attr('placeholder') && input.val() === '') {
                        helper.text(input.attr('placeholder'));
                        input.width(helper.width());
                    }
                    
                    input.on('input', function(){
                        if(input.val().length > 0) {
                            helper.text(input.val()+"|");
                            input.width(helper.width());
                        }
                    });
                } else {
                    return false;
                }
                input.on('blur', function(){
                    input.parent().find('.input-helper').remove();
                });
            });
        }
        inputResize (input);

        //input focus when list on click
        list.on('click', function(e){
            input.focus();
            //selected input focus
            if(list.find('.selected')){
                list.find('.selected input').focus();
            }
        });

        // function validateItem
        function validateItem(value){
            input.attr('placeholder', '');
            input.val('');
            //function append class validated or invalid
            function appendInput(validate){
                item.before($('<li class="input-item'+' '+validate+'"><span> ' + value + '</span></li>')
                    .append($('<a href="#" class="input-remove mg-l-5 li-cross"></a>')
                        .on('click', function(e) {
                            e.preventDefault();
                            $(this).parent().remove();
                            input.attr('placeholder', placeholder);
                            inputResize (input);

                            //Disabled button when there's none validated item
                            if (method.find('.validated').length === 0) {
                                method.find('.btn-main').attr("disabled", "disabled");
                            }
                            
                            if (method.find('.input-item').length === 1) {
                                item.removeClass('has-data');
                            }
                        })
                    )
                );
            }
            if (validateEmail(value) || validatePhone(value)) {
                var array = list.find('.validated span').text().split(' ');
                method.find('.btn-main').removeAttr('disabled');
                appendInput("validated");
                //remove already existing validated item
                input.filter(function(){
                    return array.includes(value)
                }).parent().prev().remove();
            } else {
                appendInput("invalid");
            };
        }
        // function validateTyping
        function validateTypingInput(input, value) {
            if (validateEmail(value) || validatePhone(value)) {
                input.addClass('typein-validated');
                method.find('.btn-main').removeAttr('disabled');
            }

            if (validateEmail(value) == false && 
                validatePhone(value) == false && 
                method.find('.validated').length === 0) {

                method.find('.btn-main').attr("disabled", "disabled");
                if(!input.length == 0){
                    input.removeClass('typein-validated');
                }
            }
        }

        // validate when Typing
        input.on('keyup',function(){
            // add or reromve Attr 'disabled' of btn-main when typing validated or invalid item
            var typeinInput = $(this).val();
            validateTypingInput(input, typeinInput);
        });

        //type in input value
        input.on('keydown', function(event){    
            var typeinInput = $(this).val();
            // Get input value when press press "," ";" "space" "tab" "enter"
            if(event.which == 32 || event.which == 188 || event.which == 186 || event.which == 9 || event.which == 13) {
                // preventDefault when press "," ";" "space" "tab" "enter" first
                event.preventDefault();
                input.width("1px");
                input.removeClass('typein-validated');
                var val = $(this).val();
                val = val.replace(/,|;/gi, '');
                
                if(input.val() !== '') {
                    //validate 
                    validateItem(val);
                    item.addClass('has-data');
                }

                //edit item value
                list.find('.input-item').on('click','span', function(e){
                    list.find('.input-item input').blur();
                    var item_val = $(this).text()
                        old_val = item_val.replace(/\s/g,''),
                        item_edit= $(this).parent();

                    //Append input on item want to edit
                    item_edit.removeClass('invalid validated');
                    item_edit.addClass('selected');
                    item_edit.prepend($('<input type="text">').width($(this).width()));
                    item_edit.find('.input-remove').hide();
                    item.hide();
                    
                    var re_input = item_edit.find('input');
                    re_input.focus().val(old_val);
                    inputResize (item_edit.find('input'));

                    //function validate new input value
                    function validateRe_input(value) {
                        function appendRe_input(validate) {
                            re_input.parent().addClass(validate);
                            re_input.parent().prepend('<span> ' + value + '</span>')
                            re_input.parent().find('.input-remove').show();
                            re_input.remove();
                        }

                        //validate
                        if (validateEmail(value) || validatePhone(value)) {
                            var array = list.find('.validated span').text().split(' ');
                            //remove already existing validated item
                            re_input.filter(function(){
                                return array.includes(value)
                            }).parent().remove();
                            appendRe_input("validated");
                        } else {
                            appendRe_input("invalid");
                        }
                    }

                    // Get input value when press "," ";" "space"
                    re_input.on('keydown', function(event) {
                        var new_val = re_input.val()
                        new_val = new_val.replace(/,|;|\s/gi, '');
                        
                        // add or reromve Attr 'disabled' of btn-main when typing validated or invalid item
                        validateTypingInput(re_input, new_val);

                        if(event.which == 32 || event.which == 188 || event.which == 186 || event.which == 9 || event.which == 13) {
                            event.preventDefault();
                            item.show();
                            input.focus();
                            re_input.parent().removeClass('selected');
                            validateRe_input(new_val);
                        };

                        //remove item when input value = ''
                        if(re_input.val() === '') {
                            $(this).parents('.input-item').remove();
                            item.show();
                            input.focus();
                            inputResize (input);
                            input.attr('placeholder', placeholder);
                        }
                        if (method.find('.input-item').length === 1) {
                            item.removeClass('has-data');
                        }
                    });

                    //when click on other item
                    list.find('.input-item').on('click','span', function(){
                        if(!$(this).parent().hasClass('selected')) {
                            re_input.on('blur', function(){
                                var new_val = re_input.val();
                                new_val = new_val.replace(/,|;|\s/gi, '');
                                re_input.parent().removeClass('selected');
                                validateRe_input(new_val);
                            })
                        }
                        list.find('.input-item input').blur();
                    });
                    $(this).remove();
                });
            };

            //set input width to inherit to when input value =''
            input.on('keyup',function(){
                if(input.val() === '' && list.find('.input-item').length === 1){
                    input.width("inherit");
                }
            });

            // remove previous input-item when press backspace or delete as well as input value = ''
            if(event.which === 8 && input.val() === ''){
                item.prev().remove();
                validateTypingInput(typeinInput);
                //when there's no item add attr placeholder
                if(list.find('.input-item').length === 1){
                    item.removeClass('has-data');
                    input.width('inherit');
                    input.attr('placeholder', placeholder);
                }
            };
        });

        //paste value in input
        input.on('paste', function(){
            setTimeout(function () {
                var val = input.val().replace(/\s/g,'');
                val = val.split(/[;,]+/);
                for ( var i = 0; i < val.length; i++){
                    input.width("inherit");
                    item.addClass('has-data').find('input').attr('placeholder', '').val('');
                    //validate 
                    validateItem(val[i]);
                    input.width("1px");
                }; 
            }, 0);
        });

        //send btn
        method.on('click','.btn-main',function(){
            if(!$(this).attr('disabled')){
                var btn = $(this),
                    method = btn.parents('.share-method'),
                    btn_text = btn.text();
                
                //Email or Phone number list Array
                var send_to = list.find('.validated span').text().trim().split(' ');
                send_to.push(list.find('.typein-validated').val());
                send_to = send_to.filter(Boolean);

                setTimeout(function() {
                    btn.attr("disabled", "disabled");
                    btn.html('<i class="fa fa-circle-o-notch fa-spin fa-fw text-sm"></i>')
                }, 150);

                setTimeout(function() {
                    btn.removeAttr("disabled");
                    btn.addClass('sent');
                    btn.html('<i class="fa fa-paper-plane mg-r-5"></i>Đã gửi!')
                }, 1500);

                setTimeout(function() {
                    method.find('input').val('')
                    method.find('.invalid, .validated, .selected').remove();
                    item.show();
                    item.removeClass('has-data');
                    input.attr('placeholder', placeholder);
                    btn.html(btn_text)
                    btn.removeClass('sent');
                    btn.attr("disabled", "disabled");
                }, 2750);

                setTimeout(function() {
                    $('#SentSuccess').modal('show');
                    $('#SentSuccess').on('hidden.bs.modal', function(){
                        input.focus();
                    });
                    console.log(send_to);
                }, 2800);
            }
        });
    });
});