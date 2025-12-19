<template>
  <!-- 翻牌子页面 -->
  <div class="qing-female-index">
    <!-- 粒子效果 -->
    <div class="particles-container">
      <div v-for="(particle, index) in particles" :key="index" class="particle" :style="{
        left: `${particle.left}%`,
        top: `${particle.top}%`,
        animationDelay: `${particle.delay}ms`,
        animationDuration: `${particle.duration}ms`
      }"></div>
    </div>
    
    <!-- 更新提示 -->
    <div v-if="hasNewData" class="update-notification">
      数据已更新，展示最新菜肴！
    </div>
    
    <!-- 更新中提示 -->
    <div v-if="isUpdating" class="updating-notification">
      检查更新中...
    </div>

    <!-- 自定义导航栏 -->
    <div class="custom-navbar">


      <div class="nav-right"></div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-input">
          <img class="search-icon" src="../../../assets/design_icon.png" alt="搜索图标" />
          <input type="text" placeholder="搜索菜品" class="search-placeholder" v-model="searchQuery" />
        </div>
      </div>
      
      <!-- 分类标签 -->
      <div class="category-container">
        <!-- 一级分类标签 -->
        <div class="category-scroll">
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="category-item"
            :class="{ selected: selectedCategory === category.name }"
            @click="toggleDropdown(category.name)"
          >
            <span class="category-text">{{ category.name }}</span>
            <span class="dropdown-arrow" :class="{ rotated: openDropdown === category.name }">▼</span>
          </div>
        </div>
        
        <!-- 二级分类下拉菜单 -->
        <div 
          class="subcategory-dropdown" 
          v-if="openDropdown"
        >
          <div 
            class="subcategory-item"
            :class="{ selected: selectedSubCategory === 'all' }"
            @click="selectSubCategory('all')"
          >
            <span class="subcategory-text">全部</span>
          </div>
          <div 
            v-for="subcategory in getSubCategories(openDropdown)" 
            :key="subcategory"
            class="subcategory-item"
            :class="{ selected: selectedSubCategory === subcategory }"
            @click="selectSubCategory(subcategory)"
          >
            <span class="subcategory-text">{{ subcategory }}</span>
          </div>
        </div>
      </div>
      
      <!-- 瀑布流菜品卡片 -->
      <div class="waterfall-container">
        <div class="waterfall-column" v-for="(column, index) in waterfallColumns" :key="index">
          <div class="dish-card" v-for="dish in column" :key="dish.id">
            <div class="card-background"></div>
            <div class="card-content">
              <img class="dish-image" :src="dish.imageUrl" alt="dish.name" @error="onImageError($event, dish)" />
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <span class="dish-description">{{ dish.description }}</span>
                <div class="dish-footer">
                    <div class="dish-price">
                      <img class="price-icon" src="../../../assets/macaron_yellow_rgb.png" alt="马卡龙黄色" />
                      <span class="price-text">{{ dish.price }}</span>
                    </div>
                    <div 
                      class="add-to-cart-btn"
                      @click.stop="addToCart(dish)"
                    >
                      <img class="add-icon" src="../../../assets/design_icon_2.png" alt="添加到购物车" />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 悬浮按钮 -->
    <div class="fab" @click="toggleCartPanel">
      <!-- 购物车数量角标 -->
      <div class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</div>
    </div>
    
    <!-- 购物车面板 -->
    <div class="cart-panel" :class="{ expanded: isCartPanelVisible }">
      <!-- 购物车头部 -->
      <div class="cart-header">
        <h3>我的购物车</h3>
        <span class="close-btn" @click="toggleCartPanel">×</span>
      </div>
      
      <!-- 购物车空状态 -->
      <div v-if="cartCount === 0" class="cart-empty">
        <span class="empty-icon">🛒</span>
        <p>购物车是空的，快去添加美食吧～</p>
      </div>
      
      <!-- 购物车商品列表 -->
      <div v-else class="cart-items">
        <div 
          v-for="item in cart" 
          :key="item.id"
          class="cart-item"
        >
          <div class="item-image">
            <img :src="item.imageUrl" :alt="item.name" />
          </div>
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
            <p class="item-price">{{ item.price }}</p>
          </div>
          <div class="item-actions">
            <button 
              class="action-btn decrease"
              @click="updateItemQuantity(item, -1)"
            >-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button 
              class="action-btn increase"
              @click="updateItemQuantity(item, 1)"
            >+</button>
          </div>
        </div>
      </div>
      
      <!-- 购物车底部 -->
      <div v-if="cartCount > 0" class="cart-footer">
        <div class="total-info">
          <span>共 {{ cartCount }} 件商品</span>
          <span class="total-price">总计：{{ cartCount }} 个亲亲</span>
        </div>
        <button class="checkout-btn" @click="placeOrder">下单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { loadDishData, checkForUpdates } from '../../../utils/dataManager.js'
