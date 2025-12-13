// 数据管理工具

// 从data.js中导入菜品数据
import { dishes } from './data.js'

/**
 * 加载菜品数据
 * @returns {Promise<Array>} 菜品数据数组
 */
export const loadDishData = async () => {
  console.log('开始加载菜品数据...')
  return dishes
}

