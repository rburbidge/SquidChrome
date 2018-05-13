import * as $ from 'jquery';

import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../contracts/squid';

/** Client side device representation. */
export class ChromeDeviceModel implements DeviceModel {

    /* See interface for field docs */

    id: string;
    name: string;
    deviceType: DeviceType;

    constructor(device: DeviceModel) {
        $.extend(this, device);
    }

    /** Gets the Google material design icon name for the device. */
    public getIcon(): string {
        switch(this.deviceType) {
            case DeviceType.chrome:
                return 'laptop';
            case DeviceType.android:
            default:
                return 'phone_android';
        }
    }

    /**
     * Sorts a list of devices in place.
     */
    public static sort(devices: DeviceModel[], thisDeviceId?: string): void {
        if(!devices) return;

        devices.sort((deviceA, deviceB) => {
            // Make the current device appear first, if any
            if(thisDeviceId) {
                if(deviceA.id == thisDeviceId) {
                    return -1;
                } else if(deviceB.id == thisDeviceId) {
                    return 1;
                }
            }

            // Sort the remaining devices by name
            return deviceA.name < deviceB.name ? -1 : 1;
        });
    }
}

export function convertDeviceModel(device: DeviceModel): ChromeDeviceModel {
    return new ChromeDeviceModel(device);
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