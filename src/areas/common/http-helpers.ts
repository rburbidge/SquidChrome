/**
 * Converts an object's property/value pairs to a URLSearchParams instance.
 */
export function serializeQueryParams(obj: any): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            params.set(key, element);
        }
    }
    return params;
}