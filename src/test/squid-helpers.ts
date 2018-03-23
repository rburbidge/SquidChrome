import { convertDeviceModel, ChromeDeviceModel } from "../areas/popup/services/squid-converter";
import { DeviceType } from "../contracts/squid";

export function createDevice(): ChromeDeviceModel {
    return convertDeviceModel({
        name: 'Pixel 2 XL',
        id: 'Device ID',
        deviceType: DeviceType.android
    });
}

export function createDevices(): ChromeDeviceModel[] {
    return [
        {
            name: 'Pixel 2 XL',
            id: 'Device ID 1',
            deviceType: DeviceType.android
        },
        {
            name: 'Chrome Browser',
            id: 'Device ID 2',
            deviceType: DeviceType.chrome
        },
        {
            name: 'Nexus 5X',
            id: 'Device ID 3',
            deviceType: DeviceType.android
        },
        {
            name: 'Samsung Galaxy',
            id: 'Device ID 4',
            deviceType: DeviceType.android
        }
    ].map(convertDeviceModel);
}