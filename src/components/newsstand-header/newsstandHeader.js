export function renderNewsstandHeader(container, options = {}) {
  const containerElement = document.querySelector(container)
  
  const koreaDate = getKoreaDate();
  const dateTime = options.dateTime || koreaDate.toISOString().split('T')[0];
  const formattedDate = options.date || formatDate(koreaDate);

  const headerHtml = `
    <header class="newsstand-header">
      <h2 class="newstand-title">
        <img src="./src/icons/icon-news.png" alt="" aria-hidden="true" width="24" height="24" />
        <span class="newstand-text">뉴스스탠드</span>
      </h2>
      <time class="newstand-date" datetime="${dateTime}">
        ${formattedDate}
      </time>
    </header>
  `;

  containerElement.innerHTML = headerHtml;
}

function getKoreaDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const koreaTime = new Date(utc + 9 * 3600000); 
  return koreaTime;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[date.getDay()];

  return `${year}. ${month}. ${day}. ${weekday}`;
}

