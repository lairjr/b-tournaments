import {
  ApiTournamentWithDependecies,
  ApiOrganization,
  ApiAccountResponse
} from '../Shared/httpClient/apiTypes';
import {
  createReducer,
  entityById,
  mapEntitiesByKey,
  returnProperty,
  apiDataToEntitiesOverride
} from '../Shared/store/helpers';
import { HttpAction } from '../Shared/store/interfaces';
import { GET_TOURNAMENT_SUCCESS } from '../Tournaments/actions';
import {
  ActionTypes,
  DELETE_ORGANIZATION,
  DELETE_ORGANIZATION_FAILURE,
  DELETE_ORGANIZATION_SUCCESS,
  GET_ORGANIZATION,
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_FAILURE,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  PATCH_ORGANIZATION,
  PATCH_ORGANIZATION_FAILURE,
  PATCH_ORGANIZATION_SUCCESS,
  POST_ORGANIZATION,
  POST_ORGANIZATION_FAILURE,
  POST_ORGANIZATION_SUCCESS
} from './actions';
import { initialState, OrganizationEntity, OrganizationState } from './state';
import { mapApiOrganizationToOrganizationEntity } from './dataMappers';
import { GET_ACCOUNT_SUCCESS } from '../Accounts/actions';

const apiOrganizationToEntities = apiDataToEntitiesOverride<
  ApiOrganization,
  OrganizationEntity
>(mapApiOrganizationToOrganizationEntity, returnProperty('slug'));

const deleteOrganization = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingDeleteOrganization: true
});

const deleteOrganizationFailure = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingDeleteOrganization: false
});

const deleteOrganizationSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, string>
) => {
  const organizations = Object.keys(state.organizations)
    .filter(entityById(state.organizations, action.payload!))
    .reduce(mapEntitiesByKey(state.organizations), {});
  return {
    ...state,
    isLoadingDeleteOrganization: false,
    organizations
  };
};

const patchOrganization = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPatchOrganization: true
});

const patchOrganizationFailure = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPatchOrganization: false
});

const patchOrganizationSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, ApiOrganization>
) => ({
  ...state,
  isLoadingPatchOrganization: false,
  organizations: [action.payload!].reduce(
    apiOrganizationToEntities,
    state.organizations
  )
});

const postOrganization = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPostOrganization: true
});

const postOrganizationFailure = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPostOrganization: false
});

const postOrganizationSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, ApiOrganization>
) => ({
  ...state,
  isLoadingPostOrganization: false,
  organizations: [action.payload!].reduce(
    apiOrganizationToEntities,
    state.organizations
  )
});

const getAccountSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, ApiAccountResponse>
) => ({
  ...state,
  organizations: action.payload!.data.organizations.reduce(
    apiOrganizationToEntities,
    state.organizations
  )
});

const getOrganization = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingRequestOrganizations: true
});

const getOrganizationFailure = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingRequestOrganizations: false
});

const getOrganizationSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, ApiOrganization>
) => ({
  ...state,
  isLoadingRequestOrganizations: false,
  organizations: [action.payload!].reduce(
    apiOrganizationToEntities,
    state.organizations
  )
});

const getOrganizations = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingRequestOrganizations: true
});

const getOrganizationsFailure = (
  state: OrganizationState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingRequestOrganizations: false
});

const getOrganizationsSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, OrganizationEntity[]>
) => ({
  ...state,
  isLoadingRequestOrganizations: false,
  organizations: action.payload!.reduce(apiOrganizationToEntities, {})
});

const getTournamentSuccess = (
  state: OrganizationState,
  action: HttpAction<ActionTypes, ApiTournamentWithDependecies>
) => ({
  ...state,
  organizations: [action.payload!.organization].reduce(
    apiOrganizationToEntities,
    {}
  )
});

export default createReducer(initialState, {
  [DELETE_ORGANIZATION]: deleteOrganization,
  [DELETE_ORGANIZATION_FAILURE]: deleteOrganizationFailure,
  [DELETE_ORGANIZATION_SUCCESS]: deleteOrganizationSuccess,
  [PATCH_ORGANIZATION]: patchOrganization,
  [PATCH_ORGANIZATION_FAILURE]: patchOrganizationFailure,
  [PATCH_ORGANIZATION_SUCCESS]: patchOrganizationSuccess,
  [POST_ORGANIZATION]: postOrganization,
  [POST_ORGANIZATION_FAILURE]: postOrganizationFailure,
  [POST_ORGANIZATION_SUCCESS]: postOrganizationSuccess,
  [GET_ACCOUNT_SUCCESS]: getAccountSuccess,
  [GET_ORGANIZATION]: getOrganization,
  [GET_ORGANIZATION_FAILURE]: getOrganizationFailure,
  [GET_ORGANIZATION_SUCCESS]: getOrganizationSuccess,
  [GET_ORGANIZATIONS]: getOrganizations,
  [GET_ORGANIZATIONS_FAILURE]: getOrganizationsFailure,
  [GET_ORGANIZATIONS_SUCCESS]: getOrganizationsSuccess,
  [GET_TOURNAMENT_SUCCESS]: getTournamentSuccess
});
