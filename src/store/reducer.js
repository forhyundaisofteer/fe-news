export const reducer = (state, actionType, payload) => {
  switch (actionType) {
    case 'SET_TAB':
      return { ...state, currentTab: payload, currentPage: 0 };
    case 'SUBSCRIBE': {
      const updatedSubscribed = [...state.subscribedIds, payload];
      const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
      return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
    }
    case 'UNSUBSCRIBE': {
      const updatedSubscribed = state.subscribedIds.filter((id) => id !== payload);
      const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
      return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
    }
    case 'SET_PAGE':
      return { ...state, currentPage: payload };
    case 'NEXT_PAGE':
      return { ...state, currentPage: state.currentPage + 1 };
    case 'PREV_PAGE':
      return { ...state, currentPage: state.currentPage - 1 };
    default:
      return state;
  }
};

