import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPermitListComponent } from './asset-permit-list.component';

describe('AssetPermitListComponent', () => {
  let component: AssetPermitListComponent;
  let fixture: ComponentFixture<AssetPermitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetPermitListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPermitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
