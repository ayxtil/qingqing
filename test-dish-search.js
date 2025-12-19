// 模拟发送"虾饺"请求的测试脚本
// 用于展示收到的回复和处理后的信息

import { callCozeChatStream, getBearerToken } from './src/utils/cozeApi.js';

// 定义调用Coze工作流的函数
async function callCozeWorkflow(dishName) {
  const maxRetries = 3;
  const retryDelay = 1500;
  
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      // 获取Bearer Token
      const token = await getBearerToken();
      
      // 检查token是否有效
      if (!token || !token.trim()) {
        throw new Error('无效的Coze API密钥');
      }
      
      // 扣子工作流API配置
      const workflowConfig = {
        app_id: '7576179078697386018',
        workflow_id: '7576228389498798116'
      };
      
      // 构建请求体
      const requestBody = {
        workflow_id: workflowConfig.workflow_id,
        parameters: {
          USER_INPUT: dishName
        }
      };
      
      console.log(`调用扣子工作流 (第${retry + 1}次尝试)，发送请求:`, requestBody);
      
      // 直接使用环境变量中的 API 地址，绕过 Vite 代理
      const baseUrl = 'https://api.coze.cn/';
      const apiUrl = baseUrl + 'v1/workflow/run';
      
      console.log('直接调用 Coze API，URL:', apiUrl);
      
      // 发送请求到扣子工作流API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      // 处理 JSON 响应，提取工作流结果
      const responseData = await response.json();
      
      console.log('扣子工作流API响应:', JSON.stringify(responseData, null, 2));
      
      // 检查响应是否成功
      if (responseData.code !== 0) {
        throw new Error(`工作流执行失败: ${responseData.msg || '未知错误'}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`调用扣子工作流失败 (第${retry + 1}次尝试):`, error);
      
      // 如果是最后一次尝试，抛出错误
      if (retry === maxRetries - 1) {
        throw error;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// 模拟响应数据
const mockResponse = {
  code: 0,
  msg: "success",
  data: JSON.stringify({
    output: JSON.stringify({
      dish_name: "虾饺",
      category: "点心",
      recipe: {
        ingredients: ["鲜虾", "猪肉馅", "面粉", "澄面", "淀粉", "葱", "姜", "盐", "糖", "料酒", "生抽", "香油"],
        steps: [
          "1. 鲜虾去壳去虾线，洗净沥干水分",
          "2. 将鲜虾剁成虾泥，加入猪肉馅、葱姜末、盐、糖、料酒、生抽、香油搅拌均匀",
          "3. 面粉、澄面、淀粉混合，加入沸水揉成面团，醒面30分钟",
          "4. 面团分成小剂子，擀成薄皮",
          "5. 包入馅料，捏成虾饺形状",
          "6. 蒸锅水开后，放入虾饺蒸8-10分钟即可"
        ],
        prep_time: "30分钟",
        cook_time: "10分钟",
        servings: "4人份"
      },
      nutrition: {
        calories: "250大卡/100克",
        protein: "15克",
        fat: "10克",
        carbohydrates: "25克"
      },
      taste: "鲜美可口，皮薄馅大，晶莹剔透"
    })
  })
};

async function testDishSearch() {
  const dishName = "虾饺";
  console.log(`=== 开始测试发送请求: ${dishName} ===`);
  
  try {
    // 调用Coze工作流API
    console.log("1. 调用Coze工作流API...");
    let response;
    
    try {
      // 尝试调用真实API
      response = await callCozeWorkflow(dishName);
      console.log("\n2. 收到的真实API回复:");
    } catch (apiError) {
      // API调用失败，使用模拟数据
      console.log("\n2. API调用失败，使用模拟数据:");
      console.log("错误信息:", apiError.message);
      response = mockResponse;
    }
    
    console.log(JSON.stringify(response, null, 2));
    
    // 处理回复数据
    console.log("\n3. 处理后的信息:");
    if (response && response.data) {
      console.log(`- 菜品名称: ${dishName}`);
      console.log(`- 响应代码: ${response.code}`);
      console.log(`- 响应消息: ${response.msg}`);
      
      // 尝试解析data字段为JSON
      try {
        const dataJson = JSON.parse(response.data);
        console.log("\n4. 解析后的data字段:");
        console.log(JSON.stringify(dataJson, null, 2));
        
        // 提取工作流输出
        if (dataJson.output) {
          console.log("\n5. 工作流输出:");
          console.log(dataJson.output);
          
          // 尝试进一步解析输出
          try {
            const outputJson = JSON.parse(dataJson.output);
            console.log("\n6. 解析后的输出JSON:");
            console.log(JSON.stringify(outputJson, null, 2));
            
            // 提取关键信息
            console.log("\n7. 提取的关键信息:");
            if (outputJson.dish_name) console.log(`- 菜品名称: ${outputJson.dish_name}`);
            if (outputJson.category) console.log(`- 菜品分类: ${outputJson.category}`);
            if (outputJson.recipe) {
              if (outputJson.recipe.ingredients) console.log(`- 主要食材: ${outputJson.recipe.ingredients.slice(0, 5).join(', ')}${outputJson.recipe.ingredients.length > 5 ? '...' : ''}`);
              if (outputJson.recipe.steps) console.log(`- 烹饪步骤: ${outputJson.recipe.steps.length} 步`);
              if (outputJson.recipe.prep_time) console.log(`- 准备时间: ${outputJson.recipe.prep_time}`);
              if (outputJson.recipe.cook_time) console.log(`- 烹饪时间: ${outputJson.recipe.cook_time}`);
            }
            if (outputJson.nutrition) console.log(`- 热量: ${outputJson.nutrition.calories}`);
            if (outputJson.taste) console.log(`- 口味: ${outputJson.taste}`);
          } catch (parseError) {
            console.log("\n6. 输出不是JSON格式，直接显示:");
            console.log(dataJson.output);
          }
        }
      } catch (parseError) {
        console.log("\n4. data字段不是JSON格式:");
        console.log(response.data);
      }
    } else {
      console.log("未收到有效的工作流响应");
    }
    
    console.log(`\n=== 测试完成: ${dishName} ===`);
  } catch (error) {
    console.error("\n测试失败:", error);
    console.log(`\n=== 测试失败: ${dishName} ===`);
  }
}

// 执行测试
testDishSearch();