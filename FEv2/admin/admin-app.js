const app = angular.module("admin-app", ["ngRoute"])

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/admin/home/home-index.html',
            controller: 'pay-ctrl'
        })
        .when('/option', {
            templateUrl: '/admin/options/option-index.html',
            controller: 'option-ctrl'
        })

        .when('/product', {
            templateUrl: '/admin/products/product-index.html',
            controller: 'product-ctrl'
        })
        .when('/order', {
            templateUrl: '/admin/orders/order-index.html',
            controller: 'order-ctrl'
        })
        .when('/return', {
            templateUrl: '/admin/productReturns/return-index.html',
            controller: 'productReturn-ctrl'
        })
        .when('/return_policy', {
            templateUrl: '/admin/productReturns/return-policy.html',
        })
        .when('/photo-resource', {
            templateUrl: '/admin/photoresource/photo-resource.html',
            controller: 'photo-resource'
        })
        .when('/user-manager', {
            templateUrl: '/admin/users/user-index.html',
            controller: 'user-ctrl'
        })
        .when('/sale-manager', {
            templateUrl: '/admin/sales/sale-index.html',
            controller: 'sale-ctrl'
        })
        .when('/login', {
            templateUrl: '/admin/login/login.html',
            controller: 'login-ctrl'
        })
        .when('/profile', {
            templateUrl: '/admin/profile/profile.html',
            controller: 'profileCtrl'
        })
        .when('/pay_success', {
            templateUrl: '/admin/statusPage/paySuccess.html'
        })
        .when('/pay_fail', {
            templateUrl: '/admin/statusPage/payFail.html'
        })
        .when('/setting', {
            templateUrl: '/admin/settings/setting-index.html',
            controller: 'setting-ctrl'
        })
        .when('/update-price', {
            templateUrl: '/admin/products/update-price.html',
            controller: 'update-price-ctrl'
        })
        .otherwise({
            redirectTo: '/'
        })

})

app.controller("admin-ctrl", function ($scope, $http) {
    $scope.isLogin = localStorage.getItem('authToken');
    var timeout = 24 * 60 * 60 * 1000;
    sessionStorage.setItem('setupTime', timeout);
    $scope.lang = sessionStorage.getItem('lang');
    if ($scope.lang == null) {
        sessionStorage.setItem('lang', 'vi');
    }
    const API_LANGUAGE_NAV_ADMIN = 'http://buiquanghieu.xyz/PRO2111_FALL2022/rest/language/nav/admin'
    const API_CHANGE_LANGUAGE = 'http://buiquanghieu.xyz/PRO2111_FALL2022/rest-change-locale-admin'
    //Load laguage nav
    $scope.isLoading = true;
    $http.get(`${API_LANGUAGE_NAV_ADMIN}?lang=${$scope.lang}`)
        .then(resp => {
            $scope.languageNav = resp.data;
            $scope.isLoading = false;
        })
        .catch(error => {
            console.log(error);
            $scope.isLoading = false;
        })
    listCollapse = document.getElementById('dashboard-collapse')
    productEvent = document.getElementById('product-icon')

    orderCollapse = document.getElementById('order-collapse')
    orderEvent = document.getElementById('order-icon')

    $scope.navClick = {
        home() {
            location.href = "#!"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }

        },
        product() {
            try {
                location.href = "#!product"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')
                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        order() {
            try {
                location.href = "#!order"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')

                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        update_price() {
            try {
                location.href = "#!update-price"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')

                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        return() {
            try {
                location.href = "#!return"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')
                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        return_policy() {
            try {
                location.href = "#!return_policy"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')
                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        option() {
            try {
                location.href = "#!option"
                if ($(window).width() <= 820) {
                    $('#close-toggle').click();
                }
                if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                    listCollapse.classList.toggle('show')
                    productEvent.classList.toggle('product-menu')
                } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                    orderCollapse.classList.toggle('show')
                    orderEvent.classList.toggle('product-menu')
                }
            } catch (error) {

            }
        },
        photo_resource() {
            location.href = "#!photo-resource"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }
        },
        sale_manager() {
            location.href = "#!sale-manager"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }
        },
        account_manager() {
            location.href = "#!user-manager"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }
        },
        login() {
            location.href = "#!login"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }

        },
        profile() {
            location.href = "#!profile"
            if ($(window).width() <= 820) {
                $('#close-toggle').click();
            }
            if (listCollapse.classList.contains('show') && productEvent.classList.contains('product-menu')) {
                listCollapse.classList.toggle('show')
                productEvent.classList.toggle('product-menu')
            } else if (orderCollapse.classList.contains('show') && orderEvent.classList.contains('product-menu')) {
                orderCollapse.classList.toggle('show')
                orderEvent.classList.toggle('product-menu')
            }
        },
        languageVN() {
            $scope.isLoading = true;
            // $http.get(`${API_CHANGE_LANGUAGE}/vi`)
            //     .then(resp => {
            //         $scope.isLoading = false;
            //         location.reload();
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         $scope.isLoading = false;
            //     })
            sessionStorage.setItem('lang', 'vi');
            location.reload();
        },
        languageUS() {
            sessionStorage.setItem('lang', 'en');
            location.reload();
        },
        logout() {
            Swal.fire({
                title: "Bạn có muốn đăng xuất ?",
                // text: "Sign out !",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes !'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    $scope.isLogin = null;
                    location.href = "#!login"
                }
            })
        }
    }
});

// test
function resize() {
    if ($(window).width() <= 820) {
        $('#nav-bar').removeClass('showNav');
        $('#body-pd').removeClass('body-pd');
    } else {
        $('#nav-bar').addClass('showNav');
        $('#body-pd').addClass('body-pd');
    }
}

//watch window resize
$(window).on('resize', function () {
    resize()
});

document.addEventListener("DOMContentLoaded", function (event) {

    if ($(window).width() <= 820) {
        $('#nav-bar').removeClass('showNav');
    }
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {

            toggle.addEventListener('click', () => {
                // show navbar

                nav.classList.toggle('showNav')
                bodypd.classList.toggle('body-pd')
                // add padding to header

            })
        }
    }

    const showNav = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)
        var a = nav.classList

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('mousemove', () => {
                var dem = 0
                for (let index = 0; index < a.length; index++) {
                    if (a[index] == 'showNav') {
                        dem = 1
                    }
                }
                if (dem == 0) {
                    // show navbar
                    nav.classList.add('showNav')
                    bodypd.classList.toggle('body-pd')
                    // add padding to header

                }
            })
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')
    showNavbar('close-toggle', 'nav-bar', 'body-pd', 'header')
    showNav('nav-bar', 'nav-bar', 'body-pd', 'header')

    const rotateProductManager = (toggleId, productManageId) => {
        const toggle = document.getElementById(toggleId),
            productManage = document.getElementById(productManageId)
        if (toggle && productManage) {
            toggle.addEventListener('click', () => {
                productManage.classList.toggle('product-menu')
            })
        }
    }

    rotateProductManager('product-manager', 'product-icon')
    rotateProductManager('order-manager', 'order-icon')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // Your code to run since DOM is loaded and ready
});
