import { Config } from "../../../config/config";

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
        // Initialize the App Insights client
        const config = new Config();
        const init = new (Microsoft.ApplicationInsights as any).Initialization({
            config: {   
                instrumentationKey: config.insightsKey
            }   
        });
        this.appInsights = init.loadAppInsights();
    }

    /** Tracks a page view at the given URL. */
    public trackPageView(url: string): void {
        this.appInsights.trackPageView(url);
    }

    /**
     * Tracks an uncaught exception.
     * @param error The Error object or string being tracked.
     * @param location Name of the component/method where the exception is being tracked.
     * @param properties A set of key value pairs associated with the exception.
     */
    public trackException(error: Error | string, location: string, properties: ExceptionProperties): void {
        // That the TypeScript signature implies that this only takes Error, but also takes string
        this.appInsights.trackException(error as Error, location, properties as any);
        this.appInsights.flush();
    }

    /**
     * Tracks an iframe dependency.
     * @param id The ID of the partner owning the src URL.
     * @param url The src URL.
     * @param totalTime The total time in milliseconds.
     * @param success Whether the iframe loaded correctly.
     */
    public trackIFrameDependency(id: string, url: string, totalTime: number, success: boolean): void {
        this.appInsights.trackDependency(id, 'GET', url, undefined, totalTime, success, success ? 200 : 500);
        this.appInsights.flush();
    }
}

/**
 * Additional diagnostic data logged with exceptions.
 */
export interface ExceptionProperties {
    /** The complete URL at the time of the exception. */
    url: string;
}