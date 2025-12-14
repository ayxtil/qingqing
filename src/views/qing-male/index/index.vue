<template>
  <!-- 清宫男厨师端首页 -->
  <div class="qing-male-index">
    <!-- 自定义导航栏 -->
    <div class="custom-navbar">
      <div class="nav-left"></div>

      <div class="nav-right"></div>
    </div>
    
    <!-- 主内容区 -->
      <div class="main-content">
      <!-- 最近订单 -->
      <div class="recent-orders">
        <h2 class="section-title">小主旨意</h2>
        <div class="order-list">
          <div class="order-item" v-for="dish in dishes" :key="dish.id">
            <div class="order-header">
              <select 
                class="order-status-select" 
                :class="selectedStatus[dish.id]"
                v-model="selectedStatus[dish.id]"
                @change="changeOrderStatus(dish)"
                @click.stop
              >
                <option value="pending">待处理</option>
                <option value="processing">制作中</option>
                <option value="completed">已完成</option>
                <option value="rejected">驳回/删除</option>
              </select>
            </div>
            <div class="order-content">
              <span class="order-dish">{{ dish.name }}</span>
              <span class="order-time">{{ dish.time }}</span>
            </div>
            <div class="order-price"><img src="../../../assets/macaron_yellow_rgb.png" alt="马卡龙黄色" class="price-icon" /> {{ dish.price }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 自定义确认框 -->
    <div class="custom-confirm" v-if="showConfirm">
      <div class="confirm-content">
        <p class="confirm-text">菜菜：你不要菜菜了吗？</p>
        <div class="confirm-buttons">
          <button class="confirm-btn reject-btn" @click="handleReject">驳回</button>
          <button class="confirm-btn delete-btn" @click="handleDelete">删除</button>
        </div>
      </div>
    </div>
    
    <!-- 已欠亲亲计数器 -->
    <div class="owed-counter">
      <img class="counter-icon" src="../../../assets/macaron_yellow_rgb.png" alt="马卡龙黄色" />
      <span class="counter-text">已欠亲亲</span>
      <span class="counter-value">{{ totalOwed }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 数据
const orderCount = ref(5)
const dishesCount = ref(20)
const rating = ref('4.8')

// 菜品数据（直接存储单个菜品）
const dishes = ref([])

// 响应式数据
const showConfirm = ref(false)
const selectedStatus = ref({})
const currentDish = ref(null)

// 初始化选中状态
onMounted(() => {
  // 初始化selectedStatus，默认状态为待处理
  dishes.value.forEach(dish => {
    selectedStatus.value[dish.id] = 'pending'
  })
})

// 从localStorage加载菜品数据
const loadDishesFromStorage = () => {
  const storedOrders = localStorage.getItem('femaleOrders')
  if (storedOrders) {
    const ordersData = JSON.parse(storedOrders)
    
    // 将订单数据转换为单个菜品数据
    const allDishes = []
    ordersData.forEach(order => {
      order.items.forEach(item => {
        // 按数量展开，每道菜一张卡片
        for (let i = 0; i < item.quantity; i++) {
          allDishes.push({
            id: `${order.id}-${item.id}-${i}`,
            name: item.name,
            status: order.status,
            statusText: order.statusText,
            createTime: order.createTime,
            time: new Date(order.createTime).toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            price: item.price
          })
        }
      })
    })
    
    dishes.value = allDishes
    
    // 菜品数据加载后，初始化selectedStatus，默认状态为待处理
    setTimeout(() => {
      dishes.value.forEach(dish => {
        selectedStatus.value[dish.id] = 'pending'
      })
    }, 0)
  }
}

// 计算已欠亲亲总数
const totalOwed = computed(() => {
  // 获取当前日期（YYYY-MM-DD格式）
  const today = new Date().toISOString().split('T')[0]
  
  // 计算当天所有菜品的数量
  return dishes.value
    .filter(dish => {
      // 检查菜品创建日期
      const dishDate = new Date(dish.createTime).toISOString().split('T')[0]
      return dishDate === today
    })
    .length
})

/**
 * 生命周期函数--监听页面加载
 */
onMounted(() => {
  console.log('清宫男厨师端首页加载')
  loadDishesFromStorage()
  
  // 调试信息
  console.log('当前日期:', new Date().toISOString().split('T')[0])
  console.log('所有菜品:', dishes.value)
  console.log('当天已完成菜品:', dishes.value.filter(dish => {
    const dishDate = new Date(dish.createTime).toISOString().split('T')[0]
    return dish.status === 'completed' && dishDate === new Date().toISOString().split('T')[0]
  }))
})

/**
 * 跳转到添加菜品页面
 */
const navigateToAddDish = () => {
  console.log('跳转到添加菜品页面')
}

/**
 * 跳转到订单列表页面
 */
const navigateToOrders = () => {
  console.log('跳转到订单列表页面')
}

/**
 * 跳转到食材库存页面
 */
const navigateToInventory = () => {
  console.log('跳转到食材库存页面')
}

// 订单详情页已删除，注释掉跳转函数
// /**
//  * 跳转到订单详情页面
//  */
// const navigateToOrderDetail = (orderId) => {
//   router.push(`/qing-male/order-detail?id=${orderId}`)
// }

/**
 * 改变菜品状态
 */
const changeOrderStatus = (dish) => {
  const statusMap = {
    pending: '待处理',
    processing: '制作中',
    completed: '已完成',
    rejected: '驳回/删除'
  }
  
  // 获取当前选择的状态
  const selectedStatusValue = selectedStatus.value[dish.id]
  
  // 如果选择的是驳回/删除状态，显示确认框
  if (selectedStatusValue === 'rejected') {
    currentDish.value = dish
    showConfirm.value = true
    // 恢复原来的状态，等待用户确认
    selectedStatus.value[dish.id] = dish.status
  } else {
    // 其他状态直接更新
    dish.status = selectedStatusValue
    dish.statusText = statusMap[selectedStatusValue]
    console.log(`菜品状态已更新为${dish.statusText}`)
  }
}

/**
 * 处理驳回操作
 */
const handleReject = () => {
  if (currentDish.value && currentDish.value.name) {
    // 将菜肴名称复制到剪贴板
    navigator.clipboard.writeText(currentDish.value.name)
      .then(() => {
        console.log('菜肴名称已复制到剪贴板:', currentDish.value.name)
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
    
    // 删除该菜肴
    deleteDish(currentDish.value)
  }
  showConfirm.value = false
  currentDish.value = null
}

/**
 * 处理删除操作
 */
const handleDelete = () => {
  if (currentDish.value) {
    // 直接删除该菜肴
    deleteDish(currentDish.value)
  }
  showConfirm.value = false
  currentDish.value = null
}

/**
 * 删除单个菜肴
 */
const deleteDish = (dish) => {
  // 从localStorage中获取订单数据
  const storedOrders = localStorage.getItem('femaleOrders')
  if (storedOrders) {
    let allOrders = JSON.parse(storedOrders)
    
    // 创建新的菜品列表，移除当前菜品
    const updatedDishes = dishes.value.filter(d => d.id !== dish.id)
    
    // 更新内存中的菜品数据
    dishes.value = updatedDishes
    
    // 更新localStorage中的订单数据
    // 从菜品ID中提取原始订单ID和菜品索引
    const [originalOrderId, itemId, index] = dish.id.split('-')
    
    // 查找原始订单
    const orderIndex = allOrders.findIndex(order => order.id === originalOrderId)
    if (orderIndex !== -1) {
      const originalOrder = allOrders[orderIndex]
      
      // 查找原始订单中的菜品
      const itemIndex = originalOrder.items.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        // 如果菜品数量大于1，减少数量
        if (originalOrder.items[itemIndex].quantity > 1) {
          originalOrder.items[itemIndex].quantity--
          originalOrder.totalItems--
          originalOrder.totalPrice = `${originalOrder.totalItems}个亲亲`
        } else {
          // 否则删除该菜品
          originalOrder.items.splice(itemIndex, 1)
          originalOrder.totalItems--
          originalOrder.totalPrice = `${originalOrder.totalItems}个亲亲`
          
          // 如果订单中没有菜品了，删除整个订单
          if (originalOrder.items.length === 0) {
            allOrders.splice(orderIndex, 1)
          }
        }
        
        // 保存更新后的订单数据
        localStorage.setItem('femaleOrders', JSON.stringify(allOrders))
      }
    }
    
    // 重新初始化selectedStatus
    dishes.value.forEach(d => {
      selectedStatus.value[d.id] = d.status
    })
  }
}
</script>

<style scoped>
.qing-male-index {
  min-height: 100vh;
  background-color: rgb(255, 254, 250);
}

/* 自定义标题栏（普通部件） */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 300rpx;
  background-image: url('../../../assets/generate_cute_image.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  border-bottom: 1rpx solid #FFB3C6;
  border-radius: 0 0 20rpx 20rpx;
}

.nav-left, .nav-right {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}



/* 主内容区 */
.main-content {
  padding: 15rpx 30rpx;
}

/* 欢迎信息 */
.welcome-section.recent-orders {
  margin-bottom: 30rpx;
  background-color: #E6E6FA;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  border: 1px solid #FFB3C6;
}

.welcome-title {
  font-size: 42rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.welcome-subtitle {
  font-size: 32rpx;
  color: #666;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  background-color: #FFFFE0;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
  border: 1px solid #FFB3C6;
}

.stat-card:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 28rpx;
  color: #666;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-card {
  background-color: #FFFFE0;
  padding: 40rpx 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.action-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 最近订单 */
.recent-orders {
  background-color: #E6E6FA;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 8rpx;
  height: 36rpx;
  background-color: #4ecdc4;
  margin-right: 15rpx;
  border-radius: 4rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-item {
  padding: 25rpx;
  border-radius: 15rpx;
  background-color: #FFFFE0;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #FFB3C6;
}

.order-item:hover {
  background-color: #FFFFE0;
  transform: translateX(5rpx);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.order-id {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.order-status, .order-status-select {
  font-size: 26rpx;
  font-weight: bold;
  padding: 5rpx 15rpx;
  border-radius: 15rpx;
  border: none;
  outline: none;
  cursor: pointer;
}

.order-status.pending, .order-status-select.pending {
  background-color: rgba(255, 224, 130, 0.8);
  color: #FF6F00;
}

.order-status.processing, .order-status-select.processing {
  background-color: rgba(144, 238, 144, 0.8);
  color: #006400;
}

.order-status.completed, .order-status-select.completed {
  background-color: rgba(174, 194, 224, 0.8);
  color: #1565C0;
}

.order-status.rejected, .order-status-select.rejected {
  background-color: rgba(255, 182, 193, 0.8);
  color: #DC143C;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.order-dish {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.order-time {
  font-size: 28rpx;
  color: #999;
}

.order-price {
  font-size: 30rpx;
  font-weight: bold;
  color: #FF8090;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.price-icon {
  width: 42rpx;
  aspect-ratio: 1 / 1;
  margin-right: 10rpx;
  vertical-align: middle;
  object-fit: contain;
}

/* 自定义确认框样式 */
.custom-confirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 50rpx;
  width: 80%;
  max-width: 500rpx;
  text-align: center;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #FFD6E0 0%, #E6E6FA 100%);
  border: 2rpx solid #FFB3C6;
}

.confirm-text {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 40rpx;
  font-weight: bold;
  line-height: 1.5;
}

.confirm-buttons {
  display: flex;
  gap: 30rpx;
  justify-content: center;
}

.confirm-btn {
  flex: 1;
  padding: 25rpx 0;
  border: none;
  border-radius: 25rpx;
  font-size: 32rpx;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  max-width: 200rpx;
  box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.1);
}

.reject-btn {
  background-color: #FFB3C6;
  color: #333;
}

.delete-btn {
  background-color: #80BFFF;
  color: #fff;
}

.confirm-btn:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
  opacity: 0.9;
}

/* 已欠亲亲计数器 */
.owed-counter {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  background-color: #FF8090;
  border-radius: 50%;
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
  z-index: 100;
  cursor: default;
  box-sizing: border-box;
}

.owed-counter:hover {
  transform: scale(1.1);
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.7);
}

.counter-icon {
  width: 60rpx;
  aspect-ratio: 1 / 1;
  margin-bottom: 2rpx;
  vertical-align: middle;
  line-height: 1;
  object-fit: contain;
}

.counter-text {
  font-size: 22rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 2rpx;
  line-height: 1;
}

.counter-value {
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}
</style>