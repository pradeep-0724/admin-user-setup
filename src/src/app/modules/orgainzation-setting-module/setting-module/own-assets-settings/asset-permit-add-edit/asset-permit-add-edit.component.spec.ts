import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPermitAddEditComponent } from './asset-permit-add-edit.component';

describe('AssetPermitAddEditComponent', () => {
  let component: AssetPermitAddEditComponent;
  let fixture: ComponentFixture<AssetPermitAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetPermitAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPermitAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