import { addFeishuOrder } from '../../../utils/feishuApi.js'

const router = useRouter()

// 菜品数据
const allDishes = ref([])
const filteredDishes = ref([])
const waterfallColumns = ref([[], []]) // 两列瀑布流
// 搜索和分类
const searchQuery = ref('')
const selectedCategory = ref('主食') // 默认选中主食
const selectedSubCategory = ref('all') // 默认选中全部二级分类
const openDropdown = ref(null) // 当前打开的下拉菜单
// 粒子效果
const particles = ref([])
// 加载状态
const isLoading = ref(false)
// 更新状态
const isUpdating = ref(false)
const hasNewData = ref(false)
// 购物车数据
const cart = ref([]) // 购物车商品列表
const cartCount = ref(0) // 购物车商品数量
const isCartPanelVisible = ref(false) // 购物车面板显示状态
// 轮询定时器
let pollTimer = null
// 轮询间隔（毫秒）
const POLL_INTERVAL = 30000 // 30秒

// 从localStorage加载购物车数据
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('femaleCart')
  if (storedCart) {
    cart.value = JSON.parse(storedCart)
    updateCartCount()
    console.log('从本地存储加载购物车数据:', cart.value)
  }
}

// 保存购物车数据到localStorage
const saveCartToStorage = () => {
  localStorage.setItem('femaleCart', JSON.stringify(cart.value))
  console.log('购物车数据已保存到本地存储')
}

// 监听购物车变化，自动保存到localStorage
watch(cart, () => {
  saveCartToStorage()
}, { deep: true })

// 一级分类
const categories = ref([
  { name: '主食' },
  { name: '素菜' },
  { name: '荤菜' },
  { name: '其他' }
])

// 二级分类映射
const subCategoriesMap = ref(new Map())

// 智能判断是否为水产品
const isAquaticProduct = (dish) => {
  // 水产品关键词列表
  const aquaticKeywords = ['海鲜', '鱼', '虾', '蟹', '贝', '螺', '鲍', '参', '蛎', '蛤', '蛏', '鱿', '章鱼', '墨鱼', '海蜇', '海带', '紫菜', '海藻']
  
  // 检查菜品名称、分类是否包含水产品关键词
  const dishText = `${dish.category} ${dish.subCategory} ${dish.name}`.toLowerCase()
  
  return aquaticKeywords.some(keyword => dishText.includes(keyword))
}

// 初始化二级分类映射
const initSubCategoriesMap = () => {
  const map = new Map()
  
  // 遍历所有菜品，构建二级分类映射
  allDishes.value.forEach(dish => {
    let category = dish.category
    let subCategory = dish.subCategory
    
    // 智能分类处理
    if (category === '汤') {
      // 所有一级分类为汤的菜品，都归到其他分类下的汤
      category = '其他'
      subCategory = '汤'
    } else if (isAquaticProduct(dish)) {
      // 所有水产品，都归到其他分类下的鱼鲜
      category = '其他'
      subCategory = '鱼鲜'
    } else if (category === '海鲜') {
      // 兼容原有逻辑，将海鲜归到其他分类下的鱼鲜
      category = '其他'
      subCategory = '鱼鲜'
    }
    
    if (!map.has(category)) {
      map.set(category, new Set())
    }
    map.get(category).add(subCategory)
  })
  subCategoriesMap.value = map
}

