import { SettingsService } from "./settings.service";
import { createDeviceModels } from "../../../test/squid-helpers";
import { ChromeDeviceModel, convertDeviceModel } from "./squid-converter";

describe('SettingsService', () => {

    let settingsService: SettingsService;

    beforeEach(() => {
        settingsService = new SettingsService();
    });

    describe('constructor', () => {
        it('Sets default settings', () => {
            expect(settingsService.settings).toEqual(SettingsService.createDefault());
        });  
    })

    describe('init()', () => {
        it('Initializes settings to those in chrome storage', (done) => {
            const newSettings = SettingsService.createDefault();
            newSettings.thisDevice = {} as any;
            spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(newSettings));

            settingsService.init()
                .then(() => {
                    expect(settingsService.settings).toEqual(newSettings);
                    expect(settingsService.settings.thisDevice).toBe(newSettings.thisDevice);
                    done();
                });
        });

        it('Inits devices to undefined if not present', (done) => {
            const newSettings = SettingsService.createDefault();
            newSettings.devices = undefined;
            spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(newSettings));

            settingsService.init()
                .then(() => {
                    expect(settingsService.settings.devices).toEqual(newSettings.devices);
                    done();
                });
        });

        it('Inits devices to ChromeDeviceModel if present', (done) => {
            const newSettings = SettingsService.createDefault();
            newSettings.devices = createDeviceModels() as ChromeDeviceModel[];
            spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(newSettings));

            settingsService.init()
                .then(() => {
                    // This also checks that the devices have the correct type
                    expect(settingsService.settings.devices).toEqual(newSettings.devices.map(convertDeviceModel));
                    done();
                });
        });
    });
});