import { createReducer } from '@reduxjs/toolkit';
import * as MetaMaskActions from './MetaMask.actions';

const initialState = {
    currentAccount: '',
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MetaMaskActions.connectAccountInit, (state, action) => {
        return {
            ...state,
            loadingAccount: true,
        };
    });

    builder.addCase(MetaMaskActions.connectAccountSuccess, (state, action) => {
        return {
            ...state,
            currentAccount: action.payload.account,
            loadingAccount: false,
        };
    });

    builder.addCase(MetaMaskActions.getUsernameInit, (state, action) => {
        return {
            ...state,
            loadingUsername: true,
        };
    });

    builder.addCase(MetaMaskActions.getUsernameSuccess, (state, action) => {
        return {
            ...state,
            username: action.payload.username,
            loadingUsername: false,
        };
    });
});

export default reducer;
