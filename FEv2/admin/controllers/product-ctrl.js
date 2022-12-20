app.controller('product-ctrl', function ($scope, $http, $rootScope) {

    /**getToken */
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Mời bạn đăng nhập !');
        return;
    }

    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));

    /**get options */
    $scope.option = {};
    $scope.options = [];
    $scope.optionId = -1;

    /**get products */
    $scope.product = {};
    $scope.products = [];
    $scope.productStatusTrues = [];
    $scope.messageError = {};
    $scope.productId = -1;
    $scope.index = -1;

    var productFirst = {};

    //Page pv
    $scope.beginPV = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSizePV = 5; // Hiển thị 10 thuộc tính
    $scope.currentPagePV = 1;
    $scope.pageInListPV = 5;


    //Page 
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 10 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;

    $scope.txtSearchProduct = '';

    const productApi = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/products";
    const producOptiontApi = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/product-options";
    const optionValueAPI = "http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/option-values";
    const productVariantAPI = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/product-variants';
    const variantValueApi = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/variant-values'
    const imageApi = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/image';
    const API_OPTION = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/options';
    const API_QR_CODE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/genarate-QRCode';
    const API_DOWNLOAD_EXCEL = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/excel';
    const API_SEND_MAIL = 'http://buiquanghieu.xyz/TestSendMail/get-all-file/product';
    const productOptionApi = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/product-options';

    $scope.isLoading = true;

    /**Khởi tạo */
    $scope.initializProduct = function () {
        $http.get(`${productApi}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                // console.log(response.data)
                $scope.products = response.data;
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

    $scope.initializProductStatusTrue = function () {
        $http.get(`${productApi}/by-status-true`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                productFirst = response.data[0];
                $scope.productStatusTrues = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
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
            });
    }

    $scope.tabCreatePV = function () {
        $scope.productVariant = {
            products: productFirst
        };


        setTimeout(() => {
            $scope.productOption = $scope.productOptionStatusTrues[0];
        }, 500)
        $scope.changeProductSelectedByProductVariant(productFirst);
        // $scope.initializProductOptionStatusTrue(productFirst.productId)
    }

    $scope.initializProduct();
    $scope.initializProductStatusTrue();

    $scope.resetProduct = function () {
        $scope.product = {
            productName: '',
            status: 1
        }
        $scope.productId = -1;
        $scope.index = -1;
    }

    $scope.resetProduct();

    /**mở modal tạo mới product */
    $scope.activeCreatePro = async function () {
        $scope.listPoCreate = [];
        $scope.show = 0;
        $scope.resetProduct();
        $scope.isLoading = true;
        await $http.get(`${API_OPTION}/by-status-true`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listOptionOrigin = resp.data;
                $scope.isLoading = false;
                $('#exampleModalCreatePro').modal('show');
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

    $scope.clickTabProductVariant = function () {
        $scope.initializProductVariant();
    }

    $scope.resetProductOption = function () {
        $scope.productOption = {
            status: 1,
            products: null,
            isSale: 0,
        }
        $scope.productOptionId = -1;
        $scope.index = -1;
    }

    // $scope.resetOptionValue();

    /**Mở modal tạo mới option */
    $scope.activeCreateOpt = function () {
        $('#exampleModalCreateOpt').modal('show');
    }

    //modal thêm mới opton vòa list product option
    $scope.showModalAddOptionToListPo = async function () {
        $('#showModalAddOptionToListPo').modal('show');
    }

    /**thêm mới option vào list product option */
    $scope.onAddOptionToListPo = function (option) {
        var po = {
            options: option
        };
        $scope.listPoCreate.push(po);
        var index = $scope.listOptionOrigin.findIndex(o => o.optionId == option.optionId);
        $scope.listOptionOrigin.splice(index, 1);
        $('#showModalAddOptionToListPo').modal('hide');
        console.log($scope.listPoCreate);
    }

    /**xóa option trong list pro op */
    $scope.deleteOpionToListPo = function (index, po) {
        $scope.listPoCreate.splice(index, 1);
        $scope.listOptionOrigin.push(po.options);
    }

    /** thêm mới pro */
    $scope.onAddProduct = function () {
        $scope.isLoading = true;
        var data = {
            product: $scope.product,
            productOptions: $scope.listPoCreate
        }
        $http.post(`${productApi}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $('#exampleModalCreatePro').modal('hide');
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                // const pro = response.data;
                $scope.isLoading = false;
                $scope.products.push(response.data);

                $scope.productStatusTrues.push(response.data);
                // $scope.productVariant.products = response.data;

                $scope.listPage = getListPaging($scope.products.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.resetProduct();
                // $scope.initializProductStatusTrue();
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

    /**xóa pro */
    $scope.deleteProduct = function (id) {
        $scope.isLoading = true;
        $http.get(`${productApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.product = angular.copy(response.data);
                // $scope.productId = $scope.product.prouductId;
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
        $http.get(`${productVariantAPI}/find-by-product/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                if (response.data.length > 0) {

                    Swal.fire({
                        title: 'Sản phẩm này không được phép xóa. Nếu xóa sẽ gây ra chức năng thống kê sai !\nChúng tôi hỗ trợ bạn chuyển đổi trạng thái',
                        text: "Bạn có muốn thay đổi trạng thái không ?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, change it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if ($scope.product.status == 1) {
                                $scope.product.status = 0;
                            }
                            $scope.onEditProduct();
                        }
                    })


                } else {

                    Swal.fire({
                        title: 'Bạn có chắc chắn xóa ?',
                        // text: "",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.isLoading = true;
                            $http.delete(`${productApi}/${id}`, {
                                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                            })
                                .then(function (response) {
                                    toastMessage('', 'Xóa thành công !', 'success');
                                    $scope.initializProduct();
                                    if ($scope.productVariant.products.productId == id) {
                                        $scope.listPvGenarate = [];
                                    }
                                    var index = $scope.productStatusTrues.findIndex(c => c.productId == id);
                                    $scope.productStatusTrues.splice(index, 1);
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
                                    toastMessage('', 'Xóa thất bại !', 'error');
                                    $scope.isLoading = false;
                                    console.log(error);
                                });
                        }
                    })


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

    /**lấy thông tin pro */
    $scope.getProductId = async function (id) {
        $scope.show = 0;
        $scope.productOptions = [];
        $scope.isLoading = true;
        await $http.get(`${productApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $('#collapseOp').collapse('hide')
                $scope.product = angular.copy(response.data);
                // $scope.productId = $scope.product.prouductId;
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
        try {
            $scope.productOptions = await $scope.loadOptionByProduct(id);
            $('#exampleModalUpdatePro').modal('show');
        } catch (error) {

        }
        console.log($scope.productOptions);
    }

    $scope.showPo = function () {
        if ($scope.show == 0) {
            $scope.show = 1;
        }
        else {
            $scope.show = 0;
        }
    }

    /**xóa pro op */
    $scope.deletePo = async function (value, index) {
        var check = false;
        $scope.isLoading = true;
        await $http.post(`${productOptionApi}/check-delete`, value, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                check = response.data.value;
                $('#exampleModalUpdatePro').modal('hide');
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
            });

        if (!check) {
            Swal.fire({
                title: 'Bạn không thể xóa thuộc tính này khỏi sản phẩm, sẽ gây ra thống kê sai lệnh \nChúng tôi hỗ trợ bạn thay đổi trạng thái',
                text: "Bạn có muốn thay đổi trạng thái không ?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, change it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.productOption = angular.copy($scope.productOptions[index]);
                    if ($scope.productOption.status == 1) {
                        $scope.productOption.status = 0;
                    } else {
                        $scope.productOption.status = 1;
                    }
                    $scope.onEditProductOption();
                    $scope.productOptions[index] = angular.copy($scope.productOption);
                    // console.log($scope.productOption)
                }
                $('#exampleModalUpdatePro').modal('show');
            });
        } else {
            Swal.fire({
                title: 'Bạn có chắc chắn xóa thuộc tính này khỏi sản phẩm ?',
                // text: "Bạn có muốn thay đổi trạng thái không ?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteProductOption(value, index);
                    if (value.products.productId == $scope.productVariant.products.productId) {
                        var index = $scope.optionProductVariantV2.lstOptionV2.findIndex(c => c.option.optionId == value.options.optionId);
                        $scope.optionProductVariantV2.lstOptionV2.splice(index, 1);
                    }
                }
                $('#exampleModalUpdatePro').modal('show');
            });
        }
    }

    /**xóa pro op */
    function deleteProductOption(value, index) {
        $scope.isLoading = true;
        $http.post(`${productOptionApi}/delete`, value, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                toastMessage('', 'Xóa thành công !', 'success');
                $scope.productOptions.splice(index, 1);
            }).catch(function (error) {
                $scope.isLoading = false;
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
                console.log(error);
            });
    }

    /**xác nhận thay đổi trạng thái pro */
    $scope.showConfirmProductStatusChange = function (index) {
        $scope.productTemp = angular.copy($scope.products[index]);
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có chắc chắn thay đổi trạng thái không ?',
            // text: "Status will change!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.isLoading = true;
                $http.get(`${productApi}/${$scope.productTemp.productId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        $scope.product = angular.copy($scope.products[index]);
                        if ($scope.product.status == 1) {
                            $scope.product.status = 0;
                        } else {
                            $scope.product.status = 1;
                        }
                        $scope.onEditProduct();
                        console.log($scope.product);
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
                    });


            }
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateProductStatus(index);
            }
        })


    }

    /**cancel update status pro */
    $scope.noUpdateProductStatus = function (index) {
        var productId = angular.copy($scope.products[index].productId);
        $scope.isLoading = true;
        $scope.initializProduct();

    }

    /**cập nhật pro */
    $scope.onEditProduct = function () {
        // const editProductApi = productApi + '/' + $scope.product.productId;
        $scope.isLoading = true;

        $http.get(`${productApi}/${$scope.product.productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $http.put(`${productApi}/${$scope.product.productId}`, $scope.product, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        $('#exampleModalUpdatePro').modal('hide');
                        toastMessage('', 'Cập nhật thành công !', 'success');
                        $scope.isLoading = false;
                        var index = $scope.products.findIndex(o => o.productId == $scope.product.productId);
                        $scope.products[index] = angular.copy(response.data);
                        $scope.messageError = {};
                        $scope.resetProduct();
                        $scope.initializProductStatusTrue();
                    }).catch(error => {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Cập nhật thất bại !', 'error');
                        $scope.messageError = error.data;
                        $scope.isLoading = false;
                        console.log(error);
                    });
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
                console.log(error);
            });
    }

    /**Khởi tạo lại product mới */
    $scope.cancelProduct = function () {
        $scope.product = {
            status: 1
        };
        $scope.productId = -1
    }

    /**tìm kiếm sản phẩm theo tên */
    $scope.searchProductByName = async function (val) {
        $scope.isLoading = true;
        if (val === null || val === '') {
            $scope.initializProduct();
        } else {
            $scope.products = await [];
            $scope.isLoading = true;
            await $http.get(`${productApi}/find-by-approximate-name/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.products = resp.data;
                    $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                    // $scope.pageCount = Math.ceil(resp.data.length / $scope.pageSize);
                    // $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
                    // $scope.page = 1;
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


    /**lấy thông tin pro op khi chọn pro */
    $scope.selectedProduct = async function (id) {
        $scope.isLoading = true;
        await $http.get(`${API_OPTION}/find-option-not-exists-product/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.options = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
                console.log(error);
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
            });
    }




    //get product option
    $scope.productOption = {};
    $scope.productOptions = [];
    $scope.productOptionStatusTrues = [];
    $scope.messageError = {};
    $scope.productOptionId = -1;
    $scope.index = -1;

    /**load option của pro */
    $scope.loadOptionByProduct = async function (productId) {
        var productOptions = [];
        $scope.isLoading = true;
        await $http.get(`${productOptionApi}/find-by-product/${productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                // console.log(response.data)
                productOptions = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
                console.log(error);
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
            });
        return productOptions;
    }

    /**khởi tạo pro op có status true */
    $scope.initializProductOptionStatusTrue = function (id) {
        $http.get(`${productOptionApi}/find-by-product-and-status-true/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptionStatusTrues = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
                console.log(error);
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
            });
    }

    /**modal thêm mới option */
    $scope.showModalAddOp = async function (pro) {
        console.log(pro);
        $('#exampleModalAddProOp').modal('show');
        $scope.selectedProduct(pro.productId);
        $scope.productOption.products = await pro;
    }

    /**modal thêm nhanh mới option */
    $scope.showModalQuickAddOp = async function (pro) {
        console.log(pro);
        if (isEmptyObject(pro)) {
            toastMessage('', 'Chưa chọn sản phẩm !', 'error');
            return;
        }
        $('#exampleModalAddQuickProOp').modal('show');
        $scope.selectedProduct(pro.productId);
        $scope.productOption.products = await pro;
    }

    /**khởi tạo lại pro op mới */
    $scope.resetProductOption = function () {
        $scope.productOption = {
            status: 1
        }
        $scope.productOptionId = -1;
        $scope.index = -1;
    }

    $scope.resetProductOption();

    /** thêm mới product option */
    $scope.onAddProductOption = async function () {

        $scope.isLoading = true;
        await $http.post(`${productOptionApi}`, $scope.productOption, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $('#exampleModalAddProOp').modal('hide');
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.productOptions.push(response.data);
                $scope.productOptionStatusTrues.push(response.data);
                if (response.data.products.productId == $scope.productVariant.products.productId) {
                    var item = {
                        option: response.data.options,
                        optionValues: []
                    }
                    $scope.optionProductVariantV2.lstOptionV2.push(item);
                }
                console.log(response.data);
                console.log($scope.optionProductVariantV2.lstOptionV2);
                $scope.messageError = {};
                $scope.resetProductOption();
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
                toastMessage('', 'Thêm thất bại !', 'error');
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /** thêm nhanh productoption */
    $scope.onAddQuickProductOption = async function () {

        $scope.isLoading = true;
        await $http.post(`${productOptionApi}`, $scope.productOption, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $('#exampleModalAddQuickProOp').modal('hide');
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.productOptions.push(response.data);
                $scope.productOptionStatusTrues.push(response.data);
                $scope.messageError = {};
                $scope.resetProductOption();
                var optionV2 = {
                    option: response.data.options,
                    optionValues: []
                }
                $scope.optionProductVariantV2.lstOptionV2.push(optionV2)
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
                toastMessage('', 'Thêm thất bại !', 'error');
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            });
    }

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

    $scope.show = 0;

    /**mở modal tạo mới option */
    $scope.quickAddOptionPV = function () {
        $scope.show = 1;
        $scope.optionValues = [];
        $scope.listValueCreate = [];
        $scope.resetOption();
        $scope.resetOptionValue();
        $scope.messageError = {};
        $('#exampleModalQuickCreateOptPV').modal('show');
    }

      /**mở modal tạo mới option */
      $scope.quickAddOptionP = function () {
        $scope.show = 1;
        $scope.optionValues = [];
        $scope.listValueCreate = [];
        $scope.resetOption();
        $scope.resetOptionValue();
        $scope.messageError = {};
        $('#exampleModalQuickCreateOptP').modal('show');
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

    /**thêm mới 1 option */
    $scope.onAddOptionPV = function () {
        $scope.isLoading = true;
        var data = {
            option: $scope.option,
            optionValues: $scope.listValueCreate
        }
        $http.post(`${API_OPTION}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $('#exampleModalQuickCreateOptPV').modal('hide');
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                $scope.isLoading = false;
                $scope.options.push(response.data);
                $scope.productOption.options = response.data;
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

     /**thêm mới 1 option */
     $scope.onAddOptionP = function () {
        $scope.isLoading = true;
        var data = {
            option: $scope.option,
            optionValues: $scope.listValueCreate
        }
        $http.post(`${API_OPTION}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $('#exampleModalQuickCreateOptP').modal('hide');
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                $scope.isLoading = false;
                // $scope.productOption.options = response.data;
                $scope.options.push(response.data);
                $scope.productOption.options = response.data;
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

    /**get thông tin product op */
    $scope.getProductOptionId = async function (index) {
        $scope.productOption = await angular.copy($scope.productOptions[index]);

        $scope.isLoading = true;
        await $http.get(`${variantValueApi}/find-by-product-option/${$scope.productOption.products.productId}/${$scope.productOption.options.optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length > 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'The Product Option has exist in Variant Value.'
                    })
                }
                else {

                    $scope.optionOld = $scope.productOption.options;
                    $scope.selectedProduct($scope.productOption.products.productId);
                    console.log($scope.productOptions[index]);
                    $('#exampleModalUpdateProOp').modal('show');
                }
            }).catch(function (error) {
                console.log(error);
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
            });


    }

    /**update option cua productoption */
    $scope.onEditOptionOfProductOption = async function () {
        var optionId = await angular.copy($scope.optionOld.optionId);
        var po = await angular.copy($scope.productOption)
        $scope.isLoading = true;
        await $http.put(`${productOptionApi}/${optionId}`, po, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.isLoading = false;
                // $scope.productOptions[$scope.index] = angular.copy(response.data);

                $('#exampleModalUpdateProOp').modal('hide');
                $scope.loadOptionByProduct(po.products.productId)
                $scope.resetProductOption();
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
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /**Confirm product Option statusChange */
    $scope.showConfirmProductOptionStatusChange = function (index) {
        $('#exampleModalUpdatePro').modal('hide');
        $scope.productOptionTemp = angular.copy($scope.productOptions[index]);
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có chắc chắn thay đổi trạng thái không ?',
            // text: "Status will change!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.productOption = angular.copy($scope.productOptions[index]);
                if ($scope.productOption.status == 1) {
                    $scope.productOption.status = 0;
                } else {
                    $scope.productOption.status = 1;
                }
                $scope.onEditProductOption();
                // console.log($scope.productOption)
            }
            else {
                $scope.noUpdateProductOptionStatus(index);
            }
            $('#exampleModalUpdatePro').modal('show');
        })
    }

    /**cancel xác nhận update status pro op */
    $scope.noUpdateProductOptionStatus = function (index) {
        var item = $scope.productOptions[index]
        $http.get(`${productOptionApi}/find-by-product/${item.products.productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptions = response.data;
                $scope.isLoading = false;
            }).catch(function (error) {
                console.log(error);
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
            });



        $scope.productOptions[index] = angular.copy(item);
        var productOptionId = angular.copy($scope.productOptions[index].productOptionId);

    }

    /**Cập nhật pro op */
    $scope.onEditProductOption = function () {
        // const editProductOptionApi = productApi + '/' + $scope.product.productId;
        $scope.isLoading = true;
        $http.put(`${productOptionApi}/update-status`, $scope.productOption, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.isLoading = false;
                $scope.productOptions[$scope.index] = angular.copy(response.data);
                // $('#product-option-list-tab').tab('show');
                $scope.resetProductOption();
                $scope.initializProductOptionStatusTrue(response.data.products.productId);
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
                $scope.isLoading = false;
                console.log(error);
            });
    }

    /** khởi tạo pro op mới */
    $scope.cancelProductOption = function () {
        $scope.productOption = {
            status: 1
        };
        $scope.productOptionId = -1
    }



    // Product Variant AND Variant Value

    $scope.productVariants = [];
    $scope.variantValues = [];
    $scope.productVariant = {};
    $scope.variantValue = {};

    //Page Product Variant
    $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSizeProductVariant = 5; // Hiển thị 5 thuộc tính
    $scope.pageProductVariant = 1;

    //reset Product Variant
    $scope.restProductVariant = async function () {
        $scope.productVariant = {
            quantity: 1,
            price: 0,
            isSale: 0
        };
    };
    $scope.restProductVariant();




    /**khởi tạo list pro var */
    $scope.initializProductVariant = async function () {
        $scope.isLoading = true;
        await $http.get(`${productVariantAPI}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                // console.log(response.data);
                $scope.productVariants = response.data;
                $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
                // $scope.pageCountProductVariant = Math.ceil($scope.productVariants.length / $scope.pageSizeProductVariant);
                // $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
                // $scope.pageProductVariant = 1;
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

        //GetVariantValueByProductVariant
        await $scope.productVariants.forEach(item => {
            var customName = '';
            $scope.isLoading = true;
            $http.get(`${variantValueApi}/find-by-product-variant/${item.variantId}`, {
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
                    $scope.isLoading = false;
                    console.log(error)
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                })
        });
    }


    /**xác nhận thay đổi trạng thái pro var */
    $scope.showConfirmProductVariantStatusChange = async function (index) {
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Trạng thái sẽ thay đổi!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.isLoading = true;
                $scope.productVariants[index].userEdit = $scope.userLogin;
                $http.put(`${productVariantAPI}/update-status/${$scope.productVariants[index].variantId}`, $scope.productVariants[index], {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        console.log(response.data);
                        $scope.productVariants[index] = response.data;
                        var customName = '';
                        $scope.isLoading = true;
                        $http.get(`${variantValueApi}/find-by-product-variant/${$scope.productVariants[index].variantId}`, {
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
                                var nameOld = $scope.productVariants[index].products.productName;
                                $scope.productVariants[index].products.productName = `${nameOld} [${customName}]`;
                                $scope.isLoading = false;
                            })

                            .catch(error => {
                                $scope.isLoading = false;
                                console.log(error)
                                if (error.status == 401) {
                                    $scope.isLoading = false;
                                    setTimeout(() => {
                                        document.location = '/admin#!/login';
                                    }, 2000);
                                    sweetError('Mời bạn đăng nhập !');
                                    return;
                                }
                            })
                        toastMessage('', 'Cập nhật thành công !', 'success');
                        $scope.isLoading = false;
                    }).catch(error => {
                        $scope.isLoading = false;
                        console.log(error);
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
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateProductVariantStatus(index);
            }
        })
    }

    /**cancel xác nhận thay đổi trạng thái pro var */
    $scope.noUpdateProductVariantStatus = function (index) {
        var productVariantId = angular.copy($scope.products[index].productId);
        $scope.isLoading = true;
        $scope.initializProductVariant();
    }

    /**cập nhật provar */
    $scope.onEditProductVariant = async function () {
        console.log($scope.productVariant);
        $scope.isLoading = true;
        await $http.put(`${productVariantAPI}/${$scope.productVariant.variantId}`, $scope.productVariant, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.isLoading = false;
                var index = $scope.productVariants.findIndex(o => o.variantId == $scope.productVariant.variantId);
                $scope.productVariants[index] = angular.copy(response.data);
                toastMessage('', 'Cập nhật thành công !', 'success');
                $scope.messageError = {};
                // $scope.resetProductVariant();
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

    /**get Thông tin pro var theo id */
    $scope.getProductVariantId = async function (id) {
        $scope.isLoading = true;
        $http.get(`${productVariantAPI}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.productVariant = angular.copy(response.data);
                // $scope.productId = $scope.product.prouductId;
                $('#exampleModalUpdateProVar').modal('show');
            }).catch(function (error) {
                console.log(error);
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
            });
    }


    $scope.variantImages = [];
    $scope.variantImage = {};
    $scope.variantImagePaths = [];

    /**lấy image của pro var */
    $scope.imageProductVariant = async function (id) {
        $scope.isLoading = true;
        //lay ra gia tri productVariant
        $http.get(`${productVariantAPI}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.productVariant = angular.copy(response.data);
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
        //lay ra image cua productVariant
        $http.get(`${imageApi}/find-by-product/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.variantImages = angular.copy(response.data);
                console.log(response.data);
                if ($scope.variantImages.length == 0) {
                    $scope.imageLength = 0;
                } else {
                    $scope.imageLength = 1;
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
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**Lấy list ảnh từ server */
    $scope.getListImageServer = async function () {

        // $http.get(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/get-all-file`)
        $http.get(`${API_SEND_MAIL}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.fileName = resp.data;
                $('#exampleModalAddImageProVar').modal('show');
                $('#exampleModalDetailProVar').modal('hide');
                $('#modalUploadImageList').modal('hide');
                $(document).ready(function () {
                    $scope.fileName.forEach(f => {
                        document.getElementById("checkbox" + f).checked = false;
                        $scope.variantImages.forEach(v => {
                            if (f == v.imagePath) {
                                document.getElementById("checkbox" + f).checked = true;
                            }
                        });
                    });
                });
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
                console.log(error);
                $scope.isLoading = false;
            });
        // console.log($scope.productVariant);
    }

    /**Thêm mới ảnh */
    $scope.addImage = async function (name) {
        $('#exampleModalAddImageProVar').modal('hide');
        $scope.variantImage = {
            imagePath: name,
            productVariants: $scope.productVariant,
            status: 1
        };
        console.log($scope.variantImage);
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Ảnh ${name} sẽ được thêm vào sản phẩm này?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $http.post(imageApi, $scope.variantImage, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        $('#exampleModalAddImageProVar').modal('hide');
                        $scope.isLoading = false;
                        toastMessage('', 'Thêm thành công !', 'success');
                        $scope.messageError = {};
                        // const pro = response.data;
                        $scope.isLoading = false;
                        $scope.imageProductVariant($scope.productVariant.variantId);
                        $('#exampleModalDetailProVar').modal('show');
                    }).catch(function (error) {
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                        toastMessage('', 'Thêm thất bại !', 'error');
                        $scope.messageError = error.data;
                        console.log(error);
                        $scope.isLoading = false;
                    });
            } else {
                $('#exampleModalAddImageProVar').modal('show');
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.productVariant = {
        products: {},
        skuId: '',
        quantity: 1,
        price: 10000,
        status: 1
    };
    $scope.count = 0


    $scope.variantValueOnAdds = [];
    $scope.variantValueOnAdd = {};

    /**thay đổi product khi tạo pro var */
    $scope.changeProductSelectedByProductVariant = function (product) {
        $scope.variantValueOnAdds = [];
        $scope.variantValueOnAdd = {};

        $scope.messageProductVariant = '';
        $scope.checkProductVariant = 1;

        $scope.optionProductVariantV2 = {
            lstOptionV2: [],
            optionV2: {
                option: {},
                optionValues: []
            }
        };
        $scope.isLoading = true;
        if (product != null) {
            $scope.initializProductOptionStatusTrue(product.productId);

            $http.get(`${producOptiontApi}/find-by-product/${product.productId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    console.log(resp.data);
                    $scope.isLoading = false;
                    $scope.productOptions = resp.data;
                    $scope.productVariant.skuId = '';

                    resp.data.forEach(po => {
                        var optionV2 = {
                            option: po.options,
                            optionValues: []
                        }
                        $scope.optionProductVariantV2.lstOptionV2.push(optionV2)
                    });
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
                    console.log(error);
                });
        }
    }

    /**Mở modal add variant value */
    $scope.activeModalAddVariantValue = function () {
        $('#modalAddVariantValue').modal('show');
        // console.log($scope.variantValue.options);
    }

    /**thay đổi option */
    $scope.changeOptionByVariantValue = function (productOption) {
        if (productOption == null || productOption == undefined || productOption == '') {
            $scope.lstOptionValue = [];
            return;
        }
        $scope.variantValueOnAdd.productOptions = productOption;
        $scope.isLoading = true;
        // $http.get(`${optionValueAPI}/find-not-exists-variant-value/${productOption.products.productId}/${productOption.options.optionId}`)
        $http.get(`${optionValueAPI}/find-option-value-true-by-option/${productOption.options.optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.lstOptionValue = resp.data;
                $scope.isLoading = false;

                $scope.checkOption = 1;
                $scope.checkOptionValue = 0;
                $scope.messageOption = '';

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
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**thay đổi vv */
    $scope.changeVariantValue = function () {
        $scope.messageOpValue = '';
    }

    $scope.checkOption = 0;

    //**thêm mới vv */
    $scope.onAddVarintValue = function (optionValue) {
        $scope.messageOption = '';
        $scope.check = 0;
        console.log(optionValue);
        if ($scope.checkOption == 0) {
            $scope.messageOption = 'Chưa chọn Option';
            $scope.check = 1;
        }
        if (optionValue == undefined) {
            $scope.messageOpValue = 'Chưa chọn Option Value';
            $scope.check = 1;
        }

        if ($scope.check == 1) {
            return;
        }
        $scope.messageOptionValue = '';
        $scope.messageOpValue = '';


        var SKUID = '';
        var index = $scope.productOptionStatusTrues.findIndex(pv => pv.options.optionId == $scope.variantValueOnAdd.productOptions.options.optionId);
        $scope.productOptionStatusTrues.splice(index, 1);
        $scope.variantValueOnAdd.optionValues = angular.copy(optionValue);

        $scope.variantValueOnAdds.push($scope.variantValueOnAdd);
        $scope.variantValueOnAdd = {};

        $scope.variantValueOnAdds = $scope.variantValueOnAdds.sort((a, b) => (a.productOptions.options.optionId > b.productOptions.options.optionId) ? 1 : -1);
        for (let index = 0; index < $scope.variantValueOnAdds.length; index++) {
            SKUID += removeVietnameseTones($scope.variantValueOnAdds[index].productOptions.options.optionName.slice(0, 3) +
                $scope.variantValueOnAdds[index].optionValues.valueName.slice(0, 3));

        }
        console.log('SKU-' + SKUID);
        $scope.productVariant.skuId = 'SKU-' + SKUID;
        // console.log($scope.variantValues);
        $('#modalAddVariantValue').modal('hide');

    }

    /**xóa vv */
    $scope.onDelVariantValue = function (productOption) {
        $scope.productOptionStatusTrues.push(productOption);
        var index = $scope.variantValueOnAdds.findIndex(vv => vv.productOptions.options.optionId == productOption.options.optionId);
        $scope.variantValueOnAdds.splice(index, 1);

    }

    /**lấy lst vv của pro var */

    $scope.getVariantValue = function (productVariant) {
        $scope.variantValues = [];
        //close all collapse
        for (let index = 0; index < $scope.productVariants.length; index++) {
            if ($scope.productVariants[index].variantId != productVariant.variantId) {
                $('#collapseProVar_' + $scope.productVariants[index].variantId).collapse('hide');
            }
        }
        //if collapse open 
        $('#collapseProVar_' + productVariant.variantId).on('shown.bs.collapse', function () {
            console.log(productVariant.variantId);
            //load productOption'
            // $scope.loadVariantValueByProductVariant(productVariant.variantId);
            $scope.isLoading = true;
            $http.get(`${variantValueApi}/find-by-product-variant/${productVariant.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(function (response) {
                    console.log(response.data)
                    $scope.variantValues = response.data;
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

    /** xác nhận thay đổi trạng thái của vv */
    $scope.showConfirmVariantValueStatusChange = function (index) {
        $scope.variantValueTemp = angular.copy($scope.variantValues[index]);
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Trạng thái sẽ được thay đổi!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.variantValue = angular.copy($scope.variantValues[index]);
                if ($scope.variantValue.status == 1) {
                    $scope.variantValue.status = 0;
                } else {
                    $scope.variantValue.status = 1;
                }
                $scope.onEditVariantValue();
                // console.log($scope.productOption)
            }
            else {
                $scope.noUpdateVariantValueStatus(index);
            }

        })


    }

    /**cancel xác nhận thay đổi trạng thái vv */
    $scope.noUpdateVariantValueStatus = function (index) {
        var item = $scope.variantValues[index]
        $http.get(`${variantValueApi}/find-by-product-variant/${item.productVariants.variantId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.variantValues = response.data;
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



        $scope.variantValues[index] = angular.copy(item);

    }


    /**cập nhật trạng thái vv */
    $scope.onEditVariantValue = function () {
        // const editProductOptionApi = productApi + '/' + $scope.product.productId;
        console.log($scope.variantValue);
        $scope.isLoading = true;
        $http.put(`${variantValueApi}/update-status`, $scope.variantValue, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            // $http.put(`http://localhost:8080/PRO2111_FALL2022/admin/rest/variant-values/update-status`, $scope.variantValue)
            .then(function (response) {
                $scope.isLoading = false;
                console.log(response.data != null);
                if (response.data.length != 0) {
                    toastMessage('', 'Cập nhật thành công !', 'success');
                    $scope.variantValues[$scope.index] = angular.copy(response.data);
                } else {
                    if ($scope.variantValue.status == 0) {
                        $scope.variantValue.status = 1;
                    } else {
                        $scope.variantValue.status = 0;
                    }
                    toastMessage('', 'Không thể cập nhật, vì chi tiết sản phẩm này sau khi cập nhật sẽ trùng với chi tiết sản phẩm đã có !', 'error');
                    $scope.variantValues[$scope.index] = angular.copy($scope.variantValue);
                }
                // $scope.resetVariantValue();
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
                $scope.isLoading = false;
                console.log(error);
            });
    }



    //createProductVariant

    $scope.checkProductVariant = 0;
    /**tạo mới pro var */
    $scope.createProductVariant = async function (productVariant) {
        $scope.isLoading = true;
        $scope.messageQuantity = '';
        $scope.messagePrice = '';
        $scope.messageOptionValue = '';
        $scope.check = 0;

        console.log($scope.productVariant.quantity);
        if ($scope.productVariant.quantity == null || $scope.productVariant.quantity < 1) {
            $scope.messageQuantity = 'Phải lớn hơn 1';
            $scope.check = 1;
        }
        if ($scope.productVariant.price == null || $scope.productVariant.price < 10000) {
            $scope.messagePrice = 'Phải lớn hơn 10,000';
            $scope.check = 1;
        }
        if ($scope.checkProductVariant == 0) {
            $scope.messageProductVariant = "Chưa chọn sản phẩm";
            $scope.check = 1;
        }
        if ($scope.variantValueOnAdds.length == 0) {
            $scope.messageOptionValue = "Chưa chọn giá trị thuộc tính";
            $scope.check = 1;
        }
        if ($scope.check == 1) {
            $scope.isLoading = false;
            return;
        }

        var pvAndVv = {
            productVariant: productVariant,
            variantValues: $scope.variantValueOnAdds
        }
        console.log(pvAndVv)
        $scope.isLoading = true;
        await $http.post(`${productVariantAPI}/savePvAndVV`, pvAndVv, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data.length);
                if (resp.data.length != 0) {
                    $scope.isLoading = false;
                    $scope.initializProductVariant();
                    toastMessage('', 'Thêm mới thành công !', 'success');
                    $('#product-variant-list-tab').tab('show');

                    $scope.productVariant = {};
                    $scope.variantValueOnAdds = [];
                    $scope.checkProductVariant = 0;
                } else {
                    $scope.isLoading = false;
                    toastMessage('', 'Sản phẩm đã tồn tại !', 'error');
                }
                console.log('success')
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
                console.log(error);
                toastMessage('', 'Thêm mới thất bại !', 'error');
            })
    }

    /**check xem pro var đã tồn tại trong data hay chưa */
    $scope.checkExistsProductVariant = async function () {
        var countVV = 0;

        if ($scope.productVariantNew.products.productId != await null || $scope.productVariantNew.products.productId != await undefined) {
            await $http.get(`${productVariantAPI}/find-by-product/${$scope.productVariantNew.products.productId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    lstPVExists = resp.data;

                    lstPVExists.forEach(item => {
                        $http.get(`${variantValueApi}/find-by-product-variant/${item.variantId}`, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                console.log(resp.data);
                                lstVVByPV = resp.data;

                                console.log(lstVVByPV.length == $scope.variantValueOnAdds.length);
                                if (lstVVByPV.length == $scope.variantValueOnAdds.length) {
                                    var checkCondition = true;
                                    $scope.count = 0
                                    for (let i = 0; i < lstVVByPV.length; i++) {

                                        for (let j = 0; j < $scope.variantValueOnAdds.length; j++) {
                                            if (lstVVByPV[i].optionValues.valueId == $scope.variantValueOnAdds[j].optionValues.valueId) {
                                                checkCondition = false;
                                                $scope.count++;
                                            }

                                        }

                                    }
                                    console.log($scope.count);
                                    console.log(lstVVByPV.length);
                                    if ($scope.count != lstVVByPV.length) {

                                        $scope.addProductVariant();
                                        $scope.count = 0;

                                        return;
                                    }
                                    else {
                                        // toastMessage('', 'Sản phẩm đã tồn tạiqq !', 'success');
                                        toastMessage('', 'Sản phẩm đã tồn tại !', 'error');
                                        return;
                                    }
                                }
                                else {
                                    // toastMessage('', 'Sản phẩm đã tồn tại11 !', 'success');                       
                                    $scope.addProductVariant();
                                }
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
                            })
                    });

                })
                .catch(error => {
                    console.log(error)
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                })
        }


    }

    /**tim kiem Product Variant theo name */
    $scope.searchProductVariantByName = async function (val) {
        $scope.isLoading = true;
        if (val === null || val === '') {
            $scope.initializProductVariant();
        } else {
            $scope.productVariants = await [];
            await $http.get(`${productVariantAPI}/dynamic-search-by-key/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.productVariants = resp.data;
                    $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
                    // $scope.pageCountProductVariant = Math.ceil(resp.data.length / $scope.pageSizeProductVariant);
                    // $scope.beginProductVariant = 0; // hiển thị thuộc tính bắt đầu từ 0
                    // $scope.pageProductVariant = 1;
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
            await $scope.productVariants.forEach(item => {
                var customName = '';
                $scope.isLoading = true;
                $http.get(`${variantValueApi}/find-by-product-variant/${item.variantId}`, {
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
                        $scope.isLoading = false;
                        console.log(error)
                        if (error.status == 401) {
                            $scope.isLoading = false;
                            setTimeout(() => {
                                document.location = '/admin#!/login';
                            }, 2000);
                            sweetError('Mời bạn đăng nhập !');
                            return;
                        }
                    })
            });
        }
    }

    /**thêm mới pro var */
    $scope.addProductVariant = async function () {
        await $http.post(`${productVariantAPI}`, $scope.productVariant, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                // $scope.initializProductVariant();
                $scope.messageError = {};
                $scope.variantValueOnAdds.forEach(vv => {
                    vv.productVariants = angular.copy(response.data);
                    console.log(vv.productVariants);
                    $scope.addVariantValue(vv);
                })
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
                console.log(error);
                $scope.messageError = error.data;
                $scope.isLoading = false;
            });
    }

    /**thêm mới vv */
    $scope.addVariantValue = async function (variantValue) {
        $scope.isLoading = true;
        await $http.post(`${variantValueApi}`, variantValue, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                // toastMessage('', 'Thêm thành công !', 'success');
                $scope.initializProductVariant();
                $('#product-variant-list-tab').modal('show');
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
                console.log(error);
                $scope.isLoading = false;
            });


    }

    /**get list vv v2 */
    $scope.getVariantValueV2 = function (productVariant) {
        $scope.variantValues = [];
        //close all collapse
        for (let index = 0; index < $scope.productVariants.length; index++) {
            if ($scope.productVariants[index].variantId != productVariant.variantId) {
                $('#collapseProVar_' + $scope.productVariants[index].variantId).collapse('hide');
            }
        }
        //if collapse open 
        $('#collapseProVar_' + productVariant.variantId).on('shown.bs.collapse', function () {
            console.log(productVariant.variantId);
            //load productOption'
            // $scope.loadVariantValueByProductVariant(productVariant.variantId);
            $scope.isLoading = true;
            $http.get(`${variantValueApi}/find-by-product-variant/${productVariant.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(function (response) {
                    console.log(response.data)
                    $scope.variantValues = response.data;
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

    var config = {
        responseType: "blob",
        transformResponse: jsonBufferToObject,
    };

    function jsonBufferToObject(data, headersGetter, status) {
        var type = headersGetter("Content-Type");
        if (!type.startsWith("application/json")) {
            return data;
        };
        var decoder = new TextDecoder("utf-8");
        var domString = decoder.decode(data);
        var json = JSON.parse(domString);
        return json;
    };

    /**mở modal chi tiết pro var */
    $scope.openModalDetailProductVariant = async function (id) {
        $scope.isLoading = true;
        $scope.oldVariantValues = [];
        $scope.show = 0;
        await $http.get(`${productVariantAPI}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $http.get(`${API_QR_CODE}/product-variant/${id}`, { headers: { 'Authorization': 'Bearer ' + $scope.authToken }, responseType: 'blob' })
                    .then(qrCode => {
                        var blob = qrCode.data;
                        var contentType = response.headers("content-type");
                        var fileURL = URL.createObjectURL(blob);
                        response.data.qrCode = fileURL;
                        $scope.productVariant = angular.copy(response.data);
                        $scope.productVariantOnAddVV = angular.copy(response.data);
                        $scope.isLoading = false;
                        $('#exampleModalDetailProVar').modal('show');
                    })
                    .catch(error => {
                        $scope.isLoading = false;
                        console.log(error);
                    })
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
        await $http.get(`${productVariantAPI}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.productVariant = angular.copy(response.data);
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
        //lay ra image cua productVariant
        await $http.get(`${imageApi}/find-by-product/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.variantImages = angular.copy(response.data);
                console.log(response.data);
                if ($scope.variantImages.length == 0) {
                    $scope.imageLength = 0;
                } else {
                    $scope.imageLength = 1;
                }
                // $scope.productId = $scope.product.prouductId;
                // $('#exampleModalUpdateProVar').modal('show');
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

        //get variantvalue
        await $http.get(`${variantValueApi}/find-by-product-variant-origin/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.variantValues = response.data;
                $scope.oldVariantValues = angular.copy(response.data);
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

        //get productOption status true
        await $http.get(`${productOptionApi}/find-by-product-and-status-true/${$scope.productVariant.products.productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptionStatusTrues = response.data;
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

    $scope.closeImagesServer = function () {
        $('#exampleModalDetailProVar').modal('show');
    }

    $scope.showVV = function () {
        if ($scope.show == 0) {
            $scope.show = 1;
        }
        else if ($scope.show == 1) {
            $scope.show = 0;
        }
    }

    /**mở modal xóa ảnh */
    $scope.openModalDeleteImage = function (imagePath) {
        $('#exampleModalDeleteImage').modal('show');
        $('#exampleModalDetailProVar').modal('hide');
        $scope.imagePath = imagePath;
    }

    /**xóa ảnh */
    $scope.deleteImage = function () {
        $scope.isLoading = true;
        $http.delete(`${imageApi}/${$scope.imagePath.imagesId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                var index = $scope.variantImages.findIndex(c => c == $scope.imagePath);
                $scope.variantImages.splice(index, 1);
                toastMessage('', "Xóa ảnh thành công!", 'success');
                $('#exampleModalDetailProVar').modal('show');
                $('#exampleModalDeleteImage').modal('hide');
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
            })
    }

    /**đóng modal xóa ảnh */
    $scope.closeModalDeleteImage = function () {
        $('#exampleModalDeleteImage').modal('hide');
        $('#exampleModalDetailProVar').modal('show');
    }

    /**mở modal thêm vv */
    $scope.openModalAddVV = function () {
        console.log($scope.productVariant);
        $scope.messageOption = '';
        $scope.messageOpValue = '';
        $scope.initializProductOptionStatusTrueInDetailPV($scope.productVariant.products.productId);
        $('#modalAddVariantValue').modal('show');
        $('#exampleModalDetailProVar').modal('hide');
    }

    /**đóng modal thêm mới vv */
    $scope.closeModalAddVariantValue = function () {
        $('#modalAddVariantValue').modal('hide');
        $('#exampleModalDetailProVar').modal('show');
    }

    /**thay đổi pro op */
    $scope.changeProductOption = async function (productOption) {
        $http.get(`${optionValueAPI}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptionStatusTrues = response.data;
                $scope.variantValues.forEach(v => {
                    var index = $scope.productOptionStatusTrues.findIndex(c => c.options.optionId == v.productOptions.options.optionId);
                    $scope.productOptionStatusTrues.splice(index, 1);
                });
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

    /**khởi tạo list pro op status true trong pv */
    $scope.initializProductOptionStatusTrueInDetailPV = function (id) {
        console.log($scope.variantValues);
        $http.get(`${productOptionApi}/find-by-product-and-status-true/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptionStatusTrues = response.data;
                $scope.variantValues.forEach(v => {
                    console.log(v.productOptions.options.optionId);
                    var index = $scope.productOptionStatusTrues.findIndex(c => c.options.optionId == v.productOptions.options.optionId);
                    $scope.productOptionStatusTrues.splice(index, 1);
                });
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

    /**thêm mới vv v2 */
    $scope.onAddVarintValueV2 = function (productOption, optionValue) {
        $scope.messageOption = '';
        $scope.messageOpValue = '';
        $scope.check = 0;
        console.log(optionValue);
        if ($scope.checkOption == 0) {
            $scope.messageOption = 'Chưa chọn Option';
            $scope.check = 1;
        }
        if (optionValue == undefined) {
            $scope.messageOpValue = 'Chưa chọn Option Value';
            $scope.check = 1;
        }

        if ($scope.check == 1) {
            return;
        }
        $scope.messageOptionValue = '';
        $scope.messageOpValue = '';

        console.log(productOption);
        var data = {
            productOptions: productOption,
            productVariants: $scope.productVariant,
            optionValues: optionValue,
            status: 1
        }
        console.log(data);
        $scope.variantValues.push(angular.copy(data));
        console.log($scope.variantValues);
        $('#modalAddVariantValue').modal('hide');
        $('#exampleModalDetailProVar').modal('show');

    }

    /**mở modal update vv */
    $scope.openModalUpdateVariantValue = function (index, varVal) {
        console.log(varVal);
        $scope.varValUpdate = varVal;
        $scope.index = index;
        $scope.messageOption = '';
        $scope.messageOpValue = '';
        $http.get(`${productOptionApi}/find-by-product-and-status-true/${varVal.productVariants.products.productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.productOptionStatusTrues = angular.copy(response.data);
                $scope.variantValues.forEach(v => {
                    if ($scope.varValUpdate.productOptions.options.optionId != v.productOptions.options.optionId) {
                        var index = $scope.productOptionStatusTrues.findIndex(c => c.options.optionId == v.productOptions.options.optionId);
                        $scope.productOptionStatusTrues.splice(index, 1);
                    }
                });
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

        $http.get(`${optionValueAPI}/find-option-value-true-by-option/${varVal.productOptions.options.optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data)
                $scope.lstOptionValue = angular.copy(response.data);
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
        $('#modalUpdateVariantValue').modal('show');
        $('#exampleModalDetailProVar').modal('hide');
    }

    /**cập nhật vv v2 */
    $scope.onUpdateVarintValueV2 = function () {
        console.log($scope.varValUpdate);
        $scope.messageOption = '';
        $scope.check = 0;
        if ($scope.varValUpdate.productOptions == 0) {
            $scope.messageOption = 'Chưa chọn Option';
            $scope.check = 1;
        }
        if ($scope.varValUpdate.optionValues == null) {
            $scope.messageOpValue = 'Chưa chọn Option Value';
            $scope.check = 1;
        }

        if ($scope.check == 1) {
            return;
        }
        $scope.variantValues[$scope.index] = angular.copy($scope.varValUpdate);
        console.log($scope.variantValues);
        $('#modalUpdateVariantValue').modal('hide');
        $('#exampleModalDetailProVar').modal('show');
    }

    /**cập nhật pro var v2 */
    $scope.onEditProductVariantV2 = async function () {
        $scope.productVariant.userEdit = $scope.userLogin;
        console.log($scope.productVariant);
        $scope.isLoading = true;
        var check = 0;
        await $http.get(`${productVariantAPI}/find-by-product/${$scope.productVariant.products.productId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        }).then(resp => {
            console.log(resp.data);
            $scope.lstPVExists = resp.data;

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

        console.log($scope.lstPVExists);
        console.log($scope.variantValues);
        console.log($scope.oldVariantValues);

        var countOldVV = 0;
        if ($scope.oldVariantValues.length == $scope.variantValues.length) {
            for (let i = 0; i < $scope.oldVariantValues.length; i++) {
                for (let j = 0; j < $scope.variantValues.length; j++) {
                    if ($scope.oldVariantValues[i].optionValues.valueId == $scope.variantValues[j].optionValues.valueId) {
                        countOldVV++;
                    }
                }

            }
        }

        console.log(countOldVV);
        console.log($scope.oldVariantValues.length);
        if (countOldVV == $scope.oldVariantValues.length) {
            check = 0;
        } else {

            await $scope.lstPVExists.forEach(item => {
                $http.get(`${variantValueApi}/find-by-product-variant-origin/${item.variantId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        console.log(resp.data);
                        var lstVV = resp.data;

                        if ($scope.variantValues.length == lstVV.length) {
                            var countSimilarVV = 0;
                            for (let i = 0; i < lstVV.length; i++) {
                                for (let j = 0; j < $scope.variantValues.length; j++) {
                                    if (lstVV[i].optionValues.valueId == $scope.variantValues[j].optionValues.valueId) {
                                        countSimilarVV++;
                                    }

                                }
                            }
                        }
                        console.log(countSimilarVV);
                        if (countSimilarVV == $scope.variantValues.length) {
                            // toastMessage('', 'Sản phẩm đã tồn tại !', 'warning');
                            check = 1;
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
                        $scope.isLoading = false;
                        console.log(error);
                    })
            });
            $scope.isLoading = false;
        }
        $scope.isLoading = true;
        setTimeout(() => {
            console.log(check);
            if (check == 1) {
                toastMessage('', 'Thuộc tính của sản phẩm đã tồn tại ở sản phẩm khác', 'warning')
                $scope.isLoading = false;
                return;
            }
            console.log($scope.productVariant);
            var data = {
                productVariant: $scope.productVariant,
                variantValues: $scope.variantValues
            }
            $http.put(`${productVariantAPI}/${$scope.productVariant.variantId}`, data, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(function (response) {
                    console.log(response.data)
                    // $scope.isLoading = false;

                    $http.get(`${variantValueApi}/find-by-product-variant/${response.data.variantId}`, {
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
                            var nameOld = response.data.products.productName;
                            response.data.products.productName = `${nameOld} [${customName}]`;
                            console.log(response.data.products.productName);
                            var index = $scope.productVariants.findIndex(o => o.variantId == $scope.productVariant.variantId);
                            $scope.productVariants[index] = angular.copy(response.data);
                            // $('#exampleModalUpdateProVar').modal('hide');
                            $('#exampleModalDetailProVar').modal('hide');
                            toastMessage('', 'Cập nhật thành công !', 'success');
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

                    $scope.messageError = {};
                    // $scope.resetProductVariant();
                }).catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    toastMessage('', 'Cập nhật thất bại !', 'error');
                    $scope.messageError = error.data;
                    $scope.isLoading = false;
                    console.log(error);
                    console.log($scope.messageError);
                });
        }, 1000);

    }

    /**mở modal xóa vv */
    $scope.showModalDeleteVariantValue = function (index) {
        if ($scope.variantValues.length == 1) {
            toastMessage('', 'Sản phẩm phải có ít nhất có 1 thuộc tính !', 'warning');
            return;
        }
        $scope.index = index;
        $('#exampleModalDeleteVariantValues').modal('show');
        $('#exampleModalDetailProVar').modal('hide');
    }

    /**xóa vv */
    $scope.deleteVariantValues = function () {
        $scope.variantValues.splice($scope.index, 1);
        toastMessage('', "Xóa thành công!", 'success');
        $('#exampleModalDeleteVariantValues').modal('hide');
        $('#exampleModalDetailProVar').modal('show');
    }


    /**thêm nhanh product */
    $scope.quickAddProduct = async function () {
        $scope.listPoCreate = [];
        $scope.show = 0;
        $scope.resetProduct();
        $scope.isLoading = true;
        await $http.get(`${API_OPTION}/by-status-true`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listOptionOrigin = resp.data;
                $scope.isLoading = false;
                $('#exampleModalQuickAddPro').modal('show');
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

    /**mở modal thêm nhanh option vào list po */
    $scope.showModalQuickAddOptionToListPo = async function () {
        $('#showModalQuickAddOptionToListPo').modal('show');
    }


    /**thêm nhanh pro  */
    $scope.onAddQuickProduct = function () {
        $scope.isLoading = true;
        var data = {
            product: $scope.product,
            productOptions: $scope.listPoCreate
        }
        $http.post(`${productApi}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                // const pro = response.data;
                $scope.products.push(response.data);
                $scope.productStatusTrues.push(response.data);
                $scope.productVariant.products = response.data;
                $scope.changeProductSelectedByProductVariant($scope.productVariant.products);

                $scope.listPage = getListPaging($scope.products.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                $scope.resetProduct();
                $('#exampleModalQuickAddPro').modal('hide');
                $scope.isLoading = false;
                $scope.initializProductStatusTrue();
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




    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
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


    function sweetSucess(title) {
        Swal.fire(
            title,
            '',
            'success'
        )
    }

    function sweetError(title) {
        Swal.fire(
            title,
            '',
            'error'
        )
    }

    /** Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change */
    $scope.repaginate = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.products.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.products.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
    }

    function totalPages(totalRecord, limit) {
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        return totalPage;
    }

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
        $scope.listPage = getListPaging($scope.products.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prevListPage = function () {
        $scope.currentPage = $scope.startListPage - $scope.pageInList;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.products.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
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

    /** Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change pv */
    $scope.repaginateProductVariant = function (value) {
        $scope.pageSizePV = value;
        var totalPage = totalPagesPV($scope.productVariants.length, $scope.pageSizePV);
        if ($scope.currentPagePV > totalPage) {
            $scope.currentPagePV = totalPage;
        }
        $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
        $scope.beginPV = ($scope.currentPagePV - 1) * $scope.pageSizePV;
    }

    function totalPagesPV(totalRecord, limit) {
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        return totalPage;
    }

    //selectPage
    $scope.selectPagePV = function (page) {
        $scope.beginPV = (page - 1) * $scope.pageSizePV;
        $scope.currentPagePV = page;
    }

    //nextPage
    $scope.nextPagePV = function () {
        $scope.beginPV = ($scope.currentPagePV + 1 - 1) * $scope.pageSizePV;
        $scope.currentPagePV++;
    }

    $scope.prevPagePV = function () {
        $scope.beginPV = ($scope.currentPagePV - 1 - 1) * $scope.pageSizePV;
        $scope.currentPagePV--;
    }

    $scope.nextListPagePV = function () {
        $scope.currentPagePV = $scope.endListPagePV + 1;
        $scope.beginPV = ($scope.currentPagePV - 1) * $scope.pageSizePV;
        $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
    }

    $scope.prevListPagePV = function () {
        $scope.currentPagePV = $scope.startListPagePV - $scope.pageInListPV;
        $scope.beginPV = ($scope.currentPagePV - 1) * $scope.pageSizePV;
        $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
    }

    function getListPagingPV(totalRecord, limit, currentPage, pageInList) {
        $scope.isLoading = true;
        var listPage = [];
        var totalPage = parseInt(totalRecord / limit);
        if (totalRecord % limit != 0) {
            totalPage++;
        }
        var startPage = getStartPagePV(currentPage, pageInList);
        var endPage = getEndPagePV(startPage, pageInList, totalPage);
        for (let i = startPage; i <= endPage; i++) {
            listPage.push(i);
        }
        $scope.totalPagePV = totalPage;
        $scope.isLoading = false;
        return listPage;
    }

    function getStartPagePV(currentPage, limit) {
        var startPage = (parseInt((currentPage - 1) / limit) * limit + 1);
        $scope.startListPagePV = startPage;
        return startPage;
    }

    function getEndPagePV(startPage, limit, totalPage) {
        var endPage = startPage + limit - 1;
        if (endPage > totalPage) {
            endPage = totalPage;
        }
        $scope.endListPagePV = parseInt(endPage);
        return parseInt(endPage);
    }


    // // Hàm để cập nhật lại begin khi select thay đổi, thẻ select dùng chỉ thị ng-change ProductVariant
    // $scope.repaginateProductVariant = function (size) {
    //     $scope.beginProductVariant = 0;
    //     $scope.pageProductVariant = 1;
    //     $scope.pageCountProductVariant = Math.ceil($scope.productVariants.length / size);
    //     $scope.pageSizeProductVariant = size;
    // };

    // // Hàm nút first
    // $scope.firstProductVariant = function () {
    //     $scope.beginProductVariant = 0;
    //     $scope.pageProductVariant = 1;
    // };


    // // Hàm nút previous
    // $scope.previousProductVariant = function () {
    //     if ($scope.beginProductVariant > 0) {
    //         $scope.beginProductVariant -= $scope.pageSizeProductVariant;
    //         $scope.pageProductVariant--;
    //     }
    // }


    // // Hàm nút next
    // $scope.nextProductVariant = function () {
    //     if ($scope.beginProductVariant < (Math.ceil($scope.productVariants.length / $scope.pageSizeProductVariant) - 1) * $scope.pageSizeProductVariant) {
    //         $scope.beginProductVariant += $scope.pageSizeProductVariant;
    //         $scope.pageProductVariant++;
    //     }
    // }


    // // Hàm nút last
    // $scope.lastProductVariant = function () {
    //     $scope.beginProductVariant = (Math.ceil($scope.productVariants.length / $scope.pageSizeProductVariant) - 1) * $scope.pageSizeProductVariant;
    //     $scope.pageProductVariant = $scope.pageCountProductVariant;
    // }


    $scope.optionProductVariantV2 = {
        lstOptionV2: [],
        optionV2: {
            option: {},
            optionValues: []
        }
    };

    /**thêm mới option */
    $scope.addOption = function () {
        if ($scope.productVariant.products == null) {
            toastMessage('', "Chưa chọn sản phẩm!", 'warning');
            return;
        }
        if ($scope.checkProductVariant == 0) {
            $scope.messageProductVariant = "Chưa chọn sản phẩm";
            return;
        }

        // add the new option to the model
        $scope.optionProductVariantV2.lstOptionV2.push($scope.optionProductVariantV2.optionV2);
        // clear the option.
        $scope.optionProductVariantV2.optionV2 = {
            option: {},
            optionValues: []
        };
        console.log($scope.optionProductVariantV2.lstOptionV2);
    }
    // $scope.addOption();

    /**thay đổi option theo vv v2 */
    $scope.changeOptionByVariantValueV2 = function (productOption, index) {
        var check = 0;
        $scope.listMessageProductOption = [];
        console.log($scope.optionProductVariantV2.lstOptionV2);
        $scope.optionProductVariantV2.lstOptionV2.forEach(c => {
            if (c.option == productOption) {
                $scope.listMessageProductOption[index] = "Thuộc tính đã tồn tại!";
                check = 1;
                $scope.optionProductVariantV2.optionV2 = {
                    option: {},
                    optionValues: []
                };
                $scope.optionProductVariantV2.lstOptionV2[index] = $scope.optionProductVariantV2.optionV2;
                $scope.optionProductVariantV2.optionV2 = {
                    option: {},
                    optionValues: []
                };
                return;
            }
        });
        if (check == 0) {
            $scope.indexOptionV2 = index;
            $scope.optionProductVariantV2.lstOptionV2[index].option = productOption;
            $scope.optionProductVariantV2.lstOptionV2[index].optionValues = [];
            $scope.messageOption = '';
            genarateProductVariant($scope.optionProductVariantV2.lstOptionV2);
        }
    }

    /**thay đổi ov v2 */
    $scope.changeOptionValueV2 = function () {
        $scope.messageOpValue = "";
    }

    /**chọn ov v2 */
    $scope.chooseOptionValueV2 = function (optionValue) {
        console.log(optionValue);
        if (optionValue == undefined) {
            $scope.messageOpValue = "Chưa chọn giá trị cho thuộc tính!";
            return;
        }
        for (let i = 0; i < $scope.optionProductVariantV2.lstOptionV2[$scope.indexOptionV2].optionValues.length; i++) {
            console.log($scope.optionProductVariantV2.lstOptionV2[$scope.indexOptionV2].optionValues[i]);
            if ($scope.optionProductVariantV2.lstOptionV2[$scope.indexOptionV2].optionValues[i].valueId == optionValue.valueId) {
                $scope.messageOpValue = "Giá trị đã tồn tại!";
                return;
            }

        }
        $scope.optionProductVariantV2.lstOptionV2[$scope.indexOptionV2].optionValues.push(optionValue);
        $scope.messageOpValue = "";
        $('#modalSelectOptionValue').modal('hide');
        genarateProductVariant($scope.optionProductVariantV2.lstOptionV2);
    }

    //check object empty
    function isEmptyObject(obj) {
        return JSON.stringify(obj) === '{}'
    }

    /**mở modal chọn ov */
    $scope.openModalSelectOptionValue = async function (index) {
        $scope.messageOpValue = "";
        $scope.indexOptionV2 = index;
        var productOption = await $scope.optionProductVariantV2.lstOptionV2[index].option;
        console.log(productOption);
        $scope.isLoading = true;
        // $http.get(`${optionValueAPI}/find-not-exists-variant-value/${productOption.products.productId}/${productOption.options.optionId}`)
        $http.get(`${optionValueAPI}/find-option-value-true-by-option/${productOption.optionId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.optionValueByOption = resp.data;
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
                console.log(error);
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Mời bạn đăng nhập !');
                    return;
                }
            });
        $('#modalSelectOptionValue').modal('show');
    }

    /**xóa option trong danh sách */
    $scope.delOptionInList = function (index) {
        $scope.optionProductVariantV2.lstOptionV2.splice(index, 1);
        genarateProductVariant($scope.optionProductVariantV2.lstOptionV2);
    }

    /**xóa ov */
    $scope.delOptionValue = function (indexList, indexOptionValue) {
        console.log($scope.optionProductVariantV2.lstOptionV2)
        console.log(indexOptionValue)
        $scope.optionProductVariantV2.lstOptionV2[indexList].optionValues.splice(indexOptionValue, 1);
        console.log($scope.optionProductVariantV2.lstOptionV2)
        genarateProductVariant($scope.optionProductVariantV2.lstOptionV2);
    }

    /**gen ra list thêm mới pro var */
    function genarateProductVariant(value) {
        console.log(value.length);
        $scope.listMessagePV = [];
        $scope.listMessage = [];
        var products = $scope.productVariant.products;
        var listvvmerge = [];
        var listOld = [];
        var listSize = []
        var countLengthList = 1
        $scope.listPvGenarate = [];
        $scope.listvv = [];
        for (let i = 0; i < value.length; i++) {
            listOld.push(value[i].optionValues);
            listSize.push(value[i].optionValues.length)

            for (let j = 0; j < value[i].optionValues.length; j++) {
                listvvmerge.push(value[i].optionValues[j])
            }
        }
        listOld.sort(function (a, b) { return b.length - a.length });
        console.log(listOld);
        var list = [];

        for (let i = 0; i < listOld.length; i++) {
            countLengthList = countLengthList * listOld[i].length;
        }

        for (let i = 0; i < listOld.length; i++) {
            if (i === 0) {
                for (let j = 0; j < listOld[i].length; j++) {
                    $scope.listvv[j] = []
                    list[j] = []
                    list[j].push(listOld[i][j])
                    $scope.listvv[j] = angular.copy(list[j]);
                }
            } else {
                var size = list.length * listOld[i].length
                console.log(size)
                var itemlst = [];
                for (let l = 0; l < listOld[i].length; l++) {
                    var loop = 0;
                    var c = 0;
                    for (let j = 0; j < size; j++) {
                        if (j <= list.length - 1) {
                        } else {
                            list[j] = list[loop];
                            $scope.listvv[j] = angular.copy(list[j]);
                            // list[j].push(listOld[i][l])
                            loop++;
                        }
                        if (j % listOld[i].length == 0) {
                            var data = listOld[i][l];
                            itemlst.push(data);
                        }
                    }
                }
                for (let m = 0; m < itemlst.length; m++) {
                    console.log(itemlst[m]);
                    $scope.listvv[m].push(itemlst[m]);
                }
            }
        }
        console.log($scope.listvv);
        for (let i = 0; i < $scope.listvv.length; i++) {
            var listName = [];
            var customName = '';
            if ($scope.listvv[i].valueName != undefined) {
                customName = $scope.listvv[i].valueName
            } else {
                for (let k = 0; k < $scope.listvv[i].length; k++) {
                    listName.push($scope.listvv[i][k].valueName);
                }
                customName = listName.join('-')
            }
            // console.log(customName);
            var data = {
                productVariant: {
                    products: products,
                    quantity: 10,
                    importPrice: 10000,
                    price: 10000,
                    tax: 10,
                    isSale: 1,
                    customName: products.productName + ' [' + customName + ']',
                    userCreate: $scope.userLogin,
                    userEdit: $scope.userLogin
                },
                optionValues: $scope.listvv[i],
                images: []

            }
            $scope.listPvGenarate.push(data);
        }
        return $scope.listPvGenarate;
    }

    /**Lấy list ảnh từ server */
    $scope.getListImageServerV2 = async function (index) {
        console.log(index);
        $scope.indexPvGenarate = index;
        $scope.isLoading = true;
        // $http.get(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/get-all-file`)
        $http.get(`${API_SEND_MAIL}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.fileName = resp.data;
                console.log(resp.data);
                $('#exampleModalAddImageProVar1').modal('show');
                $('#modalUploadImageAdd').modal('hide');
                $scope.isLoading = false;
                $(document).ready(function () {
                    $scope.fileName.forEach(f => {
                        document.getElementById("checkbox" + f + '1').checked = false;
                    });
                    if ($scope.listPvGenarate[index].images.length > 0) {
                        $scope.fileName.forEach(f => {
                            $scope.listPvGenarate[index].images.forEach(v => {
                                if (f == v) {
                                    document.getElementById("checkbox" + f + '1').checked = true;
                                }
                            });
                        });
                    }
                });
                // console.log(resp.data);
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
            });
    }

    /**Thêm ảnh lên server */
    $scope.imageLstChanged = async function (multipleFiles) {
        $scope.isLoading = true;
        console.log(multipleFiles.length)
        var fd = new FormData();
        console.log(fd);
        for (let index = 0; index < multipleFiles.length; index++) {
            fd.append('multipleFiles', multipleFiles[index]);
        }


        // await $http.post(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/upload/multiple/files`, fd, {
        await $http.post(`http://buiquanghieu.xyz/TestSendMail/upload/multiple/files`, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(resp => {
            $scope.isLoading = false;
            // $scope.getListImageServer();
            $scope.isLoading = true;
            $http.get(`${API_SEND_MAIL}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    // $scope.fileName = resp.data;
                    resp.data.forEach(i => {
                        var checkExirst = 0;
                        $scope.fileName.forEach(m => {
                            if (i == m) {
                                checkExirst = 1;
                            }
                        });
                        if (checkExirst == 0) {
                            $scope.fileName.push(i);
                        }
                    });
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
                });

            $('#exampleModalAddImageProVar').modal('show');
            $('#exampleModalDetailProVar').modal('hide');
            $('#modalUploadImageList').modal('hide');
            toastMessage('', 'Thêm mới thành công !', 'success');
        }).catch(error => {
            $scope.isLoading = false;
            toastMessage('', 'Thêm mới thất bại !', 'error');
            console.log(error);
        })
    }

    /**Thêm ảnh lên server tab thêm mới*/
    $scope.imageLstChangedAdd = async function (multipleFiles) {
        $scope.isLoading = true;
        console.log(multipleFiles.length)
        var fd = new FormData();
        console.log(fd);
        for (let index = 0; index < multipleFiles.length; index++) {
            fd.append('multipleFiles', multipleFiles[index]);
        }


        // await $http.post(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/upload/multiple/files`, fd, {
        await $http.post(`http://buiquanghieu.xyz/TestSendMail/upload/multiple/files`, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(resp => {
            $scope.isLoading = false;
            // $scope.getListImageServerV2();
            $scope.isLoading = true;
            $http.get(`${API_SEND_MAIL}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    // $scope.fileName = resp.data;
                    resp.data.forEach(i => {
                        var checkExirst = 0;
                        $scope.fileName.forEach(m => {
                            if (i == m) {
                                checkExirst = 1;
                            }
                        });
                        if (checkExirst == 0) {
                            $scope.fileName.push(i);
                        }
                    });
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
                });

            toastMessage('', 'Thêm mới thành công !', 'success');
            $('#modalUploadImageAdd').modal('hide');
            $('#exampleModalAddImageProVar1').modal('show');
        }).catch(error => {
            $scope.isLoading = false;
            toastMessage('', 'Thêm mới thất bại !', 'error');
            console.log(error);
        })
    }

    /**thêm mới ảnh vào pv hiển thị */
    $scope.addMultiImageToExistPV = async function () {
        $('#exampleModalAddImageProVar').modal('hide');
        Swal.fire({
            title: 'Bạn có chắc?',
            text: `Những ảnh này sẽ được thay đổi vào sản phẩm?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.variantImages = [];
                $scope.listImageChange = [];
                $scope.fileName.forEach(i => {
                    var checkedValue = document.getElementsByName('checkbox' + i);
                    if (checkedValue[0].checked == true) {
                        var data = {
                            imagePath: i,
                            productVariants: $scope.productVariant
                        }
                        $scope.listImageChange.push(data);
                    }
                })
                $scope.isLoading = true;
                console.log($scope.listImageChange);
                $http.post(`${imageApi}/store-list-image`, $scope.listImageChange, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                }).then(resp => {
                    $scope.isLoading = false;
                    $scope.variantImages = resp.data;
                    $('#exampleModalAddImageProVar').modal('hide');
                    $('#exampleModalDetailProVar').modal('show');
                    toastMessage('', 'Thay đổi thành công !', 'success');
                }).catch(error => {
                    if (error.status == 401) {
                        $scope.isLoading = false;
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Mời bạn đăng nhập !');
                        return;
                    }
                    toastMessage('', 'Thay đổi thất bại !', 'error');
                    $scope.isLoading = false;
                    console.log(error);
                })
            } else {
                $('#exampleModalAddImageProVar').modal('show');
            }
        })
    }

    /**thêm mới nhiều ảnh vào pv */
    $scope.addMultiImage = async function () {
        $scope.listPvGenarate[$scope.indexPvGenarate].images = [];
        $scope.fileName.forEach(i => {
            var checkedValue = document.getElementsByName('checkbox' + i + '1');
            if (checkedValue[0].checked == true) {
                $scope.listPvGenarate[$scope.indexPvGenarate].images.push(i);
            }
        })
        // $scope.getListImageServerV2();
    }

    /**thêm mới ảnh v2 */
    $scope.addImageV2 = async function (name) {
        $scope.messageImage = '';
        var checkImage = 0
        $scope.listPvGenarate[$scope.indexPvGenarate].images.forEach(i => {
            console.log(i == name);
            if (i == name) {
                // toastMessage('', 'Image has existed!', 'warning');
                $scope.messageImage = 'Ảnh đã tồn tại!';
                checkImage++;
                return;
            }
        });
        if (checkImage == 1) {
            return;
        }
        $('#exampleModalAddImageProVar1').modal('hide');
        Swal.fire({
            title: 'Bạn có chắc?',
            text: `Ảnh ${name} sẽ được thêm vào sản phẩm?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.listPvGenarate[$scope.indexPvGenarate].images.push(name);
            }
            $scope.getListImageServerV2($scope.indexPvGenarate);
        })
    }

    $scope.listMessagePV = [];
    $scope.listMessage = [];
    $scope.messagePV = {
        tax: '',
        importPrice: '',
        price: '',
        quantity: ''
    }
    $scope.createLstPV = async function () {
        console.log($scope.listPvGenarate);
        $scope.errorMessageV2 = [];
        if ($scope.listPvGenarate == undefined || $scope.listPvGenarate.length == 0) {
            toastMessage('', 'Không có sản phẩm nào được chọn !', 'error');
            return;
        }

        await Swal.fire({
            title: '',
            text: `Bạn có chắc chắn thêm mới sản phẩm không?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {

                var check = 0;
                console.log($scope.optionProductVariantV2.lstOptionV2);
                $scope.listPvGenarate.forEach(item => {
                    console.log(item);
                    if (item.optionValues.length < $scope.optionProductVariantV2.lstOptionV2.length) {
                        check = 1;
                        return;
                    }
                });
                if (check == 1) {
                    toastMessage('', 'Bạn chưa chọn đủ thuộc tính sản phẩm !', 'error');
                    return;
                }
                $scope.listMessagePV = [];
                $scope.listMessage = [];
                console.log($scope.listMessage);
                // $scope.checkExist = [];
                $scope.isLoading = true;
                $http.get(`${productVariantAPI}/find-by-product/${$scope.listPvGenarate[0].productVariant.products.productId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                }).then(resp => {
                    $scope.isLoading = false;
                    console.log(resp.data);
                    $scope.lstPVExists = resp.data;

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


                setTimeout(() => {

                    $scope.lstPVExists.forEach(item => {
                        $http.get(`${variantValueApi}/find-by-product-variant-origin/${item.variantId}`, {
                            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                        })
                            .then(resp => {
                                console.log(resp.data);
                                var lstVV = resp.data;
                                $scope.listPvGenarate.forEach(p => {
                                    var index = $scope.listPvGenarate.findIndex(c => c == p);
                                    if (p.optionValues.length == lstVV.length) {
                                        var countSimilarVV = 0;
                                        for (let i = 0; i < lstVV.length; i++) {
                                            for (let j = 0; j < p.optionValues.length; j++) {
                                                if (lstVV[i].optionValues.valueId == p.optionValues[j].valueId) {
                                                    countSimilarVV++;
                                                }

                                            }
                                        }

                                        if (countSimilarVV == p.optionValues.length) {
                                            $scope.listMessagePV[index] = "Sản phẩm đã được tạo trước đó!"
                                            // $scope.checkExist[index] = 1;
                                            return;
                                        }
                                    }
                                });
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
                    });

                    setTimeout(() => {

                        if ($scope.listMessagePV.length == 0) {
                            var check = 0;
                            if (check == 0) {
                                console.log($scope.listPvGenarate);
                                var data = {
                                    requestBody: $scope.listPvGenarate
                                }
                                $http.post(`${productVariantAPI}/createv2`, data, {
                                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                                }).then(resp => {
                                    console.log(resp.data);
                                    $scope.listPagePV = getListPagingPV($scope.productVariants.length, $scope.pageSizePV, $scope.currentPagePV, $scope.pageInListPV)
                                    resp.data.forEach(item => {
                                        var customName = '';
                                        $http.get(`${variantValueApi}/find-by-product-variant/${item.variantId}`, {
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
                                                $scope.isLoading = false;
                                                console.log(error)
                                                if (error.status == 401) {
                                                    $scope.isLoading = false;
                                                    setTimeout(() => {
                                                        document.location = '/admin#!/login';
                                                    }, 2000);
                                                    sweetError('Mời bạn đăng nhập !');
                                                    return;
                                                }
                                                toastMessage('', 'Thêm mới thất bại !', 'error');
                                            })
                                    });
                                    resp.data.forEach(pv => {
                                        $scope.productVariants.push(pv);
                                    });
                                    $scope.productVariant = {};
                                    $scope.listPvGenarate = [];
                                    $scope.optionProductVariantV2 = {
                                        lstOptionV2: [],
                                        optionV2: {
                                            option: {},
                                            optionValues: []
                                        }
                                    };
                                    toastMessage('', 'Thêm mới thành công !', 'success');
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
                                    toastMessage('', 'Thêm mới thất bại !', 'error');
                                    $scope.isLoading = false;
                                    console.log(error);
                                    $scope.errorMessageV2 = error.data;
                                })
                            }
                        }
                    }, 500);
                }, 1000);
            }
        })
    }


    /**xuất excel */
    $scope.exportExcel = function () {
        window.open(`${API_DOWNLOAD_EXCEL}/export-template`).focus();

        // var params = {
        //     headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        // };
        // var url = ['http://localhost:8080/PRO2111_FALL2022/admin/rest/excel/export-template', $.param(params)].join('?');
        // window.open(url).focus;
        // $scope.isLoading = true;
        // $http.get(`${API_DOWNLOAD_EXCEL}/export-template`, {
        //     headers: { 'Authorization': 'Bearer ' + $scope.authToken, 'Content-type': 'application/json' }
        // })
        //     .then(resp => {
        //         var blob = new Blob([resp], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        //         var objectUrl = URL.createObjectURL(blob);
        //         $scope.isLoading = false;
        //         window.open(objectUrl).focus();

        //     })
        //     .catch(error => {
        //         $scope.isLoading = false;
        //         console.log(error);
        //     })
        // $.ajax({
        //     type: 'GET',
        //     url: 'http://localhost:8080/PRO2111_FALL2022/admin/rest/excel/export-template',
        //     crossDomain: true,
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.authToken);
        //     }
        // });
    }

    function addErrorToList(list, error, index) {
        if (error != null) {
            list[index] = error;
        }
        return list;
    }

    /**validate input trong thêm mới pro var */
    function validate(tax, quantity, importPrice, price) {
        var data = {
            tax: '',
            quantity: '',
            importPrice: '',
            price: ''
        }

        if (!Number.isInteger(tax)) {
            data.tax = "Thuế nhập sai định dạng";
        } else if (tax <= 0 || tax > 100) {
            data.tax = "Thuế không được dưới 1 hoặc trên 100";
        }

        if (!Number.isInteger(importPrice)) {
            data.importPrice = "Giá nhập sai định dạng";
        } else if (importPrice < 0) {
            data.importPrice = "Giá nhập không được âm";
        }

        if (!Number.isInteger(price)) {
            data.price = "Giá bán nhập sai định dạng";
        } else if (price < 0) {
            data.price = "Giá bán không được âm";
        }

        if (!Number.isInteger(quantity)) {
            data.quantity = "Số lượng nhập sai định dạng";
        }

        return data;
    }

    /**mở modal xóa pro var */
    $scope.openModalDelProductVariant = function (index) {
        $('#exampleModalDeleteProductVariant').modal('show');
        $scope.index = index;
    }

    /**xóa pro var */
    $scope.delProductVariant = async function () {
        $scope.listMessagePV = [];
        $scope.listMessage = [];
        $scope.listPvGenarate.splice($scope.index, 1);
        $('#exampleModalDeleteProductVariant').modal('hide');
    }

    function _arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
})

app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});
