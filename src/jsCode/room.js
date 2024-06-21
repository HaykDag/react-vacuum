import Wall from './wall.js';
import Garbage from './garbage.js';
import Vacuum from './vacuum.js';
import NeuralNetwork from './network.js';
import {distFromPointToSeg, distance} from './utils.js';

export default class Room {
  constructor(size, walls = []) {
    this.size = size;
    this.vacuum = new Vacuum(size.width-50,size.height-50,40,"KEYS");
    this.walls = [
      new Wall({ x: 0, y: 0 }, { x: size.width, y: 0 }), //top
      new Wall({ x: 0, y: 0 }, { x: 0, y: size.height }), //left
      new Wall(
        { x: size.width, y: 0 },
        { x: size.width, y: size.height }
      ), //right
      new Wall(
        { x: 0, y: size.height },
        { x: size.width, y: size.height }
      ), //bottom
      ...walls,
    ];
    
    this.currRoom = 'room1';
    this.vacuums = [];
    this.garbage = [];
    this.newWall = null;
    this.tempWall = null;
    this.edit = false;
    this.changeRoom();
  }

  update() {
    if (this.vacuum.turned){

      if (this.garbage.length === 0) {
        this.vacuum.turned = false;
      }
    this.garbage = this.garbage.filter((g) => {
      const gPoint = [g.x, g.y];
      const lDist = distance(gPoint, this.vacuum.lSweeper);
      const rDist = distance(gPoint, this.vacuum.rSweeper);
      const dist = Math.min(lDist, rDist);

      return dist > this.vacuum.sweepLength;
    });
    }
    this.vacuum.update(this.walls);
    for (const cleaner of this.vacuums) {
      cleaner.update(this.walls);
    }
  }

  draw(ctx) {
    if (this.tempWall) {
      this.tempWall.draw(ctx, "grey");
    }
    for (const wall of this.walls) {
      wall.draw(ctx);
    }

    for (const garbage of this.garbage) {
      garbage.draw(ctx);
    }

    this.vacuum.draw(ctx,true);
    for (const cleaner of this.vacuums) {
      cleaner.draw(ctx);
    }
  }

  createWalls(target) {
    let mouse = null;
    target.addEventListener("mousemove", (e) => {
      const { offsetX, offsetY } = e;
      mouse = { x: offsetX, y: offsetY };

      if (this.newWall) {
        const { x, y } = this.newWall;
        this.tempWall = new Wall({ x, y }, mouse);
      }
    });
    target.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || !this.edit) return;

