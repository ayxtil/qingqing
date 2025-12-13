<template>
  <!-- 御印坊核心组件 -->
  <div class="royal-seal-container">
    <!-- 盖章区域 -->
    <div 
      class="stamp-area" 
      id="stampArea"
      @touchstart="onStampAreaTouchStart"
      @touchmove="onStampAreaTouchMove"
      @touchend="onStampAreaTouchEnd"
      @mousedown="onStampAreaTouchStart"
      @mousemove="onStampAreaTouchMove"
      @mouseup="onStampAreaTouchEnd"
      @mouseleave="onStampAreaTouchEnd"
    >
      <div class="stamp-area-bg"></div>
      <!-- 已盖章印记 -->
      <div 
        class="seal-mark" 
        v-for="(item, index) in sealMarks" 
        :key="index" 
        :style="{
          left: `${item.x}px`, 
          top: `${item.y}px`, 
          transform: `rotate(${item.rotate}deg)`, 
          opacity: item.opacity
        }"
      >
        <text class="seal-text">{{ sealText }}</text>
      </div>
      <!-- 当前盖章预览 -->
      <div 
        class="seal-preview" 
        v-if="isPreviewing" 
        :style="{
          left: `${previewX}px`, 
          top: `${previewY}px`, 
          transform: `rotate(${previewRotate}deg)`, 
          opacity: 0.5
        }"
      >
        <text class="seal-text">{{ sealText }}</text>
      </div>
    </div>
    
    <!-- 印章组件 -->
    <div 
      class="seal-container"
      @touchstart="onSealTouchStart"
      @touchmove="onSealTouchMove"
      @touchend="onSealTouchEnd"
      @mousedown="onSealTouchStart"
      @mousemove="onSealTouchMove"
      @mouseup="onSealTouchEnd"
      @mouseleave="onSealTouchEnd"
      :style="{
        left: `${sealX}px`, 
        top: `${sealY}px`, 
        transform: `scale(${sealScale}) rotate(${sealRotate}deg)`
      }"
    >
      <div class="seal-body">
        <div class="seal-top"></div>
        <div class="seal-middle">
          <text class="seal-engraving">{{ sealText }}</text>
        </div>
        <div class="seal-bottom"></div>
      </div>
      <div class="seal-shadow"></div>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel" v-if="showControls">
      <div class="control-item" @click="changeSealText">
        <text class="control-label">印章文字</text>
        <text class="control-value">{{ sealText }}</text>
      </div>
      <div class="control-item" @click="changeSealMaterial">
        <text class="control-label">印章材质</text>
        <text class="control-value">{{ sealMaterial }}</text>
      </div>
      <div class="control-item" @click="clearSealMarks">
        <text class="control-label">清除印记</text>
        <text class="control-action">点击清除</text>
      </div>
    </div>
    
    <!-- 提示信息 -->
    <div class="hint" v-if="showHint">
      <text class="hint-text">{{ hintText }}</text>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 组件属性
const props = defineProps({
  sealText: {
    type: String,
    default: '御印'
  },
  sealMaterial: {
    type: String,
    default: '玉印'
  }
})

// 组件事件
const emit = defineEmits(['seal-added', 'seal-cleared'])

// 盖章区域相关数据
const sealMarks = ref([]) // 已盖章印记列表
const isPreviewing = ref(false) // 是否显示当前盖章预览
const previewX = ref(0) // 预览X坐标
const previewY = ref(0) // 预览Y坐标
const previewRotate = ref(0) // 预览旋转角度

// 印章组件相关数据
const sealX = ref(100) // 印章X坐标
const sealY = ref(100) // 印章Y坐标
const sealScale = ref(1) // 印章缩放比例
const sealRotate = ref(0) // 印章旋转角度

// 控制面板相关数据
const showControls = ref(false) // 是否显示控制面板

// 提示信息相关数据
const showHint = ref(false) // 是否显示提示
const hintText = ref('') // 提示文本

