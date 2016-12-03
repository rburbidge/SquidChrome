/**
 * A user's device.
 */
export interface Device {
    /**
     * The device ID as defined by Squid service.
     */
    id: string;

    /**
     * The device name displayable in the UI. e.g. "Nexus 5".
     */
    name: string;
}