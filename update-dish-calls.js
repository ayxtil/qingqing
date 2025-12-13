import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取data.js文件
const dataFilePath = path.join(__dirname, 'src', 'utils', 'data.js');

async function updateDishCalls() {
  try {
    let content = await fs.readFile(dataFilePath, 'utf8');

    // 正则表达式匹配new Dish()调用
    const dishRegex = /new Dish\(([\s\S]*?)\)/g;

    // 替换所有匹配项
    content = content.replace(dishRegex, (match, args) => {
      // 将参数拆分为数组
      const argsArray = args.split(',').map(arg => arg.trim());
      
      // 保留需要的字段：id, name, category, subCategory, ingredients, imageUrl, price
      // 原始顺序：id, name, category, subCategory, ingredients, description, imageUrl, price, era, isUnlocked
      // 新顺序：id, name, category, subCategory, ingredients, imageUrl, price
      const newArgs = [
        argsArray[0], // id
        argsArray[1], // name
        argsArray[2], // category
        argsArray[3], // subCategory
        argsArray[4], // ingredients
        argsArray[6], // imageUrl (跳过了description)
        argsArray[7]  // price (跳过了era, isUnlocked)
      ];
      
      // 重新组合为new Dish()调用
      return `new Dish(${newArgs.join(', ')})`;
    });

    // 保存修改后的文件
    await fs.writeFile(dataFilePath, content, 'utf8');

    console.log('✅ 已更新所有new Dish()调用，删除了多余字段');
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
  }
}

updateDishCalls();
