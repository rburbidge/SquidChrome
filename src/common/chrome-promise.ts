/**
 * Calls reject(chrome.runtime.lastError) if there was an error; calls resolve(); otherwise.
 */
export function callRejectOnError(resolve, reject): void {
    if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
    }

    resolve();
}