import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOwnAssetsItemComponent } from './add-edit-own-assets-item.component';

describe('AddEditOwnAssetsItemComponent', () => {
  let component: AddEditOwnAssetsItemComponent;
  let fixture: ComponentFixture<AddEditOwnAssetsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditOwnAssetsItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOwnAssetsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
