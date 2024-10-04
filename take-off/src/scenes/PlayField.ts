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

    private planeDisplayUtil: PlaneDisplayUtil;
    private groundDisplayUtil: GroundDisplayUtil;
    private bonusDisplayUtil: BonusDisplayUtil;
    private playerUiDisplayUtil: PlayerUiDisplayUtil;

    constructor() {
        super("Game");
    }

    preload() {
        this.planeDisplayUtil = new PlaneDisplayUtil(this, this.tsize, this.w, this.h);
        this.groundDisplayUtil = new GroundDisplayUtil(this, this.tsize, this.w, this.h);
        this.bonusDisplayUtil = new BonusDisplayUtil(this, this.tsize, this.w, this.h);
        this.playerUiDisplayUtil = new PlayerUiDisplayUtil(this, this.tsize, this.w, this.h);

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
        
        var lastSent = Date.now();

        var sendInterval = 1000;

        // register key events 
        var controlBtns = this.input.keyboard?.addKeys('W,S,A,D');
        if(controlBtns) {
            controlBtns.W.addListener('up',    function() {if(Date.now() - lastSent > sendInterval) {lastSent = Date.now(); room.send('wasd', 'w'); console.log('sent w'); } else {console.log('jitter w');} });
            controlBtns.A.addListener('left',  function() {if(Date.now() - lastSent > sendInterval) {lastSent = Date.now(); room.send('wasd', 'a'); console.log('sent a'); } else {console.log('jitter a');} });
            controlBtns.S.addListener('down',  function() {if(Date.now() - lastSent > sendInterval) {lastSent = Date.now(); room.send('wasd', 's'); console.log('sent s'); } else {console.log('jitter s');} });
            controlBtns.D.addListener('right', function() {if(Date.now() - lastSent > sendInterval) {lastSent = Date.now(); room.send('wasd', 'd'); console.log('sent d'); } else {console.log('jitter d');}});
        }
        // receive message if LOST / WIN
        room.onMessage("state", (message) => {
            switch(message) {
                case 'LOST':
                    // TODO : show GO screen
                    console.log("YOU LOSST!");
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