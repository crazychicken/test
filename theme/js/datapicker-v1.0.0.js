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
                cl[i].innerHTML = '';
            }
        }
    }


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
        '</div>'+
        '<div class="datepicker"></div>'
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
        var setLimitNextMonth = Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + setDefaultTheme(options.setLimitNextMonth, 2));

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

        // disable button Arrow when check-in limit month
        if ( Date.UTC(y, m+setNumCalendar) === setLimitNextMonth ) {
            var Arrow_2 = pr_el.parentElement.querySelectorAll('.t_arrow');
            Arrow_2[Arrow_2.length-1].className = 'disabled'
        }

        return Date.UTC(df_toDay.getFullYear(), df_toDay.getMonth() + setNumCalendar + setDefaultTheme(options.setLimitNextMonth, 2), df_toDay.getDate());
    }
    // newDataUTC = getDateUTC(options.setDateCheckIn, 1522454400000);

    // Function show || Hide calendar [Date]
    function getTableCalendar(pr_el, pr_date_utc) {
        var findPicker = pr_el.parentElement.getElementsByClassName('datepicker')[0];
        var findTable = pr_el.parentElement.getElementsByClassName('table-condensed');
        // Nếu bản thân không có == 0, xoá tất cả, sau đó thêm vào chính nó
        // Nếu bản thân có != 0, xoá chính bản thân
        if ( findTable.length != 0 ) {
            findPicker.innerHTML = '';
        } else {
            fnHideAllCalendar();
            findPicker.innerHTML = convertArrayToString(dataTheme);
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
        // console.log(pr_data_utc)
        pr_el.parentElement.getElementsByClassName('datepicker')[0].innerHTML = convertArrayToString(dataTheme);
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
        t7  : { '15' : 'Rầm Tháng 07',
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

                // Select stype for day in calendar
                var Cn = new Date( Number(dayselect) )
                Cn = Cn.getDay() 
                if ( Cn === 0 || Cn === 6 ) {
                    toDayElement[i].style.color = 'blue';
                }                

                // disabled all days before toDay
                if ( Number(dayselect) < toDay ) {
                    toDayElement[i].className = 'disabled';
                }

                // highlighted toDay
                if ( Number(dayselect) ===  toDay ) {
                    toDayElement[i].style.color = 'red';
                }

                // disable Before Day position Check-out
                if ( pr_el.className.includes('check-out') ) {
                    if ( Number(dayselect) < dataUTC[0] ) {
                        toDayElement[i].className = 'disabled';
                    }
                    if ( Number(dayselect) > dataUTC[1] ) {
                        toDayElement[i].className = 'disabled';
                    }

                    // Setlimit Range khi ở check-out còn click được 31 ngày default hoặc có thể set setLimitDays
                    if ( Number(dayselect) != 0
                        && Number(dayselect) > dataUTC[0] && Number(dayselect) < limitRange 
                        && Number(dayselect) != dataUTC[1] ) {
                        toDayElement[i].className = '';
                    }

                    // disable button Arrow
                    var Arrow = pr_el.parentElement.querySelectorAll('.t_arrow');
                    Arrow = [].slice.call(Arrow)
                    Arrow.forEach( function(e, index) {
                        e.className = 'disabled'
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
                    toDayElement[i].className = 'disabled';
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
                

                // Click td event when td has been value
                toDayElement[i].onclick = function (e) {
                    e.stopPropagation();
                    // Check nếu làm disabled không làm gì cả
                    if ( this.className.includes('disabled') === true ) { return; }
                    
                    var data_utc_in, data_utc_out;
                    var get_utc = this.getAttribute('data-date')
                    var datepicker = fnParents(this, 't-datepicker');

                    // get data UTC date
                    get_utc = Number( get_utc )
                    if ( fnParents(this, 'check-in').className === 'check-in' ) {
                        // Check số ngày lớn hơn 12 tháng hoặc limitNextMonth không cho click
                        if ( Number(this.getAttribute('data-date')) > limitdateN) { return; }
                        var d = new Date(dataUTC[1]);
                        var limitdate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - setDefaultTheme(options.setLimitDays, 31) );                        
                        data_utc_in = get_utc;
                        data_utc_out = dataUTC[1];
                        if ( get_utc > dataUTC[1] || get_utc === dataUTC[1] || get_utc < limitdate ) {
                            var newD = new Date( get_utc )
                            data_utc_out = Date.UTC(newD.getFullYear(), newD.getMonth(), (newD.getDate() + 1))
                        }
                    }
                    if ( fnParents(this, 'check-out').className === 'check-out' ) {
                        if ( this.className.includes('start') === true ) { return; }
                        data_utc_in = dataUTC[0];
                        data_utc_out = get_utc;
                    }

                    dataUTC = getDateUTC( data_utc_in, data_utc_out )
                    callEventClick( datepicker, dataUTC)
                }

                toDayElement[i].onmouseover = function() {
                    if ( this.className.includes('special-days') === true ) {
                        if ( fnParents(this, 'datepicker').length != 0 ) {
                            var node = document.createElement("DIV");
                            node.className = 'date-title'
                            var textnode = document.createTextNode(this.getAttribute('date-title'));
                            node.appendChild(textnode); 
                            var calendar = fnParents(this, 'datepicker');
                            calendar.appendChild(node)
                        }
                    }
                    this.onmouseout = function() {
                        if ( fnParents(this, 'datepicker').getElementsByClassName('date-title').length != 0 ) {
                            var elem = fnParents(this, 'datepicker').getElementsByClassName('date-title')[0];
                            elem.parentElement.removeChild(elem);
                        }
                    }
                }
            }

            // set DataEvent follow Days
            if ( options.fnDataEvent != undefined ) {
                // Find number limit month options.setNumCalendar 1,2,3 ...
                for ( var cl = 0; cl < setNumCalendar; cl++ ) {
                    var t = new Date(pr_data_utc[0]).getMonth();
                    var m = t + 1 + cl;
                    var gMonth = 't'+m;

                    for ( var i = 0; i < toDayElement.length; i++ ) {
                        // Số ngày của tháng
                        var getNum = Number(toDayElement[i].textContent)
                        // Số ngày của tháng cần so sánh
                        var getDays = Number(toDayElement[i].getAttribute('data-date'));
                        var getMonths = new Date(getDays).getMonth() + 1;

                        if ( DataEvent[gMonth][getNum] != undefined && getMonths === m ) {
                            var cln = toDayElement[i].className;
                            // cln = cln.replace('disabled', '');
                            toDayElement[i].className = cln + ' special-days';
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

        function CallBack() {
            options.fnCallBack(pr_date_utc)
        }
        if ( options.fnCallBack != undefined ) {
            CallBack();
        }
        
    }
    var findDates = document.getElementsByClassName('dates');
    callEventClick(pr_callback, dataUTC)
}




// var ad = tElement[i].querySelectorAll('.datepicker')[0];
// ad.onclick = function(e) {
//     e.stopPropagation()
//     e.preventDefault()
// }