function detaiProductCtrl($scope, $http, $routeParams) {
    $scope.detail_product = [];
    // clearForm();
    $scope.checkValueSize = false;
    document.getElementById('btn_addCart').disabled= true;

    $http.get('http://localhost:3000/products/' + $routeParams.id)
        .then(function (response) {
            console.log(response.data)
            $scope.detail_product = response.data;
        })
        .catch(function (error) {
            console.log(error);

        });

    $scope.clickSize = function (id,size) {
        alert('id: '+id+' - '+'size: '+size);
        $scope.checkValueSize = true;
        document.getElementById('btn_addCart').disabled= false;
    }
}