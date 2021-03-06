import { displayToast } from '../Shared/bulma/toast';
import {
  deleteDrawFailure,
  deleteDrawStart,
  deleteDrawSuccess,
  patchDrawFailure,
  patchDrawStart,
  patchDrawSuccess,
  postDrawFailure,
  postDrawStart,
  postDrawSuccess,
  batchPatchDrawSuccess
} from './actions';
import drawHttpClient from './drawHttpClient';
import { DrawEntity } from './state';
import { Dispatch } from 'redux';

export const deleteDraw = (draw: DrawEntity) => async (dispatch: Dispatch) => {
  dispatch(deleteDrawStart());

  try {
    const response = await drawHttpClient.delete(draw.id);

    dispatch(deleteDrawSuccess(response));
    displayToast(`${draw.title} deleted!`, 'is-success');
  } catch (err) {
    dispatch(deleteDrawFailure(err));
  }
};

export const patchDraw = (draw: DrawEntity) => async (dispatch: Dispatch) => {
  dispatch(patchDrawStart());

  try {
    const response = await drawHttpClient.patch(draw);

    dispatch(patchDrawSuccess(response));
    displayToast(`${draw.title} updated!`, 'is-success');
  } catch (err) {
    dispatch(patchDrawFailure(err));
  }
};

export const patchBatchDraw = (draws: DrawEntity[]) => async (
  dispatch: Dispatch
) => {
  dispatch(patchDrawStart());

  try {
    const response = await drawHttpClient.patchBatch(draws);

    dispatch(batchPatchDrawSuccess(response));
    displayToast(`Draws updated!`, 'is-success');
  } catch (err) {
    dispatch(patchDrawFailure(err));
  }
};

export const postDraw = (draw: DrawEntity, phaseId: string) => async (
  dispatch: Dispatch
) => {
  dispatch(postDrawStart());

  try {
    const response = await drawHttpClient.post(draw, phaseId);

    dispatch(postDrawSuccess(response));
    displayToast(`${draw.title} created!`, 'is-success');
  } catch (err) {
    dispatch(postDrawFailure(err));
  }
};
