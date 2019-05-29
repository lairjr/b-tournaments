import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import { requestTournament } from "../Tournaments/actions";
import { TournamentState } from "../Tournaments/state";
import { deleteTournamentTeam } from "../Tournaments/Teams/actions";
import List from '../Tournaments/Teams/List';
import { TournamentTeamState } from "../Tournaments/Teams/state";
import { TournamentHomeMatchProps } from "./support/routerInterfaces";
import withTournaments from "./support/withTournaments";

interface TournamentTeamListProps extends RouteComponentProps<TournamentHomeMatchProps> {
	deleteTournamentTeam: any,
	tournamentTeamState: TournamentTeamState,
	tournamentState: TournamentState;
	requestTournament: any,
};


class TournamentTeamList extends React.Component<TournamentTeamListProps> {
	render() {
		const {
			deleteTournamentTeam,
			match,
			tournamentTeamState,
			tournamentState,
		} = this.props;

		return (
			<List
				currentOrganizationSlug={match.params.organizationSlug}
				currentTournamentSlug={match.params.tournamentSlug}
				deleteTournamentTeam={deleteTournamentTeam}
				tournamentTeamState={tournamentTeamState}
				tournamentState={tournamentState}
				url={match.url} />
		)
	}

	componentDidMount() {
		const tournamentId = this.props.tournamentState.tournaments[this.props.match.params.tournamentSlug].id;
		this.props.requestTournament(tournamentId);
	}
}


const mapStateToProps = (state: any) => ({
	tournamentState: state.tournaments,
	tournamentTeamState: state.tournamentTeams,
});

const mapDispatchToProps = (dispatch: any, state: any) => {
	const tournamentId = state.tournamentState.tournaments[state.match.params.tournamentSlug].id;
	return bindActionCreators({
		deleteTournamentTeam: deleteTournamentTeam(tournamentId),
		requestTournament,
	}, dispatch)
};

export default withTournaments(connect(mapStateToProps, mapDispatchToProps)(TournamentTeamList));