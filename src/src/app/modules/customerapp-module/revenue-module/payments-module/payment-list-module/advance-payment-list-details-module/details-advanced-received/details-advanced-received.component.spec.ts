import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAdvancedReceivedComponent } from './details-advanced-received.component';

describe('DetailsAdvancedReceivedComponent', () => {
  let component: DetailsAdvancedReceivedComponent;
  let fixture: ComponentFixture<DetailsAdvancedReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAdvancedReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAdvancedReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
