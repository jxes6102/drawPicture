<template>
    <div class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center">
        <div class="w-[10%] h-[100%] bg-blue-300"></div>
        <div ref="canvasDiv" class="w-[65%] h-[100%]">
            <canvas id="canvas"></canvas>
        </div>
        <div class="relative w-[25%] h-[100%] bg-green-300 overflow-y-auto overflow-x-hidden">
            <div class="relative w-full h-auto p-2 flex flex-wrap justify-start items-start gap-[10px]">
                <div
                    v-for="(item, index) in backgronndImgUrl" :key="index"
                    @click="setBackground(index)"
                    class="w-[10vw] h-[10vw] ">
                    <img class="w-full h-full" :src="item" alt="">
                </div>
            </div>
            
        </div>
    </div>
    
</template>

<script setup>
import { useMobileStore } from '@/stores/index'
import { fabric } from "fabric";
import { useElementSize } from '@vueuse/core'
import { ref,computed,onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import img_1 from '@/assets/img/laugh-1.png'
import img_2 from '@/assets/img/laugh-2.png'
import img_3 from '@/assets/img/laugh-3.png'
import img_4 from '@/assets/img/laugh-4.png'
import img_5 from '@/assets/img/laugh-5.png'
import img_6 from '@/assets/img/laugh-6.png'
import img_7 from '@/assets/img/laugh-7.png'
import img_8 from '@/assets/img/laugh-8.png'
import img_9 from '@/assets/img/laugh-9.png'

const mobileStore = useMobileStore()
const loading = ref(false)
const canvasDiv = ref(null)
const isMobile = computed(() => {
  return mobileStore.isMobile
})
const { width: canvasDivWidth, height: canvasDivHeight } = useElementSize(canvasDiv)

let canvas = null

const backgronndImgUrl = ref([
    img_1,
    img_2,
    img_3,
    img_4,
    img_5,
    img_6,
    img_7,
    img_8,
    img_9
])

let movingImage
let imgDragOffset = {
  offsetX: 0,
  offsetY: 0
}

const saveImg = (e) => {
  if( e.target.tagName.toLowerCase() === 'img' ){
    // 這邊先計算點擊圖片的何處，等滑鼠放開後要重新計算起始座標
    imgDragOffset.offsetX = e.clientX - e.target.offsetLeft
    imgDragOffset.offsetY = e.clientY - e.target.offsetTop
    movingImage = e.target
  }
}

const getImgSize = (index) => {
    // console.log('getImgSize')
    return new Promise((resolve, reject) => {
        let countHeight = 0
        let countWidth = 0
        let image = new Image()
        let chose = backgronndImgUrl.value[index || 0]
        image.src = chose;

        image.onload = () => {

            if(image.height>image.width){
                countHeight = 600
                countWidth = parseInt((countHeight*(image.width/image.height)).toFixed())
            }else{
                countWidth = 600
                countHeight = parseInt((countWidth*(image.height/image.width)).toFixed())
            }
            resolve({width:countWidth,height:countHeight})
            
        };
        image.onerror = reject
    })
}

const reBackground = async(index,imgData) => {
    let chose = backgronndImgUrl.value[index || 0]
    
    fabric.Image.fromURL(chose, (img) => {

        const oImg = img.set({
            // scaleX: (imgData.width/img.width).toFixed(2),
            // scaleY: (imgData.height/img.height).toFixed(2),
            left: (canvasDivWidth.value - imgData.width)/2,
            top: (canvasDivHeight.value - imgData.height)/2,
            angle: 0,
            // width: imgData.width,
            // height: imgData.height,
            // scaleX: imgData.width / canvasDivWidth.value ,
            // scaleY: imgData.width / canvasDivWidth.value,
        })
        // oImg.scaleToWidth(imgData.width)
        oImg.scaleToHeight(imgData.height)
     
        canvas.setBackgroundImage(oImg).renderAll()

        // console.log('canvas',canvas)
        // console.log('json',canvas.toJSON())
    })
    
}

const setBackground = async(index) => {
    if(loading.value){
        return false
    }
    loading.value = true
    await getImgSize(index).then((res)=> {
        reBackground(index,res)
    })
    loading.value = false
}

onMounted(() => {

    canvas = new fabric.Canvas('canvas', {
        height: canvasDivHeight.value, // 讓畫布同視窗大小
        width: canvasDivWidth.value, // 讓畫布同視窗大小
        isDrawingMode: false, // 設置成 true 一秒變身小畫家
        hoverCursor: 'progress', // 移動時鼠標顯示
        freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
        backgroundColor: 'rgb(55,55,55)', // 背景色,
        //   backgroundImage: 'https://www.pakutaso.com/shared/img/thumb/neko1869IMG_9074_TP_V.jpg' // 背景圖片
    })

    // const rect = new fabric.Rect({
    //     width: 100,
    //     height: 100,
    //     top: 0,
    //     left: 0,
    //     fill: 'red'
    // })

    // canvas.add(rect)
    
    setBackground()
    
    
})

</script>