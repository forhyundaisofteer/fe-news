import { HeadHandler } from './utils/headHandler.js';
import { fetchNaverData } from './utils/naverParser.js';
import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
  async fetch(req) {
    const naverData = await fetchNaverData();
    const res = await this.env.ASSETS.fetch(req);
    return new HTMLRewriter().on('head', new HeadHandler(naverData)).transform(res);
  }
}