import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room, RoomAvailable } from '../colys/colyseus';
import { containerOfNineSlice } from '../Utils';

class Menu {
    private s: Scene;
    public menulist: Phaser.GameObjects.Text[] = [];
    private menuselected: integer = 0;
    private readonly textStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily:"arcadepi", fontSize:30, color: '#f90000' };

    constructor(s:Scene) {
        this.s = s;
    }

    add(text: string, cb: Function) {            
        let menuTextItem = this.s.add.text(0, 40 * this.menulist.length, text, this.textStyle).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', cb);
        this.s.tweens.add({ targets: menuTextItem, alpha: 0.5, duration: 300, repeat: -1, yoyo: true }).play().pause();
        this.menulist.push(menuTextItem);
    }

    init() {
        this.menuselected = 0;
        this.s.tweens.getTweensOf(this.menulist[0])[0].play();
    }

    select() {
        this.menulist[this.menuselected].emit('pointerdown');
    }

    move(up:boolean) {
        if(up) {
            this.menuselected -= 1;
            if(this.menuselected < 0) {
                this.menuselected = this.menulist.length - 1;
            }
        } else {
            this.menuselected += 1;
            if(this.menuselected >= this.menulist.length ){
                this.menuselected = 0;
            }
        }

        this.menulist.forEach((item:Phaser.GameObjects.Text ,i:number) => {
            if (this.s.tweens.getTweensOf(item).length > 0) {
                if (i == this.menuselected) {
                    this.s.tweens.getTweensOf(item)[0].play();
                } else {
                    this.s.tweens.getTweensOf(item)[0].restart().pause();
                }
            }
        });
    }
}

export class Title extends Scene {

    private rectHeader:Phaser.GameObjects.NineSlice;
    private rectMain:Phaser.GameObjects.NineSlice;
    private rectRight: Phaser.GameObjects.NineSlice;
    
    private cntrHeader: Phaser.GameObjects.Container;
    private cntrMain: Phaser.GameObjects.Container;
    private cntrRight: Phaser.GameObjects.Container;

    private highScores: Phaser.GameObjects.Text;

    constructor() {
        super("Title");
    }
    
    init(data: GlobalConfig) {
        this.data.set(GlobalConfig.KEY, data);
    }
    
    preload() {
        this.load.image({
            key: "bgImage",
            url: 'assets/images/bg.png'
        });
        this.load.image({
            key: "rctPanel",
            url: "assets/images/panel_bg.png"
        })
    }
    
