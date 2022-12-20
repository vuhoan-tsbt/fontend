app.controller('profileCtrl', function ($scope, $http) {
    const apiUser = `http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/users`

    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }

    $scope.user = JSON.parse(localStorage.getItem('authToken2'));
    $scope.error = {
        confirmPassword: '',
        passwordNew: '',
        passwordOld: ''
    }

    // switch (JSON.parse(localStorage.getItem('authToken2')).role) {
    //     case 3:
    //         $scope.user.role = 'Quản trị viên';
    //         break;
    //     case 2:
    //         $scope.user.role = 'Nhân viên';
    //         break;
    //     case 1:
    //         $scope.user.role = 'Khách hàng';
    //         break;
    //     default:
    //         break;
    // }
    $scope.changePassword = {
        passwordOld: '',
        passwordNew: '',
        confirmPassword: ''
    }

    $scope.openModalEdit = function () {
        $scope.userEdit = angular.copy($scope.user);
        $('#editBackdrop').modal('show');
    }

    $scope.edit = async function () {
        Swal.fire({
            title: 'Xác thực !',
            text: "Bạn có chắc chắn thay đổi thông tin cá nhân không ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Changes !'
        }).then((result) => {
            if (result.isConfirmed) {
                updateProfile();
            }
        })
    }

    async function updateProfile() {
        $scope.isLoading = true;
        await $http.get(`${apiUser}/${$scope.user.userId}`,
            {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
            .then(function (response) {
            })
            .catch(function (error) {
            })
        await $http.put(`${apiUser}/profile/${$scope.user.userId}`, $scope.userEdit,
            {
                headers: { 'Authorization': 'Bearer ' + $scope.authToken }
            })
            .then(function (response) {
                $scope.user.fullName = response.data.fullName
                $scope.user.email = response.data.email
                $scope.user.phone = response.data.phone
                localStorage.setItem("authToken2", JSON.stringify($scope.user));
                $scope.isLoading = false;
                toastMessage("success", "Cập nhật thành công !")
            })
            .catch(function (error) {
                console.log(error)
                $scope.isLoading = false;
                toastMessage("error", "Cập nhật thất bại !")
            })
    }

    $scope.editPassword = function () {
        Swal.fire({
            title: 'Xác thực !',
            text: "Bạn có chắc chắn đổi mật khẩu không ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Changes !'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.isLoading = true;
                $http.put(`${apiUser}/change-password/${$scope.user.userId}`, $scope.changePassword,
                    {
                        headers: { 'Authorization': 'Bearer ' + $scope.authToken }
                    })
                    .then(function (response) {
                        $scope.isLoading = false;
                        toastMessage("success", "Thay đổi mật khẩu thành công !")
                        $scope.error = {}
                        $('#editPasswordBackdrop').modal('hide');
                    })
                    .catch(function (error) {
                        $scope.error.confirmPassword = error.data.confirmPassword
                        $scope.error.passwordNew = error.data.passwordNew
                        $scope.error.passwordOld = error.data.passwordOld
                        console.log($scope.error);
                        $scope.isLoading = false;
                        toastMessage("error", "Thay đổi mật khẩu thất bại");
                    })
            }
        })
    }

    function toastMessage(icon, title) {
        Swal.fire({
            position: 'top-end',
            icon: icon,
            toast: true,
            animation: true,
            timerProgressBar: true,
            title: title,
            showConfirmButton: false,
            timer: 3000
        })
    }

    $scope.listValue = []
    $scope.action = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.listValue.push($scope.valueinput)
            console.log($scope.listValue);
            $scope.valueinput = '';
        }
    }
    $scope.removeValue = function (index) {
        $scope.listValue.splice(index, 1);
        return $scope.listValue
    }
})