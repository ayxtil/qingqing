<template>
  <!-- 悬浮智能体组件 -->
  <div class="floating-agent-container">
    <!-- 悬浮形象按钮 -->
    <div 
      class="floating-btn"
      @click="toggleChat"
      v-if="!isChatOpen"
    >
      <img class="btn-image" src="../assets/macaron_yellow_rgb_1.png" alt="小膳子">
      <div class="badge" v-if="unreadCount > 0">{{ unreadCount }}</div>
    </div>

    <!-- 聊天面板 -->
    <div class="chat-panel" v-if="isChatOpen">
      <!-- 面板头部 -->
      <div class="chat-header">
        <div class="header-left">
          <img class="agent-avatar" src="../assets/macaron_yellow_rgb_1.png" alt="小膳子">
          <div class="agent-name">小膳子</div>
        </div>
        <div class="header-right">
          <div class="minimize-btn" @click="toggleChat">−</div>
          <div class="close-btn" @click="closeChat">×</div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div 
        class="message-list"
        ref="messageListRef"
      >
        <!-- 系统提示 -->
        <div class="system-message" v-if="messages.length === 0">
          你好！我是你的小膳子，有什么可以帮助你的？
        </div>

        <!-- 消息项 -->
        <div 
          v-for="(message, index) in messages" 
          :key="message.id"
          class="message-item" 
          :class="message.role === 'user' ? 'user-message' : 'agent-message'"
          :id="`message-${index}`"
        >
          <!-- 用户消息 -->
        <div class="message-content user-content" v-if="message.role === 'user'">
          <div class="message-text">{{ message.content }}</div>
          <img class="user-avatar" src="../assets/icons/avatar.png" alt="用户">
        </div>

        <!-- 智能体消息 -->
        <div class="message-content agent-content" v-else>
          <img class="agent-avatar" src="../assets/macaron_yellow_rgb_1.png" alt="小膳子">
          <div class="message-text">{{ message.content }}</div>
        </div>
        </div>

        <!-- 加载中提示 -->
        <div class="loading-message" v-if="isLoading">
          <img class="loading-icon" src="../assets/macaron_yellow_rgb_1.png" alt="加载中">
          <div class="loading-text">正在思考中...</div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <input 
            class="message-input" 
            placeholder="输入你的问题..." 
            v-model="inputValue"
            @input="onInputChange"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @keydown.enter="sendMessage"
          >
          <button 
            class="send-btn" 
            @click="sendMessage"
            :disabled="!inputValue.trim() || isLoading"
          >
            发送
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { callCozeChatStream, callCozeChat } from '../utils/cozeApi.js'

// 组件属性
const props = defineProps({
  unreadCount: {
    type: Number,
    default: 0
  }
})

// 组件事件
const emit = defineEmits(['message-sent', 'chat-closed'])

// 状态管理
const isChatOpen = ref(false) // 聊天面板是否打开
const messages = ref([]) // 消息列表
const inputValue = ref('') // 输入框内容
const isLoading = ref(false) // 是否正在加载 - 初始值为false
const scrollToView = ref('') // 滚动到指定视图
const messageListRef = ref(null) // 消息列表ref
let messageId = 1 // 消息ID计数器
let conversationId = null // 会话ID，用于保持对话上下文

console.log('FloatingAgent组件初始化完成，isLoading初始值:', isLoading.value)

/**
 * 切换聊天面板显示/隐藏
 */
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    // 聊天面板打开时，检查是否需要发送开场白
    if (messages.value.length === 0) {
      // 调用API获取智能体开场白
      getOpeningMessageFromApi()
    } else {
      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
}

/**
 * 从API获取智能体开场白
 */
