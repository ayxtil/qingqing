<template>
  <div class="password-verify-container">
    <div class="password-modal">
      <h2 class="modal-title">请输入密码</h2>
      <input 
        type="password" 
        class="password-input" 
        placeholder="请输入密码" 
        v-model="password"
        @keyup.enter="handleVerify"
        maxlength="4"
        pattern="\d{4}"
      />
      <button class="verify-btn" @click="handleVerify">验证</button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onVerify: {
    type: Function,
    required: true
  }
})

const password = ref('')
const error = ref('')

const handleVerify = () => {
  if (password.value === '9712') {
    // 密码正确，调用父组件的验证成功回调
    props.onVerify(true)
  } else {
    // 密码错误，显示错误信息
    error.value = '密码错误，请重新输入'
    password.value = ''
  }
}
</script>

<style scoped>
.password-verify-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fbf0ef;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.password-modal {
  background-color: #FFE6F0;
  border-radius: 15px;
  padding: 30px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 250px;
  border: 1px solid #FFB3C6;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.password-input {
  width: 80%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #FFB3C6;
  border-radius: 20px;
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
  background-color: white;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1);
}

.password-input:focus {
  outline: none;
  border-color: #80BFFF;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(128, 191, 255, 0.3);
}

.verify-btn {
  background-color: #80BFFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(128, 191, 255, 0.3);
}

.verify-btn:hover {
  background-color: #66A3FF;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(128, 191, 255, 0.4);
}

.error-text {
  color: #FF6B6B;
  font-size: 12px;
  margin-top: 10px;
}
</style>