// 触摸/鼠标事件相关数据
let isDraggingSeal = false // 是否正在拖拽印章
let startSealX = 0 // 开始拖拽时印章X坐标
let startSealY = 0 // 开始拖拽时印章Y坐标
let startTouchX = 0 // 开始触摸时X坐标
let startTouchY = 0 // 开始触摸时Y坐标

/**
 * 生命周期函数--组件挂载
 */
onMounted(() => {
  console.log('御印坊核心组件挂载')
  initSealPosition()
})

/**
 * 生命周期函数--组件卸载
 */
onUnmounted(() => {
  console.log('御印坊核心组件卸载')
})

/**
 * 初始化印章位置
 */
const initSealPosition = () => {
  // 获取盖章区域尺寸
  const stampArea = document.getElementById('stampArea')
  if (stampArea) {
    const rect = stampArea.getBoundingClientRect()
    sealX.value = rect.width / 2 - 50
    sealY.value = rect.height / 2 - 100
  }
}

/**
 * 盖章区域触摸开始事件
 */
const onStampAreaTouchStart = (e) => {
  console.log('盖章区域触摸开始')
  isPreviewing.value = true
  updatePreviewPosition(e)
}

/**
 * 盖章区域触摸移动事件
 */
const onStampAreaTouchMove = (e) => {
  console.log('盖章区域触摸移动')
  updatePreviewPosition(e)
}

/**
 * 盖章区域触摸结束事件
 */
const onStampAreaTouchEnd = (e) => {
  console.log('盖章区域触摸结束')
  if (isPreviewing.value) {
    // 添加新的盖章印记
    const newSealMark = {
      x: previewX.value,
      y: previewY.value,
      rotate: previewRotate.value,
      opacity: 1
    }
    sealMarks.value.push(newSealMark)
    
    // 触发盖章事件
    emit('seal-added', newSealMark)
    
    // 隐藏预览
    isPreviewing.value = false
    
    // 显示提示
    showHintMessage('盖章成功')
  }
}

/**
 * 更新预览位置
 */
const updatePreviewPosition = (e) => {
  // 获取触摸位置
  let touchX, touchY
  if (e.touches && e.touches.length > 0) {
    touchX = e.touches[0].clientX
    touchY = e.touches[0].clientY
  } else {
    touchX = e.clientX
    touchY = e.clientY
  }
  
  // 获取盖章区域位置
  const stampArea = document.getElementById('stampArea')
  if (stampArea) {
    const rect = stampArea.getBoundingClientRect()
    previewX.value = touchX - rect.left - 50 // 50是印章一半的宽度
    previewY.value = touchY - rect.top - 50 // 50是印章一半的高度
    
    // 更新旋转角度（随机旋转-10到10度）
    previewRotate.value = (Math.random() * 20 - 10)
  }
}

/**
 * 印章触摸开始事件
 */
const onSealTouchStart = (e) => {
  console.log('印章触摸开始')
  isDraggingSeal.value = true
  
  // 获取触摸位置
  if (e.touches && e.touches.length > 0) {
    startTouchX = e.touches[0].clientX
    startTouchY = e.touches[0].clientY
  } else {
    startTouchX = e.clientX
    startTouchY = e.clientY
  }
  
  startSealX = sealX.value
  startSealY = sealY.value
  
  // 阻止事件冒泡
  e.stopPropagation()
}

/**
 * 印章触摸移动事件
 */
const onSealTouchMove = (e) => {
  console.log('印章触摸移动')
  if (isDraggingSeal.value) {
    // 获取当前触摸位置
    let currentTouchX, currentTouchY
    if (e.touches && e.touches.length > 0) {
      currentTouchX = e.touches[0].clientX
      currentTouchY = e.touches[0].clientY
    } else {
      currentTouchX = e.clientX
      currentTouchY = e.clientY
    }
    
    // 计算移动距离
    const deltaX = currentTouchX - startTouchX
    const deltaY = currentTouchY - startTouchY
    
    // 更新印章位置
    sealX.value = startSealX + deltaX
    sealY.value = startSealY + deltaY
    
    // 阻止事件冒泡
    e.stopPropagation()
  }
}

