import { Store } from './store.js';
import { reducer } from './reducer.js';
import { pressList } from './pressData.js';

const initialState = {
  allPress: pressList, 
  subscribedIds: [], 
  currentTab: 'all', 
  currentPage: 0, 
};

export const store = new Store(initialState, reducer);

