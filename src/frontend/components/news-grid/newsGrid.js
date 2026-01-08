import { getCurrentTheme } from '../../utils/themeDetector.js';
import { store } from '../../store/index.js';
import { nextPage, prevPage, toggleSubscribe, selectors, ITEMS_PER_PAGE } from '../../store/modules/grid.js';
import { observeStore } from '../../store/observeStore.js';
import { shallowEqual } from '../../utils/compare.js';

let pageContainer = null;
let prevBtn = null;
let nextBtn = null;
let containerElement = null;
let isEventHandlerAttached = false;

const plusIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 6.49902H6.5V9.49902H5.5V6.49902H2.5V5.49902H5.5V2.49902H6.5V5.49902H9.5V6.49902Z" fill="currentColor"/></svg>';
const crossIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.6 9L3 8.4L5.4 6L3 3.6L3.6 3L6 5.4L8.4 3L9 3.6L6.6 6L9 8.4L8.4 9L6 6.6L3.6 9Z" fill="currentColor"/></svg>';

function getLogoUrl(press, theme = 'auto') {
  const currentTheme = theme === 'auto' ? getCurrentTheme() : theme;
  
  if (press.logoDark && press.logoLight) {
    const darkUrl = press.logoDark?.url;
    const lightUrl = press.logoLight?.url;
    
    return currentTheme === 'dark' ? darkUrl : lightUrl;
  }
  
  return '';
}

function renderPage(pageItems, theme = 'auto') {
  const state = store.getState();
  const subscribedIds = state.subscribedIds;

  const pageHtml = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => {
    const press = pageItems[i];
    if (press) {
      const logoUrl = getLogoUrl(press, theme);
      const isSubscribed = subscribedIds.includes(press.name);
      return `
        <div class="news-grid-item" data-press-name="${press.name}">
          <img src="${logoUrl}" alt="${press.name}" class="news-grid-logo" />
          <button class="news-grid-subscribe-btn ${isSubscribed ? 'is-subscribed' : ''}" 
                  data-press-name="${press.name}"
                  aria-label="${isSubscribed ? '해지하기' : '구독하기'}">
            ${isSubscribed ? `${crossIcon}해지하기` : `${plusIcon}구독하기`}
          </button>
        </div>
      `;
    }
    return `
      <div class="news-grid-item"></div>
    `;
  });

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


function updateSubscriptionButtons(subscribedIds) {
  if (!pageContainer) return;
  
  const items = pageContainer.querySelectorAll('.news-grid-item[data-press-name]');

  items.forEach(item => {
    const pressName = item.getAttribute('data-press-name');
    if (!pressName) return;

    const button = item.querySelector('.news-grid-subscribe-btn');
    if (!button) return;

    const isSubscribed = subscribedIds.includes(pressName);

    button.classList.toggle('is-subscribed', isSubscribed);
    button.innerHTML = isSubscribed ? `${crossIcon}해지하기` : `${plusIcon}구독하기`;
    button.setAttribute('aria-label', isSubscribed ? '해지하기' : '구독하기');
  });
}

export function renderNewsGrid(container, theme = 'auto') {
  const targetElement = document.querySelector(container);
  if (!targetElement) return;
  
  containerElement = targetElement;
  const state = store.getState();
  const currentPageItems = selectors.getCurrentPageItems(state);

  const initialHtml = `
    <div class="news-grid-page">
      ${renderPage(currentPageItems, theme)}
    </div>
  `;

  containerElement.classList.add('news-grid-container');
  containerElement.innerHTML = initialHtml;

  pageContainer = containerElement.querySelector('.news-grid-page');
  
  if (!isEventHandlerAttached) {
    containerElement.addEventListener('click', (e) => {
      const btn = e.target.closest('.news-grid-subscribe-btn');
      if (btn) {
        e.stopPropagation();
        const pressName = btn.getAttribute('data-press-name');
        if (pressName) {
          store.dispatch(toggleSubscribe(pressName));
        }
      }
    });
    isEventHandlerAttached = true;
  }

  initNewsGridSubscription();

  const parentElement = containerElement.parentElement;
  const existingPrev = parentElement?.querySelector('.news-grid-prev');
  const existingNext = parentElement?.querySelector('.news-grid-next');
  if (existingPrev) existingPrev.remove();
  if (existingNext) existingNext.remove();

  const totalPages = selectors.getTotalPages(state);
  if (totalPages > 1) {

    const controlsHtml = `
      <button class="news-grid-prev" aria-label="이전 페이지">
        <img src="/icons/icon-left-arrow.svg" alt="이전" />
      </button>
      <button class="news-grid-next" aria-label="다음 페이지">
        <img src="/icons/icon-right-arrow.svg" alt="다음" />
      </button>
    `;

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

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const state = store.getState();
        if (selectors.canGoPrev(state.currentPage)) {
          store.dispatch(prevPage());
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentState = store.getState();
        if (selectors.canGoNext(currentState)) {
          store.dispatch(nextPage());
        }
      });
    }

    const initialState = store.getState();
    updateButtonVisibility(initialState.currentPage, selectors.getTotalPages(initialState));
  } else {
    prevBtn = null;
    nextBtn = null;
  }
}

let unsubscribePageUpdate = null;
let unsubscribeSubscriptionUpdate = null;

function initNewsGridSubscription() {
  if (unsubscribePageUpdate) {
    unsubscribePageUpdate();
  }
  if (unsubscribeSubscriptionUpdate) {
    unsubscribeSubscriptionUpdate();
  }

  unsubscribePageUpdate = observeStore(
    (state) => selectors.getCurrentPageItems(state),
    (currentPageItems) => {
      if (!pageContainer) return;
      pageContainer.innerHTML = renderPage(currentPageItems, 'auto');
      updateButtonVisibility(store.getState().currentPage, selectors.getTotalPages(store.getState()));
    },
    shallowEqual 
  );

  unsubscribeSubscriptionUpdate = observeStore(
    (state) => state.subscribedIds,
    (subscribedIds) => {
      updateSubscriptionButtons(subscribedIds);
    },
    shallowEqual
  );
}
