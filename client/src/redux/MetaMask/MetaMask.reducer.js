import { createReducer } from '@reduxjs/toolkit';
import * as MetaMaskActions from './MetaMask.actions';

const initialState = {
    currentAccount: '',
    loadingAccount: false,
    users: {},
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

    builder.addCase(MetaMaskActions.connectAccountFailure, (state, action) => {
        return {
            ...state,
            currentAccount: '',
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

    builder.addCase(MetaMaskActions.newUser, (state, action) => {
        const { address, username } = action.payload.user;

        return {
            ...state,
            users: {
                ...state.users,
                [address]: username,
            },
        };
    });
});

export default reducer;
