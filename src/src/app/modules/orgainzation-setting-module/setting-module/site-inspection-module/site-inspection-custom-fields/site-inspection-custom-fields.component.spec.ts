import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInspectionCustomFieldsComponent } from './site-inspection-custom-fields.component';

describe('SiteInspectionCustomFieldsComponent', () => {
  let component: SiteInspectionCustomFieldsComponent;
  let fixture: ComponentFixture<SiteInspectionCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteInspectionCustomFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteInspectionCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