/**
 * 处理飞书表格更新
 */
const handleUpdate = async () => {
  try {
    isUpdating.value = true
    hasNewData.value = false
    
    // 检查是否有更新
    const hasUpdate = await checkForUpdates()
    
    if (hasUpdate) {
      console.log('检测到飞书表格更新，重新加载菜品数据...')
      // 重新加载菜品数据
      const dishes = await loadDishData()
      
      // 更新页面数据
      allDishes.value = dishes
      initSubCategoriesMap()
      filterDishes(searchQuery.value, selectedCategory.value, selectedSubCategory.value)
      
      hasNewData.value = true
      console.log('菜品数据已更新')
      
      // 3秒后隐藏更新提示
      setTimeout(() => {
        hasNewData.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('处理更新失败:', error)
  } finally {
    isUpdating.value = false
  }
}

/**
 * 启动定时轮询
 */
const startPolling = () => {
  console.log('======== 启动飞书表格轮询 ========')
  console.log('轮询间隔:', POLL_INTERVAL / 1000, '秒')
  stopPolling() // 先停止已有定时器，避免重复启动
  pollTimer = setInterval(handleUpdate, POLL_INTERVAL)
  console.log('轮询定时器ID:', pollTimer)
  console.log('==============================')
}

/**
 * 停止定时轮询
 */
const stopPolling = () => {
  if (pollTimer) {
    console.log('======== 停止飞书表格轮询 ========')
    console.log('停止轮询定时器，ID:', pollTimer)
    clearInterval(pollTimer)
    pollTimer = null
    console.log('轮询已停止')
    console.log('==============================')
  }
}

/**
 * 生命周期函数--监听页面加载
 */
onMounted(() => {
  // 初始化页面
  initParticles()
  loadDishes()
  // 加载购物车数据
  loadCartFromStorage()
  // 启动定时轮询
  startPolling()
})

/**
 * 生命周期函数--监听页面卸载
 */
onBeforeUnmount(() => {
  // 停止定时轮询，防止内存泄漏
  stopPolling()
})

/**
 * 初始化粒子效果
 */
const initParticles = () => {
  const particlesArray = []
  // 创建30个粒子
  for (let i = 0; i < 30; i++) {
    particlesArray.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2000,
      duration: 4000 + Math.random() * 2000
    })
  }
  particles.value = particlesArray
}

/**
 * 加载菜品数据
 */
const loadDishes = async () => {
  console.log('开始加载菜品数据...')
  isLoading.value = true
  
  try {
    // 使用真实的菜品数据加载
    console.log('调用loadDishData函数...')
    const dishes = await loadDishData()
    
    console.log('加载菜品数据成功，共加载到', dishes.length, '条数据')
    
    allDishes.value = dishes
    console.log('allDishes.value赋值完成，长度:', allDishes.value.length)
    
    // 初始化二级分类映射
    initSubCategoriesMap()
    console.log('二级分类映射初始化完成')
    
    // 初始筛选
    filterDishes(searchQuery.value, selectedCategory.value, selectedSubCategory.value)
    
    isLoading.value = false
    console.log('加载菜品数据完成')
  } catch (error) {
    console.error('加载菜品数据失败:', error)
    isLoading.value = false
  }
}

/**
 * 初始化瀑布流
 * @param {Array} dishes - 菜品列表
 */
const initWaterfall = (dishes) => {
  // 简单的瀑布流实现，交替分配到两列
  const columns = [[], []]
  dishes.forEach((dish, index) => {
    columns[index % 2].push(dish)
  })
  waterfallColumns.value = columns
}

/**
 * 切换下拉菜单
 * @param {string} category - 分类名称
 */
const toggleDropdown = (category) => {
  if (openDropdown.value === category) {
    // 如果当前分类的下拉菜单已经打开，则关闭
    openDropdown.value = null
  } else {
    // 否则打开当前分类的下拉菜单
    openDropdown.value = category
    // 切换分类时，重置二级分类为全部
    selectedSubCategory.value = 'all'
    // 选择分类
    selectCategory(category)
  }
}

/**
 * 获取指定一级分类下的二级分类
 * @param {string} category - 一级分类名称
 * @returns {Array} 二级分类数组
 */
const getSubCategories = (category) => {
  return Array.from(subCategoriesMap.value.get(category) || [])
}

/**
 * 选择二级分类
 * @param {string} subCategory - 二级分类名称
 */
const selectSubCategory = (subCategory) => {
  selectedSubCategory.value = subCategory
  // 筛选菜品
  filterDishes(searchQuery.value, selectedCategory.value, subCategory)
  // 关闭下拉菜单
  openDropdown.value = null
}

/**
 * 选择分类
 * @param {string} category - 分类名称
 */
const selectCategory = (category) => {
  selectedCategory.value = category
  // 选择分类时，重置二级分类为全部
  selectedSubCategory.value = 'all'
  // 筛选菜品
  filterDishes(searchQuery.value, category, 'all')
}

/**
 * 监听搜索查询变化
 */
watch(searchQuery, (newQuery) => {
  // 搜索时，忽略分类过滤，搜索所有分类的菜品
  filterDishes(newQuery, '', 'all')
})

/**
 * 过滤菜品
 * @param {string} query - 搜索关键词
 * @param {string} category - 一级分类
 * @param {string} subCategory - 二级分类
 */
const filterDishes = (query, category, subCategory) => {
  let filtered = [...allDishes.value]
  
  // 按一级分类过滤（只有当category有值时才过滤）
  if (category) {
    if (category === '其他') {
      // 特殊处理：其他分类包含汤、海鲜和智能判断的水产品
      filtered = filtered.filter(dish => {
        // 一级分类为汤的菜品
        const isSoup = dish.category === '汤'
        // 一级分类为海鲜的菜品
        const isSeafood = dish.category === '海鲜'
        // 智能判断为水产品的菜品
        const isAquatic = isAquaticProduct(dish)
        
        return isSoup || isSeafood || isAquatic
      })
    } else {
      // 普通一级分类过滤
      filtered = filtered.filter(dish => dish.category === category)
    }
    
    // 按二级分类过滤（只有当category有值且subCategory不是'all'时才过滤）
    if (subCategory !== 'all') {
      if (category === '其他') {
        // 特殊处理：其他分类下的二级分类
        if (subCategory === '鱼鲜') {
          // 鱼鲜对应海鲜和智能判断的水产品
          filtered = filtered.filter(dish => {
            return dish.category === '海鲜' || isAquaticProduct(dish)
          })
        } else if (subCategory === '汤') {
          // 汤对应汤
          filtered = filtered.filter(dish => dish.category === '汤')
        }
      } else {
        // 普通二级分类过滤
        filtered = filtered.filter(dish => dish.subCategory === subCategory)
      }
    }
  }
  
  // 按关键词过滤
  if (query && query.trim()) {
    const lowerQuery = query.toLowerCase()
    // 搜索所有分类，包括汤和海鲜
    filtered = allDishes.value.filter(dish => {
      // 检查菜品名称、描述和配料是否包含关键词，添加空值检查
      return (dish.name && dish.name.toLowerCase().includes(lowerQuery)) ||
             (dish.description && dish.description.toLowerCase().includes(lowerQuery)) ||
             (dish.ingredients && dish.ingredients.some(ingredient => ingredient && ingredient.toLowerCase().includes(lowerQuery)))
    })
  }
  
  // 确保去重逻辑在所有情况下都执行
  const uniqueDishesMap = new Map()
  const uniqueFiltered = filtered.filter(dish => {
    // 智能去重：基于菜品名称的相似度进行去重
    // 对于搜索结果，我们使用更直接的方式：如果两个菜品名称包含相同的主要食材，就视为同一道菜
    const name = dish.name.toLowerCase()
    
    // 生成去重键：使用原始名称，但将常见的烹饪方法替换为空格，然后按字符排序
    // 这样可以处理"黄豆炖猪蹄"和"猪蹄炖黄豆"这种情况
    const key = name
      .replace(/[炖煮炒炸烧焖煎烤蒸烩拌]/g, ' ')
      .split('')
      .sort()
      .join('')
    
    if (!uniqueDishesMap.has(key)) {
      uniqueDishesMap.set(key, dish)
      return true
    }
    return false
  })
  
  filteredDishes.value = uniqueFiltered
  console.log('搜索关键词:', query, '原数据长度:', filtered.length, '去重后长度:', uniqueFiltered.length)
  
  // 初始化瀑布流
  initWaterfall(uniqueFiltered)
}

// 菜品详情页已删除，注释掉跳转函数
// /**
//  * 跳转到菜品详情页
//  * @param {string} dishId - 菜品ID
//  */
// const navigateToDishDetail = (dishId) => {
//   router.push(`/qing-female/dish-detail?id=${dishId}`)
// }



/**
 * 添加到购物车
 * @param {Object} dish - 菜品对象
 */
const addToCart = (dish) => {
  // 查找购物车中是否已存在该商品
  const existingItem = cart.value.find(item => item.id === dish.id)
  
  if (existingItem) {
    // 如果已存在，数量+1
    existingItem.quantity += 1
  } else {
    // 如果不存在，添加到购物车
    cart.value.push({
      ...dish,
      quantity: 1
    })
  }
  
  // 更新购物车数量
  updateCartCount()
  
  console.log('添加到购物车成功:', dish.name, '购物车数量:', cartCount.value)
}

/**
 * 更新购物车数量
 */
const updateCartCount = () => {
  cartCount.value = cart.value.reduce((total, item) => total + item.quantity, 0)
}

/**
 * 切换购物车面板显示/隐藏
 */
const toggleCartPanel = () => {
  isCartPanelVisible.value = !isCartPanelVisible.value
  console.log('购物车面板状态:', isCartPanelVisible.value)
}

/**
 * 更新商品数量
 * @param {Object} item - 商品对象
 * @param {number} change - 数量变化值（+1或-1）
 */
const updateItemQuantity = (item, change) => {
  const newQuantity = item.quantity + change
  
  if (newQuantity <= 0) {
    // 如果数量变为0或负数，从购物车中移除该商品
    const index = cart.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  } else {
    // 更新商品数量
    item.quantity = newQuantity
  }
  
  // 更新购物车数量
  updateCartCount()
  console.log('更新商品数量:', item.name, '新数量:', newQuantity)
}

/**
 * 下单功能
 */
const placeOrder = async () => {
  if (cartCount.value === 0) {
    console.log('购物车为空，无法下单')
    return
  }
  
  // 生成唯一订单ID
  const orderId = 'ORD' + Date.now().toString().slice(-8)
  
  // 创建订单对象
  const order = {
    id: orderId,
    createTime: Date.now(),
    status: 'completed', // 直接设为已完成状态
    statusText: '已完成',
    items: cart.value.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    totalItems: cartCount.value,
    totalPrice: `${cartCount.value}个亲亲`
  }
  
  console.log('生成订单:', order)
  
  // 获取现有订单
  const existingOrders = localStorage.getItem('femaleOrders')
  let orders = []
  if (existingOrders) {
    orders = JSON.parse(existingOrders)
  }
  
  // 添加新订单到订单列表
  orders.unshift(order) // 添加到列表开头
  
  // 保存订单到localStorage
  localStorage.setItem('femaleOrders', JSON.stringify(orders))
  console.log('订单已保存到本地存储:', order)
  
  // 向飞书表格添加记录
  for (const item of cart.value) {
    for (let i = 0; i < item.quantity; i++) {
      try {
        // 向飞书表格添加记录
        await addFeishuOrder({
          name: item.name,
          createTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          status: 'pending' // 初始状态设为待处理
        })
        console.log(`已向飞书表格添加记录: ${item.name}`)
      } catch (error) {
        console.error('向飞书表格添加记录失败:', error)
      }
    }
  }
  
  // 清空购物车
  cart.value = []
  updateCartCount()
  
  // 关闭购物车面板
  isCartPanelVisible.value = false
  
  // 跳转到历史订单页面
  router.push('/royal-seal')
  
  console.log('下单成功，已跳转到历史订单页面')
}

/**
 * 处理图片加载失败
 * @param {Event} event - 错误事件
 * @param {Object} dish - 菜品对象
 */
const onImageError = (event, dish) => {
  console.error(`图片加载失败: ${JSON.stringify(dish.imageUrl)}`)
  // 使用picsum.photos服务提供默认图片
  event.target.src = `https://picsum.photos/200/200?random=${dish.id}`
  // 更新菜品对象中的图片URL，避免下次加载时再次失败
  dish.imageUrl = event.target.src
}
</script>

<style scoped>
.qing-female-index {
  min-height: 100vh;
  background-color: rgb(255, 254, 250);
  position: relative;
  overflow: hidden;
}

/* 粒子效果 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
/* 粒子效果 */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: rgba(255, 107, 107, 0.5);
  border-radius: 50%;
  animation: float 6s infinite ease-in-out;
  opacity: 0.6;
}

