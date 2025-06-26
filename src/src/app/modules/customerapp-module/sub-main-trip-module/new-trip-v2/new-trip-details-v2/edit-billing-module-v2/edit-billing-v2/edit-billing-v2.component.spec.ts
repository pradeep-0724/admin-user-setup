import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillingV2Component } from './edit-billing-v2.component';

describe('EditBillingV2Component', () => {
  let component: EditBillingV2Component;
  let fixture: ComponentFixture<EditBillingV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBillingV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBillingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
