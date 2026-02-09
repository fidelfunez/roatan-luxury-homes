import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

console.warn = () => {};

const logger = createLogger()
const loggerError = logger.error

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}

	loggerError(msg, options);
}

// Make main CSS non-render-blocking so LCP isn't delayed (~300ms est. savings on mobile).
function nonBlockingCss() {
	return {
		name: 'non-blocking-css',
		transformIndexHtml: (html) => {
			return html.replace(
				/<link rel="stylesheet"(?:\s+crossorigin)?\s+href="([^"]+)">/g,
				(_, href) => `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'; this.onload=null;">`
			);
		},
	};
}

export default defineConfig({
	customLogger: logger,
	plugins: [
		react(),
		nonBlockingCss(),
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
		},
		cssCodeSplit: false, // Bundle all CSS into one file
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
			},
		},
	},
	css: {
		devSourcemap: false,
	},
});
