import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from 'colyseus.js';
import { DirectionEnum } from '../../../common/Enums';

export class PlayField extends Scene {   

    readonly tsize = 32

    constructor() {
        super("Game");
    }
    preload() {
        this.load.spritesheet({
            key: 'roadSpriteSheet',
            url: 'assets/roadsprite.bmp',
            frameConfig: {
                frameWidth: this.tsize,
                frameHeight: this.tsize,
                spacing: 1,
                startFrame: 0,
                endFrame: 6
            }
        });
        this.load.spritesheet({
            key: 'planesSpriteSheet',
            url: 'assets/planesprite.bmp',
            frameConfig: {
                frameWidth: this.tsize,
                frameHeight: this.tsize,
                spacing: 0,
                startFrame: 0,
                endFrame: 4
            }
        });
        this.load.spritesheet({
            key: 'bonusSpriteAnimated',
            url: 'assets/bonussprite-anim.bmp',
            frameConfig: {
                frameWidth: this.tsize,
                frameHeight: this.tsize,
                startFrame: 0,
                endFrame: 3
            }
        });
    }

    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }
    create() {
        this.anims.create({
            key: 'bonus',
            frames: this.anims.generateFrameNumbers("bonusSpriteAnimated", {start: 0, end: 3}).concat(this.anims.generateFrameNumbers("bonusSpriteAnimated", {start: 0, end: 3}).slice(1,3).reverse()),
            repeat: -1,
            frameRate: 1
        });
        // event processing
        var room: Room = this.data.get("GlobalConfig").room; 
        room.onStateChange((state) => {
            this.data.set("state", state);
            this.data.set('loaded', true);
        });
    }
    update() {
        if(!this.data.get('loaded')) {
            return;
        }
        var state = this.data.get("state");

        var w = 800;
        var h  = 600;
        //this._drawGroundTiles(w,h, state);
        this._drawPlanes(w,h, state);
        this._drawBonuses(w,h, state);

    }

    _drawBonuses(w:number, h:number, state: any) {
        
        if(!this.data.get('bonuses')) {
            this.data.set('bonuses', {});
        }

        var astate = state;

        state.bonuses.entries().forEach(([id ,bonusSpec]:any)=>{ 
            if(!this.data.get('bonuses')[id]) {
                var x = (w - bonusSpec.x * this.tsize) / 2; 
                var y = (h - bonusSpec.y * this.tsize) / 2;        
                this.data.get('bonuses')[id] = this.add.sprite(x, y,'bonusSpriteAnimated',0);
                this.data.get('bonuses')[id].anims.play('bonus');
            }
        });
        Object.keys(this.data.get("bonuses")).forEach((k:string) => {
            var d = this.data.get('bonuses')[k];
            debugger;
        });
    }

    _drawPlanes(w:number, h:number, state: any) {
        var fieldX = (w - state.columns * this.tsize) / 2; 
        var fieldY = (h - state.rows * this.tsize) / 2;

        if(!this.data.get('planes')) {
            this.data.set('planes', {});
        }
        state.planes.entries().forEach(([sessionId,planeSpec]:any)=>{
            if (!this.data.get('planes')[sessionId]) {
                this.data.get('planes')[sessionId] = this.add.image(0,0,"planesSpriteSheet", planeSpec.color).setDepth(2);
            }
           var psprite: Phaser.GameObjects.Image = this.data.get('planes')[sessionId];
           this.__drawSinglePlane(fieldX, fieldY, planeSpec, psprite);
        });
    }
    __drawSinglePlane(fieldX: integer, fieldY: integer, planeSpec: any, sprite: Phaser.GameObjects.Image) {
        var subModX = 0;
        var subModY = 0;
        var angle = 0;
        if(planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            subModX = -0.5 + planeSpec.subMove;
            subModY = 0;
            angle = 90;
        } else if(planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            subModX = 0.5 - planeSpec.subMove;
            subModY = 0;
            angle = 270;
        } else if(planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.UP) {
            subModX = 0; 
            subModY = 0.5 - planeSpec.subMove;
            angle = 0;
        } else if(planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            subModX = 0;
            subModY = -0.5 + planeSpec.subMove;
            angle = 180; 
        } else if ( planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 90 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((360 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((360 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.UP) {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((90 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 0 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            var a = 90 * (-planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            var a = 90 * (-planeSpec.subMove);    
            subModX = 0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((0 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((0 + a) * Math.PI/180);
            angle = 360 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.UP) {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((90+a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90+a) * Math.PI/180);
            angle = 90 + a;
        } else {
            subModX = 0; 
            subModY = 0;
        }
        sprite.setPosition(fieldX + (planeSpec.x + subModX) * this.tsize ,fieldY + (planeSpec.y + subModY) * this.tsize).setRotation(angle * Math.PI / 180);
    }

    _drawGroundTiles(w:number,h:number, state: any) {
        var fieldX = (w - state.columns * this.tsize) / 2 
        var fieldY = (h - state.rows * this.tsize) / 2
        
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            const [x,y] = coord.split('.').map(v => parseInt(v));
            this.__drawMapChar(fieldX + x * this.tsize, fieldY + y * this.tsize, tile);
        });
    }

    __drawMapChar(x:integer,y:integer, c: string) {
        switch(c) {
            case '┌': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( 0         ); break;
            case '┐': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( Math.PI/2 ); break;
            case '┘': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( Math.PI   ); break;
            case '└': this.add.image(x,y, "roadSpriteSheet", 2).setRotation(-Math.PI/2 ); break;
            case '│': this.add.image(x,y, "roadSpriteSheet", 1).setRotation( 0         ); break;
            case '─': this.add.image(x,y, "roadSpriteSheet", 1).setRotation( Math.PI/2 ); break;
            case '┤': this.add.image(x,y, "roadSpriteSheet", 0).setRotation( Math.PI   ); break; 
            case '┴': this.add.image(x,y, "roadSpriteSheet", 0).setRotation(-Math.PI/2 ); break;
            case '├': this.add.image(x,y, "roadSpriteSheet", 0).setRotation( 0         ); break;
            case '┬': this.add.image(x,y, "roadSpriteSheet", 0).setRotation( Math.PI/2 ); break;
            case '┼': this.add.image(x,y, "roadSpriteSheet", 3).setRotation( 0         ); break;
        }
    }
}