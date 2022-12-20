app.controller('order-ctrl', function ($scope, $http, $window, $rootScope, $timeout) {
    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }


    var variable = '';
    var tabBill = '';
    var tabAddress = '';
    var totalProPrice = '';
    var lstDivision = '';
    var lstDistrict = '';
    var lstWard = '';
    $scope.tab = 1;
    var phoneRegex = /[0-9]{10,20}$/;

    $scope.sttCustomer = false;
    $scope.sttCustomerOnl = false;

    //lấy thông tin đăng nhập từ storage
    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));

    $scope.productVariant = {};
    $scope.productVariantEdit = {};
    $scope.lstProducts = [];
    $scope.sellers = [];
    $scope.customers = [];
    $scope.messageError = {};
    var indexTab = 0;

    $scope.formBill = {};
    $scope.billStatus5 = {};

    $scope.billDetails = [];
    $scope.billDetailStatus5 = [];

    $scope.billStatus123 = {};
    $scope.division123 = {};
    $scope.district123 = {};
    $scope.ward123 = {};
    $scope.webVNP = '';
    var shopDistrictId = 0;
    $scope.countBillWaitConfirm = 0;
    $scope.countBillWaitDelivery = 0;
    $scope.countBillWaitPay = 0;

    var count = 0;
    var countOnl = 0;
    $scope.counts = [];
    $scope.onlCounts = [];
    $scope.lstTabDeleted = [];
    $scope.lstTabDeleted = JSON.parse(localStorage.getItem('lstTabDeleted'));
    // console.log(lstTabDeleted);

    /**lấy lại thông tin order sau khi chuyển trang */
    var counts = localStorage.getItem('counts');
    // localStorage.setItem('counts', 0);
    if (counts > 0 && counts != null) {
        for (let i = 1; i <= counts; i++) {

            count = i;
            $scope.tab = count;
            if ($scope.lstTabDeleted != null) {
                if ($scope.lstTabDeleted.indexOf(i) != -1) {
                } else {
                    var data = {
                        index: count
                    }
                    $scope.counts.push(data);
                    variable = 'lstAddedProducts' + count;
                    $scope[variable] = JSON.parse(localStorage.getItem(variable));
                    tabBill = 'bill' + count;
                    $scope[tabBill] = JSON.parse(localStorage.getItem(tabBill));
                    tabAddress = 'address' + count;
                    $scope[tabAddress] = JSON.parse(localStorage.getItem(tabAddress));
                    getDivisionAfterVnPay($scope[tabAddress]);
                    totalProPrice = 'totalProPrice' + count;
                    $scope[totalProPrice] = {
                        price: JSON.parse(localStorage.getItem(totalProPrice))
                    };
                    $scope.tabCount += 1;
                    if ($scope.counts.length == 1) {
                        // $scope.selectedTabCreate();
                    }
                    // localStorage.removeItem(variable);
                    // localStorage.removeItem(tabBill);
                    // localStorage.removeItem(tabAddress);
                    // localStorage.removeItem(totalProPrice);
                }
            }
        }
    }
    localStorage.removeItem("payTab");





    const API_PRODUCT_VARIANT = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/product-variants';
    const API_VARIANT_VALUE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/variant-values';
    const API_BILL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/bills';
    const API_BILL_DETAIL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/bill-details';
    const API_USER = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/users';
    const API_SALE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales';
    const API_DOWNLOAD_QR_CODE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/download-QRCode/bill';
    const API_PDF_BILL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/pdf/print';
    const API_SETTING = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/settings/get-district-id-store';
    const API_VNPAY = 'http://buiquanghieu.xyz/PRO2111_FALL2022/api/vnpay';

    /**lấy id quận huyện của cửa hàng */
    function getShopDistrictId() {
        $http.get(`${API_SETTING}`)
            .then(resp => {
                shopDistrictId = resp.data.value;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }
    getShopDistrictId();

    /**đếm số bill chờ xác nhận */
    function countBillWaitConfirm() {
        $scope.countBillWaitConfirm = 0;
        $http.get(`${API_BILL}/count-bill-wait-for-confirmation`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.countBillWaitConfirm = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**đếm số bill chờ thanh toán */
    function countBillWaitPay() {
        $scope.countBillWaitPay = 0;
        $http.get(`${API_BILL}/count-bill-wait-for-pay`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.countBillWaitPay = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**đếm số bill chờ shipper */
    function countBillWaitDelivery() {
        $scope.countBillWaitDelivery = 0;
        $http.get(`${API_BILL}/count-bill-wait-for-delivery`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.countBillWaitDelivery = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    countBillWaitConfirm();
    countBillWaitPay();
    countBillWaitDelivery();

    /**khởi tạo list bill đã tồn tại */
    $scope.initializBill = async function () {
        $scope.isLoading = true;
        await $http.get(`${API_BILL}/get-bill-id`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                if (resp.data != null) {
                    $scope.formBill.billId = resp.data.billId;
                } else {
                    toastMessage('', 'Lỗi load mã HĐ', 'error');
                }
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    $scope.initializBill();

    /**Load thông thin người bán */
    $scope.initializSeller = async function () {
        $scope.isLoading = true;
        await $http.get(`${API_USER}/find-user-sale`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.sellers = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    $scope.initializSeller();

    /**xuất qr  */
    $scope.exportQrCodeBill = function (id) {
        window.open(`${API_DOWNLOAD_QR_CODE}/${id}`).focus();
    }

    /**xuất pdf */
    $scope.exportPDFBill = function (id) {
        window.open(`${API_PDF_BILL}/${id}`).focus();
    }

    /**Load thông tin khách hàng */
    $scope.initializCustomer = async function () {
        $scope.isLoading = true;
        $scope.customers = [];
        await $http.get(`${API_USER}/find-by-status-true`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var item = {
                    userId: -1,
                    fullName: 'Khách lẻ'
                }
                $scope.customers.push(item);
                resp.data.forEach(d => {
                    $scope.customers.push(d);
                });
                console.log($scope.customers);
                // $scope.customers = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    $scope.initializCustomer();

    /**Load list bill đã trả hàng */
    $scope.findBillReturnInvoices = async function () {
        $scope.listBillReturnInvoices = [];
        $scope.isLoading = true;
        await $http.get(`${API_BILL}/find-bill-return-invoices`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.listBillReturnInvoices = response.data;
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        saveOrder
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
    };

    /**Khởi tạo ban đầu */
    $scope.findBillReturnInvoices();

    /**khi thay dổi select khách hàng trong tạo mới hóa đơn */
    $scope.changeCustomer = async function (cus) {
        console.log(cus);
        tabAddress = 'address' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        $scope.messageCus = '';
        $scope.sttCustomer = false;
        if (cus != null) {
            $scope[tabBill].phone = angular.copy(cus.phone);
        } else {
            $scope[tabBill].phone = '';
        }
        if (cus != null && cus.divisionId != 0 && cus.userId != -1) {
            $scope[tabAddress].divisionId = cus.divisionId;
            $scope[tabAddress].divisionName = cus.divisionName;
            $scope[tabAddress].districtId = cus.districtId;
            $scope[tabAddress].districtName = cus.districtName;
            $scope[tabAddress].wardCode = cus.wardCode;
            $scope[tabAddress].wardName = cus.wardName;
            $scope[tabAddress].detailAddress = cus.address;
        }
        await $scope.getDivision();
        await $scope.shippingFee();
        await $scope.saveOrder();
    }

    /**mở modal thêm mới khách hàng */
    $scope.openModalAddNewCustomer = function () {
        $scope.messageError = {};
        $scope.newCustomer = {
            sex: 1,
            role: 1
        }
        $('#addNewCustomer').modal('show');
    }

    /**thêm mới khách hàng */
    $scope.addNewCustomer = async function () {
        console.log($scope.newCustomer);
        $scope.messageError = {};
        await Swal.fire({
            title: 'Bạn có thêm mới khách hàng?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoading = true;
                $http.post(`${API_USER}/create-customer`, $scope.newCustomer, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        $scope.customers.push(resp.data);
                        tabBill = 'bill' + $scope.tab;
                        $scope[tabBill].customers = angular.copy(resp.data);
                        toastMessage('', 'Thêm mới thành công!', 'success');
                        $('#addNewCustomer').modal('hide');
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Thêm mới khách hàng thất bại!', 'error');
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })
    }

    /**lấy ra 1 lít pv */
    $scope.getLstProduct = async function () {
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.lstProductVariant = resp.data;
                // $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
                $scope.pageProductVariant = 1;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //lấy giá trị vv của pv
        await $scope.lstProductVariant.forEach(item => {
            $scope.isLoading = true;
            $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    item.sales = resp.data.discount;
                    $scope.isLoading = false;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    $scope.isLoading = false;
                    console.log(error)
                })
        });
    };

    // $scope.getLstProduct();

    $(document).mouseup(function (e) {
        var container = $('#search');
        if (!container.is(e.target) && container.has(e.target).length == 0) {
            $scope.lstProductVariant = [];
        }
    })

    /**khi click nút X của lstProductVariant */
    $scope.closeLstProVal = function () {
        $scope.lstProductVariant = [];
    }

    /**check object empty */
    function isEmptyObject(obj) {
        return JSON.stringify(obj) === '{}'
    }

    /**khi click vao ô search */
    $scope.clickSearch = function (val) {
        // $scope.isLoading = true; 
        if ($scope.counts.length > 0 || !isEmptyObject($scope.billStatus5) || !isEmptyObject($scope.billStatus123)) {
            if (val === null || val === '' || val === undefined) {
                $scope.getLstProduct();
            }
        }
        // $scope.isLoading = false;
    }
    /**tim kiem Product Variant theo name */
    $scope.searchProductVariantByName = async function (val) {
        $scope.isLoading = true;
        if (val === null || val === '') {
            // $scope.lstProductVariant = [];
            // $scope.isLoading = false;\
            $scope.getLstProduct();
        } else {
            $scope.lstProductVariant = await [];
            $scope.isLoading = true;
            await $http.get(`${API_PRODUCT_VARIANT}/dynamic-search-by-key/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.lstProductVariant = resp.data;
                    console.log(resp.data);
                    $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                    $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
                    $scope.pageProductVariant = 1;
                    $scope.isLoading = false;
                }).catch(function (error) {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                });


            //GetVariantValueByProductVariant
            await $scope.lstProductVariant.forEach(item => {
                var customName = '';
                $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${item.variantId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        var lstData = resp.data;
                        var lstValueName = [];
                        lstData.forEach(subItem => {
                            lstValueName.push(subItem.optionValues.valueName);
                        });
                        customName = lstValueName.join("-");
                        //Set name product display
                        var nameOld = item.products.productName;
                        item.products.productName = `${nameOld} [${customName}]`;
                        $scope.isLoading = false;
                    })

                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                        console.log(error)
                    })
            });
            //lấy giá trị vv của pv
            await $scope.lstProductVariant.forEach(item => {
                $scope.isLoading = true;
                $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        item.sales = resp.data.discount;
                        $scope.isLoading = false;
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                        console.log(error)
                    })
            });
        }
    }

    /**tim kiem Customer theo phone hoặc email */
    $scope.searchCustomerByPhoneOrEmail = async function (val) {
        $scope.isLoading = true;
        if (val === null || val === '') {
            // $scope.lstProductVariant = [];
            // $scope.isLoading = false;\
            await $scope.initializCustomer();
        } else {
            $scope.customers = await [];
            $scope.isLoading = true;
            await $http.get(`${API_USER}/find-approximate-phone-or-email/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.customers = resp.data;

                    $scope.isLoading = false;
                }).catch(function (error) {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                });
        }
    }

    /**open Modal Add */
    $scope.modalAdd = async function (id) {
        $scope.messageQuantity = '';
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.productVariant = resp.data;
                $scope.maxProduct = $scope.productVariant.quantity;
                $scope.productVariant.quantity = 1;
                $('#exampleModalAddOrder').modal('show');

                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //GetVariantValueByProductVariant
        await $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${$scope.productVariant.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var lstData = resp.data;
                var lstValueName = [];
                lstData.forEach(subItem => {
                    lstValueName.push(subItem.optionValues.valueName);
                });
                customName = lstValueName.join("-");
                //Set name product display
                var nameOld = $scope.productVariant.products.productName;
                $scope.productVariant.products.productName = `${nameOld} [${customName}]`;
                $scope.isLoading = false;
            })

            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                console.log(error)
            })
    }

    /**thêm sp vào cart off */
    $scope.onAddCart = async function (proVal) {
        var maxProduct = 0;
        pv = angular.copy(proVal);
        if (pv.sales != undefined || pv.sales != null) {
            pv.price -= pv.sales;
        }
        console.log($scope.counts);
        $scope.messageBillDetails = '';
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.productVariant = resp.data;
                maxProduct = angular.copy($scope.productVariant.quantity);




                $scope.sumQuantity = 0;
                variable = 'lstAddedProducts' + $scope.tab;
                console.log($scope[variable]);
                if ($scope[variable] != null) {
                    $scope[variable].forEach(p => {
                        if (p.productVariants.variantId == pv.variantId) {
                            $scope.sumQuantity += p.quantity;
                        }

                    });
                }
                $scope.check = 0;
                if ($scope.sumQuantity + 1 > maxProduct) {
                    toastMessage('', 'Số lượng không đủ', 'error');
                    $scope.isLoading = false;
                    return;
                } else {
                    if ($scope[variable] != null) {
                        $scope[variable].forEach(p => {
                            if (p.productVariants.variantId == pv.variantId) {
                                $scope.ind = $scope[variable].findIndex(c => c.productVariants.variantId == pv.variantId);
                                $scope.check = 1;
                            }
                        });
                    }
                    if ($scope.check == 0) {
                        if ($scope[variable] != null) {
                            $scope[variable][$scope[variable].length] = {
                                productVariants: pv,
                                quantity: 1,
                                price: pv.price,
                                tax: pv.tax,
                                totalMoney: pv.price + (pv.price * pv.tax / 100)
                            }
                        } else {
                            $scope[variable][0] = {
                                productVariants: pv,
                                quantity: 1,
                                price: pv.price,
                                tax: pv.tax,
                                totalMoney: pv.price + (pv.price * pv.tax / 100)
                            }
                        }
                    } else {

                        $scope[variable][$scope.ind].quantity++;
                        $scope[variable][$scope.ind].totalMoney = ($scope[variable][$scope.ind].price * $scope[variable][$scope.ind].quantity) * (100 + $scope[variable][$scope.ind].tax) / 100;
                    }

                    totalProPrice = 'totalProPrice' + $scope.tab;
                    tabBill = 'bill' + $scope.tab;
                    $scope[totalProPrice].price = 0;
                    $scope[variable].forEach(p => {
                        $scope[totalProPrice].price += p.totalMoney;
                    });
                    $scope[totalProPrice].price -= $scope[totalProPrice].price * $scope[tabBill].discount / 100;
                    $scope[totalProPrice].price = parseInt($scope[totalProPrice].price.toFixed());
                    $scope.totalWeight();
                    // await $scope.shippingFee();
                    $scope.lstProductVariant = [];
                    $scope.saveOrder();
                    $scope.isLoading = false;
                }



                $scope.productVariant.quantity = 1;

                // $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //GetVariantValueByProductVariant
        $scope.isLoading = true;
        await $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var lstData = resp.data;
                var lstValueName = [];
                lstData.forEach(subItem => {
                    lstValueName.push(subItem.optionValues.valueName);
                });
                customName = lstValueName.join("-");
                //Set name product display
                var nameOld = $scope.productVariant.products.productName;
                $scope.productVariant.products.productName = `${nameOld} [${customName}]`;
                $scope.isLoading = false;
            })

            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                console.log(error)
            })
    }

    /**open edit cart */
    $scope.modalEditCart = function (index) {
        $scope.index = index;
        $scope.checkPrice = 0;
        $scope.messageQuantity = '';
        variable = 'lstAddedProducts' + indexTab;
        $scope.productVariantEdit = angular.copy($scope[variable][$scope.index]);
        $http.get(`${API_PRODUCT_VARIANT}/${$scope[variable][index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                $scope.maxProduct = resp.data.quantity;

                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        $('#exampleModalEditCart').modal('show');
    }

    /**thay đổi billdetail */
    $scope.onEditCart = function () {
        variable = 'lstAddedProducts' + indexTab;
        $scope.check = 0;
        if ($scope.productVariantEdit.quantity == undefined) {
            $scope.messageQuantity = 'Số lượng không phù hợp';
            $scope.check = 1;
        }

        $scope.oldQuantity = 0;
        $scope.ind = 0;
        $scope[variable].forEach(p => {
            if (p.productVariants.variantId == $scope.productVariantEdit.productVariants.variantId) {
                if ($scope.index != $scope.ind) {
                    $scope.oldQuantity += p.quantity;
                }
                $scope.ind++;
            }

        });

        if ($scope[variable][$scope.index].price == $scope.productVariantEdit.price) {
            $scope[variable][$scope.index].quantity = $scope.productVariantEdit.quantity;
            toastMessage('', 'Cập nhật thành công !', 'success');
            $('#exampleModalEditCart').modal('hide');
        } else {
            $scope[variable].forEach(p => {
                if (p.price == $scope.productVariantEdit.price) {
                    $scope.checkPrice = 1;
                }
            })
            if ($scope.checkPrice == 1) {
                $scope.in = $scope[variable].findIndex(p => p.productVariants.variantId == $scope.productVariantEdit.productVariants.variantId && p.price == $scope.productVariantEdit.price);
                $scope[variable][$scope.in].quantity += $scope.productVariantEdit.quantity;
                $scope[variable].splice($scope.index, 1);
                toastMessage('', 'Cập nhật thành công !', 'success');
                $('#exampleModalEditCart').modal('hide');
            } else {
                $scope[variable][$scope.index].price = $scope.productVariantEdit.price;
                toastMessage('', 'Cập nhật thành công !', 'success');
                $('#exampleModalEditCart').modal('hide');
            }
            // }
        }
        $scope.saveOrder();
    }

    /**modal xác nhận xóa billdetail  */
    $scope.modalDeleteCart = async function (index) {
        variable = 'lstAddedProducts' + indexTab;
        $scope.index = index;
        $('#exampleModalDeleteCart').modal('show');
    }



    /**Xóa billdetail */
    $scope.onDeleteCart = async function () {
        variable = 'lstAddedProducts' + indexTab;
        $scope[variable].splice($scope.index, 1);
        $('#exampleModalDeleteCart').modal('hide');
        toastMessage('', 'Xóa thành công !', 'success');

        totalProPrice = 'totalProPrice' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        $scope[totalProPrice].price = 0;
        $scope[variable].forEach(p => {
            $scope[totalProPrice].price += p.totalMoney;
        });
        $scope[totalProPrice].price -= $scope[totalProPrice].price * $scope[tabBill].discount / 100;
        $scope[totalProPrice].price = parseInt($scope[totalProPrice].price.toFixed());
        await $scope.totalWeight();
        await $scope.saveOrder();
    }


    $scope.changeNote = function () {
        $scope.messageNote = '';
    }

    /**tạo hóa đơn */
    $scope.create = async function () {
        tabBill = 'bill' + $scope.tab;
        variable = 'lstAddedProducts' + $scope.tab;
        tabAddress = 'address' + $scope.tab;
        totalProPrice = 'totalProPrice' + $scope.tab;
        statusBill = 'status' + $scope.tab;

        $scope[tabBill].users = $scope.userLogin;
        var lstPV = [];

        $scope.check = 0;
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';

        if (!phoneRegex.test($scope[tabBill].phone) || $scope[tabBill].phone.length < 9 || $scope[tabBill].phone.length > 20) {
            $scope.messagePhone = 'Số điện thoại phải là số từ 10 -> 20 số';
            $scope.check = 1;
        }
        if (($scope[tabBill].customers == undefined || $scope[tabBill].customers == null || $scope[tabBill].customers.userId == -1) && $scope[tabBill].billType == 0) {
            $scope.messageCus = 'Chưa chọn khách hàng';
            $scope.check = 1;
        }

        if ($scope[tabAddress].divisionName == undefined && $scope[tabBill].billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope[tabAddress].divisionName != undefined && $scope[tabAddress].districtName == '' && $scope[tabBill].billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope[tabAddress].divisionName != undefined && $scope[tabAddress].districtName != '' && $scope[tabAddress].wardName == '' && $scope[tabBill].billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        }

        if ($scope[tabBill].users == undefined) {
            $scope.messageSeller = 'Chưa chọn người bán';
            $scope.check = 1;
        }
        if ($scope[variable].length == 0) {
            $scope.messageBillDetails = 'Chưa có sản phẩm nào được chọn';
            $scope.check = 1;
        } else {
            $scope.messageBillDetails = '';
        }
        if (($scope[tabBill].discount != 0 && $scope[tabBill].note == undefined) || ($scope[tabBill].discount != 0 && $scope[tabBill].note == null)) {
            $scope.messageNote = 'Ghi chú không được để trống';
            $scope.check = 1;
        }

        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                lstPV = resp.data;

                // $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //lấy giá trị vv của pv
        await lstPV.forEach(item => {
            $scope.isLoading = true;
            $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    item.sales = resp.data.discount;
                    $scope[variable].forEach(pv => {
                        if (item.variantId == pv.productVariants.variantId) {
                            if (item.sales != 0) {
                                if (pv.price != (item.price - item.sales)) {
                                    $scope.messageNote += "\n Sản phẩm đã thay đổi giá theo giá gốc, mời bạn nhập ghi chú";
                                    $scope.check = 1;
                                    return;
                                }
                            } else {
                                if (pv.price != item.price) {
                                    $scope.messageNote += "\n Sản phẩm đã thay đổi giá theo giá gốc, mời bạn nhập ghi chú";
                                    $scope.check = 1;
                                    return;
                                }
                            }
                        }
                    });
                    // $scope.isLoading = false;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    $scope.isLoading = false;
                    console.log(error)
                })
        });

        setTimeout(() => {
            if ($scope.check == 1) {
                toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                $scope.isLoading = false;
                return;
            }
            if ($scope[tabBill].status == true) {
                $scope[tabBill].status = 0;
            } else {
                if ($scope[tabBill].billType == 1) {
                    $scope[tabBill].status = 4;
                } else {
                    $scope[tabBill].status = 2;
                }
            }

            console.log($scope[tabAddress].detailAddress);
            $scope[tabBill].divisionId = $scope[tabAddress].divisionId;
            $scope[tabBill].divisionName = $scope[tabAddress].divisionName;
            $scope[tabBill].districtId = $scope[tabAddress].districtId;
            $scope[tabBill].districtName = $scope[tabAddress].districtName;
            // $scope[tabBill].wardId = $scope[tabAddress].wardId;
            $scope[tabBill].wardName = $scope[tabAddress].wardName;
            $scope[tabBill].wardCode = $scope[tabAddress].wardCode;
            $scope[tabBill].address = $scope[tabAddress].detailAddress;

            // $scope[tabBill].address = $scope.addressOrder;
            console.log($scope[tabBill].customers);
            if ($scope[tabBill].customers == null || $scope[tabBill].customers.userId == -1) {
                $scope[tabBill].customers = undefined;
            }
            var data = {
                bill: $scope[tabBill],
                billDetails: $scope[variable]
            }
            console.log(data);
            if (JSON.parse(localStorage.getItem('lstTabDeleted')) == null) {
                $scope.lstTabDeleted = [];
                $scope.lstTabDeleted.push($scope.tab);
            } else {
                $scope.lstTabDeleted = JSON.parse(localStorage.getItem('lstTabDeleted'));
                $scope.lstTabDeleted.push($scope.tab);
            }
            $scope.isLoading = true;
            if ($scope[tabBill].payments == 1 && $scope[tabBill].status != 0) {
                var vnp_OrderInfo = 'thanh toan hoa don';
                var orderType = 'other';
                var language = 'vn';
                var amount = $scope[totalProPrice].price + $scope[tabBill].shippingFee;
                var bankCode = '';
                localStorage.setItem('billVNP', JSON.stringify(data));
                localStorage.setItem('payTab', $scope.tab);
                $http.post(`${API_VNPAY}/send?vnp_OrderInfo=${vnp_OrderInfo}&ordertype=${orderType}&amount=${amount}&bankcode=&language=${language}`)
                    .then(resp => {
                        window.location.href = resp.data.value;

                        $scope.isLoading = false;

                    }).catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        console.log(error);
                    })
            } else if ($scope[tabBill].status == 0) {
                $http.post(`${API_BILL}/create-bill-and-billdetail`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        if (resp.data != null) {
                            var index = $scope.counts.findIndex(c => c.index === $scope.tab);
                            $scope.counts.splice(index, 1);
                            // $scope.bills.push(resp.data);
                            // $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                            $scope[tabBill] = {};
                            // $('#order-tab').tab('show');
                            toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                            $scope.initializBill();
                            createTab();
                        } else {
                            toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                        }

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                        $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
            else {
                $http.post(`${API_BILL}/create-bill-and-billdetail`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        if (resp.data != null) {
                            var index = $scope.counts.findIndex(c => c.index === $scope.tab);
                            $scope.counts.splice(index, 1);
                            // $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                            $scope[tabBill] = {};
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
                                toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                                $scope.initializBill();
                                createTab();
                            })
                            // }
                            // $scope.initializBill();
                            // toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                        } else {
                            toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                        }

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                        $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }

            $scope.saveOrder();
        }, 500);

    }

    /**thay đổi khuyến mãi */
    $scope.changeDiscount = function () {
        totalProPrice = 'totalProPrice' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        if (!Number.isInteger($scope[tabBill].discount) || $scope[tabBill].discount > 100 || $scope[tabBill].discount < 0) {
            $scope[tabBill].discount = 0;
        }
        $scope[totalProPrice].price = 0;
        $scope[variable].forEach(p => {
            $scope[totalProPrice].price += p.totalMoney;
        });
        $scope[totalProPrice].price -= $scope[totalProPrice].price * $scope[tabBill].discount / 100;
        $scope[totalProPrice].price = parseInt($scope[totalProPrice].price.toFixed());
        $scope.saveOrder();
    }

    /**tính tổng số cân nặng của billdetail */
    $scope.totalWeight = async function () {
        await $scope[variable].forEach(c => {
            c.totalWeight = 0;
            $http.get(`${API_VARIANT_VALUE}/find-by-product-variant-origin/${c.productVariants.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    var lstVV = resp.data;
                    var index = lstVV.findIndex(v => v.optionValues.options.optionName == "CÂN NẶNG");
                    if (index != -1) {
                        c.totalWeight += parseInt(lstVV[index].optionValues.valueName) * c.quantity;
                    }
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })

        });
        setTimeout(() => {
            $scope.shippingFee();
        }, 1000);
    }

    /**tính giá phí ship */
    $scope.shippingFee = async function () {
        tabAddress = 'address' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        $scope[variable].totalWeight = 0;
        $scope[variable].forEach(p => {
            $scope[variable].totalWeight += p.totalWeight;
        });
        if ($scope[tabBill].billType == 1 || $scope[tabAddress].wardCode == undefined) {
            $scope[tabBill].shippingFee = 0;
            return;
        }
        //api lấy thông tin dịch vụ
        $scope.isLoading = true;
        var service = {
            shop_id: 3257646,
            from_district: shopDistrictId,
            to_district: $scope[tabAddress].districtId
        }
        $scope.isLoading = true;
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`, service, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        }).then(resp => {
            $scope.service_id = resp.data.data[0].service_id;
            $scope.isLoading = false;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            $scope.isLoading = false;
            console.log(error);
        })

        // api lấy phí ship
        var fee = {
            service_type_id: 2,
            insurance_value: $scope[totalProPrice].price,
            coupon: null,
            from_district_id: shopDistrictId,
            to_district_id: $scope[tabAddress].districtId,
            to_ward_code: $scope[tabAddress].wardCode,
            height: 15,
            length: 15,
            weight: $scope[variable].totalWeight,
            width: 15
        }
        $scope.isLoading = true;
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, fee, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7', 'shop_id': 3257646 }
        }).then(resp => {
            $scope.totalFee = resp.data.data.total;
            $scope[tabBill].shippingFee = resp.data.data.total;
            $scope.isLoading = false;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            $scope.isLoading = false;
            console.log(error);
        })
    }

    $scope.billStatus = 1;
    $scope.txtSearch = '';

    /**load list bill theo status */
    $scope.loadListBill = function () {
        $scope.getBillsByStatus($scope.billStatus);
        $scope.billStatus = 1;
        countBillWaitConfirm();
        countBillWaitPay();
        countBillWaitDelivery();
    }

    $scope.selectedAllBill = false;
    //getBillsByStatus
    $scope.getBillsByStatus = async function (value) {
        $('#txtSearchBill').val('');
        if ($('#checkAll1').prop('checked')) {
            $('#checkAll1').click(); // Unchecks it
        }
        if ($('#checkAll2').prop('checked')) {
            $('#checkAll2').click(); // Unchecks it
        }
        if ($('#checkAll3').prop('checked')) {
            $('#checkAll3').click(); // Unchecks it
        }
        $scope.isLoading = true;
        $scope.billStatus = value;
        await $http.get(`${API_BILL}/get-bill-by-status/${value}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.bills = resp.data;
                $scope.currentPage = 1;
                $scope.begin = 0;
                $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                $scope.pageBill = 1;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }


    $scope.billDetailsBuy = [];
    $scope.billDetailsCusReturn = [];
    $scope.billDetailsStoreReturn = [];
    /**get bill detail */
    $scope.getBillDetail = async function (bill) {
        console.log(bill);
        $scope.returnBillIndex = $scope.listBillReturnInvoices.findIndex(c => c.billId == bill.billId);
        $scope.bill = bill;

        if (($scope.bill.address == '' && $scope.bill.divisionName == undefined) || ($scope.bill.address == undefined && $scope.bill.divisionName == undefined)) {
            $scope.addressBill = '';
        }
        else if (($scope.bill.address == '' && $scope.bill.divisionName != undefined && $scope.bill.districtName == '') || ($scope.bill.address == undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName == '')) {
            $scope.addressBill = $scope.bill.divisionName;
        }
        else if (($scope.bill.address == '' && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName == '') || ($scope.bill.address == undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName == '')) {
            $scope.addressBill = $scope.bill.districtName + ' - ' + $scope.bill.divisionName;
        }
        else if (($scope.bill.address == '' && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName != '') || ($scope.bill.address == undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName != '')) {
            $scope.addressBill = $scope.bill.wardName + ' - ' + $scope.bill.districtName + ' - ' + $scope.bill.divisionName;
        }


        else if (($scope.bill.address != '' && $scope.bill.divisionName == undefined) || ($scope.bill.address != undefined && $scope.bill.divisionName == undefined)) {
            $scope.addressBill = $scope.bill.address;
        }
        else if (($scope.bill.address != '' && $scope.bill.divisionName != undefined && $scope.bill.districtName == '') || ($scope.bill.address != undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName == '')) {
            $scope.addressBill = $scope.bill.address + ' - ' + $scope.bill.divisionName;
        }
        else if (($scope.bill.address != '' && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName == '') || ($scope.bill.address != undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName == '')) {
            $scope.addressBill = $scope.bill.address + ' - ' + $scope.bill.districtName + ' - ' + $scope.bill.divisionName;
        }
        else if (($scope.bill.address != '' && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName != '') || ($scope.bill.address != undefined && $scope.bill.divisionName != undefined && $scope.bill.districtName != '' && $scope.bill.wardName != '')) {
            $scope.addressBill = $scope.bill.address + ' - ' + $scope.bill.wardName + ' - ' + $scope.bill.districtName + ' - ' + $scope.bill.divisionName;
        }


        $scope.isLoading = true;
        await $http.get(`${API_BILL_DETAIL}/find-by-bill-detail-customer-buy/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.billDetailsBuy = response.data;
                console.log($scope.billDetailsBuy);
                $scope.isLoading = false;
            }).catch(function (error) {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            });


        $scope.isLoading = true;
        await $http.get(`${API_BILL_DETAIL}/find-by-bill-detail-customer-return/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.billDetailsCusReturn = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            });

        $scope.isLoading = true;
        await $http.get(`${API_BILL_DETAIL}/find-by-bill-detail-store-return/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.billDetailsStoreReturn = response.data;
                $scope.isLoading = false;
                $('#exampleModalCartDetail').modal('show');
            }).catch(function (error) {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**Page Product Variant */
    $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSizeProductVariant = 10; // Hiển thị 5 thuộc tính
    $scope.pageProductVariant = 1;

    /** Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change ProductVariant */
    $scope.repaginateProductVariant = function (size) {
        $scope.beginProductVariant = 0;
        $scope.pageProductVariant = 1;
        $scope.pageCountProductVariant = Math.ceil($scope.lstProductVariant.length / size);
        $scope.pageSizeProductVariant = size;
    };

    /**Hàm nút first */
    $scope.firstProductVariant = function () {
        $scope.beginProductVariant = 0;
        $scope.pageProductVariant = 1;
    };


    /** Hàm nút previous */
    $scope.previousProductVariant = function () {
        if ($scope.beginProductVariant > 0) {
            $scope.beginProductVariant -= $scope.pageSizeProductVariant;
            $scope.pageProductVariant--;
        }
    }


    //**Hàm nút next */
    $scope.nextProductVariant = function () {
        if ($scope.beginProductVariant < (Math.ceil($scope.lstProductVariant.length / $scope.pageSizeProductVariant) - 1) * $scope.pageSizeProductVariant) {
            $scope.beginProductVariant += $scope.pageSizeProductVariant;
            $scope.pageProductVariant++;
        }
    }


    /** Hàm nút last */
    $scope.lastProductVariant = function () {
        $scope.beginProductVariant = (Math.ceil($scope.lstProductVariant.length / $scope.pageSizeProductVariant) - 1) * $scope.pageSizeProductVariant;
        $scope.pageProductVariant = $scope.pageCountProductVariant;
    }

    /**Page Bill */
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 5 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;


    /**selectPage */
    $scope.selectPage = function (page) {
        $('#txtSearchBill').val('');
        if ($('#checkAll1').prop('checked')) {
            $('#checkAll1').click(); // Unchecks it
        }
        if ($('#checkAll2').prop('checked')) {
            $('#checkAll2').click(); // Unchecks it
        }
        if ($('#checkAll3').prop('checked')) {
            $('#checkAll3').click(); // Unchecks it
        }
        $scope.selectedAllBill = false;
        $scope.begin = (page - 1) * $scope.pageSize;
        $scope.currentPage = page;
    }

    /**nextPage */
    $scope.nextPage = function () {
        $scope.begin = ($scope.currentPage + 1 - 1) * $scope.pageSize;
        $scope.currentPage++;
    }

    $scope.prevPage = function () {
        $scope.begin = ($scope.currentPage - 1 - 1) * $scope.pageSize;
        $scope.currentPage--;
    }

    $scope.nextListPage = function () {
        $('#txtSearchBill').val('');
        if ($('#checkAll1').prop('checked')) {
            $('#checkAll1').click(); // Unchecks it
        }
        if ($('#checkAll2').prop('checked')) {
            $('#checkAll2').click(); // Unchecks it
        }
        if ($('#checkAll3').prop('checked')) {
            $('#checkAll3').click(); // Unchecks it
        }
        $scope.selectedAllBill = false;
        $scope.currentPage = $scope.endListPage + 1;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prevListPage = function () {
        $('#txtSearchBill').val('');
        if ($('#checkAll1').prop('checked')) {
            $('#checkAll1').click(); // Unchecks it
        }
        if ($('#checkAll2').prop('checked')) {
            $('#checkAll2').click(); // Unchecks it
        }
        if ($('#checkAll3').prop('checked')) {
            $('#checkAll3').click(); // Unchecks it
        }
        $scope.selectedAllBill = false;
        $scope.currentPage = $scope.startListPage - $scope.pageInList;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.repaginateBill = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.bills.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
    }

    // // Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change Bill
    // $scope.repaginateBill = function (size) {
    //     $scope.beginBill = 0;
    //     $scope.pageBill = 1;
    //     $scope.listPage = getListPaging($scope.bills.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
    //     $scope.pageSizeBill = size;
    // };

    // // Hàm nút first
    // $scope.firstBill = function () {
    //     $scope.beginBill = 0;
    //     $scope.pageBill = 1;
    // };


    // // Hàm nút previous
    // $scope.previousBill = function () {
    //     if ($scope.beginBill > 0) {
    //         $scope.beginBill -= $scope.pageSizeBill;
    //         $scope.pageBill--;
    //     }
    // }


    // // Hàm nút next
    // $scope.nextBill = function () {
    //     if ($scope.beginBill < (Math.ceil($scope.bills.length / $scope.pageSizeBill) - 1) * $scope.pageSizeBill) {
    //         $scope.beginBill += $scope.pageSizeBill;
    //         $scope.pageBill++;
    //     }
    // }


    // // Hàm nút last
    // $scope.lastBill = function () {
    //     $scope.beginBill = (Math.ceil($scope.bills.length / $scope.pageSizeBill) - 1) * $scope.pageSizeBill;
    //     $scope.pageBill = $scope.pageCountBill;
    // }
    function totalPages(totalRecord, limit) {
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        return totalPage;
    }

    function getListPaging(totalRecord, limit, currentPage, pageInList) {
        $scope.isLoading = true;
        var listPage = [];
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        var startPage = getStartPage(currentPage, pageInList);
        var endPage = getEndPage(startPage, pageInList, totalPage);
        for (let i = startPage; i <= endPage; i++) {
            listPage.push(i);
        }
        $scope.totalPage = totalPage;
        $scope.isLoading = false;
        return listPage;
    }

    function getStartPage(currentPage, limit) {
        var startPage = (parseInt((currentPage - 1) / limit) * limit + 1);
        $scope.startListPage = startPage;
        return startPage;
    }

    function getEndPage(startPage, limit, totalPage) {
        var endPage = startPage + limit - 1;
        if (endPage > totalPage) {
            endPage = totalPage;
        }
        $scope.endListPage = parseInt(endPage);
        return parseInt(endPage);
    }

    /**get billDetail theo variantId */
    $scope.getProductVariantId = async function (billDetail) {
        $('#exampleModalCartDetail').modal('hide');
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT_VARIANT}/${billDetail.productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                // $scope.productVariantEdit = resp.data;
                $scope.maxProduct = resp.data.quantity;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
            })
        $scope.detailBillUpdate = angular.copy(billDetail);
        $('#exampleModalUpdateBill').modal('show');
    }


    /**sửa bill */
    $scope.onEditBill = async function (billDetailUpdate) {
        $scope.isLoading = true;
        await $http.put(`${API_BILL_DETAIL}`, billDetailUpdate, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                $scope.getBillDetail(billDetailUpdate.bills);

                $http.get(`${API_BILL}/${$scope.bill.billId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        var index = $scope.bills.findIndex(c => c.billId == $scope.bill.billId);
                        $scope.bills[index] = angular.copy(resp.data);
                        $scope.isLoading = false;
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        console.log(error);
                        $scope.isLoading = false;
                    })


                toastMessage('', 'Cập nhật thành công', 'success');
                $('#exampleModalUpdateBill').modal('hide');
                $('#exampleModalCartDetail').modal('show');
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                toastMessage('', 'Cập nhật thất bại', 'error');
                $('#exampleModalUpdateBill').modal('hide');
                $('#exampleModalCartDetail').modal('show');
                $scope.messageError = error.data;
                console.log(error);
            })


    }

    $scope.closeEditBill = function () {
        $('#exampleModalUpdateBill').modal('hide');
        $('#exampleModalCartDetail').modal('show');
    }

    /**lưu thông tin bill được tạo mới */
    $scope.saveOrder = function () {
        if ($scope.counts.length > 0) {
            localStorage.setItem('counts', count);
            $scope.counts.forEach(c => {
                tabBill = 'bill' + c.index;
                variable = 'lstAddedProducts' + c.index;
                tabAddress = 'address' + c.index;
                totalProPrice = 'totalProPrice' + c.index;
                localStorage.setItem(variable, JSON.stringify($scope[variable]));
                localStorage.setItem(tabBill, JSON.stringify($scope[tabBill]));
                localStorage.setItem(tabAddress, JSON.stringify($scope[tabAddress]));
                localStorage.setItem(totalProPrice, JSON.stringify($scope[totalProPrice].price));
                localStorage.setItem('lstTabDeleted', JSON.stringify($scope.lstTabDeleted));
            });

        }
    }

    /**giảm số lượng trong giỏ hàng off */
    $scope.decrease = async function (index) {
        variable = 'lstAddedProducts' + $scope.tab;
        if ($scope[variable][index].quantity != 1) {
            $scope[variable][index].quantity -= 1;
            $scope[variable][index].totalMoney = ($scope[variable][index].quantity * $scope[variable][index].price) * (100 + $scope[variable][index].tax) / 100;
            console.log($scope[variable][index]);
        }
        await $scope.totalWeight();
        await $scope.changeDiscount();
        await $scope.saveOrder();
    }


    /**tăng số lượng trong giỏ hàng Off */
    $scope.increase = function (index) {
        variable = 'lstAddedProducts' + $scope.tab;
        var maxProduct = 0;
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT_VARIANT}/${$scope[variable][index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                maxProduct = resp.data.quantity;
                $scope.sumQuantity = 0;
                $scope[variable].forEach(p => {
                    if (p.productVariants.variantId == $scope[variable][index].productVariants.variantId) {
                        $scope.sumQuantity += p.quantity;
                    }

                });

                if ($scope.sumQuantity >= maxProduct) {
                    toastMessage('', 'Số lượng không phù hợp', 'error');
                    // $scope[variable][index].quantity -= 1;
                } else {

                    $scope[variable][index].quantity += 1;
                    $scope[variable][index].totalMoney = ($scope[variable][index].quantity * $scope[variable][index].price) * (100 + $scope[variable][index].tax) / 100;
                }
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                console.log(error);
            })
        $scope.totalWeight();
        $scope.changeDiscount();
        $scope.saveOrder();
    }



    var oldQuantityProduct = 1;
    $scope.oldQuantityOfCart = function (index) {
        variable = 'lstAddedProducts' + $scope.tab;
        oldQuantityProduct = $scope[variable][index].quantity;
    }

    /** thay đổi số lượng billdetail */
    $scope.quantityChange = function (index) {
        console.log('azv');
        variable = 'lstAddedProducts' + $scope.tab;
        console.log($scope[variable]);
        if (!Number.isInteger($scope[variable][index].quantity) && $scope[variable][index].quantity > 0) {
            $scope[variable][index].quantity = 1;
            toastMessage('', 'Số lượng không phù hợp', 'error');
            return;
        }
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT_VARIANT}/${$scope[variable][index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                $scope.maxProduct = resp.data.quantity;

                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        $scope.sumQuantity = 0;
        $scope[variable].forEach(p => {
            if (p.productVariants.variantId == $scope[variable][index].productVariants.variantId) {
                $scope.sumQuantity += p.quantity;
            }

        });

        if ($scope[variable][index].quantity == undefined || $scope.sumQuantity > $scope.maxProduct) {
            toastMessage('', 'Số lượng không phù hợp', 'error');
            $scope[variable][index].quantity = 1;
        } else {
            $scope[variable][index].totalMoney = ($scope[variable][index].quantity * $scope[variable][index].price) * (100 + $scope[variable][index].tax) / 100;
        }
        totalProPrice = 'totalProPrice' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        $scope[totalProPrice].price = 0;
        $scope[variable].forEach(p => {
            $scope[totalProPrice].price += p.totalMoney;
        });
        $scope[totalProPrice].price -= $scope[totalProPrice].price * $scope[tabBill].discount / 100;
        $scope[totalProPrice].price = parseInt($scope[totalProPrice].price.toFixed());
        $scope.totalWeight();
        $scope.changeDiscount();
        $scope.saveOrder();

    }

    $scope.oldPriceOfCart = function (index) {
        variable = 'lstAddedProducts' + $scope.tab;
        $scope.oldPriceProduct = $scope[variable][index].price;
    }

    /** thay đổi giá billdetail */
    $scope.priceChange = function (index) {
        variable = 'lstAddedProducts' + $scope.tab;
        if ($scope[variable][index].price == undefined) {
            toastMessage('', 'Giá không phù hợp', 'error');
            $scope[variable][index].price = $scope.oldPriceProduct;
            return;
        }

        $scope.checkPrice = 0;
        // if ($scope[variable][index].price != $scope.oldPriceProduct) {

        //     $scope.count = 0;
        //     $scope[variable].forEach(p => {
        //         if (p.price == $scope[variable][index].price) {
        //             $scope.quantitySplice = $scope[variable][index].quantity;
        //             $scope.priceSplice = $scope[variable][index].price;
        //             // $scope[variable].splice(index, 1);
        //             $scope.ind = $scope[variable].findIndex(c => c.productVariants.variantId == p.productVariants.variantId && c.price == $scope.priceSplice);
        //             $scope.count++;
        //         }
        //     })
        //     if ($scope.count > 1) {
        //         $scope.checkPrice = 1;
        //     }
        //     if ($scope.checkPrice == 1) {
        //         $scope[variable].splice(index, 1);
        //         $scope[variable][$scope.ind].quantity += $scope.quantitySplice;
        //     }

        // }
        $scope[variable][index].totalMoney = ($scope[variable][index].quantity * $scope[variable][index].price) * (100 + $scope[variable][index].tax) / 100;
        totalProPrice = 'totalProPrice' + $scope.tab;
        tabBill = 'bill' + $scope.tab;
        $scope[totalProPrice].price = 0;
        $scope[variable].forEach(p => {
            $scope[totalProPrice].price += p.totalMoney;
        });
        $scope[totalProPrice].price -= $scope[totalProPrice].price * $scope[tabBill].discount / 100;
        $scope[totalProPrice].price = parseInt($scope[totalProPrice].price.toFixed());
        $scope.shippingFee();
        $scope.changeDiscount();
        $scope.saveOrder();
    }

    $scope.filterOption = 1;

    /**tìm kiếm bill theo statuss */
    $scope.filter = async function (filterOption) {
        $scope.filterOption = filterOption;
        $scope.selectedAllBill = false;
        if ($scope.val === null || $scope.val === '') {
            $scope.getBillsByStatus($scope.billStatus);
        } else {
            $scope.searchBill($scope.val);
        }

    }

    $scope.searchBill = async function (val) {
        $scope.isLoading = true;
        $scope.selectedAllBill = false;
        $scope.val = val;
        if (val === null || val === '') {
            $scope.getBillsByStatus($scope.billStatus);
        } else {
            if ($scope.filterOption == 1) {
                $scope.bills = await [];
                $scope.isLoading = true;
                await $http.get(`${API_BILL}/search-approximate-bill/${val}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.bills = resp.data.filter(function (task) {
                            return task.status == $scope.billStatus;
                        });
                        $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                        $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                        $scope.pageBill = 1;
                        $scope.isLoading = false;
                    }).catch(function (error) {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        console.log(error);
                        $scope.isLoading = false;
                    });
            } else if ($scope.filterOption == 2) {
                $scope.bills = await [];
                $scope.isLoading = true;
                await $http.get(`${API_BILL}/search-approximate-customer/${val}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.bills = resp.data.filter(function (task) {
                            return task.status == $scope.billStatus;
                        });
                        $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                        $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                        $scope.pageBill = 1;
                        $scope.isLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                    });
            } else if ($scope.filterOption == 3) {
                $scope.bills = await [];
                $scope.isLoading = true;
                await $http.get(`${API_BILL}/search-approximate-phone/${val}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.bills = resp.data.filter(function (task) {
                            return task.status == $scope.billStatus;
                        });
                        $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                        $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                        $scope.pageBill = 1;
                        $scope.isLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                    });
            } else if ($scope.filterOption == 4) {
                $scope.bills = await [];
                $scope.isLoading = true;
                await $http.get(`${API_BILL}/search-approximate-address/${val}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.bills = resp.data.filter(function (task) {
                            return task.status == $scope.billStatus;
                        });
                        $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                        $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                        $scope.pageBill = 1;
                        $scope.isLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                    });
            } else if ($scope.filterOption == 5) {
                $scope.bills = await [];
                $scope.isLoading = true;
                await $http.get(`${API_BILL}/search-approximate-seller/${val}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.bills = resp.data.filter(function (task) {
                            return task.status == $scope.billStatus;
                        });
                        $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                        $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                        $scope.pageBill = 1;
                        $scope.isLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.isLoading = false;
                    });
            }

        }
    }


    /**lấy thông tin bill status chờ thanh toán */
    $scope.getBillStatus5 = function (bill) {
        $scope.checkCus = false;
        if ($scope.billStatus5.customers == null) {
            $scope.checkCus = true;
        }
        console.log(bill);
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
        $scope.isLoading = true;
        $scope.billStatus5 = angular.copy(bill);
        if ($scope.billStatus5.customers == null) {
            var user = {
                userId: -1
            }
            $scope.billStatus5.customers = user;
        }
        console.log($scope.billStatus5);
        $scope.billStatus5Add = angular.copy(bill);
        if ($scope.billStatus5.status == 0) {
            $scope.billStatus5.status = true;
        } else {
            $scope.billStatus5.status = false;
        }
        $scope.getDivisionStatus5();
        $scope.getBillDetailStatus5(bill);
        console.log($scope.billDetailStatus5);
        $('#staticUpdateStatus5').modal('show');
    }

    $scope.billDetailStatus5 = [];
    $scope.getBillDetailStatus5 = function (bill) {
        $http.get(`${API_BILL_DETAIL}/find-by-bill/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.billDetailStatus5 = response.data;
                console.log($scope.billDetailStatus5);
                $scope.billDetailsStatus5Origin = angular.copy(response.data);

                $scope.totalProPrice();
                $scope.shippingFeeStatus5();
                console.log($scope.proPrice);
                $scope.billDetailStatus5.forEach(item => {
                    $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${item.productVariants.variantId}`, {
                        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                    })
                        .then(resp1 => {
                            var lstData = resp1.data;
                            var lstValueName = [];
                            lstData.forEach(subItem => {
                                lstValueName.push(subItem.optionValues.valueName);
                            });
                            customName = lstValueName.join("-");
                            //Set name product display
                            var nameOld = item.productVariants.products.productName;
                            item.productVariants.products.productName = `${nameOld} [${customName}]`;


                            $scope.isLoading = false;
                        })

                        .catch(error => {
                            if (error.status == 401) {
                                $scope.isLoading = false;
                                setTimeout(() => {
                                    document.location = '/admin#!/login';
                                }, 2000);
                                sweetError('Mời bạn đăng nhập !');
                                return;
                            }
                            $scope.isLoading = false;
                            console.log(error)
                        })
                });

                $scope.isLoading = false;
            }).catch(function (error) {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            });
    }

    $scope.closeUpdateBillStatus5 = function () {
        {

            if ($scope.billStatus5.status == true) {
                $scope.billStatus5.status = 0;
            } else {
                $scope.billStatus5.status = 4;
            }
            $scope.billStatus5 = {};
        }
    }

    /**giảm số lượng trong giỏ hàng status chờ thanh toán  */
    $scope.decreaseStatus5 = function (index) {
        // variable = 'lstAddedProducts' + $scope.tab;
        if ($scope.billDetailStatus5[index].quantity != 1) {
            $scope.billDetailStatus5[index].quantity -= 1;
            $scope.billDetailStatus5[index].totalMoney = $scope.billDetailStatus5[index].quantity * $scope.billDetailStatus5[index].price * (100 + $scope.billDetailStatus5[index].tax) / 100;
        }
        $scope.totalProPrice();
        $scope.totalWeightStatus5();
    }

    $scope.totalProduct = 0
    $scope.oldQuantityOfCartStatus5 = function (index) {
        // variable = 'lstAddedProducts' + $scope.tab;
        oldQuantityProduct = $scope.billDetailStatus5[index].quantity;
        console.log(oldQuantityProduct);


        $http.get(`${API_PRODUCT_VARIANT}/${$scope.billDetailStatus5[index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                $scope.isLoading = false;
                console.log(resp.data.quantity);
                $scope.totalProduct = resp.data.quantity + oldQuantityProduct;
            })
            .catch(error => {
                console.log(error);
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
            })
    }

    /**thay đổi số lượng billdetail của bill chờ thanh toán  */
    $scope.quantityChangeStatus5 = function (index) {
        if (!Number.isInteger($scope.billDetailStatus5[index].quantity) && $scope.billDetailStatus5[index].quantity > 0) {
            $scope.billDetailStatus5[index].quantity = 1;
            toastMessage('', 'Số lượng không phù hợp', 'error');
            return;
        }
        $scope.isLoading = true;


        $scope.sumQuantity = 0;
        $scope.billDetailStatus5.forEach(p => {
            if (p.productVariants.variantId == $scope.billDetailStatus5[index].productVariants.variantId) {
                $scope.sumQuantity += p.quantity;
                console.log($scope.sumQuantity);
            }

        });
        if ($scope.billDetailStatus5[index].quantity == undefined || $scope.sumQuantity > $scope.totalProduct) {
            toastMessage('', 'Số lượng không phù hợp', 'error');
            $scope.billDetailStatus5[index].quantity = 1;
        } else {
            $scope.billDetailStatus5[index].totalMoney = $scope.billDetailStatus5[index].quantity * $scope.billDetailStatus5[index].price * (100 + $scope.billDetailStatus5[index].tax) / 100;
        }
        $scope.totalProPrice();
        $scope.totalWeightStatus5();

    }

    /**tăng số lượng trong giỏ hàng status chờ thanh toán  */
    $scope.increaseStatus5 = function (index) {
        $scope.maxProduct == 0
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT_VARIANT}/${$scope.billDetailStatus5[index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.sumQuantity = 0;
                $scope.billDetailStatus5.forEach(p => {
                    if (p.productVariants.variantId == $scope.billDetailStatus5[index].productVariants.variantId) {
                        $scope.sumQuantity += p.quantity;
                    }

                });
                if (resp.data.quantity == 0) {
                    toastMessage('', 'Số lượng không phù hợp', 'error');
                    // $scope.billDetailStatus5[index].quantity -= 1;
                } else {

                    $scope.billDetailStatus5[index].quantity += 1;
                    $scope.billDetailStatus5[index].totalMoney = $scope.billDetailStatus5[index].quantity * $scope.billDetailStatus5[index].price * (100 + $scope.billDetailStatus5[index].tax) / 100;
                    console.log($scope.billDetailStatus5[index]);
                }
                $scope.totalProPrice();
                $scope.shippingFeeStatus5();


                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                console.log(error);
            })
    }

    $scope.oldPriceOfCartStatus5 = function (index) {
        $scope.oldPriceProduct = $scope.billDetailStatus5[index].price;
    }

    /**thay đổi giá của billdetail của bill chờ thanh toán  */
    $scope.priceChangeStatus5 = function (index) {
        if ($scope.billDetailStatus5[index].price == undefined) {
            toastMessage('', 'Giá không phù hợp', 'error');
            $scope.billDetailStatus5[index].price = $scope.oldPriceProduct;
            return;
        }

        // $scope.checkPrice = 0;
        // if ($scope.billDetailStatus5[index].price != $scope.oldPriceProduct) {

        //     $scope.count = 0;
        //     $scope.billDetailStatus5.forEach(p => {
        //         if (p.price == $scope.billDetailStatus5[index].price) {
        //             $scope.quantitySplice = $scope.billDetailStatus5[index].quantity;
        //             $scope.priceSplice = $scope.billDetailStatus5[index].price;
        //             // $scope.billDetailStatus5.splice(index, 1);
        //             $scope.ind = $scope.billDetailStatus5.findIndex(c => c.productVariants.variantId == p.productVariants.variantId && c.price == $scope.priceSplice);
        //             $scope.count++;
        //         }
        //     })
        //     if ($scope.count > 1) {
        //         $scope.checkPrice = 1;
        //     }
        //     if ($scope.checkPrice == 1) {
        //         $scope.billDetailStatus5.splice(index, 1);
        //         $scope.billDetailStatus5[$scope.ind].quantity += $scope.quantitySplice;
        //     }
        // }
        $scope.billDetailStatus5[index].totalMoney = $scope.billDetailStatus5[index].quantity * $scope.billDetailStatus5[index].price * (100 + $scope.billDetailStatus5[index].tax) / 100;
        $scope.totalProPrice();
        $scope.totalWeightStatus5();
    }

    /**mở modal xóa billdetail của bill chờ thanh toán  */
    $scope.modalDeleteCartStatus5 = async function (index, id) {
        if ($scope.billDetailStatus5.length <= 1) {
            toastMessage('', 'Hóa đơn phải có ít nhất 1 sản phẩm !', 'warning');
            return;
        }
        $scope.index = index;
        $scope.deleteId = id;
        $('#exampleModalDeleteCartStatus5').modal('show');
    }

    /**onDelete Cart status chờ thanh toán   */
    $scope.onDeleteCartStatus5 = async function () {
        console.log($scope.billDetailStatus5);
        if ($scope.billDetailStatus5.length > 1) {
            $scope.billDetailStatus5.splice($scope.index, 1);
            toastMessage('', 'Xóa thành công !', 'success');
        } else {
            toastMessage('', 'Xóa thất bại !', 'error');
        }
        $('#exampleModalDeleteCartStatus5').modal('hide');
        $scope.totalProPrice();
        $scope.totalWeightStatus5();
    }

    /**thêm sp vào cart status chờ thanh toán  */
    $scope.onAddBillStatus5 = async function (proVal) {
        var maxProduct = 0;
        pv = angular.copy(proVal);
        if (pv.sales != undefined || pv.sales != null) {
            pv.price -= pv.sales;
        }
        $scope.messageBillDetails = '';
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.productVariant = resp.data;
                maxProduct = angular.copy($scope.productVariant.quantity);
                $scope.productVariant.quantity = 1;

                // $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
            })

        //GetVariantValueByProductVariant
        await $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var lstData = resp.data;
                var lstValueName = [];
                lstData.forEach(subItem => {
                    lstValueName.push(subItem.optionValues.valueName);
                });
                customName = lstValueName.join("-");
                //Set name product display
                var nameOld = $scope.productVariant.products.productName;
                $scope.productVariant.products.productName = `${nameOld} [${customName}]`;
                // $scope.isLoading = false;
            })

            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.isLoading = false;
                console.log(error)
            })

        $scope.sumQuantity = 0;
        $scope.billDetailStatus5.forEach(p => {
            if (p.productVariants.variantId == pv.variantId) {
                $scope.sumQuantity += p.quantity;
            }

        });
        $scope.check = 0;
        if (maxProduct == 0) {
            toastMessage('', 'Số lượng không đủ', 'error');
        } else {
            $scope.billDetailStatus5.forEach(p => {
                if (p.productVariants.variantId == pv.variantId) {
                    $scope.ind = $scope.billDetailStatus5.findIndex(c => c.productVariants.variantId == pv.variantId);
                    $scope.check = 1;
                }

            });
            if ($scope.check == 0) {


                $scope.billDetailStatus5[$scope.billDetailStatus5.length] = {
                    productVariants: pv,
                    bills: $scope.billStatus5Add,
                    quantity: 1,
                    price: pv.price,
                    tax: pv.tax,
                    totalMoney: pv.price + (pv.price * pv.tax / 100)
                }
                console.log($scope.billDetailStatus5[$scope.billDetailStatus5.length - 1]);
                // $scope.onAddBillDetailStatus5($scope.billDetailStatus5[$scope.billDetailStatus5.length - 1]);
            } else {

                $scope.billDetailStatus5[$scope.ind].quantity++;
                $scope.billDetailStatus5[$scope.ind].totalMoney = $scope.billDetailStatus5[$scope.ind].quantity * $scope.billDetailStatus5[$scope.ind].price * (100 + $scope.billDetailStatus5[$scope.ind].tax) / 100;
                console.log($scope.billDetailStatus5[$scope.ind]);
            }
        }
        $scope.isLoading = false;
        $scope.totalProPrice();
        $scope.totalWeightStatus5();
    }

    /**add billDetail of bill status chờ thanh toán */
    $scope.onAddBillDetailStatus5 = async function (billDetailStatus5) {
        await $http.post(`${API_BILL_DETAIL}`, billDetailStatus5, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                $scope.billDetailStatus5[$scope.billDetailStatus5.length - 1].detailBillId = resp.data.detailBillId;
                $scope.getBillStatus5ById(billDetailStatus5.bills);

            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**edit billDetail of bill status chờ thanh toán */
    $scope.onEditBillDetailStatus5 = async function (billDetailStatus5) {
        await $http.put(`${API_BILL_DETAIL}`, billDetailStatus5, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                $scope.getBillStatus5ById(billDetailStatus5.bills);
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**lấy thông tin bill chờ thanh toán theo id */
    $scope.getBillStatus5ById = function (bill) {
        $scope.isLoading = true;
        $http.get(`${API_BILL}/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus5.billId);
                $scope.bills[index].totalMoney = angular.copy(resp.data.totalMoney);
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**clickDivision status chờ thanh toán  */
    $scope.clickDivisionStatus5 = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = true;
        // $scope.getDivisionStatus5();
        $scope.sttDistrict = false;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;

    }
    $scope.address5 = {
        division: {},
        district: {},
        ward: {}
    }

    /**lấy thông tin địa chỉ của bill chờ thanh toán  */
    $scope.getDivisionStatus5 = function () {
        $scope.address5 = {
            division: {},
            district: {},
            ward: {}
        }
        $scope.lstDivision = [];
        $http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        })
            .then(resp => {
                $scope.lstDivision5 = resp.data.data;

                if ($scope.billStatus5.divisionId != 0) {
                    var index = $scope.lstDivision5.findIndex(c => c.ProvinceID == $scope.billStatus5.divisionId);
                    // $scope.division123 = angular.copy($scope.lstDivision123[index]);
                    $scope.address5.division = angular.copy($scope.lstDivision5[index]);


                    var data = {
                        province_id: parseInt($scope.address5.division.ProvinceID)
                    }

                    $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                        headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                    })
                        .then(resp => {
                            $scope.lstDistrict5 = resp.data.data;
                            if ($scope.billStatus5.districtId != 0) {
                                var index = $scope.lstDistrict5.findIndex(c => c.DistrictID == $scope.billStatus5.districtId);
                                // $scope.district123 = $scope.lstDistrict123[index];
                                $scope.address5.district = angular.copy($scope.lstDistrict5[index]);

                                var data = {
                                    district_id: parseInt($scope.address5.district.DistrictID)
                                }

                                $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                                    headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                                })
                                    .then(resp => {
                                        $scope.lstWard5 = resp.data.data;
                                        if (parseInt($scope.billStatus5.wardCode) != 0) {
                                            var index = $scope.lstWard5.findIndex(c => c.WardCode == $scope.billStatus5.wardCode);
                                            // $scope.ward123 = $scope.lstWard123[index];
                                            $scope.address5.ward = angular.copy($scope.lstWard5[index]);

                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        $scope.isLoading = false;
                                    })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            $scope.isLoading = false;
                        })
                }

            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
        console.log($scope.address5);
    }

    /**clickNullDivisionStatus5 */
    $scope.clickNullDivisionStatus5 = function () {
        $scope.billDetailStatus5.division = undefined;
        $scope.billDetailStatus5.divisionId = undefined;
        $scope.billDetailStatus5.divisionName = undefined;
        $scope.billDetailStatus5.district = undefined;
        $scope.billDetailStatus5.districtId = undefined;
        $scope.billDetailStatus5.districtName = undefined;
        $scope.changeDivisionStatus5($scope.billDetailStatus5.divisionId, $scope.billDetailStatus5.divisionName);
        $scope.changeDistrictStatus5($scope.billDetailStatus5.districtId, $scope.billDetailStatus5.districtName);
    }

    /**clickNullDistrictStatus5 */
    $scope.clickNullDistrictStatus5 = function () {
        $scope.billDetailStatus5.district = undefined;
        $scope.billDetailStatus5.districtId = undefined;
        $scope.billDetailStatus5.districtName = undefined;
        $scope.changeDistrictStatus5($scope.billDetailStatus5.districtId, $scope.billDetailStatus5.districtName);
    }

    /**clickNullWardStatus5 */
    $scope.clickNullWardStatus5 = function () {
        $scope.billDetailStatus5.ward = undefined;
        $scope.billDetailStatus5.wardCode = undefined;
        $scope.billDetailStatus5.wardName = undefined;
        $scope.changeWardStatus5($scope.billDetailStatus5.wardName, $scope.billDetailStatus5.wardCode);
    }

    /**changeDivision status chờ thanh toán  */
    $scope.changeDivisionStatus5 = function (provinceId, provinceName) {
        $scope.sttDivision = false;
        $scope.lstWard5 = [];
        if ($scope.billStatus5.divisionId != provinceId) {
            $scope.billStatus5.districtName = '';
            $scope.billStatus5.wardName = '';
        }
        $scope.lstDistrict = {};
        $scope.messageAddress = '';
        var data = {
            province_id: parseInt(provinceId)
        }
        if (provinceId != undefined && provinceId != 0) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.billStatus5.divisionName = provinceName;
                    $scope.billStatus5.divisionId = provinceId;
                    $scope.lstDistrict5 = resp.data.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            $scope.lstDistrict = {};
            $scope.billStatus5.divisionName = '';
            $scope.billStatus5.divisionId = undefined;
        }
    }

    /**clickDistrict status chờ thanh toán */
    $scope.clickDistrictStatus5 = function () {
        console.log($scope.lstDistrict);
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = true;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        $scope.changeDivisionStatus5($scope.billStatus5.divisionId, $scope.billStatus5.divisionName);
        // $scope.changeDivision($scope[tabAddress].divisionId,$scope[tabAddress].divisionName);
    }

    /**changeDistrict status chờ thanh toán  */
    $scope.changeDistrictStatus5 = function (districtId, districtName) {
        $scope.sttDistrict = false;
        if ($scope.billStatus5.districtId != districtId) {
            $scope.billStatus5.wardName = '';
            $scope.messageAddress = '';
        }
        $scope.lstWard = {};
        var data = {
            district_id: parseInt(districtId)
        }
        if (districtId != undefined && districtId != 0) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.billStatus5.districtId = districtId;
                    $scope.billStatus5.districtName = districtName;
                    $scope.lstWard5 = resp.data.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            lstWard = 'lstWard' + $scope.tab;
            $scope.lstWard = {};
            $scope.billStatus5.districtName = '';
            $scope.billStatus5.districtId = undefined;
        }
    }

    /**clickWard status chờ thanh toán */
    $scope.clickWardStatus5 = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = false;
        $scope.sttWard = true;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        $scope.changeDistrictStatus5($scope.billStatus5.districtId, $scope.billStatus5.districtName);
    }

    /**changeWard status chờ thanh toán */
    $scope.changeWardStatus5 = function (wardName, wardCode) {
        $scope.messageAddress = '';
        $scope.sttWard = false;
        $scope.billStatus5.wardName = wardName;
        $scope.billStatus5.wardCode = wardCode;
        $scope.shippingFeeStatus5();
    }

    $scope.changeCustomerStatus5 = async function (cus) {
        $scope.messageCus = '';
        $scope.sttCustomer = false;
        if (cus != null || cus != undefined) {
            $scope.billStatus5.phone = angular.copy(cus.phone);
        } else {
            $scope.billStatus5.phone = '';
        }
    }

    /** tính tổng tiền sp bill status chờ thanh toán */
    $scope.totalProPrice = function () {
        $scope.proPrice = 0;
        console.log($scope.billDetailStatus5);
        $scope.billDetailStatus5.forEach(p => {
            $scope.proPrice += p.totalMoney;
            console.log($scope.proPrice);
        });
        $scope.proPrice -= $scope.proPrice * $scope.billStatus5.discount / 100;
        $scope.proPrice = parseInt($scope.proPrice.toFixed());
    }

    /**tính cân nặng sp bill chờ thanh toán  */
    $scope.totalWeightStatus5 = async function () {
        await $scope.billDetailStatus5.forEach(c => {
            c.totalWeight = 0;
            $http.get(`${API_VARIANT_VALUE}/find-by-product-variant-origin/${c.productVariants.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    var lstVV = resp.data;
                    var index = lstVV.findIndex(v => v.optionValues.options.optionName == "CÂN NẶNG");
                    if (index != -1) {
                        c.totalWeight += parseInt(lstVV[index].optionValues.valueName) * c.quantity;
                    }
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })

        });
        setTimeout(() => {
            $scope.shippingFeeStatus5();
        }, 1000);
    }

    /**tính giá phí ship status chờ thanh toán  */
    $scope.shippingFeeStatus5 = function () {
        $scope.billDetailStatus5.totalWeight = 0;
        $scope.billDetailStatus5.forEach(p => {
            $scope.billDetailStatus5.totalWeight += p.totalWeight;
        });
        if ($scope.billStatus5.billType == 1 || $scope.billStatus5.wardCode == undefined) {
            $scope.billStatus5.shippingFee = 0;
            return;
        }
        //api lấy thông tin dịch vụ
        $scope.isLoading = true;
        var service = {
            shop_id: 3257646,
            from_district: shopDistrictId,
            to_district: $scope.billStatus5.districtId
        }
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`, service, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        }).then(resp => {
            $scope.service_id = resp.data.data[0].service_id;
            $scope.isLoading = false;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            console.log(error);
            $scope.isLoading = false;
        })

        // api lấy phí ship
        var fee = {
            service_type_id: 2,
            insurance_value: $scope.proPrice,
            coupon: null,
            from_district_id: shopDistrictId,
            to_district_id: $scope.billStatus5.districtId,
            to_ward_code: $scope.billStatus5.wardCode,
            height: 15,
            length: 15,
            weight: $scope.billDetailStatus5.totalWeight,
            width: 15
        }

        console.log(fee);
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, fee, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7', 'shop_id': 3257646 }
        }).then(resp => {
            $scope.isLoading = false;
            $scope.totalFee = resp.data.data.total;
            $scope.billStatus5.shippingFee = resp.data.data.total;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            console.log(error);
            $scope.isLoading = false;
        })
        console.log($scope.billStatus5.shippingFee);
    }

    /**discount status chờ thanh toán */
    $scope.changeDiscountStatus5 = function () {
        if (!Number.isInteger($scope.billStatus5.discount) || $scope.billStatus5.discount > 100 || $scope.billStatus5.discount < 0) {
            $scope.billStatus5.discount = 0;
        }
        $scope.totalProPrice();
    }

    /**update bill status chờ thanh toán  */
    $scope.updateBillStatus5 = async function () {

        console.log($scope.billStatus5);
        $scope.billStatus5.users = $scope.userLogin;
        var lstPV = [];
        var pvExist = 0;

        $scope.check = 0;
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
        if ($scope.billStatus5.status == false) {
            if (!phoneRegex.test($scope.billStatus5.phone) || $scope.billStatus5.phone.length < 9 || $scope.billStatus5.phone.length > 20) {
                $scope.messagePhone = 'Số điện thoại phải là số từ 10 -> 20 số';
                $scope.check = 1;
            }
            if (($scope.billStatus5.customers == undefined || $scope.billStatus5.customers == null || $scope.billStatus5.customers.userId == -1) && $scope.billStatus5.billType == 0) {
                $scope.messageCus = 'Chưa chọn khách hàng';
                $scope.check = 1;
            }

            if ($scope.billStatus5.divisionName == undefined && $scope.billStatus5.billType == 0) {
                $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
                $scope.check = 1;
            } else if ($scope.billStatus5.divisionName != undefined && $scope.billStatus5.districtName == '' && $scope.billStatus5.billType == 0) {
                $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
                $scope.check = 1;
            } else if ($scope.billStatus5.divisionName != undefined && $scope.billStatus5.districtName != '' && $scope.billStatus5.wardName == '' && $scope.billStatus5.billType == 0) {
                $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
                $scope.check = 1;
            } else if ($scope.billStatus5.divisionName != undefined && $scope.billStatus5.districtName != '' && $scope.billStatus5.wardName == undefined && $scope.billStatus5.billType == 0) {
                $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
                $scope.check = 1;
            }

            if ($scope.billStatus5.note == undefined || $scope.billStatus5.note == null || $scope.billStatus5.note == '') {

                if (($scope.billStatus5.discount != 0 && $scope.billStatus5.note == undefined) || ($scope.billStatus5.discount != 0 && $scope.billStatus5.note == null)) {
                    $scope.messageNote = 'Ghi chú không được để trống';
                    $scope.check = 1;
                }

                await $scope.billDetailsStatus5Origin.forEach(de => {
                    $scope.billDetailStatus5.forEach(deNew => {
                        if (de.productVariants.variantId == deNew.productVariants.variantId) {
                            deNew.checkExist = 1;
                        }
                    });
                });

                await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        console.log(resp.data);
                        lstPV = resp.data;
                        $scope.isLoading = false;
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        console.log(error);
                        $scope.isLoading = false;
                    })
                await $scope.billDetailStatus5.forEach(deNew => {
                    if (deNew.checkExist == 1 && pvExist != 1) {
                        $scope.billDetailsStatus5Origin.forEach(de => {
                            if (de.price != deNew.price && de.productVariants.variantId == deNew.productVariants.variantId) {
                                $scope.check = 1;
                                pvExist = 1;
                                return;
                            }
                        });
                    } else {
                        lstPV.forEach(item => {
                            $scope.isLoading = true;
                            $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                            })
                                .then(resp => {
                                    item.sales = resp.data.discount;
                                    // lstPV.forEach(item => {
                                    $scope.billDetailStatus5.forEach(pv => {
                                        if (item.variantId == pv.productVariants.variantId && pv.checkExist != 1 && pvExist != 1) {
                                            console.log(pv);
                                            console.log(item.sales);
                                            if (item.sales != 0) {
                                                if (pv.price != (item.price - item.sales)) {
                                                    console.log('2');
                                                    $scope.check = 1;
                                                    pvExist = 1;
                                                    return;
                                                }
                                            } else {
                                                if (pv.price != item.price) {
                                                    console.log('3');
                                                    $scope.check = 1;
                                                    pvExist = 1;
                                                    return;
                                                }
                                            }
                                        }
                                    });
                                    // })
                                    $scope.isLoading = false;
                                })
                                .catch(error => {
                                    if (error.status == 401) {
                                        $scope.isLoading = false;
                                        setTimeout(() => {
                                            document.location = '/admin#!/login';
                                        }, 2000);
                                        sweetError('Mời bạn đăng nhập !');
                                        return;
                                    }
                                    $scope.isLoading = false;
                                    console.log(error)
                                })
                        });
                    }
                });
            }
        }

        setTimeout(() => {
            if (pvExist == 1) {

                toastMessage('', 'Sản phẩm đã thay đổi giá theo giá gốc, mời bạn nhập ghi chú!', 'error');
                return;
            }
            if ($scope.check == 1) {
                toastMessage('', 'Tạo đơn hàng thất bại!', 'error');
                return;
            }

            Swal.fire({
                title: 'Bạn có muốn cập nhật hóa đơn?',
                text: "",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    if ($scope.billStatus5.status == true) {
                        $scope.billStatus5.status = 0;
                    } else {
                        $scope.billStatus5.status = 4;
                    }
                    if ($scope.billStatus5.customers == null || $scope.billStatus5.customers.userId == -1) {
                        $scope.billStatus5.customers = undefined;
                    }
                    var data = {
                        bill: $scope.billStatus5,
                        billDetails: $scope.billDetailStatus5
                    }
                    console.log($scope.billStatus5);
                    console.log(data);
                    $scope.isLoading = true;
                    if ($scope.billStatus5.payments == 1 && $scope.billStatus5.status != 0) {
                        var vnp_OrderInfo = 'thanh toan hoa don';
                        var orderType = 'other';
                        var language = 'vn';
                        var amount = $scope.proPrice + $scope.billStatus5.shippingFee;
                        var bankCode = '';
                        localStorage.setItem('billVNP', JSON.stringify(data));
                        // localStorage.setItem('payTab', $scope.tab);
                        $http.post(`${API_VNPAY}/send?vnp_OrderInfo=${vnp_OrderInfo}&ordertype=${orderType}&amount=${amount}&bankcode=&language=${language}`)
                            .then(resp => {
                                window.location.href = resp.data.value;


                            }).catch(error => {
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    }
                    else if ($scope.billStatus5.status == 0) {
                        $http.put(`${API_BILL}/${$scope.billStatus5.billId}`, data, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                $scope.isLoading = false;
                                console.log(resp.data);
                                if (resp.data != null) {

                                    toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                                    var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus5.billId);
                                    $scope.bills[index] = angular.copy(resp.data);
                                    $('#staticUpdateStatus5').modal('hide');

                                } else {
                                    toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                }

                            })
                            .catch(error => {
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                                toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                // $scope.success = 0;
                                $scope.messageError = error.data;
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    } else {
                        $http.put(`${API_BILL}/${$scope.billStatus5.billId}`, data, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                $scope.isLoading = false;
                                console.log(resp.data);
                                if (resp.data != null) {

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
                                        toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                                        var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus5.billId);
                                        $scope.bills[index] = angular.copy(resp.data);
                                        $scope.getBillsByStatus($scope.billStatus);
                                        countBillWaitConfirm();
                                        countBillWaitPay();
                                        countBillWaitDelivery();
                                        $('#staticUpdateStatus5').modal('hide');
                                    })
                                    // }
                                    // $scope.initializBill();
                                    // toastMessage('', 'Tạo đơn hàng thành công!', 'success');
                                } else {
                                    toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                }

                            })
                            .catch(error => {
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                                toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                // $scope.success = 0;
                                $scope.messageError = error.data;
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    }
                }
            })
        }, 500);

    }

    /**hủy bill chờ thanh toán */
    $scope.deleteBillStatus5 = async function () {
        Swal.fire({
            title: 'Bạn có muốn hủy hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.billStatus5.status = 5;
                $http.put(`${API_BILL}/${$scope.billStatus5.billId}`, $scope.billStatus5, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        if (resp.data != null) {

                            toastMessage('', 'Hủy đơn hàng thành công!', 'success');
                            // var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus5.billId);
                            // $scope.bills[index] = angular.copy(resp.data);
                            $scope.getBillsByStatus($scope.billStatus);
                            countBillWaitConfirm();
                            countBillWaitPay();
                            countBillWaitDelivery();
                            $('#staticUpdateStatus5').modal('hide');

                        } else {
                            toastMessage('', 'Hủy đơn hàng thất bại!', 'error');
                        }

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Hủy đơn hàng thất bại!', 'error');
                        // $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })

    }




    /**get bill status = 123 */
    $scope.getBillStatus123 = async function (bill) {
        $scope.isLoading = true;
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
        $scope.billStatus123 = angular.copy(bill);
        if ($scope.billStatus123.customers == null) {
            var user = {
                userId: -1
            }
            $scope.billStatus123.customers = user;
        }
        console.log(bill);
        $scope.billStatus123Add = angular.copy(bill);
        $scope.dataAddress = await $scope.getDivisionStatus123();
        $scope.division123 = await $scope.dataAddress.division123;
        $scope.district123 = await $scope.dataAddress.district123;
        $scope.ward123 = await $scope.dataAddress.ward123;
        $scope.getBillDetailStatus123(bill);
        console.log($scope.billDetailStatus123);
        console.log($scope.division123);

        $('#staticUpdateStatus123').modal('show');
    }
    $scope.billDetailStatus123 = [];
    $scope.getBillDetailStatus123 = function (bill) {
        $http.get(`${API_BILL_DETAIL}/find-by-bill/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.billDetailStatus123 = response.data;
                console.log($scope.billDetailStatus123);
                $scope.billDetailsStatus123Origin = angular.copy(response.data);

                $scope.totalProPriceStatus123();
                $scope.shippingFeeStatus123();
                console.log($scope.proPrice);
                $scope.billDetailStatus123.forEach(item => {
                    $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${item.productVariants.variantId}`, {
                        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                    })
                        .then(resp1 => {
                            var lstData = resp1.data;
                            var lstValueName = [];
                            lstData.forEach(subItem => {
                                lstValueName.push(subItem.optionValues.valueName);
                            });
                            customName = lstValueName.join("-");
                            //Set name product display
                            var nameOld = item.productVariants.products.productName;
                            item.productVariants.products.productName = `${nameOld} [${customName}]`;


                            $scope.isLoading = false;
                        })

                        .catch(error => {
                            if (error.status == 401) {
                                $scope.isLoading = false;
                                setTimeout(() => {
                                    document.location = '/admin#!/login';
                                }, 2000);
                                sweetError('Mời bạn đăng nhập !');
                                return;
                            }
                            console.log(error);
                            $scope.isLoading = false;
                        })
                });

                $scope.isLoading = false;
            }).catch(function (error) {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            });
    }

    $scope.closeUpdateBillStatus123 = function () {
        $scope.billStatus123 = {};
    }

    /**giảm số lượng trong giỏ hàng status 123 */
    $scope.decreaseStatus123 = function (index) {
        // variable = 'lstAddedProducts' + $scope.tab;
        if ($scope.billDetailStatus123[index].quantity != 1) {
            $scope.billDetailStatus123[index].quantity -= 1;
            $scope.billDetailStatus123[index].totalMoney = $scope.billDetailStatus123[index].quantity * $scope.billDetailStatus123[index].price * (100 + $scope.billDetailStatus123[index].tax) / 100;
            // $scope.onEditBillDetailStatus123($scope.billDetailStatus123[index]);
        }
        $scope.totalProPriceStatus123();
        $scope.totalWeightStatus123();
    }

    $scope.totalProduct = 0
    $scope.oldQuantityOfCartStatus123 = function (index) {
        // variable = 'lstAddedProducts' + $scope.tab;
        oldQuantityProduct = $scope.billDetailStatus123[index].quantity;
        console.log(oldQuantityProduct);


        $http.get(`${API_PRODUCT_VARIANT}/${$scope.billDetailStatus123[index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                $scope.isLoading = false;
                console.log(resp.data.quantity);
                $scope.totalProduct = resp.data.quantity + oldQuantityProduct;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**thay đổi số lượng billdetail của bill status 123 */
    $scope.quantityChangeStatus123 = function (index) {
        // variable = 'lstAddedProducts' + $scope.tab;
        if (!Number.isInteger($scope.billDetailStatus123[index].quantity) && $scope.billDetailStatus123[index].quantity > 0) {
            $scope.billDetailStatus123[index].quantity = 1;
            toastMessage('', 'Số lượng không phù hợp', 'error');
            return;
        }
        $scope.isLoading = true;
        $scope.sumQuantity = 0;
        $scope.billDetailStatus123.forEach(p => {
            if (p.productVariants.variantId == $scope.billDetailStatus123[index].productVariants.variantId) {
                $scope.sumQuantity += p.quantity;
                console.log($scope.sumQuantity);
            }

        });
        if ($scope.billDetailStatus123[index].quantity == undefined || $scope.sumQuantity > $scope.totalProduct) {
            toastMessage('', 'Số lượng không phù hợp', 'error');
            $scope.billDetailStatus123[index].quantity = 1;
        } else {
            $scope.billDetailStatus123[index].totalMoney = $scope.billDetailStatus123[index].quantity * $scope.billDetailStatus123[index].price * (100 + $scope.billDetailStatus123[index].tax) / 100;
            // $scope.onEditBillDetailStatus123($scope.billDetailStatus123[index]);
        }
        $scope.totalProPriceStatus123();
        $scope.totalWeightStatus123();

    }

    /**tăng số lượng trong giỏ hàng status 123 */
    $scope.increaseStatus123 = function (index) {
        $scope.maxProduct == 0
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT_VARIANT}/${$scope.billDetailStatus123[index].productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.sumQuantity = 0;
                $scope.billDetailStatus123.forEach(p => {
                    if (p.productVariants.variantId == $scope.billDetailStatus123[index].productVariants.variantId) {
                        $scope.sumQuantity += p.quantity;
                    }

                });
                if (resp.data.quantity == 0) {
                    toastMessage('', 'Số lượng không phù hợp', 'error');
                } else {

                    $scope.billDetailStatus123[index].quantity += 1;
                    $scope.billDetailStatus123[index].totalMoney = $scope.billDetailStatus123[index].quantity * $scope.billDetailStatus123[index].price * (100 + $scope.billDetailStatus123[index].tax) / 100;
                    console.log($scope.billDetailStatus123[index]);
                }
                $scope.totalProPriceStatus123();
                $scope.totalWeightStatus123();


                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    $scope.oldPriceOfCartStatus123 = function (index) {
        $scope.oldPriceProduct = $scope.billDetailStatus123[index].price;
    }

    /**thay đổi giá billdetail của bill status 123 */
    $scope.priceChangeStatus123 = function (index) {
        if ($scope.billDetailStatus123[index].price == undefined) {
            toastMessage('', 'Giá không phù hợp', 'error');
            $scope.billDetailStatus123[index].price = $scope.oldPriceProduct;
            return;
        }

        // $scope.checkPrice = 0;
        // if ($scope.billDetailStatus123[index].price != $scope.oldPriceProduct) {

        //     $scope.count = 0;
        //     $scope.billDetailStatus123.forEach(p => {
        //         if (p.price == $scope.billDetailStatus123[index].price) {
        //             $scope.quantitySplice = $scope.billDetailStatus123[index].quantity;
        //             $scope.priceSplice = $scope.billDetailStatus123[index].price;
        //             // $scope.billDetailStatus123.splice(index, 1);
        //             $scope.ind = $scope.billDetailStatus123.findIndex(c => c.productVariants.variantId == p.productVariants.variantId && c.price == $scope.priceSplice);
        //             $scope.count++;
        //         }
        //     })
        //     if ($scope.count > 1) {
        //         $scope.checkPrice = 1;
        //     }
        //     if ($scope.checkPrice == 1) {
        //         $scope.billDetailStatus123.splice(index, 1);
        //         $scope.billDetailStatus123[$scope.ind].quantity += $scope.quantitySplice;
        //     }
        // }
        $scope.billDetailStatus123[index].totalMoney = $scope.billDetailStatus123[index].quantity * $scope.billDetailStatus123[index].price * (100 + $scope.billDetailStatus123[index].tax) / 100;
        // $scope.onEditBillDetailStatus123($scope.billDetailStatus123[index]);
        $scope.totalProPriceStatus123();
        $scope.shippingFeeStatus123();
    }

    /**mở modal xác nhận xóa billdetail status 123 */
    $scope.modalDeleteCartStatus123 = async function (index, id) {
        if ($scope.billDetailStatus123.length <= 1) {
            toastMessage('', 'Hóa đơn phải có ít nhất 1 sản phẩm !', 'warning');
            return;
        }
        $scope.index = index;
        $scope.deleteId = id;
        $('#exampleModalDeleteBillStatus123').modal('show');
    }

    /**onDelete Cart status 123 */
    $scope.onDeleteCartStatus123 = async function () {
        console.log($scope.billDetailStatus123);
        if ($scope.billDetailStatus123.length > 1) {
            $scope.isLoading = true;
            $scope.billDetailStatus123.splice($scope.index, 1);


            toastMessage('', 'Xóa thành công !', 'success');
        } else {
            toastMessage('', 'Xóa thất bại !', 'error');
        }
        $('#exampleModalDeleteBillStatus123').modal('hide');
        $scope.totalProPriceStatus123();
        $scope.totalWeightStatus123();
    }

    /**thêm sp vào cart status 123 */
    $scope.onAddBillStatus123 = async function (proVal) {
        var maxProduct = 0;
        pv = angular.copy(proVal);
        if (pv.sales != undefined || pv.sales != null) {
            pv.price -= pv.sales;
        }
        $scope.messageBillDetails = '';
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                $scope.productVariant = resp.data;
                maxProduct = angular.copy($scope.productVariant.quantity);
                $scope.productVariant.quantity = 1;

                // $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //GetVariantValueByProductVariant
        await $http.get(`${API_VARIANT_VALUE}/find-by-product-variant/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var lstData = resp.data;
                var lstValueName = [];
                lstData.forEach(subItem => {
                    lstValueName.push(subItem.optionValues.valueName);
                });
                customName = lstValueName.join("-");
                //Set name product display
                var nameOld = $scope.productVariant.products.productName;
                $scope.productVariant.products.productName = `${nameOld} [${customName}]`;
                // $scope.isLoading = false;
            })

            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        $http.get(`${API_PRODUCT_VARIANT}/${pv.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

                // $scope.productVariantEdit = resp.data;
                maxProduct = resp.data.quantity;

                // $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        $scope.sumQuantity = 0;
        $scope.billDetailStatus123.forEach(p => {
            if (p.productVariants.variantId == pv.variantId) {
                $scope.sumQuantity += p.quantity;
            }

        });
        $scope.check = 0;
        if (maxProduct == 0) {
            toastMessage('', 'Số lượng không đủ', 'error');
        } else {
            $scope.billDetailStatus123.forEach(p => {
                if (p.productVariants.variantId == pv.variantId) {
                    $scope.ind = $scope.billDetailStatus123.findIndex(c => c.productVariants.variantId == pv.variantId);
                    $scope.check = 1;
                }

            });
            if ($scope.check == 0) {


                $scope.billDetailStatus123[$scope.billDetailStatus123.length] = {
                    productVariants: pv,
                    bills: $scope.billStatus123Add,
                    quantity: 1,
                    price: pv.price,
                    tax: pv.tax,
                    totalMoney: pv.price + (pv.price * pv.tax / 100)
                }
                console.log($scope.billDetailStatus123[$scope.billDetailStatus123.length - 1]);
                // $scope.onAddBillDetailStatus123($scope.billDetailStatus123[$scope.billDetailStatus123.length - 1]);
            } else {

                $scope.billDetailStatus123[$scope.ind].quantity++;
                $scope.billDetailStatus123[$scope.ind].totalMoney = $scope.billDetailStatus123[$scope.ind].quantity * $scope.billDetailStatus123[$scope.ind].price * (100 + $scope.billDetailStatus123[$scope.ind].tax) / 100;
                console.log($scope.billDetailStatus123[$scope.ind]);
                // $scope.onEditBillDetailStatus123($scope.billDetailStatus123[$scope.ind]);
            }
        }
        $scope.isLoading = false;
        $scope.totalProPriceStatus123();
        $scope.totalWeightStatus123();
    }

    /**thêm sản phẩm mới vào bill bill status 123 */
    $scope.onAddBillDetailStatus123 = async function (billDetailStatus123) {
        await $http.post(`${API_BILL_DETAIL}`, billDetailStatus123, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                $scope.billDetailStatus123[$scope.billDetailStatus123.length - 1].detailBillId = resp.data.detailBillId;
                $scope.getBillStatus123ById(billDetailStatus123.bills);

            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**thay đổi bill detail of bill status 123 */
    $scope.onEditBillDetailStatus123 = async function (billDetailStatus123) {

        Swal.fire({
            title: 'Bạn có muốn cập nhật hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoading = true;
                $http.put(`${API_BILL_DETAIL}`, billDetailStatus123, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = true;
                        $http.put(`${API_BILL}/${$scope.billStatus123.billId}`, $scope.billStatus123, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                $scope.isLoading = false;
                                console.log(resp.data);
                                if (resp.data != null) {

                                    toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                                    var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus123.billId);
                                    $scope.bills[index] = angular.copy(resp.data);
                                    $('#staticUpdateStatus123').modal('hide');

                                } else {
                                    toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                }

                            })
                            .catch(error => {
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                                toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                                // $scope.success = 0;
                                $scope.messageError = error.data;
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
            else {
                $scope.getBillDetailStatus123(billDetailStatus123.bills);
                setTimeout(() => {
                    $scope.isLoading = true;
                    $scope.totalProPriceStatus123();
                    $scope.totalWeightStatus123();
                    $scope.isLoading = false;
                }, 1000);
                $scope.isLoading = true;
                $scope.shippingFeeStatus123();
                $scope.isLoading = false;
            }
        })
    }

    /**lấy thông tin bill status 123 */
    $scope.getBillStatus123ById = function (bill) {
        $scope.isLoading = true;
        $http.get(`${API_BILL}/${bill.billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus123.billId);
                $scope.bills[index].totalMoney = angular.copy(resp.data.totalMoney);
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**clickDivision status 123 */
    $scope.clickDivisionStatus123 = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = true;
        // $scope.getDivisionStatus123();
        $scope.sttDistrict = false;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;

    }

    /**lấy thông tin địa chỉ của bill status 132 */
    $scope.getDivisionStatus123 = async function () {
        // $scope.division123 = await {};
        // $scope.district123 = await {};
        // $scope.ward123 = await {};
        var address123 = {
            division123: {},
            district123: {},
            ward123: {}
        }
        // $scope.lstDivision = [];
        console.log($scope.division123);
        await $http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        })
            .then(resp => {
                $scope.lstDivision123 = resp.data.data;
                console.log($scope.billStatus123);
                if ($scope.billStatus123.divisionId != 0) {
                    var index = $scope.lstDivision123.findIndex(c => c.ProvinceID == $scope.billStatus123.divisionId);
                    // $scope.division123 = angular.copy($scope.lstDivision123[index]);
                    address123.division123 = angular.copy($scope.lstDivision123[index]);
                    console.log($scope.division123);


                    var data = {
                        province_id: parseInt(address123.division123.ProvinceID)
                    }
                    console.log(data);

                    $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                        headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                    })
                        .then(resp => {
                            $scope.lstDistrict123 = resp.data.data;
                            if ($scope.billStatus123.districtId != 0) {
                                var index = $scope.lstDistrict123.findIndex(c => c.DistrictID == $scope.billStatus123.districtId);
                                // $scope.district123 = $scope.lstDistrict123[index];
                                address123.district123 = angular.copy($scope.lstDistrict123[index]);

                                var data = {
                                    district_id: parseInt(address123.district123.DistrictID)
                                }

                                $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                                    headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                                })
                                    .then(resp => {
                                        $scope.lstWard123 = resp.data.data;
                                        if (parseInt($scope.billStatus123.wardCode) != 0) {
                                            var index = $scope.lstWard123.findIndex(c => c.WardCode == $scope.billStatus123.wardCode);
                                            // $scope.ward123 = $scope.lstWard123[index];
                                            address123.ward123 = angular.copy($scope.lstWard123[index]);

                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        $scope.isLoading = false;
                                    })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            $scope.isLoading = false;
                        })
                }
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
        // $('#staticUpdateStatus123').modal('show');
        return address123;
    }

    /**clickNullDivisionStatus123 */
    $scope.clickNullDivisionStatus123 = function () {
        $scope.billDetailStatus123.division = undefined;
        $scope.billDetailStatus123.divisionId = undefined;
        $scope.billDetailStatus123.divisionName = undefined;
        $scope.billDetailStatus123.district = undefined;
        $scope.billDetailStatus123.districtId = undefined;
        $scope.billDetailStatus123.districtName = undefined;
        $scope.changeDivisionStatus123($scope.billDetailStatus123.divisionId, $scope.billDetailStatus123.divisionName);
        $scope.changeDistrictStatus123($scope.billDetailStatus123.districtId, $scope.billDetailStatus123.districtName);
    }

    /**clickNullDistrictStatus123 */
    $scope.clickNullDistrictStatus123 = function () {
        $scope.billDetailStatus123.district = undefined;
        $scope.billDetailStatus123.districtId = undefined;
        $scope.billDetailStatus123.districtName = undefined;
        $scope.changeDistrictStatus123($scope.billDetailStatus123.districtId, $scope.billDetailStatus123.districtName);
    }

    /**clickNullWardStatus123 */
    $scope.clickNullWardStatus123 = function () {
        $scope.billDetailStatus123.ward = undefined;
        $scope.billDetailStatus123.wardCode = undefined;
        $scope.billDetailStatus123.wardName = undefined;
        $scope.changeWardStatus123($scope.billDetailStatus123.wardName, $scope.billDetailStatus123.wardCode);
    }

    /**changeDivision status 123 */
    $scope.changeDivisionStatus123 = function (provinceId, provinceName) {
        $scope.sttDivision = false;
        // $scope.dataAddress = {            
        //     district123: {},
        //     ward123: {}
        // };
        $scope.lstWard123 = [];
        if ($scope.billStatus123.divisionId != provinceId) {
            $scope.billStatus123.districtName = '';
            $scope.billStatus123.wardName = '';
        }
        $scope.lstDistrict = {};
        $scope.messageAddress = '';
        var data = {
            province_id: parseInt(provinceId)
        }
        if (provinceId != undefined && provinceId != 0) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.billStatus123.divisionName = provinceName;
                    $scope.billStatus123.divisionId = provinceId;
                    $scope.lstDistrict123 = resp.data.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            $scope.lstDistrict = {};
            $scope.billStatus123.divisionName = '';
            $scope.billStatus123.divisionId = undefined;
        }
    }

    /**clickDistrict status 123 */
    $scope.clickDistrictStatus123 = function () {
        console.log($scope.lstDistrict);
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = true;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        $scope.changeDivisionStatus123($scope.billStatus123.divisionId, $scope.billStatus123.divisionName);
        // $scope.changeDivision($scope[tabAddress].divisionId,$scope[tabAddress].divisionName);
    }

    /**changeDistrict status 123 */
    $scope.changeDistrictStatus123 = function (districtId, districtName) {
        $scope.sttDistrict = false;
        if ($scope.billStatus123.districtId != districtId) {
            $scope.billStatus123.wardName = '';
            $scope.messageAddress = '';
        }
        $scope.lstWard = {};
        var data = {
            district_id: parseInt(districtId)
        }
        if (districtId != undefined && districtId != 0) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.billStatus123.districtId = districtId;
                    $scope.billStatus123.districtName = districtName;
                    $scope.lstWard123 = resp.data.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            lstWard = 'lstWard' + $scope.tab;
            $scope.lstWard = {};
            $scope.billStatus123.districtName = '';
            $scope.billStatus123.districtId = undefined;
        }
    }

    /**clickWard status 123 */
    $scope.clickWardStatus123 = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = false;
        $scope.sttWard = true;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        $scope.changeDistrictStatus123($scope.billStatus123.districtId, $scope.billStatus123.districtName);
    }

    /**changeWard status 123 */
    $scope.changeWardStatus123 = function (wardName, wardCode) {
        $scope.messageAddress = '';
        $scope.sttWard = false;
        $scope.billStatus123.wardName = wardName;
        $scope.billStatus123.wardCode = wardCode;
        console.log($scope.billStatus123);
        $scope.shippingFeeStatus123();
    }

    /**thay đổi khách hàng của bill status 123 */
    $scope.changeCustomerStatus123 = async function (cus) {
        $scope.messageCus = '';
        $scope.sttCustomer = false;
        if (cus != null || cus != undefined) {
            $scope.billStatus123.phone = angular.copy(cus.phone);
        } else {
            $scope.billStatus123.phone = '';
        }
    }

    /** tính tổng tiền sp bill status 123 */
    $scope.totalProPriceStatus123 = function () {
        $scope.proPrice = 0;
        console.log($scope.billDetailStatus123);
        $scope.billDetailStatus123.forEach(p => {
            $scope.proPrice += p.totalMoney;
            console.log($scope.proPrice);
        });
        $scope.proPrice -= $scope.proPrice * $scope.billStatus123.discount / 100;
        $scope.proPrice = parseInt($scope.proPrice.toFixed());
    }

    /**tính cân nặng sp bill123 */
    $scope.totalWeightStatus123 = async function () {
        await $scope.billDetailStatus123.forEach(c => {
            c.totalWeight = 0;
            $http.get(`${API_VARIANT_VALUE}/find-by-product-variant-origin/${c.productVariants.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    var lstVV = resp.data;
                    var index = lstVV.findIndex(v => v.optionValues.options.optionName == "CÂN NẶNG");
                    if (index != -1) {
                        c.totalWeight += parseInt(lstVV[index].optionValues.valueName) * c.quantity;
                    }
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })

        });
        setTimeout(() => {
            $scope.shippingFeeStatus123();
        }, 1000);
    }

    /**tính giá phí ship status 123 */
    $scope.shippingFeeStatus123 = function () {
        $scope.billDetailStatus123.totalWeight = 0;
        $scope.billDetailStatus123.forEach(p => {
            $scope.billDetailStatus123.totalWeight += p.totalWeight;
        });
        if ($scope.billStatus123.billType == 1 || $scope.billStatus123.wardCode == undefined) {
            $scope.billStatus123.shippingFee = 0;
            return;
        }
        //api lấy thông tin dịch vụ
        $scope.isLoading = true;
        var service = {
            shop_id: 3257646,
            from_district: shopDistrictId,
            to_district: $scope.billStatus123.districtId
        }
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`, service, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        }).then(resp => {
            $scope.service_id = resp.data.data[0].service_id;
            $scope.isLoading = false;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            console.log(error);
            $scope.isLoading = false;
        })

        // api lấy phí ship
        var fee = {
            service_type_id: 2,
            insurance_value: $scope.proPrice,
            coupon: null,
            from_district_id: shopDistrictId,
            to_district_id: $scope.billStatus123.districtId,
            to_ward_code: $scope.billStatus123.wardCode,
            height: 15,
            length: 15,
            weight: $scope.billDetailStatus123.totalWeight,
            width: 15
        }

        console.log(fee);
        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, fee, {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7', 'shop_id': 3257646 }
        }).then(resp => {
            $scope.isLoading = false;
            $scope.totalFee = resp.data.data.total;
            $scope.billStatus123.shippingFee = resp.data.data.total;
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            console.log(error);
            $scope.isLoading = false;
        })
        console.log($scope.billStatus123.shippingFee);
    }

    /**thay đổi discount status 123 */
    $scope.changeDiscountStatus123 = function () {
        if (!Number.isInteger($scope.billStatus123.discount) || $scope.billStatus123.discount > 100 || $scope.billStatus123.discount < 0) {
            $scope.billStatus123.discount = 0;
        }
        $scope.totalProPriceStatus123();
    }

    /**cập nhật bill status 123 */
    $scope.updateBillStatus123 = async function () {

        $scope.billStatus123.users = $scope.userLogin;
        var lstPV = [];
        var pvExist = 0;

        $scope.check = 0;
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
        if (!phoneRegex.test($scope.billStatus123.phone) || $scope.billStatus123.phone.length < 9 || $scope.billStatus123.phone.length > 20) {
            $scope.messagePhone = 'Số điện thoại phải là số từ 10 -> 20 số';
            $scope.check = 1;
        }
        if (($scope.billStatus123.customers == undefined || $scope.billStatus123.customers == null || $scope.billStatus123.customers.userId == -1) && $scope.billStatus123.billType == 0) {
            $scope.messageCus = 'Chưa chọn khách hàng';
            $scope.check = 1;
        }

        if ($scope.billStatus123.divisionName == undefined && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope.billStatus123.divisionName != undefined && $scope.billStatus123.districtName == '' && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope.billStatus123.divisionName != undefined && $scope.billStatus123.districtName != '' && $scope.billStatus123.wardName == '' && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        }

        if ($scope.billStatus123.note == undefined || $scope.billStatus123.note == null || $scope.billStatus123.note == '') {

            if (($scope.billStatus123.discount != 0 && $scope.billStatus123.note == undefined) || ($scope.billStatus123.discount != 0 && $scope.billStatus123.note == null)) {
                $scope.messageNote = 'Ghi chú không được để trống';
                $scope.check = 1;
            }

            await $scope.billDetailsStatus123Origin.forEach(de => {
                $scope.billDetailStatus123.forEach(deNew => {
                    if (de.productVariants.variantId == deNew.productVariants.variantId) {
                        deNew.checkExist = 1;
                    }
                });
            });

            await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    lstPV = resp.data;
                    $scope.isLoading = false;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
            await $scope.billDetailStatus123.forEach(deNew => {
                if (deNew.checkExist == 1 && pvExist != 1) {
                    $scope.billDetailsStatus123Origin.forEach(de => {
                        if (de.price != deNew.price && de.productVariants.variantId == deNew.productVariants.variantId) {
                            $scope.check = 1;
                            pvExist = 1;
                            return;
                        }
                    });
                } else {
                    lstPV.forEach(item => {
                        $scope.isLoading = true;
                        $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                item.sales = resp.data.discount;
                                // lstPV.forEach(item => {
                                $scope.billDetailStatus123.forEach(pv => {
                                    if (item.variantId == pv.productVariants.variantId && pv.checkExist != 1 && pvExist != 1) {
                                        console.log(pv);
                                        console.log(item.sales);
                                        if (item.sales != 0) {
                                            if (pv.price != (item.price - item.sales)) {
                                                console.log('2');
                                                $scope.check = 1;
                                                pvExist = 1;
                                                return;
                                            }
                                        } else {
                                            if (pv.price != item.price) {
                                                console.log('3');
                                                $scope.check = 1;
                                                pvExist = 1;
                                                return;
                                            }
                                        }
                                    }
                                });
                                // })
                                $scope.isLoading = false;
                            })
                            .catch(error => {
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                                $scope.isLoading = false;
                                console.log(error)
                            })
                    });
                }
            });
        }

        setTimeout(() => {
            if (pvExist == 1) {

                toastMessage('', 'Sản phẩm đã thay đổi giá theo giá gốc, mời bạn nhập ghi chú!', 'error');
                return;
            }
            if ($scope.check == 1) {
                toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                return;
            }
            if ($scope.billStatus123.customers == null || $scope.billStatus123.customers.userId == -1) {
                $scope.billStatus123.customers = undefined;
            }
            var data = {
                bill: $scope.billStatus123,
                billDetails: $scope.billDetailStatus123
            }
            console.log($scope.billStatus123);
            console.log(data);
            $scope.isLoading = true;
            Swal.fire({
                title: 'Bạn có muốn cập nhật hóa đơn?',
                text: "",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.isLoading = true;
                    $http.put(`${API_BILL}/${$scope.billStatus123.billId}`, data, {
                        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                    })
                        .then(resp => {
                            $scope.isLoading = false;
                            console.log(resp.data);
                            if (resp.data != null) {

                                toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                                var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus123.billId);
                                $scope.bills[index] = angular.copy(resp.data);
                                $('#staticUpdateStatus123').modal('hide');

                            } else {
                                toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                            }

                        })
                        .catch(error => {
                            if (error.status == 401) {
                                $scope.isLoading = false;
                                setTimeout(() => {
                                    document.location = '/admin#!/login';
                                }, 2000);
                                sweetError('Mời bạn đăng nhập !');
                                return;
                            }
                            toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                            // $scope.success = 0;
                            $scope.messageError = error.data;
                            console.log(error);
                            $scope.isLoading = false;
                        })
                }
            })
        })
    }

    /**cập nhật trạng thái bill status 123 */
    $scope.updateStatus123 = function () {
        $scope.billStatus123.users = $scope.userLogin;

        $scope.check = 0;
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
        console.log($scope.billStatus123);
        if ($scope.billStatus123.customers == undefined && $scope.billStatus123.billType == 0) {
            $scope.messageCus = 'Chưa chọn khách hàng';
            $scope.check = 1;
        }
        if (($scope.billStatus123.discount != 0 && $scope.billStatus123.note == undefined) || ($scope.billStatus123.discount != 0 && $scope.billStatus123.note == null)) {
            $scope.messageNote = 'Ghi chú không được để trống';
            $scope.check = 1;

        }

        if ($scope.billStatus123.divisionName == undefined && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope.billStatus123.divisionName != undefined && $scope.billStatus123.districtName == '' && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        } else if ($scope.billStatus123.divisionName != undefined && $scope.billStatus123.districtName != '' && $scope.billStatus123.wardName == '' && $scope.billStatus123.billType == 0) {
            $scope.messageAddress = 'Chưa điền đầy đủ địa chỉ';
            $scope.check = 1;
        }

        if ($scope.check == 1) {
            return;
        }
        Swal.fire({
            title: 'Bạn có muốn cập nhật hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                if ($scope.billStatus123.status == 1) {
                    $scope.billStatus123.status = 2;
                } else if ($scope.billStatus123.status == 2) {
                    $scope.billStatus123.status = 3;
                } else if ($scope.billStatus123.status == 3) {
                    $scope.billStatus123.status = 4;
                }
                var data = {
                    bill: $scope.billStatus123,
                    billDetails: $scope.billDetailStatus123
                }
                console.log($scope.billStatus123);
                console.log(data);
                $scope.isLoading = true;
                $http.put(`${API_BILL}/${$scope.billStatus123.billId}`, $scope.billStatus123, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        if (resp.data != null) {

                            toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                            var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus123.billId);
                            $scope.bills[index] = angular.copy(resp.data);
                            $('#staticUpdateStatus123').modal('hide');

                        } else {
                            toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                        }

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                        // $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })
    }

    /**hủy bill status 123 */
    $scope.deleteBillStatus123 = async function () {
        Swal.fire({
            title: 'Bạn có muốn hủy hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.billStatus123.status = 5;
                $scope.isLoading = true;
                $http.put(`${API_BILL}/${$scope.billStatus123.billId}`, $scope.billStatus123, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        if (resp.data != null) {

                            toastMessage('', 'Hủy đơn hàng thành công!', 'success');
                            // var index = $scope.bills.findIndex(c => c.billId == $scope.billStatus123.billId);
                            // $scope.bills[index] = angular.copy(resp.data);
                            $scope.getBillsByStatus($scope.billStatus);
                            $('#staticUpdateStatus123').modal('hide');

                        } else {
                            toastMessage('', 'Hủy đơn hàng thất bại!', 'error');
                        }

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Hủy đơn hàng thất bại!', 'error');
                        // $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })

    }





    $scope.clickCustomer = function () {
        $scope.sttCustomer = true;
        $scope.sttDivision = false;
        $scope.sttDistrict = false;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
    }




    // API Adress

    $scope.sttDivision = false;
    $scope.sttDistrict = false;
    $scope.sttWard = false;
    $scope.sttDivisionOnl = false;
    $scope.sttDistrictOnl = false;
    $scope.sttWardOnl = false;
    $scope.wardName = ''
    $scope.districtName = ''
    $scope.divisionName = ''

    /**Upload image */
    $scope.imageChanged = function (files) {
        var data = new FormData();
        data.append('file', files[0]);
        $scope.isLoading = true;
        $http.post('http://localhost:8080/SOF306_Hieubq-2/rest/upload/images/acc', data, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(resp => {
            $scope.form.image = resp.data.name;
            $scope.isLoading = false;
            confirm('success');
        }).catch(error => {
            if (error.status == 401) {
                $scope.isLoading = false;
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Mời bạn đăng nhập !');
                return;
            }
            $scope.isLoading = false;
            confirm('Lỗi');
            console.log(error);
        })
    }


    function getDivisionAfterVnPay(addressInput) {
        tabAddress = 'address' + count;
        var address = {
            division: {},
            district: {},
            ward: {}
        }
        $scope.lstDivision = [];
        $http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        })
            .then(resp => {
                $scope.lstDivision = resp.data.data;
                lstDivision = 'lstDivision' + count;
                $scope[lstDivision] = resp.data.data;
                if (addressInput.divisionId != 0) {
                    var index = $scope[lstDivision].findIndex(c => c.ProvinceID == addressInput.divisionId);
                    address.division = angular.copy($scope[lstDivision][index]);
                    if (address.division != undefined) {
                        var data = {
                            province_id: parseInt(address.division.ProvinceID)
                        }
                        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                        })
                            .then(resp => {
                                lstDistrict = 'lstDistrict' + count;
                                $scope[lstDistrict] = resp.data.data;
                                if (addressInput.districtId != 0) {
                                    var index = $scope[lstDistrict].findIndex(c => c.DistrictID == addressInput.districtId);
                                    address.district = angular.copy($scope[lstDistrict][index]);
                                    if (address.district.DistrictID != undefined) {
                                        var data = {
                                            district_id: parseInt(address.district.DistrictID)
                                        }

                                        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                                            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                                        })
                                            .then(resp => {
                                                lstWard = 'lstWard' + count;
                                                $scope[lstWard] = resp.data.data;
                                                if (parseInt(addressInput.wardCode) != 0) {
                                                    var index = $scope[lstWard].findIndex(c => c.WardCode == addressInput.wardCode);
                                                    address.ward = angular.copy($scope[lstWard][index]);

                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                $scope.isLoading = false;
                                            })
                                    }
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    }
                }
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
    }


    /**lấy thông tin địa chỉ khi tạo mới bill */
    $scope.getDivision = function () {
        tabAddress = 'address' + $scope.tab;
        var address = {
            division: {},
            district: {},
            ward: {}
        }
        $scope.lstDivision = [];
        $http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        })
            .then(resp => {
                $scope.lstDivision = resp.data.data;
                lstDivision = 'lstDivision' + $scope.tab;
                $scope[lstDivision] = resp.data.data;
                if ($scope[tabAddress].divisionId != 0) {
                    var index = $scope[lstDivision].findIndex(c => c.ProvinceID == $scope[tabAddress].divisionId);
                    address.division = angular.copy($scope[lstDivision][index]);
                    $scope[tabAddress].division = angular.copy($scope[lstDivision][index]);
                    if (address.division != undefined) {
                        var data = {
                            province_id: parseInt(address.division.ProvinceID)
                        }
                        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                        })
                            .then(resp => {
                                lstDistrict = 'lstDistrict' + $scope.tab;
                                $scope[lstDistrict] = resp.data.data;
                                if ($scope[tabAddress].districtId != 0) {
                                    var index = $scope[lstDistrict].findIndex(c => c.DistrictID == $scope[tabAddress].districtId);
                                    address.district = angular.copy($scope[lstDistrict][index]);
                                    $scope[tabAddress].district = angular.copy($scope[lstDistrict][index]);
                                    if (address.district.DistrictID != undefined) {
                                        var data = {
                                            district_id: parseInt(address.district.DistrictID)
                                        }

                                        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                                            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                                        })
                                            .then(resp => {
                                                lstWard = 'lstWard' + $scope.tab;
                                                $scope[lstWard] = resp.data.data;
                                                if (parseInt($scope[tabAddress].wardCode) != 0) {
                                                    var index = $scope[lstWard].findIndex(c => c.WardCode == $scope[tabAddress].wardCode);
                                                    address.ward = angular.copy($scope[lstWard][index]);
                                                    $scope[tabAddress].ward = angular.copy($scope[lstWard][index]);
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                $scope.isLoading = false;
                                            })
                                    }
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    }
                }
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
            })
        // return address;
    }

    // $scope.getDivision();

    /**clickDivision */
    $scope.clickDivision = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = true;
        // $scope.getDivision();
        $scope.sttDistrict = false;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;

    }


    /**clickDistrict */
    $scope.clickDistrict = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = true;
        $scope.sttWard = false;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        tabAddress = 'address' + $scope.tab;
        $scope.changeDivision($scope[tabAddress].divisionId, $scope[tabAddress].divisionName);
        // $scope.changeDivision($scope[tabAddress].divisionId,$scope[tabAddress].divisionName);
    }

    /**clickWard */
    $scope.clickWard = function () {
        $scope.sttCustomer = false;
        $scope.sttDivision = false;
        $scope.sttDistrict = false;
        $scope.sttWard = true;
        $scope.sttCustomerOnl = false;
        $scope.sttDivisionOnl = false;
        $scope.sttDistrictOnl = false;
        $scope.sttWardOnl = false;
        $scope.changeDistrict($scope[tabAddress].districtId, $scope[tabAddress].districtName);
    }


    /**clickNullDivision */
    $scope.clickNullDivision = function () {
        tabAddress = 'address' + $scope.tab;
        $scope[tabAddress].division = undefined;
        $scope[tabAddress].divisionId = undefined;
        $scope[tabAddress].divisionName = undefined;
        $scope[tabAddress].district = undefined;
        $scope[tabAddress].districtId = undefined;
        $scope[tabAddress].districtName = undefined;
        $scope.changeDivision($scope[tabAddress].divisionId, $scope[tabAddress].divisionName);
        $scope.changeDistrict($scope[tabAddress].districtId, $scope[tabAddress].districtName);
    }

    /**clickNullDistrict */
    $scope.clickNullDistrict = function () {
        tabAddress = 'address' + $scope.tab;
        $scope[tabAddress].district = undefined;
        $scope[tabAddress].districtId = undefined;
        $scope[tabAddress].districtName = undefined;
        $scope.changeDistrict($scope[tabAddress].districtId, $scope[tabAddress].districtName);
    }

    /**clickNullWard */
    $scope.clickNullWard = function () {
        tabAddress = 'address' + $scope.tab;
        $scope[tabAddress].ward = undefined;
        $scope[tabAddress].wardCode = undefined;
        $scope[tabAddress].wardName = undefined;
        $scope.changeWard($scope[tabAddress].wardName, $scope[tabAddress].wardCode);
    }

    /**changeDivision */
    $scope.changeDivision = function (provinceId, provinceName) {
        tabAddress = 'address' + $scope.tab;
        lstDistrict = 'lstDistrict' + $scope.tab;
        $scope.sttDivision = false;
        if ($scope[tabAddress].divisionId != provinceId) {
            $scope[tabAddress].districtName = '';
            $scope[tabAddress].wardName = '';
        }
        $scope.lstDistrict = {}
        $scope.messageAddress = '';
        var data = {
            province_id: parseInt(provinceId)
        }
        if (provinceId != undefined) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    lstDistrict = 'lstDistrict' + $scope.tab;
                    $scope[tabAddress].divisionName = provinceName;
                    $scope[tabAddress].divisionId = provinceId;
                    $scope[lstDistrict] = resp.data.data;
                    if (resp.data.data.length < 10) {
                        $scope.sizeDistrict = resp.data.data.length + 1;
                    } else {
                        $scope.sizeDistrict = 10;
                    }
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            lstDistrict = 'lstDistrict' + $scope.tab;
            $scope[lstDistrict] = {}
        }
        $scope.saveOrder();
    }

    /**changeDistrict */
    $scope.changeDistrict = function (districtId, districtName) {
        tabAddress = 'address' + $scope.tab;
        lstWard = 'lstWard' + $scope.tab;
        $scope.sttDistrict = false;
        $scope.lstWard = {};
        var data = {
            district_id: parseInt(districtId)
        }
        if (districtId != undefined) {
            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    lstWard = 'lstWard' + $scope.tab;
                    $scope[tabAddress].districtId = districtId;
                    $scope[tabAddress].districtName = districtName;
                    $scope[lstWard] = resp.data.data;
                    if ($scope[tabAddress].districtId != districtId) {
                        $scope[tabAddress].wardName = '';
                        $scope.messageAddress = '';
                        if (resp.data.data.length < 10) {
                            $scope.sizeWard = resp.data.data.length + 1;
                        } else {
                            $scope.sizeWard = 10;
                        }
                    }
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        } else {
            lstWard = 'lstWard' + $scope.tab;
            $scope[lstWard] = {};
        }
        $scope.saveOrder();
    }

    /**changeWard */
    $scope.changeWard = function (wardName, wardCode) {
        console.log(wardCode);
        tabAddress = 'address' + $scope.tab;
        $scope.messageAddress = '';
        $scope.sttWard = false;
        $scope[tabAddress].wardName = wardName;
        $scope[tabAddress].wardCode = wardCode;
        $scope.shippingFee();
        $scope.saveOrder();
    }

    /**searchDivision */
    $scope.searchDivision = function (name) {
        $http.get(`https://provinces.open-api.vn/api/p/search/?q=${markRequireAll(name)}`)
            .then(resp => {
                $scope.lstDivision = resp.data;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })
    }

    /**searchDistrict */
    $scope.searchDistrict = function (name) {
        if ($scope.divisionCode === null || $scope.divisionCode === undefined) {
            return;
        }

        if (name === '' || name === undefined) {
            $http.get(`https://provinces.open-api.vn/api/p/${$scope.divisionCode}?depth=2`)
                .then(resp => {
                    // console.log(resp.data);
                    $scope.lstDistrict = resp.data.districts;
                    // console.log(resp.data.districts);
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        }
        else {
            $http.get(`https://provinces.open-api.vn/api/d/search/?q=${markRequireAll(name)}&p=${$scope.divisionCode}`)
                .then(resp => {
                    console.log(resp.data);
                    $scope.lstDistrict = resp.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        }
    }


    /**searchWard */
    $scope.searchWard = function (name) {
        // console.log(name);
        if ($scope.districtCode === null || $scope.districtCode === undefined) {
            return;
        }

        if (name === '' || name === undefined) {
            $http.get(`https://provinces.open-api.vn/api/d/${$scope.districtCode}?depth=2`)
                .then(resp => {
                    // console.log(resp.data);
                    $scope.lstWard = resp.data.wards;
                    // console.log(resp.data.districts);
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        }
        else {
            $http.get(`https://provinces.open-api.vn/api/w/search/?q=${markRequireAll(name)}&d=${$scope.districtCode}`)
                .then(resp => {
                    $scope.lstWard = resp.data;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
        }
    }


    $scope.toastSucess = function () {
        toastMessage('', 'Thêm mới thành công', 'success')
    }

    $scope.toastError = function () {
        toastMessage('', 'Thêm mới thất bại', 'error')
    }

    function markRequireAll(query) {
        const words = query.split(/\s+/)
        return words.map(w => `+${w}`).join(' ')
    }

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


    /**click chọn tab hóa đơn tạo */
    $scope.selectedTabCreate = async function () {
        if ($scope.counts.length > 0) {
            var index = await $scope.counts[0].index;
            $('#new-tab' + index).click();
        }
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
    }

    /**add tab off */
    $scope.addTabs = async function () {
        if ($scope.counts.length > 4) {
            // $scope.showNext = true;
            toastMessage('', "Tối đa chỉ được 5 hóa đơn!", 'error');
            return;
        }
        count += 1;
        var data = {
            index: count
        }

        $scope.counts.push(data);
        variable = 'lstAddedProducts' + count;
        $scope[variable] = [];
        tabBill = 'bill' + count;
        var user = {
            userId: -1,
        }
        $scope[tabBill] = {
            customers: user,
            payments: 0,
            discount: 0,
            shippingFee: 0,
            billType: 1,
            status: false
        };
        tabAddress = 'address' + count;
        $scope[tabAddress] = {};
        totalProPrice = 'totalProPrice' + count;
        $scope[totalProPrice] = {
            price: 0
        };
        lstDivision = 'lstDivision' + count;
        $scope.getDivision();
        $scope[lstDivision] = {};
        lstDistrict = 'lstDistrict' + count;
        $scope[lstDistrict] = {};
        lstWard = 'lstWard' + count;
        $scope[lstWard] = {};
        statusBill = 'status' + $scope.tab;
        // $scope[statusBill].status = false;
        $scope.tabCount += 1;
        $scope.tab = count;
        if ($scope.counts.length == 1) {
            $scope.selectedTabCreate();
            var index = await $scope.counts[0].index;
            $('#new-tab' + index).click();
        } else {
            var index = await $scope.counts[$scope.counts.length - 1].index;
            $('#new-tab' + index).click();
        }
        $scope.saveOrder();
    }

    /**dynamic tab off */
    $scope.selectedTab = function (index) {
        indexTab = index;
        $scope.tab = index;
        tabBill = 'bill' + $scope.tab;
        variable = 'lstAddedProducts' + $scope.tab;
        tabAddress = 'address' + $scope.tab;
        totalProPrice = 'totalProPrice' + $scope.tab;
        $scope.dynamicAddedProducts();
        $scope.dynamicBill();
        $scope.dynamicAddress();
        $scope.dynamicTotalProPrice();
        $scope.dynamicLstDivision();
        $scope.dynamicLstDistrict();
        $scope.dynamicLstWard();
        $scope.dynamicStatus();
        $scope.messageCus = '';
        $scope.messagePhone = '';
        $scope.messageSeller = '';
        $scope.messageBillDetails = '';
        $scope.messageAddress = '';
        $scope.messageNote = '';
    }

    $scope.dynamicAddedProducts = function () {
        variable = 'lstAddedProducts' + $scope.tab;
        return $scope[variable];
    }

    $scope.dynamicTotalProPrice = function () {
        totalProPrice = 'totalProPrice' + $scope.tab;
        return $scope[totalProPrice];
    }

    $scope.dynamicBill = function () {
        tabBill = 'bill' + $scope.tab;
        return $scope[tabBill];
    }

    $scope.dynamicAddress = function () {
        tabAddress = 'address' + $scope.tab;
        return $scope[tabAddress];
    }

    $scope.dynamicLstDivision = function () {
        lstDivision = 'lstDivision' + $scope.tab;
        return $scope[lstDivision];
    }

    $scope.dynamicLstDistrict = function () {
        lstDistrict = 'lstDistrict' + $scope.tab;
        return $scope[lstDistrict];
    }

    $scope.dynamicLstWard = function () {
        lstWard = 'lstWard' + $scope.tab;
        return $scope[lstWard];
    }

    $scope.dynamicStatus = function () {
        statusBill = 'status' + $scope.tab;
        return $scope[statusBill];
    }

    async function createTab() {
        if ($scope.counts.length == 0) {
            count = 0;
            await $scope.addTabs();
            // console.log($scope.counts[0].index);
            // await $('#new-tab' + $scope.counts[0].index).click();
            await $scope.selectedTabCreate();
        }
        $('#new-tab' + $scope.counts[0].index).click();
    }


    //Next and Previous TabOffCreated
    $scope.click = 0;
    $scope.tabCount = 1;
    $scope.showPrevious = false;
    $scope.showNext = false;
    $scope.beginTab = 0;
    $scope.tabSize = 5;

    $scope.repaginateTab = function () {
        $scope.beginTab = 0;
    }
    $scope.repaginateTab();

    /**Nút tab tiếp sau off */
    $scope.nextTab = function () {
        $scope.beginTab += 1;
        $('#new-tab' + $scope.tab).click();
        $scope.click += 1;
        if ($scope.beginTab > $scope.counts.length - 6) {
            $scope.showNext = false;
        } else {
            $scope.showNext = true;
        }
        if ($scope.beginTab > 0) {
            $scope.showPrevious = true;
        } else {
            $scope.showPrevious = false;
        }
    }


    /**nút previous tab off */
    $scope.previousTab = function () {
        $scope.beginTab -= 1;
        $('#new-tab' + $scope.tab).click();
        $scope.click -= 1;
        if ($scope.beginTab > $scope.counts.length - 6) {
            $scope.showNext = false;
        } else {
            $scope.showNext = true;
        }
        if ($scope.beginTab > 0) {
            $scope.showPrevious = true;
        } else {
            $scope.showPrevious = false;
        }
    }

    /**đóng tab off */
    $scope.closeTab = function (index, numIndex) {
        if ($scope.counts.length == 1) {
            toastMessage('', "Không thể xóa!", 'error');
            return;
        }
        var currentTab = $scope.tab;
        Swal.fire({
            title: 'Bạn có muốn xóa hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoading = true;
                $scope.counts.splice(index + $scope.click, 1);
                $scope.isLoading = false;
                if (currentTab == numIndex) {
                    $scope.selectedTabCreate();
                } else {
                    $('#new-tab' + currentTab).click();
                }
                if (JSON.parse(localStorage.getItem('lstTabDeleted')) == null) {
                    $scope.lstTabDeleted = [];
                    $scope.lstTabDeleted.push(numIndex);
                } else {
                    // $scope.lstTabDeleted = JSON.parse(localStorage.getItem('lstTabDeleted'));
                    $scope.lstTabDeleted.push(numIndex);
                }
                $scope.tabCount -= 1;
                $scope.isLoading = false;
            }
        })
        $scope.saveOrder();
    }

    $(document).bind('click', function (e) {
        if ($(e.target).closest('input').length == 0) {
            //p is not clicked. do your stuff here
            $scope.sttCustomer = false;
            $scope.sttDivision = false;
            $scope.sttDistrict = false;
            $scope.sttWard = false;
        }
    });


    var scanner;
    var before = false;

    /**qr code search bill */
    function readQRCode(bool, before, camera, lstCamera) {
        var lstReturn = [];
        console.log('openQR');
        scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            var billId = content.split('/');
            billId = billId.pop() || billId.pop();  // handle potential trailing slash
            console.log(billId);
            $scope.isLoading = true;
            $http.get(`${API_BILL}/get-bill-by-status/${$scope.billStatus}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.bills = resp.data.filter(function (task) {
                        return task.billId == billId;
                    });
                    $scope.currentPage = 1;
                    $scope.begin = 0
                    $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                    $scope.beginBill = 0; // hiển thị thuộc tính bắt đầu từ 0
                    $scope.pageBill = 1;
                    $scope.isLoading = false;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    console.log(error);
                    $scope.isLoading = false;
                })
            scanner.stop();
            $('#modalCamereQR').modal('hide');
            // return $scope.bills;
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (lstCamera.length > 0) {
                if (before) {
                    scanner.start($scope.camera);
                } else {
                    if (bool) {
                        scanner.start(camera);
                    } else {
                        scanner.start(lstCamera[0]);
                    }
                }
            } else {
                toastMessage('', "Không tìm thấy camera !", 'error');
            }
            $('#modalCamereQR').modal('show');
            $scope.isLoading = false;
        }).catch(function (e) {
            console.error(e);
            $scope.isLoading = false;
        });

    }

    /**open modal quét QR */
    $scope.onOpenQRCode = async function () {
        readQRCode(false, before, null, $scope.lstCamera);
    };

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            $scope.lstCamera = angular.copy(cameras);
            $scope.camera = angular.copy(cameras[0]);
        }
        $scope.isLoading = false;
    }).catch(function (e) {
        console.error(e);
        $scope.isLoading = false;
    });

    /**changeCamera */
    $scope.changeCamera = function (camera) {
        try {
            $scope.camera = angular.copy(camera);
            scanner.stop();
            readQRCode(true, before, camera, $scope.lstCamera);
        } catch (error) {

        }
    }

    $scope.onCloseQRCode = function () {
        console.log('stopQR');
        scanner.stop();
        $('#modalCamereQR').modal('hide');
    };


    $scope.intilizeLstProduct = async function () {
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.productVariants = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                console.log(error);
                $scope.isLoading = false;
            })

        //GetVariantValueByProductVariant
        await $scope.productVariants.forEach(item => {
            var customName = '';
            $scope.isLoading = true;
            $http.get(`${API_SALE}/find-discount-sale-by-product-variant/${item.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    item.sales = resp.data.discount;
                    $scope.isLoading = false;
                })
                .catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    $scope.isLoading = false;
                    console.log(error)
                })
        });
    };



    /**qr add thêm sản phẩm vào bill tạo mới */
    async function readQRCode1(bool, before, camera, lstCamera, productVariants) {
        console.log('openQR');
        // await $scope.getLstProduct();
        scanner = new Instascan.Scanner({ video: document.getElementById('preview1') });
        await scanner.addListener('scan', function (content) {
            console.log(content);
            var variantId = content.split(']');
            variantId = variantId.pop() || variantId.pop();  // handle potential trailing slash
            var index = productVariants.findIndex(c => c.variantId == variantId);
            var proVal = productVariants[index];
            console.log(proVal);
            $scope.onAddCart(proVal);


            $scope.isLoading = false;
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (lstCamera.length > 0) {
                if (before) {
                    scanner.start($scope.camera);
                } else {
                    if (bool) {
                        scanner.start(camera);
                    } else {
                        scanner.start(lstCamera[0]);
                    }
                }
            } else {
                toastMessage('', "Không tìm thấy camera !", 'error');
            }
            $('#modalCamereQR1').modal('show');
            $scope.isLoading = false;
        }).catch(function (e) {
            console.error(e);
            $scope.isLoading = false;
        });


    }

    /**open modal quét QR */
    $scope.onOpenQRCode1 = async function () {
        if ($scope.counts.length > 0 || !isEmptyObject($scope.billStatus5) || !isEmptyObject($scope.billStatus123)) {
            await $scope.intilizeLstProduct();
            readQRCode1(false, before, null, $scope.lstCamera, $scope.productVariants);
        }
    };

    /**changeCamera */
    $scope.changeCamera1 = async function (camera) {
        try {
            $scope.camera = angular.copy(camera);
            before = true;
            scanner.stop();

            await $scope.intilizeLstProduct();
            readQRCode1(true, before, camera, $scope.lstCamera, $scope.productVariants);
        } catch (error) {

        }
    }
    //clear scanner

    $scope.onCloseQRCode1 = function () {
        console.log('stopQR');
        scanner.stop();
        $('#modalCamereQR1').modal('hide');
    };


    /** thêm sản phẩm vào bill status 123 */
    function readQRCodeStatus123(bool, before, camera, lstCamera, productVariants) {
        console.log('openQR');
        scanner = new Instascan.Scanner({ video: document.getElementById('previewStatus123') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            var variantId = content.split(']');
            variantId = variantId.pop() || variantId.pop();  // handle potential trailing slash
            var index = productVariants.findIndex(c => c.variantId == variantId);
            var proVal = productVariants[index];
            $scope.onAddBillStatus123(proVal);
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (lstCamera.length > 0) {
                if (before) {
                    scanner.start($scope.camera);
                } else {
                    if (bool) {
                        scanner.start(camera);
                    } else {
                        scanner.start(lstCamera[0]);
                    }
                }
            } else {
                toastMessage('', "Không tìm thấy camera !", 'error');
            }
            $('#modalCamereQRStatus123').modal('show');
            $scope.isLoading = false;
        }).catch(function (e) {
            console.error(e);
            $scope.isLoading = false;
        });


    }

    /**open modal quét QR */
    $scope.onOpenQRCodeStatus123 = async function () {
        await $scope.intilizeLstProduct();
        readQRCodeStatus123(false, before, null, $scope.lstCamera, $scope.productVariants);

    };

    $scope.changeCameraStatus123 = async function (camera) {
        try {
            $scope.camera = angular.copy(camera);
            scanner.stop();
            await $scope.intilizeLstProduct();
            readQRCodeStatus123(true, before, camera, $scope.lstCamera, $scope.productVariants);
        } catch (error) {

        }
    }
    /**clear scanner */

    $scope.onCloseQRCodeStatus123 = function () {
        console.log('stopQR');
        scanner.stop();
        $('#modalCamereQRStatus123').modal('hide');
    };

    /** thêm sản phẩm vào bill status chờ thanh toán */
    function readQRCodeStatus5(bool, before, camera, lstCamera, productVariants) {
        console.log('openQR');
        scanner = new Instascan.Scanner({ video: document.getElementById('previewStatus5') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            var variantId = content.split(']');
            variantId = variantId.pop() || variantId.pop();  // handle potential trailing slash
            var index = productVariants.findIndex(c => c.variantId == variantId);
            var proVal = productVariants[index];
            $scope.onAddBillStatus5(proVal);
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (lstCamera.length > 0) {
                if (before) {
                    scanner.start($scope.camera);
                } else {
                    if (bool) {
                        scanner.start(camera);
                    } else {
                        scanner.start(lstCamera[0]);
                    }
                }
            } else {
                toastMessage('', "Không tìm thấy camera !", 'error');
            }
            $('#modalCamereQRStatus5').modal('show');
            $scope.isLoading = false;
        }).catch(function (e) {
            console.error(e);
            $scope.isLoading = false;
        });


    }

    /**open modal quét QR */
    $scope.onOpenQRCodeStatus5 = async function () {
        await $scope.intilizeLstProduct();
        readQRCodeStatus5(false, before, null, $scope.lstCamera, $scope.productVariants);

    };

    $scope.changeCameraStatus5 = async function (camera) {
        try {
            $scope.camera = angular.copy(camera);
            scanner.stop();
            await $scope.intilizeLstProduct();
            readQRCodeStatus5(true, before, camera, $scope.lstCamera, $scope.productVariants);
        } catch (error) {

        }
    }
    /**clear scanner */

    $scope.onCloseQRCodeStatus5 = function () {
        console.log('stopQR');
        scanner.stop();
        $('#modalCamereQRStatus5').modal('hide');
    };

    /**clickSelectAllBill */
    $scope.clickSelectAllBill = function (value) {
        var checkedValue = document.getElementsByName('billcheckbox' + $scope.billStatus);
        console.log(value);
        $scope.selectedAllBill = false;
        if (value == false) {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
            }
        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
        }
    }

    /**cập nhật trạng thái hàng loạt */
    $scope.updateStatus = function () {
        $scope.billChecked = [];
        var checkedValue = document.getElementsByName('billcheckbox' + $scope.billStatus);
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.billChecked.push(JSON.parse(checkedValue[i].value))
            }
        }
        if ($scope.billChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn hóa đơn !', 'error')
            return;
        }
        Swal.fire({
            title: 'Bạn có muốn cập nhật hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = [];
                $scope.billChecked.forEach(b => {
                    var item = {
                        bill: b,
                        status: b.status + 1
                    }
                    data.push(item);
                });
                $scope.isLoading = true;
                $http.put(`${API_BILL}/update-status-bill`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                        $scope.getBillsByStatus($scope.billStatus);
                        countBillWaitConfirm();
                        countBillWaitPay();
                        countBillWaitDelivery();

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                        // $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })
    }


    /**hủy bill hàng loạt */
    $scope.updateStatusToCancel = function () {
        $scope.billChecked = [];
        var checkedValue = document.getElementsByName('billcheckbox' + $scope.billStatus);
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.billChecked.push(JSON.parse(checkedValue[i].value))
            }
        }
        if ($scope.billChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn hóa đơn !', 'error')
            return;
        }
        Swal.fire({
            title: 'Bạn có muốn cập nhật hóa đơn?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = [];
                $scope.billChecked.forEach(b => {
                    var item = {
                        bill: b,
                        status: 5
                    }
                    data.push(item);
                });
                $scope.isLoading = true;
                $http.put(`${API_BILL}/update-status-bill`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoading = false;
                        console.log(resp.data);
                        toastMessage('', 'Cập nhật đơn hàng thành công!', 'success');
                        $scope.getBillsByStatus($scope.billStatus);
                        countBillWaitConfirm();
                        countBillWaitPay();
                        countBillWaitDelivery();

                    })
                    .catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Cập nhật đơn hàng thất bại!', 'error');
                        // $scope.success = 0;
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    })
            }
        })
    }

});

app.filter('trusted', ['$sce', function ($sce) {
    return $sce.trustAsResourceUrl;
}]);