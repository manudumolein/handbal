import { Player } from "./player";
export interface Event {
    idx: number;
    dateTime: string;
    second: number;
    eventType: string;
    pointsHome: number;
    pointsGuest: number;
    teamHome: boolean;
    isPrivate: boolean | null;
    player: Player;
}