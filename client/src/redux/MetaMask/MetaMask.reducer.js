import { createReducer } from '@reduxjs/toolkit';
import * as MetaMaskActions from './MetaMask.actions';

const initialState = {
    currentAccount: '',
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MetaMaskActions.connectAccountSuccess, (state, action) => {
        return {
            ...state,
            currentAccount: action.payload.account
        };
    });
});

export default reducer;
