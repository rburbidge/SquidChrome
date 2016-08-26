var app = angular.module('options', []);
app.controller('optionsController', function($scope) {
    $scope.setDevice = function(device) {
        $scope.device = device;
        chrome.storage.sync.set(
            { device: device },
            function() {
                $scope.device = device;
            });
    };

    chrome.storage.sync.get(
        { device: null },
        function(items) {
            $scope.device = items.device;
        });

    devices.getDevices(
        function(devices) {
            $scope.devices = devices;
            $scope.$apply();
        },
        function(error) {
            $scope.error = (error.status == 404)
                ? "You haven't registered any devices"
                : 'A problem occurred while retrieving your devices';
            delete $scope.devices;
            $scope.$apply();
        });
});

