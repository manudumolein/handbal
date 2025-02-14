import { Player } from "./player";

export interface FederationOfficials {
    gameCode: null,
    refereeA: Player,
    refereeB: Player,
    refereeObserver: Player,
    timekeeper: Player,
    secretary: Player,
    supervisor: Player | null,
    technicalDelegate: Player,
    securityExecutive: Player | null
}
