app.controller('update-price-ctrl', function ($scope, $http) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Mời bạn đang nhập !');
        return;
    }

    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));
    $scope.productVariants = [];
    $scope.productVariantsOrigin = [];
    $scope.selectedAllProductVariant = false;
    $scope.updateType = 0;
    $scope.updateBy = 0;
    $scope.updateKind = 0;
    $scope.updateValue = 0;
    $scope.updateObject = {
        updateBy: 0,
        updateKind: 0,
        updateValue: 0
    }

    const API_PRODUCT_VARIANT = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/update-price-product-variant';
    const API_VARIANT_VALUE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/variant-values';
    const API_UPDATE_PRICE = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/update-price-product-variant";

    /**khởi tạo */
    $scope.initializProductVariant = async function () {
        await $http.get(`${API_PRODUCT_VARIANT}/get-all-product-variant`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.productVariants = angular.copy(response.data);
                $scope.productVariantsOrigin = angular.copy(response.data);
                $scope.pageCountProductVariant = Math.ceil($scope.productVariants.length / $scope.pageSizeProductVariant);
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
    }

    $scope.initializProductVariant();

    /**click chọn tất cả pro var */
    $scope.clickSelectAllProductVariant = function (value) {
        var checkedValue = document.getElementsByName('productVariantcheckbox');
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

    /**click 1 ô check box  */
    // $scope.changeCheckBox = function (){
    //     var val = document.getElementsByName('checkBoxAll');
    //     var checkedValue = document.getElementsByName('productVariantcheckbox');
    //     for (let i = 0; i < checkedValue.length; i++) {
    //         console.log(checkedValue[i].checked);
    //         if(checkedValue[i].checked == false){
    //             val.checked = false;
    //         }
    //     }
    // }

    //**thay đổi cập nhật giá trị */
    $scope.changeUpdateValue = function () {
        if ($scope.updateType == 1) {
            $scope.productVariants.price = angular.copy($scope.productVariantsOrigin.price);
            for (let i = 0; i < $scope.productVariants.length; i++) {
                $scope.productVariants[i].price = $scope.productVariantsOrigin[i].price;
            }
            if ($scope.updateObject.updateKind == 0 && $scope.updateObject.updateBy == 0) {
                if ($scope.updateObject.updateValue < 0 || $scope.updateObject.updateValue > 100) {
                    toastMessage("", "% không được < 0 hoặc > 100", "error");
                    $scope.updateObject.updateValue = 0;
                    return;
                }
                $scope.productVariants.forEach(pro => {
                    pro.price = pro.importPrice * (100 + $scope.updateObject.updateValue) / 100;
                });
            } else if ($scope.updateObject.updateKind == 1 && $scope.updateObject.updateBy == 0) {
                if (!Number.isInteger($scope.updateObject.updateValue)) {
                    toastMessage("", "Giá tăng phải là số nguyên dương");
                    $scope.updateObject.updateValue = 0;
                    return;
                }
                $scope.productVariants.forEach(pro => {
                    pro.price = pro.importPrice + $scope.updateObject.updateValue;
                });
            } else if ($scope.updateObject.updateKind == 0 && $scope.updateObject.updateBy == 1) {
                if ($scope.updateObject.updateValue < 0 || $scope.updateObject.updateValue > 100) {
                    toastMessage("", "% không được < 0 hoặc > 100", "error");
                    $scope.updateObject.updateValue = 0;
                    return;
                }
                $scope.productVariants.forEach(pro => {
                    pro.price = pro.price * (100 + $scope.updateObject.updateValue) / 100;
                });
            } else {
                if (!Number.isInteger($scope.updateObject.updateValue)) {
                    toastMessage("", "Giá tăng phải là số nguyên dương");
                    $scope.updateObject.updateValue = 0;
                    return;
                }
                $scope.productVariants.forEach(pro => {
                    pro.price = pro.price + $scope.updateObject.updateValue;
                });
            }
        }
    }

    /**thay đổi kiểu cập nhật */
    $scope.changeUpdateType = function () {
        if ($scope.updateType == 0) {
            $scope.productVariants = angular.copy($scope.productVariantsOrigin);
        } else {
            $scope.changeUpdateValue();
        }
    }

    /**click nút xác nhận */
    $scope.btnConfirm = async function () {
        $scope.productVariantChecked = [];
        $scope.messageError = {};
        var checkedValue = document.getElementsByName('productVariantcheckbox');
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.productVariantChecked.push(JSON.parse(checkedValue[i].value))
            }
        }
        console.log($scope.productVariantChecked);
        if ($scope.productVariantChecked.length == 0) {
            toastMessage('', 'Mời bạn chọn sản phẩm !', 'error')
            return;
        }

        await Swal.fire({
            title: 'Xác nhận cập nhật giá sản phẩm?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    productVariants: $scope.productVariantChecked,
                    productVariantsOld: $scope.productVariantsOrigin,
                    userId: $scope.userLogin.userId
                }
                console.log(data);
                $scope.isLoading = true;
                $http.post(`${API_UPDATE_PRICE}/post-data`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                    }).catch(function (error) {
                        console.log(error);

                    });
                $http.put(`${API_UPDATE_PRICE}/update-price`, data, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        console.log(response.data);
                        response.data.productVariants.forEach(p => {
                            var index = $scope.productVariants.findIndex(c => c.variantId == p.variantId);
                            $scope.productVariantsOrigin[index] = angular.copy(p);
                        });
                        for (let i = 0; i < checkedValue.length; i++) {
                            checkedValue[i].checked = false;
                        }
                        toastMessage('', 'Cập nhật thành công !', 'success');
                        $scope.updateObject.updateValue = 0;
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
                        toastMessage('', 'Cập nhật thất bại !', 'error')
                        $scope.messageError = error.data;
                        $scope.isLoading = false;
                    });
            }
        })
    }


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
    }
});