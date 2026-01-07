export class HeadHandler {
  constructor(naverData) {
    this.naverData = naverData;
  }
  
  element(element) {
    if (this.naverData) {
      element.append(
        `<script>${this.naverData}</script>`,
        { html: true }
      );
    }
  }
}