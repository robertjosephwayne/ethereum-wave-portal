import { createReducer } from '@reduxjs/toolkit';
import * as WavesActions from './Waves.actions';

const initialState = {
    allWaves: [],
    waveCount: 1,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WavesActions.newWaveReceived, (state, action) => {
        return {
            ...state,
            allWaves: [action.payload.newWave, ...state.allWaves],
        };
    });

    builder.addCase(WavesActions.waveCountUpdated, (state, action) => {
        return {
            ...state,
            waveCount: action.payload.updatedWaveCount,
        };
    });

    builder.addCase(WavesActions.wavesUpdated, (state, action) => {
        return {
            ...state,
            allWaves: action.payload.allWaves,
        };
    });
});

export default reducer;
