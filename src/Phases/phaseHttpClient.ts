import {
  ApiPhase,
  ApiPhaseRequest,
  ApiPhaseResponse
} from '../Shared/httpClient/apiTypes';
import httpClient from '../Shared/httpClient/httpClient';
import { mapPhaseEntityToApiPhaseRequest } from './dataMappers';
import { PhaseEntity } from './state';

const PHASES_API = 'https://yochamps-api.herokuapp.com/api/phases';

const deleteRequest = (tournamentPhaseId: string): Promise<string> => {
  const url = `${PHASES_API}/${tournamentPhaseId}`;

  return httpClient.delete(url);
};

const get = async (phaseId: string): Promise<ApiPhase> => {
  const url = `${PHASES_API}/${phaseId}`;

  const { data } = await httpClient.get<ApiPhaseResponse>(url);
  return data;
};

const patch = async (tournamentPhase: PhaseEntity): Promise<ApiPhase> => {
  const url = `${PHASES_API}/${tournamentPhase.id}`;
  const body = mapPhaseEntityToApiPhaseRequest(tournamentPhase);

  const { data } = await httpClient.patch<ApiPhaseRequest, ApiPhaseResponse>(
    url,
    body
  );
  return data;
};

const post = async (tournamentPhase: PhaseEntity): Promise<ApiPhase> => {
  const url = `${PHASES_API}`;
  const body = mapPhaseEntityToApiPhaseRequest(tournamentPhase);

  const { data } = await httpClient.post<ApiPhaseRequest, ApiPhaseResponse>(
    url,
    body
  );
  return data;
};

export default {
  delete: deleteRequest,
  get,
  patch,
  post
};
