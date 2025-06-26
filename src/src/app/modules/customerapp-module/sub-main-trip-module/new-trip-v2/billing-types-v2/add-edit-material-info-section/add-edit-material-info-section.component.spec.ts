import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaterialInfoSectionComponent } from './add-edit-material-info-section.component';

describe('AddEditMaterialInfoSectionComponent', () => {
  let component: AddEditMaterialInfoSectionComponent;
  let fixture: ComponentFixture<AddEditMaterialInfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMaterialInfoSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMaterialInfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
