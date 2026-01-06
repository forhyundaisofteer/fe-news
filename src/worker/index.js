import { fetchNaverData } from './utils/naverParser.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const naverData = await fetchNaverData();

    const isLocal =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname.includes('dev');

    const productionBaseUrl = env?.PRODUCTION_BASE_URL || 'https://forhyundaisofteer.github.io/fe-news';
    
    const baseServer = isLocal
      ? 'http://localhost:5173'
      : productionBaseUrl;

    const targetUrl = `${baseServer}${url.pathname}${url.search}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
        },
      });

      const contentType = response.headers.get('Content-Type') || '';
      
      if (contentType.includes('text/html')) {
        let html = await response.text();

        if (naverData) {
          const hydrationScript = `
            <script>
              window["EAGER-DATA"] = window["EAGER-DATA"] || {};
              Object.assign(window["EAGER-DATA"], ${JSON.stringify(naverData)});
              console.log("[Server] Initial State Injected", window["EAGER-DATA"]);
            </script>
          `;

          html = html.replace('</head>', `${hydrationScript}</head>`);
        } else {
          const warningScript = `
            <script>
              console.warn("[Server] Naver Data Not Found");
            </script>
          `;
          html = html.replace('</head>', `${warningScript}</head>`);
        }

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          },
        });
      }

      return response;
    } catch (error) {
      console.error('프록시 요청 실패:', error);
      return new Response(
        `프록시 오류: ${error.message}\n\n로컬 개발 시 Vite 서버가 실행 중인지 확인하세요.`,
        {
          status: 500,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }
      );
    }
  },
};

