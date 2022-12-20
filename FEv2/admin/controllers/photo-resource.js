app.controller('photo-resource', function ($scope, $http) {

    //getToken
    $scope.authToken = localStorage.getItem("authToken");
    if ($scope.authToken == null || $scope.authToken == undefined) {
        setTimeout(() => {
            document.location = '/admin#!/login';
        }, 2000);
        sweetError('Please login !');
        return;
    }


    //Get all file
    $scope.getAllFile = function () {
        $scope.isLoading = true;
        // $http.get(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/get-all-file`)
        $http.get(`http://buiquanghieu.xyz/TestSendMail/get-all-file/product`)
            .then(resp => {
                $scope.fileName = resp.data;
                $scope.isLoading = false;
                // console.log(resp.data);
            })
            .catch(error => {
                $scope.isLoading = false;
                console.log(error);
            });
    };
    //Khởi tạo ban đầu
    $scope.getAllFile();

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
            $('#modalUploadImage').modal('hide');
            toastMessage('Thêm mới thành công !', 'success');
            //Khởi tạo ban đầu
            $scope.getAllFile();
        }).catch(error => {
            $scope.isLoading = false;
            toastMessage('Thêm mới thất bại !', 'error');
            console.log(error);
        })
    }


    //remove file
    $scope.removeImage = function (fileName) {
        Swal.fire({
            title: `Bạn có muốn xóa ảnh ${fileName} không ?`,
            // text: `Do you want to delete the file ${fileName} abc?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.apiRemove($scope.folderValue, fileName);
            }
        })
    };

    $scope.apiRemove = function (folder, fileName) {
        $scope.isLoading = true;
        // $http.delete(`http://buiquanghieu.xyz/PRO2111_FALL2022/admin/rest/photo-resource/delete-file/${fileName}`)
        $http.delete(`http://buiquanghieu.xyz/TestSendMail/delete-file/product/${fileName}`)
            .then(resp => {
                $scope.isLoading = false;
                Swal.fire(
                    'Deleted!',
                    `Your file name  ${fileName}  has been deleted.`,
                    'success'
                );
                $scope.getAllFile();
            })
            .catch(error => {
                $scope.isLoading = false;
                console.log(error);
                Swal.fire(
                    'Failed!',
                    `Your file name ${fileName} has been failed.`,
                    'error'
                );
            });
    };


    function toastMessage(text, icon) {
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