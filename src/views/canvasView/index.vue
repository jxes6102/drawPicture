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
        <div ref="canvasDiv" id="canvasDiv" class="w-[65%] h-[100%] flex flex-wrap justify-center items-center">
            <canvas id="canvas"></canvas>
        </div>
        <div class="relative w-[25%] h-[100%] bg-green-300 overflow-y-auto overflow-x-hidden">
            <div class="relative w-full h-full p-2 flex flex-col justify-start items-start gap-[10px]">
                <div class="w-full text-3xl flex flex-wrap justify-center items-center">{{modeData[mode-1].font}}</div>
                <template v-if="mode == 1">
                    <div class="w-full h-auto flex flex-wrap justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                        <input class="w-full" @change="onFileChangedBackground($event)" type="file" id="myFile" name="filename">
                        <div
                            v-for="(item, index) in backgronndImgUrl" :key="index"
                            @click="setBackground(false,index)"
                            class="w-[10vw] h-[10vw] ">
                            <img class="w-full h-full" :src="item" alt="">
                        </div>
                    </div>
                </template>
                <template v-if="mode == 2">
                    <div class="w-full h-[45%] p-1 flex flex-wrap justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                        <div class="w-auto h-auto flex flex-wrap justify-start items-start gap-[10px]">
                            <input class="w-full" @change="onFileChangedPicture($event)" type="file" id="myFile" name="filename">
                            <div
                                v-for="(item, index) in filePictureList" :key="index"
                                class="w-auto h-auto flex flex-col justify-center items-center ">
                                <div
                                    @dragstart="choseImg(index)" 
                                    class="w-[10vw] h-[10vw]">
                                    <img class="w-full h-full" :src="item" alt="">
                                </div>
                                <button @click="delFile(index)">刪除</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                        <button @click="cancelSelect">取消選取物件</button>
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
                    
                    <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                        <button @click="cancelSelect">取消選取物件</button>
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
import { jsPDF } from "jspdf";
import { useMobileStore } from '@/stores/index'
import { fabric } from "fabric";
import { useElementSize } from '@vueuse/core'
import { ref,computed,onMounted,nextTick } from "vue";
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
import img_10 from '@/assets/img/example-2.png'
/*
mode 1背景 2圖片 3文字 4匯出
fontFamilyOptions 字體清單
sizeObj 尺寸細項
textForm 文字細項
*/
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
const filePictureList = ref([])
const isMobile = computed(() => {
    return mobileStore.isMobile
})
const { width: canvasDivWidth, height: canvasDivHeight } = useElementSize(canvasDiv)
let canvas = null
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
    img_10,
    // img_5,
    // img_6,
    // img_7,
    // img_8,
    // img_9,
])
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
let sizeObj = {
    backgroundWidth:0,
    backgroundHeight:0,
    imgWidth:0,
    imgHeight:0,
}
let choseFile = ''
//設定圖片尺寸
const getImgSize = (index) => {
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
//渲染背景
const reBackground = async(index,imgData) => {
    let chose = backgronndImgUrl.value[index || 0]
    
    fabric.Image.fromURL(chose, (img) => {

        const oImg = img.set({
            left: 0,
            top: 0,
            // left: (canvasDivWidth.value - imgData.width)/2,
            // top: (canvasDivHeight.value - imgData.height)/2,
            // scaleX: (imgData.width/img.width).toFixed(2),
            // scaleY: (imgData.height/img.height).toFixed(2),
            // angle: 0,
            // width: imgData.width,
            // height: imgData.height,
        })

        oImg.scaleToHeight(imgData.height)
     
        canvas.setBackgroundImage(oImg).renderAll()

    })
    
}
//設定背景
const setBackground = async(isInit,index) => {

    if(loading.value){
        return false
    }
    loading.value = true

    await getImgSize(index).then((res)=> {

        sizeObj.backgroundWidth = canvasDivWidth.value
        sizeObj.backgroundHeight = canvasDivHeight.value
        sizeObj.imgWidth = res.width
        sizeObj.imgHeight = res.height

        createCanvas(isInit)

        reBackground(index,res)
    })
    loading.value = false
}
//切換模式
const changeMode = (val) => {
    mode.value = val+1
}
//從背景選單新增圖片
const onFileChangedBackground = async(event) => {
    backgronndImgUrl.value.push(await toBase64(event.target.files[0]))
}
//從圖片選單新增圖片
const onFileChangedPicture = async(event) => {
    filePictureList.value.push(await toBase64(event.target.files[0]))
}
//轉換檔案格式
const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
//從圖片選單刪除圖片
const delFile = (val) => {
    filePictureList.value.splice(val,1)
}
//從圖片選單選擇圖片
const choseImg = (index) => {
    choseFile = filePictureList.value[index]
}
//拖曳事件處理
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
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
            // width:150,
            // height:150
        });
        
        img.scaleToHeight(countHeight)

        canvas.add(img).renderAll(); 
    });
}
//刪除已選物件
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
//新增文字
const addText = () => {
    const text = new fabric.Text(textForm.value.text, {
        left: sizeObj.imgWidth/2,
        top: sizeObj.imgHeight/2,
        // left: 0,
        // top: 0,
        fill: textForm.value.color,
        fontFamily: textForm.value.fontFamily,// 字型
        fontSize: textForm.value.size, // 字體大小
        fontWeight: textForm.value.fontWeight,// 字體粗細
        cornerStrokeColor: "#8A2BE2",//設定框限控制方框顏色
        borderColor:"#8A2BE2",
    })
    canvas.add(text)
    cancelSelect()
}
//把物件往上一層
const up = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.bringForward(target)
        canvas.renderAll()
        cancelSelect()
    }
}
//把物件移置最上層
const finalUp = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.bringToFront(target)
        canvas.renderAll()
        cancelSelect()
    }
}
//把物件往下一層
const down = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.sendBackwards(target)
        canvas.renderAll()
        cancelSelect()
    }
}
//把物件移置最底層
const finalDown = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.sendToBack(target)
        canvas.renderAll()
        cancelSelect()
    }
}
//刪除畫布所有物件
const delAll = () => {
    var target = canvas.getObjects();

    if(target.length){
        for(let item of target){
            canvas.remove(item)
        }
        canvas.renderAll()
    }
}
//文字顏色改變
const changeColor = (val) => {
    if(!val){
        textForm.value.color = '#000000'
    }
}
//下載檔案
const downFile = (data) => {
    let downItem = document.createElement('a')
    downItem.download = '測試圖片'+ Date.now()
    downItem.href = data;
    downItem.click()
}
//輸出檔案
const exportJPG = () => {
    let data = canvas.toDataURL().replace('image/png','image/jpeg')
    downFile(data)
}
//輸出檔案
const exportPNG = () => {
    let data = canvas.toDataURL();
    downFile(data)
}
//輸出檔案
const exportPDF = () => {
    let data = canvas.toDataURL();
    const doc = new jsPDF('portrait','','a4');
    doc.addImage(data, "PNG", 5, 10);
    doc.save('測試圖片'+ Date.now() +".pdf");
}
//初始畫布
const createCanvas = (isInit = false) => {
    if(canvas){
        recoverCanvasDom()
    }

    canvas = new fabric.Canvas('canvas', {
        height: sizeObj.imgHeight, // 讓畫布以圖片比例縮放
        width: sizeObj.imgWidth, // 讓畫布以圖片比例縮放
        isDrawingMode: false, // 設置成 true 一秒變身小畫家
        hoverCursor: 'progress', // 移動時鼠標顯示
        freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
        backgroundColor: 'rgb(244,244,244)', // 背景色,
        //   backgroundImage: 'https://www.pakutaso.com/shared/img/thumb/neko1869IMG_9074_TP_V.jpg' // 背景圖片
    })

    canvas.on('drop', dropImg)
}
// 解決套件刪除問題
const recoverCanvasDom = () => {
    let canvasContainerCanvasDom = document.getElementsByClassName("canvas-container");
    canvasContainerCanvasDom[0].remove();

    let canvasDivDom = document.getElementById("canvasDiv");

    let newCanvasDom = document.createElement('canvas');
    newCanvasDom.id = 'canvas'
    canvasDivDom.append(newCanvasDom);
    
}
// 取消選取物件
const cancelSelect = () => {
    canvas.discardActiveObject().renderAll();
}

onMounted(() => {

    // init()

    // // 變更所有物件畫出的控制項
    // fabric.Object.prototype.drawControls = function (ctx, styleOverride) {
    //     // 複寫他，改成什麼都不畫
    // }
    
    setBackground(true)
    
})

</script>