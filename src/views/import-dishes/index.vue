<template>
  <!-- 导入菜肴数据页面 -->
  <div class="import-dishes">
    <!-- 新增容器 -->
    <div class="new-container">
      <div class="container-image">
        <!-- 背景图片 -->
        <img class="bg-image" src="../../assets/reward.png" alt="悬赏图片" />
        <!-- 中间输入框 -->
        <div class="input-container">
          <input type="text" class="center-input" placeholder="小主想吃啥？" v-model="dishName" />
        </div>
        <!-- 图标容器 -->
        <div class="icon-container">
          <img class="input-icon" src="../../assets/882269822396564_1764237444705701185.tif~tplv-e1ww11ta6z-normal.png" alt="输入框图标" @click="handleIconClick" />
        </div>
      </div>
    </div>
    
    <!-- 马卡龙配色弹窗 -->
    <div v-if="showModal" class="macaron-modal">
      <div class="modal-content">
        <div class="modal-text">{{ modalText }}</div>
        <button class="modal-btn" @click="showModal = false">准了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getBearerToken } from '../../utils/cozeApi.js'
import { addDishes, Dish, dishes } from '../../utils/data.js'

// 响应式数据
const dishName = ref('') // 菜品名称
const showModal = ref(false) // 弹窗显示状态
const modalText = ref('') // 弹窗文本内容

/**
 * 调用扣子工作流
 * @param {string} dishName - 菜品名称
 * @returns {Promise<Object>} 工作流返回结果
 */
