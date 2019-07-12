import React from 'react';
import { dateFromDate, timeFromDate } from '../../Shared/datetime/format';
import { TournamentGameEntity, TournamentGameState } from './state';

const MiniGameCard: React.FC<{ tournamentGame: TournamentGameEntity }> = ({
  tournamentGame
}) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="columns is-multiline is-mobile">
          <div className="column is-12 is-size-7 has-text-weight-bold">
            <div className="columns is-mobile">
              <div className="column is-8" style={{ padding: '.3rem' }}>
                {timeFromDate(tournamentGame.datetime)}
              </div>
              <div
                className="column is-4 has-text-right"
                style={{ padding: '.3rem' }}
              >
                {tournamentGame.location}
              </div>
            </div>
          </div>
          <div className="column is-12">
            <div className="columns is-mobile">
              <div className="column is-8" style={{ padding: '.3rem' }}>
                {tournamentGame.awayTeam.name}
              </div>
              <div
                className="column is-4 has-text-right"
                style={{ padding: '.3rem' }}
              >
                {tournamentGame.awayScore}
              </div>
            </div>
          </div>
          <div className="column is-12">
            <div className="columns is-mobile">
              <div className="column is-8" style={{ padding: '.3rem' }}>
                {tournamentGame.homeTeam.name}
              </div>
              <div
                className="column is-4 has-text-right"
                style={{ padding: '.3rem' }}
              >
                {tournamentGame.homeScore}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const byGameDate = (games: { [key: string]: TournamentGameEntity }) => (
  keyA: string,
  keyB: string
) => games[keyA].datetime.localeCompare(games[keyB].datetime);

const List: React.FC<{ games: { [key: string]: TournamentGameEntity } }> = ({
  games
}) => {
  const byGameDateCompare = byGameDate(games);
  return (
    <div>
      {Object.keys(games)
        .sort(byGameDateCompare)
        .map((key: string) => (
          <MiniGameCard key={key} tournamentGame={games[key]} />
        ))}
    </div>
  );
};

const Loading: React.FC = () => <div>Loading...</div>;

const getNavDates = (dates: string[], selectedDatePosition: number) => ({
  previousDate: dates[selectedDatePosition - 1],
  selectedDate: dates[selectedDatePosition],
  nextDate: dates[selectedDatePosition + 1]
});

interface ListByDateProps {
  dateKeys: string[];
  tournamentGameState: TournamentGameState;
  initialDatePosition: number;
}

const initialListByDataState = {
  selectedPosition: 0
};

type State = Readonly<typeof initialListByDataState>;

class ListByDate extends React.Component<ListByDateProps> {
  readonly state: State;

  constructor(props: ListByDateProps) {
    super(props);
    this.state = {
      selectedPosition: this.props.initialDatePosition
    };
  }

  render() {
    const tournamentGamesByDate = this.props.tournamentGameState
      .tournamentGamesByDate;
    const { previousDate, selectedDate, nextDate } = getNavDates(
      this.props.dateKeys,
      this.state.selectedPosition
    );

    return (
      <div>
        <nav className="columns is-mobile">
          <div className="column is-2">
            <button
              disabled={!previousDate}
              className="button"
              onClick={this.handleDecrementSelectedDatePosition}
            >
              <span className="icon is-small">
                <i className="fas fa-chevron-left" />
              </span>
            </button>
          </div>

          <div className="column has-text-centered">
            {dateFromDate(selectedDate)}
          </div>

          <div className="column is-2 has-text-right">
            <button
              disabled={!nextDate}
              className="button"
              onClick={this.handleIncrementSelectedDatePosition}
            >
              <span className="icon is-small">
                <i className="fas fa-chevron-right" />
              </span>
            </button>
          </div>
        </nav>
        <List games={tournamentGamesByDate[selectedDate]} />
      </div>
    );
  }

  private handleIncrementSelectedDatePosition = () =>
    this.setState(incrementSelectedDatePosition);
  private handleDecrementSelectedDatePosition = () =>
    this.setState(decrementSelectedDatePosition);
}

const incrementSelectedDatePosition = (prevState: State) => ({
  selectedPosition: prevState.selectedPosition + 1
});
const decrementSelectedDatePosition = (prevState: State) => ({
  selectedPosition: prevState.selectedPosition - 1
});

const findCloserAvailableDatePosition = (
  currentDate: string,
  dates: string[]
) => {
  if (currentDate > dates[dates.length - 1]) {
    return dates.length - 1;
  }

  for (let index = 0; index < dates.length; index++) {
    if (dates[index] === currentDate) {
      return index;
    } else if (dates[index] > currentDate) {
      return index;
    }
  }
};

const Wrapper: React.FC<{ tournamentGameState: TournamentGameState }> = ({
  tournamentGameState
}) => {
  if (tournamentGameState.isLoadingRequestTournamentGames) {
    return <Loading />;
  }

  const dateKeys = Object.keys(
    tournamentGameState.tournamentGamesByDate
  ).sort();
  if (dateKeys.length === 0) {
    return <div>No games</div>;
  }

  const currentDate = new Date().toISOString().substring(0, 10);

  const closerAvailableDatePosition = findCloserAvailableDatePosition(
    currentDate,
    dateKeys
  );

  return (
    <div>
      <h2 className="subtitle">Games</h2>
      <ListByDate
        dateKeys={dateKeys}
        initialDatePosition={closerAvailableDatePosition!}
        tournamentGameState={tournamentGameState}
      />
    </div>
  );
};

export default Wrapper;
