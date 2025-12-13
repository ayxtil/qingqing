// 测试直接调用扣子工作流API（绕过Vite代理）
// 模拟浏览器环境下的Vue组件调用

const fs = require('fs');
const path = require('path');

// 读取环境变量文件
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, value] = trimmedLine.split('=', 2);
      envVars[key] = value.trim();
    }
  });
  
  return envVars;
}

// 模拟 callCozeWorkflow 函数（修复后版本）
async function callCozeWorkflow(dishName) {
  console.log(`开始调用扣子工作流，菜品名称: ${dishName}`);
  
  // 加载环境变量
  const env = loadEnv();
  const token = env.VITE_COZE_API_KEY;
  const baseUrl = env.VITE_COZE_BASE_URL || 'https://api.coze.cn/';
  
  if (!token) {
    throw new Error('未找到 VITE_COZE_API_KEY 环境变量');
  }
  
  // 工作流配置
  const workflowConfig = {
    workflow_id: '7576228389498798116'
  };
  
  // 构建请求体
  const requestBody = {
    workflow_id: workflowConfig.workflow_id,
    parameters: {
      USER_INPUT: dishName
    }
  };
  
  console.log('请求体:', JSON.stringify(requestBody, null, 2));
  
  // 直接调用 Coze API，绕过 Vite 代理
  const apiUrl = baseUrl + 'v1/workflow/run';
  console.log('直接调用 Coze API，URL:', apiUrl);
  
  // 发送请求
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  console.log('响应状态:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
  }
  
  // 处理 JSON 响应
  const responseData = await response.json();
  console.log('原始响应数据:', JSON.stringify(responseData, null, 2));
  
  // 检查响应是否成功
  if (responseData.code !== 0) {
    throw new Error(`工作流执行失败: ${responseData.msg || '未知错误'}`);
  }
  
  // 提取工作流输出
  if (responseData.data) {
    // 解析 data 字段（它是一个 JSON 字符串）
    const data = JSON.parse(responseData.data);
    console.log('解析后的输出数据:', data);
    
    if (data.output) {
      console.log('工作流返回结果:', data.output);
      return data;
    }
  }
  
  throw new Error('未找到工作流输出结果');
}

// 测试模拟的 handleIconClick 函数
async function handleIconClick(dishName) {
  try {
    console.log('\n开始模拟点击图标，菜品名称:', dishName);
    
    // 调用扣子工作流
    const workflowResult = await callCozeWorkflow(dishName);
    
    // 模拟处理工作流返回结果
    if (workflowResult && workflowResult.output) {
      console.log('\n✅ 工作流调用成功！');
      console.log('📋 返回的菜品数据:');
      workflowResult.output.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item}`);
      });
      
      console.log('\n🎉 模拟显示马卡龙弹窗: "小主，新菜菜已经入库啦！"');
      return true;
    } else {
      console.log('\n❌ 工作流返回结果格式不正确');
      return false;
    }
  } catch (error) {
    console.error('\n❌ 调用工作流失败:', error.message);
    console.error('错误堆栈:', error.stack);
    return false;
  }
}

// 运行测试
async function runTest() {
  console.log('========================================');
  console.log('测试直接调用扣子工作流API（绕过Vite代理）');
  console.log('========================================\n');
  
  // 测试菜品名称
  const testDishName = '佛跳墙';
  
  // 执行测试
  const result = await handleIconClick(testDishName);
  
  console.log('\n========================================');
  console.log('测试结果:', result ? '✅ 成功' : '❌ 失败');
  console.log('========================================');
}

// 运行测试
runTest();
