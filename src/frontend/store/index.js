import { Store } from './store.js';
import subscriptionReducer from './modules/subscription.js';

// Root Reducer
function rootReducer(state, actionType, payload) {
  const action = typeof actionType === 'string' 
    ? { type: actionType, payload }
    : actionType || { type: '', payload: undefined };

  return {
    ...subscriptionReducer(state, action),
  };
}

const initialState = subscriptionReducer(undefined, {});

export const store = new Store(initialState, rootReducer);