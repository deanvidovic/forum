import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDetails } from './thread-details';

describe('ThreadDetails', () => {
  let component: ThreadDetails;
  let fixture: ComponentFixture<ThreadDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreadDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
