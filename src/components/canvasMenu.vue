<template>
    <div class="w-[10%] h-[100%] max-w-[120px] bg-blue-300">
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
    <div class="relative w-[25%] h-[100%] max-w-[350px] bg-green-300 overflow-y-auto overflow-x-hidden">
        <div class="relative w-full h-full p-2 flex flex-col justify-start items-start gap-[10px]">
            <div class="w-full text-3xl flex flex-wrap justify-center items-center">{{modeData[mode-1].font}}</div>
            <template v-if="mode == 1">
                <div class="w-full h-auto flex flex-wrap justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                    <input class="w-full" @change="onFileChangedBackground($event)" type="file" id="myFile" name="filename">
                    <div
                        v-for="(item, index) in backgronndImgUrl" :key="index"
                        @click="setBackground(index)"
                        class="w-[10vw] h-[10vw] max-w-[150px] max-h-[150px]">
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
                                class="w-[10vw] h-[10vw] max-w-[150px] max-h-[150px]">
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
    
</template>

<script setup>
import { jsPDF } from "jspdf";
import { useMobileStore } from '@/stores/index'
import { useCanvasBaseStore } from '@/stores/canvasCtrl'
import { fabric } from "fabric";
import { ref,computed } from "vue";
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
const textForm = ref({
    text:'',
    size:100,
    color:'#000000',
    fontWeight:400,
    fontFamily:'Arial'
})
const filePictureList = computed(() => {
    return canvasBaseStore.filePictureList
})
const canvas = computed(() => {
    return canvasBaseStore.canvas
})
const mode = computed(() => {
    return canvasBaseStore.mode
})
const modeData = computed(() => {
    return canvasBaseStore.modeData
})
const backgronndImgUrl = computed(() => {
    return canvasBaseStore.backgronndImgUrl
})
const fontFamilyOptions = computed(() => {
    return canvasBaseStore.fontFamilyOptions
})
const sizeObj = computed(() => {
    return canvasBaseStore.sizeObj
})
//設定背景
const setBackground = async(index) => {

    if(loading.value){
        return false
    }
    canvasBaseStore.openLoading()

    await canvasBaseStore.getImgSize(index).then((res)=> {
        canvasBaseStore.setSizeObj({
            backgroundWidth:0,
            backgroundHeight:0,
            imgWidth:res.width,
            imgHeight:res.height,
        })

        canvasBaseStore.createCanvas()

        canvasBaseStore.reBackground(index,res)
    })
    canvasBaseStore.closeLoading()
}
//切換模式
const changeMode = (val) => {
    canvasBaseStore.changeMode(val)
}
//從背景選單新增圖片
const onFileChangedBackground = async(event) => {
    if(checkFileType(event.target.files[0].type)){
        canvasBaseStore.setErrorMessage('請上傳正確圖片格式')
        canvasBaseStore.openDialogStatus()
        return false
    }
    canvasBaseStore.addBackgronndImgUrl(await toBase64(event.target.files[0]))
}
//從圖片選單新增圖片
const onFileChangedPicture = async(event) => {
    if(checkFileType(event.target.files[0].type)){
        canvasBaseStore.setErrorMessage('請上傳正確圖片格式')
        canvasBaseStore.openDialogStatus()
        return false
    }
    canvasBaseStore.addFilePictureList(await toBase64(event.target.files[0]))
}
//檢查檔案
const checkFileType = (type) => {
    let checkArr = ['png','jpeg','jpg']
    for(let item of checkArr){
        if(type.includes(item)){
            return false
        }
    }
    return true
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
    canvasBaseStore.delFilePictureList(val)
}
//從圖片選單選擇圖片
const choseImg = (index) => {
    canvasBaseStore.setChoseFile(canvasBaseStore.choseFilePictureList(index))
}
//刪除已選物件
const delSelectObj = () => {
    let target = canvas.value.getActiveObject()

    if(target){
        canvas.value.remove(target);
        canvas.value.renderAll()
    }
    
    if(target?._objects?.length){
        for(let item of target?._objects){
            canvas.value.remove(item)
        }
        canvas.value.renderAll()
    }
}
//新增文字
const addText = () => {
    const text = new fabric.Text(textForm.value.text, {
        left: sizeObj.value.imgWidth/2,
        top: sizeObj.value.imgHeight/2,
        // left: 0,
        // top: 0,
        fill: textForm.value.color,
        fontFamily: textForm.value.fontFamily,// 字型
        fontSize: textForm.value.size, // 字體大小
        fontWeight: textForm.value.fontWeight,// 字體粗細
        cornerStrokeColor: "#8A2BE2",//設定框限控制方框顏色
        borderColor:"#8A2BE2",
        isMoving:true
    })
    canvas.value.add(text)
    cancelSelect()
}
//把物件往上一層
const up = () => {
    let target = canvas.value.getActiveObject()
    if(target){
        canvas.value.bringForward(target)
        canvas.value.renderAll()
        cancelSelect()
    }
}
//把物件移置最上層
const finalUp = () => {
    let target = canvas.value.getActiveObject()
    if(target){
        canvas.value.bringToFront(target)
        canvas.value.renderAll()
        cancelSelect()
    }
}
//把物件往下一層
const down = () => {
    let target = canvas.value.getActiveObject()
    if(target){
        canvas.value.sendBackwards(target)
        canvas.value.renderAll()
        cancelSelect()
    }
}
//把物件移置最底層
const finalDown = () => {
    let target = canvas.value.getActiveObject()
    if(target){
        canvas.value.sendToBack(target)
        canvas.value.renderAll()
        cancelSelect()
    }
}
//刪除畫布所有物件
const delAll = () => {
    let target = canvas.value.getObjects();

    if(target.length){
        for(let item of target){
            canvas.value.remove(item)
        }
        canvas.value.renderAll()
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
    let data = canvas.value.toDataURL().replace('image/png','image/jpeg')
    downFile(data)
}
//輸出檔案
const exportPNG = () => {
    let data = canvas.value.toDataURL();
    downFile(data)
}
//輸出檔案
const exportPDF = () => {
    let data = canvas.value.toDataURL();
    const doc = new jsPDF('portrait','','a4');
    doc.addImage(data, "PNG", 5, 10);
    doc.save('測試圖片'+ Date.now() +".pdf");
}
// 取消選取物件
const cancelSelect = () => {
    canvas.value.discardActiveObject().renderAll();
}

</script>
