import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from '../colys/colyseus';
import PlaneDisplayUtil from '../components/PlaneDisplayUtil';
import GroundDisplayUtil from '../components/GroundDisplayUtil';
import BonusDisplayUtil from '../components/BonusDisplayUtil';
import PlayerUiDisplayUtil from '../components/PlayerUiDisplayUtil';
import { containerOfNineSlice } from '../Utils';

export class PlayField extends Scene {   

    private rectHeader:Phaser.GameObjects.NineSlice;
    private rectGameField:Phaser.GameObjects.NineSlice;
    private rectGameStat:Phaser.GameObjects.NineSlice;

    private cntrHeader: Phaser.GameObjects.Container;
    private cntrGameField: Phaser.GameObjects.Container;
    private cntrGameStat:Phaser.GameObjects.Container;

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
        this.load.image({
            key: "bgImage",
            url: '/assets/takeoff_game/images/bg.png'
        });
        this.load.image({
            key: "rctPanel",
            url: "/assets/takeoff_game/images/panel_bg.png"
        });
        this.load.image({
            key: "fieldBg",
            url: '/assets/takeoff_game/field_bg.png'
        });
        
         
        this.planeDisplayUtil = new PlaneDisplayUtil(this, this.tsize, 512, 480);
        this.groundDisplayUtil = new GroundDisplayUtil(this, this.tsize, 512, 480);
        this.bonusDisplayUtil = new BonusDisplayUtil(this, this.tsize, 512, 480);
        this.playerUiDisplayUtil = new PlayerUiDisplayUtil(this, this.tsize, 228, 480);

        this.groundDisplayUtil.registerSpriteSheet();
        this.planeDisplayUtil.registerSpriteSheet();
        this.bonusDisplayUtil.registerSpriteSheet();
    }

    init(data: GlobalConfig) {
        this.data.set('loaded', false);
        this.data.set('GlobalConfig', data);
    }

    // 760 columns  
    // 480 rows 
    create() {

        var self = this;

        var cfg:GlobalConfig = this.data.get(GlobalConfig.KEY);

        this.add.image(0,0, 'bgImage').setOrigin(0);
        
        this.rectHeader = this.add.nineslice(20, 20, 'rctPanel', undefined, 760, 60, 20, 20,20,20).setOrigin(0).setDepth(1);
        var titleText = this.add.text(20,15,"=============== " + cfg.room?.id + " ===============", { fontFamily:"arcadepi", fontSize:30, color: '#00f900' });

        this.rectGameField = this.add.nineslice(20, 100, 'rctPanel', undefined, 512, 480, 20, 20,20,20).setOrigin(0).setDepth(1);

        this.cntrHeader = containerOfNineSlice(this, this.rectHeader, [titleText]);

        var playfield_bg = this.add.image(0,0,'fieldBg').setOrigin(0);
        this.cntrGameField = this.add.container(this.rectGameField.x, this.rectGameField.y, playfield_bg);


        this.rectGameStat = this.add.nineslice(552, 100, 'rctPanel', undefined, 228, 480, 20, 20,20,20).setOrigin(0).setDepth(1);
        this.cntrGameStat = containerOfNineSlice(this, this.rectGameStat, []);

        
        this.planeDisplayUtil.registerAnimation();
        this.bonusDisplayUtil.registerAnimation();

        // event processing
        var room: Room = this.data.get("GlobalConfig").room;

        // register key events 
        var controlBtns = this.input.keyboard?.addKeys('W,S,A,D', true, false);
        if(controlBtns) {
            controlBtns.W.addListener('down', () => {room.send('wasd', 'w');});
            controlBtns.A.addListener('down', () => {room.send('wasd', 'a');});
            controlBtns.S.addListener('down', () => {room.send('wasd', 's');});
            controlBtns.D.addListener('down', () => {room.send('wasd', 'd');});
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

        this.groundDisplayUtil.drawGroundTiles(this.cntrGameField, state);
        
        var cfg:GlobalConfig = this.data.get(GlobalConfig.KEY);

        var plane = state.planes.get(cfg.room?.sessionId);
        if(plane.currentSpeed >= plane.takeOffSpeed) {
            this.groundDisplayUtil.enableTakeOffs(state, true);
        } else {
            this.groundDisplayUtil.enableTakeOffs(state, false);
        }
        this.bonusDisplayUtil.drawBonuses(this.cntrGameField, state);
        this.planeDisplayUtil.drawPlanes(this.cntrGameField, state);
        this.playerUiDisplayUtil.drawGUI(this.cntrGameStat, state);        
    }
}