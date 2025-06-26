import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPurchaseOrderPrefrencesComponent } from './local-purchase-order-prefrences.component';

describe('LocalPurchaseOrderPrefrencesComponent', () => {
  let component: LocalPurchaseOrderPrefrencesComponent;
  let fixture: ComponentFixture<LocalPurchaseOrderPrefrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPurchaseOrderPrefrencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalPurchaseOrderPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
