import React, { Fragment } from 'react';
import { StoreState } from '../store';
import { currentPhaseId, phaseLoading } from '../Phases/selectors';
import { tournamentLoading } from '../Tournaments/selectors';
import { Dispatch, bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { getPhase } from '../Phases/effects';
import { getGamesByFilter } from '../Games/effects';
import { RouteProps } from './support/routerInterfaces';
import ComponentLoader from '../Shared/UI/ComponentLoader';
import PhaseHome from './PhaseHome';
import Shimmer from '../Shared/UI/Shimmer';
import PhaseManage from './PhaseManage';
import GameList from './GameList';
import GameNew from './GameNew';

export const PhaseHomeLoading: React.FC = () => (
  <Fragment>
    <div className="column is-12">
      <Shimmer>
        <div
          style={{
            height: '13px',
            marginTop: '13px',
            width: '250px'
          }}
        ></div>
      </Shimmer>
    </div>

    <div className="column">
      <div className="columns is-multiline">
        <div className="column is-12">
          <Shimmer>
            <div
              style={{
                height: '150px',
                marginTop: '13px',
                width: '350px'
              }}
            ></div>
          </Shimmer>
        </div>

        <div className="column is-12">
          <Shimmer>
            <div
              style={{
                height: '150px',
                marginTop: '13px',
                width: '350px'
              }}
            ></div>
          </Shimmer>
        </div>
      </div>
    </div>

    <div className="is-divider-vertical"></div>

    <aside className="column is-4">
      <div className="columns is-multiline">
        <div className="column is-12 has-text-centered">
          <Shimmer>
            <div
              style={{
                height: '13px',
                marginTop: '13px',
                width: '260px'
              }}
            ></div>
          </Shimmer>
        </div>
        <div className="column is-12 has-text-centered">
          <Shimmer>
            <div
              style={{
                height: '150px',
                marginTop: '13px',
                width: '260px'
              }}
            ></div>
          </Shimmer>
        </div>
      </div>
    </aside>
  </Fragment>
);

const mapStateToProps = (state: StoreState) => ({
  currentPhaseId: currentPhaseId(state.phases),
  phaseLoading: phaseLoading(state.phases),
  tournamentLoading: tournamentLoading(state.tournaments)
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getGamesByFilter,
      getPhase
    },
    dispatch
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PhaseLoaderProps = ConnectedProps<typeof connector> &
  RouteComponentProps<RouteProps>;

const PhaseLoader: React.FC<PhaseLoaderProps> = ({
  currentPhaseId,
  match,
  getGamesByFilter,
  getPhase,
  tournamentLoading
}) => {
  const {
    organizationSlug = '',
    tournamentSlug = '',
    phaseId = ''
  } = match.params;
  const selectedPhaseId = phaseId ? phaseId : currentPhaseId;
  return (
    <ComponentLoader
      canRender={!tournamentLoading}
      loader={<PhaseHomeLoading />}
    >
      <Switch>
        <Route
          path={`/:organizationSlug/:tournamentSlug/Manage/:phaseId/NewGame`}
          render={() => (
            <GameNew
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
        <Route
          path={`/:organizationSlug/:tournamentSlug/Manage/:phaseId/Games`}
          render={() => (
            <GameList
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
        <Route
          path={`/:organizationSlug/:tournamentSlug/Manage/:phaseId`}
          render={() => (
            <PhaseManage
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
        <Route
          path={`/:organizationSlug/:tournamentSlug/Manage`}
          render={() => (
            <PhaseManage
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
        <Route
          path={`/:organizationSlug/:tournamentSlug/Phase/:phaseId`}
          render={() => (
            <PhaseHome
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
        <Route
          path={`/:organizationSlug/:tournamentSlug`}
          render={() => (
            <PhaseHome
              organizationSlug={organizationSlug}
              phaseId={selectedPhaseId}
              getGamesByFilter={getGamesByFilter}
              getPhase={getPhase}
              tournamentSlug={tournamentSlug}
            />
          )}
        />
      </Switch>
    </ComponentLoader>
  );
};

export default connector(PhaseLoader);
