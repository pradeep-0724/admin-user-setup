import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgainzationSettingComponent } from './orgainzation-setting.component';

describe('OrgainzationSettingComponent', () => {
  let component: OrgainzationSettingComponent;
  let fixture: ComponentFixture<OrgainzationSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgainzationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgainzationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
