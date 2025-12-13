<template>
  <div class="notification-page">
    <div class="buttons-container">
      <button class="btn btn-1" @click="navigateToFlipPage"></button>
      <button class="btn btn-2" @click="navigateToFlipPage"></button>
      <button class="btn btn-3" @click="navigateToFlipPage"></button>
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
  background-image: url('../../assets/home_2.png');
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #fef1c7;
  margin: 0;
  padding: 0;
  position: relative;
}

.buttons-container {
  position: absolute;
  top: 400rpx; /* 恢复原位置的固定像素 */
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx;
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
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

/* 按钮1样式 */
.btn-1 {
  background-image: url('../../assets/free_diancai_11.png');
}

/* 按钮2样式 */
.btn-2 {
  background-image: url('../../assets/free_diancai_111.png');
  transform: scale(0.95) translateY(-35rpx);
}

/* 按钮3样式 */
.btn-3 {
  background-image: url('../../assets/free_diancai_1111.png');
  transform: scale(0.95) translateY(-5rpx);
}

.btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}
</style>