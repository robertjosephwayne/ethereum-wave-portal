import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './root.reducer';

const epicMiddleware = createEpicMiddleware();

const middleware = [epicMiddleware];

export default function initializeStore() {
    const store = configureStore({
        reducer: rootReducer,
        middleware,
    });

    epicMiddleware.run(rootEpic);

    return store;
}
