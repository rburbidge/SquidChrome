var app = angular.module('options', []);

app.controller('optionsController', function($scope) {
    $scope.strings = {
        errorGetDevices: 'A problem occurred while retrieving your devices', 
        noDevices: 'You have no registered devices. Download and run the Squid app on your device to register!',
        noOtherDevices: 'You have no other registered devices.',
        selectedDeviceNotFound: function(deviceName) {
            return `Your selected device '${deviceName}' was not found. Download and run the Squid app on your device to register!`;
        }
    };

    $scope.setDevice = function(device) {
        $scope.device = device;
        chrome.storage.sync.set(
            { device: device },
            function() {
                $scope.device = device;
            });

        if(!device) return;

        // Remove the device from the other devices list
        var deviceIndex = $scope.devices.findIndex(d => d.id == device.id);
        if(deviceIndex == -1) {
            $scope.devices.push(device);
        } else {
            $scope.devices.splice(deviceIndex, 1);
        }
    };

    var removeDevice = function(devices, deviceId) {
        var index = devices.findIndex(d => d.id == deviceId);
        if(index != -1) {
            devices.splice(index, 1);
            return true;
        }

        return false;
    }

    // Retrieve the settings and display them
    chrome.storage.sync.get(
        { device: null },
        function(items) {
            $scope.device = items.device;
            $scope.$apply();
        });

    $scope.loadingDevices = true;
    devices.getDevices(
        function(devices) {
            $scope.loadingDevices = false;
            $scope.devices = devices;

            // Get the existing device index. If there was an existing device and it no longer exists, then delete the
            // currently selected device and alert the user that it was deleted
            var deviceIndex = -1;
            if($scope.device && (!devices || (deviceIndex = devices.findIndex(d => d.id == $scope.device.id)) == -1)) {
                var oldDevice = $scope.device;
                delete $scope.device;
                alert($scope.strings.selectedDeviceNotFound(oldDevice.name));
            }

            // Set the list of devices to everything but the currently selected device
            if(devices && deviceIndex != -1) {
                devices.splice(deviceIndex, 1);
                $scope.devices = devices;
            }

            $scope.$apply();
        },
        function(error) {
            $scope.loadingDevices = false;
            if(error.responseText) {
                var squidError = JSON.parse(error.responseText);
                if(squidError.code == 'UserNotFound')
                {
                    $scope.error = $scope.strings.noDevices;
                    $scope.setDevice(undefined);
                } else {
                    $scope.error = $scope.strings.errorGetDevices;
                }
            } else {
                $scope.error = $scope.strings.errorGetDevices;
            }
            delete $scope.devices;
            $scope.$apply();
        });
});

