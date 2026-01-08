import { parseGridDataFromEagerData } from '../../utils/eagerDataParser.js';

// Prefix (lowercase)
const PREFIX = 'grid';

// Constants
export const ITEMS_PER_PAGE = 24;

// Action Types
const SET_TAB = `${PREFIX}/SET_TAB`;
const SUBSCRIBE = `${PREFIX}/SUBSCRIBE`;
const UNSUBSCRIBE = `${PREFIX}/UNSUBSCRIBE`;
const TOGGLE_SUBSCRIBE = `${PREFIX}/TOGGLE_SUBSCRIBE`;
const SET_PAGE = `${PREFIX}/SET_PAGE`;
const NEXT_PAGE = `${PREFIX}/NEXT_PAGE`;
const PREV_PAGE = `${PREFIX}/PREV_PAGE`;

// Action Creators
export const setTab = (tab) => ({ type: SET_TAB, payload: tab });
export const subscribe = (pressName) => ({ type: SUBSCRIBE, payload: pressName });
export const unsubscribe = (pressName) => ({ type: UNSUBSCRIBE, payload: pressName });
export const toggleSubscribe = (pressName) => ({ type: TOGGLE_SUBSCRIBE, payload: pressName });
export const setPage = (page) => ({ type: SET_PAGE, payload: page });
export const nextPage = () => ({ type: NEXT_PAGE });
export const prevPage = () => ({ type: PREV_PAGE });

// Initial State 
const getInitialState = () => {
  try {
    const allPress = parseGridDataFromEagerData();
    return {
      allPress,
      subscribedIds: [],
      currentTab: 'all',
      currentPage: 0,
    };
  } catch (error) {
    console.error(`Error parsing window["EAGER-DATA"] in ${PREFIX} reducer:`, error);
    return {
      allPress: [],
      subscribedIds: [],
      currentTab: 'all',
      currentPage: 0,
    };
  }
};

const initialState = getInitialState();

// Selectors
export const selectors = {
  getAllPress: (state) => state.allPress,
  getFilteredPress: (state) => {
    const { allPress, currentTab, subscribedIds } = state;
    if (currentTab === 'subscribed') {
      return allPress.filter((press) => subscribedIds.includes(press.name));
    }
    return allPress;
  },
  getPages: (state) => {
    const list = selectors.getFilteredPress(state);
    return Array.from(
      { length: Math.ceil(list.length / ITEMS_PER_PAGE) },
      (_, i) => list.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
    );
  },
  getCurrentPageItems: (state) => {
    const pages = selectors.getPages(state);
    return pages[state.currentPage] || [];
  },
  getTotalPages: (state) => {
    const list = selectors.getFilteredPress(state);
    return Math.ceil(list.length / ITEMS_PER_PAGE);
  },
  canGoNext: (state) => {
    const total = selectors.getTotalPages(state);
    return state.currentPage < total - 1;
  },
  canGoPrev: (state) => {
    return state.currentPage > 0;
  },
};

// Reducer
export default function gridReducer(state = initialState, action) {
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
    case TOGGLE_SUBSCRIBE: {
      const isSubscribed = state.subscribedIds.includes(payload);
      const updatedSubscribed = isSubscribed
        ? state.subscribedIds.filter((id) => id !== payload)
        : [...state.subscribedIds, payload];
      const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
      return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
    }
    case SET_PAGE:
      return { ...state, currentPage: payload };
    case NEXT_PAGE: {
      if (selectors.canGoNext(state)) {
        return { ...state, currentPage: state.currentPage + 1 };
      }
      return state;
    }
    case PREV_PAGE: {
      if (selectors.canGoPrev(state)) {
        return { ...state, currentPage: state.currentPage - 1 };
      }
      return state;
    }
    default:
      return state;
  }
}

