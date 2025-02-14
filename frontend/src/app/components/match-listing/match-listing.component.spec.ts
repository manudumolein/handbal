import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchListingComponent } from './match-listing.component';

describe('MatchListingComponent', () => {
  let component: MatchListingComponent;
  let fixture: ComponentFixture<MatchListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
