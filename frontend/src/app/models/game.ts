export interface Game {
    access: any[];
    allow_game_details_update: number;
    away_club_id: number;
    away_club_logo_img_url: string;
    away_club_name: string;
    away_club_reference: number;
    away_forfeit_status_id: number;
    away_score: number | null;
    away_team_id: number;
    away_team_jersey_color: string | null;
    away_team_jersey_reserve_color: string | null;
    away_team_name: string;
    away_team_reference: string;
    away_team_short_color: string | null;
    away_team_short_goalkeeper_color: string | null;
    away_team_short_name: string;
    away_team_short_reserve_color: string | null;
    code: string;
    comment: string;
    competition_order: number;
    created_at: string;
    date: Date;
    date_status_id: number;
    division_order: number;
    expenses_travel: string;
    fees: string;
    game_status_id: number;
    home_club_id: number;
    home_club_logo_img_url: string;
    home_club_name: string;
    home_club_province: string;
    home_club_reference: number;
    home_forfeit_status_id: number;
    home_score: number | null;
    home_team_id: number;
    home_team_jersey_color: string | null;
    home_team_jersey_goalkeeper_color: string | null;
    home_team_jersey_reserve_color: string | null;
    home_team_name: string;
    home_team_reference: string;
    home_team_short_color: string | null;
    home_team_short_name: string;
    home_team_short_reserve_color: string | null;
    id: number;
    referees: {
        blocked:number;
        firstname:string;
        id:number;
        member_id:number;
        notification_sent:number;
        reference:string;
        surname:string;
    }[]; 
    referees_number: number;
    reference: string;
    round: string;
    score_status_id: number;
    scoresheet_summary_id: number;
    season_end_date: string;
    season_id: number;
    season_start_date: Date;
    serie_id: number;
    serie_name: string;
    serie_order: number;
    serie_reference: string;
    serie_short_name: string;
    serie_type_competition: number;
    time: string;
    updated_at: Date;
    venue_city: string;
    venue_id: number;
    venue_name: string;
    venue_short_name: string;
    week: number;
    with_rankings: number;
}
