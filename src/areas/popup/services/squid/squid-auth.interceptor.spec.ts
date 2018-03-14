import { HttpInterceptor } from "@angular/common/http/src/interceptor";
import { HttpHandler } from "@angular/common/http";
import { HttpEvent } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";

import { SquidAuthInterceptor } from "./squid-auth.interceptor";
import { ChromeService } from "../chrome.service";
import { MockChromeService } from "../testing/chrome.service.mock";
import { createAuthHeader, AuthHeader } from "../../../../contracts/squid";

describe('SquidAuthInterceptor', () => {
    let chromeService: ChromeService;
    let interceptor: HttpInterceptor;

    beforeEach(() => {
        chromeService = new ChromeService();
        interceptor = new SquidAuthInterceptor(chromeService)
    });

    it('Adds Authorization header', (done) => {
        const authToken = 'The auth token';
        spyOn(chromeService, 'getAuthToken').and.returnValue(Promise.resolve(authToken));
        
        let req = new HttpRequest('GET', 'https://foo.bar');
        let handler: HttpHandler = { handle: () => {}} as any;
        let handleSpy = spyOn(handler, 'handle').and.returnValue(Observable.fromPromise(Promise.resolve()));

        interceptor.intercept(req, handler).subscribe(() => {
            const req = handleSpy.calls.mostRecent().args[0];
            const authHeader = req.headers.lazyUpdate[0];

            expect(authHeader['name']).toBe('Authorization');
            expect(authHeader['value']).toBe(createAuthHeader(AuthHeader.GoogleOAuthAccessToken, authToken));

            done();
        });
    });
});