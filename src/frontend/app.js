import { renderPressToDOM } from './utils/pressRenderer.js';
import { renderNewsGrid } from './components/news-grid/newsGrid.js';
import { renderNewsstandHeader } from './components/newsstand-header/newsstandHeader.js';
import { renderNewsTicker } from './components/news-ticker/newsTicker.js';
import { renderPressHeader } from './components/press-header/pressHeader.js';
import { observeStore } from './store/observeStore.js';
import { shallowEqual } from './utils/compare.js';
import { selectors } from './store/modules/grid.js';

// 정적 요소 렌더링
renderNewsstandHeader('#newsstand-header-container');
renderNewsTicker('#news-ticker-container');

// 동적 요소 렌더링
observeStore(
  (state) => ({ 
    currentTab: state.currentTab, 
    subscribedCount: state.subscribedIds.length 
  }),
  (selectedState) => {
    renderPressHeader('#press-header-container', selectedState);
  },
  shallowEqual
);

observeStore(
  (state) => selectors.getFilteredPress(state),
  (filteredPress) => { 
    renderPressToDOM(filteredPress, '.press-content');
    renderNewsGrid('.press-content', 'auto');
  },
  shallowEqual
);
