import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LineupComponent } from "../lineup/lineup.component";
import { faFutbol, faMobileButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import{faHandPeace, faClock} from '@fortawesome/free-regular-svg-icons'




@Component({
  selector: 'app-match-details',
  imports: [CommonModule, LineupComponent, FontAwesomeModule],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.css'
})
export class MatchDetailsComponent implements OnInit {
  matchCode: string | null = null;
  matchDetails: any = null;
  filteredEvents: any[] = [];
  date: string = "";
  eventTypes: string[] = ['goal', 'sevenMeterGoal', 'sevenMeterNoGoal', 'playerWarning', 'playerPenalty', 'disqualificationNoReport', 'disqualificationReport', 'interruptionByGuest', 'interruptionByHome']

  faFutbol = faFutbol;
  faMobileButton = faMobileButton;
  faHandPeace = faHandPeace;
  faClock = faClock;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.matchCode = this.route.snapshot.paramMap.get('code');
    if (this.matchCode) {
      this.fetchMatchDetails(this.matchCode);
    }
  }

  fetchMatchDetails(code: string): void {
    const url = `http://localhost:3000/api/game/${code}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.matchDetails = data.data;
        console.log(this.matchDetails);
        this.date = new Date(Date.parse(this.matchDetails.startTime)).toLocaleDateString() + ' ' + new Date(Date.parse(this.matchDetails.startTime)).toLocaleTimeString();
        this.filterEvents(this.matchDetails.events);
      },
      error: () => {
        alert('Error fetching match details');
      },
    });
  }

  getPlayerName(player: any) {
    if (player) {
      return player.firstname + ' ' + player.lastname
    }
    return ''
  }

  filterEvents(events: any) {
    events.sort(function (e1: any, e2: any) {
      return e1.second - e2.second
    })
    const ignoredEvents = ['gameTimeStart', 'gameStart', 'gamePeriodStart', 'gameTimeStop', 'gamePeriodStop', 'gameEnd']
    this.filteredEvents = events.filter((e: any) => {
      return !ignoredEvents.includes(e.eventType)
    });
  }

  getIconOld(event: any) {
    switch (event.eventType) {
      case 'goal':
        if (event.teamHome) {
          return '<i class="fa-regular fa-futbol"></i>&nbsp;&nbsp;&nbsp;<b>' + event.pointsHome + '</b>-' + event.pointsGuest
        } else {
          return '<i class="fa-regular fa-futbol"></i>&nbsp;&nbsp;&nbsp;' + event.pointsHome + '-<b>' + event.pointsGuest + '</b>'
        }
      case 'sevenMeterGoal':
        if (event.teamHome) {
          return '<i class="fa-regular fa-futbol"></i>&nbsp;&nbsp;&nbsp;<b>' + event.pointsHome + '</b>-' + event.pointsGuest + ' from 7-meter'
        } else {
          return '<i class="fa-regular fa-futbol"></i>&nbsp;&nbsp;&nbsp;' + event.pointsHome + '-<b>' + event.pointsGuest + '</b> from 7-meter'
        }
      case 'sevenMeterNoGoal':
        return '<i class="fa-regular fa-futbol" style="color: red"></i>&nbsp;&nbsp;&nbsp;Missed from 7-meter'
      case 'playerWarning':
        return '<i class="fa-solid fa-mobile-button" style="color: yellow"></i>&nbsp;&nbsp;&nbsp;Warning'
      case 'playerPenalty':
        return '<i class="fa-regular fa-hand-peace" style="color: blue"></i>&nbsp;&nbsp;&nbsp;2-minutes Penalty'
      case 'disqualificationNoReport':
        return '<i class="fa-solid fa-mobile-button" style="color: red"></i>&nbsp;&nbsp;&nbsp;Disqualification'
      case 'disqualificationReport':
        return '<i class="fa-solid fa-mobile-button" style="color: blue"></i>&nbsp;&nbsp;&nbsp;Disqualification with report'
      case 'interruptionByGuest':
        return '<i class="fa-solid fa-clock" style="color: green"></i>&nbsp;&nbsp;&nbsp;Time-out ' + this.matchDetails.awayTeam
      case 'interruptionByHome':
        return '<i class="fa-solid fa-clock" style="color: green"></i>&nbsp;&nbsp;&nbsp;Time-out ' + this.matchDetails.homeTeam
      default:
        return ''
    }
  }

  getIcon(event: any): { icon: any; style?: any; description: string } {
    switch (event.eventType) {
      case 'goal':
        let goalDescription = ""
        if (event.teamHome) {
          goalDescription = `<b>${event.pointsHome}</b>-${event.pointsGuest}`
          }  else
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


  getPlayerNr(player: any) {
    if (player) {
      return player.nr
    }
    return ''
  }

  secondsToDisplayTime(seconds: any) {
    return Math.floor(seconds / 60) + ':' + (seconds % 60).toString().padStart(2, '0')
  }

}

