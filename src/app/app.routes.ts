import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { MatchListingComponent } from './match-listing/match-listing.component';

export const routes: Routes = [
    { path: '', component: MatchListingComponent }, // Main page
    { path: 'match/:code', component: MatchDetailsComponent }, // Match details page
];