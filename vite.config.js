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

export default defineConfig({
	customLogger: logger,
	plugins: [
		react()
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
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
						if (id.includes('react-router')) return 'vendor-router';
						if (id.includes('framer-motion')) return 'vendor-motion';
						if (id.includes('@radix-ui')) return 'vendor-radix';
						if (id.includes('lucide-react')) return 'vendor-icons';
						if (id.includes('@supabase')) return 'vendor-supabase';
						return 'vendor';
					}
				},
			},
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
