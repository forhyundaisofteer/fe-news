export function extractEagerData(html) {
  const finalData = {};

  const searchPattern = /window\[["']EAGER-DATA["']\]\[["']([^"']+)["']\]\s*=\s*\{/g;
  let match;

  while ((match = searchPattern.exec(html)) !== null) {
    const key = match[1];
    const startPos = match.index + match[0].length - 1; 
    
    let braceCount = 0;
    let endPos = -1;
    
    for (let i = startPos; i < html.length; i++) {
      if (html[i] === '{') braceCount++;
      else if (html[i] === '}') braceCount--;
      
      if (braceCount === 0) {
        endPos = i;
        break;
      }
    }

    if (endPos !== -1) {
      const jsonString = html.substring(startPos, endPos + 1);
      try {
        finalData[key] = JSON.parse(jsonString);
      } catch (e) {
        console.error(`파싱 실패: ${key}`, e);
      }
    }
  }

  return Object.keys(finalData).length > 0 ? finalData : null;
}

export async function fetchNaverData() {
  try {
    const response = await fetch('https://www.naver.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const data = extractEagerData(html);

    if (!data) {
      console.warn('네이버에서 데이터를 추출할 수 없습니다.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('네이버 데이터 가져오기 실패:', error);
    return null;
  }
}
