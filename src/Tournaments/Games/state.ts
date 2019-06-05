import { TournamentTeamEntity } from '../Teams/state';

export interface TournamentGameEntity {
  id: string;
  awayScore: number;
  awayTeam: TournamentTeamEntity;
  datetime: string;
  homeScore: number;
  homeTeam: TournamentTeamEntity;
  location: string;
}

export interface TournamentGameState {
  isLoadingDeleteTournamentGame: boolean;
  isLoadingPostTournamentGame: boolean;
  isLoadingRequestTournamentGame: boolean;
  isLoadingRequestTournamentGames: boolean;
  tournamentGames: { [key: string]: TournamentGameEntity };
  tournamentGamesByDate: {
    [key: string]: { [key: string]: TournamentGameEntity };
  };
}

export const initialState: TournamentGameState = {
  isLoadingDeleteTournamentGame: false,
  isLoadingPostTournamentGame: false,
  isLoadingRequestTournamentGame: false,
  isLoadingRequestTournamentGames: false,
  tournamentGames: {},
  tournamentGamesByDate: {}
};