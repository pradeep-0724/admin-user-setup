import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomFieldV2Component } from './add-custom-field-v2.component';

describe('AddCustomFieldV2Component', () => {
  let component: AddCustomFieldV2Component;
  let fixture: ComponentFixture<AddCustomFieldV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomFieldV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomFieldV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
