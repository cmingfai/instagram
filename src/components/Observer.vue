<script setup>
import { ref, onMounted } from "vue"

const observer = ref(null)
const root = ref(null)
const emits=defineEmits(["intersect"])
const props=defineProps(["reachEnd"])

onMounted(() => {
        // console.log(root.value)
        observer.value = new IntersectionObserver(([entry]) => { 
            if (entry && entry.isIntersecting) {
                emits("intersect")
            }
        })
        observer.value.observe(root.value)
})
</script>

<template>
    <div class="observer" ref="root">
        <div v-if="!props.reachEnd">
            <ASpin /> 
        </div>
        <div v-else>
            <h3>No more posts.</h3>
        </div>
        
    </div>
</template>

<style scoped>
.observer {
    display:flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 140px;
}
</style>