<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">导航栏</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55cpng.png" />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup >
  import { Expand, ArrowDown } from '@element-plus/icons-vue';
  import { ref } from 'vue';
  import { useAdminStore } from '../stores/admin';
  const handleCommand = (command) => {
    if(command == 'logout') {
      // 退出登录的逻辑
    }
  }

  const handleCollapse = () => {
    useAdminStore().toggleCollapse();
  }
</script>

<style scoped>
  .navbar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;
    .flex-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-title {
      font-size: 26px;
      font-weight: bold;
      color: #1f2937;
      margin-left: 20px;
    }
  }
</style>