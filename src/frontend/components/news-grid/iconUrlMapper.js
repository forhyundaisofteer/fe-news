import { getCurrentTheme } from './themeDetector.js';

export function mapPngToUrls(pngNames, theme = 'auto') {
  const currentTheme = theme === 'auto' ? getCurrentTheme() : theme;
  const baseUrl = `https://s.pstatic.net/static/newsstand/2020/logo/${currentTheme}/0604`;

  return pngNames.map((name) => {
    const fileName = name.endsWith('.png') ? name : `${name}.png`;
    return `${baseUrl}/${fileName}`;
  });
}

