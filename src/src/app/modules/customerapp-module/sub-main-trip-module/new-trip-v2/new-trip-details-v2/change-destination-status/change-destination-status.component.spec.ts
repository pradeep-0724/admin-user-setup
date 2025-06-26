import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDestinationStatusComponent } from './change-destination-status.component';

describe('ChangeDestinationStatusComponent', () => {
  let component: ChangeDestinationStatusComponent;
  let fixture: ComponentFixture<ChangeDestinationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDestinationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDestinationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
