<template>
    <div v-if="!isMobile" class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center">
        <div class="w-[10%] h-[100%] bg-blue-300">
            <div class="relative w-full h-auto p-2 flex flex-col justify-start items-center gap-[10px]">
                <div
                    v-for="(item, index) in modeData" :key="index"
                    @click="changeMode(index)"
                    class="relative w-full h-auto p-2 flex flex-col justify-center items-center">
                    <el-icon :size="80"><component :is="item.icon"></component></el-icon>
                    <div>{{item.font}}</div>
                </div>
                
            </div>
        </div>
        <div ref="canvasDiv" class="w-[65%] h-[100%]">
            <canvas id="canvas"></canvas>
        </div>
        <div class="relative w-[25%] h-[100%] bg-green-300 overflow-y-auto overflow-x-hidden">
            <div class="relative w-full h-full p-2 flex flex-col justify-start items-start gap-[10px]">
                <div class="w-full text-3xl flex flex-wrap justify-center items-center">{{modeData[mode-1].font}}</div>
                <template v-if="mode == 1">
                    <div class="w-full h-full flex flex-wrap justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                        <div
                            v-for="(item, index) in backgronndImgUrl" :key="index"
                            @click="setBackground(index)"
                            class="w-[10vw] h-[10vw] ">
                            <img class="w-full h-full" :src="item" alt="">
                        </div>
                    </div>
                </template>
                <template v-if="mode == 2">
                    <div class="w-full h-[45%] p-1 flex flex-wrap justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                        <input class="w-full" @change="onFileChanged($event)" type="file" id="myFile" name="filename">
                        <div
                            v-for="(item, index) in fileList" :key="index"
                            class="w-auto h-[50%] flex flex-col justify-center items-center ">
                            <div
                                @dragstart="choseImg(index)" 
                                class="w-[10vw] h-[10vw]">
                                <img class="w-full h-full" :src="item" alt="">
                            </div>
                            <button @click="delFile(index)">刪除</button>
                        </div>
                    </div>
                    
                    <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                        <button @click="delSelectObj">刪除已選物件</button>
                        <button @click="up">移到上一層</button>
                        <button @click="finalUp">移到最上層</button>
                        <button @click="down">移到後一層</button>
                        <button @click="finalDown">移到最底層</button>
                        <button @click="delAll">刪除全部</button>
                    </div>
                </template>
                <template v-if="mode == 3">

                    <div class="w-full h-[45%] p-1 flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                        <div class="w-full h-auto flex flex-wrap justify-start items-center">
                            <input class="w-full px-1" type="text" v-model="textForm.text">
                        </div>
                        <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                            <div class="px-2">大小</div>
                            <div class="w-[70%]">
                                <el-slider :min="50" :max="300"  v-model="textForm.size" />
                            </div>
                        </div>
                        <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                            <div class="px-2">顏色</div>
                            <el-color-picker @active-change="changeColor" v-model="textForm.color" />
                        </div>
                        <!-- <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                            <div class="px-2">大小</div>
                            <div class="w-[70%]">
                                <el-slider :min="100" :max="900" :step="100" v-model="textForm.fontWeight" />
                            </div>
                        </div> -->
                        <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                            <div class="px-2">字型</div>
                            <div class="w-[70%]">
                                <el-select
                                    v-model="textForm.fontFamily"
                                    class="m-2"
                                    placeholder=""
                                >
                                    <el-option
                                        v-for="item in fontFamilyOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </div>
                        </div>
                        <div class="w-full h-auto flex flex-wrap justify-start items-center">
                            <button @click="addText" class="w-full">送出</button>
                        </div>
                        
                    </div>
                    
                    <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[10px]">
                        <button @click="delSelectObj">刪除已選物件</button>
                        <button @click="up">移到上一層</button>
                        <button @click="finalUp">移到最上層</button>
                        <button @click="down">移到後一層</button>
                        <button @click="finalDown">移到最底層</button>
                        <button @click="delAll">刪除全部</button>
                    </div>
                    
                </template>
                <template v-if="mode == 4">
                    <div class="w-full h-full flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                        <button @click="exportJPG">匯出JPG</button>
                        <button @click="exportPNG">匯出PNG</button>
                        <button @click="exportPDF">匯出PDF</button>
                    </div>
                </template>
                
            </div>
            
        </div>
    </div>
    <div class="w-full h-full flex flex-wrap justify-center items-center text-2xl font-bold" v-else>
        不能用手機
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
const textForm = ref({
    text:'',
    size:100,
    color:'#000000',
    fontWeight:400,
    fontFamily:'Arial'
})

