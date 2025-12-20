// 飞书API客户端

// 飞书API配置
const FEISHU_CONFIG = {
  baseUrl: '/api/feishu/open-apis', // 使用Vite配置的代理URL，包含完整的/api/feishu前缀和/open-apis后缀
  appId: 'cli_a9ae903f207bdbcb',
  appSecret: 'DLR7udnlQ8uDfyU9DPNhVeV1F6xKZoLs',
  // 菜肴数据表格配置
  dishes: {
    appToken: 'V5CFbM5fZaCJRBsviBucYxnxnEe', // baseId
    tableId: 'tblg1qsIFjb2tazd'
  },
  // 订单数据表格配置（小主旨意）
  orders: {
    appToken: 'V5CFbM5fZaCJRBsviBucYxnxnEe', // baseId
    tableId: 'tbltx7SbCt4HwzzO',
    viewId: 'veweKgyGVi'
  }
};

// 缓存配置
const CACHE_CONFIG = {
  key: 'qingqing_feishu_dishes',
  expire: 24 * 60 * 60 * 1000 // 24小时
};

/**
 * 获取飞书API访问令牌
 * @returns {Promise<string>} 访问令牌
 */
export async function getFeishuAccessToken() {
  try {
    const url = `${FEISHU_CONFIG.baseUrl}/auth/v3/tenant_access_token/internal`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/24.11.1'
      },
      body: JSON.stringify({
        app_id: FEISHU_CONFIG.appId,
        app_secret: FEISHU_CONFIG.appSecret
      })
    });

    // 先将Response对象的body stream读取为文本
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`获取飞书访问令牌失败: ${response.status} - ${responseText}`);
    }

    // 手动解析JSON，避免重复读取body stream
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('解析飞书API响应JSON失败:', parseError);
      throw new Error(`解析飞书API响应JSON失败: ${parseError.message} - 原始响应: ${responseText}`);
    }
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg}`);
    }

    return data.tenant_access_token;
  } catch (error) {
    console.error('获取飞书访问令牌错误:', error);
    throw error;
  }
}

/**
 * 获取飞书多维表格数据
 * @param {string} accessToken - 访问令牌
 * @param {string} tableType - 表格类型（'dishes'或'orders'）
 * @returns {Promise<Array>} 表格数据
 */
export async function getFeishuTableData(accessToken, tableType = 'dishes') {
  try {
    // 根据表格类型获取对应的配置
    const tableConfig = FEISHU_CONFIG[tableType];
    if (!tableConfig) {
      throw new Error(`未知的表格类型: ${tableType}`);
    }
    
    const url = `${FEISHU_CONFIG.baseUrl}/bitable/v1/apps/${tableConfig.appToken}/tables/${tableConfig.tableId}/records`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/24.11.1'
      }
    });

    // 先将Response对象的body stream读取为文本
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`获取飞书表格数据失败: ${response.status} - ${responseText}`);
    }

    // 手动解析JSON，避免重复读取body stream
    let data;
    try {
      data = JSON.parse(responseText);
      console.log(`getFeishuTableData API响应 (${tableType}):`, JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('解析飞书API响应JSON失败:', parseError);
      throw new Error(`解析飞书API响应JSON失败: ${parseError.message} - 原始响应: ${responseText}`);
    }
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg}`);
    }

    // 检查响应中是否有records或items字段
    if (data.data.records) {
      return data.data.records;
    } else if (data.data.items) {
      return data.data.items;
    } else {
      throw new Error('飞书API响应中没有找到记录数据');
    }
  } catch (error) {
    console.error('获取飞书表格数据错误:', error);
    throw error;
  }
}

/**
 * 将飞书表格数据转换为Dish对象数据
 * @param {Array} tableItems - 飞书表格数据项
 * @returns {Array} Dish对象数据数组
 */
