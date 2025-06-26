import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPopUpComponent } from './inventory-pop-up.component';

describe('InventoryPopUpComponent', () => {
  let component: InventoryPopUpComponent;
  let fixture: ComponentFixture<InventoryPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
