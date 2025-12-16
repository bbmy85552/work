import { hardwareCategories, getAllHardwareProducts, getProductsByCategory } from './aisolutionData.js';

// 测试数据加载
console.log('硬件分类:', hardwareCategories);

// 检查getAllHardwareProducts返回的数据
const allProducts = getAllHardwareProducts();
console.log('所有硬件产品类型:', Object.keys(allProducts));

// 测试getProductsByCategory函数
console.log('\n测试getProductsByCategory函数:');
hardwareCategories.forEach(category => {
  const products = getProductsByCategory(category.id);
  console.log(`${category.name} (${category.id}): 返回了 ${products.length} 个产品`);
});

// 检查motherboardProducts是否存在
// console.log('\nmotherboardProducts是否存在:', typeof motherboardProducts !== 'undefined');
