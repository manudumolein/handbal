import { MatchData } from "./match-data";
export interface Match {
    resultState: string,
    warnings: string[],
    errors: string[],
    data: MatchData,
    resultDetail: string | null
}