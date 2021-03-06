import React, { Fragment } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import List, { ListLoading } from '../Organizations/List';
import { organizations } from '../Organizations/selectors';
import { StoreState } from '../store';
import { bindActionCreators, Dispatch } from 'redux';
import { deleteOrganization } from '../Organizations/effects';
import ComponentLoader from '../Shared/UI/ComponentLoader';
import { isGettingAccountLoading } from '../Accounts/selectors';
import { Trans } from 'react-i18next';
import withAccount from './support/withAccount';
import { getAccount } from '../Accounts/effects';

const mapStateToProps = (state: StoreState) => {
  return {
    isGettingAccountLoading: isGettingAccountLoading(state.account),
    organizations: organizations(state.organizations)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      deleteOrganization,
      getAccount
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type OrganizationListProps = ConnectedProps<typeof connector>;

const OrganizationList: React.FC<OrganizationListProps> = ({
  deleteOrganization,
  isGettingAccountLoading,
  organizations
}) => (
  <Fragment>
    <div className="columns is-gapless is-vcentered is-mobile">
      <div className="column is-10">
        <h2 className="subtitle">
          <Trans>organizations</Trans>
        </h2>
      </div>

      <div className="column is-2 has-text-right">
        <Link className="button is-text" to={`/Account/NewOrganization`}>
          <Trans>new</Trans>
        </Link>
      </div>
    </div>

    <ComponentLoader
      canRender={!isGettingAccountLoading}
      loader={<ListLoading />}
    >
      <List
        deleteOrganization={deleteOrganization}
        organizations={organizations}
      />
    </ComponentLoader>
  </Fragment>
);

export default connector(withAccount(OrganizationList));
