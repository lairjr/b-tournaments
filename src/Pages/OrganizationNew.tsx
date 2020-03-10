import React, { Fragment } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { postOrganization } from '../Organizations/effects';
import { default as OrganizationForm } from '../Organizations/Form';
import { Form, FormRenderProps } from 'react-final-form';
import {
  DEFAULT_ORGANIZATION,
  OrganizationEntity
} from '../Organizations/state';
import Helmet from 'react-helmet';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      postOrganization
    },
    dispatch
  );

const connector = connect(state => state, mapDispatchToProps);

type OrganizationNewProps = ConnectedProps<typeof connector>;

const OrganizationNew: React.FC<OrganizationNewProps> = ({
  postOrganization
}) => {
  const backUrl = `/Account`;
  return (
    <Fragment>
      <div className="columns is-vcentered is-mobile is-multiline">
        <div className="column is-12">
          <h2 className="subtitle">New organization</h2>
        </div>

        <div className="column is-12">
          <Form
            onSubmit={postOrganization}
            initialValues={DEFAULT_ORGANIZATION}
            render={(props: FormRenderProps<OrganizationEntity>) => (
              <OrganizationForm {...props} backUrl={backUrl} />
            )}
          />
        </div>
      </div>

      <Helmet>
        <title>Go Champs! | New Organization</title>
      </Helmet>
    </Fragment>
  );
};

export default connector(OrganizationNew);
