import { FederationOfficials } from "./federation-officials";
import { MatchFeatures } from "./match-features";
import { RefereeReport } from "./referee-report";
import { Team } from "./team";
import { Event } from "./event";

export interface MatchData {
    gameCode: string;
    externalId: string;
    pointsHome: number;
    pointsGuest: number;
    pointsHomeHalftime: number;
    pointsGuestHalftime: number;
    championship: string | null;
    league: string;
    contestType: string | null;
    groupName: string;
    meetingNr: number;
    startTime: string;
    endTime: string | null;
    halftimeLength: number;
    timeoutCount: number;
    teamSize: number;
    defaultExpenses: any | null;
    defaultExpensesRefereeObserver: any | null;
    defaultExpensesTimekeeperSecretary: any | null;
    defaultFaresPerKmDriver: any | null;
    defaultFaresPerKmCoDriver: any | null;
    state: number;
    ageGroup: string | null;
    contestTypeAgeFrom: number;
    contestTypeAgeTo: number;
    location: Location;
    teamHome: Team,
    teamGuest: Team,
    refereeReport: RefereeReport,
    federationOfficials: FederationOfficials,
    events: Event[],
    meetingReportPdfUrl: string | null,
    features: MatchFeatures
}
