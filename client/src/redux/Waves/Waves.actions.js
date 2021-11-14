import { createAction } from '@reduxjs/toolkit';

export const newWaveReceived = createAction('NEW_WAVE_RECEIVED');
export const waveCountUpdated = createAction('WAVE_COUNT_UPDATED');
export const wavesUpdated = createAction('WAVES_UPDATED');
