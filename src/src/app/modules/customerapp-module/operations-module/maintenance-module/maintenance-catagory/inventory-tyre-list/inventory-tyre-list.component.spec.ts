import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTyreListComponent } from './inventory-tyre-list.component';

describe('InventoryTyreListComponent', () => {
  let component: InventoryTyreListComponent;
  let fixture: ComponentFixture<InventoryTyreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTyreListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTyreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