/**
 * 印章触摸结束事件
 */
const onSealTouchEnd = (e) => {
  console.log('印章触摸结束')
  isDraggingSeal.value = false
  
  // 阻止事件冒泡
  e.stopPropagation()
}

/**
 * 改变印章文字
 */
const changeSealText = () => {
  console.log('改变印章文字')
  const newText = prompt('请输入新的印章文字:', props.sealText)
  if (newText) {
    // 触发文字改变事件
    emit('seal-text-changed', newText)
  }
}

/**
 * 改变印章材质
 */
const changeSealMaterial = () => {
  console.log('改变印章材质')
  // 显示材质选择
  const materials = ['玉印', '金印', '铜印', '木印', '石印']
  const material = prompt(`请选择印章材质:\n${materials.join('\n')}`, props.sealMaterial)
  if (material && materials.includes(material)) {
    // 触发材质改变事件
    emit('seal-material-changed', material)
  }
}

/**
 * 清除所有印章印记
 */
const clearSealMarks = () => {
  console.log('清除所有印章印记')
  sealMarks.value = []
  emit('seal-cleared')
  showHintMessage('所有印记已清除')
}

/**
 * 显示提示信息
 */
const showHintMessage = (message) => {
  hintText.value = message
  showHint.value = true
  
  // 3秒后隐藏提示
  setTimeout(() => {
    showHint.value = false
  }, 3000)
}
</script>

<style scoped>
.royal-seal-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 盖章区域 */
.stamp-area {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: crosshair;
}

.stamp-area-bg {
  width: 100%;
  height: 100%;
  background-color: #FFFBF8;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

/* 已盖章印记 */
.seal-mark {
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 10;
  pointer-events: none;
  transition: all 0.3s ease;
}

.seal-text {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 128, 144, 0.3);
  border: 2px solid rgba(255, 128, 144, 0.5);
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  color: #FF8090;
  text-align: center;
  line-height: 100px;
  transform: rotate(15deg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 当前盖章预览 */
.seal-preview {
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

/* 印章组件 */
.seal-container {
  position: absolute;
  z-index: 20;
  cursor: move;
  user-select: none;
  transition: all 0.1s ease;
}

.seal-body {
  width: 80px;
  height: 120px;
  position: relative;
  z-index: 2;
}

.seal-top {
  width: 80px;
  height: 30px;
  background-color: #E6E6FA;
  border-radius: 50% 50% 0 0;
  position: absolute;
  top: 0;
  left: 0;
}

.seal-middle {
  width: 80px;
  height: 60px;
  background-color: #FFFFE0;
  border: 2px solid #FFB3C6;
  position: absolute;
  top: 20px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seal-engraving {
  font-size: 16px;
  font-weight: bold;
  color: #FF8090;
  transform: rotate(15deg);
}

.seal-bottom {
  width: 80px;
  height: 40px;
  background-color: #FFD6E0;
  border-radius: 0 0 50% 50%;
  position: absolute;
  top: 70px;
  left: 0;
}

.seal-shadow {
  width: 80px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  position: absolute;
  top: 10px;
  left: 5px;
  z-index: 1;
}

/* 控制面板 */
.control-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background-color: rgba(255, 230, 240, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  z-index: 30;
  border: 1px solid #FFB3C6;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #FFE6F0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-item:last-child {
  border-bottom: none;
}

.control-item:hover {
  background-color: rgba(255, 255, 224, 0.8);
}

.control-label {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.control-value {
  font-size: 14px;
  color: #80BFFF;
}

.control-action {
  font-size: 14px;
  color: #FF8090;
  font-weight: bold;
}

/* 提示信息 */
.hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 128, 144, 0.9);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 40;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hint-text {
  line-height: 1.5;
}
</style>