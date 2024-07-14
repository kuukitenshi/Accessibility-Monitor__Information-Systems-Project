import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebpageDialogComponent } from './add-webpage-dialog.component';

describe('AddWebpageDialogComponent', () => {
  let component: AddWebpageDialogComponent;
  let fixture: ComponentFixture<AddWebpageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWebpageDialogComponent]
    });
    fixture = TestBed.createComponent(AddWebpageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
