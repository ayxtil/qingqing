// 数据管理工具

// 从data.js中导入菜品数据获取函数
import { getAllDishes, initializeDataFromFeishu } from './data.js'
// 从feishuApi.js中导入获取表格更新时间的函数
import { getFeishuTableUpdateTime } from './feishuApi.js'

// 存储上次更新时间
let lastUpdateTime = null

/**
 * 加载菜品数据
 * @returns {Promise<Array>} 菜品数据数组
 */
export const loadDishData = async () => {
  console.log('开始加载菜品数据...')
  // 确保数据已经加载完成
  await initializeDataFromFeishu()
  const dishes = getAllDishes()
  console.log('返回菜品数据，共', dishes.length, '条')
  // 更新上次更新时间
  const currentUpdateTime = await getFeishuTableUpdateTime()
  if (currentUpdateTime) {
    lastUpdateTime = currentUpdateTime
  }
  return dishes
}

/**
 * 检查飞书表格是否更新
 * @returns {Promise<boolean>} 是否有更新
 */
export const checkForUpdates = async () => {
  console.log('======== 检查飞书表格更新 ========')
  try {
    // 获取当前表格更新时间
    console.log('1. 获取当前飞书表格更新时间...')
    const currentUpdateTime = await getFeishuTableUpdateTime()
    
    if (!currentUpdateTime) {
      console.log('2. 无法获取飞书表格更新时间，检查结束')
      console.log('==============================')
      return false
    }
    
    console.log('2. 当前飞书表格更新时间:', currentUpdateTime)
    console.log('3. 上次更新时间:', lastUpdateTime)
    
    // 比较当前时间和上次更新时间
    if (!lastUpdateTime || currentUpdateTime > lastUpdateTime) {
      console.log('4. 检测到飞书表格更新，开始重新加载数据...')
      // 重新初始化数据
      await initializeDataFromFeishu()
      // 更新上次更新时间
      lastUpdateTime = currentUpdateTime
      console.log('5. 数据重新加载完成，上次更新时间已更新为:', lastUpdateTime)
      console.log('==============================')
      return true
    } else {
      console.log('4. 飞书表格未更新，检查结束')
      console.log('==============================')
      return false
    }
  } catch (error) {
    console.error('检查飞书表格更新失败:', error)
    console.log('==============================')
    return false
  }
}

