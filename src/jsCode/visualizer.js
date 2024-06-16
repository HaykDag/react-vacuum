import { lerp, getRGBA, distFromPointToSeg, distance,average } from "./utils";

export default class Visualizer {
  constructor(ctx,network,margin=50){
    this.network = network;
    this.weights = [];//[{start,end,value}]
    this.biases = [];//[{x,y,value}]
    this.left = margin;
    this.top = margin;
    this.width = ctx.canvas.width - margin * 2;
    this.height = ctx.canvas.height - margin * 2;
    this.rad = 18;
    this.info = null;
    this.#init(ctx);
  }
  
  showInfo(ctx){
    if(!this.info) return;
    let {text,x,y, bias} = this.info;
    if(bias) {
      x = x+20;
      y = y-20;
    }
    ctx.beginPath();
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white'
    ctx.fillText(text,x,y);
  }

  #init(ctx) {
    this.#addEvents(ctx);
    const {network, height, width, top,left} = this;
    
    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      this.#initLevel(
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight
      );
    }
  }

  
  #initLevel(level, left, top, width, height) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    //weights
    for (let i = inputs.length - 1; i >= 0; i--) {
      for (let j = 0; j < outputs.length; j++) {
        
        const sx = Visualizer.#getNodeX(inputs, i, left, right);
        const sy = bottom;
        const start = {x:sx,y:sy};

        const ex = Visualizer.#getNodeX(outputs, j, left, right);
        const ey = top;
        const end = {x:ex,y:ey};

        const value = weights[i][j]

        this.weights.push({start,end,value});
        
      }
    }

    //biases
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      const y = top;
      
      const value = biases[i];
      this.biases.push({x,y,value});
    }
  }
  
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["🠈", "🠉", "🠊"] : []
      );
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    for (let i = inputs.length - 1; i >= 0; i--) {
      for (let j = 0; j < outputs.length; j++) {
        const x = Visualizer.#getNodeX(inputs, i, left, right);

        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    const nodeRadius = 18;
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }


  #addEvents(ctx){
    ctx.canvas.addEventListener('mousemove',(e)=>{
      this.info = null;
      const {offsetX,offsetY} = e;
      for(const weight of this.weights){
        const dist = distFromPointToSeg([offsetX,offsetY],weight);
        if(dist<=3){
          const {x,y} = average(weight.start,weight.end);
          this.info = {text:weight.value.toFixed(2),x,y};
        }
      }
      for(const bias of this.biases){
        const dist = distance([offsetX,offsetY],[bias.x,bias.y]);
        if(dist<=this.rad){
          this.info = {text:bias.value.toFixed(2),x:bias.x,y:bias.y,bias:true};
        }
      }
    }); 
  }
}
