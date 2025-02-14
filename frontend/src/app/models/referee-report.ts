export interface RefereeReport {
    pitchOk: boolean;
    clothesOk: boolean;
    ballOk: boolean;
    securityCount: number;
    meetingStartDate: string | null;
    meetingEndDate: string;
    meetingPauseStartDate: string | null;
    meetingPauseEndDate: string;
    reportText: string;
    protestHome: boolean;
    protestGuest: boolean;
    protestText: string;
    totalAttendances: number;
}
