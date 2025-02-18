import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Game } from '../../models/game';
@Component({
  selector: 'app-match-listing',
  imports: [RouterLink, CommonModule],
  templateUrl: './match-listing.component.html',
  styleUrls: ['./match-listing.component.css']
})
export class MatchListingComponent implements OnInit {
  loading = false;
  filteredGames: Game[] = []; // Filtered events for the current week
  currentWeekStart: Date = new Date(); // Start of the current week
  serie_ids: { label: string; id: number; }[] = [];
  activeButton = 0; // Default active button index 
  imgUrl = "https://admin.handballbelgium.be/lms_league_ws/public/img/"
  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.serie_ids = this.matchService.serie_ids;
    this.currentWeekStart = this.matchService.getStartOfWeek(new Date());
    this.updateFilteredGames(this.serie_ids[this.activeButton].id);
  }

  changeSerie(serieId: number): void {
    this.activeButton = this.serie_ids.findIndex(serie => serie.id === serieId);
    this.updateFilteredGames(serieId);
  }

  // Update the filtered list based on the current week
  updateFilteredGames(serie_id: number): void {
    this.matchService.filterGamesByWeek(serie_id, this.currentWeekStart).subscribe(games => {
      this.filteredGames = games;
    });
    console.log(this.filteredGames);
  }

  // Change the week and update the filtered events
  changeWeek(weeks: number): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + weeks * 7);
    this.updateFilteredGames(this.serie_ids[this.activeButton].id);
  }
}