<script lang="ts" setup>
import { ref } from 'vue'

const products = ref([
  { id: 1, name: '商品 A', price: 100, stock: 10, supplier: '供应商 A' },
  { id: 2, name: '商品 B', price: 200, stock: 5, supplier: '供应商 B' },
])

const searchTerm = ref('')
const selectedProduct = ref(null)

function addProduct() {
  const newProduct = {
    id: products.value.length + 1,
    name: '新商品',
    price: 0,
    stock: 0,
    supplier: '新供应商',
  }
  products.value.push(newProduct)
}

function editProduct(product) {
  const index = products.value.findIndex((p) => p.id === product.id)
  if (index !== -1) {
    // 这里可以通过表单获取用户修改的信息
    products.value[index] = { ...product, name: '修改后的商品名称' }
  }
}

function deleteProduct(productId) {
  products.value = products.value.filter((product) => product.id !== productId)
}

function searchProducts() {
  return products.value.filter((product) => product.name.includes(searchTerm.value))
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">商品信息管理</h1>
    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <div class="flex justify-between items-center mb-4">
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
            @click="addProduct"
          >
            新增商品
          </button>
          <button
            v-if="selectedProduct"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            @click="deleteProduct(selectedProduct.id)"
          >
            删除商品
          </button>
        </div>
      </div>

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
          <tr v-for="product in searchProducts()" :key="product.id" class="hover:bg-gray-200 transition duration-200">
            <td class="border px-4 py-2">{{ product.id }}</td>
            <td class="border px-4 py-2">{{ product.name }}</td>
            <td class="border px-4 py-2">{{ product.price }}</td>
            <td class="border px-4 py-2">{{ product.stock }}</td>
            <td class="border px-4 py-2">{{ product.supplier }}</td>
            <td class="border px-4 py-2">
              <button class="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-400" @click="editProduct(product)">
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

    <div class="flex justify-between mt-4">
      <div>
        <!-- 分页逻辑（如适用） -->
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 2rem;
}
</style>
