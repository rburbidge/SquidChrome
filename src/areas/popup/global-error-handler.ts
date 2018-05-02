import { Injectable, ErrorHandler, Injector } from "@angular/core";
import { TelemetryService } from "./services/telemetry.service";
import { WindowService } from "./services/window.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public constructor(private injector: Injector) { }

    public handleError(error: any): void {
        console.error(error); // Log this for development purposes
        
        const telemetryService = this.injector.get(TelemetryService);
        const window = this.injector.get(WindowService);

        telemetryService.trackException(
            error,
            GlobalErrorHandler.name + '.handleError()',
            {
                url: window.getLocationHref()
            });
        
        // Do not re-throw the error, so as to hopefully still allow the application to function
    }
}