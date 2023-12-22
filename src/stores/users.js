import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from "../supabase"

export const useUserStore = defineStore('users', () => {
  const user = ref(null)
  const errorMessage = ref("")
  const loading=ref(false)
  const loadingUser=ref(false)

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials) => {
    const {email,password}=credentials

    if (!validateEmail(email)) {
      return errorMessage.value = "Email is invalid"
    }

    if (!password.length) {
      return errorMessage.value="Password cannot be empty"
    }

    loading.value=true

    const {error} = await supabase.auth.signInWithPassword({
      email,password
    })

    if (error) {
      loading.value=false
      return errorMessage.value=error.message
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq('email', email)
      .single()


     user.value={
       email: existingUser.email,
       username: existingUser.username,
       id: existingUser.id
     }

     loading.value=false
     errorMessage.value=""
   }

  const handleSignup = async (credentials) => {
    console.log(credentials)
    const { email, password, username } = credentials

    if (password.length < 6) {
      return errorMessage.value = "Password length is too short"
    }

    if (username.length < 4) {
      return errorMessage.value = "Username length is too short"
    }

    if (!validateEmail(email)) {
      return errorMessage.value = "Email is invalid"
    }

    loading.value=true

    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq('username', username)
      .single()

    console.log("userWithUsername:", userWithUsername)

    if (userWithUsername) {
      loading.value=false
      // console.log("username ", username, "already exists.")
      return errorMessage.value = "User already registered"
    }



    let { error, data } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      loading.value=false
      return errorMessage.value = error.message
    }


    errorMessage.value = ""


    await supabase.from("users").insert(
      {
        username,
        email,
        user_id: data.user.id
      }
    )

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq('email', email)
      .single()

    user.value={
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value=false
  }

  const handleLogout = async () => { 
    await supabase.auth.signOut()
    user.value=null
  }

  const getUser = async () => {
   loadingUser.value=true
    const {data}=await supabase.auth.getUser()

    if (!data.user) { 
      loadingUser.value=false
      return user.value=null
    }

    const {data:userWithEmail}=await supabase
    .from("users")
    .select()
    .eq("email",data.user.email)
    .single()


    user.value={
      username:userWithEmail.username,
      email:userWithEmail.email,
      id:userWithEmail.id
    }

    loadingUser.value=false
   }

  const clearErrorMessage = () => {
    errorMessage.value = ""
  }

  return {
    user, 
    errorMessage, 
    loading,
    loadingUser,
    handleLogin, 
    handleSignup, 
    handleLogout, 
    getUser,
    clearErrorMessage
   
  }
})
