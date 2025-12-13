// 扣子智能体API服务 - 完全重建版本
// 基于用户提供的curl示例和SDK示例

// 配置信息
const COZE_CONFIG = {
  // API基础URL - 使用Vite代理，避免CORS问题
  API_BASE_URL: '/api/coze/',
  // 聊天API端点 - 参考Coze API文档（使用v3版本）
  CHAT_API: 'v3/chat',
  // 智能体ID - 参考curl和SDK示例
  BOT_ID: '7581380091134410802',
  // API版本
  VERSION: '2024-07-01'
}

/**
 * 获取Bearer Token
 * 从环境变量获取，动态获取正确的token
 * @returns {Promise<string>} Bearer Token
 */
export const getBearerToken = async () => {
  try {
    // 从环境变量获取Coze API密钥
    const token = import.meta.env.VITE_COZE_API_KEY;
    
    // 检查token是否有效
    if (!token || !token.trim()) {
      throw new Error('Coze API密钥未配置，请在.env文件中设置VITE_COZE_API_KEY');
    }
    
    return token;
  } catch (error) {
    console.error('获取Bearer Token失败:', error);
    throw error;
  }
}

/**
 * 处理流式响应的辅助函数
 */
const handleStream = async (response, onMessage, onComplete) => {
  // 单独保存纯净的回复内容，避免被其他事件覆盖
  let pureResponseContent = ''
  
  const reader = response.body.getReader()
  let buffer = ''
  let currentEventType = null
  
  // 辅助函数：清理回复内容，移除多余的系统信息
  function cleanResponseContent(content) {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    console.log('原始content内容:', content);
    
    // 直接检查是否是JSON格式的系统事件
    if (content.includes('msg_type') || content.includes('from_module') || content.includes('from_unit')) {
      console.log('检测到系统事件JSON，返回空字符串');
      return '';
    }
    
    let cleaned = content;
    
    // 1. 首先移除回复前后的引号（如果有）
    cleaned = cleaned.replace(/^\"|\"$/g, '');
    
    // 2. 寻找第一个中文字符的位置
    const firstChineseIndex = cleaned.search(/[\u4e00-\u9fa5]/);
    
    if (firstChineseIndex !== -1) {
      // 如果找到中文，截取从第一个中文到结尾的内容
      cleaned = cleaned.slice(firstChineseIndex);
      
      // 3. 移除末尾的系统信息，如 ,"from_module":null,"from_unit":null}
      // 使用正则表达式找到系统信息的开始位置
      const sysInfoRegex = /(,\"[a-zA-Z_]+\"|,from_module|,from_unit|\}\s*$)/;
      const match = cleaned.match(sysInfoRegex);
      if (match && match.index !== -1) {
        // 如果找到系统信息，截取从开头到系统信息开始位置的内容
        cleaned = cleaned.slice(0, match.index);
      }
      
      // 4. 移除所有JSON格式的系统信息（如果还有的话）
      cleaned = cleaned.replace(/\{[\s\S]*?\}|\[[\s\S]*?\]/g, '');
    }
    
    // 5. 移除多余的空格和换行
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // 6. 移除末尾的分号和其他多余字符
    cleaned = cleaned.replace(/;+$/, '').trim();
    
    console.log('清理后的content内容:', cleaned);
    
    return cleaned;
  }
  
  // 处理事件数据的辅助函数
  function processBuffer(dataStr, eventType) {
    if (!dataStr) return
    
    console.log('处理完整数据:', dataStr)
    console.log('事件类型:', eventType)
    
    // 只处理真正的回复内容，忽略其他系统事件
    if (eventType !== 'generate_answer_finish' && eventType !== 'conversation.message.completed') {
      // 跳过其他系统事件，如created、in_progress、failed等
      console.log('跳过系统事件:', eventType)
      return
    }
    
    if (dataStr === '[DONE]') {
      console.log('收到结束信号')
      // 检查是否有有效的回复内容，如果没有则添加默认回复
      if (!pureResponseContent || !pureResponseContent.trim()) {
        pureResponseContent = '抱歉，暂时无法获取小膳子的回复。请稍后再试，或者尝试使用其他问题。';
      }
      if (onComplete) {
        // 只传递包含content字段的对象，使用单独保存的pureResponseContent
        onComplete({ content: pureResponseContent });
      }
      return
    }
    
    try {
      const data = JSON.parse(dataStr)
      console.log('解析后的数据:', data)
      
      // 尝试从不同的字段中提取回复内容，不限制事件类型
      let responseContent = '';
      
      // 情况1: 响应直接包含content字段
      if (data.content && typeof data.content === 'string') {
        responseContent = data.content;
        console.log('从data.content字段获取到内容:', responseContent);
      }
      // 情况2: 响应包含data字段，data字段是JSON字符串
      else if (data.data && typeof data.data === 'string') {
        try {
          const dataObj = JSON.parse(data.data);
          // 检查dataObj中是否有content或其他包含回复内容的字段
          if (dataObj.content) {
            responseContent = dataObj.content;
            console.log('从data.data.content字段获取到内容:', responseContent);
          } else if (dataObj.FinData) {
            responseContent = dataObj.FinData;
            console.log('从data.data.FinData字段获取到内容:', responseContent);
          } else {
            console.log('data.data对象中没有找到有效的回复内容:', dataObj);
            // 检查是否有finish_reason
            if (dataObj.finish_reason === 0) {
              console.log('API返回finish_reason=0，表示正常结束但无内容');
            }
          }
        } catch (e) {
          console.error('解析data字段失败:', e);
          responseContent = data.data;
        }
      }
      // 情况3: 响应包含data字段，data字段是对象
      else if (data.data && typeof data.data === 'object') {
        if (data.data.content) {
          responseContent = data.data.content;
          console.log('从data.data.content字段获取到内容:', responseContent);
        } else if (data.data.FinData) {
          responseContent = data.data.FinData;
          console.log('从data.data.FinData字段获取到内容:', responseContent);
        } else {
          console.log('data.data对象中没有找到有效的回复内容:', data.data);
        }
      }
      
      // 情况4: 检查eventType是否为generate_answer_finish
      if (eventType === 'generate_answer_finish') {
        console.log('收到generate_answer_finish事件:', data);
        // 如果还没有找到回复内容，尝试从data字段中提取
        if (!responseContent) {
          // 检查是否有data.data字段
          if (data.data) {
            if (typeof data.data === 'string') {
              try {
                const dataObj = JSON.parse(data.data);
                if (dataObj.FinData) {
                  responseContent = dataObj.FinData;
                  console.log('从generate_answer_finish的data.FinData获取到内容:', responseContent);
                }
              } catch (e) {
                console.error('解析generate_answer_finish的data字段失败:', e);
              }
            } else if (typeof data.data === 'object') {
              if (data.data.FinData) {
                responseContent = data.data.FinData;
                console.log('从generate_answer_finish的data.data.FinData获取到内容:', responseContent);
              }
            }
          }
        }
      }
      
      // 情况5: 检查是否有其他可能包含回复内容的字段
      if (!responseContent) {
        console.log('响应中没有找到有效的content或data字段:', data);
      }
      
      // 如果找到回复内容，清理并显示
      if (responseContent) {
        // 清理回复内容，移除多余的系统信息
        const cleanedContent = cleanResponseContent(responseContent);
        
        // 单独保存纯净的回复内容，避免被其他事件覆盖
        pureResponseContent = cleanedContent;
        
        // 只在内容有效时调用onMessage
        if (cleanedContent) {
          console.log('获取到纯净回复内容:', cleanedContent);
          onMessage(cleanedContent);
        }
      }
    } catch (error) {
      console.error('解析流式数据失败:', error)
      console.error('失败数据:', dataStr)
    }
  }
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        console.log('响应结束')
        // 检查是否有有效的回复内容，如果没有则添加默认回复
        if (!pureResponseContent || !pureResponseContent.trim()) {
          pureResponseContent = '抱歉，暂时无法获取小膳子的回复。请稍后再试，或者尝试使用其他问题。';
        }
        if (onComplete) {
          // 只传递包含content字段的对象，使用单独保存的pureResponseContent
          onComplete({ content: pureResponseContent });
        }
        return
      }
      
      // 将Uint8Array转换为字符串
      const chunk = new TextDecoder().decode(value)
      console.log('收到原始数据:', chunk)
      
      // 处理收到的数据
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = ''
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (!trimmedLine) {
          // 空行表示一个事件的结束，处理当前事件
          processBuffer(buffer, currentEventType)
          currentEventType = null
          buffer = ''
          continue
        }
        
        if (trimmedLine.startsWith('event:')) {
          // 事件类型行
          currentEventType = trimmedLine.slice(6).trim()
          console.log('事件类型:', currentEventType)
        } else if (trimmedLine.startsWith('data:')) {
          // 数据内容行
          const dataPart = trimmedLine.slice(5).trim()
          buffer += dataPart
        }
      }
    }
  } catch (error) {
    console.error('处理流式响应失败:', error)
    // 如果发生错误，也调用onComplete回调，传递错误信息
    if (onComplete) {
      onComplete({ content: '', error: error.message });
    }
  } finally {
    reader.releaseLock()
    // 移除finally块中的onComplete调用，避免重复调用
  }
}

