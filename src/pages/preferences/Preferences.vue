<template>
  <div class="flex flex-col p-4 space-y-10 bg-backgroundSecondary rounded-lg">
    <div class="text-center">
      <p class="mt-4 text-gray-500">此页面尚未完成。贴张图先</p>
      <img
        src="https://img.jiaobu365.com/excel_img/2019upload/excel/5cf25dce2aca1_thumb.jpg"
        alt="未完成"
        class="rounded"
      />
    </div>
  </div>
  <EditNameModal v-if="isEditNameModalOpen" @cancel="isEditNameModalOpen = false" />
  <ResetPasswordModal v-if="isResetPasswordModalOpen" @cancel="isResetPasswordModalOpen = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import EditNameModal from './modals/EditNameModal.vue'
import ResetPasswordModal from './modals/ResetPasswordModal.vue'

const isEditNameModalOpen = ref(false)
const isResetPasswordModalOpen = ref(false)
</script>
