// 测试扣子工作流API - 最终版本
// 直接测试工作流API调用，使用正确的端点和请求体结构

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

// 测试工作流API调用
async function testWorkflowCall() {
  console.log('开始测试扣子工作流API调用...');
  
  // 加载环境变量
  const env = loadEnv();
  const token = env.VITE_COZE_API_KEY;
  const baseUrl = env.VITE_COZE_BASE_URL;
  
  console.log('环境变量加载成功:');
  console.log('  Token:', token ? '已获取 (长度: ' + token.length + ')' : '未获取');
  console.log('  Base URL:', baseUrl);
  
  if (!token) {
    console.error('错误: 未找到 VITE_COZE_API_KEY 环境变量');
    return;
  }
  
  // 工作流配置
  const workflowConfig = {
    workflow_id: '7576228389498798116'
  };
  
  // 测试菜品名称
  const dishName = '佛跳墙';
  
  // 构建请求体
  const requestBody = {
    workflow_id: workflowConfig.workflow_id,
    parameters: {
      USER_INPUT: dishName
    }
  };
  
  console.log('\n请求详情:');
  console.log('  URL:', baseUrl + 'v1/workflow/run');
  console.log('  请求体:', JSON.stringify(requestBody, null, 2));
  
  try {
    // 发送请求
    const response = await fetch(baseUrl + 'v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('\n响应状态:', response.status, response.statusText);
    
    // 读取响应内容
    const responseText = await response.text();
    console.log('\n原始响应内容:');
    console.log(responseText);
    
    // 尝试解析为JSON（如果是JSON的话）
    try {
      const responseJson = JSON.parse(responseText);
      console.log('\n解析后的JSON响应:');
      console.log(JSON.stringify(responseJson, null, 2));
    } catch (jsonError) {
      console.log('\n响应不是有效的JSON格式，可能是SSE流');
      
      // 尝试解析SSE流
      console.log('\n尝试解析SSE流:');
      const events = responseText.split('\n\n');
      events.forEach((event, index) => {
        if (event.trim()) {
          console.log(`\n事件 ${index + 1}:`);
          event.split('\n').forEach(line => {
            console.log(`  ${line}`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('\n请求失败:', error);
  }
}

// 运行测试
testWorkflowCall();
