app.controller("productReturn-ctrl", function ($scope, $http, $rootScope) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Mời bạn đăng nhập !');
        return;
    }
    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));
    const API_BILL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/bills/';
    const API_BILL_DETAIL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/bill-details/';
    const API_VARIANT_VALUE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/variant-values/';
    const API_PRODUCT_VARIANT = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/product-variants';
    const API_SALE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales';

    //Page
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 5 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;

    $scope.statusBill = 2;
    $scope.messageChoose = {};
    //LẤY DANH SÁCH HÓA ĐƠN CHỜ XÁC NHẬN TRẢ HÀNG
    $scope.findBillByWaitConfirmReturn = function () {
        $scope.statusBill = 2;
        $scope.listBillReturnInvoices = [];
        $scope.isLoading = true;
        $http.get(`${API_BILL}find-bill-by-wait-confirm-return`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.listEmptyReturnInvoices = 'Không có hóa đơn nào !';
                } else {
                    $scope.currentPage = 1;
                    $scope.begin = 0;
                    $scope.listBillReturnInvoices = response.data;
                    $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                }
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
    }

    $scope.findBillByWaitConfirmReturn();


    /**LẤY DANH SÁCH HÓA ĐƠN TỪ CHỐI TRẢ HÀNG */
    $scope.findBillByCancelReturn = function () {
        $scope.statusBill = 3;
        $scope.listBillReturnInvoices = [];
        $scope.isLoading = true;
        $http.get(`${API_BILL}find-bill-by-cancel-return`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.listEmptyReturnInvoices = 'Không có hóa đơn nào !';
                } else {
                    $scope.currentPage = 1;
                    $scope.begin = 0;
                    $scope.listBillReturnInvoices = response.data;
                    $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                    console.log($scope.listPage);
                }
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
    }

    /**LẤY DANH SÁCH HÓA ĐƠN ĐỔI TRẢ THÀNH CÔNG */
    $scope.findBillBySuccessReturn = function () {
        $scope.statusBill = 1;
        $scope.listBillReturnInvoices = [];
        $scope.isLoading = true;
        $http.get(`${API_BILL}find-bill-by-success-return`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.listEmptyReturnInvoices = 'Không có hóa đơn nào !';
                } else {
                    $scope.currentPage = 1;
                    $scope.begin = 0;
                    $scope.listBillReturnInvoices = response.data;
                    console.log($scope.listBillReturnInvoices);
                    $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                    console.log($scope.listPage);
                }
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
    }

    /**Xem chi tiết hóa đơn đã trả */
    $scope.seeTheBill = async function (id) {
        $scope.billId = id;
        $scope.selectedAllBillDetail = false;
        $scope.isLoading = true;
        await $http.get(`${API_BILL_DETAIL}find-by-bill-detail-return-invoices-and-status/${id}/${$scope.statusBill}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.listBillDetailReturn = response.data;
                $scope.listBillDetailReturn.forEach(de => {
                    de.checkBtnChoose = false;
                    de.checkEnable = false;
                    de.billDetails = [];
                    for (let i = 0; i < de.quantity; i++) {
                        var item = {
                            returnType: 0,
                            returnKind: 0,
                            billDetailReturn: {
                                productVariants: {},
                                bills: de.bills,
                                quantity: 0,
                                price: 0,
                                tax: 0,
                                totalMoney: 0,
                                note: '',
                                userConfirm: $scope.userLogin
                            },
                        };
                        de.billDetails.push(item);
                    }
                });
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });

        //GetVariantValueByProductVariant
        await $scope.listBillDetailReturn.forEach(item => {
            var detailReturnSelect = 'detailReturnSelect' + item.detailBillId;
            $scope[detailReturnSelect] = {
                quantityReturn: 1,
                note: ''
            };
            var customName = '';
            $scope.isLoading = true;
            $http.get(`${API_VARIANT_VALUE}find-by-product-variant/${item.productVariants.variantId}`, {
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
                    var nameOld = item.productVariants.products.productName;
                    item.productVariants.products.productName = `${nameOld} [${customName}]`;
                    $scope.isLoading = false;
                    $('#detailBillReturn').modal('show');
                })
                .catch(error => {
                    $scope.isLoading = false;
                    if (error.status == 401) {
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đang nhập !');
                        return;
                    }
                })
        });

    }

    /**Load list bill đủ điều kiện trả */
    $scope.findBillEligibleForReturn = function () {
        $scope.listBillEligibleForReturn = [];
        $scope.isLoading = true;
        $http.get(`${API_BILL}find-bill-eligible-for-return`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.listEmptyForReturn = 'No invoices are eligible for return !';
                } else {
                    $scope.listBillEligibleForReturn = response.data;
                }
            }).catch(function (error) {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
    };

    /**mở modal chọn bill */
    $scope.openModelChooseBill = function () {
        $scope.findBillEligibleForReturn();
    }

    /** mở modal bill trả lại */
    $scope.openModalReturn = async function (billId) {
        console.log(billId);
        $('#modalProductReturn').modal('hide');
        $scope.selectedAllBillDetail = false;
        $scope.isLoading = true;
        $scope.listMessage = [];
        await $http.get(`${API_BILL_DETAIL}find-by-bill-detail-eligible-for-return/${billId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = false;
                $scope.listBillDetail = response.data;
                console.log(response.data);
                $scope.listBillDetail.forEach(de => {
                    de.checkBtnChoose = false;
                    de.checkEnable = false;
                    de.billDetails = [];
                    // for (let i = 0; i < de.quantity; i++) {
                    var item = {
                        returnType: 0,
                        returnKind: 0,
                        billDetailReturn: {
                            productVariants: {},
                            bills: de.bills,
                            quantity: 0,
                            price: 0,
                            tax: 0,
                            totalMoney: 0,
                            note: '',
                            userConfirm: $scope.userLogin
                        },
                    };
                    de.billDetails.push(item);
                    // }
                });
            }).catch(function (error) {
                $scope.isLoading = false;
                console.log(error);
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });

        //GetVariantValueByProductVariant
        await $scope.listBillDetail.forEach(item => {
            item.returnType = 0;
            var detailReturnSelect = 'detailReturnSelect' + item.detailBillId;
            $scope[detailReturnSelect] = {
                quantityReturn: 1,
                note: ''
            };
            var customName = '';
            $scope.isLoading = true;
            $http.get(`${API_VARIANT_VALUE}find-by-product-variant/${item.productVariants.variantId}`, {
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
                    var nameOld = item.productVariants.products.productName;
                    item.productVariants.products.productName = `${nameOld} [${customName}]`;
                    $scope.isLoading = false;
                    $('#productReturnModal').modal('show');
                })

                .catch(error => {
                    $scope.isLoading = false;
                    console.log(error);
                    if (error.status == 401) {
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                })
        });
    }

    /**thay đổi kiểu trả hàng */
    $scope.changeReturnKindNew = function (ind, detail, value) {
        var index = $scope.listBillDetail.findIndex(c => c.detailBillId == detail.detailBillId);
        if (value == 1) {
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.productVariants = detail.productVariants;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.price = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.quantity = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.tax = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.totalMoney = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.note = 'Hoàn tiền';
        } else {
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.productVariants = {};
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.note = '';
        }
        onAbleBtnChooseNew($scope.listBillDetail[index]);
    }

    /** hiện nút chọn sp mới */
    function onAbleBtnChooseNew(detail) {
        var checkChooseAll = true;
        detail.billDetails.forEach(de => {
            if (isEmptyObject(de.billDetailReturn.productVariants)) {
                checkChooseAll = false;
            }

        });
        if (checkChooseAll) {
            detail.checkBtnChoose = true;
        } else {
            detail.checkBtnChoose = false;
        }
    }

    /**xóa sp mới */
    $scope.deleteProductNew = function (ind, detail) {
        var index = $scope.listBillDetail.findIndex(c => c.detailBillId == detail.detailBillId);
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.productVariants = {};
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.price = 0;
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.quantity = 0;
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.tax = 0;
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.totalMoney = 0;
        $scope.listBillDetail[index].billDetails[ind].billDetailReturn.note = '';
        onAbleBtnChooseNew($scope.listBillDetail[index]);
    }

    /**thay đổi kiểu trả hàng */
    $scope.changeReturnKindNew = function (ind, detail, value) {
        var index = $scope.listBillDetail.findIndex(c => c.detailBillId == detail.detailBillId);
        if (value == 1) {
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.productVariants = null;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.price = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.quantity = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.tax = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.totalMoney = 0;
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.note = 'Hoàn tiền';
        } else {
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.productVariants = {};
            $scope.listBillDetail[index].billDetails[ind].billDetailReturn.note = '';
        }
        onAbleBtnChooseNew($scope.listBillDetail[index]);
    }

    /**chọn product đổi mới */
    $scope.chooseProductChangeNew = function (billDetail) {
        $scope.lstProductVariant = [];
        $scope.EnableTable = false;
        $scope.proValReturn = {};
        $scope.billDetail = billDetail;
        $('#chooseProductChangeNew').modal('show');
    }

    /**chọn tất cả bill detail */
    $scope.clickSelectAllBillDetailNew = function (value) {
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        if (value == false) {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
            }
        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
        }
        EnableDetailCheckedNew($scope.listBillDetail);
    }

    function EnableDetailCheckedNew(detail) {
        var checkedValue = document.getElementsByName('billDetailcheckbox');

        for (let i = 0; i < detail.length; i++) {
            console.log(checkedValue[i].checked);
            if (checkedValue[i].checked == true) {
                detail[i].checkEnable = true;
            } else {
                detail[i].checkEnable = false;
                detail.forEach(de => {
                    var index = detail.findIndex(c => c.detailBillId == de.detailBillId);
                    for (let i = 0; i < detail[index].billDetails.length; i++) {
                        detail[index].billDetails[i].billDetailReturn.productVariants = {};
                        detail[index].billDetails[i].billDetailReturn.price = 0;
                        detail[index].billDetails[i].billDetailReturn.quantity = 0;
                        detail[index].billDetails[i].billDetailReturn.tax = 0;
                        detail[index].billDetails[i].billDetailReturn.totalMoney = 0;
                        detail[index].billDetails[i].billDetailReturn.note = '';
                        onAbleBtnChooseNew(detail[index]);
                    }

                });
            }
        }
    }

    $scope.changeCheckboxNew = function () {
        EnableDetailCheckedNew($scope.listBillDetail);
    }

    /**thay đổi số lượng trả hàng */
    $scope.changeQuantityReturn = function (detailBillId, quantityReturn) {
        var index = $scope.listBillDetail.findIndex(c => c.detailBillId == detailBillId);
        console.log(Number.isInteger(quantityReturn));
        if ($scope.listBillDetail[index].quantity < quantityReturn || quantityReturn <= 0 || !Number.isInteger(quantityReturn)) {
            toastMessage('', 'Số lượng trả không phù hợp!', 'error');
            detailReturnSelect = 'detailReturnSelect' + detailBillId;
            $scope[detailReturnSelect].quantityReturn = 1;
            $scope.listBillDetail[index].billDetails = [];
            for (let i = 0; i < $scope[detailReturnSelect].quantityReturn; i++) {
                var item = {
                    returnType: 0,
                    returnKind: 0,
                    billDetailReturn: {
                        productVariants: {},
                        bills: $scope.listBillDetail[index].bills,
                        quantity: 0,
                        price: 0,
                        tax: 0,
                        totalMoney: 0,
                        note: '',
                        userConfirm: $scope.userLogin
                    },
                };
                $scope.listBillDetail[index].billDetails.push(item);
            }
            return;
        }
        // $scope.listBillDetail.forEach(de => {
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        if (checkedValue[index].checked == true && JSON.parse(checkedValue[index].value).detailBillId == detailBillId) {
            $scope.listBillDetail[index].checkBtnChoose = false;
            $scope.listBillDetail[index].checkEnable = true;
        }
        $scope.listBillDetail[index].billDetails = [];
        for (let i = 0; i < quantityReturn; i++) {
            var item = {
                returnType: 0,
                returnKind: 0,
                billDetailReturn: {
                    productVariants: {},
                    bills: $scope.listBillDetail[index].bills,
                    quantity: 0,
                    price: 0,
                    tax: 0,
                    totalMoney: 0,
                    note: '',
                    userConfirm: $scope.userLogin
                },
            };
            $scope.listBillDetail[index].billDetails.push(item);
        }
        // });
    }

    /**thay đổi product mới */
    $scope.onChangeProductNew = async function (proVal) {
        var index = $scope.listBillDetail.findIndex(c => c.detailBillId == $scope.billDetail.detailBillId);
        for (let i = 0; i < $scope.listBillDetail[index].billDetails.length; i++) {
            if ($scope.listBillDetail[index].billDetails[i].returnKind == 0 && isEmptyObject($scope.listBillDetail[index].billDetails[i].billDetailReturn.productVariants)) {
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.productVariants = proVal;
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.price = proVal.price;
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.quantity = 1;
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.tax = proVal.tax;
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.totalMoney = proVal.price * (100 + proVal.tax) / 100;
                $scope.listBillDetail[index].billDetails[i].billDetailReturn.note = 'Hàng đổi trả';
                break;
            }
        }
        onAbleBtnChoose($scope.listBillDetail[index]);
        $('#chooseProductChangeNew').modal('hide');
    }

    /**click chọn tất cả bill detail */
    $scope.clickSelectAllBillDetail = function (value) {
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        if (value == false) {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
            }
        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
        }
        EnableDetailChecked($scope.listBillDetailReturn);
    }

    /**click nút trả hàng */
    $scope.btnReturn = async function () {
        $scope.idBillDetailChecked = [];
        $scope.listProductReturns = [];
        $scope.listMessage = [];
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                detailReturnSelect = 'detailReturnSelect' + JSON.parse(checkedValue[i].value).detailBillId;
                console.log(JSON.parse(checkedValue[i].value));
                var quantityReturn = $scope[detailReturnSelect].quantityReturn;
                var note = $scope[detailReturnSelect].note;
                var quantity = $scope.listBillDetail[i].quantity
                var itemMessage = {
                    index: i,
                    quantity: '',
                    note: '',
                    chooseProduct: ''
                };
                if (quantityReturn > quantity || quantityReturn < 0) {
                    itemMessage.quantity = 'Số lượng không được để trống !';
                    $scope.listMessage[i] = angular.copy(itemMessage);
                } else if (isNaN(quantityReturn)) {
                    itemMessage.quantity = 'Số lượng phải là số !';
                    $scope.listMessage[i] = angular.copy(itemMessage);
                }
                if (note.length > 255 || note.length == 0) {
                    itemMessage.note = 'Ghi chú phải 0 <= xxx <= 255 ký tự !';
                    $scope.listMessage[i] = angular.copy(itemMessage);
                }

                if (!JSON.parse(checkedValue[i].value).checkBtnChoose && JSON.parse(checkedValue[i].value).checkEnable) {
                    itemMessage.chooseProduct = 'Chưa chọn sản phẩm đổi !';
                    $scope.listMessage[i] = angular.copy(itemMessage);
                }
                $scope.idBillDetailChecked.push(JSON.parse(checkedValue[i].value).detailBillId)
            }
        }
        if ($scope.idBillDetailChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn sản phẩm muốn trả !', 'error')
            return;
        }
        if ($scope.listMessage.length > 0) {
            toastMessage('', 'Trả hàng thất bại !', 'error')
            return;
        }

        $scope.idBillDetailChecked.forEach(id => {
            detailReturnSelect = 'detailReturnSelect' + id;
            console.log($scope[detailReturnSelect]);
            var quantityReturn = $scope[detailReturnSelect].quantityReturn;
            var note = $scope[detailReturnSelect].note;
            var index = $scope.listBillDetail.findIndex(o => o.detailBillId == id);
            var detailReturn = angular.copy($scope.listBillDetail[index]);
            detailReturn.quantity = quantityReturn;
            detailReturn.note = note;
            $scope.listProductReturns.push(detailReturn);
        });


        await Swal.fire({
            title: 'Bạn có chắc chắn trả hàng không ?',
            // text: "You won't be to change this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                // $scope.isLoadingModal = true;
                var data = []
                $scope.listProductReturns.forEach(b => {
                    var detailReturn = [];
                    var returnType = [];
                    b.billDetails.forEach(de => {
                        detailReturn.push(de.billDetailReturn);
                        returnType.push(de.returnType);
                    });
                    var item = {
                        billDetail: b,
                        billDetails: detailReturn,
                        returnTypes: returnType
                    }
                    data.push(item);
                });
                console.log(data);
                $scope.isLoadingModal = true;
                $http.post(`${API_BILL_DETAIL}return-bill-detail-of-admin`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoadingModal = false;
                        toastMessage('', 'Trả hàng thành công !', 'success');
                        $scope.findBillByWaitConfirmReturn();
                        $('#productReturnModal').modal('hide');
                    })
                    .catch(error => {
                        $scope.isLoadingModal = false;
                        if (error.status == 401) {
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        console.log(error);
                        toastMessage('', 'Trả hàng thất bại !', 'error');
                    })
            }
        })


    }

    /**Tạo dynamicQuantityReturn */
    $scope.dynamicQuantityReturn = function (id) {
        detailReturnSelect = 'detailReturnSelect' + id;
        return $scope[detailReturnSelect];
    }


    /**Xác nhận trả hàng */
    $scope.btnConfirm = async function () {
        $scope.billDetailChecked = [];
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.billDetailChecked.push(JSON.parse(checkedValue[i].value))
            }
        }
        if ($scope.billDetailChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn sản phẩm !', 'error')
            return;
        }


        // $scope.listMessageConFirm = [];
        // var checkedValue = document.getElementsByName('billDetailcheckbox');
        // for (let i = 0; i < checkedValue.length; i++) {
        //     if (checkedValue[i].checked == true) {
        //         detailReturnSelect = 'detailReturnSelect' + JSON.parse(checkedValue[i].value).detailBillId;
        //         console.log(JSON.parse(checkedValue[i].value));
        //         var itemMessage = {
        //             index: i,
        //             chooseProduct: ''
        //         };
        //         if (!JSON.parse(checkedValue[i].value).checkBtnChoose && JSON.parse(checkedValue[i].value).checkEnable) {
        //             itemMessage.chooseProduct = 'Chưa chọn sản phẩm đổi !';
        //             $scope.listMessageConFirm[i] = angular.copy(itemMessage);
        //         }
        //     }
        // }


        console.log($scope.billDetailChecked);
        var checkNotChoose = 0;
        $scope.billDetailChecked.forEach(de => {
            de.billDetails.forEach(detailReturn => {
                if (isEmptyObject(detailReturn.billDetailReturn.productVariants)) {
                    checkNotChoose = 1;
                }
            });
        });
        if (checkNotChoose == 1) {
            toastMessage('', 'Bạn chưa chọn đủ sản phẩm để trả !', 'error')
            return;
        }
        await Swal.fire({
            title: 'Bạn có muốn xác nhận trả đơn hàng này?',
            // text: "You won't be to change this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoadingModal = true;
                var data = [];
                console.log($scope.billDetailChecked);
                $scope.billDetailChecked.forEach(b => {
                    console.log(b);
                    var detailReturn = [];
                    var returnType = [];
                    b.billDetails.forEach(de => {
                        detailReturn.push(de.billDetailReturn);
                        returnType.push(de.returnType)
                    });
                    var item = {
                        billDetail: b,
                        billDetails: detailReturn,
                        returnTypes: returnType
                    }
                    data.push(item);
                });
                console.log(data);
                $http.post(`${API_BILL_DETAIL}verify-return`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        console.log(resp.data);
                        toastMessage('', 'Xác nhận thành công !', 'success');
                        $('#detailBillReturn').modal('hide');
                        $scope.isLoadingModal = false;
                        $scope.findBillByWaitConfirmReturn();
                    })
                    .catch(error => {
                        $scope.isLoadingModal = false;
                        if (error.status == 401) {
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Xác nhận thất bại !', 'error');
                    })
            }
        })


    }

    /**xác nhận hủy trả hàng */
    $scope.btnReject = async function () {
        $scope.billDetailChecked = [];
        // $scope.listProductReturns = [];
        // $scope.listMessage = [];
        var checkedValue = document.getElementsByName('billDetailcheckbox');
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.billDetailChecked.push(JSON.parse(checkedValue[i].value))
            }
        }
        if ($scope.billDetailChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn sản phẩm !', 'error')
            return;
        }

        await Swal.fire({
            title: 'Bạn có muốn xác nhận hủy trả đơn hàng này?',
            // text: "You won't be to change this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoadingModal = true;
                $http.post(`${API_BILL_DETAIL}prohibit-return`, $scope.billDetailChecked, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        $scope.isLoadingModal = false;
                        console.log(resp.data);
                        toastMessage('', 'Xác nhận hủy thành công !', 'success');
                        $('#detailBillReturn').modal('hide');

                        $scope.statusBill = 2;
                        $scope.listBillReturnInvoices = [];
                        $scope.isLoading = true;
                        $http.get(`${API_BILL}find-bill-by-wait-confirm-return`, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(function (response) {
                                $scope.isLoading = false;
                                if (response.data.length == 0) {
                                    $scope.listEmptyReturnInvoices = 'Không có hóa đơn nào !';
                                } else {
                                    $scope.listBillReturnInvoices = response.data;
                                    $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                                }
                            }).catch(function (error) {
                                $scope.isLoading = false;
                                if (error.status == 401) {
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                            });
                    })
                    .catch(error => {
                        $scope.isLoadingModal = false;
                        if (error.status == 401) {
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Xác nhận hủy thất bại !', 'error');
                    })
            }
        })


    }

    /**chọn product đổi */
    $scope.chooseProductChange = function (billDetail) {
        $scope.lstProductVariant = [];
        $scope.EnableTable = false;
        $scope.proValReturn = {};
        $scope.billDetail = billDetail;
        $('#chooseProductChange').modal('show');
    }

    $scope.lstProductVariant = {};

    /**lấy list sp */
    $scope.getLstProduct = async function () {
        $scope.isLoading = true;
        await $http.get(`${API_PRODUCT_VARIANT}/get-product-variant-of-sale`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.lstProductVariant = resp.data;

                var checkedValue = document.getElementsByName('billDetailcheckbox');
                if ($scope.listBillDetailReturn != undefined) {
                    for (let i = 0; i < $scope.listBillDetailReturn.length; i++) {
                        if (checkedValue[i].checked == true) {
                            for (let index = 0; index < $scope.listBillDetailReturn[i].billDetails.length; index++) {
                                var proVal = $scope.listBillDetailReturn[i].billDetails[index].billDetailReturn.productVariants;
                                if (!isEmptyObject(proVal) && $scope.listBillDetailReturn[i].billDetails[index].returnKind == 0) {
                                    var ind = $scope.lstProductVariant.findIndex(c => c.variantId == proVal.variantId);
                                    $scope.lstProductVariant[ind].quantity--;
                                }
                                var proValReturn = $scope.listBillDetailReturn[i].productVariants;
                                if (!isEmptyObject(proValReturn) && $scope.listBillDetailReturn[i].billDetails[index].returnType == 1) {
                                    var ind = $scope.lstProductVariant.findIndex(c => c.variantId == proValReturn.variantId);
                                    $scope.lstProductVariant[ind].quantity++;
                                }
                            }
                        }
                    }
                }

                if ($scope.listBillDetail != undefined) {
                    for (let i = 0; i < $scope.listBillDetail.length; i++) {
                        if (checkedValue[i].checked == true) {
                            for (let index = 0; index < $scope.listBillDetail[i].billDetails.length; index++) {
                                var proVal = $scope.listBillDetail[i].billDetails[index].billDetailReturn.productVariants;
                                if (!isEmptyObject(proVal) && $scope.listBillDetail[i].billDetails[index].returnKind == 0) {
                                    var ind = $scope.lstProductVariant.findIndex(c => c.variantId == proVal.variantId);
                                    $scope.lstProductVariant[ind].quantity--;
                                }
                                var proValReturn = $scope.listBillDetail[i].productVariants;
                                if (!isEmptyObject(proValReturn) && $scope.listBillDetail[i].billDetails[index].returnType == 1) {
                                    var ind = $scope.lstProductVariant.findIndex(c => c.variantId == proValReturn.variantId);
                                    $scope.lstProductVariant[ind].quantity++;
                                }
                            }
                        }
                    }
                }

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

        //GetVariantValueByProductVariant
        await $scope.lstProductVariant.forEach(item => {
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

    /**click ô search sp */
    $scope.clickSearch = function (val) {
        if (val === null || val === '' || val === undefined) {
            $scope.getLstProduct();
        }
    }

    /**khi click nút X của lstProductVariant */
    $scope.closeLstProVal = function () {
        $scope.lstProductVariant = [];
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
        }
    }

    /**check các ô checkbox */
    function EnableDetailChecked(detail) {
        var checkedValue = document.getElementsByName('billDetailcheckbox');

        for (let i = 0; i < detail.length; i++) {
            console.log(checkedValue[i].checked);
            if (checkedValue[i].checked == true) {
                detail[i].checkEnable = true;
            } else {
                detail[i].checkEnable = false;
                $scope.listBillDetailReturn.forEach(de => {
                    var index = $scope.listBillDetailReturn.findIndex(c => c.detailBillId == de.detailBillId);
                    for (let i = 0; i < $scope.listBillDetailReturn[index].billDetails.length; i++) {
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.productVariants = {};
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.price = 0;
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.quantity = 0;
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.tax = 0;
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.totalMoney = 0;
                        $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.note = '';
                        onAbleBtnChoose($scope.listBillDetailReturn[index]);
                    }

                });
            }
        }
    }

    /**thay đổi ô check box */
    $scope.changeCheckbox = function () {
        EnableDetailChecked($scope.listBillDetailReturn);
    }

    /**chọn sp đổi */
    $scope.proValReturnChose = function (proVal) {
        console.log(proVal);
        if (proVal.quantity == 0) {
            toastMessage('', 'Số lượng không đủ', 'error');
        } else {
            $scope.EnableTable = true;
            proVal.price -= proVal.sales;
            $scope.proValReturn = proVal;
            $scope.closeLstProVal();
        }

    }

    /**thay đổi sp */
    $scope.onChangeProduct = async function (proVal) {
        var index = $scope.listBillDetailReturn.findIndex(c => c.detailBillId == $scope.billDetail.detailBillId);
        for (let i = 0; i < $scope.listBillDetailReturn[index].billDetails.length; i++) {
            if ($scope.listBillDetailReturn[index].billDetails[i].returnKind == 0 && isEmptyObject($scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.productVariants)) {
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.productVariants = proVal;
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.price = proVal.price;
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.quantity = 1;
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.tax = proVal.tax;
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.totalMoney = proVal.price * (100 + proVal.tax) / 100;
                $scope.listBillDetailReturn[index].billDetails[i].billDetailReturn.note = 'Hàng đổi trả';
                break;
            }
        }
        onAbleBtnChoose($scope.listBillDetailReturn[index]);
        $('#chooseProductChange').modal('hide');
    }

    /**check hiển thị nút chọn sp */
    function onAbleBtnChoose(detail) {
        var checkChooseAll = true;
        detail.billDetails.forEach(de => {
            if (isEmptyObject(de.billDetailReturn.productVariants)) {
                checkChooseAll = false;
            }

        });
        if (checkChooseAll) {
            detail.checkBtnChoose = true;
        } else {
            detail.checkBtnChoose = false;
        }
    }

    /**xóa product */
    $scope.deleteProduct = function (ind, detail) {
        var index = $scope.listBillDetailReturn.findIndex(c => c.detailBillId == detail.detailBillId);
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.productVariants = {};
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.price = 0;
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.quantity = 0;
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.tax = 0;
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.totalMoney = 0;
        $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.note = '';
        onAbleBtnChoose($scope.listBillDetailReturn[index]);
    }

    /**thay đổi kiểu trả hàng */
    $scope.changeReturnType = async function (detail) {
        await $scope.getLstProduct();
        var ind = await $scope.lstProductVariant.findIndex(c => c.variantId == detail.productVariants.variantId);
        await $scope.lstProductVariant[ind].quantity++;
        console.log($scope.lstProductVariant[ind].quantity);
    }

    /**thay đổi loại trả hàng */
    $scope.changeReturnKind = function (ind, detail, value) {
        var index = $scope.listBillDetailReturn.findIndex(c => c.detailBillId == detail.detailBillId);
        if (value == 1) {
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.productVariants = detail.productVariants;
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.price = 0;
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.quantity = 0;
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.tax = 0;
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.totalMoney = 0;
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.note = 'Hoàn tiền';
        } else {
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.productVariants = {};
            $scope.listBillDetailReturn[index].billDetails[ind].billDetailReturn.note = '';
        }
        onAbleBtnChoose($scope.listBillDetailReturn[index]);
    }

    $scope.billDetailsStoreReturn = [];
    /**lấy list pro var được trả */
    $scope.getProductVariantReturn = async function (detail) {
        console.log(detail);
        for (let index = 0; index < $scope.listBillDetailReturn.length; index++) {
            if ($scope.listBillDetailReturn[index].detailBillId != detail.detailBillId) {
                $('#collapseBillDetail_' + $scope.listBillDetailReturn[index].detailBillId).collapse('hide');
            }
        }
        await $('#collapseBillDetail_' + detail.detailBillId).on('shown.bs.collapse', function () {
            $scope.isLoading = true;
            $http.get(`${API_BILL_DETAIL}find-by-bill-detail-store-return/${detail.bills.billId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(function (response) {
                    $scope.billDetailsStoreReturn = response.data;
                    $scope.billDetailsStoreReturn = $scope.billDetailsStoreReturn.filter(c => c.billDetailParent.detailBillId == detail.detailBillId);
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
        });
    }


    $scope.productVariants = [];
    /**khởi tạo list product */
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


    $scope.lstCamera = [];
    var scanner;
    var before = false;
    async function readQRCode1(bool, before, camera, lstCamera, productVariants) {
        console.log('openQR');
        $scope.isLoadingModal = true;
        scanner = new Instascan.Scanner({ video: document.getElementById('preview1') });
        await scanner.addListener('scan', function (content) {
            console.log(content);
            var variantId = content.split(']');
            variantId = variantId.pop() || variantId.pop();  // handle potential trailing slash
            var index = productVariants.findIndex(c => c.variantId == variantId);
            var proVal = productVariants[index];
            console.log(proVal);
            $scope.proValReturnChose(proVal);


            $scope.isLoadingModal = false;




            scanner.stop();
            $('#modalCamereQR1').modal('hide');
            $scope.isLoadingModal = false;
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if ($scope.lstCamera.length <= 0) {
                $scope.lstCamera = angular.copy(cameras);
                $scope.camera = angular.copy(cameras[0]);
            }
            else if (lstCamera.length > 0) {
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
            $scope.isLoadingModal = false;
        }).catch(function (e) {
            console.error(e);
            $scope.isLoadingModal = false;
        });


    }

    //open modal quét QR
    $scope.onOpenQRCode1 = async function () {
        await $scope.intilizeLstProduct();
        readQRCode1(false, before, null, $scope.lstCamera, $scope.productVariants);
    };

    //changeCamera
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




    /**check object empty */
    function isEmptyObject(obj) {
        return JSON.stringify(obj) === '{}'
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


    //selectPage
    $scope.selectPage = function (page) {
        $scope.begin = (page - 1) * $scope.pageSize;
        $scope.currentPage = page;
    }

    //nextPage
    $scope.nextPage = function () {
        $scope.begin = ($scope.currentPage + 1 - 1) * $scope.pageSize;
        $scope.currentPage++;
    }

    $scope.prevPage = function () {
        $scope.begin = ($scope.currentPage - 1 - 1) * $scope.pageSize;
        $scope.currentPage--;
    }

    $scope.nextListPage = function () {
        $scope.currentPage = $scope.endListPage + 1;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.listBillReturnInvoices.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prevListPage = function () {
        $scope.currentPage = $scope.startListPage - $scope.pageInList;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.listBillReturnInvoices.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.repaginate = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.listBillReturnInvoices.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.listBillReturnInvoices.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
    }

    function totalPages(totalRecord, limit) {
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        return totalPage;
    }

    /**Thông báo */
    function toastMessage(heading, text, icon) {
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
    };

    function sweetError(title) {
        Swal.fire(
            title,
            '',
            'error'
        )
    };

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

});

/**Chỉ thị ép kiểu sang số nguyên khi người dùng thay đổi giá trị select */
app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, elemnt, atrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });

            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});