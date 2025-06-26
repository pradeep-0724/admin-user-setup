import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgainzationSettingSlidebarComponent } from './orgainzation-setting-slidebar.component';

describe('OrgainzationSettingSlidebarComponent', () => {
  let component: OrgainzationSettingSlidebarComponent;
  let fixture: ComponentFixture<OrgainzationSettingSlidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgainzationSettingSlidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgainzationSettingSlidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
