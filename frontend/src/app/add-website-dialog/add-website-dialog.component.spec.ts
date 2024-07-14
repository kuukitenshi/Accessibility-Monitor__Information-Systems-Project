import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebsiteDialogComponent } from './add-website-dialog.component';

describe('AddWebsiteDialogComponent', () => {
  let component: AddWebsiteDialogComponent;
  let fixture: ComponentFixture<AddWebsiteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWebsiteDialogComponent]
    });
    fixture = TestBed.createComponent(AddWebsiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
