import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsServiceHistoryComponent } from './assets-service-history.component';

describe('AssetsServiceHistoryComponent', () => {
  let component: AssetsServiceHistoryComponent;
  let fixture: ComponentFixture<AssetsServiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsServiceHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsServiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
