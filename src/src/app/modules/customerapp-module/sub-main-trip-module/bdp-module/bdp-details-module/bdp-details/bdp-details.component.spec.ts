import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdpDetailsComponent } from './bdp-details.component';

describe('BdpDetailsComponent', () => {
  let component: BdpDetailsComponent;
  let fixture: ComponentFixture<BdpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdpDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BdpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
