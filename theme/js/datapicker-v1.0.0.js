function tdatapicker( options ) {
	// Get Element
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
    var toDay = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    function getToday() {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    }

    // Function Global for library
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
            i++; if (i>250) {return;}
            // return pr_el_parent;
        }
        return pr_el_parent;
    }
    // Function when click body/html hide all calendar
    window.onclick = function(e) {
        if ( fnParents(e.target, 't-datepicker').nodeName === 'HTML' ) {
            fnHideAllCalendar();
        }
    }

    // Function hide all calendar when have call
    function fnHideAllCalendar() {
        var cl = document.getElementsByClassName('datepicker');
        cl = [].slice.call(cl);
        for ( var i = 0; i<cl.length; i++ ) {
            cl[i].innerHTML = '';
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
    var setTemplate = '<table class="table-condensed">'+
        '<thead>'+
            '<tr>'+
                '<th class="t_prev">'+setDefaultTheme(options.setArrowPrev, 'Prev')+'</th>'+
                '<th colspan="5" class="t_month"></th>'+
                '<th class="t_next">'+setDefaultTheme(options.setArrowNext, 'Next')+'</th>'+
            '</tr>'+
            '<tr>'+
                setDayOfWeek()+
            '</tr>'+
        '</thead>'+
        '<tbody></tbody>'+
        '</table>'


    // options add theme
    var setNumCalendar = 1;
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
    
    // Function check limit prev or next month format yy, mm ex: 2018/01
    function checkDate(pr_date, pr_name) {
        pr_date = pr_date.split('\/')
        var y = Number(pr_date[0].trim())
        var m = Number(pr_date[1].trim() - 1);
        if ( pr_name == 'next' ) {
            m = Number(pr_date[1].trim() - 1) - setNumCalendar;
        }
        return Date.UTC(y, m)
    }
    // Limit prev month in year
    var limitEndMonth = Date.UTC(d.getFullYear(), d.getMonth()); // 2
    if ( options.setLimitPrevMonth != undefined ) {
        limitEndMonth = checkDate(options.setLimitPrevMonth, 'prev');
    }
    // Limit next month in year
    var limitStartMonth = Date.UTC(d.getFullYear(), ( 13 - setNumCalendar)); // 2
    if ( options.setLimitNextMonth != undefined ) {
        limitStartMonth = checkDate(options.setLimitNextMonth, 'next');
    }

    // Theme Append html follow month tr > td dataDays/7
    function AppendDaysInMonth(pr_num) {
        var i = 0;
        var setTr = '';
        while ( i < pr_num ) {
            setTr = setTr + '<tr>'+
                '<td>1</td>'+
                '<td>2</td>'+
                '<td>3</td>'+
                '<td>4</td>'+
                '<td>5</td>'+
                '<td>6</td>'+
                '<td>0</td>'+
            '</tr>';
            i++;
        }
        return setTr;
    }

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
    function convertDateUTC(pr_utc_date) {
        var date = new Date(pr_utc_date);
        var date_utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        return date_utc;
    }
    var dataCheckIn, dataCheckOut, checkIn, checkOut;
    function getDateUTC(pr_in, pr_out) {
        // Nếu không có data, data default sẽ là toDay và nextDays
        dataCheckIn = setDefaultTheme(pr_in, getToday())
        // Convert to UTC 1519689600000
        dataCheckIn = convertDateUTC(dataCheckIn);
        // Fn get next Day form dataCheckIn
        function nextDays(pr_utc_date) {
            var date = new Date(pr_utc_date);
            var date_utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            return date_utc;
        }
        dataCheckOut = setDefaultTheme(pr_out, nextDays(dataCheckIn))
        dataCheckOut = convertDateUTC(dataCheckOut);

        checkIn = setThemeCheckDate(options.setTitleCheckIn, 'check-in', dataCheckIn)
        checkOut = setThemeCheckDate(options.setTitleCheckOut, 'check-out', dataCheckOut)

        return [dataCheckIn, dataCheckOut];
    }
    var dataUTC = getDateUTC(options.setDateCheckIn, options.setDateCheckOut);
    // console.log(dataUTC)
    
    // console.log(dataCheckIn)
    // console.log( new Date( dataCheckIn) )
    // console.log(dataCheckOut)
    // console.log( new Date( dataCheckOut) )

    function clickEvent(pr_el) {
        var tPrev = pr_el.querySelectorAll('.t_prev');
        var tNext = pr_el.querySelectorAll('.t_next');
        tPrev[0].onclick = function() {
            if ( Date.UTC(d.getFullYear(),m) > limitEndMonth ) {
                m = m - 1;
                setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(pr_el) )
            }
        }
        // Next Calendar
        tNext[0].onclick = function() {
            if ( Date.UTC(d.getFullYear(),m) < limitStartMonth ) {
                m = m + 1;
                setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(pr_el) )
            }
        }
    }

    function getTableCalendar(pr_el, pr_date_utc) {
        var findPicker = pr_el.parentElement.getElementsByClassName('datepicker')[0];
        var findTable = pr_el.parentElement.getElementsByClassName('table-condensed');
        if ( findTable.length != 0 ) {
            findPicker.innerHTML = '';
        } else {
            fnHideAllCalendar();
            findPicker.innerHTML = convertArrayToString(dataTheme);
            setDaysInMonth( dataUTC[0], findPicker ) // 02
            clickEvent(findPicker)
        }
    }
    
    for ( var i = 0; i < tElement.length; i++ ) {

        // Include html default days show calendar
        var tCheckIn = tElement[i].querySelectorAll('.check-in')[0];
        var tCheckOut = tElement[i].querySelectorAll('.check-out')[0];
        tCheckIn.innerHTML = convertArrayToString(checkIn);
        tCheckOut.innerHTML = convertArrayToString(checkOut);

        var clickShowDays = tElement[i].querySelectorAll('.dates');
        clickShowDays.forEach( function (e) {
            e.onclick = function () {
                getTableCalendar(e, dataUTC[0]);
            }
        });

        // var ad = tElement[i].querySelectorAll('.datepicker')[0];
        // ad.onclick = function(e) {
        //     e.stopPropagation()
        //     e.preventDefault()
        // }
        

        // EVENT
        // Prev Calendar m 1 <=> tg 02
        // function clickEvent(pr_el) {
        //     tPrev[0].onclick = function() {
        //         if ( Date.UTC(d.getFullYear(),m) > limitEndMonth ) {
        //             m = m - 1;
        //             setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(pr_el) )
        //         }
        //     }
        //     // Next Calendar
        //     tNext[0].onclick = function() {
        //         if ( Date.UTC(d.getFullYear(),m) < limitStartMonth ) {
        //             m = m + 1;
        //             setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(pr_el) )
        //         }
        //     }
        // }

        // Function get Data day in Month
        function setDaysInMonth ( pr_data_utc, pr_el ) {
            // pr_el <=> this, define event for each calendar
            var tswitch = pr_el.querySelectorAll('.t_month')
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
                        days.push(date.getDay());      // Day of week 0 - 6 tìm được cị trí ngày đầu tiên và cuối cùng trong tháng
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
        }

        // Function set data theme
        function setThemeData (dataDays, dataUTCDate, pr_num, pr_el) {
            var getTH = pr_el.querySelectorAll('tbody')
            getTH[pr_num].innerHTML = AppendDaysInMonth(Math.round(dataDays.length/7));
            var getTH = getTH[pr_num].querySelectorAll('td')
            getTH.forEach( function(e, index) {
                e.setAttribute('data-date', dataUTCDate[index]);
                e.innerHTML = dataDays[index];
            });

            getStyleDays(pr_el);
        }

        function getStyleDays(pr_el) {
            var toDayElement = pr_el.querySelectorAll('td')
            for ( var i = 0; i < toDayElement.length; i++ ) {
                var a = toDayElement[i].getAttribute('data-date');
                // highlighted toDay
                if ( Number(a) ===  toDay ) {
                    toDayElement[i].style.color = 'blue';
                }
                // disable Before Day
                if ( Number(a) < toDay ) {
                    toDayElement[i].style.color = 'red';
                }

                if ( Number(a) === dataUTC[0] ) {
                    toDayElement[i].style.backgroundColor = 'green';
                }

                if ( Number(a) === dataUTC[1] ) {
                    toDayElement[i].style.backgroundColor = 'green';
                }

                // toDayElement[i].onclick = function() {
                //     var a = this.getAttribute('data-date');
                //     if ( Number(a) >  toDay ) {
                //         this.style.backgroundColor = '#ddd';
                //     }
                // }

            }
        }

    }
}
