export async function fetchNaverData() {
  try {
    const response = await fetch("https://www.naver.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      }
    });
    const html = await response.text();
    
    const eagerDataIndex = html.indexOf('window["EAGER-DATA"]') || html.indexOf("window['EAGER-DATA']");
    
    if (eagerDataIndex === -1) {
      return null;
    }
    
    let scriptStart = html.lastIndexOf('<script', eagerDataIndex);
    if (scriptStart === -1) {
      return null;
    }
    
    scriptStart = html.indexOf('>', scriptStart) + 1;
    const scriptEnd = html.indexOf('</script>', scriptStart);
    
    if (scriptEnd === -1) {
      return null;
    }
    
    const scriptContent = html.substring(scriptStart, scriptEnd).trim();
    return scriptContent;
  } catch (error) {
    console.error("Naver Fetch Error:", error);
    return null;
  }
}