      if (!this.newWall) {
        this.newWall = { x: mouse.x, y: mouse.y };
      } else {
        if(this.newWall.x === mouse.x && this.newWall.y===mouse.y) return;

        this.walls.push(new Wall(this.tempWall.start, this.tempWall.end));
        this.newWall = this.tempWall.end;
        this.tempWall = null;
      }
    });
    target.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const point = [mouse.x, mouse.y];
      if(this.edit){
        this.newWall = null;  
        this.tempWall = null;
        
        for (let i = 3; i < this.walls.length; i++) {
          const seg = this.walls[i];
          const dist = distFromPointToSeg(point, seg);
          if (dist <= 2) {
            this.walls.splice(i, 1);
          }
        }
      } 
      
      if(this.vacuums.length===0) return;
      if(distance([this.vacuum.x,this.vacuum.y],point)<this.vacuum.rad){
        this.vacuum = this.vacuums.pop();
      }
      for (let i = 0; i < this.vacuums.length; i++) {
      const dist = distance([this.vacuums[i].x, this.vacuums[i].y], point);
      if (dist < this.vacuums[i].rad) {
        this.vacuums.splice(i, 1);
        i--;
      }
    }
    });
  }

  generateVacuums(count,mutation) {
    this.vacuums.length = [];
    const data = localStorage.getItem('brains');
    if(data){
        const brainData = JSON.parse(data);
        if(brainData[this.currRoom]){
          this.vacuum.brain = brainData[this.currRoom]
        }
      }
    for (let i = 0; i < count; i++) {
      const cleaner = new Vacuum(this.size.width-50,this.size.height-50, 40, "AI");
      
      cleaner.brain = JSON.parse(JSON.stringify(this.vacuum.brain));
      NeuralNetwork.mutate(cleaner.brain,mutation);
      this.vacuums.push(cleaner);
    }
  }

  generateGarbage(n) {
    this.garbage.length = 0;
    for (let i = 0; i < n; i++) {
      let skip = false;
      const x = Math.random() * (this.size.width - 80) + 50;
      const y = Math.random() * (this.size.height - 80) + 50;
      const rad = Math.random() * 6 + 2;
      for (const wall of this.walls) {
        const dist = distFromPointToSeg([x, y], wall);
        if (dist <= rad) {
          skip = true;
          break;
        }
      }
      if (skip) {
        i--;
        continue;
      }
      this.garbage.push(new Garbage(x, y, rad));
    }
  }
  changeRoom (){
    this.walls.length = 4;
    const data = localStorage.getItem("rooms");
    const rooms = data ? JSON.parse(data) : {};
    const newWalls = [];
    if(rooms[this.currRoom]){
      const walllData = rooms[this.currRoom];
      for(const newWall of walllData){
        newWalls.push(new Wall(newWall.start,newWall.end));
      }
    }else{
      newWalls.push(...this.#getWalls(this.currRoom));
    }
    this.walls.push(...newWalls);
    this.vacuums.length = 0;
    this.generateGarbage(150);
  }

  changeControl(type){
    this.vacuums.length = 0;
    this.vacuum = new Vacuum(this.size.width-50,this.size.height-50,40,type);

    if(type!=='AI') return;

    const data = localStorage.getItem("brains");
    if (!data) return;
    const brains = JSON.parse(data);
    if(brains[this.currRoom]) this.vacuum.brain = brains[this.currRoom];
  }

  saveBrain(name){
    const data = localStorage.getItem("brains");
    const brains = data ? JSON.parse(data) : {};
    brains[name] = this.vacuum.brain;
    localStorage.setItem("brains", JSON.stringify(brains));
  }

  deleteBrain(name){
    const data = localStorage.getItem("brains");
    const brains = data ? JSON.parse(data) : {};
    delete brains[name];
    localStorage.setItem("brains", JSON.stringify(brains));
  }

  deleteRoom(name){
    const data = localStorage.getItem("rooms");
    const rooms = data ? JSON.parse(data) : {};
    delete rooms[name];
    localStorage.setItem("rooms", JSON.stringify(rooms));
    this.deleteBrain(name);
  }

  saveRoom(name){
    if(!name) return;
    const data = localStorage.getItem("rooms");
    const rooms = data ? JSON.parse(data) : {};
    
    rooms[name] = this.walls.slice(4);
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }

  #getWalls(room) {
    if (room === "room1") {
      return [
        new Wall(
          { x: 0, y: this.size.height - 150 },
          { x: this.size.width - 150, y: this.size.height - 150 }
        ),
        new Wall(
          { x: 200, y: this.size.height - 300 },
          { x: this.size.width, y: this.size.height - 300 }
        ),
        new Wall(
          { x: 0, y: this.size.height - 450 },
          { x: this.size.width - 200, y: this.size.height - 450 }
        ),
      ];
    } else if (room === "room2") {
      return [
        new Wall({ x: 650, y: 600 }, { x: 650, y: 450 }),
        new Wall({ x: 650, y: 600 }, { x: 650, y: 150 }),
        new Wall({ x: 650, y: 150 }, { x: 150, y: 150 }),
        new Wall({ x: 150, y: 150 }, { x: 150, y: 430 }),
        new Wall({ x: 150, y: 430 }, { x: 350, y: 430 }),
      ];
    } else if (room === "room3") {
      return [
        new Wall(
          { x: this.size.width, y: this.size.height - 150 },
          { x: this.size.width - 300, y: this.size.height - 150 }
        ),
        new Wall(
          { x: this.size.width - 180, y: this.size.height - 350 },
          { x: this.size.width - 500, y: this.size.height - 350 }
        ),
        new Wall(
          { x: 0, y: this.size.height - 350 },
          { x: 150, y: this.size.height - 350 }
        ),
        new Wall(
          { x: this.size.width - 400, y: 0 },
          { x: this.size.width - 400, y: this.size.height - 350 }
        ),
        new Wall(
          { x: 150, y: this.size.height - 150 },
          { x: 300, y: this.size.height - 150 }
        ),
        new Wall(
          { x: 300, y: this.size.height - 150 },
          { x: 300, y: this.size.height }
        ),
      ];
    }
    return [];
  }
}
