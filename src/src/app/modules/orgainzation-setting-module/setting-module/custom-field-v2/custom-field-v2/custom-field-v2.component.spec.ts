import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldV2Component } from './custom-field-v2.component';

describe('CustomFieldV2Component', () => {
  let component: CustomFieldV2Component;
  let fixture: ComponentFixture<CustomFieldV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFieldV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomFieldV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
