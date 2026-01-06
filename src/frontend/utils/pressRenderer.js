import { mapPngToUrls } from '../components/news-grid/iconUrlMapper.js';

export function renderPressGrid(pressList, theme = 'auto') {
  const pngNames = pressList.map((press) => press.pngName);
  const urls = mapPngToUrls(pngNames, theme);

  const html = pressList
    .map((press, index) => {
      const url = urls[index];
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
