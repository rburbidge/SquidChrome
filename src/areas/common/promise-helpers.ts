/** Returns a promise that delays for an amount of time. */
export function delay(timeMillis: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), timeMillis));
}