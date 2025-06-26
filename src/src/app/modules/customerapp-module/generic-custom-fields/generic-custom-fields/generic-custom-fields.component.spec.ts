import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCustomFieldsComponent } from './generic-custom-fields.component';

describe('GenericCustomFieldsComponent', () => {
  let component: GenericCustomFieldsComponent;
  let fixture: ComponentFixture<GenericCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericCustomFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
