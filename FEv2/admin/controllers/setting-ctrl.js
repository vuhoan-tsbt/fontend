app.controller("setting-ctrl", function ($scope, $http) {


    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Mời bạn đăng nhập !');
        return;
    }
    const ROLE_ADMIN = 3;
    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));
    if ($scope.userLogin.role != ROLE_ADMIN) {
        setTimeout(() => {
            document.location = '/admin#!/order';
        }, 2000);
        sweetError('Bạn không có quyền truy cập !');
        return;
    }

    const API_SETTING = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/settings';
    const API_LIST_BANK = 'https://api.vietqr.io/v2/banks';
    /**lấy toàn bộ thông tin */
    function getAllInfor() {
        $scope.isLoading = true;
        $http.get(`${API_SETTING}/get-all-infor-setting`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                resp.data.bank = JSON.parse(resp.data.bank);
                $scope.setting = resp.data;
                console.log($scope.setting);
                getAllHistorySetting();
                // $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
            });
    }
    getAllInfor();


    function getAllHistorySetting() {
        $scope.isLoading = true;
        $http.get(`${API_SETTING}/get-all-history-setting`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.histories = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
            });
    }


    $scope.openModal = function (type) {
        if ('phone' == type) {
            $scope.phoneNumber = '';
            $('#modalUpdatePhone').modal('show');
        } else if ('bank' == type) {
            $scope.bank = {
                accountNumber: '',
                bankName: '',
                accountHolder: ''
            };
            //get list bank
            $scope.isLoading = true;
            $http.get(`${API_LIST_BANK}`)
                .then(resp => {
                    $scope.listBank = resp.data.data;
                    // console.log($scope.listBank);
                    $scope.bank.bankName = $scope.listBank[0];
                    $scope.isLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })
            $('#modalUpdateBank').modal('show');
        } else if ('email' == type) {
            $scope.email = {
                email: '',
                password: ''
            };
            $('#modalUpdateEmail').modal('show');
        } else if('testEmail' == type){
            $scope.messageError = {};
            $scope.testEmail = {
                to: '',
                subject: '',
                content: ''
            };
            $('#modalTestEmail').modal('show');
        }
    }

    $scope.submit = function (type) {
        if ('updatePhone' == type) {
            updatePhone($scope.phoneNumber);
        } else if ('updateBank' == type) {
            var data = angular.copy($scope.bank);
            data.bankName = data.bankName.shortName;
            updateBank(data, $scope.userLogin.userId);
        } else if ('updateEmail' == type) {
            var data = angular.copy($scope.email);
            updateEmail(data, $scope.userLogin.userId);
        } else if ('updateAddress' == type) {
            console.log($scope.address);
            updateAddress($scope.address, $scope.userLogin.userId)
        } else if('testEmail' == type){
            console.log($scope.testEmail);
            testEmail($scope.testEmail);
        }

    }

    function testEmail(data){
        $scope.isLoading = true;
        $http.post(`${API_SETTING}/test-email`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.messageError = {};
                toastMessage('', 'Test thành công', 'success');
                $('#modalTestEmail').modal('hide');
                $scope.isLoading = false;
            })
            .catch(error => {
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 403) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
                toastMessage('', 'Test thất bại', 'error');
            })
    }

    function updatePhone(phone) {
        $scope.isLoading = true;
        var data = {
            phone: phone,
            user: $scope.userLogin
        }
        $scope.isLoading = true;
        $http.post(`${API_SETTING}/update-phone`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.messageError = {};
                resp.data.bank = JSON.parse(resp.data.bank);
                $scope.setting = resp.data;
                getAllHistorySetting();
                $scope.isLoading = false;
                toastMessage('', 'Cập nhật thành công', 'success');
                $('#modalUpdatePhone').modal('hide');
            })
            .catch(error => {
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 403) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
                toastMessage('', 'Cập nhật thất bại', 'error');
            })
    }

    function updateBank(bank, userId) {

        $scope.isLoading = true;
        $http.post(`${API_SETTING}/update-bank/${userId}`, bank, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.messageError = {};
                // console.log(resp.data);
                resp.data.bank = JSON.parse(resp.data.bank);
                $scope.setting = resp.data;
                getAllHistorySetting();
                // $scope.isLoading = false;
                toastMessage('', 'Cập nhật thành công', 'success');
                $('#modalUpdatePhone').modal('hide');
            })
            .catch(error => {
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 403) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
                toastMessage('', 'Cập nhật thất bại', 'error');
            })
    }

    function updateEmail(email, userId) {

        $scope.isLoading = true;
        $http.post(`${API_SETTING}/update-email/${userId}`, email, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.messageError = {};
                resp.data.bank = JSON.parse(resp.data.bank);
                $scope.setting = resp.data;
                getAllHistorySetting();
                // $scope.isLoading = false;
                toastMessage('', 'Cập nhật thành công', 'success');
                $('#modalUpdateEmail').modal('hide');
            })
            .catch(error => {
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 403) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
                toastMessage('', 'Cập nhật thất bại', 'error');
            })
    }

    function updateAddress(address, userId) {
        $scope.isLoading = true;
        $http.post(`${API_SETTING}/update-address/${userId}`, address, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.messageError = {};
                resp.data.bank = JSON.parse(resp.data.bank);
                $scope.setting = resp.data;
                getAllHistorySetting();
                $scope.isLoading = false;
                toastMessage('', 'Cập nhật thành công', 'success');
                $('#staticBackdropUpdateAddress').modal('hide');
            })
            .catch(error => {
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
                if (error.status == 401) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
                if (error.status == 403) {
                    $scope.isLoading = false;
                    setTimeout(() => {
                        document.location = '/admin#!/order';
                    }, 2000);
                    sweetError('Bạn không có quyền truy cập !');
                    return;
                }
                toastMessage('', 'Cập nhật thất bại', 'error');
            })
    }

    $scope.openModelUpdteAddress = function () {
        $scope.address = {
            wardName: $scope.setting.wardName,
            wardCode: $scope.setting.wardCode,
            districtId: $scope.setting.districtId,
            districtName: $scope.setting.districtName,
            divisionId: $scope.setting.divisionId,
            divisionName: $scope.setting.divisionName,
            addressDetail: $scope.setting.addressDetail
        }
        console.log($scope.setting);
        $scope.getDivision();
        $('#staticBackdropUpdateAddress').modal('show');
    }
    $scope.division = {};
    $scope.district = {};
    $scope.ward = {};
    $scope.getDivision = function () {
        $scope.lstDivision = [];
        $http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
        })
            .then(resp => {
                $scope.lstDivision = resp.data.data;
                var index = $scope.lstDivision.findIndex(c => c.ProvinceID == $scope.address.divisionId);
                $scope.division = $scope.lstDivision[index];


                var data = {
                    province_id: parseInt($scope.division.ProvinceID)
                }
                console.log(data);

                $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                    headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                })
                    .then(resp => {
                        $scope.lstDistrict = resp.data.data;
                        var index = $scope.lstDistrict.findIndex(c => c.DistrictID == $scope.address.districtId);
                        $scope.district = $scope.lstDistrict[index];

                        var data = {
                            district_id: parseInt($scope.district.DistrictID)
                        }

                        $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                            headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
                        })
                            .then(resp => {
                                $scope.lstWard = resp.data.data;
                                var index = $scope.lstWard.findIndex(c => c.WardCode == $scope.address.wardCode);
                                $scope.ward = $scope.lstWard[index];
                            })
                            .catch(error => {
                                console.log(error);
                                $scope.isLoading = false;
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        $scope.isLoading = false;
                    })
            })
            .catch(error => {
                console.log(error);
            })

    }

    $scope.changeDivision = function (division) {
        try {
            $scope.messageDivision = '';
            $scope.lstDistrict = [];
            $scope.lstWard = [];
            $scope.address.divisionId = division.ProvinceID;
            $scope.address.divisionName = division.ProvinceName;

            $scope.address.districtId = '';
            $scope.address.districtName = '';
            $scope.address.wardName = '';
            $scope.address.wardCode = '';
            var data = {
                province_id: parseInt(division.ProvinceID)
            }

            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.lstDistrict = resp.data.data;
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })
        } catch (error) {

        }
    }

    $scope.changeDistrict = function (district) {
        if (district != null) {
            $scope.messageDistrict = '';
            $scope.lstWard = [];
            $scope.address.wardName = '';
            $scope.address.wardCode = '';
            $scope.address.districtId = district.DistrictID;
            $scope.address.districtName = district.DistrictName;
            var data = {
                district_id: parseInt(district.DistrictID)
            }

            $http.post(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, data, {
                headers: { 'token': 'd5ce5c1b-343d-11ed-b824-262f869eb1a7' }
            })
                .then(resp => {
                    $scope.lstWard = resp.data.data;
                })
                .catch(error => {
                    console.log(error);
                    $scope.isLoading = false;
                })
        }
    }

    $scope.changeWard = function (ward) {
        $scope.messageWard = '';
        if (ward != null) {
            $scope.address.wardName = ward.WardName;
            $scope.address.wardCode = ward.WardCode;
        }
        console.log($scope.address);
    }




    //Thông báo
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