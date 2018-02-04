import { UrlHelper } from './url-helper';
import { UrlType } from './url-type';

describe('UrlHelper', () => {
    describe('getUrlType()', () => {
        it('Returns known UrlTypes', () => {
            // Real URLs
            test("http://www.google.com", UrlType.Http);
            test("https://www.google.com", UrlType.Https);

            // Prefixes that code is based on
            test("http", UrlType.Http);
            test("https", UrlType.Https);
            test("chrome", UrlType.Chrome);
            test("chrome-extension", UrlType.ChromeExtension);
            test("chrome-extension something something options.html", UrlType.Options);
        });
        
        it('Returns Unknown', () => {
            test("htttp://www.google.com", UrlType.Unknown);
            test("htttps", UrlType.Unknown);
            test(" chrome", UrlType.Unknown);
            test("efwjogi", UrlType.Unknown);
        });
    });
});

function test(url: string, expected: UrlType) {
    const result = UrlHelper.getUrlType(url);
    expect(result).toBe(expected, `Did not expect  ${UrlType[result]} for URL ${url}`);
}
