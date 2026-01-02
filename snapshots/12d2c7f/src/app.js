import { renderPressToDOM } from './utils/pressRenderer.js';
import { renderNewsGrid } from './components/news-grid/newsGrid.js';
import { renderNewsstandHeader } from './components/newsstand-header/newsstandHeader.js';
import { renderNewsTicker } from './components/news-ticker/newsTicker.js';
import { renderPressHeader } from './components/press-header/pressHeader.js';
import { store } from './store/index.js';

function getFilteredPressList() {
  const state = store.getState();
  const allPressList = state.allPress;

  if (state.currentTab === 'subscribed') {
    const subscribedSet = new Set(state.subscribedIds);
    return allPressList.filter((press) => subscribedSet.has(press.name));
  }

  return allPressList;
}

let previousTab = 'all';
let previousSubscribedCount = 0;

function renderNewsContent() {
  const filteredPressList = getFilteredPressList();
  renderPressToDOM(filteredPressList, '.press-content');
  renderNewsGrid(filteredPressList, '.press-content', 'auto');
}

renderNewsstandHeader('#newsstand-header-container');
renderNewsTicker('#news-ticker-container');
renderPressHeader('#press-header-container');
renderNewsContent();

store.subscribe(() => {
  const state = store.getState();
  const currentTab = state.currentTab;
  const subscribedCount = state.subscribedIds.length;
  
  renderPressHeader('#press-header-container');
  
  if (currentTab !== previousTab) {
    previousTab = currentTab;
    previousSubscribedCount = subscribedCount;
    renderNewsContent();
  } else if (currentTab === 'subscribed' && subscribedCount !== previousSubscribedCount) {
    previousSubscribedCount = subscribedCount;
    renderNewsContent();
  } else {
    previousSubscribedCount = subscribedCount;
  }
});

const initialState = store.getState();
previousTab = initialState.currentTab;
previousSubscribedCount = initialState.subscribedIds.length;
