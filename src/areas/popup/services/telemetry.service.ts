import { Config } from "../../../config/config";
import { AppInsights } from "applicationinsights-js";

/**
 * The telemetry logging service using Azure App Insights.
 * 
 * This uses the non-module (global) version of applicationinsights-js. This is because the module version requires
 * loading from a dynamic CDN endpoint. We do not load from the CDN because the Chrome extension's content security
 * policy (see manifest.json) includes a whitelist of sources to load from and will block any dynamic CDN.
 * 
 * See https://blogs.msdn.microsoft.com/premier_developer/2017/05/11/add-application-insights-to-an-angular-spa/. ai.js
 * is the file normally downloaded from the CDN, but it is included statically in this app (e.g. popup.html).
 */
export class TelemetryService {

    private appInsights: Microsoft.ApplicationInsights.IAppInsights;

    public init(): void {
        const config = new Config();
        var snippet = {
            config: {   
                instrumentationKey: config.insightsKey
            }   
        };   
        
        var init = new (Microsoft.ApplicationInsights as any).Initialization(snippet);
        this.appInsights = init.loadAppInsights();
    }

    public trackPageView(name: string): void {
        this.appInsights.trackPageView(name);
    }

    /**
     * @param error The Error object or string being tracked.
     * @param location Name of the component/method where the exception is being tracked.
     * @param properties A set of key value pairs associated with the exception.
     */
    public trackException(error: Error | string, location: string, properties: ExceptionProperties): void {
        // That the TypeScript signature implies that this only takes Error, but also takes string
        this.appInsights.trackException(error as Error, location, properties as any);
        this.appInsights.flush();
    }
}

/**
 * Additional diagnostic data logged with exceptions.
 */
export interface ExceptionProperties {
    /** The complete URL at the time of the exception. */
    location: string;
}