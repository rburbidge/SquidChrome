import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ChromeService } from '../../scripts/options/services/chrome.service';
import { ChromeStorageService } from '../../scripts/options/services/chrome-storage.service';
import { DeviceModel } from '../../scripts/contracts/squid';
import { DeviceService } from '../../scripts/options/services/device.service';
import { OptionsComponent } from '../../scripts/options/components/options/options.component';
import { MockChromeService } from './services/chrome.service.mock';
import { MockChromeStorageService } from './services/chrome-storage.service.mock';
import { MockDeviceService } from './services/device.service.mock';

describe('OptionsComponent', () => {
    let mockService: MockDeviceService;
    let mockChromeService: MockChromeService;
    let mockChromeStorageService: MockChromeStorageService;
    let comp: OptionsComponent;
    let fixture: ComponentFixture<OptionsComponent>;

    beforeEach(async(() => {
        mockService = new MockDeviceService();
        mockChromeService = new MockChromeService();
        mockChromeStorageService = new MockChromeStorageService();

        TestBed.configureTestingModule({
            declarations: [ OptionsComponent ],
            providers: [
                { provide: DeviceService, useValue: mockService },
                { provide: ChromeService, useValue: mockChromeService },
                { provide: ChromeStorageService, useValue: mockChromeStorageService },
                { provide: Router, useValue: null }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsComponent);
        comp = fixture.debugElement.componentInstance;
    })

    it('constructor default values', function() {
        expect(comp.isLoading).toBeTruthy();
        expect(comp.devices.length).toBe(0);
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

    it('refreshDevices() should stop loading on success', (done) => {
        let devices: DeviceModel[] = [
            { id: "id1", name: "name" }
        ];
        mockService.getDevicesImpl = () => {
            return Promise.resolve(devices);
        };

        comp.isLoading = false; // 1. Begin with loading = false
        comp.refreshDevices()
            .then(() => {
                expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                expect(comp.devices).toEqual(devices);
                expect(comp.selectedDevice).toBeUndefined();
                done();
            })
            .catch(() => {
                fail();
                done();
            });
        expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true from the refresh
    })
});