import { mapPngToUrls } from './iconUrlMapper.js';
import { store } from '../../store/index.js';

const ITEMS_PER_PAGE = 24; 

let pages = [];
let urls = [];
let pageContainer = null;
let prevBtn = null;
let nextBtn = null;

export const actions = {
  nextPage() {
    const state = store.getState();
    const totalPages = pages.length;
    if (state.currentPage < totalPages - 1) {
      store.dispatch('NEXT_PAGE');
    }
  },
  prevPage() {
    const state = store.getState();
    if (state.currentPage > 0) {
      store.dispatch('PREV_PAGE');
    }
  },
};

function renderPage(pageIndex) {
  const page = pages[pageIndex] || [];
  const pageHtml = [];

  for (let i = 0; i < ITEMS_PER_PAGE; i++) {
    const press = page[i];
    if (press) {
      const globalIndex = pageIndex * ITEMS_PER_PAGE + i;
      const url = urls[globalIndex];
      pageHtml.push(`
        <div class="news-grid-item">
          <img src="${url}" alt="${press.name}" class="news-grid-logo" />
        </div>
      `);
    } else {
      pageHtml.push(`
        <div class="news-grid-item"></div>
      `);
    }
  }

  return pageHtml.join('');
}

function updateButtonVisibility(currentPage, totalPages) {
  if (prevBtn) {
    prevBtn.disabled = currentPage === 0;
  }
  if (nextBtn) {
    nextBtn.disabled = currentPage === totalPages - 1;
  }
}

export function renderNewsGrid(pressList, container, theme = 'auto') {
  const containerElement = document.querySelector(container);

  const pngNames = pressList.map((press) => press.pngName);
  urls = mapPngToUrls(pngNames, theme);

  // 페이지 분할
  pages = [];
  for (let i = 0; i < pressList.length; i += ITEMS_PER_PAGE) {
    pages.push(pressList.slice(i, i + ITEMS_PER_PAGE));
  }

  // 초기 HTML 렌더링
  const initialHtml = `
    <div class="news-grid-page">
      ${renderPage(0)}
    </div>
  `;

  containerElement.className = 'news-grid-container';
  containerElement.innerHTML = initialHtml;

  pageContainer = containerElement.querySelector('.news-grid-page');


  if (pages.length > 1) {
    const controlsHtml = `
      <button class="news-grid-prev" aria-label="이전 페이지">
        <img src="./src/icons/icon-left-arrow.svg" alt="이전" />
      </button>
      <button class="news-grid-next" aria-label="다음 페이지">
        <img src="./src/icons/icon-right-arrow.svg" alt="다음" />
      </button>
    `;

    const parentElement = containerElement.parentElement;
    if (parentElement) {
      parentElement.style.position = 'relative';
      parentElement.insertAdjacentHTML('beforeend', controlsHtml);
    }

    prevBtn = parentElement
      ? parentElement.querySelector('.news-grid-prev')
      : null;
    nextBtn = parentElement
      ? parentElement.querySelector('.news-grid-next')
      : null;

    // Store 구독: 상태가 바뀌면 화면 갱신
    store.subscribe(() => {
      const state = store.getState();
      const { currentPage } = state;
      
      if (pageContainer) {
        pageContainer.innerHTML = renderPage(currentPage);
      }
      updateButtonVisibility(currentPage, pages.length);
    });


    if (prevBtn) {
      prevBtn.addEventListener('click', () => actions.prevPage());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => actions.nextPage());
    }

    // 초기 버튼 상태 설정
    const initialState = store.getState();
    updateButtonVisibility(initialState.currentPage, pages.length);
  }
}
