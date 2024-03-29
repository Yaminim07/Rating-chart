import {calculateBoxSize, greaterThanMaximumPadding, checkHexValue} from './helper.js'

var newId = ''

export class Rating {

  constructor(container, input) {
    this._svg = {
      container: '',
      svgElement: null,
      width: 600,
      height: 100,
      noOfStars: 5,
      rating: 3,
      fill: '#ff0000',
      ratedFill: '#ff0000',
      unratedFill: '#FA8072',
      stroke: '#000000',
      ratedStroke: '#666666',
      unratedStroke: '#666666',
      strokeWidth: 0,
      orientation: 'LtoR',
      justifyContent: 'start',
      alignItems: 'start',
      flow: 'column',
      padding: 2,
      box: 100,
      stars: [],
      hasAnimationFrame: false,
      onUpdate: null,
      onDraw: null,
      onPredraw : null
    }

    this._path = {
      elem: '',
      d: '',
      startWidth: 0,
      startHeight: 0,
      increment: 0
    }

    this._defs = {
      container: '',
      grad1: '',
      grad1Id: '',
      grad1X2: 0,
      grad1Y2: 0
    }

    this._gradient = {
      container: '',
      stop1: '',
      offset1: '',
      stopColor1: '',
      stop2: '',
      offset2: '',
      stopColor2: '',
    }

    this._newSvg = {}

    this._svg.container = container
    if( !input ){
      window.requestAnimationFrame(() => this._createSvg())
    }else{
      if (this._validate(input)) {
        if (!this._svg.hasAnimationFrame)
          window.requestAnimationFrame(() => this._createSvg())
      } else {
        console.error('Invalid properties to draw SVG')
        this._svg.hasAnimationFrame = true;
      }
    }
  }

  _validate(obj){

    this._newSvg = {}

    var drawSvg = true

    if (obj.width && obj.width > 10 && !isNaN(obj.width)) {
      this._newSvg.width = obj['width']
    } 

    if (obj.height && obj.height > 10 && !isNaN(obj.height)) {
      this._newSvg.height = obj['height']
    }

    if (obj.fill && checkHexValue(obj.fill)) {
      this._newSvg.fill = obj['fill']
    }

    if (obj.ratedFill && checkHexValue(obj.ratedFill)) {
      this._newSvg.ratedFill = obj['ratedFill']
    }

    if (obj.unratedFill && checkHexValue(obj.unratedFill)) {
      this._newSvg.unratedFill = obj['unratedFill']
    }

    if (obj.stroke && checkHexValue(obj.stroke)) {
      this._newSvg.stroke = obj['stroke']
    }

    if (obj.ratedStroke && checkHexValue(obj.ratedStroke)) {
      this._newSvg.ratedStroke = obj['ratedStroke']
    }

    if (obj.unratedStroke && checkHexValue(obj.unratedStroke)) {
      this._newSvg.unratedStroke = obj['unratedStroke']
    }

    if (obj.strokeWidth && !isNaN(obj.strokeWidth) && obj.strokeWidth > 0) {
      this._newSvg.strokeWidth = obj['strokeWidth']
    }

    if (obj.flow && ['row', 'column'].includes(obj.flow)) {
      this._newSvg.flow = obj['flow']
    }

    if (obj.orientation && ['LtoR', 'RtoL', 'TtoB', 'BtoT'].includes(obj.orientation)) {
      this._newSvg.orientation = obj['orientation']
    }

    if (obj.noOfStars) {
      if (!isNaN(obj.noOfStars) && !(obj.noOfStars < 0) && !(obj.noOfStars === 0)) {
        this._newSvg.noOfStars = obj['noOfStars']
      } else {
        drawSvg = false
      }
    }

    if (obj.rating && !isNaN(obj.rating) && obj.rating > 0 && obj.rating <= this._svg.noOfStars) {
      this._newSvg.rating = obj['rating']
    } else if (obj.rating > this._svg.noOfStars) {
      this._newSvg.rating = this._svg.noOfStars
    }
    this._newSvg.box = calculateBoxSize(this._newSvg.width, this._newSvg.height, this._newSvg.flow, this._newSvg.noOfStars)

    if (obj.padding && !isNaN(obj.padding) && !(greaterThanMaximumPadding(this._newSvg.box, obj.padding)) && (obj.padding > 0)) {
      this._newSvg.padding = obj.padding
    }

    if (obj.justifyContent && ['start', 'end', 'center', 'spaceEvenly'].includes(obj.justifyContent)) {
      this._newSvg.justifyContent = obj.justifyContent
    }

    if (obj.alignItems && ['start', 'end', 'center'].includes(obj.alignItems)) {
      this._newSvg.alignItems = obj.alignItems
    }
    if (obj.onUpdate && typeof obj.onUpdate === 'function') {
      this._newSvg.onUpdate = obj.onUpdate
    }

    if (obj.onDraw && typeof obj.onDraw === 'function') {
      this._newSvg.onDraw = obj.onDraw
    }

    if (drawSvg) {
      return true
    } else {
      return false
    }
  }

