import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { MatchData } from '../models/match-data';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private startOfWeek: Date | null = null;
  private gamesCache: { [key: number]: any[] } = {};
  private matchDetailsCache: { [key: string]: MatchData } = {};
  public serie_ids = [
    { label: "Heren1", id: 487 },
    { label: "Heren2", id: 478 },
    { label: "Heren1 Playdown", id: 377 }
  ];

  constructor(private http: HttpClient) { }

  fetchGames(serie_id: number): Observable<any[]> {
    if (this.gamesCache[serie_id]) {
      return of(this.gamesCache[serie_id]);
    }

    return this.http.get<any>(`http://localhost:3000/api/games?serie_id=${serie_id}`)
      .pipe(
      
        map(response => response.elements),
        tap(games => this.gamesCache[serie_id] = games)
      );
  }

  fetchMatchDetails(code: string): Observable<MatchData> {
    if (this.matchDetailsCache[code]) {
      return of(this.matchDetailsCache[code]);
    }

    return this.http.get<MatchData>(`http://localhost:3000/api/game/${code}`)
      .pipe(
        tap(details => this.matchDetailsCache[code] = details)
      );
  }

  getStartOfWeek(date: Date): Date {
    if (!this.startOfWeek) {
      const day = date.getDay(); // Sunday = 0, Monday = 1, etc.
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as the start
      this.startOfWeek = new Date(date.setDate(diff));
    }
    return this.startOfWeek;
  }

  filterGamesByWeek(serie_id: number, startOfWeek?: Date): Observable<any[]> {
    const start = startOfWeek || this.startOfWeek;
    if (!start) {
      return of([]);
    }

    if (this.gamesCache[serie_id]) {
      return of(this.filterGames(this.gamesCache[serie_id], start));
    }

    return this.fetchGames(serie_id).pipe(
      map(games => this.filterGames(games, start))
    );
  }

  private filterGames(games: any[], startOfWeek: Date): any[] {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return games.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate >= startOfWeek && gameDate <= endOfWeek;
    });
  }

  findNextMatch(serie_id: number, teamName: string): Observable<any> {
    if (this.gamesCache[serie_id]) {
      return of(this.findNextGame(this.gamesCache[serie_id], teamName));
    }

    return this.fetchGames(serie_id).pipe(
      map(games => this.findNextGame(games, teamName))
    );
  }

  private findNextGame(games: any[], teamName: string): any {
    const now = new Date();
    const upcomingGames = games.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate >= now && (game.home_club_name === teamName || game.away_club_name === teamName);
    });
    upcomingGames.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcomingGames.length > 0 ? upcomingGames[0] : null;
  }

  findAllGamesForTeam(games: any[], teamName: string): any[] {
    return games.filter(game => game.home_club_name === teamName || game.away_club_name === teamName);
  }
}