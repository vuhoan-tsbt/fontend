//Khai báo ứng dụng AngularJS
var app = angular.module('myApp', ['ngRoute']);

//Hàm dùng để gọi đến trang mong muốn
app.config(function ($routeProvider) {
    // $locationProvider.hashPrefix("");
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html', //Gọi đến url
            controller: 'homeCtrl' //Gọi đến Controller cần sử dụng
        })

        .when('/about', {
            templateUrl: 'pages/about.html', //Gọi đến url
            controller: 'homeCtrl' //Gọi đến Controller cần sử dụng
        })

        .when('/detail-product/:id', {
            templateUrl: 'pages/detail-product.html', //Gọi đến url
            controller: 'detaiProductCtrl'
        })

        .when('/product', {
            templateUrl: 'pages/product.html', //Gọi đến url
            controller: 'productCtrl'
        })

        .otherwise({
            redirectTo: '/'
        })
});

app.controller('homeCtrl', homeCtrl);
app.controller('detaiProductCtrl', detaiProductCtrl);
app.controller('productCtrl', productCtrl);


