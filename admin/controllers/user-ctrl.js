app.controller('user-ctrl', function ($scope, $http) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }

    $scope.userLogin = JSON.parse(localStorage.getItem("authToken2"));

    $scope.user = {};
    $scope.users = [];
    $scope.userStatusTrues = [];
    $scope.messageError = {};
    $scope.userId = -1;
    $scope.index = -1;
    //Page
    $scope.begin = 0; // hiển thị thuộc tính bắt đầu từ 0
    $scope.pageSize = 10; // Hiển thị 5 thuộc tính
    $scope.currentPage = 1;
    $scope.pageInList = 5;

    $scope.txtSearchUser = '';
    const userApi = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/users'
    const emailApi = 'http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/send-email'

    $scope.isLoading = true;

    /**lấy ra list user đã tồn tại */
    $scope.initializUser = async function () {
        await $http.get(`${userApi}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.users = angular.copy(response.data);
                $scope.listPage = getListPaging(response.data.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
                $scope.isLoading = false;
            }).catch(function (error) {
                console.log(error);
                $scope.isLoading = false;
            });
    }
    $scope.initializUser()

    $scope.resetUser = function () {
        $scope.user = {
            status: 1,
            sex: 1,
            role: 1,
            otp: Math.floor(Math.random() * (1000000 - 99999 + 1)) + 99999
        }
        $scope.userId = -1;
        $scope.index = -1;
    }
    // $scope.resetUser();

    /**mở modal tạo mới user */
    $scope.activeCreateUser = function () {
        if ($scope.userLogin.role < 3) {
            toastMessage('', 'Bạn không có quyền thêm mới !', 'warning');
            return;
        }
        $scope.resetUser();
        console.log($scope.user.role);
        $scope.messageError = {};
        $('#exampleModalCreateUser').modal('show');
    }

    /**thêm mới user */
    $scope.onAddUser = function () {
        console.log($scope.user.role);
        $scope.isLoading = true;
        $scope.messageRole = '';
        if ($scope.user.role == 0) {
            $scope.messageRole = 'Must be chosen';
            return;
        }

        $http.post(userApi, $scope.user, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                $('#exampleModalCreateUser').modal('hide');
                $scope.isLoading = false;
                toastMessage('', 'Thêm thành công !', 'success');
                $scope.messageError = {};
                $scope.isLoading = false;
                $scope.users.push(response.data);
                $scope.initializUser()
                $scope.resetUser();
            }).catch(function (error) {
                toastMessage('', 'Thêm thất bại !', 'error');
                $scope.messageError = error.data;
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**lấy thông tin user theo userId */
    $scope.getUserId = async function (id) {
        if ($scope.userLogin.role < 3) {
            toastMessage('', 'Bạn không có quyền thêm mới !', 'warning');
            return;
        }
        $scope.isLoading = true;
        $http.get(`${userApi}/${id}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(function (response) {
                console.log(response.data);
                $scope.isLoading = false;
                $scope.user = angular.copy(response.data);
                $scope.messageError = {};
                $('#exampleModalUpdateUser').modal('show');
            }).catch(function (error) {
                console.log(error);
                $scope.isLoading = false;
            });
    }

    /**xóa user */
    $scope.deleteUser = function (id) {
        Swal.fire({
            title: 'Bạn có chắc chắn thay đổi trạng thái?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.isLoading = true;
                $http.delete(`${userApi}/${id}`, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        $scope.isLoading = false;
                        toastMessage('', 'Xóa thành công !', 'success');
                        $scope.isLoading = false;
                        var index = $scope.users.findIndex(c => c.userId == id);
                        $scope.users.splice(index, 1);
                        $scope.listPage = getListPaging($scope.users.length, $scope.pageSize, $scope.currentPage, $scope.pageInList);
                    }).catch(function (error) {
                        toastMessage('', 'Xóa thất bại !', 'error');
                        console.log(error);
                        $scope.isLoading = false;
                    });
            }
        })
    }

    /**xác nhận thay đổi status của user */
    $scope.showConfirmUserStatusChange = function (index) {
        $scope.userTemp = angular.copy($scope.users[index]);
        $scope.index = index;

        Swal.fire({
            title: 'Bạn có chắc chắn thay đổi trạng thái?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.user = angular.copy($scope.users[index]);
                if ($scope.user.status === 1) {
                    $scope.user.status = 0;
                } else {
                    $scope.user.status = 1;
                }
                $scope.onEditUser();
                console.log($scope.user)
            }
            else {
                // toastMessage('', 'Cập nhật thất bại !', 'error');
                $scope.noUpdateUserStatus(index);
            }
        })
    }

    /**ko xác nhận cập nhạt trạng thái */
    $scope.noUpdateUserStatus = function (index) {
        var userId = angular.copy($scope.users[index].userId);
        console.log(userId);
        $scope.isLoading = true;
        $scope.initializUser();

    }

    /**cập nhật user */
    $scope.onEditUser = function () {
        $scope.isLoading = true;

        $http.get(`${userApi}/${$scope.user.userId}`, {
            headers: { 'Authorization': 'Bearer ' + $scope.authToken }
        })
            .then(resp => {
                $http.put(`${userApi}/${$scope.user.userId}`, $scope.user, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(function (response) {
                        $('#exampleModalUpdateUser').modal('hide');
                        toastMessage('', 'Cập nhật thành công !', 'success');
                        $scope.isLoading = false;
                        var index = $scope.users.findIndex(o => o.userId == $scope.user.userId);
                        $scope.users[index] = angular.copy(response.data);
                        $scope.messageError = {};
                        $scope.resetUser();
                    }).catch(error => {
                        toastMessage('', 'Cập nhật thất bại !', 'error');
                        $scope.messageError = error.data;
                        $scope.isLoading = false;
                        console.log(error);
                    });
            }).catch(error => {
                console.log(error);
            });
    }

    /**search by phone */
    $scope.searchUserByPhoneOrEmail = async function (val) {
        if (val === null || val === '') {
            $scope.initializUser();
        } else {
            $scope.users = await [];
            $scope.isLoading = true;
            await $http.get(`${userApi}/find-approximate-phone-or-email/${val}`, {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
                .then(resp => {
                    $scope.users = resp.data;
                    $scope.pageCount = Math.ceil(resp.data.length / $scope.pageSize);
                    $scope.isLoading = false;
                }).catch(function (error) {
                    console.log(error);
                    $scope.isLoading = false;
                });
        }
    }

    /**xác nhận reset password */
    $scope.resetPassword = function (user) {
        $('#exampleModalUpdateUser').modal('hide');
        Swal.fire({
            title: 'Bạn có chắc chắn khôi phục mật khẩu không?',
            // text: "Password will be reset!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                var sendMail = {
                    to: user.email,
                    subject: "",
                    content: user.fullName
                }
                $scope.isLoading = true;
                $http.post(`${emailApi}/reset-password`, sendMail, {
                    headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                })
                    .then(resp => {
                        console.log(resp.data);
                        $scope.isLoading = false;
                        if (resp.data.length != 0) {
                            toastMessage('', 'Khôi phục mật khẩu thành công !', 'success');
                        } else {
                            toastMessage('', 'Khôi phục mật khẩu thất bại !', 'error');
                        }
                    })
                    .catch(error => {
                        $scope.isLoading = false;
                        toastMessage('', 'Khôi phục mật khẩu thất bại \nMời bạn kiểm tra lại thông tin Email gửi đi!', 'error');
                        console.log(error);
                    })

            }
            else {
            }
            $('#exampleModalUpdateUser').modal('show');
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



    // Hàm nút first
    // $scope.first = function () {
    //     $scope.begin = 0;
    //     $scope.page = 1;
    // };


    // // Hàm nút previous
    // $scope.previous = function () {
    //     if ($scope.begin > 0) {
    //         $scope.begin -= $scope.pageSize;
    //         $scope.page--;
    //     }
    // }


    // // Hàm nút next
    // $scope.next = function () {
    //     if ($scope.begin < (Math.ceil($scope.users.length / $scope.pageSize) - 1) * $scope.pageSize) {
    //         $scope.begin += $scope.pageSize;
    //         $scope.page++;
    //     }
    // }


    // // Hàm nút last
    // $scope.last = function () {
    //     $scope.begin = (Math.ceil($scope.users.length / $scope.pageSize) - 1) * $scope.pageSize;
    //     $scope.page = $scope.pageCount;
    // }

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
        $scope.listPage = getListPaging($scope.users.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.prevListPage = function () {
        $scope.currentPage = $scope.startListPage - $scope.pageInList;
        $scope.begin = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.listPage = getListPaging($scope.users.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
    }

    $scope.repaginate = function (value) {
        $scope.pageSize = value;
        var totalPage = totalPages($scope.users.length, $scope.pageSize);
        if ($scope.currentPage > totalPage) {
            $scope.currentPage = totalPage;
        }
        $scope.listPage = getListPaging($scope.users.length, $scope.pageSize, $scope.currentPage, $scope.pageInList)
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

/** Chỉ thị ép kiểu sang số nguyên khi người dùng thay đổi giá trị select */
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