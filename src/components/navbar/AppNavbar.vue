<template>
  <VaNavbar class="app-layout-navbar py-2 px-0">
    <template #left>
      <div class="left">
        <span class="welcome-message">管理员您好，欢迎进入超市结算系统</span>
      </div>
    </template>
    <template #right>
      <div class="right">
        <img
          src="https://img-bsy.txrpic.com/Element/00/88/63/12/549f4792_E886312_4b2c4691XZ.png?imageMogr2/quality/90/thumbnail/320x%3E"
          alt="用户头像"
          class="user-avatar"
        />
        <span class="username">admin</span>
      </div>
    </template>
  </VaNavbar>
</template>
<script setup lang="ts">
defineProps({
  isMobile: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
.va-navbar {
  z-index: 2;

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      display: flex;
      justify-content: space-between;
    }
  }
}

.left {
  display: flex;
  align-items: center;
  margin-left: 1rem;

  & > * {
    margin-right: 1rem;
  }

  & > *:last-child {
    margin-right: 0;
  }
}
.right {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px; /* 你可以根据需要调整头像大小 */
  height: 40px; /* 你可以根据需要调整头像大小 */
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px; /* 头像与用户名之间的间距 */
}

.username {
  font-size: 16px; /* 字体大小 */
  color: #333; /* 字体颜色，可以根据需要调整 */
}
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: transform 0.5s ease;
}

.icon-fade-enter,
.icon-fade-leave-to {
  transform: scale(0.5);
}
.welcome-message {
  font-size: 18px; /* 增大字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: #007bff; /* 调整字体颜色 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
</style>
