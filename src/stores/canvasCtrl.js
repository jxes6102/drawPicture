import { ref } from "vue";
import { defineStore } from 'pinia'
import { fabric } from "fabric";
import img_1 from '@/assets/img/laugh-1.png'
import img_2 from '@/assets/img/laugh-2.png'
import img_3 from '@/assets/img/laugh-3.png'
import img_4 from '@/assets/img/laugh-4.png'
// import img_5 from '@/assets/img/laugh-5.png'
// import img_6 from '@/assets/img/laugh-6.png'
// import img_7 from '@/assets/img/laugh-7.png'
// import img_8 from '@/assets/img/laugh-8.png'
// import img_9 from '@/assets/img/laugh-9.png'
import img_10 from '@/assets/img/example-2.png'

export const useCanvasBaseStore = defineStore('canvasBase', () => {
    const canvas = ref(null)
    const setCanvas = (val) => {
        canvas.value = val
    }
    const dialogStatus = ref(false)
    const openDialogStatus = () => {
        dialogStatus.value = true
    }
    const closeDialogStatus = () => {
        dialogStatus.value = false
    }
    const errorMessage = ref('')
    const setErrorMessage = (val) => {
        errorMessage.value = val
    }
    const loading = ref(false)
    const openLoading = () => {
        loading.value = true
    }
    const closeLoading = () => {
        loading.value = false
    }
    const filePictureList = ref([])
    const addFilePictureList = (val) => {
        filePictureList.value.push(val)
    }
    const delFilePictureList = (val) => {
        filePictureList.value.splice(val,1)
    }
    const choseFilePictureList = (index) => {
        return filePictureList.value[index]
    }
    const mode = ref(1)
    const changeMode = (val) => {
        mode.value = val+1
    }
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
    const addBackgronndImgUrl = (val) => {
        backgronndImgUrl.value.push(val)
    }
    const delBackgronndImgUrl = (val) => {
        backgronndImgUrl.value.splice(val,1)
    }
    const choseBackgronndImgUrl = (index) => {
        return backgronndImgUrl.value[index || 0]
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
    const sizeObj = ref({
        backgroundWidth:0,
        backgroundHeight:0,
        imgWidth:0,
        imgHeight:0,
    })
    const setSizeObj = (val) => {
        sizeObj.value = val
    }
    const choseFile = ref('')
    const setChoseFile = (val) => {
        choseFile.value = val
    }
    //設定圖片尺寸
    const getImgSize = (index) => {
        return new Promise((resolve, reject) => {
            let countHeight = 0
            let countWidth = 0
            let image = new Image()
            let chose = choseBackgronndImgUrl(index)
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
        let chose = choseBackgronndImgUrl(index)
        
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
            
            canvas.value.setBackgroundImage(oImg).renderAll()

        })
        
    }
    // 解決套件刪除問題
    const recoverCanvasDom = () => {
        let canvasContainerCanvasDom = document.getElementsByClassName("canvas-container");
        if(canvasContainerCanvasDom.length){
            canvasContainerCanvasDom[0].remove();
            let canvasDivDom = document.getElementById("canvasDiv");
            let newCanvasDom = document.createElement('canvas');
            newCanvasDom.id = 'canvas'
            canvasDivDom.append(newCanvasDom);
        }
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
        
        fabric.Image.fromURL(choseFile.value, (myImg) => {
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

            canvas.value.add(img).renderAll();
        });
    }

    //初始畫布
    const createCanvas = () => {
        if(canvas.value){
            recoverCanvasDom()
        }

        setCanvas(
            new fabric.Canvas('canvas', {
                height: sizeObj.value.imgHeight, // 讓畫布以圖片比例縮放
                width: sizeObj.value.imgWidth, // 讓畫布以圖片比例縮放
                isDrawingMode: false, // 設置成 true 一秒變身小畫家
                hoverCursor: 'progress', // 移動時鼠標顯示
                freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
                backgroundColor: 'rgb(244,244,244)', // 背景色,
                //   backgroundImage: 'https://www.pakutaso.com/shared/img/thumb/neko1869IMG_9074_TP_V.jpg' // 背景圖片
            })
        )

        canvas.value.on('drop', dropImg)
    }


    return {
        canvas,
        setCanvas,
        loading,
        openLoading,
        closeLoading,
        filePictureList,
        addFilePictureList,
        delFilePictureList,
        choseFilePictureList,
        mode,
        changeMode,
        modeData,
        backgronndImgUrl,
        addBackgronndImgUrl,
        delBackgronndImgUrl,
        choseBackgronndImgUrl,
        fontFamilyOptions,
        sizeObj,
        setSizeObj,
        choseFile,
        setChoseFile,
        dialogStatus,
        openDialogStatus,
        closeDialogStatus,
        errorMessage,
        setErrorMessage,
        getImgSize,
        reBackground,
        recoverCanvasDom,
        dropImg,
        createCanvas,
    }
})
