import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInspectionPrefrencesComponent } from './site-inspection-prefrences.component';

describe('SiteInspectionPrefrencesComponent', () => {
  let component: SiteInspectionPrefrencesComponent;
  let fixture: ComponentFixture<SiteInspectionPrefrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteInspectionPrefrencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteInspectionPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
