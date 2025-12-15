import { createApp } from 'vue'
import App from './App.vue'
// 使用完整路径和扩展名导入路由模块，避免浏览器请求目录
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.mount('#app')
