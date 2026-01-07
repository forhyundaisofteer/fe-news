export async function fetchNaverData() {
  try {
    const response = await fetch("https://www.naver.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      }
    });
    const html = await response.text();
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
        let rawStr = html.substring(startPos, endPos + 1);
        
        try {
          finalData[key] = JSON.parse(rawStr);
        } catch (e) {
          try {
            const sanitized = rawStr
              .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') 
              .replace(/'/g, '"') 
              .replace(/,\s*}/g, '}'); 
            finalData[key] = JSON.parse(sanitized);
          } catch (innerE) {
            console.warn(`[Parser] '${key}' data skipped`);
          }
        }
      }
    }
    return finalData;
  } catch (error) {
    console.error("Naver Fetch Error:", error);
    return null;
  }
}
