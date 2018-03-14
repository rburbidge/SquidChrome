import { HttpInterceptor } from "@angular/common/http";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';

import { ChromeService } from "../chrome.service";
import { AuthHeader, createAuthHeader } from "../../../../contracts/squid";

/**
 * Adds authorization header for Squid service to HTTP requests.
 */
export class SquidAuthInterceptor implements HttpInterceptor {
    constructor(public readonly chromeService: ChromeService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return Observable.fromPromise(this.chromeService.getAuthToken())
            .mergeMap(authToken => {
                const authHeaderValue = createAuthHeader(AuthHeader.GoogleOAuthAccessToken, authToken);
                const request = req.clone({setHeaders: {'Authorization': authHeaderValue}});
                return next.handle(request);
            });
    }
}