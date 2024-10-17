import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room, RoomAvailable } from 'colyseus.js';
import { Map1 }  from '../../../common/Maps';
import { containerOfNineSlice } from '../Utils';

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
        this.data.values.menulist = [];
        this.data.values.menuselected = 0;
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
        let singlePlayerText = this.add.text(0, 0, 'Start SinglePlayer', { fontFamily:"arcadepi", fontSize:30, color: '#f90000' }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => this._startSinglePlayer() );
        let multiPlayerText =  this.add.text(0, 40, 'Go To Lobby', { fontFamily:"arcadepi", fontSize:30, color: '#f90000' }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => this._goToLobby() );        
        this.setTween(singlePlayerText).play();
        this.setTween(multiPlayerText).pause();
        this.data.values.menulist.push(singlePlayerText);
        this.data.values.menulist.push(multiPlayerText);

        var menuContainer = this.add.container(256,380, [singlePlayerText, multiPlayerText]);

        var scorepoints = this.add.text(20,20, "High Scores",{ fontFamily:"arcadepi", fontSize:20, color: '#0f0' }).setDepth(2);
        this.highScores = this.add.text(20,50, "",{ fontFamily:"arcadepi", fontSize:15, color: '#0f0' }).setDepth(2)

        // containers
        this.cntrHeader = containerOfNineSlice(this, this.rectHeader, [titleText]);
        this.cntrMain = containerOfNineSlice(this, this.rectMain, [menuContainer]);
        this.cntrRight = containerOfNineSlice(this, this.rectRight, [scorepoints, this.highScores]);

        /** controls processing ( WSAD+SPACE ) */
        var self = this;
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() {
            var selected = self.data.values.menuselected;
            if (selected == 0) {
                self._startSinglePlayer()
            } else {
                self._goToLobby();
            }
        });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W).addListener('down', function() {
            self._menuItem(true);
        });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S).addListener('down', function() {
            self._menuItem(false);
        });

        // animation for entering / leaving
        if(data.prepareFromScene2ToScene1) {
            this.moveFromLobbyToTitle();
        }

        // event processing
        var client:Client = this.data.values.GlobalConfig.colyseus;
        client.getAvailableRooms("takeoff_lobby").then((rooms:RoomAvailable[]) => {
            var lobbyRoomId = rooms[0].roomId;
            console.log('found lobby room!');
            client.joinById(lobbyRoomId).then((lobby_room) => {
                this.data.values.GlobalConfig.room = lobby_room;    
                lobby_room.onMessage("score", (data) => { this.updateScore(data); });      
                console.log("Joined lobby room!");
            }).catch((e) => { console.error("Error", e); });    
        });
    }

    updateScore(data: any) {
        this.highScores.text = "";
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            this.highScores.text += element.userid + ".." + element.score + "\n";
        }
    }

    moveFromLobbyToTitle() {

        this.cntrHeader.alpha = 0;
        this.cntrMain.alpha = 0;
        this.cntrRight.alpha = 0;
        this.rectRight.alpha = 0;
        
        console.log('Title.moveFromLobbyToTitle');

        this.tweens.chain({
            tweens:[
                {
                    targets: this.rectMain,
                    ease: 'Cubic',
                    width: 512,
                    duration: 500,
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

    moveFromTitleToLobby(config: any) {
        
        console.log('Scene1.moveFromTitleToLobby');

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
                    duration: 500
                },
                {
                    targets: this.rectMain,
                    ease: 'Cubic',
                    width: 760,
                    duration: 500,
                    onComplete: function() { self.scene.switch('Lobby', config); }
                }
            ]
        });
    }

    // menu up / down ( cycle )
    _menuItem (goUp:Boolean) {
        let selected:number = this.data.values.menuselected;
        let menulist:Phaser.GameObjects.Text[] = this.data.values.menulist;
        if(goUp) {
            selected -= 1;
            if (selected < 0 ) {
                selected = menulist.length - 1;
            } 
        } else {
            selected += 1;
            if (selected >= menulist.length) {
                selected = 0;
            }
        }
        menulist.forEach((obj:Phaser.GameObjects.Text ,i:number) => {
            if(this.tweens.getTweensOf(obj).length > 0) {
                if(i == selected) {
                    this.tweens.getTweensOf(obj)[0].play();
                } else {
                    this.tweens.getTweensOf(obj)[0].restart().pause();
                }
            }
        });
        this.data.values.menuselected = selected;
    }

    /** create new default room  */
    _startSinglePlayer() {
        var client:Client = this.data.get(GlobalConfig.KEY).colyseus;
        client.joinOrCreate("takeoff_room", { 
            width: Map1.width
          , height: Map1.height
          , map: Map1.map.join("")
          , startPoints: Map1.startPoints
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
        cfg.room?.leave
        cfg.prepareFromScene1ToScene2 = true;
        this.moveFromTitleToLobby(cfg);
    }
 
    setTween(el: Phaser.GameObjects.Text) {
        return this.tweens.add({
            targets: el,
            alpha: 0.5,
            ease: '',  
            duration: 300,
            repeat: -1,
            yoyo: true
        });
    }
}