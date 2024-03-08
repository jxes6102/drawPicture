<template>
    <div v-if="!isMobile" class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center">
        <canvasMenu />
        <div ref="canvasDiv" id="canvasDiv" class="grow w-[65%] h-[100%] bg-[rgb(220,220,220,0.5)] flex flex-wrap justify-center items-center">
            <canvas id="canvas"></canvas>
        </div>
    </div>
    <div class="w-full h-full flex flex-wrap justify-center items-center text-2xl font-bold" v-else>
        不能用手機
    </div>
    <Teleport to="body">
        <dialogView v-if="dialogStatus" @close="cancel" type="auto">
            <template v-slot:title></template>
            <template v-slot:message>
                <div class="h-[20vh] text-2xl text-red-700 font-bold flex flex-wrap justify-center items-center">
                    {{errorMessage}}
                </div> 
            </template>
            <template v-slot:control></template>
        </dialogView>
    </Teleport>
    
</template>

<script setup>
import { useMobileStore } from '@/stores/index'
import { useCanvasBaseStore } from '@/stores/canvasCtrl'
import { useElementSize } from '@vueuse/core'
import { ref,computed,onMounted,watch } from "vue";
import { useRouter,useRoute } from "vue-router";
import dialogView from "@/components/dialogView.vue";
import canvasMenu from "@/components/canvasMenu.vue";
/*
mode 1背景 2圖片 3文字 4匯出
*/
const isMobile = computed(() => {
    return mobileStore.isMobile
})
const mobileStore = useMobileStore()
const canvasBaseStore = useCanvasBaseStore()
const loading = computed(() => {
    return canvasBaseStore.loading
})
const canvasDiv = ref(null)
const { width: canvasDivWidth, height: canvasDivHeight } = useElementSize(canvasDiv)
const canvas = computed(() => {
    return canvasBaseStore.canvas
})
const dialogStatus = computed(() => {
    return canvasBaseStore.dialogStatus
})
const errorMessage = computed(() => {
    return canvasBaseStore.errorMessage
})
watch(isMobile, (newVal, oldVal) => {
    if(!newVal){
        setBackground()
    }
})
//設定背景
const setBackground = async(index) => {

    if(loading.value){
        return false
    }
    canvasBaseStore.openLoading()

    await canvasBaseStore.getImgSize(index).then((res)=> {

        canvasBaseStore.setSizeObj({
            backgroundWidth:canvasDivWidth.value,
            backgroundHeight:canvasDivHeight.value,
            imgWidth:res.width,
            imgHeight:res.height,
        })

        canvasBaseStore.createCanvas()

        canvasBaseStore.reBackground(index,res)
    })
    canvasBaseStore.closeLoading()
}

//關閉彈出視窗
const cancel = () => {
    canvasBaseStore.closeDialogStatus()
}

onMounted(() => {

    // // 變更所有物件畫出的控制項
    // fabric.Object.prototype.drawControls = function (ctx, styleOverride) {
    //     // 複寫他，改成什麼都不畫
    // }
    
    setBackground()
    
})

</script>
