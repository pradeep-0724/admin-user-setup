import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteInspectionComponent } from './add-site-inspection.component';

describe('AddSiteInspectionComponent', () => {
  let component: AddSiteInspectionComponent;
  let fixture: ComponentFixture<AddSiteInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSiteInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSiteInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
