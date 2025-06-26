import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsJobHistoryComponent } from './assets-job-history.component';

describe('AssetsJobHistoryComponent', () => {
  let component: AssetsJobHistoryComponent;
  let fixture: ComponentFixture<AssetsJobHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsJobHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
