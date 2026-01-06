export function renderNewsTicker(container, newsList = []) {
  const containerElement = document.querySelector(container)

  const defaultNewsList = [
    {
      pressName: '연합뉴스',
      title: "[속보] 도심 공원 '조용한 독서존' 시범 운영... 시민 호응 이어져",
      url: '#',
    },
    {
      pressName: '서울경제',
      title: '착한 소비 캠페인, 지역 상권 회복에 긍정적 영향',
      url: '#',
    },
  ];

  const newsItems = newsList.length > 0 ? newsList : defaultNewsList;

  const tickerHtml = `
    <section class="news-ticker" aria-label="최신 뉴스">
      <ul>
        ${newsItems
          .map(
            (news) => `
          <li class="news-item">
            <a href="${news.url || '#'}" class="news-link">
              <strong class="press-name">${news.pressName}</strong>
              <span class="news-title">${news.title}</span>
            </a>
          </li>
        `
          )
          .join('')}
      </ul>
    </section>
  `;

  containerElement.innerHTML = tickerHtml;
}

