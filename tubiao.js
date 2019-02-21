import {ChangeDate,deepClone} from './index.js'
export function Draw() {
  var canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.width = 400
  canvas.height = 300
  canvas.style.background = 'rgba(255,255,255,.8)'
  var cxt = canvas.getContext('2d')
  var door = true
  this.init=function(opt){
    if (door) {
      document.body.appendChild(canvas)
      door = false
    }
    canvas.style.display = 'block'
    canvas.style.left = (opt.x+400) > document.body.offsetWidth ? opt.x-440 +'px' : opt.x +'px'
    canvas.style.top = opt.y +'px'
    this.x = canvas.width*.8 //x轴长度
    this.y = canvas.height*.8 //y轴长度
    this.startx = canvas.width*.1 //x原点
    this.starty = canvas.height*.9
    this.disy = this.y/5
    this.disx = this.x/7
    this.lineWith = opt.l || 1
    this.font = '14px FangSong'
    this.pointx = opt.pointx || 6
    this.pointy = opt.pointy || 7
    this.yAngleArr = []
    this.xAngleArr = []
    this.data = opt.data || {} //传入数据为了显示
  }
  this.drawLine=function() {
      cxt.lineWidth = this.lineWith
      cxt.strokeStyle = '#579bdf'
      cxt.beginPath()
      cxt.moveTo(this.startx,this.starty)
      cxt.lineTo(this.startx,canvas.height*.1)
      cxt.stroke()
      for (var i = 0; i <this.pointx; i++) {
        var arr = []
        arr.push(this.startx)
        arr.push(this.starty-this.disy*i)
        cxt.beginPath()
        cxt.moveTo(this.startx,this.starty-this.disy*i)
        cxt.lineTo(canvas.width*.9,this.starty-this.disy*i)
        cxt.stroke()
        this.yAngleArr.push(arr)
      }
      cxt.strokeStyle = 'red'
      for (var i = 1; i < this.pointy; i++) {
        var arr = []
        arr.push(this.startx+this.disx*i)
        arr.push(this.starty)
        cxt.beginPath()
        cxt.moveTo(this.startx+this.disx*i,this.starty)
        cxt.lineTo(this.startx+this.disx*i,this.starty-8)
        cxt.stroke()
        this.xAngleArr.push(arr)
      }
      this.xAngleArr.unshift([this.startx,this.starty])
    }
    this.drawAngle = function () {
      cxt.beginPath()
      cxt.moveTo(this.startx-3,canvas.height*.1)
      cxt.lineTo(this.startx+3,canvas.height*.1)
      cxt.lineTo(this.startx,canvas.height*.1-10)
      cxt.fillStyle = '#579bdf'
      cxt.fill()
      cxt.beginPath()
      cxt.moveTo(canvas.width*.9,this.starty-3)
      cxt.lineTo(canvas.width*.9,this.starty+3)
      cxt.lineTo(canvas.width*.9+10,this.starty)
      cxt.fillStyle = '#579bdf'
      cxt.fill()
    }
    this.drawNum = function () {
      // console.log(this.xAngleArr);
       var date,h,m,s,begin,startTime,spacing
       date = new Date()
       // startTime = date.getTime() - 2*60*60*1000
       spacing = 20*60*1000
       var analysisX = this.disx/spacing//每隔1ms移动多少距离
       h = date.getHours()
      var startH = h- 2 > -1 ? h-2 : h+24
      date.setHours(startH)
       s = date.getSeconds()
       m = parseInt(date.getMinutes())
       h = parseInt(date.getHours())
       cxt.beginPath()
       cxt.font= 'bold 10px FangSong'
       cxt.fillStyle = '#000'
       for (var i = 0; i < 7; i++) {
          if (m>59) {
           m = parseInt(check(m-60))
           h = h + 1
         }
         begin = check(h)+':'+check(m)+':'+check(s)
         cxt.fillText(begin,this.xAngleArr[i][0]-20,this.xAngleArr[i][1]+15)
         m = m+20
       }

       function check (m) {
         m = '0'+ m
         return m.slice(-2)
       }
       cxt.font = this.font
       cxt.fillText('显示最近2小时的数据显示',120,25)
       if (this.data) {
         var arr = []
          var dis = Math.ceil(this.data.data.length/30)
          this.data.data.forEach((val,index) => {
            if (index%dis == 0) {
              arr.push(val)
            }
          })
          var temp  = deepClone(arr)
          arr.sort((a,b)=>{
            return a.SensorValue - b.SensorValue
          })
          var a = Math.floor(arr[0].SensorValue)
          var b = Math.ceil(arr[arr.length-1].SensorValue)
          var k = (b-a)/5 == 0 ? a/5 : (b-a)/5  //每个间隔距离的插值
          var analysisY = this.disy/k
          cxt.fillStyle = '#000'
          for (var i = 0; i < 6; i++) {
            cxt.fillText(a+k*i,this.yAngleArr[i][0]-30,this.yAngleArr[i][1])
          }
          cxt.fill()
          arr = temp
          cxt.beginPath()
          // cxt.strokeStyle = '#012345'
          startTime = new Date().getTime() -2*60*60*1000
          arr.forEach((val,index)=>{
            var currentTime = new ChangeDate(val.Time).gettime()
            var x = (currentTime - startTime)*analysisX+this.startx
            var currentValue = val.SensorValue
            var y = this.starty - (currentValue - a)*analysisY
            if (index == 0) {
                cxt.moveTo(x,y)
            }else {
              cxt.lineTo(x,y)
            }
          })
          cxt.stroke()
       }
    }
    this.distroy= function () {
      cxt.clearRect(0,0,400,300)
      canvas.style.display = 'none'
    }
  }
