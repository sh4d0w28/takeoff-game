import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from 'colyseus.js';
import PlaneDisplayUtil from '../components/PlaneDisplayUtil';
import GroundDisplayUtil from '../components/GroundDisplayUtil';
import BonusDisplayUtil from '../components/BonusDisplayUtil';
import PlayerUiDisplayUtil from '../components/PlayerUiDisplayUtil';

export class PlayField extends Scene {   

    readonly tsize = 32
    readonly w = 800;
    readonly h  = 600;

    constructor() {
        super("Game");
    }

    preload() {
        GroundDisplayUtil.registerSpriteSheet(this, this.tsize);
        PlaneDisplayUtil.registerSpriteSheet(this, this.tsize);
        BonusDisplayUtil.registerSpriteSheet(this, this.tsize);
    }

    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }

    create() {
        this.anims.create({
            key: 'bonus',
            frames: this.anims
                .generateFrameNumbers(BonusDisplayUtil.BONUS_SPRITESHEET, {start: 0, end: 3})
                .concat(
                    this.anims.generateFrameNumbers(BonusDisplayUtil.BONUS_SPRITESHEET, {start: 0, end: 3}).slice(1,3).reverse()
                ),
            repeat: -1,
            frameRate: 20
        });
        // event processing
        var room: Room = this.data.get("GlobalConfig").room; 
        
        // register key events 
        var controlBtns = this.input.keyboard?.addKeys('W,S,A,D');
        if(controlBtns) {
            controlBtns.W.addListener('down',function(){room.send('wasd', 'w');});
            controlBtns.A.addListener('down',function(){room.send('wasd', 'a');});
            controlBtns.S.addListener('down',function(){room.send('wasd', 's');});
            controlBtns.D.addListener('down',function(){room.send('wasd', 'd');});
        }
        // receive message if LOST / WIN
        room.onMessage("state", (message) => {
            switch(message) {
                case 'LOST':
                    debugger;
                    break;
                default:
                    break;
            }
        });

        // register state change flow 
        room.onStateChange((state) => {
            this.data.set("state", state);
            this.data.set('loaded', true);
        });
    }
    update() {
        // only start to upgrade after loading
        if(!this.data.get('loaded')) {
            return;
        }
        var state = this.data.get("state");

        GroundDisplayUtil.drawGroundTiles(this.tsize, this.w, this.h, this, state)
        PlaneDisplayUtil.drawPlanes(this.tsize, this.w, this.h, this, state);
        BonusDisplayUtil.drawBonuses(this.tsize, this.w, this.h, this, state);
        PlayerUiDisplayUtil.drawGUI(this.tsize, this.w, this.h, this, state);
    }
}