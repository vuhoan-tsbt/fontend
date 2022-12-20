//Controller Quản lý môn học
function homeCtrl($scope, $http, $rootScope) {
    // var fullname = sessionStorage.getItem("fullname"); //sessionStorage để lưu lại dữ liệu khi đăng nhập, gần giống với cookie ở web
    // var email = sessionStorage.getItem("email");
    // var role = sessionStorage.getItem("role");
    // if (fullname != "") $rootScope.fullname = fullname;
    // if (email != "") $rootScope.email = email;
    // if (role != "") $rootScope.role = role;
    $scope.list_products = [];
    // clearForm();

    $http.get('http://localhost:3000/products')
        .then(function (response) {
            console.log(response.data)
            $scope.list_products = response.data;
        })
        .catch(function (error) {
            console.log(error);

        });


    $scope.options = [];
    $http.get('http://localhost:3000/options')
        .then(function (response) {
            console.log(response.data)
            $scope.options = response.data;
        })
        .catch(function (error) {
            console.log(error);

        });


    $scope.option_values = [];
    $http.get('http://localhost:3000/option_values')
        .then(function (response) {
            console.log(response.data)
            $scope.option_values = response.data;
        })
        .catch(function (error) {
            console.log(error);

        });
    //test input động
    $scope.question = {
        options: [],
        option_new: { name_option: '', value_option: '' }
    };

    $scope.add = function () {
        // add the new option to the model
        $scope.question.options.push($scope.question.option_new);
        // clear the option.
        $scope.question.option_new = { name_option: '', value_option: '' };
    }

    $scope.del = function (index) {
        // delete option
        $scope.question.options.splice(index, 1);

    }

    // option thay đổi, value_option thay đổi
    $scope.changeoption = function () {
        // alert($scope.question.option_new.name_option)
        $http.get('http://localhost:3000/option_values?id_option=' + $scope.question.option_new.name_option)
            .then(function (response) {
                console.log(response.data)
                $scope.option_values = response.data;
            })
            .catch(function (error) {
                console.log(error);

            });
    }



    //carts
    $scope.list_carts = [];
    $scope.list_carts[0] = new Array();
    $scope.list_carts[1] = new Array();
    $scope.total_money = 0;
    // $scope.carts = []
    // $scope.list_product_carts = []
    $http.get('http://localhost:3000/carts')
        .then(function (response) {
            console.log(response.data)
            
            $scope.list_carts[0] = response.data;
            for (let i = 0; i < $scope.list_carts[0].length; i++) {
                // console.log($scope.list_carts[0][i].id_product)
                $http.get('http://localhost:3000/products/' + $scope.list_carts[0][i].id_product)
                    .then(function (response) {
                        // console.log(response.data)
                        $scope.list_carts[1][i] = (response.data);
                        $scope.total_money += $scope.list_carts[0][i].quantity * response.data.price;
                    })
                    .catch(function (error) {
                        console.log(error);

                    });
            }
            console.log($scope.list_carts);
            if ($scope.list_carts[0].length > 0) {
                $scope.sttCart = true;
            }else{
                $scope.sttCart = false;
            }
        })
        .catch(function (error) {
            console.log(error);

        });


    //    //product in cart
    //    $scope.list_product_carts = []
    //     $http.get('http://localhost:3000/products/'+$scope.list_carts.id_product)
    //         .then(function (response) {
    //             console.log(response.data)
    //             $scope.list_product_carts = response.data;
    //         })
    //         .catch(function (error) {
    //             console.log(error);

    //         });

};