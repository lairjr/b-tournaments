import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RouteProps } from './support/routerInterfaces';
import { StoreState } from '../store';
import { gameById } from '../Games/selectors';
import { Dispatch, bindActionCreators } from 'redux';
import { getGame } from '../Games/effects';
import { connect, ConnectedProps } from 'react-redux';
import { getTournamentBySlug } from '../Tournaments/effects';
import { getPlayerStatsLogsByFilter } from '../PlayerStatsLog/effects';
import { default as PlayerStatLogView } from '../PlayerStatsLog/View';
import { tournamentBySlug } from '../Tournaments/selectors';
import { default as GameCard } from '../Games/Card';
import { teamById } from '../Teams/selectors';
import { playerStatLogsByGameIdAndTeamId } from '../PlayerStatsLog/selectors';
import withPlayerStatsLogs from './support/withPlayerStatsLogs';
import { phaseByIdOrDefault } from '../Phases/selectors';
import { playersByTeamIdMap } from '../Players/selectors';

const mapStateToProps = (
  state: StoreState,
  props: RouteComponentProps<RouteProps>
) => {
  const { gameId = '' } = props.match.params;
  const game = gameById(state.games, gameId);
  const awayPlayers = playersByTeamIdMap(
    state.players,
    state.teams,
    game.awayTeam.id
  );
  const awayTeam = teamById(state.teams, game.awayTeam.id);
  const awayPlayerStatsLogs = playerStatLogsByGameIdAndTeamId(
    state.playerStatsLogs,
    game.id,
    game.awayTeam.id
  );
  const homeTeam = teamById(state.teams, game.homeTeam.id);
  const homePlayerStatsLogs = playerStatLogsByGameIdAndTeamId(
    state.playerStatsLogs,
    game.id,
    game.homeTeam.id
  );
  const homePlayers = playersByTeamIdMap(
    state.players,
    state.teams,
    game.homeTeam.id
  );
  return {
    awayPlayers,
    awayPlayerStatsLogs,
    awayTeam,
    game,
    homePlayers,
    homePlayerStatsLogs,
    homeTeam,
    phase: phaseByIdOrDefault(state.phases, game.phaseId),
    tournament: tournamentBySlug(
      state.tournaments,
      props.match.params.tournamentSlug
    )
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getGame,
      getPlayerStatsLogsByFilter,
      getTournamentBySlug
    },
    dispatch
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type GameViewProps = ConnectedProps<typeof connector>;

function GameView({
  awayPlayers,
  awayPlayerStatsLogs,
  awayTeam,
  game,
  homePlayers,
  homePlayerStatsLogs,
  homeTeam,
  tournament
}: GameViewProps): React.ReactElement {
  return (
    <div className="column">
      <div className="columns is-vcentered is-mobile is-multiline">
        <div className="column is-12">
          <GameCard game={game} />
        </div>

        <div className="column is-12 has-text-centered">
          <div className="tabs is-centered">
            <div className="columns is-multiline has-text-left">
              <PlayerStatLogView
                playerStatLogs={homePlayerStatsLogs}
                players={homePlayers}
                playersStats={tournament.playerStats}
                team={homeTeam}
              />

              <PlayerStatLogView
                playerStatLogs={awayPlayerStatsLogs}
                players={awayPlayers}
                playersStats={tournament.playerStats}
                team={awayTeam}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connector(withPlayerStatsLogs<GameViewProps>(GameView));
