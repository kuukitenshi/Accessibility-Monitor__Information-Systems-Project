import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRemoveWebComponent } from './check-remove-web.component';

describe('CheckRemoveWebpageComponent', () => {
  let component: CheckRemoveWebComponent;
  let fixture: ComponentFixture<CheckRemoveWebComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckRemoveWebComponent]
    });
    fixture = TestBed.createComponent(CheckRemoveWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