  _createSvg(){
    if(this._svg.onPredraw)
    this._svg.onPredraw()

    this._svg.hasAnimationFrame = true

    this._svg.box = calculateBoxSize(this._svg.width, this._svg.height, this._svg.orientation, this._svg.noOfStars)

    if(!this._svg.svgElement){
      let svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
      svg.setAttribute('width',this._svg.width)
      svg.setAttribute('height',this._svg.height)
      this._svg.svgElement = svg
      this._svg.container.appendChild(svg)
    }

    if(this._svg.stars.length === 0){
      let startWidth, startHeight, increment
      if (this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL') { 
        if (this._svg.justifyContent === 'start') {
          startWidth = this._svg.box / 2
          increment = this._svg.box
        } else if (this._svg.justifyContent === 'end') {
          startWidth = this._svg.box / 2 + (this._svg.width) - (this._svg.box * this._svg.noOfStars)
          increment = this._svg.box
        } else if (this._svg.justifyContent === 'center') {
          startWidth = this._svg.box / 2 + ((this._svg.width) - (this._svg.box * this._svg.noOfStars)) / 2
          increment = this._svg.box
        } else {
          startWidth = this._svg.box / 2 + (this._svg.width - (this._svg.box * this._svg.noOfStars)) / (this._svg.noOfStars)
          increment = this._svg.box + (this._svg.width - (this._svg.box * this._svg.noOfStars)) / (this._svg.noOfStars)
        }
  
        if (this._svg.alignItems === 'start') {
          startHeight = this._svg.padding
        } else if (this._svg.alignItems === 'center') {
          startHeight = this._svg.padding + (this._svg.height - this._svg.box) / 2
        } else {
          startHeight = this._svg.padding + (this._svg.height - this._svg.box)
        }
      }

      else{ // for column flow
        if (this._svg.justifyContent === 'start') {
          startWidth = this._svg.box / 2
          increment = this._svg.box
        } else if (this._svg.justifyContent === 'end') {
          startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.box)
          increment = this._svg.box
        } else if (this._svg.justifyContent === 'center') {
          startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.box) / 2
          increment = this._svg.box
        } else {
          startWidth = this._svg.box / 2 + (this._svg.width - (this._svg.box * this._svg.noOfStars)) / (this._svg.noOfStars)
          increment = this._svg.box + (this._svg.width - (this._svg.box * this._svg.noOfStars)) / (this._svg.noOfStars)
        }
  
        if (this._svg.alignItems === 'start') {
          startHeight = (this._svg.padding)
        } else if (this._svg.alignItems === 'center') {
          startHeight = (this._svg.padding) + (this._svg.height - (this._svg.box * this._svg.noOfStars)) / 2
        } else {
          startHeight = (this._svg.padding) + (this._svg.height - (this._svg.box * this._svg.noOfStars))
        }
      }

