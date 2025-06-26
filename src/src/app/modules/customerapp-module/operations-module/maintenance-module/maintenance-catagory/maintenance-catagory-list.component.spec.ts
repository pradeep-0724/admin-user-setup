import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCatagoryListComponent } from './maintenance-catagory-list.component';

describe('MaintenanceCatagoryListComponent', () => {
  let component: MaintenanceCatagoryListComponent;
  let fixture: ComponentFixture<MaintenanceCatagoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCatagoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCatagoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
