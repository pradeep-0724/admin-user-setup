import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInspectionRemarkComponent } from './site-inspection-remark.component';

describe('SiteInspectionRemarkComponent', () => {
  let component: SiteInspectionRemarkComponent;
  let fixture: ComponentFixture<SiteInspectionRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteInspectionRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteInspectionRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
