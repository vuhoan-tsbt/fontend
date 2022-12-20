app.controller("pay-ctrl", function ($scope, $http, $window, $rootScope) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Mời bạn đăng nhập !');
        return;
    }

    // const url_string = window.location.search;
    // const url = new URLSearchParams(url_string);
    // const vnp_TransistionStatus = url.get("vnp_TransactionStatus");
    // console.log(url.has("vnp_Amount"));
    // console.log(vnp_TransistionStatus);

    var url_string = window.location.href;
    var url = new URL(url_string);
    // console.log(url);
    var vnp_TransactionStatus = url.searchParams.get("vnp_TransactionStatus");
    // console.log(vnp_TransactionStatus);
    var bill = JSON.parse(localStorage.getItem('billVNP'));

    $scope.quantityProductVariant = 10;
    $scope.listYearInBill = [];

    const API_DASHBOARD = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/dashboards';
    const API_BILL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/bills';
    const API_PDF_BILL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/pdf/print';

    if (vnp_TransactionStatus == 00 && bill != null) {
        $http.post(`${API_BILL}/create-bill-and-billdetail`, bill, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.isLoading = false;
                console.log(resp.data);
                if (resp.data != null) {
                    // $scope.counts.splice($scope.tab - 1, 1);
                    // $scope.bills.push(resp.data);
                    // $scope[tabBill] = {};
                    // $scope.lstAddedProducts = {};

                    Swal.fire({
                        title: 'Bạn có muốn xuất hóa đơn?',
                        text: "",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $window.open(`${API_PDF_BILL}/${resp.data.billId}`, '_blank');
                        }
                        // $scope.getLstProduct();
                        $('#order-tab').tab('show');
                        toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                        // $scope.initializBill();
                        // createTab();
                    })
                    // }
                    // $scope.initializBill();
                    // toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                } else {
                    toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                }
                window.location.href = '/admin#!/pay_success';
            })
            .catch(error => {
                toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                $scope.success = 0;
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
        // window.location.href = '/admin#!/pay_success';
    } else {
        localStorage.removeItem("payTab");
        localStorage.removeItem("payTabOnl");
    }

    localStorage.removeItem("billVNP");
    function toastMessage(heading, text, icon) {
        // $.toast({
        //     heading: heading,
        //     text: text,
        //     position: 'top-right',
        //     icon: icon
        // })
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: icon,
            title: text
        })
    }

    ////////Top bán hàng///////////////////////////
    $scope.sellTypes = [
        {name: 'Bán chạy', type: 'selling'},
        {name: 'Bán ế', type: 'noSelling'}
    ]

    $scope.sellType = $scope.sellTypes[0];

    $scope.chooseViewSellType = function (type) {
        $scope.sellType = type;
        $scope.loadTopSell();
    }

    $scope.sellTop = 10;

    $scope.selectSellDays = [
        { name: '7 ngày qua', type: "7days" },
        { name: 'Tháng này', type: "thisMonth" },
        { name: 'Tháng trước', type: "lastMonth" },
        { name: 'Năm nay', type: "thisYEAR" }
    ]

    $scope.sellDay = $scope.selectSellDays[0];

    $scope.loadTopSell = async function (){
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }
        $scope.topProducts = [];
        var data = {
            type: $scope.sellType.type,
            top: $scope.sellTop,
            typeDate: $scope.sellDay.type
        }
        console.log(data);
        $scope.isLoading = true;
        $http.post(`${API_DASHBOARD}/find-top-product-selling`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.isLoading = false;
                $scope.topProducts = resp.data;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    } 
    $scope.loadTopSell();

    ////////Số lượng đơn mua chờ xác nhận //////////
    $scope.countSuccessBill = 0;

    function getCountSuccessBill (){
        $scope.isLoading = true;
        $http.get(`${API_DASHBOARD}/count-bill-wait-confirm`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.countSuccessBill = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }
    getCountSuccessBill ();

     ////////Số lượng đơn mua chờ xác nhận //////////
     $scope.countCancelBill = 0;

     function getCountCancelBill (){
        $scope.isLoading = true;
        $http.get(`${API_DASHBOARD}/count-bill-wait-confirm-return`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.countCancelBill = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }
    getCountCancelBill ();

    ////////số lượng đơn thành công //////////
    $scope.countSuccess = 0;
    
    $scope.countSuccessTypes = [
        { name: 'Hôm nay', type: "today" },
        { name: 'Hôm qua', type: "yesterday" },
        { name: '7 ngày qua', type: "7days" },
        { name: 'Tháng này', type: "thisMonth" },
        { name: 'Tháng trước', type: "lastMonth" }
    ]

    $scope.countSuccessType = $scope.countSuccessTypes[0];

    $scope.changeCountSuccessType = async function (type){
        $scope.countSuccessType = await type;
        await getCountSuccess();
    }

    async function getCountSuccess (){
        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/count-bill-by-status-and-type-date/4/${$scope.countSuccessType.type}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.countSuccess = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }
    getCountSuccess();

     ////////số lượng đơn hủy //////////
     $scope.countCancel = 0;

     $scope.countCancelTypes = [
        { name: 'Hôm nay', type: "today" },
        { name: 'Hôm qua', type: "yesterday" },
        { name: '7 ngày qua', type: "7days" },
        { name: 'Tháng này', type: "thisMonth" },
        { name: 'Tháng trước', type: "lastMonth" }
    ]

    $scope.countCancelType = $scope.countCancelTypes[0];

    $scope.changeCountCancelType = async function (type){
        $scope.countCancelType = type;
        await getCountCancel();
    }

    async function getCountCancel (){
        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/count-bill-by-status-and-type-date/5/${$scope.countCancelType.type}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.countCancel = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }
    getCountCancel();

    ////////Doanh thu///////////////////////////////


    $scope.dropdownRevenueDays = [
        { name: 'Hôm nay', type: "today" },
        { name: 'Hôm qua', type: "yesterday" },
        { name: '7 ngày qua', type: "7days" },
        { name: 'Tháng này', type: "thisMonth" },
        { name: 'Tháng trước', type: "lastMonth" }
    ]
    $scope.dropdownRevenueDaySelect = $scope.dropdownRevenueDays[0];
    $scope.dropdownRevenueDaySelectByOffline = $scope.dropdownRevenueDays[0];
    $scope.dropdownRevenueDaySelectByOnline = $scope.dropdownRevenueDays[0];

    //Mặc định là hôm nay
    getRevenueInSelectDay($scope.dropdownRevenueDaySelect.type);
    getRevenueInSelectDayByOffline($scope.dropdownRevenueDaySelectByOffline.type);
    getRevenueInSelectDayByOnline($scope.dropdownRevenueDaySelectByOffline.type);

    //Chọn kiểu doanh thu theo ...
    $scope.chooseViewRevenue = function (type) {
        $scope.dropdownRevenueDaySelect = type;
        if ("aboutDays" != type.type) {
            getRevenueInSelectDay(type.type);
        } else {
            getAboutDays();
        }
    }

    $scope.chooseViewRevenueByOffline = function (type) {
        $scope.dropdownRevenueDaySelectByOffline = type;
        if ("aboutDays" != type.type) {
            getRevenueInSelectDayByOffline(type.type);
        } else {
            getAboutDays();
        }
    }

    $scope.chooseViewRevenueByOnline = function (type) {
        $scope.dropdownRevenueDaySelectByOnline = type;
        if ("aboutDays" != type.type) {
            getRevenueInSelectDayByOnline(type.type);
        } else {
            getAboutDays();
        }
    }

    //Lấy tất cả các năm có bill
    $scope.isLoading = true;
    $http.get(`${API_DASHBOARD}/get-all-year-in-bill`, {
        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
    })
        .then(resp => {
            $scope.listYearInBill = resp.data;
            $scope.yearSelected = $scope.listYearInBill[0];
            $scope.topCustomerYearSelected = $scope.listYearInBill[0];
            $scope.yearLineSelected = $scope.listYearInBill[0];
            getRevenueByYear($scope.yearSelected);
            getTopCustomerByYear($scope.customerTop, $scope.topCustomerYearSelected);
            chartDashboard();
            $scope.isLoading = false;
        })
        .catch(error => {
            console.log(error);
            $scope.isLoading = false;
        })

    //Chọn năm doanh thu
    $scope.chooseYearRevenvue = function (year) {
        getRevenueByYear(year);
        $scope.yearSelected = year;
    }

    //Chọn năm doanh thu biểu đồ đường
    $scope.chooseYearRevenvueLine = function (year) {
        $scope.yearLineSelected = year;

        //Doanh thu các tháng theo năm hiện tại
        $scope.isLoading = true;
        $http.get(`${API_DASHBOARD}/get-element-month-by-year/${$scope.yearLineSelected}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var labels = [];
                var datasets = [];
                resp.data.forEach(data => {
                    labels.push(data.month);
                    datasets.push(data.money);
                });
                $scope.myLineChart.destroy();
                chartLine(labels, datasets);
                $scope.isLoading = false;
            })
            .catch(error => {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                } else if (error.status == 403) {
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập chức năng này !');
                    return;
                }
                console.log(error);
            })
    }

    async function chartDashboard() {
        //Doanh thu các tháng theo năm hiện tại
        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-element-month-by-year/${$scope.yearLineSelected}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var labels = [];
                var datasets = [];
                resp.data.forEach(data => {
                    labels.push(data.month);
                    datasets.push(data.money);
                });
                chartLine(labels, datasets);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })


        //Tỉ lệ doanh thu online và offline
        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-turnover-rate`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                turnoverRate(resp.data.offline, resp.data.online);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }

    // chartDashboard();

    async function getRevenueInSelectDay(type) {
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }

        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-revenue/${type}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.currentReveueDay = convertMoneyVN(resp.data.value);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }

    async function getRevenueInSelectDayByOffline(type) {
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }

        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-revenue/${type}/1`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.currentReveueDayByOffline = convertMoneyVN(resp.data.value);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }

    async function getRevenueInSelectDayByOnline(type) {
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }

        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-revenue/${type}/0`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.currentReveueDayByOnline = convertMoneyVN(resp.data.value);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }

    async function getRevenueByYear(year) {
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }

        //Doanh thu năm hiện tại
        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/get-revenue-year/${year}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.currentYearReveue = convertMoneyVN(resp.data.all);
                $scope.currentYearReveueOnline = convertMoneyVN(resp.data.online);
                $scope.currentYearReveueOffline = convertMoneyVN(resp.data.offline);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                } else if (error.status === 403) {
                    console.log("không được truy cập");
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập chức năng này!');
                    return;
                }
            })

        // $scope.isLoading = true;

    }

    async function getAboutDays() {
        await $http.get(`${API_DASHBOARD}/get-about-days`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.startDate = resp.data.startDate;
                $scope.endDate = resp.data.endDate;
                $scope.currentReveueDay = convertMoneyVN(resp.data.revenue);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }
    $scope.changeAboutDay = function (startDate, endDate) {
        $scope.errorAboutDay = {};
        setTimeout(() => {
            var data = {
                startDate: startDate,
                endDate: endDate
            }
            $scope.isLoading = true;
            $http.post(`${API_DASHBOARD}/get-revenue-by-about-day`, data, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    $scope.isLoading = false;
                    if (resp.data.value == null) {
                        resp.data.value = 0;
                    }
                    $scope.currentReveueDay = convertMoneyVN(resp.data.value);
                })
                .catch(error => {
                    console.log(error);
                    $scope.errorAboutDay = error.data;
                    $scope.currentReveueDay = convertMoneyVN(0);
                    $scope.isLoading = false;
                })
        }, 200);
    }



    function convertMoneyVN(money) {
        if (money == null || money == undefined) {
            money = 0;
        }
        return money.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    }


    //biểu đồ đường
    function chartLine(labels, datasets) {
        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        // ctx.destroy();
        // myLineChart.destroy();
        $scope.myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Doanh thu",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: datasets,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return '$' + number_format(value);
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                        }
                    }
                }
            }
        });
    }

    //////////Top khách hàng theo năm///////////

    $scope.lstCustomerTop = [];
    $scope.customerTop = 10;
    //Chọn năm của top khách hàng
    $scope.chooseCustomerYearRevenvue = function (year) {
        getTopCustomerByYear($scope.customerTop, year);
        $scope.topCustomerYearSelected = year;
    }

    //thay đổi top khách hàng
    $scope.changeCustomerTop = async function (){
        getTopCustomerByYear($scope.customerTop, $scope.topCustomerYearSelected);
    }

    //lấy top khách hàng theo năm
    async function getTopCustomerByYear(top, year) {
        var user = JSON.parse(localStorage.getItem('authToken2'));
        if (user.role <= 2) {
            setTimeout(() => {
                document.location = '/admin#!/order';
            }, 2000);
            sweetError('Bạn không có quyền truy cập chức năng này!');
            return;
        }

        $scope.isLoading = true;
        await $http.get(`${API_DASHBOARD}/find-top-customer/${top}/${year}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.lstCustomerTop = resp.data;
                $scope.lstCustomerTop.forEach(cus => {
                    console.log(cus);
                    cus.totalMoney = convertMoneyVN(cus.totalMoney);
                });
                // $scope.currentYearReveue = convertMoneyVN(resp.data.all);
                // $scope.currentYearReveueOnline = convertMoneyVN(resp.data.online);
                // $scope.currentYearReveueOffline = convertMoneyVN(resp.data.offline);
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                } else if (error.status === 403) {
                    console.log("không được truy cập");
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập chức năng này!');
                    return;
                }
                $scope.lstCustomerTop = [];
                toastMessage('', error.data.quantity, 'error');
            })
    }

    // Set new default font family and font color to mimic Bootstrap's default styling
    // Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    // Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }


    // Set new default font family and font color to mimic Bootstrap's default styling
    // Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    // Chart.defaults.global.defaultFontColor = '#858796';

    function turnoverRate(offline, online) {
        // Pie Chart Example
        var ctx = document.getElementById("myPieChart");
        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["Trực tiếp", "Online"],
                datasets: [{
                    data: [offline, online],
                    backgroundColor: ['#4e73df', '#1cc88a'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: false
                },
                cutoutPercentage: 80,
            },
        });
    }


    //findProductVariantByQuantity
    $scope.findProductVariantByQuantity = function (quantity) {
        $scope.isLoading = true;
        $http.get(`${API_DASHBOARD}/get-product-variant-by-less-quantity/${quantity}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listProductVariant = resp.data;
                $scope.errorQuantity={};
                $scope.isLoading = false;
            })
            .catch(error => {
                $scope.listProductVariant = [];
                $scope.errorQuantity = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    $scope.findProductVariantByQuantity($scope.quantityProductVariant);


    function sweetError(title) {
        Swal.fire(
            title,
            '',
            'error'
        )
    };

});

app.directive('dateFormat', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
            //Reset default angular formatters/parsers
            ngModelCtrl.$formatters.length = 0;
            ngModelCtrl.$parsers.length = 0;
        }
    };


});