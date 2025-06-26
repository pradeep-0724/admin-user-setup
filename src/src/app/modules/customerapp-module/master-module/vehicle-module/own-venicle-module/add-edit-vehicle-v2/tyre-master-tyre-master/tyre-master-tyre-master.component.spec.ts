import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreMasterTyreMasterComponent } from './tyre-master-tyre-master.component';

describe('TyreMasterTyreMasterComponent', () => {
  let component: TyreMasterTyreMasterComponent;
  let fixture: ComponentFixture<TyreMasterTyreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyreMasterTyreMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyreMasterTyreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
