import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeStorageService } from '../../services/chrome-storage.service';
import { DeviceModel } from '../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { OptionsComponent } from '../../components/options/options.component';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockChromeStorageService } from '../../services/testing/chrome-storage.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';

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

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
            expect(comp.devices.length).toBe(0);
            expect(comp.selectedDevice).toBeUndefined();
            expect(comp.message).toBeUndefined();
        });

        it('isDevMode is false when ChromeService says so', function() {
            testIsDevMode(false);
        });

        it('isDevMode is true when ChromeService says so', function() {
            testIsDevMode(true);
        });

        /** Tests that isDevMode is retrieved from ChromeService, and that the dev options panel is showing or hidden. */
        function testIsDevMode(expected: boolean) {
            spyOn(mockChromeService, 'isDevMode').and.returnValue(expected);
            fixture = TestBed.createComponent(OptionsComponent);
            comp = fixture.debugElement.componentInstance;
    
            // Dev options won't show if still loading
            comp.isLoading = false;
            fixture.detectChanges();
            const devOptions = fixture.debugElement.query(By.css('.squid-dev-options'));
    
            expect(comp.isDevMode).toBe(expected);
            if(expected) {
                expect(devOptions).toBeTruthy();
            } else {
                expect(devOptions).toBeNull();
            }
        }
    });

    describe('isDeviceSelected()', () => {
        it('Returns false when there is no selected device', function() {
            expect(comp.isDeviceSelected(null)).toBeFalsy();
            expect(comp.isDeviceSelected({ id: "id", name: "name" })).toBeFalsy();
        });
    
        it('Returns true when a device is selected and they share the same ID', function() {
            let device1 = { id: "id1", name: "doesn't matter" };
            let device2 = { id: "id2", name: "also doesn't matter" };
            comp.selectedDevice = device1;
            expect(comp.isDeviceSelected(device2)).toBeFalsy();
            expect(comp.isDeviceSelected(device1)).toBeTruthy();
        });
    });

    describe('refreshDevices()', () => {
        it('Stop loading on success', (done) => {
            let devices: DeviceModel[] = [
                { id: "id1", name: "name" }
            ];
            spyOn(mockService, 'getDevices').and.returnValue(Promise.resolve(devices));
    
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
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(mockService, 'getDevices').and.returnValue(Promise.reject('An error'))
    
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    let error = fixture.debugElement.query(By.css('.squid-error'));
                    expect(error.nativeElement.textContent).toContain('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                })
                .catch(() => {
                    fail();
                });
        });
    });
});