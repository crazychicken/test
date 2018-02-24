function tdatapicker( options ) {
	// Get Element
	var tElement = document.querySelectorAll(options.getElement);
    tElement = [].slice.call(tElement);
    if ( tElement.length === 0 ) {
        return console.log("'Thank you for using tdatapicker. Please, check property for element:'%c " + options.getElement + ' ', 'background: #f16d99; color: #fff');
    }


    // Global variable
    var aDays = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
    var aMonths = [ 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' ];
    var d = new Date();
    var m = d.getMonth();
    var y = d.getFullYear();
    var toDay = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())

    var limitEndMonth = Date.UTC(2018,0); // 1
    var limitStartMonth = Date.UTC(2018,4); // 5


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
                '<th colspan="7" class="t_title"></th>'+
            '</tr>'+
            '<tr>'+
                '<th class="t_prev">'+'Prev'+'</th>'+
                '<th colspan="5" class="t_month"></th>'+
                '<th class="t_next">'+'Next'+'</th>'+
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

    // Limit month in year
    var limitEndMonth = Date.UTC(2017, 10); // 2
    var limitStartMonth = Date.UTC(2019, (3 - setNumCalendar)); // 4 set limit in month

    // Theme Append html follow month tr > td dataDays/7
    function AppendDaysInMonth(pr_num) {
        var i = 0;
        var setTr = '';
        while ( i < pr_num ) {
            setTr = setTr + '<tr>'+
                '<td>0</td>'+
                '<td>1</td>'+
                '<td>2</td>'+
                '<td>3</td>'+
                '<td>4</td>'+
                '<td>5</td>'+
                '<td>6</td>'+
            '</tr>';
            i++;
        }
        return setTr;
    }

    // Function Parents
    function fnParents(pr_el_parent) {
        // var i = 0;
        while ( pr_el_parent.className.includes('t-datepicker') !== true ) {
            pr_el_parent = pr_el_parent.parentElement;
            // i++; if (i>50) {return;}
        }
        return pr_el_parent;
    }

    var el = document.querySelectorAll('.t-datepicker')
    for ( var i = 0; i < el.length ; i++  ) {
        el[i].innerHTML = convertArrayToString(dataTheme);

        // Global get Element in html
        var tNext = el[i].querySelectorAll('.t_next')
        var tPrev = el[i].querySelectorAll('.t_prev')

        // EVENT
        // Prev Calendar m 1 <=> tg 02
        tPrev[0].onclick = function() {
            if ( Date.UTC(d.getFullYear(),m) > limitEndMonth ) {
                m = m - 1;
                setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(this) )
            }
        }
        // Next Calendar
        tNext[0].onclick = function() {
            if ( Date.UTC(d.getFullYear(),m) < limitStartMonth ) {
                m = m + 1;
                setDaysInMonth( Date.UTC(d.getFullYear(),m), fnParents(this) )
            }
        }

        // Call default function
        setDaysInMonth( Date.UTC(d.getFullYear(), m), el[i] ) // 02

        // Function get Data day in Month
        function setDaysInMonth ( pr_data_utc, pr_el ) {
            var tswitch = pr_el.querySelectorAll('.t_month')
            
            if ( setNumCalendar >= 0  ) {
                for ( var i = 0; i <= setNumCalendar; i++) {

                    // Call title month
                    var date = new Date(pr_data_utc)
                    var newDate = new Date(Date.UTC(date.getFullYear(), (date.getMonth() + i)));
                    tswitch[i].innerHTML = 'Tháng ' + (newDate.getMonth() + 1) + ' ' + newDate.getFullYear();
                    
                    // Global data days
                    var dataDays = [];
                    var dataUTCDate = [];
                    var days = [];

                    // Call data Next month follow number calendar
                    var nextDate = Date.UTC(date.getFullYear(), (date.getMonth() + i));
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
                    setThemeData(dataDays, dataUTCDate, i, pr_el)
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
