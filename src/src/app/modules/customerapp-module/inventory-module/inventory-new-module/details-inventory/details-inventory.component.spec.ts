import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInventoryComponent } from './details-inventory.component';

describe('DetailsInventoryComponent', () => {
  let component: DetailsInventoryComponent;
  let fixture: ComponentFixture<DetailsInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
