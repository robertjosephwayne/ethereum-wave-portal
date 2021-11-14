import { combineReducers } from '@reduxjs/toolkit';
import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';

import metaMaskReducer from './MetaMask/MetaMask.reducer';
import wavesReducer from './Waves/Waves.reducer';

const epics = [];

export const rootEpic = (action$, store$, dependencies) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        }),
    );

export const rootReducer = combineReducers({
    metaMask: metaMaskReducer,
    waves: wavesReducer,
});
