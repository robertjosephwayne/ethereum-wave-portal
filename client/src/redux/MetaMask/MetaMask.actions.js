import { createAction } from '@reduxjs/toolkit';

export const connectAccountInit = createAction('CONNECT_ACCOUNT_INIT');
export const connectAccountSuccess = createAction('CONNECT_ACCOUNT_SUCCESS');
export const connectAccountFailure = createAction('CONNECT_ACCOUNT_FAILURE');
export const getUsernameInit = createAction('GET_USERNAME_INIT');
export const getUsernameSuccess = createAction('GET_USERNAME_SUCCESS');
export const newUser = createAction('NEW_USER');
