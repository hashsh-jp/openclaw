import type { AnyAgentTool, OpenClawPluginApi } from "../../src/plugins/types.js";
import { createWebsearchTool } from "./src/websearch-tool.js";

export default function register(api: OpenClawPluginApi) {
  api.registerTool(createWebsearchTool(api) as unknown as AnyAgentTool, { optional: true });
}
