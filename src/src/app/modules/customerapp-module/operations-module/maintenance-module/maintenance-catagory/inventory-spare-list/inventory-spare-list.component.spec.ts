import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySpareListComponent } from './inventory-spare-list.component';

describe('InventorySpareListComponent', () => {
  let component: InventorySpareListComponent;
  let fixture: ComponentFixture<InventorySpareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorySpareListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySpareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
