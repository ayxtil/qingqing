// 菜品数据管理

// 数据结构定义

/**
 * 菜品分类
 */
export class Category {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dishes = [];
  }
}

/**
 * 食材
 */
export class Ingredient {
  constructor(id, name, category, description) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.dishes = [];
  }
}

/**
 * 菜品
 */
export class Dish {
  constructor(id, name, category, subCategory, ingredients, imageUrl, price, description = '') {
    this.id = id;
    this.name = name;
    this.category = category;
    this.subCategory = subCategory;
    this.ingredients = ingredients;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
}

// 模拟数据

// 一级分类
const categories = [
  new Category('category-001', '主食', '各类主食，包括粥、面食、米饭等'),
  new Category('category-002', '素菜', '各类素菜，包括蔬菜、豆制品等'),
  new Category('category-003', '荤菜', '各类荤菜，包括猪肉、鸡肉、牛肉等'),
  new Category('category-004', '汤', '各类汤品，包括清汤、浓汤等'),
  new Category('category-005', '海鲜', '各类海鲜菜品')
];

// 食材数据
const ingredients = [
  new Ingredient('ingredient-001', '大米', '主食', '主要粮食作物'),
  new Ingredient('ingredient-002', '面粉', '主食', '制作面食的主要原料'),
  new Ingredient('ingredient-003', '白菜', '蔬菜', '常见蔬菜'),
  new Ingredient('ingredient-004', '豆腐', '豆制品', '传统豆制品'),
  new Ingredient('ingredient-005', '猪肉', '肉类', '常见肉类'),
  new Ingredient('ingredient-006', '鸡肉', '肉类', '常见禽类'),
  new Ingredient('ingredient-007', '牛肉', '肉类', '高蛋白肉类'),
  new Ingredient('ingredient-008', '鱼', '海鲜', '常见水产'),
  new Ingredient('ingredient-009', '虾', '海鲜', '高蛋白水产'),
  new Ingredient('ingredient-010', '鸡蛋', '蛋类', '常见蛋类')
];

// 菜品数据
// 从飞书多维表格获取数据
let dishes = [];

// 导入飞书API客户端
import { getFeishuDishes, refreshFeishuDishes } from './feishuApi.js';

// 从飞书API加载数据并初始化
export async function initializeDataFromFeishu() {
  try {
    // 使用 refreshFeishuDishes 强制刷新缓存，获取最新数据
    const feishuDishes = await refreshFeishuDishes();
    // 清空当前数据
    dishes.length = 0;
    // 添加飞书数据
    dishes.push(...feishuDishes);
    // 关联菜品和食材
    linkDishesAndIngredients();
    console.log(`成功从飞书加载 ${dishes.length} 道菜品`);
  } catch (error) {
    console.error('从飞书加载数据失败:', error);
  }
}

// 关联菜品和食材
function linkDishesAndIngredients() {
  dishes.forEach(dish => {
    dish.ingredients.forEach(ingredientName => {
      const ingredient = ingredients.find(i => i.name === ingredientName);
      if (ingredient && !ingredient.dishes.includes(dish.id)) {
        ingredient.dishes.push(dish.id);
      }
    });
  });
}

// 初始化数据
initializeDataFromFeishu();

// 数据操作方法

/**
 * 获取所有菜品
 */
export function getAllDishes() {
  return [...dishes];
}

/**
 * 根据分类获取菜品
 * @param {string} categoryName - 分类名称
 */
export function getDishesByCategory(categoryName) {
  return dishes.filter(dish => dish.category === categoryName);
}

/**
 * 根据食材获取菜品
 * @param {string} ingredientName - 食材名称
 */
export function getDishesByIngredient(ingredientName) {
  const ingredient = ingredients.find(i => i.name === ingredientName);
  if (ingredient) {
    return dishes.filter(dish => ingredient.dishes.includes(dish.id));
  }
  return [];
}

/**
 * 根据朝代获取菜品
 * @param {string} era - 朝代
 */
export function getDishesByEra(era) {
  return dishes.filter(dish => dish.era === era);
}

/**
 * 获取已解锁菜品
 */
export function getUnlockedDishes() {
  return dishes.filter(dish => dish.isUnlocked);
}

/**
 * 根据朝代获取已解锁菜品
 * @param {string} era - 朝代
 */
export function getUnlockedDishesByEra(era) {
  return dishes.filter(dish => dish.era === era && dish.isUnlocked);
}

/**
 * 根据ID获取菜品
 * @param {string} dishId - 菜品ID
 */
export function getDishById(dishId) {
  return dishes.find(dish => dish.id === dishId);
}

/**
 * 解锁菜品
 * @param {string} dishId - 菜品ID
 */
export function unlockDish(dishId) {
  const dish = getDishById(dishId);
  if (dish) {
    dish.isUnlocked = true;
    return true;
  }
  return false;
}

/**
 * 搜索菜品
 * @param {string} query - 搜索关键词
 */
export function searchDishes(query) {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return dishes.filter(dish => 
    (dish.name && dish.name.toLowerCase().includes(lowerQuery)) ||
    (dish.description && dish.description.toLowerCase().includes(lowerQuery)) ||
    (dish.ingredients && dish.ingredients.some(ingredient => ingredient && ingredient.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * 获取所有食材
 */
export function getAllIngredients() {
  return [...ingredients];
}

/**
 * 根据分类获取食材
 * @param {string} category - 食材分类
 */
export function getIngredientsByCategory(category) {
  return ingredients.filter(ingredient => ingredient.category === category);
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
  return [...categories];
}

/**
 * 添加菜品
 * @param {Object} dishData - 菜品数据对象
 */
export function addDish(dishData) {
  try {
    // 检查菜品是否已存在（根据名称去重）
    const existingDish = dishes.find(d => d.name === dishData.name);
    if (existingDish) {
      console.log('菜品已存在，跳过:', dishData.name);
      return false;
    }
    
    // 生成唯一 ID
    const newId = `dish-${String(dishes.length + 1).padStart(3, '0')}`;
    
    // 处理图片URL，确保是字符串
    let imageUrl = dishData.imageUrl || '';
    
    // 确保imageUrl是字符串，处理可能的URL对象
    if (typeof imageUrl === 'object' && imageUrl !== null) {
      if (imageUrl.link) {
        // 处理 {"link":"url","text":"url"} 格式
        imageUrl = imageUrl.link;
      } else if (imageUrl.url) {
        imageUrl = imageUrl.url;
      } else if (imageUrl.uri) {
        imageUrl = imageUrl.uri;
      } else {
        // 其他对象类型，尝试提取URL
        const urlStr = JSON.stringify(imageUrl);
        const urlMatch = urlStr.match(/https?:\/\/[^"\'\s\}]+/);
        imageUrl = urlMatch ? urlMatch[0] : '';
      }
    }
    
    // 创建新的 Dish 实例
    const newDish = new Dish(newId, dishData.name, dishData.category, dishData.subCategory, dishData.ingredients || [dishData.subCategory], imageUrl, dishData.price || '一个亲亲');
    
    // 确保图片URL是字符串
    newDish.imageUrl = String(newDish.imageUrl);
    
    // 添加到 dishes 数组
    dishes.push(newDish);
    console.log('成功添加菜品:', newDish);
    
    // 更新食材关联
    linkDishesAndIngredients();
    
    return true;
  } catch (error) {
    console.error('添加菜品失败:', error);
    return false;
  }
}

/**
 * 批量添加菜品
 * @param {Array} dishDataArray - 菜品数据对象数组
 */
export function addDishes(dishDataArray) {
  let addedCount = 0;
  
  for (const dishData of dishDataArray) {
    if (addDish(dishData)) {
      addedCount++;
    }
  }
  
  console.log(`批量添加完成，共添加 ${addedCount} 道菜品`);
  return addedCount;
}