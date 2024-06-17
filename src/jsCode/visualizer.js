import { lerp, getRGBA, distFromPointToSeg, distance,average } from "./utils";
import { room } from "../hooks/useCanvas";

export default class Visualizer {
  constructor(ctx,network,margin=50){
    this.network = network;
    this.weights = [];//[{start,end,value}]
    this.biases = [];//[{x,y,value}]
    this.inputs = [];
    this.margin = margin;
    this.left = margin;
    this.top = margin;
    this.width = ctx.canvas.width - margin * 2;
    this.height = ctx.canvas.height - margin * 2;
    this.rad = 18;
    this.info = null;
    this.#init(ctx);
  }
  
  showInfo(ctx){
    for(let i = 0;i<room.vacuum.brain.levels[0].inputs.length;i++){
      const x = Visualizer.#getNodeX(room.vacuum.brain.levels[0].inputs,i,this.left,this.left+this.width);
      const y = this.height+this.margin+30;
      const value = room.vacuum.brain.levels[0].inputs[i].toFixed(2);

      const diff = Math.abs(this.inputs[i]?.value-value);
      if(!diff || diff>0.03){
        this.inputs[i] = {x,y,value};
      }
    }
    for(const input of this.inputs){
      const {x,y,value} = input;
      ctx.beginPath();
      ctx.font = '18px Arial';
      ctx.fillStyle = 'white'
      ctx.fillText(value,x,y);
    }

    if(!this.info) return;
    let {value,x,y, bias} = this.info;
    if(bias) {
      x = x+20;
      y = y-20;
    }
    ctx.beginPath();
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white'
    ctx.fillText(value,x,y);
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
        levelHeight,
        i
      );
    }
  }

  
  #initLevel(level, left, top, width, height,levelIndex) {
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

        this.weights.push({start,end,value,levelIndex,i,j});
        
      }
    }

    //biases
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      const y = top;
      
      const value = biases[i];
      this.biases.push({x,y,value,levelIndex,i});
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

      for(const bias of this.biases){
        const dist = distance([offsetX,offsetY],[bias.x,bias.y]);
        if(dist<=this.rad){
          const {x,y,levelIndex,i} = bias;
          this.info = {value:bias.value.toFixed(2),x,y,levelIndex,i,bias:true};
        }
      }
      if(this.info) return;

      for(const weight of this.weights){
        const dist = distFromPointToSeg([offsetX,offsetY],weight);
        if(dist<=3){
          const {x,y} = average(weight.start,weight.end);
          const {value,i,j,levelIndex} = weight;
          this.info = {value:value.toFixed(2),x,y,i,j,levelIndex};
        }
      };
      
    });
    ctx.canvas.addEventListener('mousewheel',(e)=>{
      if(!this.info) return;

      this.info.value = Math.max(Math.min((Number(this.info.value) + Math.sign(e.wheelDelta)*0.01),1),-1).toFixed(2);
      
      const {levelIndex,i,j,value,bias} = this.info;
      //if it's a weight
      if(!bias){
        for(const weight of this.weights){
          if(levelIndex===weight.levelIndex && i===weight.i && j===weight.j){
            weight.value = Number(value);
          }
        }
        room.vacuum.brain.levels[levelIndex].weights[i][j] = Number(value);
      }else{//if it's a bias
        for(const bias of this.biases){
          if(levelIndex === bias.levelIndex && i === bias.i){
            bias.value = Number(value);
          }
        }
        room.vacuum.brain.levels[levelIndex].biases[i] = Number(value);
      }
      
    })
  }
}
