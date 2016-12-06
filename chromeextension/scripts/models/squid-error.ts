import { SquidErrorCode } from "./squid-error-code";

export interface SquidError {
    code: SquidErrorCode;
    message?: string;
}

export function createSquidError(obj: any): SquidError {
    let typed: SquidError = obj as SquidError;

    // Error code is transmitted as a string, while Typescript enums are numbers. Grab the numeric version
    typed.code = SquidErrorCode[typed.code.toString()];
    return typed;
}