      let rated = Math.trunc(this._svg.rating)
      for(let i = 0;i < this._svg.noOfStars; i++){
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        let d = this._dAttr(startWidth, startHeight)
        let fillColor, strokeColor;
        if(i < rated){
          fillColor = this._svg.ratedFill
          strokeColor = this._svg.ratedStroke
        }
        else{
          fillColor = this._svg.unratedFill
          strokeColor = this._svg.unratedStroke
        }
        path.setAttribute('d', d)
        path.setAttribute('fill', fillColor)
        path.setAttribute('stroke-width', this._svg.strokeWidth)
        path.setAttribute('stroke', strokeColor)
        this._svg.svgElement.appendChild(path)
        let pObject = {}
        pObject.elem = path
        pObject.startWidth = startWidth
        pObject.startHeight = startHeight
        pObject.increment = increment
        this._svg.stars.push(pObject)
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL')
        startWidth += increment
        else
        startHeight += increment 
      }

      let fracRating = ((this._svg.rating - Math.trunc(this._svg.rating)).toFixed(2)) * 100
      // this._createGradient(fracRating)
      let gradientStar

      if (['LtoR', 'TtoB'].includes(this._svg.orientation)) {
        gradientStar = Math.trunc(this._svg.rating)
      }else{
        gradientStar = gradientStar = (this._svg.noOfStars) -  Math.trunc(this._svg.rating)
      }

      // if(fracRating){
      //   if(gradientStar < this._svg.noOfStars){
      //     this._svg.stars[gradientStar].elem.setAttribute('fill', 'url(#' + this._defs.grad1Id + ')')
      //   }

