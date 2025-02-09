import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-match-listing',
  imports: [RouterLink, CommonModule],
  templateUrl: './match-listing.component.html',
  styleUrl: './match-listing.component.css'
})
export class MatchListingComponent {
  games: any[] = [];
  loading = false;
  filteredGames: any[] = []; // Filtered events for the current week
  currentWeekStart: Date = new Date(); // Start of the current week
  serie_ids = [
    { label: "Heren1", id: 487 },
    { label: "Heren2", id: 478 }
  ];
  activeButton = 0;// Default active button index

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.fetchGames(this.serie_ids[0].id);
  }

  fetchGames(serie_id: number) {
    this.loading = true;
    this.http.get(`http://localhost:3000/api/games?serie_id=${serie_id}`)
      .subscribe({
        next: (data: any) => {
          this.games = data;
          this.loading = false;
          this.updateFilteredGames();
        },
        error: () => {
          this.loading = false;
          alert("Error fetching games");
        }
      });
  }
 
  // Function to handle button click
  onButtonClick(serieId: number): void {
    // Set the active button
    this.activeButton = this.serie_ids.findIndex(serie => serie.id === serieId);
    this.fetchGames(serieId);
  }

  // Get the start of the week (Monday)
  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // Sunday = 0, Monday = 1, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as the start
    return new Date(date.setDate(diff));
  }

  // Update the filtered list based on the current week
  updateFilteredGames(): void {
    const startOfWeek = this.getStartOfWeek(new Date(this.currentWeekStart));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    this.filteredGames = this.games.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate >= startOfWeek && gameDate <= endOfWeek;
    });
    console.log(this.filteredGames)
  }

  // Change the week and update the filtered events
  changeWeek(weeks: number): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + weeks * 7);
    this.updateFilteredGames();
  }

}
