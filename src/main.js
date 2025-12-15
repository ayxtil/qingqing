import { createApp } from 'vue'
import App from './App.vue'
// 路由导入，让Vite在构建时处理
import router from './router'
// 重新添加CSS导入，让Vite在构建时处理所有样式
import './style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
