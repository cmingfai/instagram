<script setup>

const {post}=defineProps(["post"])

const VITE_BASE_PHOTO_URL=import.meta.env.VITE_BASE_PHOTO_URL


</script>
<template>
    <ACard hoverable style="width: 340px;" class="card">
      <template #cover>
        <img alt="example" 
        :src="`${VITE_BASE_PHOTO_URL}${post.url}`" 
        height="340"
        />
      </template>
      <ACardMeta :title="post.username">
        <template #description>{{ post.caption }}</template>
      </ACardMeta>
    </ACard>
  </template>
  
  <style scoped>
.card {
    margin-bottom: 20px;
}
</style>
  
  