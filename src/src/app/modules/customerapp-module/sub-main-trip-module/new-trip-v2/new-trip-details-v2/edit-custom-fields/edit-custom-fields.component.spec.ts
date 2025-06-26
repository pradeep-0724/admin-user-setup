import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomFieldsComponent } from './edit-custom-fields.component';

describe('EditCustomFieldsComponent', () => {
  let component: EditCustomFieldsComponent;
  let fixture: ComponentFixture<EditCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustomFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
