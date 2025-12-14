<template>
  <div class="tab-bar" :style="{ backgroundImage: `url(${tabbarBackground})` }">
    <div class="tab-bar-border"></div>
    <div 
      v-for="(item, index) in list" 
      :key="index" 
      class="tab-bar-item"
      :class="{ 'tab-bar-item-hidden': item.text === '通知' || item.text === '厨师' }"
    >
      <img 
        class="tab-bar-item-image" 
        :class="{ 'tab-bar-item-image-large': item.text === '菜菜悬赏' }"
        :src="selected === index ? item.selectedIconPath : item.iconPath"
        :alt="item.text"
        @click="switchTab(item, index)"
      >
      <text 
        class="tab-bar-item-text" 
        :style="{ color: selected === index ? selectedColor : color }"
        @click="switchTab(item, index)"
      >
        {{ item.text }}
      </text>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 直接导入图片资源
import examplesIcon from '@/assets/icons/examples.png'
import examplesActiveIcon from '@/assets/icons/examples-active.png'
import freeDiancai6Icon from '@/assets/free_diancai_6.png'
import imageGenerateEdit1Icon from '@/assets/image_generate_edit_1.png'
import businessIcon from '@/assets/icons/business.png'
import businessActiveIcon from '@/assets/icons/business-active.png'
import tabbarBackground from '@/assets/tabbar-background.png'

const router = useRouter()
const route = useRoute()

// tab bar配置
const list = ref([
  {
    pagePath: '/notification',
    text: '通知',
    iconPath: examplesIcon,
    selectedIconPath: examplesActiveIcon
  },
  {
    pagePath: '/qing-female/index',
    text: '翻牌子',
    iconPath: freeDiancai6Icon,
    selectedIconPath: freeDiancai6Icon
  },
  {
    pagePath: '/import-dishes',
    text: '菜菜悬赏',
    iconPath: imageGenerateEdit1Icon,
    selectedIconPath: imageGenerateEdit1Icon
  },
  {
    pagePath: '/qing-male/index',
    text: '厨师',
    iconPath: businessIcon,
    selectedIconPath: businessActiveIcon
  }
])

const selected = ref(0)
const color = '#FFFFFF' // 白色
const selectedColor = '#FFFFFF' // 白色

// 初始化选中的tab
const initSelected = () => {
  const currentPath = route.path === '/' ? '/notification' : route.path
  const index = list.value.findIndex(item => item.pagePath === currentPath)
  if (index !== -1) {
    selected.value = index
  }
}

// 切换tab
const switchTab = (item, index) => {
  selected.value = index
  router.replace(item.pagePath)
}

onMounted(() => {
  initSelected()
})

// 监听路由变化，更新选中的tab
watch(
  () => route.path,
  () => {
    initSelected()
  }
)
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 220rpx;
  background: no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1000;
  border: none;
  filter: drop-shadow(0 5rpx 30rpx rgba(0, 0, 0, 0.6));
  transition: all 0.3s ease;
  pointer-events: none; /* 导航栏容器不拦截点击事件，实现点击穿透 */
}

.tab-bar-border {
  display: none;
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background: transparent;
  padding-bottom: 45rpx;
  pointer-events: none; /* 导航项容器不响应点击，只让图标和文字响应 */
}

.tab-bar-item-image {
  width: 50rpx;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin-bottom: 8rpx;
  pointer-events: auto; /* 图标响应点击 */
}

/* 菜菜悬赏图标放大 */
.tab-bar-item-image-large {
  width: 54rpx;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.tab-bar-item-text {
  font-size: 24rpx;
  color: white;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  pointer-events: auto; /* 文字响应点击 */
}

/* 隐藏指定tab项 */
.tab-bar-item-hidden {
  opacity: 0%;
}
</style>