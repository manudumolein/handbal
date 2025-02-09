import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFutbol, faMobileButton} from '@fortawesome/free-solid-svg-icons';
import { faHandPeace } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-lineup',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.css'
})
export class LineupComponent implements OnInit {
  @Input() players: any[] = [];
  @Input() events: any[] = [];
  sortedPlayers: any[] = [];
  faFutbol = faFutbol;
  faMobileButton = faMobileButton;
  faHandPeace = faHandPeace;


  ngOnInit(): void {
    this.sortPlayers();
  }

  sortPlayers(): void {
    this.sortedPlayers = [...this.players].sort((p1, p2) => {
      if (p1.teamOfficialMark === null) {
        return p1.nr - p2.nr;
      } else {
        return p1.teamOfficialMark.localeCompare(p2.teamOfficialMark);
      }
    });
  }

  tableHeader() {
    let title: string = "";
    if(!this.players.length) return title;
    if (this.players[0].type == "official")
      title = this.players[0].teamHome ? "Home officials" : "Away officials"
    else title = this.players[0].teamHome ? "Home" : "Away"
    return title;
  }

  isPlayer(){
   return this.players[0].type == "player"
  }

  getGoals(playerId: any, events: any) {
    let goals = this.getPlayerEvents(events, playerId).filter(this.isGoal).length;
    return goals != 0 ? goals : ''
  }

  getSevenMeterGoals(playerId: any, events: any) {
    let SevenMeterGoals = this.getPlayerEvents(events, playerId).filter(this.isSevenMeterGoal).length;
    return SevenMeterGoals != 0 ? SevenMeterGoals : ''
  }
  getDQ(playerId: any, events: any) {
    let DQ = this.getPlayerEvents(events, playerId).filter(this.isDQ).length;
    return DQ != 0
  }

  getDQR(playerId: any, events: any) {
    let DQR = this.getPlayerEvents(events, playerId).filter(this.isDQR).length;
    return DQR != 0
  }

  getPenalties(playerId: any, events: any) {
    return this.getPlayerEvents(events, playerId).filter(this.isPenalty);
  }
  isGoalKeeper(player: any) {
    return player.type == 'goalkeeper'
  }
  isPenalty(event: any) {
    return event.eventType == 'playerPenalty'
  }

  isDQ(event: any) {
    return event.eventType == 'disqualificationNoReport'
  }

  isDQR(event: any) {
    return event.eventType == 'disqualificationReport'
  }

  getPlayerEvents(events: any, playerId: any) {
    return events.filter((e: any) => {
      return e.player && e.player.id == playerId
    }
    );
  }
  getWarning(playerId: any, events: any) {
    let warning = this.getPlayerEvents(events, playerId).filter(this.isWarning).length;
    return warning != 0
  }

  isGoal(event: any) {
    return event.eventType == 'goal' || event.eventType == 'sevenMeterGoal'
  }

  isSevenMeterGoal(event: any) {
    return event.eventType == 'sevenMeterGoal'
  }

  isWarning(event: any) {
    return event.eventType == 'playerWarning'
  }
}
