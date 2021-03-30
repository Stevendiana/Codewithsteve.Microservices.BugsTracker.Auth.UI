import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBugComponent } from './assign-bug.component';

describe('AssignBugComponent', () => {
  let component: AssignBugComponent;
  let fixture: ComponentFixture<AssignBugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignBugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