const getOpeningMessageFromApi = async () => {
  isLoading.value = true
  
  try {
    // 创建一个临时的智能体消息，用于显示回复
    const agentMessage = {
      id: `msg-${messageId++}`,
      role: 'agent',
      content: '',
      content_type: 'text',
      type: 'answer'
    }
    messages.value.push(agentMessage)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
    
    // 构建包含问候语的消息数组，而不是空数组
    // 这样可以避免API返回4000错误
    const cozeMessages = [
      {
        content: '你好',
        content_type: 'text',
        role: 'user',
        type: 'question'
      }
    ]
    
    // 调用扣子智能体API - 使用流式API
    await callCozeChatStream(cozeMessages, {
      user_id: `user_${Date.now()}`,
      onMessage: (streamContent) => {
        // 设置智能体消息的内容
        agentMessage.content = streamContent
        // 滚动到底部
        nextTick(() => {
          scrollToBottom()
        })
      },
      onComplete: (fullResponse) => {
        console.log('开场白API调用完成，最终响应:', fullResponse)
      }
    })
    
    // 检查最终回复是否为空
    if (!agentMessage.content.trim()) {
      console.log('最终回复为空，使用调试错误信息')
      agentMessage.content = '抱歉，暂时无法获取小膳子的回复。请稍后再试，或者尝试使用其他问题。'
    }
  } catch (apiError) {
    // API调用失败，使用调试错误信息
    console.log('开场白API调用失败，错误信息:', apiError)
    
    // 移除之前添加的临时消息
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'agent') {
      messages.value.pop()
    }
    
    // 使用调试错误信息
    const errorMessage = {
      id: `msg-${messageId++}`,
      role: 'agent',
      content: '抱歉，暂时无法获取小膳子的回复。请稍后再试，或者尝试使用其他问题。',
      content_type: 'text',
      type: 'answer'
    }
    messages.value.push(errorMessage)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * 关闭聊天面板
 */
const closeChat = () => {
  isChatOpen.value = false
  emit('chat-closed')
}

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

/**
 * 发送消息
 */
const sendMessage = () => {
  const content = inputValue.value.trim()
  if (!content || isLoading.value) return

  // 添加用户消息
  const userMessage = {
    id: `msg-${messageId++}`,
    role: 'user',
    content: content
  }
  messages.value.push(userMessage)
  
  // 清空输入框
  inputValue.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 触发消息发送事件
  emit('message-sent', userMessage)
  
  // 调用扣子智能体API获取回复
  callCozeAgent()
}





/**
 * 调用扣子智能体API - 使用流式API，但在前端处理为完整回复
 */
const callCozeAgent = async () => {
  isLoading.value = true
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  try {
    // 获取用户最新消息
    const userMessage = messages.value[messages.value.length - 1]
    const userInput = userMessage.content
    
    // 创建一个临时的智能体消息，用于显示回复
    const agentMessage = {
      id: `msg-${messageId++}`,
      role: 'agent',
      content: '',
      content_type: 'text',
      type: 'answer'
    }
    messages.value.push(agentMessage)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
    
    try {
      // 构建符合API要求的完整消息格式
      const cozeMessages = [
        {
          content: userInput,
          content_type: 'text',
          role: 'user',
          type: 'question'
        }
      ]
      
      // 调用扣子智能体API - 使用流式API
      console.log('调用扣子智能体API（流式），消息格式:', cozeMessages)
      
      // 使用callCozeChatStream函数获取回复
      await callCozeChatStream(cozeMessages, {
        user_id: `user_${Date.now()}`,
        onMessage: (streamContent) => {
          console.log('收到流式响应内容:', streamContent)
          // 设置智能体消息的内容
          agentMessage.content = streamContent
          // 滚动到底部
          nextTick(() => {
            scrollToBottom()
          })
        },
        onComplete: (fullResponse) => {
          console.log('API调用完成，最终响应:', fullResponse)
          // 直接使用agentMessage.content作为最终回复，因为onMessage已经更新了它
          console.log('API调用完成，最终回复:', agentMessage.content)
        }
      })
      
      // 检查最终回复是否为空
      if (!agentMessage.content.trim()) {
        console.log('最终回复为空，添加默认回复')
        agentMessage.content = '抱歉，暂时无法获取智能助手的回复。请稍后再试，或者尝试使用其他问题。'
      }
    } catch (apiError) {
      // API调用失败，使用指定的错误信息
      console.log('API调用失败，错误信息:', apiError)
      
      // 使用指定的错误信息
      agentMessage.content = '抱歉，暂时无法获取智能助手的回复。请稍后再试，或者尝试使用其他问题。'
    }
    
    isLoading.value = false
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('调用扣子智能体API失败:', error)
    isLoading.value = false
    
    // 移除之前添加的临时消息
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'agent') {
      messages.value.pop()
    }
    
    // 使用指定的错误信息
    const errorMessage = {
      id: `msg-${messageId++}`,
      role: 'agent',
      content: '抱歉，暂时无法获取智能助手的回复。请稍后再试，或者尝试使用其他问题。',
      content_type: 'text',
      type: 'answer'
    }
    messages.value.push(errorMessage)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}



/**
 * 输入框内容变化
 */
const onInputChange = (e) => {
  inputValue.value = e.target.value
}

/**
 * 输入框获得焦点
 */
const onInputFocus = () => {
  console.log('输入框获得焦点')
}

/**
 * 输入框失去焦点
 */
const onInputBlur = () => {
  console.log('输入框失去焦点')
}

/**
 * 滚动到顶部
 */
const onScrollToUpper = () => {
  console.log('滚动到顶部')
}

// 生命周期钩子
onMounted(() => {
  console.log('悬浮智能体组件挂载')
})

onUnmounted(() => {
  console.log('悬浮智能体组件卸载')
})
</script>

<style scoped>
.floating-agent-container {
  position: fixed;
  bottom: 280rpx;
  right: -30rpx; /* 部分超出屏幕边缘，实现25%隐藏效果 */
  z-index: 100;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 悬浮形象按钮 */
.floating-btn {
  width: 140rpx;
  height: 140rpx;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: rotate(-60deg); /* 待机状态逆时针旋转60度 */
}

.floating-btn:hover,
.floating-btn:active {
  transform: rotate(0deg) scale(1.1); /* 悬停和点击时恢复正常旋转角度并放大 */
  margin-right: 30rpx; /* 完全移入屏幕内 */
}

.btn-image {
  width: 90%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  transition: all 0.3s ease;
}

.agent-avatar {
  width: 96rpx;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: contain;
}

.badge {
  position: absolute;
  top: -10rpx;
  left: 10rpx; /* 调整徽章位置，适应半隐藏状态 */
  background-color: #FF8090;
  color: #fff;
  font-size: 20rpx;
  font-weight: bold;
  min-width: 30rpx;
  height: 30rpx;
  border-radius: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8rpx;
  transform: rotate(60deg); /* 徽章旋转回正常角度，与旋转的按钮形成对比 */
  transition: all 0.3s ease;
}

.floating-btn:hover .badge,
.floating-btn:active .badge {
  transform: rotate(0deg); /* 悬停和点击时徽章恢复正常角度 */
  left: auto;
  right: -10rpx; /* 恢复正常位置 */
}

/* 聊天面板 */
.chat-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600rpx;
  height: 80vh;
  background-color: #FFE6F0;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 101;
}

/* 面板头部 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #FFD6E0;
  border-bottom: 2rpx solid #FFB3C6;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .agent-avatar {
  width: 60rpx;
  aspect-ratio: 1 / 1;
  margin-right: 20rpx;
}

.agent-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #4A4A4A;
  display: flex;
  align-items: center;
  height: 100%;
}

.header-right {
  display: flex;
  align-items: center;
}

.minimize-btn, .close-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  color: #666;
  cursor: pointer;
  margin-left: 20rpx;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.minimize-btn:hover, .close-btn:hover {
  background-color: #FFE6F0;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
  background-color: #FFFBF8;
}

/* 系统提示 */
.system-message {
  background-color: #E6F9FF;
  color: #4A90E2;
  padding: 15rpx 20rpx;
  border-radius: 15rpx;
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

/* 消息项 */
.message-item {
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-end;
}

.user-message {
  justify-content: flex-end;
}

.agent-message {
  justify-content: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-end;
  max-width: 70%;
}

.user-content {
  flex-direction: row-reverse;
}

.agent-content {
  flex-direction: row;
}

.message-text {
  padding: 15rpx 20rpx;
  border-radius: 15rpx;
  font-size: 30rpx;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

.user-message .message-text {
  background-color: #FF8090;
  color: #fff;
  border-bottom-right-radius: 5rpx;
}

.agent-message .message-text {
  background-color: #FFFFE0;
  color: #666;
  border-bottom-left-radius: 5rpx;
  border: 1rpx solid #FFE6F0;
}

.user-avatar {
  width: 50rpx;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: contain;
  margin-left: 10rpx;
}

.agent-message .agent-avatar {
  width: 50rpx;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: contain;
  margin-right: 10rpx;
}

/* 加载中提示 */
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15rpx 0;
}

.loading-icon {
  width: 40rpx;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: contain;
  margin-right: 10rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #A0A0A0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 输入区域 */
.input-area {
  padding: 20rpx;
  background-color: #FFD6E0;
  border-top: 2rpx solid #FFB3C6;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 30rpx;
  padding: 0 20rpx;
  margin-bottom: 15rpx;
}

.message-input {
  flex: 1;
  height: 80rpx;
  font-size: 30rpx;
  border: none;
  outline: none;
  padding: 0 10rpx;
}

.send-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #FF8090;
  color: #fff;
  border: none;
  border-radius: 30rpx;
  font-size: 28rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background-color: #FFA0AD;
}

.send-btn:disabled {
  background-color: #FFD6E0;
  cursor: not-allowed;
  color: #A0A0A0;
}


</style>