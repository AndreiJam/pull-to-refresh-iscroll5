angular.module('iscroll')
    .controller('myCtrl', function ($scope, $q) {
        $scope.onReload = function () {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.resolve(true);
            }, 2000);
            return deferred.promise;
        };
    });