    create (data: any)
    {
        // bg image
        this.add.image(0,0, 'bgImage').setOrigin(0);
        
        // rectangles
        this.rectHeader = this.add.nineslice(20, 20, 'rctPanel', undefined, 760, 60, 20, 20,20,20).setOrigin(0).setDepth(1);
        
        if(data.prepareFromScene2ToScene1) {
            this.rectMain = this.add.nineslice(20, 100, 'rctPanel', undefined, 760, 480, 20, 20,20,20).setOrigin(0).setDepth(1);
        } else {
            this.rectMain = this.add.nineslice(20, 100, 'rctPanel', undefined, 512, 480, 20, 20,20,20).setOrigin(0).setDepth(1);    
        }
        
        this.rectRight = this.add.nineslice(552, 100, 'rctPanel', undefined, 228, 480, 20, 20,20,20).setOrigin(0).setDepth(1);

        var titleText = this.add.text(20,15,"============= MAIN MENU =============", { fontFamily:"arcadepi", fontSize:30, color: '#00f900' });

        /** draw menu ( single player / multiplayer ) */
        
        let mainMenu:Menu = new Menu(this);
        mainMenu.add("Start SinglePlayer", () => { this._startSinglePlayer() });
        mainMenu.add("Go To Lobby", () => { this._goToLobby() });
        mainMenu.init();
        var menuContainer = this.add.container(256,380, mainMenu.menulist);


        var scorepoints = this.add.text(20,20, "High Scores",{ fontFamily:"arcadepi", fontSize:20, color: '#0f0' }).setDepth(2);
        this.highScores = this.add.text(20,50, "",{ fontFamily:"arcadepi", fontSize:15, color: '#0f0' }).setDepth(2)

        // containers
        this.cntrHeader = containerOfNineSlice(this, this.rectHeader, [titleText]);
        this.cntrMain = containerOfNineSlice(this, this.rectMain, [menuContainer]);
        this.cntrRight = containerOfNineSlice(this, this.rectRight, [scorepoints, this.highScores]);

        /** controls processing ( WSAD+SPACE ) */
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() { mainMenu.select(); });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W).addListener('down', function() { mainMenu.move(true); });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S).addListener('down', function() { mainMenu.move(false); });

        // animation for entering / leaving
        if(data.prepareFromScene2ToScene1) {
            this.moveFromLobbyToTitle();
        }

        // join lobby for score things
        var cfg:GlobalConfig = this.data.values.GlobalConfig;
        cfg.colyseus.getAvailableRooms("takeoff_lobby").then((rooms:RoomAvailable[]) => {
            if (rooms.length == 0) {
                console.error('Cannot connect to server!');
                // TODO : add button to reconnect
            }
            var lobbyRoomId = rooms[0].roomId;
            cfg.colyseus.joinById(lobbyRoomId).then((lobby_room:Room) => {
                cfg.room = lobby_room;
                lobby_room.onMessage("score", (data) => { this.updateScore(data); });
                console.info("Joined lobby room!");
            }).catch((e) => { console.error("Error", e); });    
        });
    }

    updateScore(data: any) {
        console.info('update score with ' + data)
        this.highScores.text = "";
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            this.highScores.text += element.userid + ".." + element.score + "\n";
        }
    }

    /**
     * We prepare to move from Lobby layout to Main layout
     * Steps:
     * 1. Hide all content
     * 2. Hide right container
     * 3. Animate:
     * 3.1. Resize main container 760 -> 512 ( 500 ms )
     * 3.2. Right container transparency 0 -> 1 ( 500 ms )
     * 3.3. All container content transparency 0 -> 1 ( 500 ms ) 
     */
    moveFromLobbyToTitle() {
        // hide all the content
        this.cntrHeader.alpha = 0;
        this.cntrMain.alpha = 0;
        this.cntrRight.alpha = 0;
        // hide right container
        this.rectRight.alpha = 0;
        // animate        
        this.tweens.chain({
            tweens:[
                {
                    targets: this.rectMain,
                    ease: 'Cubic',
                    width: 512,
                    duration: 500
                },
                {
                    targets: this.rectRight,
                    alpha:1,
                    ease: 'Cubic',
                    duration: 500
                },
                {
                    targets: [this.cntrHeader, this.cntrMain, this.cntrRight],
                    alpha:1,
                    ease: 'Cubic',
                    duration: 500,
                }
            ]
        });
    }

    /**
     * We are moving from Lobby layout to Main Layout
     * Steps:
     * 1. Animate:
     * 1.1. All container content transparency 1 -> 0 ( 500 ms )
     * 1.2. Right container transparency 1 -> 0 ( 500 ms )
     * 1.3. Resize main container 512 -> 760 ( 500 ms )
     * 1.4. Switch to "Lobby" scene ( no param requie since we already in Lobby-like layout )  
     */
    moveFromTitleToLobby(config: any) {
        
        let self = this
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.cntrHeader, this.cntrMain, this.cntrRight],
                    alpha:0,
                    ease: 'Cubic',
                    duration: 500,
                },
                {
                    targets: this.rectRight,
                    alpha:0,
                    ease: 'Cubic',
                    duration: 300
                },
                {
                    targets: this.rectMain,
                    ease: 'Cubic',
                    width: 760,
                    duration: 300,
                    onComplete: function() { self.scene.switch('Lobby', config); }
                }
            ]
        });
    }

    /** create new default room  */
    _startSinglePlayer() {
        var client:Client = this.data.get(GlobalConfig.KEY).colyseus;
        client.joinOrCreate("takeoff_room", {
            "map_name":"map_3"
            //, externalId: ""
            //, displayName: ""
        }).then((room: Room) => {
            var config: GlobalConfig = this.data.get(GlobalConfig.KEY);
            config.room = room;            
            this.scene.switch('Game', config);
        });
    }
    
    _goToLobby() {
        var cfg: GlobalConfig = this.data.get(GlobalConfig.KEY);
        cfg.room?.leave(true);
        cfg.room = undefined;
        cfg.prepareFromScene1ToScene2 = true;
        this.moveFromTitleToLobby(cfg);
    }
}