export function convertFeishuDataToDishData(tableItems) {
  return tableItems.map((item, index) => {
    const fields = item.fields;
    
    // 处理图片URL，确保是字符串
    let imageUrl = fields['url'] || '';
    
    // 确保imageUrl是字符串，无论输入是什么
    try {
      // 首先尝试将任何类型转换为字符串
      if (typeof imageUrl !== 'string') {
        console.log('检测到非字符串URL:', imageUrl, '类型:', typeof imageUrl);
        
        // 特殊处理对象类型
        if (imageUrl && typeof imageUrl === 'object') {
          // 尝试各种可能的URL提取方式
          if (imageUrl.link) {
            // 处理 {"link":"url","text":"url"} 格式
            imageUrl = imageUrl.link;
          } else if (imageUrl.url) {
            imageUrl = imageUrl.url;
          } else if (imageUrl.uri) {
            imageUrl = imageUrl.uri;
          } else if (Array.isArray(imageUrl)) {
            // 处理数组情况
            const firstItem = imageUrl[0];
            if (firstItem && typeof firstItem === 'object') {
              imageUrl = firstItem.link || firstItem.url || firstItem.uri || '';
            } else if (firstItem) {
              imageUrl = String(firstItem);
            } else {
              imageUrl = '';
            }
          } else {
            // 其他对象类型，转换为字符串
            imageUrl = JSON.stringify(imageUrl);
            // 尝试从字符串中提取URL
            const urlMatch = imageUrl.match(/https?:\/\/[^"\'\s\}]+/);
            if (urlMatch) {
              imageUrl = urlMatch[0];
            } else {
              imageUrl = '';
            }
          }
        } else {
          // 非对象类型，直接转换为字符串
          imageUrl = String(imageUrl);
        }
      }
      
      // 清理URL
      if (imageUrl) {
        // 移除可能的引号
        imageUrl = imageUrl.replace(/^["\']|["\']$/g, '');
        // 确保URL格式正确
        if (!imageUrl.startsWith('http')) {
          console.error('无效的URL格式，已重置为空:', imageUrl);
          imageUrl = '';
        }
      }
    } catch (error) {
      console.error('处理URL时发生错误:', error);
      imageUrl = '';
    }
    
    return {
      id: `dish-${String(index + 1).padStart(4, '0')}`,
      name: fields['菜肴名称'] || '',
      category: fields['一级分类'] || '',
      subCategory: fields['二级分类'] || '',
      ingredients: [fields['二级分类'] || ''],
      imageUrl: imageUrl,
      price: '一个亲亲'
    };
  });
}

/**
 * 从缓存获取数据
 * @returns {Array|null} 缓存的数据
 */
export function getCachedDishes() {
  try {
    const cached = localStorage.getItem(CACHE_CONFIG.key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // 检查缓存是否过期
    if (now - timestamp > CACHE_CONFIG.expire) {
      localStorage.removeItem(CACHE_CONFIG.key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('从缓存获取数据错误:', error);
    localStorage.removeItem(CACHE_CONFIG.key);
    return null;
  }
}

/**
 * 缓存数据
 * @param {Array} dishes - 要缓存的菜肴数据
 */
export function cacheDishes(dishes) {
  try {
    const cacheData = {
      data: dishes,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_CONFIG.key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('缓存数据错误:', error);
  }
}

/**
 * 获取飞书菜肴数据（带缓存机制）
 * @returns {Promise<Array>} 菜肴数据数组
 */
export async function getFeishuDishes() {
  // 先尝试从缓存获取数据
  const cachedDishes = getCachedDishes();
  if (cachedDishes) {
    console.log('使用缓存的菜肴数据');
    return cachedDishes;
  }
  
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 获取表格数据
    const tableData = await getFeishuTableData(accessToken);
    
    // 转换为Dish对象数据
    const dishData = convertFeishuDataToDishData(tableData);
    
    // 缓存数据
    cacheDishes(dishData);
    
    console.log(`从飞书获取 ${dishData.length} 条菜肴数据`);
    return dishData;
  } catch (error) {
    console.error('获取飞书菜肴数据错误:', error);
    return [];
  }
}

/**
 * 获取飞书表格的最近修改时间
 * @returns {Promise<string>} 最近修改时间，格式为ISO字符串
 */
export async function getFeishuTableUpdateTime() {
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 直接调用getFeishuTableData，不使用缓存，确保获取最新数据
    console.log('获取最新的飞书表格数据...');
    const tableData = await getFeishuTableData(accessToken);
    
    if (!tableData || tableData.length === 0) {
      console.log('飞书表格没有数据');
      return null;
    }
    
    // 找出最新的update_time
    let latestUpdateTime = '';
    for (const record of tableData) {
      if (record.update_time && record.update_time > latestUpdateTime) {
        latestUpdateTime = record.update_time;
      }
    }
    
    console.log(`飞书表格最近修改时间: ${latestUpdateTime}`);
    return latestUpdateTime;
  } catch (error) {
    console.error('获取飞书表格最近修改时间错误:', error);
    return null;
  }
}

/**
 * 向飞书表格添加记录
 * @param {Object} recordData - 要添加的记录数据
 * @returns {Promise<Object>} 添加结果
 */
export async function addFeishuRecord(recordData) {
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 构建请求体，根据飞书API文档，URL字段需要特殊格式
    // 飞书API的URL字段需要是一个包含link和text属性的对象
    const requestBody = {
      fields: {
        '一级分类': recordData.category || '',
        '二级分类': recordData.subCategory || '',
        '菜肴名称': recordData.name || '',
        'url': {
          link: recordData.imageUrl || '',
          text: recordData.name || '无标题'
        }
      }
    };
    
    console.log('飞书API请求URL:', `${FEISHU_CONFIG.baseUrl}/bitable/v1/apps/${FEISHU_CONFIG.dishes.appToken}/tables/${FEISHU_CONFIG.dishes.tableId}/records`);
    console.log('飞书API请求头:', {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Node.js/24.11.1'
    });
    console.log('飞书API请求体:', JSON.stringify(requestBody, null, 2));
    
    // 发送请求 - 使用单条记录创建接口
    // 使用菜肴数据表格的配置
    const url = `${FEISHU_CONFIG.baseUrl}/bitable/v1/apps/${FEISHU_CONFIG.dishes.appToken}/tables/${FEISHU_CONFIG.dishes.tableId}/records`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/24.11.1'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 添加详细的错误日志
    const responseText = await response.text();
    console.log('飞书API响应状态:', response.status);
    console.log('飞书API响应内容:', responseText);
    
    if (!response.ok) {
      throw new Error(`添加飞书记录失败: ${response.status} - ${responseText}`);
    }
    
    // 手动解析JSON，避免重复读取body stream
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('飞书API响应JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('解析飞书API响应JSON失败:', parseError);
      throw new Error(`解析飞书API响应JSON失败: ${parseError.message} - 原始响应: ${responseText}`);
    }
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg} - 请求ID: ${data.request_id || '未知'}`);
    }
    
    console.log('成功向飞书表格添加记录:', data);
    return data;
  } catch (error) {
    console.error('向飞书表格添加记录失败:', error);
    throw error;
  }
}

/**
 * 刷新飞书菜肴数据
 * @returns {Promise<Array>} 刷新后的菜肴数据
 */
export async function refreshFeishuDishes() {
  // 清除缓存
  localStorage.removeItem(CACHE_CONFIG.key);
  
  // 重新获取数据
  return await getFeishuDishes();
}

/**
 * 获取飞书订单数据
 * @returns {Promise<Array>} 订单数据数组
 */
export async function getFeishuOrders() {
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 获取订单表格数据
    const tableData = await getFeishuTableData(accessToken, 'orders');
    
    // 转换为订单数据
    const orders = tableData.map((record, index) => {
      const fields = record.fields;
      
      // 处理创建时间，确保是有效的时间值和北京时间
      let createTime = fields['创建时间'] || '';
      let time = '';
      
      // 获取当前北京时间作为默认值
      const now = new Date();
      const defaultTimeStr = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      
      // 尝试转换创建时间为北京时间字符串
      if (createTime) {
        try {
          // 确保createTime是字符串
          const timeStr = String(createTime);
          
          // 验证时间字符串是否有效
          const date = new Date(timeStr);
          if (!isNaN(date.getTime())) {
            // 明确指定时区为Asia/Shanghai（北京时间）
            time = date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
            // 确保存储的createTime也是北京时间格式
            createTime = time;
          } else {
            // 如果是无效的时间值，使用当前北京时间
            console.warn('无效的时间值，使用当前时间:', timeStr);
            createTime = defaultTimeStr;
            time = defaultTimeStr;
          }
        } catch (error) {
          console.error('转换创建时间失败:', error);
          // 使用当前北京时间作为默认值
          createTime = defaultTimeStr;
          time = defaultTimeStr;
        }
      } else {
        // 如果创建时间为空，使用当前北京时间
        createTime = defaultTimeStr;
        time = defaultTimeStr;
      }
      
      return {
        id: record.id || `order-${index}`,
        name: fields['菜品名称'] || '',
        createTime: createTime,
        status: fields['订单状态'] || '待处理',
        time: time
      };
    });
    
    console.log(`从飞书获取 ${orders.length} 条订单数据`);
    return orders;
  } catch (error) {
    console.error('获取飞书订单数据错误:', error);
    return [];
  }
}

/**
 * 更新飞书订单状态
 * @param {string} orderId - 订单ID
 * @param {string} status - 新的订单状态
 * @returns {Promise<Object>} 更新结果
 */
export async function updateFeishuOrderStatus(orderId, status) {
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 构建请求体
    const requestBody = {
      fields: {
        '订单状态': status
      }
    };
    
    // 发送请求
    const tableConfig = FEISHU_CONFIG.orders;
    const url = `${FEISHU_CONFIG.baseUrl}/bitable/v1/apps/${tableConfig.appToken}/tables/${tableConfig.tableId}/records/${orderId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/24.11.1'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 先将Response对象的body stream读取为文本
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`更新飞书订单状态失败: ${response.status} - ${responseText}`);
    }
    
    // 手动解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`解析飞书API响应JSON失败: ${parseError.message} - 原始响应: ${responseText}`);
    }
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg}`);
    }
    
    console.log(`成功更新订单状态: ${orderId} -> ${status}`);
    return data;
  } catch (error) {
    console.error('更新飞书订单状态错误:', error);
    throw error;
  }
}

/**
 * 向飞书订单表格添加记录
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} 添加结果
 */
export async function addFeishuOrder(orderData) {
  try {
    // 获取访问令牌
    const accessToken = await getFeishuAccessToken();
    
    // 构建请求体
    // 按照用户要求，将创建时间改为纯文本格式，避免DatetimeFieldConvFail错误
    // 明确指定时区为Asia/Shanghai（北京时间）
    const requestBody = {
      fields: {
        '创建时间': orderData.createTime ? String(orderData.createTime) : new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        '菜品名称': orderData.name || '',
        '订单状态': orderData.status || '待处理'
      }
    };
    
    // 发送请求
    const tableConfig = FEISHU_CONFIG.orders;
    const url = `${FEISHU_CONFIG.baseUrl}/bitable/v1/apps/${tableConfig.appToken}/tables/${tableConfig.tableId}/records`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/24.11.1'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 先将Response对象的body stream读取为文本
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`添加飞书订单失败: ${response.status} - ${responseText}`);
    }
    
    // 手动解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`解析飞书API响应JSON失败: ${parseError.message} - 原始响应: ${responseText}`);
    }
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg}`);
    }
    
    console.log(`成功添加飞书订单: ${data.data.record.id}`);
    return data.data.record;
  } catch (error) {
    console.error('添加飞书订单错误:', error);
    throw error;
  }
}