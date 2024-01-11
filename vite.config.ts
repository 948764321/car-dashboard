import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { ConfigEnv, UserConfig, defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { wrapperEnv } from './src/utils/getEnv';

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	return {
		base: './',
		resolve: {
			alias: {
				'@': resolve(__dirname, './src')
			}
		},
		server: {
			host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN
		},
		plugins: [
			react(),
			// * EsLint 报错信息显示在浏览器界面上
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
				symbolId: 'icon-[dir]-[name]'
			}),
			eslintPlugin(),
			// * 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: 'gzip',
					ext: '.gz'
				})
		],
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
		},
		build: {
			outDir: 'dist',
			minify: 'esbuild',
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
				}
			}
		}
	};
});
