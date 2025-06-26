import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListMasterComponent } from './item-list-master.component';

describe('ItemListMasterComponent', () => {
  let component: ItemListMasterComponent;
  let fixture: ComponentFixture<ItemListMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemListMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