const callCozeWorkflow = async (dishName) => {
  const maxRetries = 3
  const retryDelay = 1500
  
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      // 获取Bearer Token
      const token = await getBearerToken()
      
      // 检查token是否有效
      if (!token || !token.trim()) {
        throw new Error('无效的Coze API密钥')
      }
      
      // 扣子工作流API配置
      const workflowConfig = {
        app_id: '7576179078697386018',
        workflow_id: '7576228389498798116'
      }
      
      // 构建请求体
      const requestBody = {
        workflow_id: workflowConfig.workflow_id,
        parameters: {
          USER_INPUT: dishName
        }
      }
      
      console.log(`调用扣子工作流 (第${retry + 1}次尝试)，发送请求:`, requestBody)
      
      // 直接使用环境变量中的 API 地址，绕过 Vite 代理
      // 这样可以避免 Vite 代理的 DNS 解析问题
      const baseUrl = import.meta.env.VITE_COZE_BASE_URL || 'https://api.coze.cn/'
      const apiUrl = baseUrl + 'v1/workflow/run'
      
      console.log('直接调用 Coze API，URL:', apiUrl)
      
      // 发送请求到扣子工作流API（直接调用，不使用代理）
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`)
      }
      
      // 处理 JSON 响应，提取工作流结果
      const responseData = await response.json()
      
      console.log('扣子工作流API响应:', JSON.stringify(responseData, null, 2))
      
      // 检查响应是否成功
      if (responseData.code !== 0) {
        throw new Error(`工作流执行失败: ${responseData.msg || '未知错误'}`)
      }
      
      // 提取工作流输出
      if (responseData.data) {
        // 解析 data 字段（它是一个 JSON 字符串）
        try {
          const data = JSON.parse(responseData.data)
          console.log('解析后的数据:', data)
          
          if (data.output) {
            console.log('扣子工作流返回结果:', data.output)
            return data
          }
        } catch (parseError) {
          console.error('解析 data 字段失败:', parseError)
          console.error('原始 data 字段:', responseData.data)
        }
      }
      
      // 如果没有找到工作流输出，抛出错误
      throw new Error('未找到工作流输出结果')
    } catch (error) {
      console.error(`调用扣子工作流失败 (第${retry + 1}次尝试):`, error)
      
      // 如果是最后一次尝试，抛出错误
      if (retry === maxRetries - 1) {
        throw error
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
}



/**
 * 图标点击事件处理
 */
const handleIconClick = async () => {
  if (!dishName.value.trim()) return
  
  const inputDishName = dishName.value.trim()
  
  // 使用搜索中的去重逻辑检查菜品是否存在
  const isDuplicate = checkDishDuplicate(inputDishName)
  
  if (isDuplicate) {
    // 显示马卡龙配色弹窗
    showModal.value = true
    modalText.value = '小主！这道菜御膳房已经备了！'
  } else {
    // 调用扣子工作流
    try {
      console.log('调用扣子工作流，发送消息:', inputDishName)
      const workflowResult = await callCozeWorkflow(inputDishName)
      
      // 处理工作流返回结果，添加到菜单数据库
      // 根据实际工作流返回的数据结构处理
      if (workflowResult && workflowResult.output) {
        // 提取工作流返回的菜品数据
        const workflowOutput = workflowResult.output
        
        console.log('工作流返回的原始数据:', workflowOutput)
        
        // 转换工作流返回的数据格式为 Dish 对象
        const newDishes = workflowOutput.map(item => {
          // 解析 CSV 格式的字符串，如 "荤菜, 猪肚,https://s.coze.cn/t/YgjhPuhspfY/"
          // 注意：有些行可能格式不正确，需要处理
          const parts = item.split(',');
          if (parts.length < 3) {
            console.error('无效的菜品数据格式:', item);
            return null;
          }
          
          const category = parts[0].trim();
          const subCategory = parts[1].trim();
          const url = parts[2].trim();
          
          // 生成菜品名称（使用子分类作为菜品名称）
          const name = subCategory;
          
          return {
            name: name,
            category: category,
            subCategory: subCategory,
            ingredients: [subCategory], // 简化处理，使用子分类作为食材
            description: `${category} - ${subCategory}`,
            imageUrl: url
          };
        }).filter(dish => dish !== null); // 过滤掉无效数据
        
        console.log('转换后的菜品数据:', newDishes);
        
        // 批量添加菜品到菜单数据库
        const addedCount = addDishes(newDishes);
        
        if (addedCount > 0) {
          console.log(`成功添加 ${addedCount} 道菜品到菜单数据库`);
          // 显示马卡龙配色弹窗
          showModal.value = true;
          modalText.value = '小主，新菜菜已经入库啦！';
          // 清空输入框
          dishName.value = '';
        } else {
          console.log('没有添加新菜品，可能已存在');
          // 显示提示弹窗
          showModal.value = true;
          modalText.value = '小主，这些菜御膳房已经备了！';
        }
      }
    } catch (error) {
      console.error('处理扣子工作流结果失败:', error)
      // 显示错误提示弹窗
      showModal.value = true
      modalText.value = '小主，网络有点不给力，稍后再试试吧！'
    }
  }
}

/**
 * 检查菜品是否重复
 * 使用与搜索相同的去重逻辑
 */
const checkDishDuplicate = (inputName) => {
  if (!inputName) return false
  
  // 生成去重键：使用原始名称，但将常见的烹饪方法替换为空格，然后按字符排序
  // 这样可以处理"黄豆炖猪蹄"和"猪蹄炖黄豆"这种情况
  const getDeduplicationKey = (name) => {
    return name.toLowerCase()
      .replace(/[炖煮炒炸烧焖煎烤蒸烩拌]/g, ' ')
      .split('')
      .sort()
      .join('')
  }
  
  const inputKey = getDeduplicationKey(inputName)
  
  // 遍历现有菜品数据，检查是否有重复
  for (const dish of dishes) {
    const dishKey = getDeduplicationKey(dish.name)
    if (inputKey === dishKey) {
      return true
    }
  }
  
  return false
}
</script>

<style scoped>
.import-dishes {
  min-height: 100vh;
  background-color: #fbf0ef;
  position: relative;
}



/* 新增容器样式 */
.new-container {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.container-image {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 1;
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

/* 中间输入框样式 */
.input-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% + 1% + 20rpx), calc(15% + 160rpx));
  z-index: 10;
  width: 300rpx;
}

.center-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #ddd;
  border-radius: 40rpx;
  font-size: 20rpx;
  line-height: 40rpx;
  outline: none;
  background-color: white;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.center-input::placeholder {
  font-size: 20rpx;
  line-height: 40rpx;
}

/* 图标容器样式 */
.icon-container {
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translate(calc(-50% + 2.5% + 40rpx), calc(35% + 360rpx));
  z-index: 10;
  text-align: center;
}

/* 图标样式 */
.input-icon {
  width: 150rpx;
  height: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.input-icon:hover {
  transform: scale(1.1);
}

/* 马卡龙配色弹窗 */
.macaron-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #FFE6F0; /* 马卡龙淡粉色 */
  border-radius: 30rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 500rpx;
  border: 2rpx solid #FFB3C6;
}

.modal-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
  line-height: 1.5;
  text-shadow: 1px 1px 0 #fff;
}

.modal-btn {
  background-color: #80BFFF; /* 马卡龙蓝色 */
  color: white;
  border: none;
  border-radius: 25rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 15rpx rgba(128, 191, 255, 0.3);
}

.modal-btn:hover {
  background-color: #66A3FF;
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 20rpx rgba(128, 191, 255, 0.4);
}

</style>