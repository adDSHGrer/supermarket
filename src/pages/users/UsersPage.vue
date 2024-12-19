<script lang="ts" setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: '用户 A', email: 'userA@example.com', role: '管理员' },
  { id: 2, name: '用户 B', email: 'userB@example.com', role: '普通用户' },
])

const searchTerm = ref('')
const selectedUser = ref(null)

function addUser() {
  const newUser = {
    id: users.value.length + 1,
    name: '新用户',
    email: 'newuser@example.com',
    role: '普通用户',
  }
  users.value.push(newUser)
}

function editUser(user) {
  const index = users.value.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    // 这里可以通过表单获取用户修改的信息
    users.value[index] = { ...user, name: '修改后的用户姓名' } // 示例修改
  }
}

function deleteUser(userId) {
  users.value = users.value.filter((user) => user.id !== userId)
}

function searchUsers() {
  return users.value.filter((user) => user.name.includes(searchTerm.value) || user.email.includes(searchTerm.value))
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">用户管理</h1>
    <section class="bg-white shadow-md rounded-lg p-6 mb-4">
      <div class="flex justify-between items-center mb-4">
        <div class="relative w-full">
          <input
            v-model="searchTerm"
            placeholder="搜索用户..."
            class="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex space-x-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            @click="addUser"
          >
            新增用户
          </button>
          <button
            v-if="selectedUser"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            @click="deleteUser(selectedUser.id)"
          >
            删除用户
          </button>
        </div>
      </div>

      <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">姓名</th>
            <th class="py-2 px-4">邮箱</th>
            <th class="py-2 px-4">角色</th>
            <th class="py-2 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in searchUsers()" :key="user.id" class="hover:bg-gray-200 transition duration-200">
            <td class="border px-4 py-2">{{ user.id }}</td>
            <td class="border px-4 py-2">{{ user.name }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ user.role }}</td>
            <td class="border px-4 py-2">
              <button class="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-400" @click="editUser(user)">
                编辑
              </button>
              <button class="bg-gray-500 text-white px-2 rounded hover:bg-gray-400 ml-2" @click="selectedUser = user">
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

ssh-keygen -t ed25519 -C "3556881940@qq.com"
