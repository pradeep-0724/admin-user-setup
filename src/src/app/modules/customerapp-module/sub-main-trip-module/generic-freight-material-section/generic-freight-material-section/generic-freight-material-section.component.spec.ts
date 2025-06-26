import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFreightMaterialSectionComponent } from './generic-freight-material-section.component';

describe('GenericFreightMaterialSectionComponent', () => {
  let component: GenericFreightMaterialSectionComponent;
  let fixture: ComponentFixture<GenericFreightMaterialSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericFreightMaterialSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFreightMaterialSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
