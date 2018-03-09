'use strict';
function tdatapicker( options ) {
	// Get Element and check select element
	var tElement = document.querySelectorAll(options.getElement);
    tElement = [].slice.call(tElement);
    if ( tElement.length === 0 ) {
        return console.log("'Thank you for using tdatapicker. Please, check property for element:'%c " + options.getElement + ' ', 'background: #f16d99; color: #fff');
    }

    // Global variable
    var aDays = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
    // var aMonths = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
    var d = new Date();
    var m = d.getMonth(); // 0 - 11
    var y = d.getFullYear();
    var toDay = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); // UTC
    function getToday() {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    }

    // FUNCTION GLOBAL FOR LIBRARY
    function setInfoTitle(pr_title, pr_class) {
        if ( pr_title != undefined ) {
            return '<div class="'+pr_class+'">'+pr_title+'</div>'
        } else {
            return pr_title = '';
        }
    }
    // Function set default if options = undefined
    function setDefaultTheme(pr_el, pr_default) {
        if ( pr_el != undefined ) {
            return pr_el;
        } else {
            return pr_default;
        }
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
            // check stop while
            i++; if (i>500) {return;}
            // return pr_el_parent;
        }
        return pr_el_parent;
    }
    // Function hide all calendar when have call
    function fnHideAllCalendar() {
        var cl = document.getElementsByClassName('datepicker');
        if ( cl.length != 0 ) {
            cl = [].slice.call(cl);
            for ( var i = 0; i<cl.length; i++ ) {
                cl[i].parentElement.removeChild(cl[i]);
            }
        }
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
    // this là đôi tượng cần append
    // pr_class_replace Class cần repalce nếu cần
    // pr_add_class Class cần thêm vào nếu cần 
    // pr_text_node Nội dung cần khởi tạo


    // THEME CALENDAR
    function convertArrayToString(pr_array) {
        pr_array = pr_array.toString();
        pr_array = pr_array.replace(/,/g, '');
        return pr_array;
    }
    // Theme Function  set type day of week
    function setDayOfWeek () {
        for ( var i = 0; i < aDays.length; i++ ) {
            aDays[i] = '<th>'+aDays[i]+'</th>';
        }
        return convertArrayToString(aDays)
    }
    
    // Theme Function get HTML table for calendar
    var setTemplate = '<table class="t-table-condensed">'+
        '<thead>'+
            '<tr>'+
                '<th class="t_arrow t_prev">'+setDefaultTheme(options.setArrowPrev, 'Prev')+'</th>'+
                '<th colspan="5" class="t_month"></th>'+
                '<th class="t_arrow t_next">'+setDefaultTheme(options.setArrowNext, 'Next')+'</th>'+
            '</tr>'+
            '<tr>'+
                setDayOfWeek()+
            '</tr>'+
        '</thead>'+
        '<tbody></tbody>'+
        '</table>'


    // options add theme
    var setNumCalendar = setDefaultTheme(options.setNumCalendar, 2);
    if ( options.setNumCalendar != undefined 
        && options.setNumCalendar > 1
        && !isNaN(options.setNumCalendar )) {
        setNumCalendar = options.setNumCalendar;
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
    function setThemeCheckDate(pr_title, pr_class, pr_data_utc) {
        var d = new Date(pr_data_utc)
        return '<div class="dates date-'+pr_class+'">'+
            setInfoTitle(pr_title, 'date-info-title')+
            setDefaultTheme(options.setIconDate, '<i class="glyphicon glyphicon-calendar"></i>')+
            '<span class="year-'+pr_class+'"> '+d.getFullYear()+'</span>'+
            '<span class="month-'+pr_class+'"> '+'/ '+ (d.getMonth() + 1) +'</span>'+
            '<span class="day-'+pr_class+'"> '+'/ '+ d.getDate() +'</span>'+
        '</div>'
        // +'<div class="datepicker"></div>'
    }

    // fn convert date_utc 2018/02/27 -> 1519689600000
    function convertDateUTC(pr_date_utc) {
        var date = new Date(pr_date_utc);
        var date_utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        return date_utc;
    }
    // Function get && show default theme for website include (2018/02/27 || 1519689600000)
    function getDateUTC(pr_in, pr_out) {
        // Check pr_in không thể lớn hơn pr_out mặc định
        if ( convertDateUTC(pr_in) > convertDateUTC(pr_out) ) {
            return console.log("'Thank you for using tdatapicker. Please, check property for element:'%c " + options.setDateCheckIn + ' > ' + options.setDateCheckOut + ' ', 'background: #f16d99; color: #fff');
        }
        // Nếu không có data, data default sẽ là toDay và nextDays
        var dataCheckIn = setDefaultTheme(pr_in, getToday())
        // Convert to UTC 1519689600000
        dataCheckIn = convertDateUTC(dataCheckIn);
        // Fn get next Day form dataCheckIn
        function nextDays(pr_date_utc) {
            var date = new Date(pr_date_utc);
            var date_utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            return date_utc;
        }
        var dataCheckOut = setDefaultTheme(pr_out, nextDays(dataCheckIn))
        dataCheckOut = convertDateUTC(dataCheckOut);

        

        for ( var i = 0; i < tElement.length; i++ ) {
            var checkIn = setThemeCheckDate(options.setTitleCheckIn, 'check-in', dataCheckIn)
            var checkOut = setThemeCheckDate(options.setTitleCheckOut, 'check-out', dataCheckOut)
            // Include html default days show calendar
            tElement[i].querySelectorAll('.check-in')[0].innerHTML = convertArrayToString(checkIn);
            tElement[i].querySelectorAll('.check-out')[0].innerHTML = convertArrayToString(checkOut);
            if ( dataCheckIn === dataCheckOut ) {
                // tElement[i].querySelectorAll('.date-check-out')[0].innerHTML = '';
                // tElement[i].querySelectorAll('.year-check-out')[0].innerHTML = '';
                // tElement[i].querySelectorAll('.month-check-out')[0].innerHTML = '';
                // tElement[i].querySelectorAll('.day-check-out')[0].innerHTML = '';

                tElement[i].querySelectorAll('.year-check-out')[0].remove();
                tElement[i].querySelectorAll('.month-check-out')[0].remove();
                tElement[i].querySelectorAll('.day-check-out')[0].remove();
            }
        }

        return [dataCheckIn, dataCheckOut];
    }
    var dataUTC = getDateUTC(options.setDateCheckIn, options.setDateCheckOut);

    // console.log(new Date(setLimitPrevMonth))
    // console.log(new Date(setLimitNextMonth))
    // var dataToday = '';
    function clickEvent(pr_el, pr_data_utc) {

        // console.log(pr_el)
        // console.log(pr_data_utc)
        // console.log(new Date(pr_data_utc[0]) , new Date(pr_data_utc[1]))
        var tArrow   = pr_el.parentElement.querySelectorAll('.t_arrow');
        var df_toDay = new Date(toDay);
        var setLimitPrevMonth = Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() - setDefaultTheme(options.setLimitPrevMonth, 0) );
        var setLimitNextMonth = Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + setDefaultTheme(options.setLimitNextMonth, 11));

        var newDate  = new Date(pr_data_utc[0])
        var y = newDate.getFullYear();
        var m = newDate.getMonth();
        var d = newDate.getDate();

        if ( tArrow.length != 0 ) {
            for ( var i = 1; i < tArrow.length - 1; i++ ) {
                tArrow[i].innerHTML = '';
            }
            tArrow[0].onclick = function(e) {
                e.stopPropagation()
                if ( Date.UTC(y, m) > setLimitPrevMonth ) {
                    m = m - 1;
                    // Nhận vào Elements [dates], date_utc = [1,2]
                    setDaysInMonth( pr_el, [Date.UTC(y, m), dataUTC[1]] )
                }
            }
            // Next Calendar
            tArrow[tArrow.length - 1].onclick = function(e) {
                e.stopPropagation()
                if ( Date.UTC(y, m+setNumCalendar) < setLimitNextMonth ) {
                    m = m + 1;
                    // Nhận vào Elements [dates], date_utc = [1,2]
                    setDaysInMonth( pr_el, [Date.UTC(y, m), dataUTC[1]] )
                }
            }
        }

        var Arrow_2 = pr_el.parentElement.querySelectorAll('.t_arrow');
        // disable button Arrow when check-in limit month
        if ( Date.UTC(y, m+setNumCalendar) != setLimitNextMonth && Date.UTC(y, m) === setLimitPrevMonth ) {
            Arrow_2[Arrow_2.length-1].className = 't_arrow t_next'
            Arrow_2[0].className = 't_arrow t_prev t-disabled'
        } else {
            Arrow_2[0].className = 't_arrow t_prev'
        }
        if ( Date.UTC(y, m+setNumCalendar) === setLimitNextMonth) {
            Arrow_2[Arrow_2.length-1].className = 't_arrow t_next t-disabled'
        }

        return Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + setDefaultTheme(options.setLimitNextMonth, 11), df_toDay.getDate());
    }
    // newDataUTC = getDateUTC(options.setDateCheckIn, 1522454400000);

    // Function show || Hide calendar [Date]
    function getTableCalendar(pr_el, pr_date_utc) {
        // Append Child datepicker div adter this check-in || check-out
        var node_calendar = document.createElement("DIV");
        node_calendar.className = 'datepicker'
        node_calendar.innerHTML = convertArrayToString(dataTheme);
        // pr_el.parentElement.appendChild(node_calendar);

        var findPicker = pr_el.parentElement.getElementsByClassName('datepicker')[0];
        var findTable = pr_el.parentElement.getElementsByClassName('t-table-condensed');
        // findPicker.innerHTML = convertArrayToString(dataTheme);
        // Nếu bản thân không có == 0, xoá tất cả, sau đó thêm vào chính nó
        // Nếu bản thân có != 0, xoá chính bản thân
        // console.log(findTable.length)
        if ( findTable.length != 0 ) {
            findPicker.remove();
        } else {
            fnHideAllCalendar();
            pr_el.parentElement.appendChild(node_calendar);
            setDaysInMonth( pr_el, pr_date_utc )
        }
        // Function when click body/html hide all calendar
        window.onclick = function(e) {
            // Xoá tất cả trừ khi click đúng vào các element t-datepicker
            if ( fnParents(e.target, 't-datepicker').nodeName === 'HTML' ) {
                fnHideAllCalendar();
            }
        }
    }

    // Nhận vào Elements [dates], date_utc = [1,2]
    function setDaysInMonth ( pr_el, pr_data_utc ) {
        // pr_el.parentElement.getElementsByClassName('datepicker')[0].innerHTML = convertArrayToString(dataTheme);
        // pr_el <=> this, define event for each calendar
        var tswitch = pr_el.parentElement.querySelectorAll('.t_month')
        if ( setNumCalendar >= 0  ) {
            for ( var i_num = 0; i_num <= setNumCalendar; i_num++) {

                // Call title month
                var date = new Date(pr_data_utc[0])
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
                function getDataDays(pr_days) {
                    // Set Days before min in month
                    var beforeDay = pr_days[0];
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
                    var afterDay = pr_days[pr_days.length-1];
                    while ( afterDay < 7 ) {
                        dataDays.push('');
                        dataUTCDate.push('');
                        afterDay++;
                    }
                }
                getDataDays(days)
                setThemeData(dataDays, dataUTCDate, i_num, pr_el)
            }
        }

        // Nhận vào Elements [dates], date_utc = [1,2]
        getStyleDays( pr_el, pr_data_utc );
    }

    // Function setTheme show tablet date follow setNumCalendar 1,2,3 ...
    function setThemeData (dataDays, dataUTCDate, pr_num, pr_el) {
        var getTH = pr_el.parentElement.querySelectorAll('tbody')
        getTH[pr_num].innerHTML = AppendDaysInMonth(Math.round(dataDays.length/7));
        var getTH = getTH[pr_num].querySelectorAll('td')
        getTH.forEach( function(e, index) {
            e.setAttribute('data-date', dataUTCDate[index]);
            e.innerHTML = dataDays[index];
        });
    }

    // set DataEvent follow Days
    var DataEvent = {
        t1  : { '1'  : 'Tết Dương Lịch'},
        t2  : { '14' : 'Lễ Tình Yêu'},
        t3  : { '8'  : 'Quốc Tế Phụ nữ',
                '14' : 'Trăng Non'
        },
        t4  : { '30' : 'Giải phóng Miền Nam Việt Nam'},
        t5  : { '1'  : 'Quốc Tế Lao Động' },
        t6  : { '1'  : 'Quốc Tế Thiếu Nhi' },
        t7  : { '15' : 'Rằm Tháng 07',
                '27' : 'Thương Binh Liệt Sĩ'
        },
        t8  : { '14' : 'Trăng Non' },
        t9  : { '14' : 'Trăng Non' },
        t10 : { '14' : 'Trăng Non' },
        t11 : { '20' : 'Ngày Nhà Giáo Việt Nam' },
        t12 : { '24' : 'Không Biết' }
    }
    DataEvent = setDefaultTheme(options.fnDataEvent, DataEvent)
    

    function getStyleDays(pr_el, pr_data_utc) {
        // Call Function click Next | Prev
        // Nhận vào Elements [dates], date_utc = [1,2]
        var limitdateN = clickEvent( pr_el, pr_data_utc )
        // dataUTC[0] chính là date ở click next || prev, ngày cuối cùng của tháng cuối cùng
        
        // Kiểm tra nếu tháng prev hoặc next = với data hiện tại sẽ nhận style
        if ( new Date(pr_data_utc[0]).getMonth() === new Date(dataUTC[0]).getMonth()
        || new Date(pr_data_utc[1]).getMonth() === new Date(dataUTC[1]).getMonth() ) {
            var toDayElement = pr_el.parentElement.querySelectorAll('td')

            var d = new Date(dataUTC[0]);
            var limitRange = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + setDefaultTheme(options.setLimitDays, 31) );
            var end_limit = Date.UTC(new Date(limitdateN).getFullYear(), (new Date(limitdateN).getMonth()), new Date(limitdateN).getDate()+1);

            // console.log(limitRange)
            // console.log(new Date(limitRange))

            for ( var i = 0; i < toDayElement.length; i++ ) {
                var dayselect = toDayElement[i].getAttribute('data-date');

                // t-disabled all days before toDay
                if ( Number(dayselect) < toDay ) {
                    toDayElement[i].className = 't-disabled';
                }

                // disable Before Day position Check-out
                if ( pr_el.className.includes('check-out') ) {

                    if ( Number(dayselect) < dataUTC[0] ) {
                        toDayElement[i].className = 't-disabled';
                    }
                    if ( Number(dayselect) > dataUTC[1] ) {
                        toDayElement[i].className = 't-disabled';
                    }

                    // Setlimit Range khi ở check-out còn click được 31 ngày default hoặc có thể set setLimitDays
                    if ( Number(dayselect) != 0
                        && Number(dayselect) > dataUTC[0] && Number(dayselect) < limitRange 
                        && Number(dayselect) != dataUTC[1] ) {
                        toDayElement[i].className = 'day';
                    }

                    // disable button Arrow
                    var Arrow = pr_el.parentElement.querySelectorAll('.t_arrow');
                    Arrow = [].slice.call(Arrow)
                    Arrow.forEach( function(e, index) {
                        e.className = 't-disabled'
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
                    toDayElement[i].className = 't-disabled';
                }

                // In - Ative check-in
                if ( Number(dayselect) === dataUTC[0] ) {
                    toDayElement[i].className = 'start';
                }
                // Out - Active Check-out
                if ( Number(dayselect) === dataUTC[1] ) {
                    toDayElement[i].className = 'end';
                }

                
                // Check disable Arrow Next and next Day limit
                if ( pr_el.className.includes('check-in') ) {
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
                    // Check nếu làm t-disabled không làm gì cả
                    if ( this.className.includes('t-disabled') === true ) { return; }
                    
                    var data_utc_in, data_utc_out;
                    var get_utc = this.getAttribute('data-date')
                    var datepicker = fnParents(this, 't-datepicker');

                    // get data UTC date
                    get_utc = Number( get_utc )
                    if ( fnParents(this, 'check-in').className.includes('check-in') ) {
                        // Check số ngày lớn hơn 12 tháng hoặc limitNextMonth không cho click
                        if ( Number(this.getAttribute('data-date')) > limitdateN) { return; }
                        var d = new Date(dataUTC[1]);
                        var limitdate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - setDefaultTheme(options.setLimitDays, 31) );                        
                        data_utc_in = get_utc;
                        data_utc_out = dataUTC[1];
                        if ( get_utc > dataUTC[1] || get_utc === dataUTC[1] || get_utc < limitdate ) {
                            // var newD = new Date( get_utc )
                            // data_utc_out = Date.UTC(newD.getFullYear(), newD.getMonth(), (newD.getDate() + 1))

                            // Không hiện ngày check-out liền kề
                            data_utc_out = get_utc;
                        }
                    }
                    if ( fnParents(this, 'check-out').className.includes('check-out') ) {
                        if ( this.className.includes('start') === true ) { return; }
                        // ngăn không cho click ngày check-in khi đang ở check-out và không có ngày check-out
                        // if ( get_utc === dataUTC[1]  ) {
                        // }
                        data_utc_in = dataUTC[0];
                        data_utc_out = get_utc;

                        // Get data sau khi chọn ngày ở check-out
                        if ( options.fnAfterCheckOut != undefined ) {
                            options.fnAfterCheckOut( getDateUTC( data_utc_in, data_utc_out ) )
                        }
                    }

                    dataUTC = getDateUTC( data_utc_in, data_utc_out )
                    callEventClick( datepicker, dataUTC )
                }

                // Function khi hover vào ngày đặc biệt
                toDayElement[i].onmouseover = function(e) {

                    // Append special day
                    if ( this.className.includes('special-day') === true ) {
                        if ( fnParents(this, 'datepicker').length != 0 ) {
                            // fn Global
                            appendSpan(fnParents(this, 'datepicker'), '', 'date-title', this.getAttribute('date-title'));
                        }
                    }

                    function checkNumNight(pr_el, pr_date_utc) {
                        var el_hover = Number(pr_el.getAttribute('data-date'));
                        var numDay = 0;

                        if ( e.target.className.includes('hover_day_content') || e.target.className.includes('t-disabled') ) {
                            return;
                        }

                        if ( fnParents(pr_el, 'check-in').className.includes('check-in') ) {
                            var nd = new Date(pr_date_utc[1]);
                            var nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate());
                            var limitday = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() - setDefaultTheme(options.setNumCalendar, 31));

                            // Ở check-in nhỏ hơn hoặc = 30 tính từ ngày check-out nếu đã có check-out
                            if ( el_hover <= limitday ) { return; }

                            while ( el_hover < nd_1 ) {
                                nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() - numDay);
                                var t_this = fnParents(pr_el, 'check-in').querySelectorAll('[data-date="' + nd_1 + '"]')[0];
                                    t_this.className = t_this.className.replace(' range_limit', '') + ' range_limit';

                                numDay++;
                                // console.log(numDay)
                                if(numDay>1000) {return;}
                            }
                        }

                        if ( fnParents(pr_el, 'check-out').className.includes('check-out') ) {
                            var nd = new Date(pr_date_utc[0]);
                            var nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate());
                            var limitday = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() + setDefaultTheme(options.setNumCalendar, 31));
                            // Ở check-out lớn hơn hoặc = 31 ngày tiếp theo stop
                            while ( el_hover != nd_1  ) {
                                nd_1 = Date.UTC( nd.getFullYear(), nd.getMonth(), nd.getDate() + numDay);
                                var t_this = fnParents(pr_el, 'check-out').querySelectorAll('[data-date="' + nd_1 + '"]')[0];
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
                            this.className = this.className.replace(' today', '') + ' today';
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

            // set DataEvent follow Days phai co setdate mới chạy
            if ( options.fnDataEvent != undefined ) {
                // return;
                // Find number limit month options.setNumCalendar 1,2,3 ...
                for ( var cl = 0; cl < setDefaultTheme(options.setNumCalendar, 2); cl++ ) {
                    var t = new Date(pr_data_utc[0]).getMonth();
                    var m = t + 1 + cl;
                    if ( m === 13 ) { m = m - 12 }
                    var gMonth = 't'+m;

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
                        if ( DataEvent[gMonth][getNum] != undefined && getMonths === m ) {
                            var cln = toDayElement[i].className;
                            // cln = cln.replace('t-disabled', '');
                            toDayElement[i].className = toDayElement[i].className.replace(' special-day', '') + ' special-day';
                            // console.log(new Date(getDays).getMonth() + 1)
                            // console.log(getNum)
                            toDayElement[i].setAttribute('date-title', getNum + ' Tháng ' + (new Date(getDays).getMonth() + 1) + ' - ' + DataEvent[gMonth][getNum])
                        }
                    }
                }
            }
        }
    }
    var pr_callback = '';
    // var dataUTC = getDateUTC(options.setDateCheckIn, options.setDateCheckOut);
    function callEventClick(pr_callback, pr_date_utc) {

        var findDates = document.getElementsByClassName('dates');

        var eachDates = [].slice.call(findDates)
        eachDates.forEach( function(e) {
            e.onclick = function () {
                getTableCalendar(this, pr_date_utc)
            }
        });

        getTableCalendar(findDates[0], pr_date_utc)
        // getTableCalendar(findDates[1], pr_date_utc)

        if ( pr_callback != '' ) {
            findDates = pr_callback.getElementsByClassName('dates')
            getTableCalendar(findDates[1], pr_date_utc);
        }

        if ( options.fnEventClickDay != undefined ) {
            options.fnEventClickDay(pr_date_utc)
        }
        
    }
    var findDates = document.getElementsByClassName('dates');
    callEventClick(pr_callback, dataUTC)

}