      // }
    }

    if(this._newSvg.width){

      
      
      this._svg.svgElement.setAttribute('width',this._newSvg.width)
      this._svg.width = this._newSvg.width
    }

    if(this._newSvg.height){
      this._svg.svgElement.setAttribute('height',this._newSvg.height)
      this._svg.height = this._newSvg.height
    }
    
    if(this._newSvg.noOfStars && this._newSvg['noOfStars'] !== this._svg.noOfStars){
      let rated = Math.trunc(this._svg.rating)
      if(this._newSvg.noOfStars < this._svg.noOfStars){
        for(let i = this._newSvg.noOfStars;i < this._svg.noOfStars; i++){
            let path = this._svg.stars.pop()
            this._svg.svgElement.removeChild(path.elem)
        }
      }
      else{
        this._svg.box = calculateBoxSize(this._svg.width, this._svg.height, this._svg.flow, this._newSvg.noOfStars)
        let xShift = this._svg.box / 2, yShift = 0,inc = this._svg.box;        
        for(let i = 0; i < this._newSvg.noOfStars; i++){        
          if(i < this._svg.noOfStars){
            let d 
            d = this._dAttr(xShift, yShift)
            this._svg.stars[i].elem.setAttribute('d',d)
            this._svg.stars[i].startWidth = xShift
            this._svg.stars[i].startHeight = yShift
            this._svg.stars[i].increment = inc
            if(this._svg.flow === 'row')
            xShift += inc
            else
            yShift += inc
          }
        
          else{
          let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          let pObject = {}
          let d 
          xShift = 0 
          yShift = 0
          inc = this._svg.stars[i-1].increment
          if(this._svg.flow === 'row')
          xShift = this._svg.stars[i-1].startWidth + this._svg.stars[i-1].increment
          else
          yShift = this._svg.stars[i-1].startHeight + this._svg.stars[i-1].increment
          if(i < rated){
            path.setAttribute('fill',this._svg.ratedFill)
            path.setAttribute('stroke',this._svg.ratedStroke)
          }
          else{
            path.setAttribute('fill',this._svg.unratedFill)
            path.setAttribute('stroke',this._svg.unratedStroke)
          }
          path.setAttribute('stroke-width',this._svg.strokeWidth)
          pObject.elem = path
          pObject.startWidth = xShift
          pObject.startHeight = yShift
          pObject.increment = inc
          d = this._dAttr(xShift, yShift)
          path.setAttribute('d', d)
          this._svg.svgElement.appendChild(path)
          this._svg.stars.push(pObject)
          }
        }
      }

      this._svg.noOfStars = this._newSvg.noOfStars
      if(this._svg.rating > this._svg.noOfStars)
      this._svg.rating = this._svg.noOfStars
    }

    // if(this._newSvg.ratedFill || this._newSvg.ratedStroke){
    //   let rated = Math.trunc(this._svg.rating)
    //   for(let i = 0;i < rated;  i++){
    //     if(this._newSvg.ratedFill)
    //     this._svg.stars[i].elem.setAttribute('fill',this._newSvg.ratedFill) 
    //     if(this._newSvg.ratedStroke)
    //     this._svg.stars[i].elem.setAttribute('stroke',this._newSvg.ratedStroke) 
    //   }

    //   this._defs.grad1.stopColor1 = this._newSvg.ratedFill
    //   this._defs.grad1.stop1.setAttribute('stop-color', this._defs.grad1.stopColor1)

    //   if(this._newSvg.ratedFill)
    //   this._svg.ratedFill = this._newSvg.ratedFill
    //   if(this._newSvg.ratedStroke)
    //   this._svg.ratedStroke = this._newSvg.ratedStroke
    // }

    if(this._newSvg.unratedFill || this._newSvg.unratedStroke){
      let rated = Math.trunc(this._svg.rating)
      for(let i = rated;i < this._svg.noOfStars;  i++){
        if(this._newSvg.unratedFill)
        this._svg.stars[i].elem.setAttribute('fill',this._newSvg.unratedFill) 
        if(this._newSvg.unratedStroke)
        this._svg.stars[i].elem.setAttribute('stroke',this._newSvg.unratedStroke) 
      }

      this._defs.grad1.stopColor2 = this._newSvg.unratedFill
      this._defs.grad1.stop2.setAttribute('stop-color', this._defs.grad1.stopColor2)

      if(this._newSvg.unratedFill)
      this._svg.unratedFill = this._newSvg.unratedFill
      if(this._newSvg.unratedStroke)
      this._svg.unratedStroke = this._newSvg.unratedStroke
    }

    // if(this._newSvg.rating){
    //   let diff = (this._svg.rating > this._newSvg.rating) ? (Math.trunc(this._svg.rating) - Math.trunc(this._newSvg.rating)) : (Math.trunc(this._newSvg.rating) - Math.trunc(this._svg.rating))
    //   let count = 0;
    //   let rated
    //   if(this._svg.rating > this._newSvg.rating){
    //     if(this._svg.rating === this._svg.noOfStars)
    //     rated = this._svg.rating - 1
    //     else
    //     rated = Math.trunc(this._svg.rating)
    //   }else{
    //     rated = Math.trunc(this._svg.rating)
    //   }
    //   console.log(diff)
    //   while(count < diff){
    //     if(this._svg.rating > this._newSvg.rating){
    //       this._svg.stars[rated].elem.setAttribute('fill', this._svg.unratedFill)
    //       this._svg.stars[rated].elem.setAttribute('stroke', this._svg.unratedStroke)
    //     }else{
    //       this._svg.stars[rated].elem.setAttribute('fill',this._svg.ratedFill)
    //       this._svg.stars[rated].elem.setAttribute('stroke',this._svg.ratedStroke)
    //     }
    //     rated = (this._svg.rating > this._newSvg.rating) ? (rated - 1) : (rated + 1)
    //     count++
    //   }

    //   let fracRating = this._newSvg.rating - Math.trunc(this._newSvg.rating)
    //   if(fracRating){
    //     let offset = (this._newSvg.rating - (Math.trunc(this._newSvg.rating))).toFixed(2) * 100
    //     this._defs.grad1.stop1.setAttribute('offset', offset + '%')
    //     this._defs.grad1.stop2.setAttribute('offset', (100 - offset) + '%')
    //     this._defs.grad1.offset1 = offset
    //     this._defs.grad1.offset2 = (100 - offset)
    //     this._svg.stars[Math.trunc(this._newSvg.rating)].elem.setAttribute('fill', 'url(#' + this._defs.grad1Id + ')')
    //   }  
    //   this._svg.rating = this._newSvg.rating
    // }

    if(this._newSvg.padding){
      let prevPadding = this._svg.padding
      this._svg.padding = this._newSvg.padding
      for(let i = 0;i < this._svg.stars.length; i++){
        if(prevPadding > this._newSvg.padding)
        this._svg.stars[i].startHeight += this._newSvg.padding
        else
        this._svg.stars[i].startHeight -= this._newSvg.padding
        this._svg.stars[i].d = this._dAttr(this._svg.stars[i].startWidth, this._svg.stars[i].startHeight)
        this._svg.stars[i].elem.setAttribute('d', this._svg.stars[i].d)
      }
    }

    if(this._newSvg.orientation && (this._svg.orientation !== this._newSvg.orientation)){

      if(((['LtoR','RtoL'].includes(this._newSvg.orientation)) && (['TtoB','BtoT'].includes(this._svg.orientation))) || ((['TtoB','BtoT'].includes(this._newSvg.orientation)) && (['LtoR','RtoL'].includes(this._svg.orientation)))){
        let startWidth, startHeight
        this._svg.box = calculateBoxSize(this._svg.width, this._svg.height, this._newSvg.orientation, this._svg.noOfStars)

        if(this._svg.justifyContent == 'start')
        startWidth = this._svg.box / 2

        else{

          if(['TtoB','BtoT'].includes(this._newSvg.orientation)){
            if(this._svg.justifyContent == 'center')
            startWidth = (this._svg.box / 2) + ((this._svg.width - this._svg.box) / 2)

            else if(this._svg.justifyContent == 'end')
            startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.box)

          }

          else{

            if(this._svg.justifyContent == 'center')
            startWidth = (this._svg.box / 2) + ((this._svg.width - this._svg.noOfStars * this._svg.box) / 2)
            
            else if(this._svg.justifyContent == 'end')
            startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.noOfStars * this._svg.box)

          }
        }

        if(this._svg.alignItems == 'start')
        startHeight = 0

        else{

          if(['TtoB','BtoT'].includes(this._newSvg.orientation)){
            if(this._svg.alignItems == 'center')
            startHeight = (this._svg.height - this._svg.noOfStars * this._svg.box) / 2

            else if(this._svg.alignItems == 'end')
            startHeight = (this._svg.height - this._svg.noOfStars * this._svg.box)

          }

          else{

            if(this._svg.alignItems == 'center')
            startHeight = (this._svg.height - this._svg.box) / 2

            else if(this._svg.alignItems == 'end')
            startHeight = (this._svg.height - this._svg.box)
          
          }
        }

        let initialHeight = startHeight, initialWidth = startWidth

        for(let i = 0;i < this._svg.stars.length; i++){
          if(['TtoB','BtoT'].includes(this._newSvg.orientation)){
            this._svg.stars[i].startWidth = initialWidth
            this._svg.stars[i].startHeight = initialHeight

            initialHeight += this._svg.box

            let d = this._dAttr(this._svg.stars[i].startWidth, this._svg.stars[i].startHeight)
            this._svg.stars[i].d = d
            this._svg.stars[i].elem.setAttribute("d", d)

          }

          else{
            this._svg.stars[i].startWidth = initialWidth
            this._svg.stars[i].startHeight = initialHeight

            initialWidth += this._svg.box

            let d = this._dAttr(this._svg.stars[i].startWidth, this._svg.stars[i].startHeight)
            this._svg.stars[i].d = d
            this._svg.stars[i].elem.setAttribute("d", d)
          }

        }
      }

      let rated = Math.trunc(this._svg.rating)

      for(let i = 0;i < this._svg.stars.length; i++){

        if(['LtoR','TtoB'].includes(this._newSvg.orientation)){
          if(i < rated){
            this._svg.stars[i].elem.setAttribute("fill",this._svg.ratedFill)
          }else{
            this._svg.stars[i].elem.setAttribute("fill",this._svg.unratedFill)            
          }
        }

        else{
          if(i < (this._svg.noOfStars - rated)){
            this._svg.stars[i].elem.setAttribute("fill",this._svg.unratedFill)
          }else{
            this._svg.stars[i].elem.setAttribute("fill",this._svg.ratedFill)            
          }
        }

      }
      this._svg.orientation = this._newSvg.orientation
    }

    if(this._newSvg.justifyContent && (this._svg.justifyContent !== this._newSvg.justifyContent)){
      let startWidth;

      if(this._newSvg.justifyContent === 'start'){
        startWidth = this._svg.box / 2
      }

      else if(this._newSvg.justifyContent === 'end'){
       if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL'){
        startWidth = (this._svg.box / 2) + (this._svg.width - (this._svg.box * this._svg.noOfStars))
       }

       else{
        startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.box)
       }
      }

      else if(this._newSvg.justifyContent === 'center'){
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL'){
          startWidth = (this._svg.box / 2) + (this._svg.width - (this._svg.box * this._svg.noOfStars)) / 2
        }

        else{
          startWidth = (this._svg.box / 2) + (this._svg.width - this._svg.box) / 2
        }
      }

      else{
       // space-evenly concept
      }

      this._svg.stars[0].startWidth = startWidth
      let d = this._dAttr(this._svg.stars[0].startWidth, this._svg.stars[0].startHeight)
      this._svg.stars[0].d = d
      this._svg.stars[0].elem.setAttribute("d", d)

      for(let i = 1;i < this._svg.stars.length; i++){
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL'){
          this._svg.stars[i].startWidth = this._svg.stars[i - 1].startWidth + this._svg.box
        }

        else{
          this._svg.stars[i].startWidth = startWidth
        }

        let d = this._dAttr(this._svg.stars[i].startWidth, this._svg.stars[i].startHeight)
        this._svg.stars[i].d = d
        this._svg.stars[i].elem.setAttribute("d", d)
      }

      this._svg.justifyContent = this._newSvg.justifyContent
    }

    if((this._newSvg.alignItems) && (this._newSvg.alignItems !== this._svg.alignItems)){
      let startHeight

      if(this._newSvg.alignItems === 'start'){
        startHeight = 0
      }

      else if(this._newSvg.alignItems === 'end'){
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL')
        startHeight = this._svg.height - this._svg.box

        else
        startHeight = this._svg.height - (this._svg.box * this._svg.noOfStars)
      }

      else if(this._newSvg.alignItems === 'center'){
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL')
        startHeight = (this._svg.height - this._svg.box) / 2

        else
        startHeight = (this._svg.height - (this._svg.box * this._svg.noOfStars)) / 2        
      }

      this._svg.stars[0].startHeight = startHeight
      let d = this._dAttr(this._svg.stars[0].startWidth, this._svg.stars[0].startHeight)
      this._svg.stars[0].d = d
      this._svg.stars[0].elem.setAttribute("d", d)

      for(let i = 1;i < this._svg.stars.length; i++){
        if(this._svg.orientation == 'LtoR' || this._svg.orientation == 'RtoL'){
          this._svg.stars[i].startHeight = startHeight
        }

        else{
          this._svg.stars[i].startHeight = this._svg.stars[i - 1].startHeight + this._svg.box
        }

        let d = this._dAttr(this._svg.stars[i].startWidth, this._svg.stars[i].startHeight)
        this._svg.stars[i].d = d        
        this._svg.stars[i].elem.setAttribute("d", d)
      }

      this._svg.alignItems = this._newSvg.alignItems
    }

    if(this._newSvg.onDraw){
      this._svg.onDraw = this._newSvg.onDraw
    }

    if(this._newSvg.onUpdate){
      this._svg.onUpdate = this._newSvg.onUpdate
    }

    if(this._svg.onDraw){
      this._svg.onDraw()
    }

  }

  _createGradient(fracRating){
    this._defs.container = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    this._defs.grad1Id = newId + 1
    newId = this._defs.grad1Id
    let gradContainer = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    let stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    let stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    gradContainer.setAttribute('id', this._defs.grad1Id)
    gradContainer.appendChild(stop1)
    gradContainer.appendChild(stop2)
    this._defs.container.appendChild(gradContainer)
    let grad1 = {}
    grad1.container = gradContainer
    grad1.stop1 = stop1 
    grad1.stop2 = stop2
    this._defs.grad1 = grad1
    this._svg.svgElement.appendChild(this._defs.container)

    if(this._svg.flow === 'row'){
      this._defs.grad1X2 = 100 + '%'
      this._defs.grad1Y2 = 0 + '%'
    }else{
      this._defs.grad1X2 = 0 + '%'
      this._defs.grad1Y2 = 100 + '%'
    }

    this._defs.grad1.container.setAttribute('x1', 0 + '%')
    this._defs.grad1.container.setAttribute('x2', this._defs.grad1X2)
    this._defs.grad1.container.setAttribute('y1', 0 + '%')
    this._defs.grad1.container.setAttribute('y2', this._defs.grad1Y2)

    let offset1, offset2, stopColor1, stopColor2
    if (['LtoR', 'TtoB'].includes(this._svg.orientation)) {
      offset1 = fracRating + '%'
      stopColor1 = this._svg.ratedFill
      offset2 = (100 - fracRating) + '%'
      stopColor2 = this._svg.unratedFill
    }else{
      offset1 = fracRating + '%'
      stopColor1 = this._svg.unratedFill
      offset2 = (100 - fracRating) + '%'
      stopColor2 = this._svg.ratedFill
    }

    this._defs.grad1.container.setAttribute('x1', 0 + '%')
    this._defs.grad1.container.setAttribute('x2', this._defs.grad1X2)
    this._defs.grad1.container.setAttribute('y1', 0 + '%')
    this._defs.grad1.container.setAttribute('y2', this._defs.grad1Y2)
    this._defs.grad1.stop1.setAttribute('offset', offset1)
    this._defs.grad1.stop2.setAttribute('offset', offset2)
    this._defs.grad1.stop1.setAttribute('stop-color', stopColor1)
    this._defs.grad1.stop2.setAttribute('stop-color', stopColor2)
    
    this._defs.grad1.offset1 = offset1
    this._defs.grad1.offset2 = offset2
    this._defs.grad1.stopColor1 = stopColor1
    this._defs.grad1.stopColor2 = stopColor2
  }

  update(obj){
    if(this._validate(obj)){
      if(this._svg.hasAnimationFrame){
        window.requestAnimationFrame(() => this._createSvg())
        this._svg.requestAnimationFrame = false
      }
    }
    if(this._svg.onUpdate)
    this._svg.onUpdate()
  }

  _dAttr(x,y){
    let innerBox = this._svg.box - (2 * this._svg.padding)
    let dAttr = 'm' + x + ' ' + y + ' ' +
    'l' + -(innerBox / 6) + ' ' + (innerBox / 3) + ' ' +
    'l' + -(innerBox / 3) + ' ' + 0 + ' ' +
    'l' + (innerBox / 5) + ' ' + (innerBox / 3) + ' ' +
    'l' + -(innerBox / 5) + ' ' + (innerBox / 3) + ' ' +
    'l' + (innerBox / 2) + ' ' + -(innerBox / 5) + ' ' +
    'l' + (innerBox / 2) + ' ' + (innerBox / 5) + ' ' +
    'l' + -(innerBox / 5) + ' ' + -(innerBox / 3) + ' ' +
    'l' + (innerBox / 5) + ' ' + -(innerBox / 3) + ' ' +
    'l' + -(innerBox / 3) + ' ' + 0 + 'z'
    return dAttr
  }

}  


