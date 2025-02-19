import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LineupComponent } from "../lineup/lineup.component";
import { faFutbol, faMobileButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHandPeace, faClock } from '@fortawesome/free-regular-svg-icons'
import { Event } from '../../models/event';
import { MatchData } from '../../models/match-data';
import { Player } from '../../models/player';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match-details',
  imports: [CommonModule, LineupComponent, FontAwesomeModule],
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {
  matchCode: string | null = "";
  matchDetails: MatchData = {} as MatchData;
  filteredEvents: Event[] = [];
  date: string = "";
  eventTypes: string[] = ['goal', 'sevenMeterGoal', 'sevenMeterNoGoal', 'playerWarning', 'playerPenalty', 'disqualificationNoReport', 'disqualificationReport', 'interruptionByGuest', 'interruptionByHome']

  faFutbol = faFutbol;
  faMobileButton = faMobileButton;
  faHandPeace = faHandPeace;
  faClock = faClock;

  constructor(private route: ActivatedRoute, private matchService: MatchService) { }

  ngOnInit(): void {
    this.matchCode = this.route.snapshot.paramMap.get('code');
    if (this.matchCode) {
      this.fetchMatchDetails(this.matchCode);
    }

  }

  fetchMatchDetails(code: string): void {
    this.matchService.fetchMatchDetails(code).subscribe({
      next: (data: any) => {
        this.matchDetails = data.data;
        this.date = new Date(Date.parse(this.matchDetails.startTime)).toLocaleDateString() + ' ' + new Date(Date.parse(this.matchDetails.startTime)).toLocaleTimeString();
        this.filterEvents(this.matchDetails.events);
      },
      error: (error) => {
        alert('Error fetching match details' + error.message);
      },
    });
  }

  getPlayerName(player: any) {
    if (player) {
      return player.firstname + ' ' + player.lastname
    }
    return ''
  }

  filterEvents(events: Event[]) {
    events.sort(function (e1: any, e2: any) {
      return e1.second - e2.second
    })
    const ignoredEvents = ['gameTimeStart', 'gameStart', 'gamePeriodStart', 'gameTimeStop', 'gamePeriodStop', 'gameEnd']
    this.filteredEvents = events.filter((e: any) => {
      return !ignoredEvents.includes(e.eventType)
    });
  }

  getIcon(event: any): { icon: any; style?: any; description: string } {
    switch (event.eventType) {
      case 'goal':
        let goalDescription = ""
        if (event.teamHome) {
          goalDescription = `<b>${event.pointsHome}</b>-${event.pointsGuest}`
        } else
          goalDescription = `${event.pointsHome}-<b>${event.pointsGuest}</b>`;
        return {
          icon: this.faFutbol,
          description: goalDescription
        };

      case 'sevenMeterGoal':
        const sevenMeterDescription = event.teamHome
          ? `<b>${event.pointsHome}</b>-${event.pointsGuest} from 7-meter`
          : `${event.pointsHome}-<b>${event.pointsGuest}</b> from 7-meter`;
        return {
          icon: this.faFutbol,
          description: sevenMeterDescription
        };

      case 'sevenMeterNoGoal':
        return {
          icon: this.faFutbol,
          style: { color: 'red' },
          description: 'Missed from 7-meter'
        };

      case 'playerWarning':
        return {
          icon: this.faMobileButton,
          style: { color: 'yellow' },
          description: 'Warning'
        };

      case 'playerPenalty':
        return {
          icon: this.faHandPeace,
          style: { color: 'blue' },
          description: '2-minutes Penalty'
        };

      case 'disqualificationNoReport':
        return {
          icon: this.faMobileButton,
          style: { color: 'red' },
          description: 'Disqualification'
        };

      case 'disqualificationReport':
        return {
          icon: this.faMobileButton,
          style: { color: 'blue' },
          description: 'Disqualification with report'
        };

      case 'interruptionByGuest':
        return {
          icon: this.faClock,
          style: { color: 'green' },
          description: `Time-out ${this.matchDetails.teamGuest.name}`
        };

      case 'interruptionByHome':
        return {
          icon: this.faClock,
          style: { color: 'green' },
          description: `Time-out ${this.matchDetails.teamHome.name}`
        };

      default:
        return { icon: null, description: '' };
    }
  }

  getPlayerNr(player: Player) {
    if (player) {
      return player.nr
    }
    return ''
  }

  secondsToDisplayTime(seconds: any) {
    return Math.floor(seconds / 60) + ':' + (seconds % 60).toString().padStart(2, '0')
  }
}