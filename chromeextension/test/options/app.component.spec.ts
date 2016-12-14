import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from '../../scripts/options/app.component';
import { DeviceService } from '../../scripts/options/services/device.service';
import { MockDeviceService } from '../../test/options/services/mock.device.service';

describe('AppComponent', function() {

    let mockService: MockDeviceService;
    let comp: AppComponent;

    beforeEach(() => {
        mockService = new MockDeviceService();
        comp = new AppComponent(mockService);
    });

    it('constructor default values', function() {
        expect(comp.loadingDevices).toBeTruthy();
        expect(comp.devices).toBeUndefined();
        expect(comp.selectedDevice).toBeUndefined();
        expect(comp.error).toBeUndefined();
    });

    it('isDeviceSelected() returns false when there is no selected device', function() {
        expect(comp.isDeviceSelected(null)).toBeFalsy();
        expect(comp.isDeviceSelected({ id: "id", name: "name" })).toBeFalsy();
    });

    it('isDeviceSelected() returns true when a device is selected and they share the same ID', function() {
        let device1 = { id: "id1", name: "doesn't matter" };
        let device2 = { id: "id2", name: "also doesn't matter" };
        comp.selectedDevice = device1;
        expect(comp.isDeviceSelected(device2)).toBeFalsy();
        expect(comp.isDeviceSelected(device1)).toBeTruthy();
    });
});