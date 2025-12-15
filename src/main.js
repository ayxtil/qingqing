import { createApp } from 'vue'
import App from './App.vue'
// 路由导入，让Vite在构建时处理
import router from './router'
// 删除直接的CSS导入，避免浏览器尝试以模块方式加载CSS
// 样式将通过Vite的CSS预处理器和构建流程处理

const app = createApp(App)

app.use(router)
app.mount('#app')
