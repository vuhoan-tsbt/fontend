function productCtrl($scope, $http, $routeParams) {
    var min = 0;
    var max = 0;
    var list = []
    $http.get('http://localhost:3000/products')
        .then(function (response) {
            console.log(response.data)
            list = response.data;

            if (list.length >= 1) {
                $scope.maxRange = list[0].price;
                $scope.minRange = list[0].price;
            }
            for (let i = 0; i < list.length; i++) {
        
                if ($scope.maxRange < list[i].price) {
                    $scope.maxRange = list[i].price
                }
        
                if ($scope.minRange > list[i].price) {
                    $scope.minRange = list[i].price
                }
        
            }

        })
        .catch(function (error) {
            console.log(error);

        });

        

        $scope.changeVal = function(){
            document.getElementById('valMin').max = $scope.valRangeMax;
            document.getElementById('valMax').min = $scope.valRangeMin;
        }


    $scope.submitRange = function () {
        if (list.length >= 1) {
            max = list[0].price;
            min = list[0].price;
        }
        for (let i = 0; i < list.length; i++) {

            if (max < list[i].price) {
                max = list[i].price
            }

            if (min > list[i].price) {
                min = list[i].price
            }

        }
        //   alert("Min="+$scope.valRangeMin+" - "+"Max="+$scope.valRangeMax);
        // var min = document.getElementById('valMin').ariaValueText
        alert(document.getElementById('valMax').value)
    }
}