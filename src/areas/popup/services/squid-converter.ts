import $ from 'jquery';

import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../contracts/squid';

export interface ChromeDeviceModel extends DeviceModel, DeviceModelPlus { }

export interface DeviceModelPlus {
    getIcon(): string;
}

class DeviceModelPlusImpl implements DeviceModelPlus {
    constructor(private readonly device: DeviceModel) {
        $.extend(this, device);
    }

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
    return new DeviceModelPlusImpl(device) as any as ChromeDeviceModel;
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