<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">商品搜索</h1>

    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <header class="flex justify-between items-center mb-4">
        <div class="relative w-full">
          <input
            v-model="searchUUID"
            placeholder="输入商品UUID搜索..."
            class="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg abs right-0 top-0 hover:bg-blue-600 transition duration-200"
            @click="searchProductByUUID"
          >
            查询商品
          </button>
        </div>
      </header>

      <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">名称</th>
            <th class="py-2 px-4">价格</th>
            <th class="py-2 px-4">选择</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in foundProducts"
            :key="product.goods_id"
            class="hover:bg-gray-200 transition duration-200"
          >
            <td class="border px-4 py-2">{{ product.qr_code }}</td>
            <td class="border px-4 py-2">{{ product.name }}</td>
            <td class="border px-4 py-2">{{ product.price }}</td>
            <td class="border px-4 py-2">
              <button
                class="bg-green-500 text-white px-2 rounded hover:bg-green-400"
                @click="addSelectedProduct(product)"
              >
                添加
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 class="text-lg font-semibold mb-4">已选商品</h2>
      <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4">名称</th>
            <th class="py-2 px-4">价格</th>
            <th class="py-2 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in selectedProducts"
            :key="product._id"
            class="hover:bg-gray-200 transition duration-200"
          >
            <td class="border px-4 py-2">{{ product.name }}</td>
            <td class="border px-4 py-2">{{ product.price }}</td>
            <td class="border px-4 py-2">
              <button class="bg-red-500 text-white px-2 rounded hover:bg-red-400" @click="removeSelectedProduct(index)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <footer class="bg-white shadow-md rounded-lg p-4">
      <h2 class="text-lg font-semibold">总计: {{ totalPrice }}</h2>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        @click="checkout"
      >
        结算
      </button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const searchUUID = ref('')
const foundProducts = ref<Product[]>([])
const selectedProducts = ref<Product[]>([])

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

const searchProductByUUID = async () => {
  if (!searchUUID.value) return
  try {
    console.log('搜索商品', searchUUID.value)
    const response = await fetch(`http://localhost:15002/get_goods_by_uuid/${searchUUID.value}`)
    if (!response.ok) throw new Error('未找到商品')

    const data = await response.json()
    foundProducts.value = data.data ? [data.data] : []
  } catch (error) {
    console.error('搜索商品时出错', error)
    foundProducts.value = []
  }
}

const addSelectedProduct = (product: Product) => {
  selectedProducts.value.push(product) // 直接添加，不检查重复
}

const removeSelectedProduct = (index: number) => {
  selectedProducts.value.splice(index, 1) // 删除选中的商品
}

const totalPrice = computed(() => {
  return selectedProducts.value.reduce((acc, product) => acc + product.price, 0)
})

const checkout = async () => {
  if (selectedProducts.value.length > 0) {
    const orderData = {
      products: selectedProducts.value,
      totalPrice: totalPrice.value,
    }
    console.log('提交订单', orderData)
    try {
      const response = await fetch('http://localhost:15002/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('结算失败')

      const result = await response.json()
      alert(`${result.message}`)
      // 这里可以清空已选商品
      selectedProducts.value = []
    } catch (error) {
      console.error('结算时出错', error)
      alert('结算过程中发生错误，请重试')
    }
  } else {
    alert('请先添加商品')
  }
}
</script>

<style>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 2rem;
}
</style>
