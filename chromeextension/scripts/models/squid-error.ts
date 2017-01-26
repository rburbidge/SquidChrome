import { SquidErrorCode } from "./squid-error-code";

export interface SquidError {
    code: SquidErrorCode;
    message?: string;
}

export function createSquidError(obj: any): SquidError {
    // If the object has a code field, then assume it is a SquidError object
    if(obj.code !== undefined) {
        let typed: SquidError = obj as SquidError;

        // Error code is transmitted as a string, while Typescript enums are numbers. Grab the numeric version
        typed.code = SquidErrorCode[typed.code.toString()];
        return typed;    
    }

    // Otherwise, the object is not a SquidError
    let message: string;
    let request: XMLHttpRequest = obj.target;

    if(request) {
        message = 'Status code: ' + request.status;
    } else {
        message = 'Response was not an XMLHttpRequest';
    }
    
    return {
        code: SquidErrorCode.Unknown,
        message: message
    };
}