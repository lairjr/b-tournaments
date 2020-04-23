import { signIn, signUp, passwordReset } from './effects';
import { UserEntity, SignUpEntity, PasswordResetEntity } from './entity';
import * as toast from '../Shared/bulma/toast';
import { History } from 'history';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  passwordResetStart,
  passwordResetSuccess,
  passwordResetFailure
} from './actions';
import accountHttpClient from './accountHttpClient';
import ApiError from '../Shared/httpClient/ApiError';

let dispatch: jest.Mock;

const PASSWORD_RESET: PasswordResetEntity = {
  email: 'some@email.com',
  password: 'some password',
  recaptcha: 'some recaptcha',
  repeatedPassword: 'some repeated password'
};
const SIGN_UP: SignUpEntity = {
  email: 'some@email.com',
  password: 'some password',
  recaptcha: 'some recaptcha',
  repeatedPassword: 'some repeated password'
};
const SOME_USER: UserEntity = {
  email: 'some@email.com',
  password: 'some password'
};
const mockHistory = ({
  push: jest.fn()
} as unknown) as History;

describe('accountEffects', () => {
  beforeEach(() => {
    jest.spyOn(toast, 'displayToast');
    jest.spyOn(Storage.prototype, 'setItem');
  });

  describe('signIn', () => {
    beforeEach(() => {
      dispatch = jest.fn();
    });

    it('dispatches start sign in action', () => {
      signIn(SOME_USER, mockHistory)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(signInStart());
    });

    describe('on success', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest.spyOn(accountHttpClient, 'signIn').mockResolvedValue({
          data: { email: 'some@email.com', token: 'some token' }
        });

        signIn(SOME_USER, mockHistory)(dispatch);
      });

      it('dispatches post success action', () => {
        expect(dispatch).toHaveBeenCalledWith(
          signInSuccess({
            data: {
              email: 'some@email.com',
              token: 'some token'
            }
          })
        );
      });

      it('sets the token on local storage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'token',
          'some token'
        );
      });

      it('redirects to account page', () => {
        expect(mockHistory.push).toHaveBeenCalledWith('/Account');
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest
          .spyOn(accountHttpClient, 'signIn')
          .mockRejectedValue(new Error('some error'));
      });

      it('dispatches post failure action', async () => {
        await signIn(SOME_USER, mockHistory)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(
          signInFailure(new Error('some error'))
        );
      });

      describe('with not found error', () => {
        const apiError = new ApiError({
          status: 404,
          data: { errors: { detail: 'not found' } }
        });

        beforeEach(() => {
          dispatch.mockReset();

          jest.spyOn(accountHttpClient, 'signIn').mockRejectedValue(apiError);
        });

        it('returns formatted errors', async () => {
          const result = await signIn(SOME_USER, mockHistory)(dispatch);
          expect(result).toEqual({
            email: ['user not found']
          });
        });
      });

      describe('with unauthorized', () => {
        const apiError = new ApiError({
          status: 401,
          data: { errors: { detail: 'Unauthorized' } }
        });

        beforeEach(() => {
          dispatch.mockReset();

          jest.spyOn(accountHttpClient, 'signIn').mockRejectedValue(apiError);
        });

        it('returns formatted errors', async () => {
          const result = await signIn(SOME_USER, mockHistory)(dispatch);
          expect(result).toEqual({
            email: ['invalid credentials'],
            password: ['invalid credentials']
          });
        });
      });
    });
  });

  describe('signUp', () => {
    beforeEach(() => {
      dispatch = jest.fn();
    });

    it('dispatches start sign in action', () => {
      signUp(SIGN_UP, mockHistory)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(signUpStart());
    });

    describe('on success', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest.spyOn(accountHttpClient, 'signUp').mockResolvedValue({
          data: { email: 'some@email.com', token: 'some token' }
        });

        signUp(SIGN_UP, mockHistory)(dispatch);
      });

      it('dispatches post success action', () => {
        expect(dispatch).toHaveBeenCalledWith(
          signUpSuccess({
            data: {
              email: 'some@email.com',
              token: 'some token'
            }
          })
        );
      });

      it('redirects to account page', () => {
        expect(mockHistory.push).toHaveBeenCalledWith('/Account');
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest
          .spyOn(accountHttpClient, 'signUp')
          .mockRejectedValue(new Error('some error'));
      });

      it('dispatches post failure action', async () => {
        await signUp(SIGN_UP, mockHistory)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(
          signUpFailure(new Error('some error'))
        );
      });

      it('dispatches display toast', () => {
        expect(toast.displayToast).toHaveBeenCalledWith(
          'Sign up failed :(',
          'is-primary'
        );
      });
    });
  });

  describe('passwordReset', () => {
    beforeEach(() => {
      dispatch = jest.fn();
    });

    it('dispatches start sign in action', () => {
      passwordReset(PASSWORD_RESET, mockHistory)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(passwordResetStart());
    });

    describe('on success', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest.spyOn(accountHttpClient, 'passwordReset').mockResolvedValue({
          data: { email: 'some@email.com', token: 'some token' }
        });

        passwordReset(PASSWORD_RESET, mockHistory)(dispatch);
      });

      it('dispatches post success action', () => {
        expect(dispatch).toHaveBeenCalledWith(
          passwordResetSuccess({
            data: {
              email: 'some@email.com',
              token: 'some token'
            }
          })
        );
      });

      it('redirects to account page', () => {
        expect(mockHistory.push).toHaveBeenCalledWith('/Account');
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        dispatch.mockReset();

        jest
          .spyOn(accountHttpClient, 'passwordReset')
          .mockRejectedValue(new Error('some error'));
      });

      it('dispatches post failure action', async () => {
        await passwordReset(PASSWORD_RESET, mockHistory)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(
          passwordResetFailure(new Error('some error'))
        );
      });

      it('dispatches display toast', () => {
        expect(toast.displayToast).toHaveBeenCalledWith(
          'Password recovery failed :(',
          'is-primary'
        );
      });
    });
  });
});