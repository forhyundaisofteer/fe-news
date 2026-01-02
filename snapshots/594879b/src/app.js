import { renderPressToDOM } from './utils/pressRenderer.js';
import { renderNewsGrid } from './components/news-grid/newsGrid.js';
import { renderNewsstandHeader } from './components/newsstand-header/newsstandHeader.js';
import { renderNewsTicker } from './components/news-ticker/newsTicker.js';
import { renderPressHeader } from './components/press-header/pressHeader.js';
import { observeStore } from './utils/observer.js';
import { shallowEqual } from './utils/compare.js';

const selectFilteredPress = (state) => {
  const { allPress, currentTab, subscribedIds } = state;
  if (currentTab === 'subscribed') {
    const subscribedSet = new Set(subscribedIds);
    return allPress.filter((press) => subscribedSet.has(press.name));
  }
  return allPress;
};

const updateNewsContent = (filteredPressList) => {
  renderPressToDOM(filteredPressList, '.press-content');
  renderNewsGrid(filteredPressList, '.press-content', 'auto');
};

renderNewsstandHeader('#newsstand-header-container');
renderNewsTicker('#news-ticker-container');


// 헤더 영역
observeStore(
  (state) => ({ 
    tab: state.currentTab, 
    count: state.subscribedIds.length 
  }),
  (data) => {
    renderPressHeader('#press-header-container');
  },
  shallowEqual
);

// 뉴스 컨텐츠 영역
observeStore(
  (state) => ({ 
    currentTab: state.currentTab, 
    subscribedIds: state.subscribedIds 
  }),
  (data, state) => { 
    const filteredList = selectFilteredPress(state);
    updateNewsContent(filteredList);
  },
  shallowEqual
);
