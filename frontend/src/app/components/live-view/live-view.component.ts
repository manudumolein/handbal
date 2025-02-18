import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { MatchData } from '../../models/match-data';

@Component({
  selector: 'app-live-view',
  imports: [CommonModule],
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit {
  nextMatch: any = null;
  loading = false;
  teamName = "HBC Apolloon Spurs";
  activeButton = 0;
  serie_ids: { label: string; id: number; }[] = [];
  matchDetails: MatchData = {} as MatchData;

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.serie_ids = this.matchService.serie_ids;
    this.fetchNextMatch(this.serie_ids[this.activeButton].id);
  }

  changeSerie(serieId: number): void {
    this.activeButton = this.serie_ids.findIndex(serie => serie.id === serieId);
    this.fetchNextMatch(serieId);
  }

  fetchMatchDetails(code: string): void {
    this.matchService.fetchMatchDetails(code).subscribe({
      next: (data: any) => {
        this.matchDetails = data.data;
      },
      error: (error) => {
        alert('Error fetching match details' + error.message);
      },
    });
  }


  fetchNextMatch(serie_id: number) {
    this.loading = true;
    this.matchService.findNextMatch(serie_id,this.teamName).subscribe({
      next: (games: any[]) => {
        this.nextMatch = games;
        console.log(this.nextMatch.code);
        this.fetchMatchDetails(this.nextMatch.code);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert("Error fetching games");
      }
    });
  }
}