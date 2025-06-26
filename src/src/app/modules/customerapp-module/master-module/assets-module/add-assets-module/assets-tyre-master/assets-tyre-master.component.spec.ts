import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTyreMasterComponent } from './assets-tyre-master.component';

describe('AssetsTyreMasterComponent', () => {
  let component: AssetsTyreMasterComponent;
  let fixture: ComponentFixture<AssetsTyreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsTyreMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTyreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
