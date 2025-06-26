import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBiltySettingComponent } from './online-bilty-setting.component';

describe('OnlineBiltySettingComponent', () => {
  let component: OnlineBiltySettingComponent;
  let fixture: ComponentFixture<OnlineBiltySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineBiltySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineBiltySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
