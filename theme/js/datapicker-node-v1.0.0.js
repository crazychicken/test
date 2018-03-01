// var a = new Date();
// console.log(a.getDate()) // 1 - 31
// console.log(a.getDay()) // so ngay trong 1 tuan 0 - 6
// console.log(a.getMonth()) // 0 - 11
// console.log(a.getFullYear())
// // get Number off day
// console.log(Date.UTC(2018,1,23)) // 1519344000000
// // return from number to day
// console.log(new Date(1519344000000))
    
// Options

// Qui định số calendar được hiển thị ra ngoài
// setNumCalendar: 1
// Default: 1;

// Giới hạn khi số tháng khi click prev
// setLimitPrevMonth
// Default: yy/ mm 
// Type: 'string' | ex: '2018/02'

//Giới hạn số tháng tiếp theo khi click next
// setLimitNextMonth
// Default: yy/ mm  | next 12 month
// Type: 'string' | ex: '2018/02'

// Qui định số ngày mặc định được hiển thị ra bên ngoài, mặc định là ngày hiện tại của máy tính
// setShowMonthDefault
// Default: yy/mm/dd  | next 12 month
// Type: 'string' | ex: '2018/02/25'

// Qui định title ở bên cạnh ngày
// setTitleCheckIn
// default: false
// style: 'string'

// setTitleCheckOut
// default: false
// style: 'string'

// Qui đinh title ở calendar
// setPickerTitleCheckIn
// default: 'Ngày nhận phòng'
// style: 'string'

// setPickerTitleCheckOut
// default: 'Ngày trả phòng'
// style: 'string'

// setArrowPrev: 'Ngày nhận phòng',
// default: 'Prev'
// style: 'string' <i class="glyphicon glyphicon-chevron-left"></i>

// setArrowNext: 'Ngày trả phòng'
// default: 'Next'
// style: 'string' <i class="glyphicon glyphicon-chevron-right"></i>


// setDateCheckIn: '2018/02/27'
// default: '2018/02/27' || toDay()
// style: 'string'

// setDateCheckOut: '2018/02/28'
// default: '2018/02/28' || nextDay()
// style: 'string'




// Click Check-in | Check-out của theme -> Show calendar của tháng đang được select ngày tháng hiện tại

// Show calendar nếu ở check-in 
// | -> có thể Next | Prev -> 12 tháng tiếp theo hoặc theo setLimitNextMonth: 3 yy/mm/dd hiện tại
// | -> if ngày được chọn lớn ngày check-out thì sẽ select ngày check-in -> check-out liền kề
// | -> if ngày được chọn nhỏ ngày check-in & check-out thì sẽ select ngày check-in & check-out hiện tại
// | -> chọn ngày trong 12 tháng giới hạn, sau khi chọn ngày và thoả điều kiện chuyển sang check-out với data vừa chọn
//      đồng thời phải set lại data calendar ở check-in theme ở phía trên

// Show calendar nếu ở check-out 
// | -> không thể click Prev setLimitPrevMonth
// | -> không thể chọn ngày lớn hơn check-in
// | -> không thể chọn ngày lớn hơn 1 tháng (30 ngày)


// Không có giá trị [Data]?   -> nhận giá trị toDay -> check-in -> check-out (lớn hơn 1 ngày)
// Khi nào update lại [Data]? -> khi đã được select vào ngày check-in || check-out lúc đó mới update lại [Date]









