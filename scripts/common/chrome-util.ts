export class ChromeUtil {
    /**
     * Returns true if the extension was installed from an unpacked folder, rather than from a .crx file.
     */
    public static isDevMode(): boolean {
        return !('update_url' in chrome.runtime.getManifest());
    }
}