/* 更新提示样式 - 马卡龙配色 */
.update-notification {
  position: fixed;
  top: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FFE6F0; /* 马卡龙淡粉色 */
  color: #FF6B6B; /* 马卡龙红色 */
  padding: 15rpx 30rpx;
  border-radius: 25rpx;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.2);
  font-size: 28rpx;
  font-weight: bold;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

/* 更新中提示样式 - 马卡龙配色 */
.updating-notification {
  position: fixed;
  top: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #E6F7FF; /* 马卡龙淡蓝色 */
  color: #66BFFF; /* 马卡龙蓝色 */
  padding: 15rpx 30rpx;
  border-radius: 25rpx;
  box-shadow: 0 4rpx 15rpx rgba(102, 191, 255, 0.2);
  font-size: 28rpx;
  font-weight: bold;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

/* 滑入动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

/* 自定义标题栏（普通部件） */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 300rpx;
  background-image: url('../../../assets/generate_specific_style.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  padding: 0 30rpx;
  margin-bottom: 15rpx;
  border-bottom: 1rpx solid #FFB3C6;
}

.nav-right {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 15rpx 30rpx 30rpx 30rpx;
  position: relative;
  z-index: 1;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 15rpx;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #F5E6FF;
  border-radius: 50rpx;
  padding: 0 30rpx;
  height: 80rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.search-icon {
  width: 40rpx;
  aspect-ratio: 1 / 1;
  margin-right: 20rpx;
  object-fit: contain;
}

.search-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 32rpx;
  color: #333;
  height: 100%;
  background-color: transparent;
}

.search-placeholder {
  color: #999;
}

/* 分类标签 */
.category-container {
  position: relative;
  margin-bottom: 15rpx;
}

.category-scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10rpx;
  white-space: nowrap;
}

