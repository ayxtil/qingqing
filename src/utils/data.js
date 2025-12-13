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
  constructor(id, name, category, subCategory, ingredients, imageUrl, price) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.subCategory = subCategory;
    this.ingredients = ingredients;
    this.imageUrl = imageUrl;
    this.price = price;
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
export const dishes = [
  new Dish('dish-0001', '八宝粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/2FEMMLl9kvE/', '一个亲亲'),
  new Dish('dish-0002', '白菜豆腐煲', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/X90k-IbGBqQ/', '一个亲亲'),
  new Dish('dish-0003', '白菜豆腐煲', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/X90k-IbGBqQ/', '一个亲亲'),
  new Dish('dish-0004', '白菜炖粉条', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/Dv8IAewze5w/', '一个亲亲'),
  new Dish('dish-0005', '白菜炖粉条', '素菜', '粉条', ["粉条"], 'https://s.coze.cn/t/Dv8IAewze5w/', '一个亲亲'),
  new Dish('dish-0006', '白菜粉丝汤', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/-2DjY1eG9Lo/', '一个亲亲'),
  new Dish('dish-0007', '白菜粉丝汤', '素菜', '粉丝', ["粉丝"], 'https://s.coze.cn/t/-2DjY1eG9Lo/', '一个亲亲'),
  new Dish('dish-0008', '白菜粉丝汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/-2DjY1eG9Lo/', '一个亲亲'),
  new Dish('dish-0009', '白菜肉卷', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/bl9k1MOnVxo/', '一个亲亲'),
  new Dish('dish-0010', '白菜肉卷', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/bl9k1MOnVxo/', '一个亲亲'),
  new Dish('dish-0011', '板栗烧鸡', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/e_9v7nsA8OY/', '一个亲亲'),
  new Dish('dish-0012', '包子', '主食', '面点', ["面点"], 'https://s.coze.cn/t/1hr2hl6SymA/', '一个亲亲'),
  new Dish('dish-0013', '朝鲜冷面', '素菜', '冷面', ["冷面"], 'https://s.coze.cn/t/wh2yXWPnzj8/', '一个亲亲'),
  new Dish('dish-0014', '朝鲜冷面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/wh2yXWPnzj8/', '一个亲亲'),
  new Dish('dish-0015', '炒饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/DeZXM8HX3Zc/', '一个亲亲'),
  new Dish('dish-0016', '炒饭', '主食', '米饭', ["米饭"], 'https://s.coze.cn/t/-wVpMcTmc-8/', '一个亲亲'),
  new Dish('dish-0017', '炒面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/jPb9Wgi_JiI/', '一个亲亲'),
  new Dish('dish-0018', '炒三丝', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/LN4FX9MwKDk/', '一个亲亲'),
  new Dish('dish-0019', '炒三鲜', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/CGSCyaWtiCQ/', '一个亲亲'),
  new Dish('dish-0020', '春饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/X480r3xYR5c/', '一个亲亲'),
  new Dish('dish-0021', '葱爆牛肉', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/oAWt48mAWao/', '一个亲亲'),
  new Dish('dish-0022', '葱爆羊肉', '荤菜', '羊肉', ["羊肉"], 'https://s.coze.cn/t/UXb6MpOTnUM/', '一个亲亲'),
  new Dish('dish-0023', '葱烧豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/jWD3wAa3DZA/', '一个亲亲'),
  new Dish('dish-0024', '葱烧海参', '海鲜', '海参', ["海参"], 'https://s.coze.cn/t/h_TM9qlQExo/', '一个亲亲'),
  new Dish('dish-0025', '葱烧蹄筋', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/N_sn50znqyU/', '一个亲亲'),
  new Dish('dish-0026', '葱油饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/VaicVpLGxLE/', '一个亲亲'),
  new Dish('dish-0027', '葱油豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/Wb4z_ndFI24/', '一个亲亲'),
  new Dish('dish-0028', '葱油鸡', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/RA6_9_tY38I/', '一个亲亲'),
  new Dish('dish-0029', '醋熘白菜', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/78tKMo2kcS0/', '一个亲亲'),
  new Dish('dish-0030', '打卤面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/a-iFSAN4iy8/', '一个亲亲'),
  new Dish('dish-0031', '大酱汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/ihTnfsLFQJ0/', '一个亲亲'),
  new Dish('dish-0032', '大酱汤', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/ihTnfsLFQJ0/', '一个亲亲'),
  new Dish('dish-0033', '刀削面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/8fOkT3ptoKw/', '一个亲亲'),
  new Dish('dish-0034', '地三鲜', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/47jzP6shW7w/', '一个亲亲'),
  new Dish('dish-0035', '地三鲜', '素菜', '茄子', ["茄子"], 'https://s.coze.cn/t/47jzP6shW7w/', '一个亲亲'),
  new Dish('dish-0036', '地三鲜', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/47jzP6shW7w/', '一个亲亲'),
  new Dish('dish-0037', '冬瓜排骨汤', '素菜', '冬瓜', ["冬瓜"], 'https://s.coze.cn/t/mrmw0yC-KRk/', '一个亲亲'),
  new Dish('dish-0038', '冬瓜排骨汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/mrmw0yC-KRk/', '一个亲亲'),
  new Dish('dish-0039', '冬瓜排骨汤', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/mrmw0yC-KRk/', '一个亲亲'),
  new Dish('dish-0040', '豆腐脑', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/14P2NYt51wQ/', '一个亲亲'),
  new Dish('dish-0041', '豆腐脑', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/14P2NYt51wQ/', '一个亲亲'),
  new Dish('dish-0042', '豆角炖排骨', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/luuarRhewTA/', '一个亲亲'),
  new Dish('dish-0043', '豆角炖排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/luuarRhewTA/', '一个亲亲'),
  new Dish('dish-0044', '豆角炖肉', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/YW4B8KzPbyI/', '一个亲亲'),
  new Dish('dish-0045', '豆角炖肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/YW4B8KzPbyI/', '一个亲亲'),
  new Dish('dish-0046', '豆角焖面', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/9BhG7-Mqcsc/', '一个亲亲'),
  new Dish('dish-0047', '豆角焖面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/9BhG7-Mqcsc/', '一个亲亲'),
  new Dish('dish-0048', '豆沙包', '素菜', '豆沙', ["豆沙"], 'https://s.coze.cn/t/dNa9AM4QfyY/', '一个亲亲'),
  new Dish('dish-0049', '豆沙包', '主食', '面点', ["面点"], 'https://s.coze.cn/t/dNa9AM4QfyY/', '一个亲亲'),
  new Dish('dish-0050', '粉条炖肉', '素菜', '粉条', ["粉条"], 'https://s.coze.cn/t/vjd_Lv_DVpw/', '一个亲亲'),
  new Dish('dish-0051', '干煸豆角', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/rIkZ0Zp9FoM/', '一个亲亲'),
  new Dish('dish-0052', '干煸四季豆', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/9s2Zvg09Bfw/', '一个亲亲'),
  new Dish('dish-0053', '干锅肥肠', '荤菜', '肥肠', ["肥肠"], 'https://s.coze.cn/t/l3Hwwjz7478/', '一个亲亲'),
  new Dish('dish-0054', '干锅鸡块', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/MGJlSV2Tuc4/', '一个亲亲'),
  new Dish('dish-0055', '干锅土豆片', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/ygE49GnFz7A/', '一个亲亲'),
  new Dish('dish-0056', '疙瘩汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/feRizWCXML0/', '一个亲亲'),
  new Dish('dish-0057', '宫保鸡丁', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/H24iFIEt1dY/', '一个亲亲'),
  new Dish('dish-0058', '宫保虾球', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/OiCpmVHz8AA/', '一个亲亲'),
  new Dish('dish-0059', '锅烧肘子', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/mLlZ5JcFbTw/', '一个亲亲'),
  new Dish('dish-0060', '锅贴', '主食', '面点', ["面点"], 'https://s.coze.cn/t/_t5SjvCmj0M/', '一个亲亲'),
  new Dish('dish-0061', '锅贴', '主食', '面食', ["面食"], 'https://s.coze.cn/t/_t5SjvCmj0M/', '一个亲亲'),
  new Dish('dish-0062', '海带豆腐汤', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/yO-HpPZMFvg/', '一个亲亲'),
  new Dish('dish-0063', '海带豆腐汤', '素菜', '海带', ["海带"], 'https://s.coze.cn/t/yO-HpPZMFvg/', '一个亲亲'),
  new Dish('dish-0064', '海带豆腐汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/yO-HpPZMFvg/', '一个亲亲'),
  new Dish('dish-0065', '红豆汤', '素菜', '红豆', ["红豆"], 'https://s.coze.cn/t/_Jy-WrWXn8Q/', '一个亲亲'),
  new Dish('dish-0066', '红豆汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/_Jy-WrWXn8Q/', '一个亲亲'),
  new Dish('dish-0067', '红豆粥', '素菜', '红豆', ["红豆"], 'https://s.coze.cn/t/_FnbJOi3bxY/', '一个亲亲'),
  new Dish('dish-0068', '红豆粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/_FnbJOi3bxY/', '一个亲亲'),
  new Dish('dish-0069', '红烧豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/0mRZdeqvdPE/', '一个亲亲'),
  new Dish('dish-0070', '红烧鲫鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/YcKhuAbGCnw/', '一个亲亲'),
  new Dish('dish-0071', '红烧鲤鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/h1YEMcNkPFM/', '一个亲亲'),
  new Dish('dish-0072', '红烧排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/OlVLUAs0tWo/', '一个亲亲'),
  new Dish('dish-0073', '红烧狮子头', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/HVAsKGgQscw/', '一个亲亲'),
  new Dish('dish-0074', '红烧蹄髈', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/AHdEoT4t9KE/', '一个亲亲'),
  new Dish('dish-0075', '胡萝卜炒鸡蛋', '素菜', '胡萝卜', ["胡萝卜"], 'https://s.coze.cn/t/6Y-WU3Eab_o/', '一个亲亲'),
  new Dish('dish-0076', '胡萝卜炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/6Y-WU3Eab_o/', '一个亲亲'),
  new Dish('dish-0077', '胡萝卜炒肉丝', '素菜', '胡萝卜', ["胡萝卜"], 'https://s.coze.cn/t/f4XuCIjFTqM/', '一个亲亲'),
  new Dish('dish-0078', '胡萝卜炖羊肉', '素菜', '胡萝卜', ["胡萝卜"], 'https://s.coze.cn/t/Nc833aLGzoI/', '一个亲亲'),
  new Dish('dish-0079', '胡萝卜炖羊肉', '荤菜', '羊肉', ["羊肉"], 'https://s.coze.cn/t/Nc833aLGzoI/', '一个亲亲'),
  new Dish('dish-0080', '花卷', '主食', '面食', ["面食"], 'https://s.coze.cn/t/SLo0RpCCzfU/', '一个亲亲'),
  new Dish('dish-0081', '黄豆炖猪蹄', '汤', '汤', ["汤"], 'https://s.coze.cn/t/oepDQgzzu-E/', '一个亲亲'),
  new Dish('dish-0082', '黄豆炖猪蹄', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/oepDQgzzu-E/', '一个亲亲'),
  new Dish('dish-0083', '黄瓜炒鸡蛋', '素菜', '黄瓜', ["黄瓜"], 'https://s.coze.cn/t/bVySRQzBgig/', '一个亲亲'),
  new Dish('dish-0084', '黄瓜炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/bVySRQzBgig/', '一个亲亲'),
  new Dish('dish-0085', '黄瓜炒肉', '素菜', '黄瓜', ["黄瓜"], 'https://s.coze.cn/t/efM3YMcNx70/', '一个亲亲'),
  new Dish('dish-0086', '回锅豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/pWUXoX3B6vI/', '一个亲亲'),
  new Dish('dish-0087', '回锅肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/0FOybmZWUkI/', '一个亲亲'),
  new Dish('dish-0088', '回锅土豆', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/sOsCgU13_vw/', '一个亲亲'),
  new Dish('dish-0089', '馄饨', '主食', '面点', ["面点"], 'https://s.coze.cn/t/D_De8ipLLK8/', '一个亲亲'),
  new Dish('dish-0090', '鸡蛋汤', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/K54TM-HIiSo/', '一个亲亲'),
  new Dish('dish-0091', '鸡蛋汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/K54TM-HIiSo/', '一个亲亲'),
  new Dish('dish-0092', '鸡爪煲', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/7jV-VDd_vHs/', '一个亲亲'),
  new Dish('dish-0093', '鲫鱼豆腐汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/Q3dXOsKi8xk/', '一个亲亲'),
  new Dish('dish-0094', '鲫鱼豆腐汤', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/Q3dXOsKi8xk/', '一个亲亲'),
  new Dish('dish-0095', '家常豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/4aupMPDgQpg/', '一个亲亲'),
  new Dish('dish-0096', '家常豆腐', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/4aupMPDgQpg/', '一个亲亲'),
  new Dish('dish-0097', '家常土豆片', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/b56do7VKJ2U/', '一个亲亲'),
  new Dish('dish-0098', '煎饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/1rodSgQXj3Q/', '一个亲亲'),
  new Dish('dish-0099', '煎豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/mWkiIdsb-Ts/', '一个亲亲'),
  new Dish('dish-0100', '酱爆鸡丁', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/5Ft-5vTNGGY/', '一个亲亲'),
  new Dish('dish-0101', '酱炖鸡块', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/pUTKndqKYVE/', '一个亲亲'),
  new Dish('dish-0102', '酱骨头', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/v7XMZEevXJM/', '一个亲亲'),
  new Dish('dish-0103', '酱骨头', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/v7XMZEevXJM/', '一个亲亲'),
  new Dish('dish-0104', '酱焖豆角', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/ibnKhq8wxVA/', '一个亲亲'),
  new Dish('dish-0105', '酱焖土豆', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/q8wd2yU0eoU/', '一个亲亲'),
  new Dish('dish-0106', '酱焖鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/KTm5ku7N7X0/', '一个亲亲'),
  new Dish('dish-0107', '酱烧茄子', '素菜', '茄子', ["茄子"], 'https://s.coze.cn/t/TWTBSPSP9Yc/', '一个亲亲'),
  new Dish('dish-0108', '椒盐排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/gcvzD9Tn1r4/', '一个亲亲'),
  new Dish('dish-0109', '椒盐虾', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/_xNXEdcZNUM/', '一个亲亲'),
  new Dish('dish-0110', '焦溜丸子', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/8ugUSucSmw8/', '一个亲亲'),
  new Dish('dish-0111', '饺子', '主食', '面点', ["面点"], 'https://s.coze.cn/t/UgmydXzT5r8/', '一个亲亲'),
  new Dish('dish-0112', '韭菜炒豆干', '素菜', '豆干', ["豆干"], 'https://s.coze.cn/t/DQYtLQGEKSo/', '一个亲亲'),
  new Dish('dish-0113', '韭菜炒豆干', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/DQYtLQGEKSo/', '一个亲亲'),
  new Dish('dish-0114', '韭菜炒豆芽', '素菜', '豆芽', ["豆芽"], 'https://s.coze.cn/t/Nr3FrSVvv78/', '一个亲亲'),
  new Dish('dish-0115', '韭菜炒豆芽', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/Nr3FrSVvv78/', '一个亲亲'),
  new Dish('dish-0116', '韭菜炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/vcslOg5ecpw/', '一个亲亲'),
  new Dish('dish-0117', '韭菜炒鸡蛋', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/vcslOg5ecpw/', '一个亲亲'),
  new Dish('dish-0118', '韭菜炒肉丝', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/4Kc_RiHL_1o/', '一个亲亲'),
  new Dish('dish-0119', '韭菜炒虾仁', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/cqJIZqkGeP8/', '一个亲亲'),
  new Dish('dish-0120', '韭菜炒虾仁', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/cqJIZqkGeP8/', '一个亲亲'),
  new Dish('dish-0121', '韭菜盒子', '素菜', '韭菜', ["韭菜"], 'https://s.coze.cn/t/Mz-OWJdo9oM/', '一个亲亲'),
  new Dish('dish-0122', '韭菜盒子', '主食', '面点', ["面点"], 'https://s.coze.cn/t/Mz-OWJdo9oM/', '一个亲亲'),
  new Dish('dish-0123', '菌菇汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/YgJW6Q4r810/', '一个亲亲'),
  new Dish('dish-0124', '烤冷面', '素菜', '冷面', ["冷面"], 'https://s.coze.cn/t/QHQHRhnF6eE/', '一个亲亲'),
  new Dish('dish-0125', '烤冷面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/QHQHRhnF6eE/', '一个亲亲'),
  new Dish('dish-0126', '苦瓜炒蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/z3R-QunH2Xk/', '一个亲亲'),
  new Dish('dish-0127', '苦瓜炒蛋', '素菜', '苦瓜', ["苦瓜"], 'https://s.coze.cn/t/z3R-QunH2Xk/', '一个亲亲'),
  new Dish('dish-0128', '苦瓜炒肉', '素菜', '苦瓜', ["苦瓜"], 'https://s.coze.cn/t/XvjqlFVBE2k/', '一个亲亲'),
  new Dish('dish-0129', '拉面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/fm9EXy8-xHA/', '一个亲亲'),
  new Dish('dish-0130', '鲤鱼炖豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/PjWXvxpPqds/', '一个亲亲'),
  new Dish('dish-0131', '鲤鱼炖豆腐', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/PjWXvxpPqds/', '一个亲亲'),
  new Dish('dish-0132', '莲藕排骨汤', '素菜', '莲藕', ["莲藕"], 'https://s.coze.cn/t/Tj5nF8EjeFM/', '一个亲亲'),
  new Dish('dish-0133', '莲藕排骨汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/Tj5nF8EjeFM/', '一个亲亲'),
  new Dish('dish-0134', '莲藕排骨汤', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/Tj5nF8EjeFM/', '一个亲亲'),
  new Dish('dish-0135', '莲子粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/PluWCnI063c/', '一个亲亲'),
  new Dish('dish-0136', '凉拌荤菜', '荤菜', '凉拌荤菜', ["凉拌荤菜"], 'https://s.coze.cn/t/76hLDY0_l80/', '一个亲亲'),
  new Dish('dish-0137', '凉拌素菜', '素菜', '凉拌素菜', ["凉拌素菜"], 'https://s.coze.cn/t/E7QMu8Mxf28/', '一个亲亲'),
  new Dish('dish-0138', '溜肉段', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/mKB6lIlQ7Ps/', '一个亲亲'),
  new Dish('dish-0139', '溜三样', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/tBqBeYxySjg/', '一个亲亲'),
  new Dish('dish-0140', '熘肥肠', '荤菜', '肥肠', ["肥肠"], 'https://s.coze.cn/t/H0S57HH5UUw/', '一个亲亲'),
  new Dish('dish-0141', '熘肥肠', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/H0S57HH5UUw/', '一个亲亲'),
  new Dish('dish-0142', '熘肝尖', '荤菜', '肝', ["肝"], 'https://s.coze.cn/t/_Ub1K8nOjlg/', '一个亲亲'),
  new Dish('dish-0143', '萝卜炖豆腐', '素菜', '萝卜', ["萝卜"], 'https://s.coze.cn/t/IjoObzpYl2c/', '一个亲亲'),
  new Dish('dish-0144', '萝卜炖牛腩', '素菜', '萝卜', ["萝卜"], 'https://s.coze.cn/t/1wADKsJb0r8/', '一个亲亲'),
  new Dish('dish-0145', '萝卜炖牛腩', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/1wADKsJb0r8/', '一个亲亲'),
  new Dish('dish-0146', '萝卜干炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/Xq4bMYLxVos/', '一个亲亲'),
  new Dish('dish-0147', '萝卜干炒肉', '素菜', '萝卜', ["萝卜"], 'https://s.coze.cn/t/Yprh7eU_w4Y/', '一个亲亲'),
  new Dish('dish-0148', '萝卜干炒肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/Yprh7eU_w4Y/', '一个亲亲'),
  new Dish('dish-0149', '萝卜丝饼', '素菜', '萝卜', ["萝卜"], 'https://s.coze.cn/t/7p8IgKOvdlU/', '一个亲亲'),
  new Dish('dish-0150', '萝卜丝饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/7p8IgKOvdlU/', '一个亲亲'),
  new Dish('dish-0151', '萝卜丝汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/dDmCXH753Zw/', '一个亲亲'),
  new Dish('dish-0152', '萝卜丸子', '素菜', '萝卜', ["萝卜"], 'https://s.coze.cn/t/gaYNrRz_8Ag/', '一个亲亲'),
  new Dish('dish-0153', '绿豆汤', '素菜', '绿豆', ["绿豆"], 'https://s.coze.cn/t/QEyiMxmGTks/', '一个亲亲'),
  new Dish('dish-0154', '绿豆汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/QEyiMxmGTks/', '一个亲亲'),
  new Dish('dish-0155', '绿豆粥', '素菜', '绿豆', ["绿豆"], 'https://s.coze.cn/t/cadQ4xmtiA8/', '一个亲亲'),
  new Dish('dish-0156', '绿豆粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/cadQ4xmtiA8/', '一个亲亲'),
  new Dish('dish-0157', '麻婆豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/I-myXFE64PA/', '一个亲亲'),
  new Dish('dish-0158', '馒头', '主食', '面食', ["面食"], 'https://s.coze.cn/t/2TZLyGEdTB4/', '一个亲亲'),
  new Dish('dish-0159', '木耳炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/uWDBFWSRfuw/', '一个亲亲'),
  new Dish('dish-0160', '木耳炒鸡蛋', '素菜', '木耳', ["木耳"], 'https://s.coze.cn/t/uWDBFWSRfuw/', '一个亲亲'),
  new Dish('dish-0161', '木耳炒肉', '素菜', '木耳', ["木耳"], 'https://s.coze.cn/t/aB67lV4Evj8/', '一个亲亲'),
  new Dish('dish-0162', '木耳炒肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/aB67lV4Evj8/', '一个亲亲'),
  new Dish('dish-0163', '木须肉', '素菜', '木耳', ["木耳"], 'https://s.coze.cn/t/jgoBYHBRW0U/', '一个亲亲'),
  new Dish('dish-0164', '木须肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/jgoBYHBRW0U/', '一个亲亲'),
  new Dish('dish-0165', '木须汤', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/Ox9EXQzxcTU/', '一个亲亲'),
  new Dish('dish-0166', '木须汤', '素菜', '木耳', ["木耳"], 'https://s.coze.cn/t/Ox9EXQzxcTU/', '一个亲亲'),
  new Dish('dish-0167', '木须汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/Ox9EXQzxcTU/', '一个亲亲'),
  new Dish('dish-0168', '南瓜粥', '素菜', '南瓜', ["南瓜"], 'https://s.coze.cn/t/P7AbkP8MPEw/', '一个亲亲'),
  new Dish('dish-0169', '南瓜粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/P7AbkP8MPEw/', '一个亲亲'),
  new Dish('dish-0170', '排骨炖豆角', '素菜', '豆角', ["豆角"], 'https://s.coze.cn/t/hYjf3T91NPU/', '一个亲亲'),
  new Dish('dish-0171', '排骨炖豆角', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/hYjf3T91NPU/', '一个亲亲'),
  new Dish('dish-0172', '皮蛋瘦肉粥', '素菜', '皮蛋', ["皮蛋"], 'https://s.coze.cn/t/8bY6EEY9HKs/', '一个亲亲'),
  new Dish('dish-0173', '皮蛋瘦肉粥', '汤', '汤', ["汤"], 'https://s.coze.cn/t/8bY6EEY9HKs/', '一个亲亲'),
  new Dish('dish-0174', '皮蛋瘦肉粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/8bY6EEY9HKs/', '一个亲亲'),
  new Dish('dish-0175', '肉末茄子', '素菜', '茄子', ["茄子"], 'https://s.coze.cn/t/R3r2MyokKo4/', '一个亲亲'),
  new Dish('dish-0176', '肉末茄子', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/R3r2MyokKo4/', '一个亲亲'),
  new Dish('dish-0177', '青椒肉丝', '素菜', '青椒', ["青椒"], 'https://s.coze.cn/t/Rvjy6e4x2NI/', '一个亲亲'),
  new Dish('dish-0178', '青椒肉丝', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/Rvjy6e4x2NI/', '一个亲亲'),
  new Dish('dish-0179', '青椒土豆丝', '素菜', '青椒', ["青椒"], 'https://s.coze.cn/t/9ZmOGKbExpY/', '一个亲亲'),
  new Dish('dish-0180', '青椒土豆丝', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/9ZmOGKbExpY/', '一个亲亲'),
  new Dish('dish-0181', '清炒虾仁', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/qXw7WiVb3m8/', '一个亲亲'),
  new Dish('dish-0182', '清蒸鲫鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/-1KBtd7F61U/', '一个亲亲'),
  new Dish('dish-0183', '清蒸鲈鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/NGuSv5Xe5uQ/', '一个亲亲'),
  new Dish('dish-0184', '杀猪菜', '素菜', '酸菜', ["酸菜"], 'https://s.coze.cn/t/3GEFdkGNtE0/', '一个亲亲'),
  new Dish('dish-0185', '烧饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/y1BNVeGei3k/', '一个亲亲'),
  new Dish('dish-0186', '烧卖', '主食', '面点', ["面点"], 'https://s.coze.cn/t/frs_D_jdBVw/', '一个亲亲'),
  new Dish('dish-0187', '石锅拌饭', '主食', '米饭', ["米饭"], 'https://s.coze.cn/t/5OAFuCi-_YA/', '一个亲亲'),
  new Dish('dish-0188', '水煮肉片', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/-Jj1TXWqA-8/', '一个亲亲'),
  new Dish('dish-0189', '水煮鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/5HEyMC0cuR4/', '一个亲亲'),
  new Dish('dish-0190', '丝瓜炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/HpKXGrfidpg/', '一个亲亲'),
  new Dish('dish-0191', '丝瓜炒鸡蛋', '素菜', '丝瓜', ["丝瓜"], 'https://s.coze.cn/t/HpKXGrfidpg/', '一个亲亲'),
  new Dish('dish-0192', '丝瓜炒肉', '素菜', '丝瓜', ["丝瓜"], 'https://s.coze.cn/t/_eisor1Dni0/', '一个亲亲'),
  new Dish('dish-0193', '松仁玉米', '素菜', '玉米', ["玉米"], 'https://s.coze.cn/t/XsYXC5qLCwg/', '一个亲亲'),
  new Dish('dish-0194', '酸菜白肉', '素菜', '酸菜', ["酸菜"], 'https://s.coze.cn/t/P7fnbM6Z5zg/', '一个亲亲'),
  new Dish('dish-0195', '酸菜炖大骨', '素菜', '酸菜', ["酸菜"], 'https://s.coze.cn/t/vLpDasId7L8/', '一个亲亲'),
  new Dish('dish-0196', '酸菜炖大骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/vLpDasId7L8/', '一个亲亲'),
  new Dish('dish-0197', '酸菜炖大骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/vLpDasId7L8/', '一个亲亲'),
  new Dish('dish-0198', '酸菜炖粉条', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/VUDZYciLhoE/', '一个亲亲'),
  new Dish('dish-0199', '酸菜炖粉条', '素菜', '粉条', ["粉条"], 'https://s.coze.cn/t/VUDZYciLhoE/', '一个亲亲'),
  new Dish('dish-0200', '酸菜炖粉条', '素菜', '酸菜', ["酸菜"], 'https://s.coze.cn/t/VUDZYciLhoE/', '一个亲亲'),
  new Dish('dish-0201', '酸菜鱼', '素菜', '酸菜', ["酸菜"], 'https://s.coze.cn/t/vN9e9LuflUM/', '一个亲亲'),
  new Dish('dish-0202', '酸菜鱼', '荤菜', '鱼', ["鱼"], 'https://s.coze.cn/t/vN9e9LuflUM/', '一个亲亲'),
  new Dish('dish-0203', '酸辣白菜', '素菜', '白菜', ["白菜"], 'https://s.coze.cn/t/GA7ZRFQvy0A/', '一个亲亲'),
  new Dish('dish-0204', '酸辣汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/ue5Uia6iHyU/', '一个亲亲'),
  new Dish('dish-0205', '酸辣土豆丝', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/ZTvFlHvlc_s/', '一个亲亲'),
  new Dish('dish-0206', '蒜蓉粉丝蒸扇贝', '素菜', '粉丝', ["粉丝"], 'https://s.coze.cn/t/RQ2rHpaNpi0/', '一个亲亲'),
  new Dish('dish-0207', '蒜蓉粉丝蒸扇贝', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/RQ2rHpaNpi0/', '一个亲亲'),
  new Dish('dish-0208', '蒜苔炒肉', '素菜', '蒜苔', ["蒜苔"], 'https://s.coze.cn/t/P3hPdXgU4fo/', '一个亲亲'),
  new Dish('dish-0209', '蒜苔炒肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/P3hPdXgU4fo/', '一个亲亲'),
  new Dish('dish-0210', '蒜香排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/JjTm0bXPPEI/', '一个亲亲'),
  new Dish('dish-0211', '糖醋排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/yGv0-sD8d-w/', '一个亲亲'),
  new Dish('dish-0212', '糖三角', '主食', '面点', ["面点"], 'https://s.coze.cn/t/9_uV6IYyQPc/', '一个亲亲'),
  new Dish('dish-0213', '土豆饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/XbJLnhAnrJ4/', '一个亲亲'),
  new Dish('dish-0214', '土豆炖鸡', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/jGBpOBjLZIk/', '一个亲亲'),
  new Dish('dish-0215', '土豆炖鸡', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/jGBpOBjLZIk/', '一个亲亲'),
  new Dish('dish-0216', '土豆炖牛肉', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/JhvAt7qBET4/', '一个亲亲'),
  new Dish('dish-0217', '土豆炖牛肉', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/JhvAt7qBET4/', '一个亲亲'),
  new Dish('dish-0218', '土豆炖排骨', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/6DQYrLhiKNM/', '一个亲亲'),
  new Dish('dish-0219', '土豆炖排骨', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/6DQYrLhiKNM/', '一个亲亲'),
  new Dish('dish-0220', '土豆肉片', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/6BeouHu-vig/', '一个亲亲'),
  new Dish('dish-0221', '土豆肉片', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/6BeouHu-vig/', '一个亲亲'),
  new Dish('dish-0222', '土豆烧牛肉', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/ZGcTabYqQjk/', '一个亲亲'),
  new Dish('dish-0223', '土豆烧牛肉', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/ZGcTabYqQjk/', '一个亲亲'),
  new Dish('dish-0224', '土豆丝', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/XI62kAkRvCw/', '一个亲亲'),
  new Dish('dish-0225', '西红柿炒鸡蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/2gp1U-gfMww/', '一个亲亲'),
  new Dish('dish-0226', '西红柿炒鸡蛋', '素菜', '西红柿', ["西红柿"], 'https://s.coze.cn/t/2gp1U-gfMww/', '一个亲亲'),
  new Dish('dish-0227', '西红柿炖豆腐', '素菜', '豆腐', ["豆腐"], 'https://s.coze.cn/t/Na305pVaiP0/', '一个亲亲'),
  new Dish('dish-0228', '西红柿炖豆腐', '素菜', '西红柿', ["西红柿"], 'https://s.coze.cn/t/Na305pVaiP0/', '一个亲亲'),
  new Dish('dish-0229', '西红柿炖牛腩', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/2cjz9f9zh90/', '一个亲亲'),
  new Dish('dish-0230', '西红柿炖牛腩', '素菜', '西红柿', ["西红柿"], 'https://s.coze.cn/t/2cjz9f9zh90/', '一个亲亲'),
  new Dish('dish-0231', '西红柿鸡蛋汤', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/6sdvsRmp7bM/', '一个亲亲'),
  new Dish('dish-0232', '西红柿鸡蛋汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/6sdvsRmp7bM/', '一个亲亲'),
  new Dish('dish-0233', '西红柿鸡蛋汤', '素菜', '西红柿', ["西红柿"], 'https://s.coze.cn/t/6sdvsRmp7bM/', '一个亲亲'),
  new Dish('dish-0234', '西红柿牛腩面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/boz1gLebn2Q/', '一个亲亲'),
  new Dish('dish-0235', '西红柿牛腩面', '荤菜', '牛肉', ["牛肉"], 'https://s.coze.cn/t/boz1gLebn2Q/', '一个亲亲'),
  new Dish('dish-0236', '西红柿牛腩面', '素菜', '西红柿', ["西红柿"], 'https://s.coze.cn/t/boz1gLebn2Q/', '一个亲亲'),
  new Dish('dish-0237', '虾皮蒸蛋', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/jplm1UwAsh8/', '一个亲亲'),
  new Dish('dish-0238', '虾皮蒸蛋', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/jplm1UwAsh8/', '一个亲亲'),
  new Dish('dish-0239', '香菇油菜', '素菜', '蘑菇', ["蘑菇"], 'https://s.coze.cn/t/ulvJg3kDFUI/', '一个亲亲'),
  new Dish('dish-0240', '香辣鸡翅', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/Pfxomnh2liU/', '一个亲亲'),
  new Dish('dish-0241', '香辣土豆片', '素菜', '土豆', ["土豆"], 'https://s.coze.cn/t/vyh5kYUFvDo/', '一个亲亲'),
  new Dish('dish-0242', '香辣虾', '海鲜', '海鲜', ["海鲜"], 'https://s.coze.cn/t/b0WGbPrShSQ/', '一个亲亲'),
  new Dish('dish-0243', '小鸡炖蘑菇', '荤菜', '鸡肉', ["鸡肉"], 'https://s.coze.cn/t/F0PQuH_ldDo/', '一个亲亲'),
  new Dish('dish-0244', '小鸡炖蘑菇', '素菜', '蘑菇', ["蘑菇"], 'https://s.coze.cn/t/F0PQuH_ldDo/', '一个亲亲'),
  new Dish('dish-0245', '小米粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/ThGRfTnkGJ0/', '一个亲亲'),
  new Dish('dish-0246', '雪里蕻炒肉', '素菜', '雪里蕻', ["雪里蕻"], 'https://s.coze.cn/t/9r6Y1JaCTkQ/', '一个亲亲'),
  new Dish('dish-0247', '雪里蕻炒肉', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/9r6Y1JaCTkQ/', '一个亲亲'),
  new Dish('dish-0248', '雪里蕻炖豆腐', '素菜', '雪里蕻', ["雪里蕻"], 'https://s.coze.cn/t/ouRHGX9VT5E/', '一个亲亲'),
  new Dish('dish-0249', '雪衣豆沙', '素菜', '豆沙', ["豆沙"], 'https://s.coze.cn/t/PiFLKvAicek/', '一个亲亲'),
  new Dish('dish-0250', '雪衣豆沙', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/PiFLKvAicek/', '一个亲亲'),
  new Dish('dish-0251', '羊肉串', '荤菜', '羊肉', ["羊肉"], 'https://s.coze.cn/t/HECHW0_ytaQ/', '一个亲亲'),
  new Dish('dish-0252', '羊肉汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/KrawrqYxi9o/', '一个亲亲'),
  new Dish('dish-0253', '羊肉汤', '荤菜', '羊肉', ["羊肉"], 'https://s.coze.cn/t/KrawrqYxi9o/', '一个亲亲'),
  new Dish('dish-0254', '油泼面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/zp4xhzkRAUE/', '一个亲亲'),
  new Dish('dish-0255', '鱼香茄子', '素菜', '茄子', ["茄子"], 'https://s.coze.cn/t/OJW8RysyYfE/', '一个亲亲'),
  new Dish('dish-0256', '鱼香肉丝', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/QFN1P7jhIYk/', '一个亲亲'),
  new Dish('dish-0257', '玉米饼', '主食', '面食', ["面食"], 'https://s.coze.cn/t/LG5BZex9YUw/', '一个亲亲'),
  new Dish('dish-0258', '玉米肠', '素菜', '玉米', ["玉米"], 'https://s.coze.cn/t/9ZV38uGbk0U/', '一个亲亲'),
  new Dish('dish-0259', '玉米排骨汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/YvwJs-hs5W0/', '一个亲亲'),
  new Dish('dish-0260', '玉米排骨汤', '素菜', '玉米', ["玉米"], 'https://s.coze.cn/t/YvwJs-hs5W0/', '一个亲亲'),
  new Dish('dish-0261', '玉米排骨汤', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/YvwJs-hs5W0/', '一个亲亲'),
  new Dish('dish-0262', '玉米粥', '主食', '粥', ["粥"], 'https://s.coze.cn/t/nAaDE4vZbRg/', '一个亲亲'),
  new Dish('dish-0263', '炸酱面', '主食', '面食', ["面食"], 'https://s.coze.cn/t/ABcp4SYV5LM/', '一个亲亲'),
  new Dish('dish-0264', '炸蘑菇', '素菜', '蘑菇', ["蘑菇"], 'https://s.coze.cn/t/iEk0OakXJJE/', '一个亲亲'),
  new Dish('dish-0265', '蒸南瓜', '素菜', '南瓜', ["南瓜"], 'https://s.coze.cn/t/9WMg9pdbGuE/', '一个亲亲'),
  new Dish('dish-0266', '猪肉炖粉条', '素菜', '粉条', ["粉条"], 'https://s.coze.cn/t/FCta_4YXkvU/', '一个亲亲'),
  new Dish('dish-0267', '猪肉炖粉条', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/FCta_4YXkvU/', '一个亲亲'),
  new Dish('dish-0268', '猪蹄炖黄豆', '荤菜', '猪肉', ["猪肉"], 'https://s.coze.cn/t/pk4ZIrgR_tE/', '一个亲亲'),
  new Dish('dish-0269', '紫菜蛋花汤', '素菜', '鸡蛋', ["鸡蛋"], 'https://s.coze.cn/t/p9FRBpfXImk/', '一个亲亲'),
  new Dish('dish-0270', '紫菜蛋花汤', '汤', '汤', ["汤"], 'https://s.coze.cn/t/p9FRBpfXImk/', '一个亲亲'),
  new Dish('dish-0271', '紫菜蛋花汤', '素菜', '紫菜', ["紫菜"], 'https://s.coze.cn/t/p9FRBpfXImk/', '一个亲亲')
];


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

// 初始化数据关联
linkDishesAndIngredients();

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
    dish.name.toLowerCase().includes(lowerQuery) ||
    dish.description.toLowerCase().includes(lowerQuery) ||
    dish.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowerQuery))
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
    
    // 创建新的 Dish 实例
    const newDish = new Dish(newId, dishData.name, dishData.category, dishData.subCategory, dishData.ingredients || [dishData.subCategory], dishData.imageUrl, dishData.price || '一个亲亲');
    
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