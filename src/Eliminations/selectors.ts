import {
  EliminationEntity,
  EliminationState,
  DEFAULT_ELIMINATION
} from './state';
import { byOrder } from './compareFunctions';

export const eliminations = (state: EliminationState): EliminationEntity[] =>
  Object.keys(state.eliminations).map((key: string) => state.eliminations[key]);

export const sortedEliminations = (
  state: EliminationState
): EliminationEntity[] => eliminations(state).sort(byOrder);

export const eliminationById = (
  state: EliminationState,
  eliminationId: string
) => {
  if (!eliminationId || !state.eliminations[eliminationId]) {
    return DEFAULT_ELIMINATION;
  }
  return state.eliminations[eliminationId];
};

export const eliminationsLoading = (state: EliminationState): boolean =>
  state.isLoadingRequestTournament;
export const patchingElimination = (state: EliminationState): boolean =>
  state.isLoadingPatchElimination;
export const postingElimination = (state: EliminationState): boolean =>
  state.isLoadingPostElimination;
export const deletingElimination = (state: EliminationState): boolean =>
  state.isLoadingDeleteElimination;
