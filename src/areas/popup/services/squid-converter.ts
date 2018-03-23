import $ from 'jquery';

import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../contracts/squid';

/** Client side device representation. */
export class ChromeDeviceModel implements DeviceModel {

    /* See interface for field docs */

    id: string;
    name: string;
    deviceType: DeviceType;

    constructor(private readonly device: DeviceModel) {
        $.extend(this, device);
    }

    /** Gets the Google material design icon name for the device. */
    public getIcon(): string {
        switch(this.device.deviceType) {
            case DeviceType.chrome:
                return 'laptop';
            case DeviceType.android:
            default:
                return 'phone_android';
        }
    }
}

export function convertDeviceModel(device: DeviceModel): ChromeDeviceModel {
    return new ChromeDeviceModel(device) as any as ChromeDeviceModel;
}

export class ChromeErrorModel implements ErrorModel {
    constructor(code: ErrorCode, message: string, errorsInfo?: any) {
        this.code = code;
        this.codeString = ErrorCode[code];
        this.message = message;
        this.errorsInfo = errorsInfo;
    }

    code: ErrorCode;
    codeString: string;
    message: string;
    errorsInfo?: any;
}