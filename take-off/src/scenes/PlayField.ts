import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from 'colyseus.js';
import PlaneDisplayUtil from '../components/PlaneDisplayUtil';
import GroundDisplayUtil from '../components/GroundDisplayUtil';
import BonusDisplayUtil from '../components/BonusDisplayUtil';
import PlayerUiDisplayUtil from '../components/PlayerUiDisplayUtil';

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
            frameRate: 20
        });
        // event processing
        var room: Room = this.data.get("GlobalConfig").room; 
        
        var controlBtns = this.input.keyboard?.addKeys('W,S,A,D');
        if(controlBtns) {
            controlBtns.W.addListener('down',function(){room.send('wasd', 'w');});
            controlBtns.A.addListener('down',function(){room.send('wasd', 'a');});
            controlBtns.S.addListener('down',function(){room.send('wasd', 's');});
            controlBtns.D.addListener('down',function(){room.send('wasd', 'd');});
        }
        room.onMessage("state", (message) => {
            switch(message) {
                case 'LOST':
                    debugger;
                    break;
                default:
                    break;
            }
        });
        room.onStateChange((state) => {
            this.data.set("state", state);
            this.data.set('loaded', true);
        });
        debugger;
    }
    update() {
        if(!this.data.get('loaded')) {
            return;
        }
        var state = this.data.get("state");

        var w = 800;
        var h  = 600;

        GroundDisplayUtil.drawGroundTiles(this.tsize, w, h, this, state)
        PlaneDisplayUtil.drawPlanes(this.tsize, w, h, this, state);
        BonusDisplayUtil.drawBonuses(this.tsize, w, h, this, state);
        PlayerUiDisplayUtil.drawGUI(this.tsize, w, h, this, state);
    }
}