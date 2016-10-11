package com.sirnommington.squid.services;

/**
 * Result codes for SquidService.AddDevice()
 */
public enum AddDeviceResult {
    /**
     * A device with the same GCM token already exists.
     */
    AlreadyExists,

    /**
     * The new device was added.
     */
    Added,

    /**
     * An error occurred.
     */
    Error
}