/**
 * 获取完整的API URL
 * @param {string} endpoint - API端点
 * @returns {string} 完整URL
 */
const getFullUrl = (endpoint) => {
  return `${COZE_CONFIG.API_BASE_URL}${endpoint}`
}

/**
 * 构建消息对象
 * @param {string} content - 消息内容
 * @param {string} role - 角色（user/assistant）
 * @param {string} content_type - 内容类型（text/image/file）
 * @param {string} type - 消息类型（question/answer）
 * @returns {Object} 消息对象
 */
const buildMessage = (content, role, content_type = 'text', type = 'question') => {
  return {
    content: content,
    content_type: content_type,
    role: role,
    type: type
  }
}

/**
 * 移除重复的回复内容
 * @param {string} content - 原始回复内容
 * @returns {string} 去重后的回复内容
 */
const removeDuplicateText = (content) => {
  // 简单的去重逻辑，实际应用中可以根据需要调整
  return content
}

/**
 * 调用扣子智能体聊天API (流式)
 * @param {Array} messages - 消息列表
 * @param {Object} options - 选项
 * @param {string} options.user_id - 用户ID
 * @param {Function} options.onMessage - 消息接收回调
 * @param {Function} options.onComplete - 完成回调
 * @returns {Promise<Object>} 完整响应
 */
