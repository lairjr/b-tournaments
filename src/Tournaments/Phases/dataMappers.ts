import { ApiPhase, ApiPhaseRequest } from '../../Shared/httpClient/apiTypes';
import { mapApiGroupToGroupEntity } from '../Groups/dataMappers';
import { mapApiStatToStatEntity } from '../Stats/dataMappers';
import { TournamentPhaseEntity } from './state';

export const mapApiPhaseToPhaseEntity = (
  apiPhase: ApiPhase
): TournamentPhaseEntity => ({
  id: apiPhase.id,
  order: apiPhase.order,
  title: apiPhase.title,
  type: apiPhase.type,
  isInProgress: true,
  groups: apiPhase.groups ? apiPhase.groups.map(mapApiGroupToGroupEntity) : [],
  stats: apiPhase.stats ? apiPhase.stats.map(mapApiStatToStatEntity) : []
});

export const mapPhaseEntityToApiPhaseRequest = (
  phase: TournamentPhaseEntity
): ApiPhaseRequest => ({
  tournament_phase: {
    id: phase.id,
    order: phase.order,
    title: phase.title,
    type: phase.type
  }
});
