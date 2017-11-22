import { UrlType } from './url-type';

export class UrlHelper {
    public static OptionsPageName = "options.html";

    /**
     * Gets the page type for a URL.
     */
    public static getUrlType(url: string): UrlType {
        if (url.startsWith('chrome-extension')) {
            return url.endsWith(UrlHelper.OptionsPageName)
                ? UrlType.Options
                : UrlType.ChromeExtension;
        }
        if (url.startsWith("chrome")) return UrlType.Chrome;
        if (url.startsWith('https')) return UrlType.Https;
        if (url.startsWith('http')) return UrlType.Http;

        return UrlType.Unknown;
    }

    /**
     * Returns true iff the page type can be sent.
     */
    public static canSendUrlType(type: UrlType): boolean {
        return type == UrlType.Http || type == UrlType.Https;
    }

    public static openOptionsPage(newTab: boolean = false): void {
        if(newTab) {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
                return;
            }

            window.open(chrome.runtime.getURL(UrlHelper.OptionsPageName));
        }
        
        location.href = chrome.runtime.getURL(UrlHelper.OptionsPageName);
    }
}