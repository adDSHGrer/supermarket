<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">订单信息管理</h1>

    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <header class="flex justify-between items-center mb-4">
        <div class="relative w-full">
          <input
            v-model="searchTerm"
            placeholder="搜索订单编号..."
            class="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex space-x-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            @click="openAddModal"
          >
            新增订单
          </button>
          <button
            v-if="selectedOrder"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            @click="deleteOrder(selectedOrder.order_id)"
          >
            删除订单
          </button>
        </div>
      </header>

      <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4">订单ID</th>
            <th class="py-2 px-4">商品编号</th>
            <th class="py-2 px-4">购买数量</th>
            <th class="py-2 px-4">单价</th>
            <th class="py-2 px-4">总价</th>
            <th class="py-2 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, orderId) in filteredGroupedOrders" :key="orderId">
            <tr class="bg-gray-200">
              <td colspan="6" class="font-bold py-2 px-4">{{ orderId }}</td>
            </tr>
            <tr
              v-for="order in group"
              :key="order.checkout_id"
              class="hover:bg-gray-200 transition duration-200"
              :class="{ 'bg-blue-100': selectedOrder && selectedOrder.checkout_id === order.checkout_id }"
            >
              <td class="border px-4 py-2">{{ order.order_id }}</td>
              <td class="border px-4 py-2">{{ order.goods_id }}</td>
              <td class="border px-4 py-2">{{ order.quantity }}</td>
              <td class="border px-4 py-2">{{ order.unit_price }}</td>
              <td class="border px-4 py-2">{{ order.total_price }}</td>
              <td class="border px-4 py-2">
                <button class="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-400" @click="openEditModal(order)">
                  编辑
                </button>
                <button
                  class="bg-gray-500 text-white px-2 rounded hover:bg-gray-400 ml-2"
                  @click="selectedOrder = order"
                >
                  选择
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <!-- 弹出框 -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">{{ isEditMode ? '编辑订单' : '新增订单' }}</h2>
        <label>订单编号：</label>
        <input v-model="editOrderData.order_id" class="border rounded p-1 mb-2 w-full" />

        <label>商品编号：</label>
        <input v-model="editOrderData.goods_id" class="border rounded p-1 mb-2 w-full" />

        <label>购买数量：</label>
        <input v-model="editOrderData.quantity" type="number" class="border rounded p-1 mb-2 w-full" />

        <label>单价：</label>
        <input v-model="editOrderData.unit_price" type="number" class="border rounded p-1 mb-2 w-full" />

        <label>总价：</label>
        <input v-model="editOrderData.total_price" type="number" class="border rounded p-1 mb-2 w-full" />

        <div class="flex justify-end">
          <button class="bg-blue-500 text-white p-2 rounded mr-2" @click="saveOrder">
            {{ isEditMode ? '保存' : '新增' }}
          </button>
          <button class="bg-gray-500 text-white p-2 rounded" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

const orders = ref<Sale[]>([])
const searchTerm = ref('')
const selectedOrder = ref<Sale | null>(null)
const showModal = ref(false)
const editOrderData = ref<Sale | null>(null)
const isEditMode = ref(false)

interface Sale {
  checkout_id: string
  order_id: string
  goods_id: string
  quantity: number
  unit_price: number
  total_price: number
  paid_amount: number
  change_amount: number
  checkout_date: string
}

// 计算属性：根据订单ID对订单进行分组
const groupedOrders = computed(() => {
  const groups = orders.value.reduce((acc: Record<string, Record<string, Sale>>, order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = {}
    }
    if (!acc[order.order_id][order.goods_id]) {
      acc[order.order_id][order.goods_id] = { ...order }
    } else {
      const existing = acc[order.order_id][order.goods_id]
      existing.quantity += order.quantity
      existing.total_price += order.quantity * order.unit_price
    }
    return acc
  }, {})

  // 转换为更适合渲染的数据结构
  return Object.entries(groups).reduce(
    (result, [orderId, goods]) => {
      result[orderId] = Object.values(goods)
      return result
    },
    {} as Record<string, Sale[]>,
  )
})

const filteredGroupedOrders = computed(() => {
  // 获取分组后的订单
  const grouped = groupedOrders.value

  if (!searchTerm.value.trim()) {
    return grouped // 如果没有搜索关键字，返回全部分组订单
  }

  const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase()
  const filtered = Object.entries(grouped).reduce(
    (result, [orderId, orders]) => {
      if (orderId.toLowerCase().includes(lowerCaseSearchTerm)) {
        result[orderId] = orders // 如果订单号匹配，保留该组
      }
      return result
    },
    {} as Record<string, Sale[]>,
  )

  return filtered
})

const openAddModal = () => {
  editOrderData.value = {
    checkout_id: '',
    order_id: '',
    goods_id: '',
    quantity: 0,
    unit_price: 0,
    total_price: 0,
    paid_amount: 0,
    change_amount: 0,
    checkout_date: new Date().toISOString(),
  }
  isEditMode.value = false
  showModal.value = true
}

const openEditModal = (order: Sale) => {
  editOrderData.value = { ...order }
  isEditMode.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveOrder = async () => {
  if (editOrderData.value) {
    try {
      const response = isEditMode.value ? await updateOrder() : await addOrder()
      if (response && response.success) {
        closeModal()
      }
    } catch (error) {
      console.error(isEditMode.value ? '更新订单失败' : '添加订单失败', error)
    }
  }
}

const updateOrder = async () => {
  if (!editOrderData.value) {
    console.error('editOrderData.value 为空')
    return
  }

  const response = await fetch(`http://localhost:15002/update_sale/${editOrderData.value.checkout_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editOrderData.value),
  })

  if (!response.ok) throw new Error('更新订单失败')

  const index = orders.value.findIndex((order) => order.checkout_id === editOrderData.value!.checkout_id)
  if (index !== -1) {
    orders.value[index] = { ...editOrderData.value }
  }
  return { success: true }
}

const addOrder = async () => {
  const response = await fetch('http://localhost:15002/add_sale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editOrderData.value),
  })

  if (!response.ok) throw new Error('添加订单失败')

  const addedOrder = await response.json()
  orders.value.push({ ...editOrderData.value, checkout_id: addedOrder.data.checkout_id })
  return { success: true }
}

async function fetchAllOrders() {
  try {
    const response = await fetch('http://localhost:15002/get_all_sales')
    if (!response.ok) throw new Error('网络响应不是有效的')

    const data = await response.json()
    orders.value = data.data
  } catch (error) {
    console.error('获取订单信息失败', error)
  }
}

async function deleteOrder(orderId: string) {
  try {
    const response = await fetch(`http://localhost:15002/delete_sale/${orderId}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('删除订单失败')
    await fetchAllOrders()
    orders.value = orders.value.filter((order) => order.checkout_id !== orderId)
  } catch (error) {
    console.error('删除订单失败', error)
  }
}

onMounted(() => {
  fetchAllOrders()
})
</script>

<style>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 2rem;
}
</style>
