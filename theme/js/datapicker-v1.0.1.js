'use strict';

/*
* Tuds Datapicker - tdatapicker
* Copyright 2018 tuds
* Licensed under: LICENSE
* Version: v1.0.1
*/
$('body').append("<p>TUDS</p>")
;(function($){
    // Init - Default options
    var Defaults = {
        // Số tháng được hiển thị - mặc định 2 tháng
        setNumCalendar: 2,
        setTitleCheckIn: 'Nhận phòng',
        setTitleCheckOut: 'Trả phòng',

        // Số tháng được next hoặc prev trong phạm vi show ra của calendar tính từ ngày toDay - mặc định next 12 tháng
        setLimitPrevMonth: 0,
        setLimitNextMonth: 12,

        // Số ngày giới hạn của check-in -> check-out để thê hiện chuỗi .range
        setLimitDays: 31,

        // Setup ngày check-in và ngày check-out khi đã có ngày, ngày check-out không được lớn hơn check-in - mặc định show ngày toDay
        // setDateCheckIn: '2018/05/25',  // YY/MM/DD
        // setDateCheckOut: '2018/05/26', // YY/MM/DD
        setDateCheckIn: null,
        setDateCheckOut: null,

        setDateFormat: 'dd/yy/mm',

        setIconDate: '<i class="li-calendar-empty"></i><i class="li-arrow-right"></i>',
        setArrowPrev: '<i class="fa fa-chevron-left"></i>',
        setArrowNext: '<i class="fa fa-chevron-right"></i>',

        fnDataEvent: null,
    };

    // ON EVENT
    // .on('beforeShowDay', function() {
    //     console.log('beforeShowDay do somethink')
    // })
    // .on('afterShowDay', function(){
    //     console.log('afterShowDay do somethink')
    // })
    // .on('afterHideDay', function(){
    //     console.log('afterHideDay do somethink')
    // })
    // .on('afterCheckOut', function(){
    //     console.log('afterCheckOut do somethink')
    //     setTimeout( function(){
    //         // afterCheckOut do somethink
    //     }, 10 )
    // })
    // .on('eventClickDay', function() {
    //     console.log('eventClickDay do somethink')
    // })

    $.fn.tdatapicker = function( options ) {
        var this_el = this;
        // Call and Set options default
        var settings = $.extend({}, Defaults, options);
        

        // FUNCTION UTILITY
        // Check number first 0 - 01, 02, 03 ....
        function check_num_10(pr_el) {
            if ( pr_el < 10 ) {
                return pr_el = '0' + pr_el
            } else {
                return pr_el;
            }
        }
        function convertArrayToString(pr_array) {
            pr_array = pr_array.toString();
            pr_array = pr_array.replace(/,/g, '');
            return pr_array;
        }
        // Function Parents
        function fnParents(pr_el_parent, pr_el_class) {
            var i = 0;
            while ( pr_el_parent.className.match(pr_el_class) === null  ) {
                if ( pr_el_parent.className === pr_el_class ) {
                    return pr_el_parent;
                }
                if ( pr_el_parent.nodeName === 'HTML' ) {
                    return pr_el_parent;
                }
                pr_el_parent = pr_el_parent.parentElement;
                // Kiểm tra phần tử, alert không có element bên ngoài thì set default DOM ROOT
                if ( pr_el_parent === null ) {
                    return document.body.parentElement;
                }
                // check stop while
                i++; if (i>500) {return;}
                // return pr_el_parent;
            }
            return pr_el_parent;
        }
        // Function Append for toDay, hover day show num night
        function appendSpan(pr_el, pr_class, pr_class_span, pr_text_node) {
            if ( pr_class != '' ) {
                pr_el.className = pr_el.className + ' ' + pr_class;
            } else {
                pr_el.className = pr_el.className + pr_class;
            }
            var node = document.createElement("span");
            node.className = pr_class_span;
            var textnode = document.createTextNode(pr_text_node);
            node.appendChild(textnode);
            pr_el.appendChild(node)
        }


        // GLOBAL VARIABLE
        var aDays = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
        // var aMonths = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
        var d = new Date();
        var m = d.getMonth(); // 0 - 11
        var y = d.getFullYear();
        var toDay = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); // UTC
        function getToday() {
            return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        }
        

        // Theme Function  set type day of week
        function setDayOfWeek () {
            for ( var i = 0; i < aDays.length; i++ ) {
                aDays[i] = '<th>'+aDays[i]+'</th>';
            }
            return convertArrayToString(aDays)
        }
        // Theme Function get HTML TABLE for calendar
        var setTemplate = '<table class="t-table-condensed">'+
        '<thead>'+
            '<tr>'+
                '<th class="t_arrow t_prev">'+settings.setArrowPrev+'</th>'+
                '<th colspan="5" class="t_month"></th>'+
                '<th class="t_arrow t_next">'+settings.setArrowNext+'</th>'+
            '</tr>'+
            '<tr>'+
                setDayOfWeek()+
            '</tr>'+
        '</thead>'+
        '<tbody></tbody>'+
        '</table>'
        // console.log(setTemplate)
        // options add theme
        var setNumCalendar = settings.setNumCalendar;
        if ( setNumCalendar < 1 || isNaN( setNumCalendar )) {
            return console.log("'Thank you for using tdatapicker. Please, check setNumCalendar :'%c " + setNumCalendar + ' ', 'background: #f16d99; color: #fff');
        }
        var dataTheme = [];
        var setNumTheme = setNumCalendar;
        while ( setNumTheme > 0 ) {
            dataTheme.push(setTemplate);
            setNumTheme--;
        }
        // Reset variable code 0,1,2,3 ...
        setNumCalendar = setNumCalendar - 1;

        // Theme Append html follow month tr > td dataDays/7
        function AppendDaysInMonth(pr_num) {
            var i = 0;
            var setTr = '';
            while ( i < pr_num ) {
                setTr = setTr + '<tr>'+
                    '<td class="day">1</td>'+
                    '<td class="day">2</td>'+
                    '<td class="day">3</td>'+
                    '<td class="day">4</td>'+
                    '<td class="day">5</td>'+
                    '<td class="day">6</td>'+
                    '<td class="day">0</td>'+
                '</tr>';
                i++;
            }
            return setTr;
        }


        // Theme check-in && check-out default show for website
        function setThemeCheckDate(pr_title, pr_class, pr_data_utc, pr_input, pr_fm_input) {
            return '<div class="dates date-'+pr_class+'">'+
                // setInfoTitle(pr_title, 'date-info-title')
                '<label class="date-info-title">'+pr_title+'</label>'+
                settings.setIconDate+
                showThemeDate(pr_class, pr_data_utc)+
            '</div>'+
            '<input type="hidden" class="form-control input-'+pr_class+'"'+' value="'+pr_fm_input+'" name="'+pr_input+'">'
            // +'<div class="datepicker"></div>'
        }
        function showThemeDate(pr_class, pr_data_utc) {
            if ( pr_data_utc !== 0 && pr_data_utc !== null ) {
                var d = new Date(pr_data_utc)
                return '<span class="day-'+pr_class+'"> ' + check_num_10(d.getDate()) +'</span>'+
                '<span class="month-'+pr_class+'"> '+'Thg '+ check_num_10(d.getMonth() + 1) +' </span>'+
                '<span class="year-'+pr_class+'"> '+check_num_10(d.getFullYear()) +'</span>'
            } else {
                return '';
            }
        }

        // fn convert date_utc 2018/02/27 -> 1519689600000 // YY/MM/DD
        function convertDateUTC(pr_date_utc) {
            var date = new Date(pr_date_utc);
            var date_utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
            return date_utc;
        }
        // Function get && show default theme for website include (2018/02/27 || 1519689600000)
        function getDateUTC(pr_in, pr_out) {
            // Check pr_in không thể lớn hơn pr_out mặc định
            if ( convertDateUTC(pr_in) > convertDateUTC(pr_out) && convertDateUTC(pr_out) !== 0 ) {
                return console.log("'Thank you for using tdatapicker. Please, check property for element:'%c " + options.setDateCheckIn + ' > ' + options.setDateCheckOut + ' ', 'background: #f16d99; color: #fff');
            }
            
            var Array_In_Out = ['check-in', 'check-out'];
            for ( var i = 0; i< Array_In_Out.length; i++  ) {
                var label_title = settings.setTitleCheckIn;
                var getDay = pr_in;
                var Input = 'start'
                // Check CI có giá trị ngày thì remove label Nhận Phòng
                if ( pr_in !== null ) {
                    label_title = '';
                }
                if ( Array_In_Out[i] === 'check-out' ) {
                    label_title = settings.setTitleCheckOut;
                    getDay = pr_out;
                    // Giá trị CI lớn hơn 30 day giới hạn, lớn hơn ngày CO nếu đã có CO -> CO sẽ không có chọn ngày ở dates
                    // Null không có add dates và Dom
                    if ( pr_in === pr_out ) {
                        getDay = null;
                    }
                    Input = 'end'
                }
                // console.log(getDay)
                getDay = convertFormatDf(getDay)
                var formatDate = showValueInput(getDay);
                // console.log(getDay)
                getDay = convertDateUTC(getDay);
                this_el.find('.'+Array_In_Out[i]).html(setThemeCheckDate( label_title , Array_In_Out[i], getDay, Input, formatDate ))
            }
            // Array_In_Out.forEach( function(e) {
            //     var label_title = settings.setTitleCheckIn;
            //     var getDay = pr_in;
            //     var Input = 'start'
            //     // Check CI có giá trị ngày thì remove label Nhận Phòng
            //     if ( pr_in !== null ) {
            //         label_title = '';
            //     }
            //     if ( e === 'check-out' ) {
            //         label_title = settings.setTitleCheckOut;
            //         getDay = pr_out;
            //         // Giá trị CI lớn hơn 30 day giới hạn, lớn hơn ngày CO nếu đã có CO -> CO sẽ không có chọn ngày ở dates
            //         // Null không có add dates và Dom
            //         if ( pr_in === pr_out ) {
            //             getDay = null;
            //         }
            //         Input = 'end'
            //     }
            //     // console.log(getDay)
            //     getDay = convertFormatDf(getDay)
            //     var formatDate = showValueInput(getDay);
            //     // console.log(getDay)
            //     getDay = convertDateUTC(getDay);
            //     this_el.find('.'+e).html(setThemeCheckDate( label_title , e, getDay, Input, formatDate ))
            // })
            // Đổi qua dạng yy/mm/dd thì fn lib mới hoạt động okay
            function convertFormatDf(pr_date) {
                if ( typeof(pr_date) === 'string' ) {
                    var d = pr_date.split('/');
                    var yy_mm_dd = d[2]+'/'+d[1]+'/'+d[0]
                    if ( pr_date.includes('-') ) {
                        d = pr_date.split('-');
                        yy_mm_dd = d[2]+'-'+d[1]+'-'+d[0];
                    }
                    return yy_mm_dd; // Convert String '25/06/2018' - '29/06/2018'
                } else {
                    return pr_date; // convert date_utc 2018/02/27 -> 1519689600000 -> Number
                }
            }
            // Kiểm tra giá trị để show ra input là dd/mm/yy
            function showValueInput(pr_date) {
                if ( pr_date !== null ) {
                    var d = new Date(pr_date)
                    pr_date = check_num_10(d.getDate())+'-'+(check_num_10(d.getMonth()+1))+'-'+d.getFullYear();
                }
                return pr_date;
            }

            // Nếu không có data, data default sẽ là toDay và nextDays - null
            if ( pr_in === null || pr_out === null ) {
                pr_in = getToday();
                // next Day form dataCheckIn
                var date = new Date(pr_in);
                pr_out = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            }
            // return [dataCheckIn, dataCheckOut];

            // Giá trị CI lớn hơn 30 day giới hạn, lớn hơn ngày CO nếu đã có CO -> CO sẽ không có chọn ngày ở dates
            // if ( pr_in === pr_out ) {
            //     $('.year-check-out').remove();
            //     $('.month-check-out').remove();
            //     $('.day-check-out').remove();
            // }

            // Convert String '25/06/2018' - '29/06/2018'
            pr_in = convertFormatDf(pr_in)
            pr_out = convertFormatDf(pr_out)
            // convert date_utc 2018/02/27 -> 1519689600000 // YY/MM/DD -> Number
            return [convertDateUTC(pr_in), convertDateUTC(pr_out)];
        }
        var dataUTC = getDateUTC(settings.setDateCheckIn, settings.setDateCheckOut);


        
        // Nhận vào Elements [dates], date_utc = [1,2]
        function setDaysInMonth ( pr_el, pr_data_utc ) {
            // pr_el.parentElement.getElementsByClassName('datepicker')[0].innerHTML = convertArrayToString(dataTheme);
            // pr_el <=> this, define event for each calendar
            var tswitch = pr_el.find('.t_month');
            if ( setNumCalendar >= 0  ) {
                for ( var i_num = 0; i_num <= setNumCalendar; i_num++) {
                    // Call title month
                    var date = new Date(pr_data_utc)
                    var newDate = new Date(Date.UTC(date.getFullYear(), (date.getMonth() + i_num)));
                    tswitch[i_num].innerHTML = 'Tháng ' + (newDate.getMonth() + 1) + ' ' + newDate.getFullYear();
                    
                    // Global data days
                    var dataDays = [];
                    var dataUTCDate = [];
                    var days = [];

                    // Call data Next month follow number calendar
                    var nextDate = Date.UTC(date.getFullYear(), (date.getMonth() + i_num));
                    var date = new Date(nextDate)
                    while ( Date.UTC(date.getFullYear(), (date.getMonth()) ) === nextDate ) {
                        days.push(date.getDay());      // Day of week 0 - 6 tìm được vị trí ngày đầu tiên và cuối cùng trong tháng
                        dataDays.push(date.getDate()); // Day of month 1 -31 tìm được số ngày của 1 tháng
                        dataUTCDate.push(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) // Number day ex: 1519257600000
                        date.setDate(date.getDate() + 1); // So sánh số ngày của tháng
                    }
                    // console.log(days)
                    
                    // var days = [
                    //     0,             // 1
                    //     1,2,3,4,5,6,0, // 2
                    //     1,2,3,4,5,6,0, // 2
                    //     1,2,3,4,5,6,0, // 3
                    //     1,2,3,4,5,6,0, // 4
                    //     1,2,3,4,5,6,0, // 5
                    //     1     // 6
                    // ]

                    // console.log(days)
                    // Set Days before min in month
                    var beforeDay = days[0];
                    if ( beforeDay === 0 ) {
                        while ( beforeDay < 6 ) {
                            dataDays.unshift('');
                            dataUTCDate.unshift('');
                            beforeDay++;
                        }
                    } else {
                        while ( beforeDay > 1 ) {
                            dataDays.unshift('');
                            dataUTCDate.unshift('');
                            beforeDay--;
                        }
                    }
                    // Set Days after max in month
                    var afterDay = days[days.length-1];
                    while ( afterDay < 7 ) {
                        dataDays.push('');
                        dataUTCDate.push('');
                        afterDay++;
                    }
                    setThemeData(dataDays, dataUTCDate, i_num, pr_el)
                }
            }
            // console.log(pr_data_utc)
            // Nhận vào Elements [dates], date_utc = [1,2]
            getStyleDays( pr_el, pr_data_utc );
        }

        // Function setTheme show tablet date follow setNumCalendar 1,2,3 ...
        function setThemeData (dataDays, dataUTCDate, pr_num, pr_el) {
            var checkdataDays = dataDays.slice(-7)[0]
            if ( checkdataDays === '' ) {
                dataDays = dataDays.slice(0, -7)
            }
            var getTH = pr_el.find('tbody')
            getTH[pr_num].innerHTML = AppendDaysInMonth(Math.round(dataDays.length/7));
            var getTD = getTH[pr_num].querySelectorAll('td')
            for ( var td = 0; td < getTD.length; td++ ) {
                getTD[td].setAttribute('data-date', dataUTCDate[td]);
                getTD[td].innerHTML = dataDays[td];
            }
        }

        function getStyleDays(pr_el, pr_data_utc) {
            // Call Function click Next | Prev
            // Nhận vào Elements [dates], date_utc = [1,2]
            var limitdateN = clickEvent( pr_el, pr_data_utc )
            var toDayElement = pr_el.find('td')

            var d = new Date(dataUTC[0]);
            var limitRange = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + settings.setLimitDays );
            var end_limit = Date.UTC(new Date(limitdateN).getFullYear(), (new Date(limitdateN).getMonth()), new Date(limitdateN).getDate()+1);

            // console.log(limitRange)
            // console.log(new Date(limitRange))

            for ( var i = 0; i < toDayElement.length; i++ ) {
                var dayselect = toDayElement[i].getAttribute('data-date');

                // t_disabled all days before toDay
                if ( Number(dayselect) < toDay ) {
                    toDayElement[i].className = 't_disabled';
                }

                // disable Before Day position Check-out
                if ( pr_el.hasClass('check-out') === true ) {

                    if ( Number(dayselect) < dataUTC[0] ) {
                        toDayElement[i].className = 't_disabled';
                    }
                    if ( Number(dayselect) > dataUTC[1] ) {
                        toDayElement[i].className = 't_disabled';
                    }

                    // Setlimit Range khi ở check-out còn click được 31 ngày default hoặc có thể set setLimitDays
                    if ( Number(dayselect) != 0
                        && Number(dayselect) > dataUTC[0] && Number(dayselect) < limitRange 
                        && Number(dayselect) != dataUTC[1] ) {
                        toDayElement[i].className = 'day';
                    }

                    // disable button Arrow
                    var Arrow = pr_el.parent().find('.t_arrow');
                    Arrow = [].slice.call(Arrow)
                    Arrow.forEach( function(e, index) {
                        e.className = 't_disabled'
                        e.onclick = function() {
                            return;
                        }
                    });
                }

                // Range In --- Out
                if ( Number(dayselect) > dataUTC[0] && Number(dayselect) < dataUTC[1] ) {
                    toDayElement[i].className = 'range';
                }

                // Limit Day disable for check-in 1,2,3 .. months
                if ( Number(dayselect) > limitdateN ) {
                    toDayElement[i].className = 't_disabled';
                }

                // In - Ative check-in
                if ( Number(dayselect) === dataUTC[0] ) {
                    toDayElement[i].className = 't_start';
                }
                // Out - Active Check-out
                if ( Number(dayselect) === dataUTC[1] ) {
                    toDayElement[i].className = 't_end';
                }
                // && settings.setDateCheckIn !== null

                
                // Check disable Arrow Next and next Day limit
                if ( pr_el.hasClass('check-in') ) {
                    if ( Number(dayselect) === dataUTC[1] && Number(dayselect) === end_limit ) {
                        toDayElement[i].className = 'end_limit';
                    }
                }

                // highlighted toDay
                if ( Number(dayselect) ===  toDay ) {
                    // cln = cln.replace('special-day', '');
                    appendSpan(toDayElement[i], 'hover_day', 'hover_day_content', 'Hôm nay')
                    toDayElement[i].className = toDayElement[i].className.replace(' today', '') + ' today';
                }
                // Select stype for day in calendar
                var Cn = new Date( Number(dayselect) )
                Cn = Cn.getDay() 
                if ( Cn === 0 || Cn === 6 ) {
                    toDayElement[i].className = toDayElement[i].className.replace(' highlighted', '') + ' highlighted';
                }

                // Click td event when td has been value
                toDayElement[i].onclick = function (e) {
                    e.stopPropagation();
                    // Check nếu làm t_disabled không làm gì cả
                    if ( $(this).hasClass('t_disabled') === true ) { return; }
                    // eventClickDay do somethink
                    $(pr_el).trigger('eventClickDay')
                    
                    var data_utc_in, data_utc_out;
                    var get_utc = $(this).attr('data-date') // ngày click
                    // Click calendar ở check-out
                    var datepicker = $(this).parents('.check-out');

                    // get data UTC date
                    get_utc = Number( get_utc )
                    if ( $(this).parents('.check-in').hasClass('check-in') === true ) {
                        // Check số ngày lớn hơn 12 tháng hoặc limitNextMonth không cho click
                        if ( Number($(this).attr('data-date')) > limitdateN) { return; }
                        var d = new Date(dataUTC[1]);
                        // Giới hạn 30 ngày
                        var limitdate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - settings.setLimitDays);
                        data_utc_in = get_utc;
                        data_utc_out = dataUTC[1];
                        if ( get_utc > dataUTC[1] || get_utc === dataUTC[1] || get_utc < limitdate ) {
                            // var newD = new Date( get_utc )
                            // data_utc_out = Date.UTC(newD.getFullYear(), newD.getMonth(), (newD.getDate() + 1))

                            // Không hiện ngày check-out liền kề
                            data_utc_out = get_utc;
                        }
                        // console.log(new Date(data_utc_out))
                        // Click calendar ở check-in chuyển element qua check-out
                        datepicker = $(this).parents('.t-datepicker').find('.check-out')
                    }

                    if ( $(this).parents('.check-out').hasClass('check-out') === true ) {

                        if ( $(this).hasClass('t_start') === true ) { return; }
                        // ngăn không cho click ngày check-in khi đang ở check-out và không có ngày check-out
                        // if ( get_utc === dataUTC[1]  ) {
                        // }
                        data_utc_in = dataUTC[0];
                        data_utc_out = get_utc;

                        $(pr_el).trigger('afterCheckOut')
                        // Xoá check-out sao khi chọn ngày
                        setTimeout( function(){
                            if ( $('.datepicker').length !== 0 ) {
                                $('.datepicker').remove()
                            }
                        }, 10 )
                    }

                    // console.log(new Date(data_utc_in))
                    // console.log(new Date(data_utc_out))

                    dataUTC = getDateUTC( data_utc_in, data_utc_out )
                    callEventClick( datepicker, dataUTC )
                }

                // Function khi hover vào ngày đặc biệt DataEvent Holiday
                if ( 'ontouchstart' in window === false ) {
                    toDayElement[i].onmouseover = function(e) {
                        // Append special day
                        if ( $(this).hasClass('special-day') === true && $(this).parents('.datepicker').length != 0) {
                            $(this).parents('.datepicker').append('<p class="date-title">'+$(this).attr('date-title')+'</p>')
                        }

                        function checkNumNight(pr_el, pr_date_utc) {
                            var el_hover = Number($(pr_el).attr('data-date'));
                            var numDay = 0;

                            if ( e.target.className.includes('hover_day_content') || e.target.className.includes('t_disabled') ) {
                                return;
                            }
                            if ( $(pr_el).parents('.check-in').hasClass('check-in') === true ) {
                                var nd = new Date(pr_date_utc[1]);
                                var nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate());
                                var limitday = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() - settings.setLimitDays);
                                // Ở check-in nhỏ hơn hoặc = 30 tính từ ngày check-out nếu đã có check-out
                                if ( el_hover <= limitday ) { return; }

                                while ( el_hover < nd_1 ) {
                                    nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() - numDay);
                                    var t_this = $(pr_el).parents('.check-in').find('[data-date="' + nd_1 + '"]')[0];
                                        t_this.className = t_this.className.replace(' range_limit', '') + ' range_limit';

                                    numDay++;
                                    // console.log(numDay)
                                    if(numDay>1000) {return;}
                                }
                            }

                            if ( $(pr_el).parents('.check-out').hasClass('check-out') === true ) {
                                var nd = new Date(pr_date_utc[0]);
                                var nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate());
                                var limitday = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() + settings.setLimitDays);
                                // Ở check-out lớn hơn hoặc = 31 ngày tiếp theo stop
                                while ( el_hover != nd_1  ) {
                                    nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() + numDay);
                                    var t_this = $(pr_el).parents('.check-out').find('[data-date="' + nd_1 + '"]')[0];
                                        t_this.className = t_this.className.replace(' range_limit', '') + ' range_limit';
                                    numDay++;
                                    // console.log(numDay)
                                    if(numDay>5000) {return;}
                                }
                                // console.log(numDay)
                            }

                            return numDay;
                        }

                        var numDay = checkNumNight(this, dataUTC)
                        // console.log(numDay)
                        if ( numDay > 0 ) {
                            // fn Global - Hover khi ở check-in và khi ở check-out
                            appendSpan(this, 'hover_day', 'hover_day_content', (numDay - 1 + ' đêm') )
                        }

                        this.onmouseout = function() {
                            // Xoá tất cả các class hover_day trừ ngày toDay ra.
                            if ( this.getElementsByClassName('hover_day_content').length != 0 ) {
                                this.getElementsByClassName('hover_day_content')[0].remove();
                                this.className = this.className.replace(' hover_day', '');
                            }
                            if ( document.getElementsByClassName('range_limit').length != 0 ) {
                                var a = document.getElementsByClassName('range_limit');
                                a = [].slice.call(a)
                                for ( var i = 0; i<a.length; i ++ ) {
                                    a[i].className = a[i].className.replace(' range_limit', '');
                                }
                            }
                            // Care conflict today vs num night
                            if ( this.className.includes('today') ) {
                                appendSpan(this, 'hover_day', 'hover_day_content', 'Hôm nay')
                                this.className = this.className.replace(/\ hover_day/g, '') + ' hover_day';
                            }
                            // out hover hide special days
                            if ( fnParents(this, 'datepicker').getElementsByClassName('date-title').length != 0 ) {
                                var elem = fnParents(this, 'datepicker').getElementsByClassName('date-title');
                                elem = [].slice.call(elem)
                                for ( var i = 0; i<elem.length; i++ ) {
                                    elem[i].remove();
                                }
                            }
                        }

                    }
                }
            }

            // set DataEvent Holiday follow Days phai co setdate mới chạy và không cho chạy khi ở tablet
            // window.innerWidth > 1024
            if ( settings.fnDataEvent != undefined && 'ontouchstart' in window === false ) {
                // return;
                // Find number limit month options.setNumCalendar 1,2,3 ...
                for ( var cl = 0; cl < settings.setNumCalendar; cl++ ) {
                    var t = new Date(pr_data_utc).getMonth();
                    var m = t + 1 + cl;
                    if ( m === 13 ) { m = m - 12 }
                    var gMonth = m;
                    var gYear = new Date(pr_data_utc).getFullYear();

                    for ( var i = 0; i < toDayElement.length; i++ ) {
                        // Số ngày của tháng
                        var getNum = Number(toDayElement[i].textContent)
                        // Kiểm tra ngày hiện tại với ngày đặc biệt để lấy ngày today
                        if ( isNaN(getNum) ) {
                            getNum = new Date(toDay).getDate();
                        }
                        // Số ngày của tháng cần so sánh
                        var getDays = Number(toDayElement[i].getAttribute('data-date'));
                        var getMonths = new Date(getDays).getMonth() + 1;

                        // toDayElement[i].className.includes('today') === false check ngayf toDay
                        var key = gYear + '-' + check_num_10(gMonth) + '-' + check_num_10(getNum);
                        if ( settings.fnDataEvent[key] != undefined && getMonths === m ) {
                            var cln = toDayElement[i].className;
                            // cln = cln.replace('t_disabled', '');
                            toDayElement[i].className = toDayElement[i].className.replace(' special-day', '') + ' special-day';
                            // console.log(new Date(getDays).getMonth() + 1)
                            // console.log(getNum)
                            toDayElement[i].setAttribute('date-title', check_num_10(getNum) + ' Tháng ' + check_num_10((new Date(getDays).getMonth() + 1)) + ' - ' + settings.fnDataEvent[key])
                        }
                    }
                }
            }
        }

        function clickEvent(pr_el, pr_data_utc) {
            // console.log(pr_el)
            // console.log(pr_data_utc)
            // console.log(new Date(pr_data_utc[0]) , new Date(pr_data_utc[1]))
            var tArrow   = pr_el.find('.t_arrow');
            var df_toDay = new Date(toDay);
            var setLimitPrevMonth = Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() - settings.setLimitPrevMonth );
            var setLimitNextMonth = Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + settings.setLimitNextMonth);

            var newDate  = new Date(pr_data_utc)
            var y = newDate.getFullYear();
            var m = newDate.getMonth();
            var d = newDate.getDate();

            if ( tArrow.length != 0 ) {
                // Xoá các icons arrow trừ 2 cái đầu và cuối
                for ( var i = 1; i < tArrow.length - 1; i++ ) {
                    tArrow[i].innerHTML = '';
                }
                tArrow[0].onclick = function(e) {
                    e.stopPropagation()
                    if ( Date.UTC(y, m) > setLimitPrevMonth ) {
                        m = m - 1;
                        // Nhận vào Elements [dates], date_utc = [1,2]
                        setDaysInMonth( pr_el, Date.UTC(y, m) )
                    }
                }
                // Next Calendar
                tArrow[tArrow.length - 1].onclick = function(e) {
                    e.stopPropagation()
                    if ( Date.UTC(y, m+setNumCalendar) < setLimitNextMonth ) {
                        m = m + 1;
                        // Nhận vào Elements [dates], date_utc = [1,2]
                        setDaysInMonth( pr_el, Date.UTC(y, m) )
                    }
                }
            }

            var Arrow_2 = pr_el.find('.t_arrow');
            // disable button Arrow when check-in limit month
            if ( Date.UTC(y, m+setNumCalendar) != setLimitNextMonth && Date.UTC(y, m) === setLimitPrevMonth ) {
                Arrow_2[Arrow_2.length-1].className = 't_arrow t_next'
                Arrow_2[0].className = 't_arrow t_prev t_disabled'
            } else {
                Arrow_2[0].className = 't_arrow t_prev'
            }
            if ( Date.UTC(y, m+setNumCalendar) === setLimitNextMonth) {
                Arrow_2[Arrow_2.length-1].className = 't_arrow t_next t_disabled'
            } else {
                Arrow_2[Arrow_2.length-1].className = 't_arrow t_next'
            }

            return Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + settings.setLimitNextMonth, df_toDay.getDate());
        }
        // newDataUTC = getDateUTC(options.setDateCheckIn, 1522454400000);

        // Function show || Hide calendar [Date]
        function getTableCalendar(pr_el, pr_date_utc) {
            // console.log(pr_el)
            if ( $(pr_el).find('.datepicker').length !== 0 ) {
                $('.datepicker').remove();                
            } else {
                if ( $(pr_el).parents('html').find('.datepicker').length !== 0 ) {
                    $('.datepicker').remove();
                }
                $(pr_el).find('.dates').parent().append('<div class="datepicker">'+convertArrayToString(dataTheme)+'</div>')
                // Thêm calendar vào check-in hoặc check-out
                setDaysInMonth($(pr_el).find('.dates').parent(), pr_date_utc)
            }
            // Check chi click ra ngoài Calendar clear theme calendar
            $('html').on('click', function(e) {
                if ( $(e.target).parents('.t-datepicker').hasClass('t-datepicker') === false ) {
                    $('.datepicker').remove();
                }
            });
        }

        // getTableCalendar(this_el.find('.check-in'), getToday())
        // getTableCalendar(this_el.find('.check-in'), settings.setDateCheckIn)
        // getTableCalendar(this_el.find('.check-out'), getToday())


        var pr_callback = '';
        // var dataUTC = getDateUTC(options.setDateCheckIn, options.setDateCheckOut);
        function callEventClick(pr_callback, pr_date_utc ) {

            this_el.find('.dates').on('click', function(e) {
                // trigger CO or CI
                if ( $(e.target).parents('.check-in').hasClass('check-in') === true ) {
                    $(e.target).trigger('clickDateCI');
                }
                if ( $(e.target).parents('.check-out').hasClass('check-out') === true ) {
                    $(e.target).trigger('clickDateCO');
                }
                // trigger làm gì trước khi show calendar
                $(this).trigger('beforeShowDay');
                // Kiểm tra giá trị của CI === 'null' thì luôn show calendar ở CI
                var click = $(this).parent(); // -> .class check-in or .check-out
                if ( $(this).parents('.t-datepicker').find('.input-check-in').val() === 'null'
                && $(this).parents('.check-out').find('.input-check-out').val() === 'null' ) {
                    click = $(e.target).parents('.t-datepicker').find('.check-in');
                }
                getTableCalendar(click, pr_date_utc[0])
                setTimeout( function(){
                    if ( $('.datepicker').length !== 0 ) {
                        $(e.target).trigger('afterShowDay');
                    } else {
                        $(e.target).trigger('afterHideDay');
                    }
                }, 1 )
            })

            if ( pr_callback != '' ) {
                getTableCalendar(pr_callback, pr_date_utc[0]);
            }
            
        }
        callEventClick(pr_callback, dataUTC)


        return this;
    }

}( jQuery ))





