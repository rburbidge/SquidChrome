import { TestBed, async } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { defer } from "rxjs/observable/defer";

import { DeviceService } from "./device.service";
import { ChromeService } from "./chrome.service";

describe('DeviceService', () => {
    let service: DeviceService;
    let httpClient: HttpClient;
    let chrome: ChromeService;
    let httpRequestSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DeviceService,
                { provide: ChromeService, useValue: new ChromeService() }
            ]
        });
    }));

    beforeEach(() => {
        service = TestBed.get(DeviceService);
        httpClient = TestBed.get(HttpClient);
        chrome = TestBed.get(ChromeService);

        httpRequestSpy = spyOn(httpClient, 'request')
    });

    describe('Authorization', () => {
        it('Adds Authorization header to request options', (done) => {
            const authToken = 'The auth token';

            spyOn(chrome, 'getAuthToken').and.returnValue(Promise.resolve(authToken));

            httpRequestSpy.and.returnValue(asyncData(Promise.resolve([])));

            service.getDevices()
                .then(() => {
                    expect(getSentHeader('Authorization')).toBe(`Bearer Google OAuth Access Token=${authToken}`);
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