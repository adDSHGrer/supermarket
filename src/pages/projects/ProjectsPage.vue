<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">商品信息管理</h1>

    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <header class="flex justify-between items-center mb-4">
        <div class="relative w-full">
          <input
            v-model="searchTerm"
            placeholder="搜索商品名称..."
            class="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex space-x-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            @click="openAddModal"
          >
            新增商品
          </button>
          <button
            v-if="selectedProduct"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            @click="deleteProduct(selectedProduct.goods_id)"
          >
            删除商品
          </button>
        </div>
      </header>

      <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">名称</th>
            <th class="py-2 px-4">价格</th>
            <th class="py-2 px-4">库存数量</th>
            <th class="py-2 px-4">供应商</th>
            <th class="py-2 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in searchProducts()"
            :key="product.goods_id"
            class="hover:bg-gray-200 transition duration-200"
            :class="{ 'bg-blue-100': selectedProduct && selectedProduct.goods_id === product.goods_id }"
          >
            <td class="border px-4 py-2">{{ product.qr_code }}</td>
            <td class="border px-4 py-2">{{ product.name }}</td>
            <td class="border px-4 py-2">{{ product.price }}</td>
            <td class="border px-4 py-2">{{ product.stock }}</td>
            <td class="border px-4 py-2">{{ product.supplier }}</td>
            <td class="border px-4 py-2">
              <button class="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-400" @click="openEditModal(product)">
                编辑
              </button>
              <button
                class="bg-gray-500 text-white px-2 rounded hover:bg-gray-400 ml-2"
                @click="selectedProduct = product"
              >
                选择
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 弹出框 -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">{{ isEditMode ? '编辑商品' : '新增商品' }}</h2>
        <label>商品名称：</label>
        <input v-model="editProductData.name" class="border rounded p-1 mb-2 w-full" />

        <label>价格：</label>
        <input v-model="editProductData.price" type="number" class="border rounded p-1 mb-2 w-full" />

        <label>库存：</label>
        <input v-model="editProductData.stock" type="number" class="border rounded p-1 mb-2 w-full" />

        <label>供应商：</label>
        <input v-model="editProductData.supplier" class="border rounded p-1 mb-2 w-full" />

        <label>上架日期：</label>
        <p class="border rounded p-1 mb-2 w-full">{{ editProductData.shelf_date }}</p>

        <label>二维码：</label>
        <p class="border rounded p-1 mb-2 w-full">{{ editProductData.qr_code }}</p>

        <div class="flex justify-end">
          <button class="bg-blue-500 text-white p-2 rounded mr-2" @click="saveProduct">
            {{ isEditMode ? '保存' : '新增' }}
          </button>
          <button class="bg-gray-500 text-white p-2 rounded" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const products = ref<Product[]>([])
const searchTerm = ref('')
const selectedProduct = ref<Product | null>(null)
const showModal = ref(false)
const editProductData = ref<Product | null>(null)
const isEditMode = ref(false)

interface Product {
  goods_id: string | null
  _id: string
  name: string
  price: number
  stock: number
  supplier: string
  shelf_date: string
  qr_code: string
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const openAddModal = () => {
  editProductData.value = {
    _id: generateUUID(),
    name: '',
    price: 0,
    stock: 0,
    supplier: '',
    shelf_date: new Date().toISOString().split('T')[0],
    qr_code: generateUUID(),
  }
  isEditMode.value = false
  showModal.value = true
}

const openEditModal = (product: Product) => {
  console.log('打开编辑框', product)
  editProductData.value = { ...product }
  isEditMode.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = async () => {
  if (editProductData.value) {
    try {
      const response = isEditMode.value ? await updateProduct() : await addProduct()
      if (response && response.success) {
        closeModal()
      }
    } catch (error) {
      console.error(isEditMode.value ? '更新商品失败' : '添加商品失败', error)
    }
  }
}

const updateProduct = async () => {
  if (!editProductData.value) {
    console.error('editProductData.value 为空')
    return // 可以选择返回或者抛出错误
  }
  console.log('编辑商品', editProductData.value)
  const response = await fetch('http://localhost:15002/update_goods', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...editProductData.value,
      _id: editProductData.value.goods_id,
    }),
  })

  if (!response.ok) throw new Error('更新商品失败')

  const index = products.value.findIndex((product) => product.goods_id === editProductData.value!.goods_id)
  if (index !== -1) {
    products.value[index] = { ...editProductData.value }
  }
  return { success: true }
}

const addProduct = async () => {
  const response = await fetch('http://localhost:15002/add_goods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editProductData.value),
  })

  if (!response.ok) throw new Error('添加商品失败')

  const addedProduct = await response.json()
  console.log('添加商品成功', editProductData)
  console.log('添加商品成功', addedProduct)
  products.value.push({ ...editProductData.value, goods_id: addedProduct.data.goods_id })
  return { success: true }
}

async function fetchAllProducts() {
  try {
    const response = await fetch('http://localhost:15002/get_all_goods')
    if (!response.ok) throw new Error('网络响应不是有效的')

    const data = await response.json()
    products.value = data.data
  } catch (error) {
    console.error('获取商品信息失败', error)
  }
}

async function deleteProduct(productId: string) {
  try {
    const response = await fetch(`http://localhost:15002/delete_goods/${productId}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('删除商品失败')
    products.value = products.value.filter((product) => product.goods_id !== productId)
  } catch (error) {
    console.error('删除商品失败', error)
  }
}

function searchProducts(): Product[] {
  return products.value.filter((product) => product.name.includes(searchTerm.value))
}

onMounted(() => {
  fetchAllProducts()
})
</script>

<style>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 2rem;
}
</style>
