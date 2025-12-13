<template>
  <div class="app-container">
    <!-- 密码验证组件 -->
    <PasswordVerify 
      v-if="!isVerified" 
      :on-verify="verifyPassword" 
    />
    
    <!-- 已验证通过，显示正常应用内容 -->
    <template v-else>
      <!-- 路由视图 -->
      <router-view />
      
      <!-- 自定义Tab Bar，只在特定页面显示 -->
      <CustomTabBar v-if="showTabBar" />
      
      <!-- 悬浮智能体组件，全局显示 -->
      <FloatingAgent />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CustomTabBar from './components/CustomTabBar.vue'
import FloatingAgent from './components/FloatingAgent.vue'
import PasswordVerify from './components/PasswordVerify.vue'

const route = useRoute()

// 响应式数据
const isVerified = ref(false)

// 检查验证状态
const checkVerification = () => {
  const verified = localStorage.getItem('web_app_verified')
  isVerified.value = verified === 'true'
}

// 验证密码
const verifyPassword = (success) => {
  if (success) {
    // 验证通过，更新localStorage
    localStorage.setItem('web_app_verified', 'true')
    isVerified.value = true
  }
}

// 计算是否显示Tab Bar
const showTabBar = computed(() => {
  const tabBarPaths = [
    '/',
    '/notification',
    '/qing-female/index',
    '/royal-seal',
    '/qing-male/index',
    '/import-dishes'
  ]
  return tabBarPaths.includes(route.path)
})

// 组件挂载时检查验证状态
onMounted(() => {
  checkVerification()
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #FFFBF8;
  color: #666666;
  line-height: 1.5;
}

.app-container {
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #FFFBF8;
  position: relative;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
