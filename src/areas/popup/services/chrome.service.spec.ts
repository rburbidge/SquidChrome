import { ChromeService } from "./chrome.service";
import { ChromeErrorModel } from "./squid-converter";
import { ErrorCode } from "../../../contracts/squid";

describe('ChromeService', () => {
    let service: ChromeService;

    beforeEach(() => {
        // Clear the last error before each test because this is set on a static namespace field
        chrome.runtime.lastError = undefined;

        service = new ChromeService();
    });

    describe('getAuthToken', () => {
        beforeEach(() => {
            (window.chrome as any).identity = {
                getAuthToken: function(args, callback) {
                    callback('The auth token');
                }
            };
        })  

        it('Returns an auth token on success', (done) => {
            service.getAuthToken(false)
                .then(authToken => {
                    expect(authToken).toBe('The auth token');
                    done();
                });
        });

        it('Returns ErrorCode.NotSignedIn when user was not signed-in', (done) => {
            testGetAuthTokenError('not signed in', ErrorCode.NotSignedIn).then(() => done());
        });

        it('Returns ErrorCode.Unknown on error', (done) => {
            testGetAuthTokenError('It done broken', ErrorCode.Unknown).then(() => done());
        });

        it('Returns ErrorCode.Unknown on undefined error message', (done) => {
            testGetAuthTokenError(undefined, ErrorCode.Unknown).then(() => done());
        });

        function testGetAuthTokenError(chromeErrorMessage: string, expectedErrorCode: ErrorCode): Promise<any> {
            chrome.runtime.lastError = {
                message: chromeErrorMessage
            };

            return service.getAuthToken(false)
                .then(() => fail('Expected an error to be thrown'))
                .catch(error => {
                    if(error instanceof ChromeErrorModel) {
                        expect(error.code).toBe(expectedErrorCode);
                        expect(error.message).toBe(chromeErrorMessage);
                    } else {
                        fail('Expected error to be instance of ChromeErrorModel')
                    }
                });
        }
    });
});