import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHistoryListComponent } from './service-history-list.component';

describe('ServiceHistoryListComponent', () => {
  let component: ServiceHistoryListComponent;
  let fixture: ComponentFixture<ServiceHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceHistoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
