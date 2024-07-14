import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleStatsComponent } from './circle-stats.component';

describe('CircleStatsComponent', () => {
  let component: CircleStatsComponent;
  let fixture: ComponentFixture<CircleStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CircleStatsComponent]
    });
    fixture = TestBed.createComponent(CircleStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
