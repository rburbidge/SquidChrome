import { convertDeviceModel, ChromeDeviceModel } from "./squid-converter";
import { DeviceModel, DeviceType } from "../../../contracts/squid";
import { createDevice, createDeviceModels, createDeviceModel } from "../../../test/squid-helpers";

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
                const device = createDeviceModel();
                device.deviceType = deviceType;
                const actual: ChromeDeviceModel = convertDeviceModel(device);
                expect(actual.getIcon()).toBe(expected);
            }
        });

        describe('sort()', () => {
            it('Does nothing when devices is falsy', () => {
                ChromeDeviceModel.sort(undefined);
            });

            it('Does nothing when devices is empty', () => {
                const devices = [];
                ChromeDeviceModel.sort(devices);
                expect(devices).toEqual([]);
            })

            it('Sorts devices when this thisDeviceId is undefined', () => {
                const deviceA = createDeviceWithName('DEF');
                const deviceB = createDeviceWithName('ABC');
                const deviceC = createDeviceWithName('AAC');

                const devices = [deviceA, deviceB, deviceC];
                ChromeDeviceModel.sort(devices);
                expect(devices).toEqual([deviceC, deviceB, deviceA]);
            });

            it('Sorts devices with thisDevice at the start', () => {
                const deviceA = createDeviceWithName('DEF');
                const deviceB = createDeviceWithName('ABC');
                deviceB.id = 'foo';
                const deviceC = createDeviceWithName('AAC');

                const devices = [deviceA, deviceB, deviceC];
                ChromeDeviceModel.sort(devices, deviceB.id);
                expect(devices).toEqual([deviceB, deviceC, deviceA]);
            });

            it('Sorts devices when this thisDeviceId when the device is not in the list', () => {
                const deviceA = createDeviceWithName('DEF');
                const deviceB = createDeviceWithName('ABC');
                deviceB.id = 'foo';
                const deviceC = createDeviceWithName('AAC');

                const devices = [deviceA, deviceB, deviceC];
                ChromeDeviceModel.sort(devices, 'foo, not in the set of devices');
                expect(devices).toEqual([deviceC, deviceB, deviceA]);
            });

            function createDeviceWithName(name: string): ChromeDeviceModel {
                const device = createDevice();
                device.name = name;
                return device;
            }
        });
    });
});