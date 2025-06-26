import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOwnAssetsItemComponent } from './delete-own-assets-item.component';

describe('DeleteOwnAssetsItemComponent', () => {
  let component: DeleteOwnAssetsItemComponent;
  let fixture: ComponentFixture<DeleteOwnAssetsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOwnAssetsItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOwnAssetsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
