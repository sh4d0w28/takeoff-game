import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from 'colyseus.js';

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
    }

    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }
    create() {
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

        this._drawGroundTiles(state);
        this._drawPlanes(state);

    }
    _drawPlanes(state: any) {
        var fieldX = 400 - (state.columns * this.tsize / 2) 
        var fieldY = 100 - (state.rows * this.tsize / 2)

        if(!this.data.get('planes')) {
            this.data.set('planes', {});
        }
        state.planes.entries().forEach(([sessionId,planeSpec]:any)=>{
            if (!this.data.get('planes')[sessionId]) {
                this.data.get('planes')[sessionId] = this.add.image(-2000,-2000,"planesSpriteSheet", 0);
            }
           var psprite: Phaser.GameObjects.Image = this.data.get('planes')[sessionId];
           this.__drawSinglePlane(fieldX, fieldY, planeSpec, psprite);
        });
    }
    __drawSinglePlane(fieldX: integer, fieldY: integer, planeSpec: any, sprite: Phaser.GameObjects.Image) {
        var subModX = 0;
        var subModY = 0;
        var angle = 0;
        if(planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'RIGHT') {
            subModX = -0.5 + planeSpec.subMove;
            subModY = 0;
            angle = 90;
        } else if(planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'LEFT') {
            subModX = 0.5 - planeSpec.subMove;
            subModY = 0;
            angle = 270;
        } else if(planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'UP') {
            subModX = 0;
            subModY = 0.5 - planeSpec.subMove;
            angle = 0;
        } else if(planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'DOWN') {
            subModX = 0;
            subModY = -0.5 + planeSpec.subMove;
            angle = 180; 
        } else if ( planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'DOWN') {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 90 + a;
        } else if ( planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'LEFT') {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((360 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((360 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'UP') {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((90 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'RIGHT') {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 0 + a;
        } else if ( planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'RIGHT') {
            var a = 90 * (-planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'DOWN') {
            var a = 90 * (-planeSpec.subMove);    
            subModX = 0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'LEFT') {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((0 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((0 + a) * Math.PI/180);
            angle = 360 + a;
        } else if ( planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'UP') {
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

    _drawGroundTiles(state: any) {
        var fieldX = 400 - (state.columns * this.tsize / 2) 
        var fieldY = 100 - (state.rows * this.tsize / 2)
        
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            const [x,y] = coord.split('.').map(v => parseInt(v));
            this.__drawMapChar(fieldX + x * this.tsize, fieldY + y * this.tsize, tile);
        });
    }

    __drawMapChar(x:integer,y:integer, c: string) {
        switch(c) {
            case '┌': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( 0        ); break;
            case '┐': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( Math.PI/2); break;
            case '┘': this.add.image(x,y, "roadSpriteSheet", 2).setRotation( Math.PI  ); break;
            case '└': this.add.image(x,y, "roadSpriteSheet", 2).setRotation(-Math.PI/2); break;
        }
    }
}