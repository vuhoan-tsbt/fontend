app.controller('option-ctrl', function ($scope, $http) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }

    //get options
    $scope.option = {};
    $scope.options = [];
    $scope.optionStatusTrues = [];
    $scope.messageError = {};
    $scope.optionId = -1;
    $scope.index = -1;
    $scope.listValueCreate = [];

    //Page
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 10 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;

    $scope.txtSearchOption = '';


    const optionApi = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/options";

    const optionValuesApi = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/option-values";


    /**khởi tạo list option */
    $scope.isLoading = true;
    $scope.initializOption = function () {
        $http.get(`${optionApi}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.options = response.data;
                $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.isLoading = false;
            }).catch(function (error) {

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
            });
    }

    $scope.initializOption();

    /**reset lại data của option khi mở tab thêm mới */
    $scope.resetOption = function () {
        $scope.option = {
            status: 1,
            isShow: 1
        }
        $scope.optionId = -1;
        $scope.index = -1;
    }

    $scope.resetOption();

    /**reset lại data của option value khi mở tab thêm mới */
    $scope.resetOptionValue = function () {
        $scope.optionValue = {
            status: 1,
            options: null,
            isShow: 1,
            valueName: ''
        }

        $scope.optionValueCreate = {
            status: 1,
            options: null,
            isShow: 1,
            valueName: ''
        }
        $scope.valueId = -1;
        $scope.index = -1;
    }

    $scope.resetOptionValue();

    /**mở modal tạo mới option */
    $scope.activeCreateOpt = function () {
        $scope.show = 1;
        $scope.optionValues = [];
        $scope.listValueCreate = [];
        $scope.resetOption();
        $scope.resetOptionValue();
        $scope.messageError = {};
        $('#exampleModalCreateOpt').modal('show');
    }

    /**thêm mới 1 option */
    $scope.onAddOption = function () {
        $scope.isLoading = true;
        var data = {
            option: $scope.option,
            optionValues: $scope.listValueCreate
        }
        $http.post(`${optionApi}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $('#exampleModalCreateOpt').modal('hide');
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                $scope.isLoading = false;
                $scope.options.push(response.data);
                $scope.listPage = getListPaging($scope.options.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.resetOption();
                $scope.resetOptionValue();
                $scope.listValueCreate = [];
            }).catch(function (error) {
                toastMessage('', 'Thêm thất bại !', 'error');
                $scope.messageError = error.data;

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
            });
    }

    /**lấy thông tin của option */
    $scope.getOptionId = async function (id) {
        // document.getElementById("admin-id").style.opacity =await '0.5';
        // document.getElementById("exampleModalUpdateOpt").style.opacity = await'1 !import';
        // $scope.index = index;
        $scope.messageError = {};
        $scope.listValueCreate = [];
        $scope.resetOptionValue();
        $scope.show = 0;
        $scope.isLoading = true;
        $http.get(`${optionApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = false;
                $scope.option = angular.copy(response.data);
                $('#exampleModalUpdateOpt').modal('show');
            }).catch(function (error) {
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
            });


        //lấy thông tin optoin value của option hiện tại
        $scope.optionValues = [];
        $http.get(`${optionValuesApi}/find-by-option/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.optionValues = resp.data;
                $scope.isLoading = false;
            }).catch(error => {
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
            });
    }


    /**check điều kiện để xóa 1 option hoặc thay đổi trạng thái */
    $scope.checkDeleteOption = function (optionId) {
        $scope.isLoading = true;
        $http.get(`${optionApi}/check-delete-option/${optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.value) {
                    Swal.fire({
                        title: 'Bạn có chắc chắn xóa ?',
                        text: "",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.onDeleteOption(optionId);
                        }

                    });
                } else {
                    Swal.fire({
                        title: 'Bạn không thể xóa Option này \n Nếu xóa sẽ gây ra sai số liệu thống kê \n Chúng tôi hỗ trợ bạn chuyển trạng thái',
                        text: "Bạn có muốn chuyển trạng thái không ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var indexOp = $scope.options.findIndex(o => o.optionId == optionId);
                            console.log(indexOp);
                            $scope.option = angular.copy($scope.options[indexOp]);
                            $scope.option.status = 0;
                            $scope.onEditOption();
                        }

                    });
                }
            }).catch(function (error) {
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
            });
    }

    /**xác nhận thay đổi status của option */
    $scope.showConfirmOptionStatusChange = function (index) {
        $scope.optionTemp = angular.copy($scope.options[index]);
        // $scope.optionId = $scope.option.optionId;
        $scope.index = index;

        Swal.fire({
            title: '',
            text: "Bạn có chắc muốn thay đổi trạng thái ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.option = angular.copy($scope.options[index]);
                if ($scope.option.status === 1) {
                    $scope.option.status = 0;
                } else {
                    $scope.option.status = 1;
                }
                $scope.onEditOption();
                console.log($scope.option)
            }
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateOptionStatus(index);
            }
        })


    }

    /**khi cancel cập nhật trạng thái của option */
    $scope.noUpdateOptionStatus = function (index) {
        var optionId = angular.copy($scope.options[index].optionId);
        console.log(optionId);
        $scope.isLoading = true;
        $scope.initializOption();

    }

    /**xóa option */
    $scope.onDeleteOption = function (id) {
        $scope.isLoading = true;
        $http.delete(`${optionApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var index = $scope.options.findIndex(o => o.optionId == id);
                $scope.options.splice(index, 1);;
                if ($scope.currentPage > $scope.pageSize) { }
                $scope.listPage = getListPaging($scope.options.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.isLoading = false;
                toastMessage('', 'Xóa thành công !', 'success');
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
                toastMessage('', 'Xóa thất bại !', 'error');
            })
    }

    /**cập nhật option */
    $scope.onEditOption = async function () {
        $scope.isLoading = true;
        // console.log(document.getElementById('isShowUpdate').value);

        await $http.get(`${optionApi}/${$scope.option.optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {

            }).catch(error => {
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
            });
        console.log($scope.option.optionId);
        await $http.put(`${optionApi}/${$scope.option.optionId}`, $scope.option, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $('#exampleModalUpdateOpt').modal('hide');
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.isLoading = false;
                var index = $scope.options.findIndex(o => o.optionId == $scope.option.optionId);
                $scope.options[index] = angular.copy(response.data);
                $scope.messageError = {};
                $scope.resetOption();
            }).catch(error => {
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
                toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.messageError = error.data;
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /**tắt modal option */
    $scope.cancelOption = function () {
        $scope.option = {
            status: 1
        };
        $scope.optionId = -1
    }

    /**tìm kiếm option theo tên */
    $scope.searchOptionByName = async function (val) {
        $scope.isLoading = true;
        if (val === null || val === '') {
            $scope.initializOption();
        } else {
            $scope.options = await [];
            $scope.isLoading = true;
            await $http.get(`${optionApi}/find-by-approximate-name/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.options = resp.data;
                    $scope.pageCount = Math.ceil(resp.data.length / $scope.pageSize);
                    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
                    $scope.page = 1;
                    $scope.isLoading = false;
                }).catch(function (error) {
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
                    console.log(error);
                    $scope.isLoading = false;
                });
        }
    }


    //BUI_QUANG_HIEU

    /**lấy list option value */
    $scope.getOptionValue = function (option) {
        // console.log(option);
        $scope.optionValues = [];

        //close all collapse
        for (let index = 0; index < $scope.options.length; index++) {
            if ($scope.options[index].optionId != option.optionId) {
                $('#collapseOpt_' + $scope.options[index].optionId).collapse('hide');
            }
        }

        //if collapse open 
        $('#collapseOpt_' + option.optionId).on('shown.bs.collapse', function () {
            //load orderDetail'
            $scope.isLoading = true;
            $http.get(`${optionValuesApi}/find-by-option/${option.optionId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.optionValues = resp.data;
                    $scope.isLoading = false;
                }).catch(error => {
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
                    $scope.isLoading = false;
                    console.log(error);
                });
        });

    }

    /**mở modal thêm mới option value */
    $scope.showModalAddOv = async function (opt) {
        $('#exampleModalAddOv').modal('show');
        $scope.optionValue.options = await opt;
    }

    /**thêm option value */
    $scope.onAddOptionValue = async function () {
        var data = {
            listOptionValues: $scope.listValueCreate
        }
        $scope.isLoading = true;
        await $http.post(`${optionValuesApi}/create-list-option-value`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                // $('#exampleModalAddOv').modal('hide');
                $scope.listValueCreate = [];
                toastMessage('', 'Thêm thành công !', 'success');
                response.data.forEach(data => $scope.optionValues.push(data));
                $scope.messageError = {};
                $scope.resetOptionValue();
            }).catch(function (error) {
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
                toastMessage('', 'Thêm thất bại !', 'error');
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**thêm mới ov vào lst ov trong option */
    $scope.addOvToList = function (keyEvent, option) {
        if (keyEvent.which === 13) {
            var check = true;
            $scope.messageError = {};
            $scope.messageErrorValueName = '';
            if ($scope.optionValueCreate.valueName == '') {
                $scope.messageErrorValueName = 'Giá trị thuộc tính không được bỏ trống';
                return;
            }
            $scope.optionValueCreate.options = option;
            $scope.optionValueCreate.valueName = $scope.optionValueCreate.valueName.trim();
            for (let i = 0; i < $scope.listValueCreate.length; i++) {
                var ov = $scope.listValueCreate[i];
                if ($scope.optionValueCreate.valueName === ov.valueName) {
                    check = false;
                    $scope.messageErrorValueName = `Giá trị '${$scope.optionValueCreate.valueName}' đã có trong danh sách`
                    break;
                }
            }
            if (check) {
                $scope.listValueCreate.push($scope.optionValueCreate);
            }
            console.log($scope.listValueCreate);
            $scope.resetOptionValue();
        }
    }

    /**xóa ov trong lst ov của option */
    $scope.deleteOvInListCreate = function (index) {
        $scope.messageError = {};
        $scope.listValueCreate.splice(index, 1);
        $scope.messageErrorValueName = '';
    }



    /**kiểm tra xóa option value */
    $scope.checkDeleteOptionValue = function (valueId) {
        $scope.isLoading = true;
        $http.get(`${optionValuesApi}/check-delete-option-value/${valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = false;
                if (response.data.value) {
                    Swal.fire({
                        title: 'Bạn có chắc chắn xóa ?',
                        text: "Bạn có chắc chắn xóa ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, change it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.onDeleteOptionValue(valueId);
                        }

                    });
                } else {
                    Swal.fire({
                        title: 'Bạn không thể xóa giá trị này \n Nếu xóa sẽ gây ra sai số liệu thống kê \n Chúng tôi hỗ trợ bạn chuyển trạng thái',
                        text: "Bạn có muốn chuyển trạng thái không ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var indexOv = $scope.optionValues.findIndex(o => o.valueId == valueId);
                            $scope.optionValue = angular.copy($scope.optionValues[indexOv]);
                            $scope.optionValue.status = 0;
                            $scope.onEditOptionValue();
                        }

                    });
                }
            }).catch(function (error) {
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
            });
    };

    /**xóa ov */
    $scope.onDeleteOptionValue = function (id) {
        $scope.isLoading = true;
        $http.delete(`${optionValuesApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var index = $scope.optionValues.findIndex(o => o.valueId == id);
                $scope.optionValues.splice(index, 1);
                $scope.isLoading = false;
                toastMessage('', 'Xóa thành công !', 'success');
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
                $scope.isLoading = false;
                toastMessage('', 'Xóa thất bại !', 'error');
            })
    };

    /**lấy thông tin ov */
    $scope.getOptionValueId = async function (id) {
        // $scope.index = index;

        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.optionValue = angular.copy(response.data);
                $('#exampleModalUpdateOv').modal('show');
                // $scope.valueId = $scope.optionValue.valueId;
                // $('#option-value-crud-tab').tab('show');
            }).catch(function (error) {
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
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /**lấy thông tin ov v2 */
    $scope.getOptionValueIdV2 = async function (id) {
        // $scope.index = index;

        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.optionValue = angular.copy(response.data);
                $('#exampleModalUpdateOv').modal('show');
                $('#exampleModalUpdateOpt').modal('hide');
                // $scope.valueId = $scope.optionValue.valueId;
                // $('#option-value-crud-tab').tab('show');
            }).catch(function (error) {
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
            });
    }

    $scope.closeUpdateOptionValue = async function () {
        $('#exampleModalUpdateOv').modal('hide');
        $('#exampleModalUpdateOpt').modal('show');
    }

    $scope.onEditOptionValueV2 = async function () {
        // const editOptionValueApi = optionValuesApi + '/' + $scope.optionvalue.valueId;
        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${$scope.optionValue.valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
        await $http.put(`${optionValuesApi}/${$scope.optionValue.valueId}`, $scope.optionValue, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.isLoading = false;
                var index = $scope.optionValues.findIndex(o => o.valueId == response.data.valueId);
                $scope.optionValues[index] = angular.copy(response.data);
                $('#exampleModalUpdateOv').modal('hide');
                $('#exampleModalUpdateOpt').modal('show');
                // $('#option-value-list-tab').tab('show');
                $scope.resetOptionValue();
            }).catch(error => {
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
                toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.messageError = error.data;
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /**xác nhận thay đổi trạng thái ov */
    $scope.showConfirmOptionValueStatusChangeV2 = function (index) {
        $('#exampleModalUpdateOpt').modal('hide');
        $scope.optionValueTemp = angular.copy($scope.optionValues[index]);
        // $scope.optionId = $scope.option.optionId;
        $scope.index = index;

        Swal.fire({
            title: '',
            text: "Bạn có chắc muốn thay đổi trạng thái?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.optionValue = angular.copy($scope.optionValues[index]);
                if ($scope.optionValue.status == 1) {
                    $scope.optionValue.status = 0;
                } else {
                    $scope.optionValue.status = 1;
                }
                $scope.onEditOptionValueV2();
                console.log($scope.optionValue)
            }
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateOptionValueStatusV2(index);
            }
        })


    }

    /**cancel thay đổi trạng thái ov */
    $scope.noUpdateOptionValueStatusV2 = async function (index) {
        var valueId = await angular.copy($scope.optionValues[index].valueId);
        $('#exampleModalUpdateOpt').modal('show');
        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.optionValues[index] = angular.copy(resp.data);
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


    /**xác nhận xóa ov */
    $scope.checkDeleteOptionValueV2 = function (valueId) {
        $('#exampleModalUpdateOpt').modal('hide');
        $scope.isLoading = true;
        $http.get(`${optionValuesApi}/check-delete-option-value/${valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = false;
                if (response.data.value) {
                    Swal.fire({
                        title: '',
                        text: "Bạn có chắc chắn xóa ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.onDeleteOptionValueV2(valueId);
                        } else {
                            $('#exampleModalUpdateOpt').modal('show');
                        }

                    });
                } else {
                    Swal.fire({
                        title: 'Bạn không thể xóa giá trị này \n Nếu xóa sẽ gây ra sai số liệu thống kê \n Chúng tôi hỗ trợ bạn chuyển trạng thái',
                        text: "Bạn có muốn chuyển trạng thái không ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var indexOv = $scope.optionValues.findIndex(o => o.valueId == valueId);
                            $scope.optionValue = angular.copy($scope.optionValues[indexOv]);
                            $scope.optionValue.status = 0;
                            $scope.onEditOptionValueV2();
                        } else {
                            $('#exampleModalUpdateOpt').modal('show');
                        }

                    });
                }
            }).catch(function (error) {
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
            });
    };

    /**xóa ov v2 */
    $scope.onDeleteOptionValueV2 = function (id) {
        $scope.isLoading = true;
        $http.delete(`${optionValuesApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                var index = $scope.optionValues.findIndex(o => o.valueId == id);
                $scope.optionValues.splice(index, 1);
                $scope.isLoading = false;
                $('#exampleModalUpdateOpt').modal('show');
                toastMessage('', 'Xóa thành công !', 'success');
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
                toastMessage('', 'Xóa thất bại !', 'error');
            })
    };

    $scope.showOV = function () {
        if ($scope.show == 0) {
            $scope.show = 1;
        }
        else {
            $scope.show = 0;
        }
    }

    /**mở modal thêm mới ov */
    $scope.openModalAddOV = function () {
        $scope.messageError = {};
        $scope.optionValue = {
            status: 1,
            options: $scope.option,
            isShow: 1
        };
        $('#exampleModalUpdateOpt').modal('hide');
        $('#exampleModalAddOv').modal('show');
    }

    /**tắt modal thêm mới ov */
    $scope.closeModalAddOptionValue = function () {
        $('#exampleModalUpdateOpt').modal('show');
        $('#exampleModalAddOv').modal('hide');
    }

    /**xác nhận thay đổi ov status */
    $scope.showConfirmOptionValueStatusChange = function (index) {
        $scope.optionValueTemp = angular.copy($scope.optionValues[index]);
        // $scope.optionId = $scope.option.optionId;
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có muốn thay đổi không ?',
            // text: "Status will change!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.optionValue = angular.copy($scope.optionValues[index]);
                if ($scope.optionValue.status == 1) {
                    $scope.optionValue.status = 0;
                } else {
                    $scope.optionValue.status = 1;
                }
                $scope.onEditOptionValue();
                console.log($scope.optionValue)
            }
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateOptionValueStatus(index);
            }
        })


    }

    /**cancel thay đổi trạng thái ov */
    $scope.noUpdateOptionValueStatus = async function (index) {
        var valueId = await angular.copy($scope.optionValues[index].valueId);
        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.optionValues[index] = angular.copy(resp.data);
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



    /**Cập nhật ov */
    $scope.onEditOptionValue = async function () {
        // const editOptionValueApi = optionValuesApi + '/' + $scope.optionvalue.valueId;
        $scope.isLoading = true;
        await $http.get(`${optionValuesApi}/${$scope.optionValue.valueId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
        await $http.put(`${optionValuesApi}/${$scope.optionValue.valueId}`, $scope.optionValue, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.isLoading = false;
                var index = $scope.optionValues.findIndex(o => o.valueId == response.data.valueId);
                $scope.optionValues[index] = angular.copy(response.data);
                $('#exampleModalUpdateOv').modal('hide');
                // $('#option-value-list-tab').tab('show');
                $scope.resetOptionValue();
            }).catch(error => {
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
                toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.messageError = error.data;
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /**khởi tạo lại ov mới */
    $scope.cancelOptionValue = function () {
        $scope.optionvalue = {
            status: 1
        };
        $scope.valueId = -1
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

    function sweetMessage(heading, text, icon) {
        Swal.fire(
            heading,
            text,
            icon
        )
    }

    function sweetError(title) {
        Swal.fire(
            title,
            '',
            'error'
        )
    };


    /**Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change */
    $scope.repaginate = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.options.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.options.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
    }

    function totalPages(totalRecord, limit) {
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        return totalPage;
    }

    /**chọn trang */
    $scope.selectPage = function (page) {
        $scope.begin = (page - 1) * $scope.pageSize;
        $scope.currentPage = page;
    }

    /**trang kế tiếp */
    $scope.nextPage = function () {
        $scope.begin = ($scope.currentPage + 1 - 1) * $scope.pageSize;
        $scope.currentPage++;
    }

    /**trang trước */
    $scope.prevPage = function () {
        $scope.begin = ($scope.currentPage - 1 - 1) * $scope.pageSize;
        $scope.currentPage--;
    }

    $scope.nextListPage = function () {
        $scope.currentPage = $scope.endListPage + 1;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.options.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prevListPage = function () {
        $scope.currentPage = $scope.startListPage - $scope.pageInList;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.options.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
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
});

// Chỉ thị ép kiểu sang số nguyên khi người dùng thay đổi giá trị select
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

app.directive("select2", function ($timeout, $parse) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attrs) {
            console.log(attrs);
            $timeout(function () {
                element.select2();
                element.select2Initialized = true;
            });

            var refreshSelect = function () {
                if (!element.select2Initialized) return;
                $timeout(function () {
                    element.trigger('change');
                });
            };

            var recreateSelect = function () {
                if (!element.select2Initialized) return;
                $timeout(function () {
                    element.select2('destroy');
                    element.select2();
                });
            };

            scope.$watch(attrs.ngModel, refreshSelect);

            if (attrs.ngOptions) {
                var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
                // watch for option list change
                scope.$watch(list, recreateSelect);
            }

            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, refreshSelect);
            }
        }
    };
});