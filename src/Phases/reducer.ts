import {
  ApiPhase,
  ApiTournamentWithDependecies
} from '../Shared/httpClient/apiTypes';
import {
  apiDataToEntitiesOverride,
  createReducer,
  entityById,
  mapEntitiesByKey,
  returnProperty,
  apiDataToEntities
} from '../Shared/store/helpers';
import { HttpAction } from '../Shared/store/interfaces';
import { GET_TOURNAMENT_SUCCESS } from '../Tournaments/actions';
import { currentPhaseId } from '../Tournaments/dataMappers';
import {
  ActionTypes,
  DELETE_PHASE,
  DELETE_PHASE_FAILURE,
  DELETE_PHASE_SUCCESS,
  GET_PHASE,
  GET_PHASE_FAILURE,
  GET_PHASE_SUCCESS,
  PATCH_PHASE,
  PATCH_PHASE_FAILURE,
  PATCH_PHASE_SUCCESS,
  POST_PHASE,
  POST_PHASE_FAILURE,
  POST_PHASE_SUCCESS,
  PATCH_BATCH_PHASE_SUCCESS
} from './actions';
import { mapApiPhaseToPhaseEntity } from './dataMappers';
import { initialState, PhaseEntity, PhaseState } from './state';
import { ApiPhaseBatchResponseData } from './phaseHttpClient';

const apiPhaseToEntitiesOverride = apiDataToEntitiesOverride<
  ApiPhase,
  PhaseEntity
>(mapApiPhaseToPhaseEntity, returnProperty('id'));

const apiPhaseToEntities = apiDataToEntities<ApiPhase, PhaseEntity>(
  mapApiPhaseToPhaseEntity,
  returnProperty('id')
);

const deletePhase = (state: PhaseState, action: HttpAction<ActionTypes>) => ({
  ...state,
  isLoadingDeletePhase: true
});

const deletePhaseFailure = (
  state: PhaseState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingDeletePhase: false
});

const deletePhaseSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, string>
) => {
  const phases = Object.keys(state.phases)
    .filter(entityById(state.phases, action.payload!))
    .reduce(mapEntitiesByKey(state.phases), {});
  return {
    ...state,
    phases,
    isLoadingDeletePhase: false
  };
};

const patchPhase = (state: PhaseState, action: HttpAction<ActionTypes>) => ({
  ...state,
  isLoadingPatchPhase: true
});

const patchPhaseFailure = (
  state: PhaseState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPatchPhase: false
});

const patchPhaseSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, ApiPhase>
) => ({
  ...state,
  isLoadingPatchPhase: false,
  phases: [action.payload!].reduce(apiPhaseToEntitiesOverride, state.phases)
});

const batchPatchPhaseSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, ApiPhaseBatchResponseData>
) => ({
  isLoadingPatchPhase: false,
  phases: Object.keys(action.payload!).reduce(
    (currentEntities: { [id: string]: PhaseEntity }, phaseId: string) => {
      const mappedPhase = mapApiPhaseToPhaseEntity(action.payload![phaseId]);
      const patchedPhase = {
        ...currentEntities[phaseId],
        ...mappedPhase
      };

      return {
        ...currentEntities,
        [phaseId]: patchedPhase
      };
    },
    state.phases
  )
});

const postPhase = (state: PhaseState, action: HttpAction<ActionTypes>) => ({
  ...state,
  isLoadingPostPhase: true
});

const postPhaseFailure = (
  state: PhaseState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPostPhase: false
});

const postPhaseSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, ApiPhase>
) => ({
  ...state,
  isLoadingPostPhase: false,
  phases: [action.payload!].reduce(apiPhaseToEntitiesOverride, state.phases)
});

const getPhase = (state: PhaseState, action: HttpAction<ActionTypes>) => ({
  ...state,
  isLoadingPhase: true
});

const getPhaseFailure = (
  state: PhaseState,
  action: HttpAction<ActionTypes>
) => ({
  ...state,
  isLoadingPhase: false
});

const getPhaseSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, ApiPhase>
) => ({
  ...state,
  isLoadingPhase: false,
  phases: [action.payload!].reduce(apiPhaseToEntitiesOverride, state.phases)
});

const getTournamentSuccess = (
  state: PhaseState,
  action: HttpAction<ActionTypes, ApiTournamentWithDependecies>
) => ({
  ...state,
  phases: action.payload!.phases
    ? action.payload!.phases.reduce(apiPhaseToEntities(state.phases), {})
    : {},
  currentPhaseId: currentPhaseId(action.payload!)
});

export default createReducer(initialState, {
  [DELETE_PHASE]: deletePhase,
  [DELETE_PHASE_FAILURE]: deletePhaseFailure,
  [DELETE_PHASE_SUCCESS]: deletePhaseSuccess,
  [PATCH_PHASE]: patchPhase,
  [PATCH_PHASE_FAILURE]: patchPhaseFailure,
  [PATCH_PHASE_SUCCESS]: patchPhaseSuccess,
  [PATCH_BATCH_PHASE_SUCCESS]: batchPatchPhaseSuccess,
  [POST_PHASE]: postPhase,
  [POST_PHASE_FAILURE]: postPhaseFailure,
  [POST_PHASE_SUCCESS]: postPhaseSuccess,
  [GET_PHASE]: getPhase,
  [GET_PHASE_FAILURE]: getPhaseFailure,
  [GET_PHASE_SUCCESS]: getPhaseSuccess,
  [GET_TOURNAMENT_SUCCESS]: getTournamentSuccess
});
