import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAddEditPopupComponent } from './container-add-edit-popup.component';

describe('ContainerAddEditPopupComponent', () => {
  let component: ContainerAddEditPopupComponent;
  let fixture: ComponentFixture<ContainerAddEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerAddEditPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerAddEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
