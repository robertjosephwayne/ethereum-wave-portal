import { createReducer } from '@reduxjs/toolkit';
import * as MetaMaskActions from './MetaMask.actions';

const initialState = {
    currentAccount: '',
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MetaMaskActions.connectAccountSuccess, (state, action) => {
        return {
            ...state,
            currentAccount: action.payload.account,
        };
    });

    builder.addCase(MetaMaskActions.getUsernameSuccess, (state, action) => {
        return {
            ...state,
            username: action.payload.username,
        };
    });
});

export default reducer;