.category-item {
  display: inline-flex;
  align-items: center;
  padding: 15rpx 30rpx;
  margin-right: 20rpx;
  background-color: #FFFFE0;
  border-radius: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:last-child {
  margin-right: 0;
}

.category-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15);
}

.category-item.selected {
  background-color: #FF8090;
  color: #fff;
}

.category-text {
  font-size: 32rpx;
  font-weight: 500;
  margin-right: 8rpx;
}

.dropdown-arrow {
  font-size: 20rpx;
  transition: transform 0.3s;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* 二级分类下拉菜单 */
.subcategory-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #FFFFE0;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  padding: 20rpx 0;
  z-index: 10;
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  padding: 20rpx;
}

.subcategory-item {
  display: inline-block;
  padding: 10rpx 20rpx;
  background-color: #E6E6FA;
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 28rpx;
  color: #666;
}

.subcategory-item:hover {
  background-color: #D8BFD8;
}

.subcategory-item.selected {
  background-color: #FF8090;
  color: #fff;
}

.subcategory-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 隐藏滚动条 */
.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 瀑布流菜品卡片 */
.waterfall-container {
  display: flex;
  gap: 30rpx;
}

.waterfall-column {
  flex: 1;
}

.dish-card {
  background-color: #FFFFE0;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.dish-card:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.15);
}

