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
            $scope.item.kubeConfig = window.btoa(this.result);
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
        const CONFIG_URL = "api/kube-config";
        const TOKEN_URL = "api/kube-token";
        let url = item.type === "config" ? CONFIG_URL : TOKEN_URL;
        return $http.post(url, item).then(function (response) {
            if (response.data.success) {
                let shellUrl = "terminal?token=" + response.data.token;
                window.open(shellUrl, "_blank");
            } else {
                $scope.error(response.data.message);
                $log.error(response.data.message);
            }
        }, function (response) {
            if (response.data.message) {
                $scope.error(response.data.message);
            } else {
                $scope.error(response);
            }
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
        }

        $scope.item.key = PREFIX + $scope.item.name;
        localStorage.setItem($scope.item.key, angular.toJson($scope.item));

        // clear
        $('#add').modal('hide');
        $scope.reset();
        $scope.list();
    };

    $scope.reset();
    $scope.list();
});