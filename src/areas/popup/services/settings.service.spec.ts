import { SettingsService, Settings } from "./settings.service";

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
    });
});