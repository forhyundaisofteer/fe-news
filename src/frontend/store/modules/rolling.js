import { pressList } from '../pressData.js';

// Action Types
const SET_TAB = 'SET_TAB';
const SUBSCRIBE = 'SUBSCRIBE';
const UNSUBSCRIBE = 'UNSUBSCRIBE';
const SET_PAGE = 'SET_PAGE';
const NEXT_PAGE = 'NEXT_PAGE';
const PREV_PAGE = 'PREV_PAGE';

// Action Creators
export const setTab = (tab) => ({ type: SET_TAB, payload: tab });
export const subscribe = (pressName) => ({ type: SUBSCRIBE, payload: pressName });
export const unsubscribe = (pressName) => ({ type: UNSUBSCRIBE, payload: pressName });
export const setPage = (page) => ({ type: SET_PAGE, payload: page });
export const nextPage = () => ({ type: NEXT_PAGE });
export const prevPage = () => ({ type: PREV_PAGE });

// Initial State
const initialState = {
  allPress: pressList,
  subscribedIds: [],
  currentTab: 'all',
  currentPage: 0,
};

// Reducer
export default function subscriptionReducer(state = initialState, action) {
  if (!action || !action.type) {
    return state;
  }

  const { type, payload } = action;

  switch (type) {
    case SET_TAB:
      return { ...state, currentTab: payload, currentPage: 0 };
    case SUBSCRIBE: {
      const updatedSubscribed = [...state.subscribedIds, payload];
      const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
      return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
    }
    case UNSUBSCRIBE: {
      const updatedSubscribed = state.subscribedIds.filter((id) => id !== payload);
      const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
      return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
    }
    case SET_PAGE:
      return { ...state, currentPage: payload };
    case NEXT_PAGE:
      return { ...state, currentPage: state.currentPage + 1 };
    case PREV_PAGE:
      return { ...state, currentPage: state.currentPage - 1 };
    default:
      return state;
  }
}

