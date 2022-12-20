app.controller("login-ctrl", function ($scope, $http, $rootScope) {

    $scope.form = {
        email: '',
        password: ''
    }
    localStorage.clear();
    $scope.btnLogin = function () {
        $scope.isLoading = true;
        $http.post(`http://localhost:8081/auth/api/login`, $scope.form)
            .then(resp => {
                console.log(resp);
            })
            .catch(error => {
                console.log(error);
                toastMessage('', 'Email hoặc mật khẩu sai', 'error')
            })
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
});