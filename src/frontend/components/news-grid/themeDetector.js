
export function getCurrentTheme() {
  // const htmlTheme = document.documentElement.getAttribute('data-theme');
  // 다크모드 완성할 때 까지 light로 설정
  const htmlTheme = 'light';
  if (htmlTheme === 'dark' || htmlTheme === 'light') {
    return htmlTheme;
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  if (document.documentElement.classList.contains('light')) {
    return 'light';
  }

  if (document.body.classList.contains('dark')) {
    return 'dark';
  }
  if (document.body.classList.contains('light')) {
    return 'light';
  }

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

