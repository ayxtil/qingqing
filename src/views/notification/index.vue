<template>
  <div class="notification-page">
    <img class="bg-image" src="../../assets/home_2.png" alt="背景图片" />
    <div class="buttons-container">
      <button class="btn btn-1" @click="navigateToFlipPage">
        <img class="btn-image" src="../../assets/free_diancai_11.png" alt="按钮1" />
      </button>
      <button class="btn btn-2" @click="navigateToFlipPage">
        <img class="btn-image" src="../../assets/free_diancai_111.png" alt="按钮2" />
      </button>
      <button class="btn btn-3" @click="navigateToFlipPage">
        <img class="btn-image" src="../../assets/free_diancai_1111.png" alt="按钮3" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到翻牌子页面
const navigateToFlipPage = () => {
  router.push('/qing-female/index')
}
</script>

<style scoped>
.notification-page {
  min-height: 100vh;
  background-color: #fef1c7;
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* 背景图片样式 */
.bg-image {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 1;
  object-fit: contain;
  object-position: top center;
}

.buttons-container {
  position: absolute;
  top: 400rpx; /* 保持原位置的固定像素 */
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx;
  z-index: 10;
}

.btn {
  flex: 1;
  height: 200rpx;
  background-color: transparent;
  color: transparent;
  border: none;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  padding: 0;
  margin: 0;
}

/* 按钮图片样式 */
.btn-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  position: relative;
  z-index: 1;
}

/* 按钮1样式 */
.btn-1 {
  /* 保持原按钮1的位置 */
}

/* 按钮2样式 */
.btn-2 {
  transform: scale(0.95) translateY(-35rpx);
}

/* 按钮3样式 */
.btn-3 {
  transform: scale(0.95) translateY(-5rpx);
}

.btn:hover {
  opacity: 0.9;
}

/* 分别为每个按钮的hover效果设置不同的变换，保持视觉一致性 */
.btn-1:hover {
  transform: scale(1.05);
}

.btn-2:hover {
  transform: scale(1.05) translateY(-35rpx);
}

.btn-3:hover {
  transform: scale(1.05) translateY(-5rpx);
}
</style>