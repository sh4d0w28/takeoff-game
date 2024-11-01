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

    private rectGameOver:Phaser.GameObjects.NineSlice;

    private cntrHeader: Phaser.GameObjects.Container;
    private cntrGameField: Phaser.GameObjects.Container;
    private cntrGameStat:Phaser.GameObjects.Container;

    private cntrGameOver:Phaser.GameObjects.Container;

    private gameOverText2:Phaser.GameObjects.Text;

    private gameOverYes: Phaser.GameObjects.Text;
    private gameOverNo: Phaser.GameObjects.Text;

    readonly tsize = 32
    readonly w = 800;
    readonly h  = 600;

    private planeDisplayUtil: PlaneDisplayUtil;
    private groundDisplayUtil: GroundDisplayUtil;
    private bonusDisplayUtil: BonusDisplayUtil;
    private playerUiDisplayUtil: PlayerUiDisplayUtil;

    private selectedGameOverItem = 0;

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

        // event processing
        var room: Room = this.data.get("GlobalConfig").room;

        var cfg:GlobalConfig = this.data.get(GlobalConfig.KEY);

        this.add.image(0,0, 'bgImage').setOrigin(0);
        
        this.rectHeader = this.add.nineslice(20, 20, 'rctPanel', 0, 760, 60, 14, 14, 14, 14).setOrigin(0);
        var titleText = this.add.text(20,15,"=============== " + cfg.room?.id + " ===============", { fontFamily:"arcadepi", fontSize:30, color: '#00f900' });


        
        this.cntrHeader = containerOfNineSlice(this, this.rectHeader, [titleText]);

        this.rectGameField = this.add.nineslice(20, 100, 'rctPanel', 0, 512, 480, 14, 14,14,14).setOrigin(0);
        var playfield_bg = this.add.image(256,240,'fieldBg').setOrigin(0.5, 0.5);
        this.cntrGameField = this.add.container(this.rectGameField.x, this.rectGameField.y, playfield_bg);

        this.rectGameStat = this.add.nineslice(552, 100, 'rctPanel', 0, 228, 480, 14, 14, 14, 14).setOrigin(0);
        this.cntrGameStat = containerOfNineSlice(this, this.rectGameStat, []);

        // GAME OVER SCREEN
        this.rectGameOver = this.add.nineslice(200,200, 'rctPanel', 0, 400,200, 14, 14, 14, 14).setOrigin(0).setAlpha(0);
        var gameOverText1 = this.add.text(200,35,"GAME OVER", { fontFamily:"arcadepi", fontSize:30 }).setOrigin(0.5);
        this.gameOverText2 = this.add.text(200,65,"You got X points", { fontFamily:"arcadepi", fontSize:30 }).setOrigin(0.5);

        this.gameOverYes = this.add.text(200, 120,"Continue", { fontFamily:"arcadepi", fontSize:30, color: '#00f900' }).setOrigin(0.5).setInteractive().on('pointerdown', () => { room.send('restart'); });
        this.gameOverNo = this.add.text(200, 160,"To Lobby", { fontFamily:"arcadepi", fontSize:30, color: '#00f900' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {});    

        this.cntrGameOver = containerOfNineSlice(this, this.rectGameOver, [gameOverText1, this.gameOverText2, this.gameOverYes, this.gameOverNo]).setAlpha(0).setDepth(20);
        // END GAMEOVER

        this.planeDisplayUtil.registerAnimation();
        this.bonusDisplayUtil.registerAnimation();

        // register key events 
        var controlBtns = this.input.keyboard?.addKeys('W,S,A,D', true, false);
        if(controlBtns) {
            controlBtns.W.addListener('down', () => {
                if(!this.data.get('lost')) {
                    room.send('wasd', 'w');
                } else {
                    if(this.selectedGameOverItem == 0) {
                        this.tweens.getTweensOf(this.gameOverYes)[0].restart().pause();
                        this.tweens.getTweensOf(this.gameOverNo)[0].play();
                        this.selectedGameOverItem = 1;
                    } else {
                        this.tweens.getTweensOf(this.gameOverYes)[0].play();
                        this.tweens.getTweensOf(this.gameOverNo)[0].restart().pause();
                        this.selectedGameOverItem = 0;
                    }
                }
            });
            controlBtns.S.addListener('down', () => {
                if(!this.data.get('lost')) {
                    room.send('wasd', 's');
                } else {
                    if(this.selectedGameOverItem == 1) {
                        this.tweens.getTweensOf(this.gameOverYes)[0].play();
                        this.tweens.getTweensOf(this.gameOverNo)[0].restart().pause();
                        this.selectedGameOverItem = 0;
                    } else {
                        this.tweens.getTweensOf(this.gameOverYes)[0].restart().pause();
                        this.tweens.getTweensOf(this.gameOverNo)[0].play();
                        this.selectedGameOverItem = 1;
                    }
                }
            });
            
            controlBtns.A.addListener('down', () => {room.send('wasd', 'a');});
            controlBtns.D.addListener('down', () => {room.send('wasd', 'd');});
        }
        // receive message if LOST / WIN
        room.onMessage("state", (message) => {
            switch(message) {
                case 'LOST':
                    var mycurrentScore = this.data.get('state').players.get(room.sessionId).score;
                    
                    this.data.set('lost', true);

                    this.gameOverText2.setText("You got " + mycurrentScore + " points")
                    this.cntrGameOver.setAlpha(1);
                    this.rectGameOver.setAlpha(1);
                    this.tweens.add({ targets: this.gameOverYes, alpha: 0.5, duration: 300, repeat: -1, yoyo: true }).play().pause();
                    this.tweens.add({ targets: this.gameOverNo, alpha: 0.5, duration: 300, repeat: -1, yoyo: true }).play().pause();
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