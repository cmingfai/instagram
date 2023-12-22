<script setup>
import {ref} from "vue"
import {RouterLink} from "vue-router"
import Container from "./Container.vue"
import AuthModal from "./AuthModal.vue";
import {useRouter} from "vue-router"
import {useUserStore} from "../stores/users"
import { storeToRefs } from 'pinia';

const router=useRouter()
const searchUsername=ref("")
const userStore=useUserStore()

const {user,loadingUser} =storeToRefs(userStore)
const onSearch=()=>{
    if (searchUsername.value) {
        router.push(`/profile/${searchUsername.value}`)
        searchUsername.value=""
    }
}

const handleLogout=async () => {
    await userStore.handleLogout()
}

const goToUsersProfile=()=> {
    router.push(`/profile/${user.value.username}`)
}
</script>

<template>
 <ALayout class="layout">
    <ALayoutHeader>
        <Container>
        <div class="nav-container">
            <div class="right-content">
                <RouterLink to="/">Instagram</RouterLink>   
            <AInputSearch
      v-model:value="searchUsername"
      placeholder="username..."
      style="width: 200px"
      @search="onSearch"
    /> 
            </div>

            <div class="content" v-if="!loadingUser">
                <div class="left-content" v-if="!user">
                <AuthModal :isLogin="false"/>
                <AuthModal :isLogin="true"/>
                </div>
   
                <div class="left-content" v-else>
                <AButton type="primary" @click="goToUsersProfile">Profile</AButton>
                <AButton type="primary" @click="handleLogout">Logout</AButton>
                </div>
            </div>

        </div>
        </Container>
    </ALayoutHeader>
 </ALayout>
</template>

<style scoped>
.nav-container {
   display: flex;
   justify-content: space-between;
}

.right-content {
    display: flex;
    align-items: center;
}

.right-content a {
    margin-right: 10px;
}

.left-content {
    display: flex;
    align-items: center;
}

.left-content button {
    margin-left: 10px;
}

.content {
    display:flex;
    align-items: center;
    justify-content: center;
}
</style>