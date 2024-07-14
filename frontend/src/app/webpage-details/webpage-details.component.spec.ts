import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageDetailsComponent } from './webpage-details.component';

describe('WebpageDetailsComponent', () => {
  let component: WebpageDetailsComponent;
  let fixture: ComponentFixture<WebpageDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebpageDetailsComponent]
    });
    fixture = TestBed.createComponent(WebpageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
