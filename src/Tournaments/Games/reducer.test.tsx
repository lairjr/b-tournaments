import { HttpAction } from '../Shared/store/interfaces';
import { ActionTypes, DELETE_TOURNAMENT_GAME, DELETE_TOURNAMENT_GAME_FAILURE, DELETE_TOURNAMENT_GAME_SUCCESS, POST_TOURNAMENT_GAME, POST_TOURNAMENT_GAME_FAILURE, POST_TOURNAMENT_GAME_SUCCESS } from './actions';
import { deleteTournamentGame, deleteTournamentGameFailure, deleteTournamentGameSuccess, postTournamentGame, postTournamentGameFailure, postTournamentGameSuccess } from './reducer';
import { initialState, TournamentGameState } from './state';

describe('deleteTournamentGame', () => {
	const action: HttpAction<ActionTypes> = {
		type: DELETE_TOURNAMENT_GAME,
		payload: {
			id: 'first-id',
		}
	};

	it('sets isLoadingDeleteTournamentGame to true', () => {
		expect(deleteTournamentGame(initialState, action).isLoadingDeleteTournamentGame).toBe(true);
	});
});

describe('deleteTournamentGameFailure', () => {
	const action: HttpAction<ActionTypes> = {
		type: DELETE_TOURNAMENT_GAME_FAILURE,
		payload: {
			id: 'first-id',
		}
	};

	it('sets isLoadingDeleteTournamentGame to false', () => {
		expect(deleteTournamentGameFailure(initialState, action).isLoadingDeleteTournamentGame).toBe(false);
	});
});

describe('deleteTournamentGameSuccess', () => {
	const action: HttpAction<ActionTypes> = {
		type: DELETE_TOURNAMENT_GAME_SUCCESS,
		payload: 'first-id',
	};

	const deleteState = {
		...initialState,
		tournamentGames: {
			['first-id']: {
				id: 'first-id',
			}
		}
	}

	it('sets isLoadingDeleteTournamentGame to false', () => {
		expect(deleteTournamentGameSuccess(deleteState, action).isLoadingDeleteTournamentGame).toBe(false);
	});

	it('remove entity', () => {
		const newState = deleteTournamentGameSuccess(deleteState, action);

		expect(newState.tournamentGames['first-id']).toBeUndefined()
	});

	it('keeps others entities in other', () => {
		const someState: TournamentGameState = {
			...initialState,
			tournamentGames: {
				['some-id']: {
					id: 'some-id',
				},
				...deleteState.tournamentGames,
			}
		}

		const newState = deleteTournamentGameSuccess(someState, action);

		expect(newState.tournamentGames['some-id']).toEqual({
			id: 'some-id',
		});
	});
});

describe('postTournamentGame', () => {
	const action: HttpAction<ActionTypes> = {
		type: POST_TOURNAMENT_GAME,
	};

	it('sets isLoadingPostTournamentGame to true', () => {
		expect(postTournamentGame(initialState, action).isLoadingPostTournamentGame).toBe(true);
	});
});

describe('postTournamentGameFailure', () => {
	const action: HttpAction<ActionTypes> = {
		type: POST_TOURNAMENT_GAME_FAILURE,
	};

	it('sets isLoadingPostTournamentGame to false', () => {
		expect(postTournamentGameFailure(initialState, action).isLoadingPostTournamentGame).toBe(false);
	});
});

describe('postTournamentGameSuccess', () => {
	const action: HttpAction<ActionTypes> = {
		type: POST_TOURNAMENT_GAME_SUCCESS,
		payload: {
			data:
			{
				id: 'first-id',
				game: {
					away_score: 10,
					away_team_name: 'away team name',
					datetime: '2019-05-22T03:21:21.248Z',
					home_score: 20,
					home_team_name: 'home team name',
					location: 'location',
				},
			}
		}
	};

	it('sets isLoadingPostTournamentGame to false', () => {
		expect(postTournamentGameSuccess(initialState, action).isLoadingPostTournamentGame).toBe(false);
	});

	it('set entity', () => {
		const newState = (postTournamentGameSuccess(initialState, action));

		expect(newState.tournamentGames['first-id']).toEqual({
			id: 'first-id',
			game: {
				awayScore: 10,
				awayTeamName: 'away team name',
				datetime: '2019-05-22T03:21:21.248Z',
				homeScore: 20,
				homeTeamName: 'home team name',
				location: 'location',
			},
		});
	});

	it('keeps others entities in other', () => {
		const someState: TournamentGameState = {
			...initialState,
			tournamentGames: {
				['some-id']: {
					id: 'some-id',
					game: {
						awayScore: 30,
						awayTeamName: 'some away team name',
						datetime: '2019-05-22T03:21:21.248Z',
						homeScore: 40,
						homeTeamName: 'some home team name',
						location: 'some location',
					},
				},
			}
		}

		const newState = (postTournamentGameSuccess(someState, action));

		expect(newState.tournamentGames['some-id']).toEqual({
			id: 'some-id',
			game: {
				awayScore: 30,
				awayTeamName: 'some away team name',
				datetime: '2019-05-22T03:21:21.248Z',
				homeScore: 40,
				homeTeamName: 'some home team name',
				location: 'some location',
			},
		});
	});
});