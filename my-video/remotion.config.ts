/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// Rspack (the default) silently emits no bundle.js in some Linux sandboxes:
// bundling reports success but the output directory has only index.html.
// Webpack is slower but works everywhere. Flip back to true locally if
// `npx remotion bundle` produces a bundle.js on your machine.
Config.setRspack(false);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