.card-content {
  position: relative;
}

.dish-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.dish-info {
  padding: 20rpx;
}

.dish-name {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.dish-description {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  display: flex;
  align-items: center;
}

.price-icon {
  width: 42rpx;
  aspect-ratio: 1 / 1;
  margin-right: 10rpx;
  vertical-align: middle;
  object-fit: contain;
}

.price-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF8090;
}

/* 添加到购物车按钮 */
.add-to-cart-btn {
  width: 60rpx;
  aspect-ratio: 1 / 1;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: none;
}

.add-to-cart-btn:hover {
  transform: scale(1.1);
  box-shadow: none;
}

.add-icon {
  width: 54rpx;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  line-height: 1;
}

/* 悬浮按钮 */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 165rpx;
  width: 120rpx;
  aspect-ratio: 1 / 1;
  background: url('../../../assets/design_icon_1.png') no-repeat center center;
  background-size: contain;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  filter: drop-shadow(0 5rpx 20rpx rgba(0, 0, 0, 0.4));
}

.fab:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 6rpx 25rpx rgba(0, 0, 0, 0.5));
}

/* 购物车数量角标 */
.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #FF8090;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  border-radius: 50%;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
  min-width: 48rpx;
}

/* 购物车面板 */
.cart-panel {
  position: fixed;
  bottom: 150rpx;
  left: 0;
  right: 0;
  background-color: #E6E6FA; /* 马卡龙淡紫色 */
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.15);
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

