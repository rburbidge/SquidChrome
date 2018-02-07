import { convertDeviceModel, ChromeDeviceModel } from "./squid-converter";
import { DeviceModel, DeviceType } from "../../../contracts/squid";

describe('SquidConverter', () => {
    describe('convertDeviceModel()', () => {
        it('Returns a ChromeDeviceModel that contains all of the properties of the original DeviceModel', () => {
            const device = createDevice();
            const actual: ChromeDeviceModel = convertDeviceModel(device);
            expect(actual.deviceType).toBe(device.deviceType);
            expect(actual.id).toBe(device.id);
            expect(actual.name).toBe(device.name);
        });
    });

    describe('ChromeDeviceModel', () => {
        describe('getIcon()', () => {
            it('Returns icon for Android device', () => {
                testIcon(DeviceType.android, 'phone_android');
            });
    
            it('Returns icon for Chrome device', () => {
                testIcon(DeviceType.chrome, 'laptop');
            });
    
            it('Returns Android icon for other device types', () => {
                testIcon(undefined, 'phone_android');
            });
    
            function testIcon(deviceType: DeviceType, expected: string): void {
                const device = createDevice();
                device.deviceType = deviceType;
                const actual: ChromeDeviceModel = convertDeviceModel(device);
                expect(actual.getIcon()).toBe(expected);
            }
        });
    });

    function createDevice(): DeviceModel {
        return {
            id: 'id',
            name: 'name',
            deviceType: DeviceType.chrome
        };
    }
});