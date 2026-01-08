import { getCurrentTheme } from './themeDetector.js';

/**
 * 테마에 따라 적절한 로고 URL을 반환
 * @param {Object} press - 언론사 객체 (logoDark, logoLight 포함)
 * @param {string} theme - 'light', 'dark', 'auto'
 * @returns {string} 로고 URL
 */
function getLogoUrl(press, theme = 'auto') {
  const currentTheme = theme === 'auto' ? getCurrentTheme() : theme;
  
  // EAGER DATA에서 가져온 logoDark, logoLight 사용
  if (press.logoDark && press.logoLight) {
    const darkUrl = press.logoDark?.url;
    const lightUrl = press.logoLight?.url;
    
    return currentTheme === 'dark' ? darkUrl : lightUrl;
  }
  
  // fallback: 기존 방식 (logoDark/logoLight가 없는 경우)
  if (press.pngName) {
    const baseUrl = `https://s.pstatic.net/static/newsstand/2020/logo/${currentTheme}/0604`;
    const fileName = press.pngName.endsWith('.png') ? press.pngName : `${press.pngName}.png`;
    return `${baseUrl}/${fileName}`;
  }
  
  return '';
}

export function renderPressGrid(pressList, theme = 'auto') {
  const html = pressList
    .map((press) => {
      const url = getLogoUrl(press, theme);
      return `
      <div class="press-item">
        <a href="#" class="press-link">
          <img src="${url}" alt="${press.name}" class="press-logo" />
          <span class="press-name">${press.name}</span>
        </a>
      </div>
    `;
    })
    .join('');

  return html;
}

export function renderPressToDOM(pressList, container, theme = 'auto') {
  const containerElement = document.querySelector(container);
  const html = renderPressGrid(pressList, theme);
  containerElement.innerHTML = html;
}
