export class HeadHandler {
  constructor(naverData) {
    this.naverData = naverData;
  }

  element(element) {
    if (this.naverData) {
      const scriptContent = `window["EAGER-DATA"] = ${JSON.stringify(this.naverData)};`;
      element.append(
        `<script>${scriptContent}</script>`, 
        { html: true }
      );
    }
  }
}