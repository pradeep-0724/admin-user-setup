import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdpStatusChangeComponent } from './bdp-status-change.component';

describe('BdpStatusChangeComponent', () => {
  let component: BdpStatusChangeComponent;
  let fixture: ComponentFixture<BdpStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdpStatusChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BdpStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