export const callCozeChatStream = async (messages, options = {}) => {
  try {
    const { 
      user_id = `user_${Date.now()}`,
      onMessage = () => {},
      onComplete = () => {}
    } = options
    
    // 获取动态Bearer Token
    const token = await getBearerToken();
    
    // 检查token是否有效
    if (!token || !token.trim()) {
      throw new Error('无效的Coze API密钥');
    }
    
    // 构建请求体，使用Coze API预期的additional_messages参数名
    const requestBody = {
      bot_id: COZE_CONFIG.BOT_ID,
      user_id: user_id,
      stream: true,
      additional_messages: messages
    }
    
    console.log('扣子智能体API请求:', {
      url: getFullUrl(COZE_CONFIG.CHAT_API),
      requestBody: requestBody
    })
    
    // 发送请求
    const response = await fetch(getFullUrl(COZE_CONFIG.CHAT_API), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('API响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API调用失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`)
    }
    
    // 处理流式响应
    return await handleStream(response, onMessage, onComplete)
  } catch (error) {
    console.error('调用扣子智能体API失败:', error)
    throw error
  }
}

/**
 * 调用扣子智能体聊天API (非流式) - 使用v3版本
 * @param {Array} messages - 消息列表
 * @param {Object} options - 选项
 * @param {string} options.user_id - 用户ID
 * @returns {Promise<Object>} 完整响应
 */
export const callCozeChat = async (messages, options = {}) => {
  try {
    const { user_id = `user_${Date.now()}` } = options
    
    // 获取动态Bearer Token
    const token = await getBearerToken();
    
    // 检查token是否有效
    if (!token || !token.trim()) {
      throw new Error('无效的Coze API密钥');
    }
    
    // 构建请求体，使用Coze API预期的additional_messages参数名
    const requestBody = {
      bot_id: COZE_CONFIG.BOT_ID,
      user_id: user_id,
      stream: false, // 非流式
      additional_messages: messages
    }
    
    const apiUrl = getFullUrl(COZE_CONFIG.CHAT_API)
    console.log('扣子智能体API请求 (非流式):', {
      url: apiUrl,
      requestBody: requestBody
    })
    
    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('API响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API调用失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`)
    }
    
    // 处理完整响应
    const data = await response.json()
    console.log('完整响应（详细）:', JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error('调用扣子智能体API失败:', error)
    throw error
  }
}

/**
 * 发送单条消息并获取响应 (流式)
 * @param {string} content - 消息内容
 * @param {Object} options - 选项
 * @param {string} options.user_id - 用户ID
 * @param {Function} options.onMessage - 消息接收回调
 * @param {Function} options.onComplete - 完成回调
 * @returns {Promise<Object>} 完整响应
 */
export const sendMessage = async (content, options = {}) => {
  const { user_id = `user_${Date.now()}` } = options
  
  // 构建单条用户消息
  const messages = [
    buildMessage(content, 'user', 'text', 'question')
  ]
  
  // 调用流式API
  return await callCozeChatStream(messages, options)
}