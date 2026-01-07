import { store } from '../../store/index.js';

export function renderPressHeader(container, options = {}) {
  const containerElement = document.querySelector(container);

  const state = store.getState();
  const subscribedCount = options.subscribedCount ?? state.subscribedIds.length;
  const activeTab = options.activeTab || state.currentTab;

  const headerHtml = `
    <header class="press-header">
      <div class="tab-group" role="tablist">
        <button
          type="button"
          class="tab-item ${activeTab === 'all' ? 'is-active' : ''}"
          role="tab"
          aria-selected="${activeTab === 'all'}"
          data-tab="all"
        >
          전체 언론사
        </button>
        <button
          type="button"
          class="tab-item ${activeTab === 'subscribed' ? 'is-active' : ''}"
          role="tab"
          aria-selected="${activeTab === 'subscribed'}"
          data-tab="subscribed"
        >
          내가 구독한 언론사
          <span class="count">${subscribedCount}</span>
        </button>
      </div>
      <div class="tab-controls">
        <button type="button" class="btn-list" aria-label="리스트 보기">
          <img src="/icons/icon-list.svg" alt="" aria-hidden="true" />
        </button>
        <button type="button" class="btn-grid" aria-label="그리드 보기">
          <img src="/icons/icon-grid.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </header>
  `;

  containerElement.innerHTML = headerHtml;

  const tabButtons = containerElement.querySelectorAll('.tab-item');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      store.dispatch('subscription/SET_TAB', tab);
    });
  });
}

