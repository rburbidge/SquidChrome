import { TestBed, async } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { defer } from "rxjs/observable/defer";

import { DeviceService } from "./device.service";
import { ChromeService } from "./chrome.service";
import { SettingsService, Settings } from "./settings.service";
import { createDevices } from "../../../test/squid-helpers";

describe('DeviceService', () => {
    let service: DeviceService;
    let httpClient: HttpClient;
    let chrome: ChromeService;
    let settingsService: SettingsService;
    let httpRequestSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DeviceService,
                SettingsService,
                { provide: ChromeService, useValue: new ChromeService() }
            ]
        });
    }));

    beforeEach(() => {
        service = TestBed.get(DeviceService);
        httpClient = TestBed.get(HttpClient);
        chrome = TestBed.get(ChromeService);
        settingsService = TestBed.get(SettingsService);
        httpRequestSpy = spyOn(httpClient, 'request');

        spyOn(settingsService, 'setDevices').and.returnValue(Promise.resolve());
    });

    describe('getDevicesCached()', () => {
        it('Returns cached devices', (done) => {
            const devices = createDevices();
            spyOn(service, 'getDevices').and.returnValue(Promise.resolve(devices));
            settingsService.settings.devices = devices;
            service.getDevicesCached().subscribe(
                (devices) => {
                    expect(devices).toEqual(settingsService.settings.devices);
                    done();
                });
        });

        it('Returns server`s devices if not cached', (done) => {
            spyOn(service, 'getDevices').and.returnValue(Promise.resolve([]));
            
            settingsService.settings.devices = null;
            service.getDevicesCached().subscribe(
                (devices) => {
                    expect(devices).toEqual([]);
                    expect(service.getDevices).toHaveBeenCalledTimes(1);

                    // Verify that latest devices were cached
                    expect(settingsService.setDevices).toHaveBeenCalledWith([]);
                    done();
                });
        });
    });

    /**
     * Create async observable that emits-once and completes after a JS engine turn.
     * Copied from https://angular.io/guide/testing.
     */
    function asyncData<T>(data: T) {
        return defer(() => Promise.resolve(data));
    }

    /**
     * Gets a header that was sent in the latest HTTP request.
     * @param key The header key. e.g. "Content-Type"
     */
    function getSentHeader(key: string) {
        // The angular object uses lower case keys
        key = key.toLowerCase();

        let options = httpRequestSpy.calls.mostRecent().args[2];
        options.headers.lazyInit();
        return options.headers.headers.get(key)[0];
    }
})