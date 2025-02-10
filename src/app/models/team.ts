import { Player } from "./player";
export interface Team {
    externalId: string;
    name: string;
    pin: string;
    releasePinEntered: string;
    lineupPinEntered: string;
    jerseyColor: string;
    clubEmblemUrl: string | null;
    players: Player[];
    goalkeepers: Player[];
    officials: Player[];
    persons: Player[];
}
