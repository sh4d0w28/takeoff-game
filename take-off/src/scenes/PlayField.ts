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

    readonly planeDisplayUtil = new PlaneDisplayUtil(this, this.tsize, this.w, this.h);
    readonly groundDisplayUtil = new GroundDisplayUtil(this, this.tsize, this.w, this.h);
    readonly bonusDisplayUtil = new BonusDisplayUtil(this, this.tsize, this.w, this.h);
    readonly playerUiDisplayUtil = new PlayerUiDisplayUtil(this, this.tsize, this.w, this.h);

    constructor() {
        super("Game");
    }

    preload() {
        this.groundDisplayUtil.registerSpriteSheet();
        this.planeDisplayUtil.registerSpriteSheet();
        this.bonusDisplayUtil.registerSpriteSheet();
    }

    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }

    create() {

        this.planeDisplayUtil.registerAnimation();
        this.bonusDisplayUtil.registerAnimation();

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
                    // TODO : show GO screen
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

        this.planeDisplayUtil.drawPlanes(state);
        this.groundDisplayUtil.drawGroundTiles(state);
        this.bonusDisplayUtil.drawBonuses(state);
        this.playerUiDisplayUtil.drawGUI(state);
    }
}