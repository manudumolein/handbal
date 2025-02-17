import { Routes } from '@angular/router';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { MatchListingComponent } from './components/match-listing/match-listing.component';
import { LiveViewComponent } from './components/live-view/live-view.component';

export const routes: Routes = [
    { path: '', component: MatchListingComponent }, // Main page
    { path: 'match/:code', component: MatchDetailsComponent }, // Match details page
    { path: 'live', component: LiveViewComponent }, // Live matches page
];