.cart-panel.expanded {
  max-height: calc(100vh - 200rpx);
}

/* 购物车头部 */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #D8BFD8; /* 深一点的紫色边框 */
  background-color: #D8BFD8; /* 马卡龙淡紫色（稍深） */
}

.cart-header h3 {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.close-btn {
  font-size: 48rpx;
  color: #999;
  cursor: pointer;
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #666;
}

/* 购物车空状态 */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;
  text-align: center;
  background-color: #E6E6FA;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 28rpx;
  color: #999;
  margin: 0;
}

/* 购物车商品列表 */
.cart-items {
  padding: 0 30rpx;
  max-height: calc(100vh - 100rpx - 200rpx);
  overflow-y: auto;
}

/* 单个购物车商品 */
.cart-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #D8BFD8; /* 深一点的紫色边框 */
  background-color: #E6E6FA; /* 马卡龙淡紫色 */
}

/* 商品图片 */
.item-image {
  width: 120rpx;
  aspect-ratio: 1 / 1;
  border-radius: 10rpx;
  overflow: hidden;
  margin-right: 20rpx;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品信息 */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 0 0 10rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 28rpx;
  color: #FF8090;
  margin: 0;
}

/* 商品操作按钮 */
.item-actions {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border: 2rpx solid #9370DB; /* 马卡龙紫色 */
  border-radius: 50%;
  background-color: #fff;
  color: #9370DB; /* 马卡龙紫色 */
  font-size: 32rpx;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #9370DB; /* 马卡龙紫色 */
  color: #fff;
}

.action-btn.decrease {
  font-size: 40rpx;
  line-height: 1;
}

.quantity {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  min-width: 40rpx;
  text-align: center;
}

/* 购物车底部 */
.cart-footer {
  padding: 20rpx 30rpx;
  border-top: 2rpx solid #D8BFD8; /* 深一点的紫色边框 */
  background-color: #D8BFD8; /* 马卡龙淡紫色（稍深） */
}

.total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.total-info span {
  font-size: 32rpx;
  color: #333;
}

.total-price {
  font-weight: bold;
  color: #FF8090;
}

/* 结算按钮 */
.checkout-btn {
  width: 100%;
  height: 80rpx;
  background-color: #FF8090;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.3);
}

.checkout-btn:hover {
  background-color: #ff4a4a;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.4);
}

/* 隐藏滚动条 */
.cart-items::-webkit-scrollbar {
  display: none;
}

.cart-items {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>