const isMobile = computed(() => {
  return mobileStore.isMobile
})

const { width: canvasDivWidth, height: canvasDivHeight } = useElementSize(canvasDiv)
let canvas = null
//1背景 2圖片 3文字 4匯出
const mode = ref(1)
const modeData = ref(
    [
        {
            icon:'Expand',
            font:'背景'
        },
        {
            icon:'Expand',
            font:'圖片'
        },
        {
            icon:'Expand',
            font:'文字'
        },
        {
            icon:'Expand',
            font:'匯出'
        },
    ]
)
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
            // angle: 0,
            // width: imgData.width,
            // height: imgData.height,
        })

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

const changeMode = (val) => {
    mode.value = val+1
}

const fileList = ref([])
const onFileChanged = async(event) => {
    // console.log('event',event.target.files[0])
    fileList.value.push(await toBase64(event.target.files[0]))
    // console.log('fileList',fileList.value)
}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const delFile = (val) => {
    fileList.value.splice(val,1)
}

let choseFile = ''
const choseImg = (index) => {
    // console.log('index',index)
    choseFile = fileList.value[index]
}

const dropImg = (e) => {
    if(mode.value !== 2){
        return false
    }

    let dropPosition = {
        left:e.e.offsetX,
        height:e.e.offsetY
    }
    
    fabric.Image.fromURL(choseFile, (myImg) => {
        let countHeight = 0
        let countWidth = 0

        if(myImg.height>myImg.width){
            countHeight = 200
            countWidth = parseInt((countHeight*(myImg.width/myImg.height)).toFixed())
        }else{
            countWidth = 200
            countHeight = parseInt((countWidth*(myImg.height/myImg.width)).toFixed())
        }

        const img = myImg.set({
            left: dropPosition.left,
            top: dropPosition.height,
            // width:150,
            // height:150
        });
        
        img.scaleToHeight(countHeight)

        canvas.add(img).renderAll(); 
    });
}

const delSelectObj = () => {
    let target = canvas.getActiveObject()

    if(target){
        canvas.remove(target);
        canvas.renderAll()
    }
    
    if(target?._objects?.length){
        for(let item of target?._objects){
            canvas.remove(item)
        }
        canvas.renderAll()
    }
}

const addText = () => {
    // console.log('addText',textForm.value)

    const text = new fabric.Text(textForm.value.text, {
        left: canvasDivWidth.value/2,
        top: canvasDivHeight.value/2,
        fill: textForm.value.color,
        fontFamily: textForm.value.fontFamily,// 字型
        fontSize: textForm.value.size, // 字體大小
        fontWeight: textForm.value.fontWeight,// 字體粗細
    })
    canvas.add(text)
}

const fontFamilyOptions = [
  {
    value: 'Arial',
    label: 'Arial',
  },
  {
    value: 'Verdana',
    label: 'Verdana',
  },
  {
    value: 'Tahoma',
    label: 'Tahoma',
  },
  {
    value: 'Trebuchet MS',
    label: 'Trebuchet MS',
  },
  {
    value: 'Times New Roman',
    label: 'Times New Roman',
  },
  {
    value: 'Georgia',
    label: 'Georgia',
  },
  {
    value: 'Garamond',
    label: 'Garamond',
  },
  {
    value: 'Courier New',
    label: 'Courier New',
  },
  {
    value: 'Brush Script MT',
    label: 'Brush Script MT',
  },
]
// Arial (sans-serif)
// Verdana (sans-serif)
// Tahoma (sans-serif)
// Trebuchet MS (sans-serif)
// Times New Roman (serif)
// Georgia (serif)
// Garamond (serif)
// Courier New (monospace)
// Brush Script MT (cursive)

const up = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.bringForward(target)
        canvas.renderAll()
    }
}
const finalUp = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.bringToFront(target)
        canvas.renderAll()
    }
}
const down = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.sendBackwards(target)
        canvas.renderAll()
    }
}
const finalDown = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.sendToBack(target)
        canvas.renderAll()
    }
}

const delAll = () => {
    var target = canvas.getObjects();

    if(target.length){
        for(let item of target){
            canvas.remove(item)
        }
        canvas.renderAll()
    }
}

const changeColor = (val) => {
    // console.log('val',val)
    if(!val){
        textForm.value.color = '#000000'
    }
}

const exportJPG = () => {
    console.log('exportJPG')
}
const exportPNG = () => {
    console.log('exportPNG')
}
const exportPDF = () => {
    console.log('exportPDF')
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

    canvas.on('drop', dropImg)
    
    setBackground()
    
})

</script>