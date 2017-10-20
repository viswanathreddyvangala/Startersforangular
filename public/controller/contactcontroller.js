var app = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'ngCookies']);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html'
        })
        .when('/chat', {
            templateUrl: 'chat.html',
            authnticated: true
        })
        .when('/upload', {
            templateUrl: 'upload.html',
            authnticated: true
        })
        .when('/login', {
            templateUrl: 'login.html'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            authnticated: true

        })

        .when('/registration', {
            templateUrl: 'registration.html'

        })
        .when('/weather', {
            templateUrl: 'weather.html',
            authnticated: true

        })
        .otherwise({
            redirectTo: '<h1>NO FILE </h1>'
        });
});
// app.run(function($routeScope,$location,$userModel){
//   $rootScope.someData = {message: "hello"};
//  // $routeScope.$on("$routeChangeStart",function(event,next,current ){
//  //  if(next.$$route.authnticated){
//  //      if(!userModel.getAuthStatus()){
//  //          $location.path('/')
//  //      }
//  //  }
//  //  if(next.$$route.originalPath=='/'){
//  //      if(!userModel.getAuthStatus()){
//  //          $location.path(current.$$route.originalPath);
//  //      }
//  //  }
//  // })

// });
app.controller('weathercontroller', function($scope, $http) {
    var vm = $scope;
    var weatherarray = [];
    $scope.entries = [];
    vm.findweather = function() {
        vm.channelinfo = "THIS IS WAETHER REPORT ";
        var locationurl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + vm.area + "&key=AIzaSyB8KAmDVEk_051yeJWvShPLyKf5HsQL5SY"
        console.log(locationurl)
        $http.get(locationurl).success(function(data) {
            console.log(data)
            vm.lat = data.results[0].geometry.location.lat;
            vm.long = data.results[0].geometry.location.lng;
            console.log(vm.long)
            var apikey = "421a28205b5254b184227e106417a434";
            var weatherurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + vm.lat + "&lon=" + vm.long + "&APPID=" + apikey;
            console.log(weatherurl)
            $http.get(weatherurl).success(function(responce) {
                console.log(responce)
                weatherarray.push(responce)
                $scope.allweatherdata = weatherarray;
                console.log($scope.allweatherdata)
                localStorage.setItem('testObject', JSON.stringify(weatherarray));
            })
        })
    }
    var retrievedObject = localStorage.getItem('testObject');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));
    $scope.allweatherdata = JSON.parse(retrievedObject);
})
app.controller('contactcontroller', function($scope, $http) {
    var refresh = function() {
        $http.get("/contactlist").success(function(responce) {
            console.log("got responce")
            $scope.contactlist = responce;
        })
    }

    refresh()

    $scope.addcontact = function() {

        $http.post("/contactlist", $scope.contact).success(function(responce) {
            refresh();
            $scope.contact = "";
        })
    }
    $scope.deletecontact = function(id) {
        $http.delete("/contactlist/" + id).success(function(responce) {
            refresh();
        });
    };

    $scope.deleteall = function() {
        $http.delete("/contactlist/").success(function(responce) {
            refresh();
        });
    };

    $scope.editcontact = function(id) {
        $http.get("/contactlist/" + id).success(function(responce) {
            $scope.contact = responce;
        })

    }
    $scope.updatecontact = function(id) {
        $http.put("/contactlist/" + $scope.contact._id, $scope.contact).success(function(responce) {
            refresh();
            $scope.contact = "";
        })

    }

    $scope.getall = function() {
        $http.get("/registration/").success(function(responce) {
            console.log(responce);
        })
    }
});
app.controller("registration", function($scope, $http, $window) {
    $scope.registeruser = function() {
        $http.post("/registration", $scope.register).success(function(responce) {
            console.log("redirecting to contact")
            $window.location.href = '#login';

        })
    }

});
app.controller("login", ['$scope', '$location', '$userModel'], function($scope, $location, $userModel) {

    $scope.loginsubmit = function(logindata) {

        userModel.dologin($scope.login).then(function() {
            $location.path('/chat');
        })
    }


    // $scope.loginsubmit = function() {
    //  console.log($scope.login)
    //      $http.put("/auth" , $scope.login).success(function(responce) {
    //         if(responce == null)
    //         {
    //          $window.alert("authticationfailed");
    //         }
    //        else{
    //        $window.location.href = '#contact';
    //        }
    //     })
    // }

});
app.factory("userModel", ['$http', '$cookies', '$window'], function($cookies, $http, $window) {
    var userModel = {};
    userModel.dologin = function() {

        $http.put("/auth", $scope.login).success(function(responce) {
            if (responce == null) {
                $window.alert("authticationfailed");
            } else {
                $cookies.put('auth', responce);
            }
        })
    }
    userModel.getAuthStatus = function() {
        var status = $cookies.get('auth');
        if (status) return true;
        else return false;
    }
    return userModel;

});

// app.controller("mailController",function ($scope) {
//  $scope.loading = false;
//   $scope.send = function (mail){
//     $scope.loading = true;
//     $http.post('/sendmail', {
//       from: 'CodeNx <admin@angularcode.com>',
//       to: 'vvangala@opentext.com',
//       subject: 'Message from AngularCode',
//       text: mail.message
//     }).then(res=>{
//         $scope.loading = false;
//         $scope.serverMessage = 'Email sent successfully';
//     });
// }
// });
// app.factroy('socket',function(){
//  var socket=io.connect("http://localhost:3000");
//  return socket;
// })
// app.controller("chatcontroller",function($scope ){
//  $scope.msgs = [];
//  var socket=io.connect('http://127.0.0.1:3000')
//  $scope.sendMsg =function(){
//      socket.emit('send msg',$scope.msg.text)
//  }
//  socket.on('get msg',function(data){
//      $scope.msg.push(data);
//      $scope.digest()
//  })
//})
// app.factory('socket', ['$rootScope', function($rootScope) {
//   var socket = io.connect();

//   return {
//     on: function(eventName, callback){
//       socket.on(eventName, callback);
//     },
//     emit: function(eventName, data) {
//       socket.emit(eventName, data);
//     }
//   };
// }]);
// app.controller('chatcontroller', function($scope, socket) {
//   $scope.msgs = [];
//   $scope.currentCustomer = {};

//   $scope.sendMsg = function() {
//     socket.emit('send msg', $scope.msg.text);
//   };

//   socket.on('get msg', function(data) {
//     $scope.msg.push(data.customer);
//          $scope.digest()
//       })
//   });

app.factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect();

    return {
        on: function(eventName, callback) {
            socket.on(eventName, callback);
        },
        emit: function(eventName, data) {
            socket.emit(eventName, data);
        }
    };
}]);

app.controller('IndexController', function($scope, socket) {
    $scope.newCustomers = [];
    $scope.currentCustomer = {};

    $scope.join = function() {
        socket.emit('put data', $scope.currentCustomer);
    };

    socket.on('get data', function(data) {
        $scope.$apply(function() {
            $scope.newCustomers.push(data);
            $scope.currentCustomer.msg = '';
        });
    });
});
app.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };

});
app.controller('uploadcontroller', ['Upload', '$window', function(Upload, $window) {
    console.log("Coming into controller")
    var vm = this;
    vm.submit = function() { //function to call on form submit
        if (vm.upload_form.file.$valid) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
    vm.upload = function(file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data: {
                file: file
            } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);