<script setup>
  import { ref, reactive } from 'vue';
  import {useUserStore} from "../stores/users"
  import { storeToRefs } from 'pinia';

  const {isLogin}=defineProps(['isLogin'])
  const visible = ref(false);
  const userStore=useUserStore()
  const {errorMessage,loading, user}=storeToRefs(userStore)

  const userCredentials=reactive({
    email:"",
    password:"",
    username:""
  })
  
 

  const showModal = () => {
    visible.value = true;
  };
  
  const clearUserCredentailsInput=()=>{
    userCredentials.username=""
    userCredentials.email=""
    userCredentials.password=""
    userStore.clearErrorMessage()
  }

  const handleOk = async (e) => {
    if (isLogin) {
      await userStore.handleLogin({
        password:userCredentials.password,
        email: userCredentials.email
      })
    } else {
      await userStore.handleSignup(userCredentials)
    }

    if (user.value) {
      visible.value=false
      clearUserCredentailsInput()
    }
  };

  const handleCancel=()=>{
    clearUserCredentailsInput()
    visible.value=false
  }

  const title=isLogin?'Login':'Signup'
  </script>
  
  <template>
    <div>
      <AButton type="primary" @click="showModal" class="btn">{{title}}</AButton>
      <AModal v-model:visible="visible" :title="title" @ok="handleOk">
        <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton 
        :disble="loading" 
        key="submit" 
        type="primary"
         @click="handleOk"
         >
         Submit</AButton>
      </template>
        <div v-if="!loading" class="input-conatiner">
          <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username"/>
        <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />
        <AInput class="input" v-model:value="userCredentials.password" placeholder="Password" type="password" />
        </div>
        <div v-else class="spinner">
          <ASpin/>
        </div>
        <ATypographyText v-if="errorMessage" type="danger">{{ errorMessage }}</ATypographyText>
      </AModal>
    </div>
  </template>
  

  <style scoped>
    .btn {
        margin-left: 10px;
    }

    .input {
        margin-top: 5px;
    }

    .input-container {
      height: 120px;
    }

   .spinner {
    display:flex;
    align-items: center;
    justify-content: center;
    height: 120px;
   }
</style>
  