let App = angular.module('App', []);

App.controller('IndexCtrl', function ($scope, $http, $log) {

    const PREFIX = "@WK@_";

    let file = $("#file");

    $scope.reset = function () {
        $(".custom-file-label").text("Upload a kube config");
        $scope.msg = "";
        $scope.item = {
            type: "config"
        };
    };

    file.bind('change', function (e) {
        let f = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(f || "");
        reader.onload = function () {
            $(".custom-file-label").text(f.name);
            $scope.$apply(function () {
                    $scope.item.key = PREFIX + $scope.item.name;
                    $scope.item.kubeConfig = window.btoa(this.result);
                }
            );
        }
    });

    $scope.list = function () {
        $scope.items = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.includes(PREFIX)) {
                $scope.items.push(angular.fromJson(localStorage.getItem(key)));
            }
        }
    };

    $scope.connect = function (item) {
        const HOST = "http://127.0.0.1:8080";
        const URL = HOST + "/api/kube-config";
        return $http.post(URL, item).then(function (response) {
            if (response.data.success) {
                let shellUrl = HOST + "/terminal?token=" + response.data.token;
                window.open(shellUrl, "_blank");
            } else {
                $scope.error(response.data.message);
                $log.error(response.data.message);
            }
        }, function (response) {
            $scope.error(response);
            $log.error(response)
        });
    };

    $scope.delete = function (item) {
        localStorage.removeItem(item.key);
        $scope.list();
    };

    $scope.error = function (msg) {
        if (angular.isObject(msg)) {
            msg = angular.toJson(msg);
        }
        let html =
            '<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">\n' +
            '                ' + msg +
            '                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '                    <span aria-hidden="true">&times;</span>\n' +
            '                </button>\n' +
            '            </div>';
        $(".clearfix").after(html);
    };

    $scope.submit = function () {
        if (!$scope.item.name) {
            $scope.msg = "Name is required.";
            return;
        }
        let item = localStorage.getItem(PREFIX + $scope.item.name);
        if (item) {
            $scope.msg = "Name already exist.";
            return;
        }
        if ($scope.item.type === "config") {
            if (!$scope.item.kubeConfig) {
                $scope.msg = "Kube config is required.";
                return;
            }
            delete $scope.item.apiServer;
            delete $scope.item.token;
        }

        if ($scope.item.type === "token") {
            if (!$scope.item.apiServer) {
                $scope.msg = "ApiServer is required.";
                return;
            }
            if (!$scope.item.token) {
                $scope.msg = "Token is required.";
                return;
            }
            delete $scope.item.kubeConfig;
        }
        localStorage.setItem($scope.item.key, angular.toJson($scope.item));

        // clear
        $('#add').modal('hide');
        $scope.reset();
        $scope.list();
    };

    $scope.reset();
    $scope.list();
});

//
// (function () {
//     let items = [];
//     const PREFIX = "@WK@_";
//     let file = $("#file");
//     let name = $("#name");
//     let alert = $(".alert");
//     let label = $(".custom-file-label");
//     let submit = $("#submit");
//
//
//     function list() {
//         items = [];
//         let html = "";
//         for (let i = 0; i < localStorage.length; i++) {
//             let key = localStorage.key(i);
//             if (key.includes(PREFIX)) {
//                 let item = angular.fromJson(localStorage.getItem(key));
//                 items.push(item);
//                 html = html + '<div id="' + item.name + '" class="d-flex w-100 justify-content-between">\n' +
//                     '                        <div class="mt-2">' + item.name + '</div>\n' +
//                     '                        <small class="text-muted">\n' +
//                     '                            <button class="btn btn-link" onclick="connect(\'' + item.key + '\')">connect</button>\n' +
//                     '                            <button class="btn btn-link" onclick="del(\'' + item.key + '\')">delete</button>\n' +
//                     '                        </small>\n' +
//                     '                    </div>';
//             }
//         }
//         $(".list-group-item").html(html);
//     }
//
//
//
//     file.bind('change', function (e) {
//         let f = e.target.files[0];
//         let reader = new FileReader();
//         reader.readAsText(f || "");
//         reader.onload = function () {
//             label.text(f.name);
//             let item = {
//                 type: type.val(),
//                 key: PREFIX + name.val(),
//                 name: name.val(),
//                 kubeConfig: this.result
//             };
//             localStorage.setItem(item.key, angular.toJson(item));
//         }
//     });
//
//     submit.bind('click', function () {
//         if (!name.val()) {
//             alert.text("please enter a name.");
//             alert.alert();
//             return;
//         }
//         let item = localStorage.getItem(PREFIX + name.val());
//         if (item) {
//             alert.text("the name already exist.");
//             alert.alert();
//             return;
//         }
//         $('#add').modal('hide');
//         name.val("");
//         label.text("Upload a kube config file");
//         list();
//     });
//
//     list();
// })();