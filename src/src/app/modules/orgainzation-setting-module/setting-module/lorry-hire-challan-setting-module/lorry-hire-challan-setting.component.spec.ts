import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryHireChallanSettingComponent } from './lorry-hire-challan-setting.component';

describe('LorryHireChallanSettingComponent', () => {
  let component: LorryHireChallanSettingComponent;
  let fixture: ComponentFixture<LorryHireChallanSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LorryHireChallanSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LorryHireChallanSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
