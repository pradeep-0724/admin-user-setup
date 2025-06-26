import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTenurePopupComponent } from './edit-tenure-popup.component';

describe('EditTenurePopupComponent', () => {
  let component: EditTenurePopupComponent;
  let fixture: ComponentFixture<EditTenurePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTenurePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTenurePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
