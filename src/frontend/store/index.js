import { Store } from './store.js';
import gridReducer from './modules/grid.js';

// Root Reducer
function rootReducer(state, actionType, payload) {
  const action = typeof actionType === 'string' 
    ? { type: actionType, payload }
    : actionType || { type: '', payload: undefined };

  return {
    ...gridReducer(state, action),
  };
}

const initialState = gridReducer(undefined, {});

export const store = new Store(initialState, rootReducer);