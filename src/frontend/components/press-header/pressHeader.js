import { store } from '../../store/index.js';
import { setTab } from '../../store/modules/grid.js';

// 이벤트 위임을 위한 컨테이너 참조
let headerContainer = null;
let headerElement = null;
let isEventAttached = false;
let isInitialized = false;

function attachEventHandlers() {
  if (!headerContainer || isEventAttached) return;
  
  // 이벤트 위임: 부모 요소에 한 번만 이벤트 리스너 등록
  headerContainer.addEventListener('click', (e) => {
    const tabButton = e.target.closest('.tab-item');
    if (tabButton) {
      e.stopPropagation();
      const tab = tabButton.getAttribute('data-tab');
      if (tab) {
        store.dispatch(setTab(tab));
      }
    }
  });
  
  isEventAttached = true;
}

function updateTabs(currentTab, subscribedCount) {
  if (!headerElement) return;

  const allTab = headerElement.querySelector('[data-tab="all"]');
  const subscribedTab = headerElement.querySelector('[data-tab="subscribed"]');
  const countSpan = subscribedTab?.querySelector('.count');

  if (allTab) {
    allTab.classList.toggle('is-active', currentTab === 'all');
    allTab.setAttribute('aria-selected', currentTab === 'all');
  }

  if (subscribedTab) {
    subscribedTab.classList.toggle('is-active', currentTab === 'subscribed');
    subscribedTab.setAttribute('aria-selected', currentTab === 'subscribed');
  }

  if (countSpan) {
    countSpan.textContent = subscribedCount;
  }
}

export function renderPressHeader(containerSelector, { currentTab, subscribedCount }) {
  const containerElement = document.querySelector(containerSelector);
  if (!containerElement) return;
  
  headerContainer = containerElement;

  // 초기 렌더링이 아니면 탭 상태만 업데이트
  if (isInitialized) {
    updateTabs(currentTab, subscribedCount);
    return;
  }

  const headerHtml = `
    <header class="press-header">
      <div class="tab-group" role="tablist">
        <button
          type="button"
          class="tab-item ${currentTab === 'all' ? 'is-active' : ''}"
          role="tab"
          aria-selected="${currentTab === 'all'}"
          data-tab="all"
        >
          전체 언론사
        </button>
        <button
          type="button"
          class="tab-item ${currentTab === 'subscribed' ? 'is-active' : ''}"
          role="tab"
          aria-selected="${currentTab === 'subscribed'}"
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
  headerElement = containerElement.querySelector('.press-header');
  isInitialized = true;
  
  // 이벤트 위임 설정 (한 번만)
  attachEventHandlers();
}

