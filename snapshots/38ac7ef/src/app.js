import { renderPressToDOM } from './utils/pressRenderer.js';
import { renderNewsGrid } from './components/news-grid/newsGrid.js';
import { renderNewsstandHeader } from './components/newsstand-header/newsstandHeader.js';
import { renderNewsTicker } from './components/news-ticker/newsTicker.js';
import { renderPressHeader } from './components/press-header/pressHeader.js';
import { store } from './store/index.js';

const pressList = store.getAllPress();

renderNewsstandHeader('#newsstand-header-container');
renderNewsTicker('#news-ticker-container');
renderPressHeader('#press-header-container');
renderPressToDOM(pressList, '.press-content');
renderNewsGrid(pressList, '.press-content', 'auto');
