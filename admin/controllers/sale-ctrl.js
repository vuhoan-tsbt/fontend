app.controller('sale-ctrl', function ($scope, $http) {
    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }

    const API_SALE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales';
    const API_SALE_UPDATE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales/saleparent-and-salechild';
    const API_VARIANT_VALUE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/variant-values';
    const API_PRODUCT = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/products';
    const API_SALE_CHILD_UPDATE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales/edit-sale_child';
    const API_SALE_CHILD_CREATE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/sales/create-sale-child';

    $scope.selectedAllProduct = false;
    $scope.selectedAllProductVariant = false;
    $scope.reset = function () {
        $scope.form = {
            saleName: '',
            discount: 0,
            discountType: 1,
            startDate: null,
            endDate: null,
            saleType: 0,
            saleDay: 0
        };
        $scope.saleChild = {
            saleName: '',
            discount: 0,
            discountType: 0,
            startDate: null,
            endDate: null,
            saleType: 1,
            weekday: 0,
            startAt: null,
            endAt: null,
            saleParent: null,

        }
    };

    $scope.reset();
    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));
    $scope.listProductOld = [];
    //Page
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 5 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;
    //Get list sale
    $scope.initializSale = function () {
        $scope.isLoading = true;
        $http.get(`${API_SALE_UPDATE}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listSale = resp.data;
                $scope.listPage = getListPaging(resp.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                $scope.isLoading = false;
            })
            .catch(error => {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            })

    };

    //Khởi tạo ban đầu
    // $scope.initializSale();


    // Lấy ra tât cả Product đang hoạt động
    $scope.findAllProduct = function () {
        $scope.isLoading = true;
        $http.get(`${API_PRODUCT}/by-status-true`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listProduct = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            })
    };
    $scope.findAllProduct();

    //clickSelectAllProduct
    $scope.clickSelectAllProduct = function (value) {
        var checkedValue = document.getElementsByName('selectedProduct');
        if (value == false) {
            $scope.listProductSelected = [];

            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
                $scope.listProductSelected.push(JSON.parse(checkedValue[i].value))
            }
            setTimeout(() => {
                findProductVariantByProduct($scope.listProductSelected);
            }, 500);


        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
            $scope.listProductVariant = [];
            $scope.productVarintSelected = [];
        }
    }


    //
    //clickSelectAllProductVariant
    $scope.clickSelectAllProductVariant = function (value) {
        var checkedValue = document.getElementsByName('selectedProductVariant');
        if (value == false) {
            $scope.productVarintSelected = [];
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
                $scope.productVarintSelected.push(JSON.parse(checkedValue[i].value))
            }
        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
            $scope.productVarintSelected = [];
        }
    }

    //changeSelectProduct
    $scope.changeSelectProduct = async function (index) {
        setTimeout(() => {
            $scope.listProductSelected = [];
            var checkedValue = document.getElementsByName('selectedProduct');
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].checked == true) {
                    $scope.listProductSelected.push(JSON.parse(checkedValue[i].value))
                }
            }
            if (checkedValue[index].checked == false) {
                if ($scope.productVarintSelected != null && $scope.productVarintSelected.length != 0) {
                    for (let i = $scope.productVarintSelected.length - 1; i >= 0; i--) {
                        var pv = $scope.productVarintSelected[i];
                        if (pv.products.productId === JSON.parse(checkedValue[index].value).productId) {
                            $scope.productVarintSelected.splice(i, 1);
                        }
                    }
                }
            }
            findProductVariantByProduct($scope.listProductSelected);
        }, 500);

    }


    //changeSelectProductVariant
    $scope.changeSelectProductVariant = async function () {
        $scope.productVarintSelected = [];
        setTimeout(() => {
            var checkedValue = document.getElementsByName('selectedProductVariant');
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].checked == true) {
                    $scope.productVarintSelected.push(JSON.parse(checkedValue[i].value));
                }
            }
            const intersect = (a1, a2, ...rest) => {
                const a12 = a1.filter(value => a2.includes(value))
                if (rest.length === 0) { return a12; }
                return intersect(a12, ...rest);
            };
            const filteredArray = $scope.productVarintSelected.filter(value => $scope.listProductVariant.includes(value));

            // console.log(intersect($scope.productVarintSelected, $scope.listProductVariant))



        }, 500);

    }

    async function findProductVariantByProduct(listProduct) {
        $scope.listProductVariant = [];
        $scope.isLoading = true;
        await $http.post(`${API_SALE}/find-product-variants-promotion-is-allowed`, listProduct, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.listProductVariant = resp.data;
                $scope.isLoading = false;
            })
            .catch(error => {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            })
        //GetVariantValueByProductVariant
        $scope.isLoading = true;
        await $scope.listProductVariant.forEach(item => {
            var customName = '';

            $http.get(`${API_SALE}/find-variant-value-by-product-variant/${item.variantId}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    var lstData = resp.data.variantValues;
                    item.countSale = resp.data.countSale;
                    item.saleName = resp.data.saleName.join('\n');
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
                })
        });

        var c = $($scope.productVarintSelected).not($($scope.productVarintSelected).not($scope.listProductVariant));

        //
        for (let i = 0; i < $scope.listProductVariant.length; i++) {
            for (let j = 0; j < c.prevObject.length; j++) {
                if ($scope.listProductVariant[i].variantId === c.prevObject[j].variantId) {
                    var checkedValue = document.getElementsByName('selectedProductVariant');
                    checkedValue[i].checked = true;
                }
            }

        }
        c.prevObject
        $scope.isLoading = false;
    }

    //chooseSale
    $scope.listSaleChild = [];
    $scope.chooseSale = async function (sale) {
        $scope.selectedAllProductUpdate = false;
        $scope.selectedAllProductVariant = false;
        $scope.messages = {};
        $scope.isLoading = true;
        await $http.get(`${API_SALE_UPDATE}/${sale.saleId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $scope.isLoading = false;
                // console.log(resp.data);
                $scope.saleReturn = resp.data.saleParent;
                $scope.saleName = angular.copy(resp.data.saleParent.saleName);
                // $scope.saleReturn.startDate = resp.data.sale.startDate;
                // $scope.saleReturn.endDate = resp.data.sale.endDate;
                console.log($scope.saleReturn);
                $scope.listSaleChild = resp.data.lstSaleChild;
                $scope.listProductOnPromotion = resp.data.listProductVariants;
                for (let i = 0; i < resp.data.listProductVariants.length; i++) {
                    var element = resp.data.listProductVariants[i].products;
                    if ($scope.listProductOld.length != 0) {
                        $scope.listProductOld.forEach(p => {
                            if (p.productId != element.productId) {
                                $scope.listProductOld.push(element);
                            }
                        });
                    } else {
                        $scope.listProductOld.push(element);
                    }
                }
            })
            .catch(error => {
                $scope.isLoading = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            });

        //GetVariantValueByProductVariant
        $scope.isLoading = true;
        await $scope.listProductOnPromotion.forEach(item => {
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
                    $scope.isLoading = false;
                    if (error.status == 401) {
                        setTimeout(() => {
                            document.location = '/admin#!/login';
                        }, 2000);
                        sweetError('Please login !');
                        return;
                    }
                })
        });


        $('#modalChooseSale').modal('show');
    }


    //updateSaletedSale
    $scope.createdSale = async function () {
        var listChild = [];
        $scope.lstOptionDay.forEach(c => listChild.push(c.optionDay));
        var data = {
            saleParent: $scope.form,
            lstSaleChild: listChild,
            listProductVariants: $scope.productVarintSelected
        }
        // $scope.messages = {};
        // if ($scope.form.startDate != null) {
        //     var startDate = toLocal($scope.form.startDate);
        //     data.saleParent.startDate = startDate;
        // }
        // if ($scope.form.endDate != null) {
        //     var endDate = toLocal($scope.form.endDate);
        //     data.saleParent.endDate = endDate;
        // }
        // if (isNaN(data.saleParent.discount)) {
        //     $scope.messages = {
        //         discount: 'Discount phải là số !'
        //     };
        //     return;
        // }
        console.log(data);
        // return;
        $scope.isLoading = true;
        await $http.post(`${API_SALE_UPDATE}`, data, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.messages = {};
                $scope.productVarintSelected = [];
                $scope.selectedAllProduct = false;
                $scope.selectedAllProductVariant = false;
                $('#list-tab').click();
                $scope.isLoading = false;
                toastMessage('', 'Tạo mới thành công !', 'success');
                $scope.reset();
            })
            .catch(error => {
                console.log(error)
                $scope.messages = error.data;
                $scope.isLoading = false;
                toastMessage('', 'Tạo mới thất bại !', 'error');
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            })
    }

    function sweetError(title) {
        Swal.fire(
            title,
            '',
            'error'
        )
    }

    function toLocal(date) {
        if (date != null) {
            var local = date;
            try {
                local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return local.toISOString();
            } catch (error) {
                return date;
            }

        }
    }
    //Khởi tạo sale
    $scope.saleLocal = {};
    //OpenmodalAddPV
    $scope.openModalChoosePv = async function (sale) {
        $('#modalChooseSale').modal('hide');
        setTimeout(() => {
            $scope.isLoading = false;
            $('#modalChooseProduct').modal('show');
        }, 500);

        $scope.listProductOld
        $scope.isLoading = true;
        $scope.saleLocal = sale;
        console.log(sale);
        var checkedValue = document.getElementsByName('selectedProductUpdate');
        for (let i = 0; i < $scope.listProductOld.length; i++) {
            var element = $scope.listProductOld[i];
            var index = $scope.listProduct.findIndex(p => p.productId == element.productId);
            checkedValue[index].checked = true;
        }

        findProductVariantByProductAndSale($scope.listProductOld, $scope.saleLocal)

        // $('#modalChoosePv').modal('hide');
    }
    // close modal choose product variant
    $scope.closeModalChoosePv = async function(){
        $('#modalChooseProduct').modal('hide');
        setTimeout(() => {
            $scope.isLoading = false;
            $('#modalChooseSale').modal('show');
        }, 500);
    }

    //find pv by sale and listproduct
    async function findProductVariantByProductAndSale(listProduct, sale) {
        // $('#modalChooseProduct').modal('hide');
        // $('#modalChooseSale').modal('hide');
        var data = {
            listProduct: listProduct,
            sale: sale
        };
        var a = 1;
        $scope.listProductVariant = [];
        $scope.isLoadingModal = true;
        await $http.post(`${API_SALE}/find-product-variants-promotion-is-allowed`, listProduct, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        }).then(resp => {
            $scope.listProductVariant = resp.data;
            console.log(resp.data);
            console.log($scope.listProductOnPromotion);
            $scope.isLoadingModal = false;
        }).catch(error => {
            $scope.isLoadingModal = false;
            if (error.status == 401) {
                setTimeout(() => {
                    document.location = '/admin#!/login';
                }, 2000);
                sweetError('Please login !');
                return;
            }
        })

        //Get variantValue
        $scope.isLoadingModal = true;
        await $scope.listProductVariant.forEach(item => {
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
                    $scope.isLoadingModal = false;
                })
                .catch(error => {
                    $scope.isLoadingModal = false;
                    console.log(error)
                })
        });

        for (let i = 0; i < $scope.listProductOnPromotion.length; i++) {
            var productOld = $scope.listProductOnPromotion[i];
            var index = $scope.listProductVariant.findIndex(p => p.variantId == productOld.variantId);
            var checkedValue = document.getElementsByName('selectedProductVariantUpdate');
            checkedValue[index].checked = true;
        }

        // $('#modalChooseProduct').modal('show');
    }


    //selectedProductVariantUpdate
    $scope.selectedProductVariantUpdate = function (index) {
        // $scope.productVarintSelected = [];
        var checkedValue = document.getElementsByName('selectedProductVariantUpdate');
        var pvSelect = JSON.parse(checkedValue[index].value);
        if (checkedValue[index].checked == true) {
            $scope.listProductOnPromotion.push(pvSelect);
            console.log($scope.listProductOnPromotion);
        } else {
            var indexPv = $scope.listProductOnPromotion.findIndex(p => p.variantId == pvSelect.variantId);
            // console.log(indexPv);
            for (let i = $scope.listProductOnPromotion.length - 1; i >= 0; i--) {
                if (i == indexPv) {
                    $scope.listProductOnPromotion.splice(i, 1);
                }
            }

        }
        return $scope.listProductOnPromotion;
    }

    //changeSelectProductBySaleOld
    $scope.changeSelectProductBySaleOld = async function (index) {
        $scope.listProductSelected = [];
        var checkedValue = document.getElementsByName('selectedProductUpdate');
        for (let i = 0; i < checkedValue.length; i++) {
            if (checkedValue[i].checked == true) {
                $scope.listProductSelected.push(JSON.parse(checkedValue[i].value))
            }
        }
        if (checkedValue[index].checked == false) {
            if ($scope.productVarintSelected != null && $scope.productVarintSelected.length != 0) {
                for (let i = $scope.productVarintSelected.length - 1; i >= 0; i--) {
                    var pv = $scope.productVarintSelected[i];
                    if (pv.products.productId === JSON.parse(checkedValue[index].value).productId) {
                        $scope.productVarintSelected.splice(i, 1);
                    }
                }
            }
        }
        findProductVariantByProductAndSale($scope.listProductSelected, $scope.saleLocal);
    }

    //click AllProductUpdate
    $scope.clickSelectAllProductAnSale = function (value) {
        var checkedValue = document.getElementsByName('selectedProductUpdate');
        if (value == false) {
            $scope.listProductSelected = [];

            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
                $scope.listProductSelected.push(JSON.parse(checkedValue[i].value))
            }
            setTimeout(() => {
                findProductVariantByProductAndSale($scope.listProductSelected, $scope.saleLocal);
            }, 500);


        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
            $scope.listProductVariant = [];
            $scope.listProductOnPromotion = [];
        }
    }

    //click AllProductVariantUpdate
    $scope.clickSelectAllProductVariantAnSale = function (value) {
        var checkedValue = document.getElementsByName('selectedProductVariantUpdate');
        if (value == false) {
            $scope.listProductOnPromotion = [];

            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = true;
                $scope.listProductOnPromotion.push(JSON.parse(checkedValue[i].value))
            }
        } else {
            for (let i = 0; i < checkedValue.length; i++) {
                checkedValue[i].checked = false;
            }
            $scope.listProductOnPromotion = [];
        }
        return $scope.listProductOnPromotion;
    }

    //change Select Product Variant Update
    $scope.changeSelectProductVariantUpdate = async function () {
        $scope.productVarintSelected = [];
        setTimeout(() => {
            var checkedValue = document.getElementsByName('selectedProductVariantUpdate');
            for (let i = 0; i < checkedValue.length; i++) {
                if (checkedValue[i].checked == true) {
                    $scope.productVarintSelected.push(JSON.parse(checkedValue[i].value));
                }
            }
            const intersect = (a1, a2, ...rest) => {
                const a12 = a1.filter(value => a2.includes(value))
                if (rest.length === 0) { return a12; }
                return intersect(a12, ...rest);
            };
            const filteredArray = $scope.productVarintSelected.filter(value => $scope.listProductVariant.includes(value));

            // console.log(intersect($scope.productVarintSelected, $scope.listProductVariant)
        }, 500);
        $scope.listProductOnPromotion = productVarintSelected;
    }

    //update sale
    $scope.updateSale = async function () {
        $scope.messages = {};
        var dataUpdate = {
            sale: $scope.saleReturn,
            listProductVariants: $scope.listProductOnPromotion
        }

        if ($scope.saleReturn.startDate != null) {
            var startDate = toLocal($scope.saleReturn.startDate);
            dataUpdate.sale.startDate = startDate;
        }
        if ($scope.saleReturn.endDate != null) {
            var endDate = toLocal($scope.saleReturn.endDate);
            dataUpdate.sale.endDate = endDate;
        }
        if (isNaN(dataUpdate.sale.discount)) {
            $scope.messages = {
                discount: 'Discount phải là số !'
            };
            return;
        }
        console.log(dataUpdate);
        $scope.isLoadingModal = true;
        await $http.put(`${API_SALE}/${$scope.saleReturn.saleId}`, dataUpdate, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.messages = {};
                $scope.productVarintSelected = [];
                $scope.initializSale();
                $scope.isLoadingModal = false;
                $('#modalChooseSale').modal('hide');
                toastMessage('', 'Cập nhật thành công !', 'success');
            })
            .catch(error => {
                console.log(error)
                $scope.messages = error.data;
                $scope.isLoadingModal = false;
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
                toastMessage('', 'Cập nhật thất bại !', 'error');
            })
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
    $scope.lstOptionDay = []
    $scope.addOption = function () {
        // clear the option.
        $scope.optionDay = {
            // saleDay: 0,
            // day: 'Monday'
            // optionValues: []
        };
        // add the new option to the model
        $scope.lstOptionDay.push($scope.optionDay);
    }
    $scope.addOption();
    $scope.delOptionInList = function (index) {
        console.log(index);
        $scope.lstOptionDay.splice(index, 1);

    }
    //open modal edit sale children
    $scope.openModalEditSaleChid = async function (sale) {
        $scope.saleReturn1 = sale;
        $('#modalChooseSale').modal('hide');
        setTimeout(() => {
            $scope.isLoading = false;
            $('#modalEditSaleChild').modal('show');
        }, 500);
    }
    //update sale children
    $scope.updateSaleChiled = async function () {
        $scope.messages = {};
        console.log($scope.saleReturn1);
        $scope.isLoading = true;
        await $http.put(`${API_SALE_CHILD_UPDATE}/${$scope.saleReturn1.saleId}`, $scope.saleReturn1, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        }).then(resp => {
            console.log(resp.data);
            $scope.messages = {};
            $scope.isLoading = false;
            toastMessage('', 'Cập nhật thành công !', 'success');
            $('#modalEditSaleChild').modal('hide');      
            setTimeout(() => {
                $scope.isLoading = false;
                $('#modalChooseSale').modal('show');
            }, 500);
        })
            .catch(error => {
                console.log(error)
                $scope.messages = error.data;
                $scope.isLoading = false;
                toastMessage('', 'Cập nhật thất bại !', 'error');
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
            })

    }
    //delete sale child
    $scope.deleteSaleChid = async function (sale) {
        console.log($scope.listSaleChild.length);
        if ($scope.listSaleChild.length == 1) {
            Swal.fire({
                title: 'Cảnh báo !',
                text: "Chương trình khuyến mãi có ít nhất một thứ khuyến mãi, bạn không được phép xóa!",
                icon: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: '#d33',
                // confirmButtonText: 'Yes, delete it!'
            })
        } else {
            Swal.fire({
                title: 'Bạn có muốn xóa hay không?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $http.delete(`${API_SALE_UPDATE}/${sale.saleId}`, {
                        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                    })
                        .then(function (response) {
                            toastMessage('', 'Xóa thành công !', 'success');
                        })
                        .catch(function (error) {
                            toastMessage('', 'Xóa thất bại !', 'error');
                        })
                }
            })
        }

    }
    //delete sale parent
    $scope.deleteSaleParent = async function (sale) {
        Swal.fire({
            title: 'Bạn có muốn xóa hay không?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(`${API_SALE}/${sale.saleId}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        var index = $scope.listSale.findIndex(s => s.saleId == response.data.saleId);
                        $scope.listSale.splice(index, 1);
                        toastMessage('', 'Xóa thành công !', 'success');
                    })
                    .catch(function (error) {
                        toastMessage('', 'Xóa thất bại !', 'error');
                    })
            }
        })
    }
    //OpenModalCreateSaleChild
    $scope.openModalCreateSaleChid = async function () {
        $('#modalChooseSale').modal('hide');
        setTimeout(() => {
            $scope.isLoading = false;
            $('#modalCreateSaleChild').modal('show');
        }, 500);
    }

    // Thêm mơi sale con 
    $scope.createSaleChild = async function () {
        console.log($scope.saleChild);
        $scope.saleChild.saleParent = $scope.saleReturn;
        $scope.isLoading = true;
        await $http.post(`${API_SALE_CHILD_CREATE}`, $scope.saleChild, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                console.log(resp.data);
                $scope.listSaleChild.push(resp.data);
                $('#list-tab').click();
                $scope.isLoading = false;
                toastMessage('', 'Tạo mới thành công !', 'success');
                $scope.reset();
                $('#modalCreateSaleChild').modal('hide');
                setTimeout(() => {
                    $scope.isLoading = false;
                    $('#modalChooseSale').modal('show');
                }, 500);
            })
            .catch(error => {
                console.log(error)
                $scope.messages = error.data;
                $scope.isLoading = false;
                toastMessage('', 'Tạo mới thất bại !', 'error');
                if (error.status == 401) {
                    setTimeout(() => {
                        document.location = '/admin#!/login';
                    }, 2000);
                    sweetError('Please login !');
                    return;
                }
                $('#modalCreateSaleChild').modal('show');
            })


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
        $scope.listPage = getListPaging($scope.listSale.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prev
        = function () {
            $scope.currentPage = $scope.startListPage - $scope.pageInList;
            $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
            $scope.listPage = getListPaging($scope.listSale.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        }

    $scope.repaginate = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.listSale.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.listSale.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
    }

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
})




