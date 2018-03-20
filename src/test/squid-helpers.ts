import { convertDeviceModel, ChromeDeviceModel } from "../areas/popup/services/squid-converter";
import { DeviceType } from "../contracts/squid";

export function createDevice(): ChromeDeviceModel {
    return convertDeviceModel({
        name: 'Pixel 2 XL',
        id: 'Device ID',
        deviceType: DeviceType.android
    });
}