import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/qingqing/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
  server: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: [
      '6sf7724gq589.vicp.fun',
      'localhost',
      '127.0.0.1'
    ],
    cors: true,
    // 添加代理配置，解决Coze API的CORS问题
    proxy: {
      '/api/coze': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coze/, '')
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport8plugin({
          unitToConvert: 'rpx', // 需要转换的单位，这里设置为rpx
          viewportWidth: 750, // UI设计稿的宽度
          unitPrecision: 5, // 单位转换后保留的精度
          propList: ['*'], // 能转化为vw的属性列表
          viewportUnit: 'vw', // 希望使用的视口单位
          fontViewportUnit: 'vw', // 字体使用的视口单位
          selectorBlackList: [], // 需要忽略的CSS选择器
          minPixelValue: 1, // 设置最小的转换数值
          mediaQuery: false, // 媒体查询里的单位是否需要转换单位
          replace: true, // 是否直接更换属性值，而不添加备用属性
          exclude: /node_modules/, // 忽略某些文件夹下的文件或特定文件
          include: /\/src\//, // 如果设置了include，那将只有匹配到的文件才会被转换
          landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件
          landscapeUnit: 'vw', // 横屏时使用的单位
          landscapeWidth: 1334 // 横屏时使用的视口宽度
        })
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    assetsInlineLimit: 0, // 禁止所有资源内联，确保所有图片都输出为单独文件
    // 配置资源预加载和动态导入的基础路径
    rollupOptions: {
      output: {
        // 适配腾讯云开发，简化资源文件名，避免特殊字符和哈希导致的匹配问题
        manualChunks: undefined,
        // 简化assetFileNames配置，确保所有图片都能被正确输出
        assetFileNames: 'assets/[name].[ext]',
        // 简化JS文件名，保留短哈希
        chunkFileNames: 'assets/[name]-[hash:6].js',
        entryFileNames: 'assets/[name]-[hash:6].js',
        // 自动过滤中文/空格/括号，替换为下划线
        sanitizeFileName: (name) => {
          return name.replace(/[\u4e00-\u9fa5\s\(\)]/g, '_');
        }
      }
    }
  },
  // 图片优化配置
  optimizeDeps: {
    include: ['vue', 'vue-router'],
    exclude: []
  }
})