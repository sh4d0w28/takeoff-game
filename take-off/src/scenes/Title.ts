import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room } from 'colyseus.js';
import { DirectionEnum } from '../../../common/Enums';
import {Map1}  from '../../../common/Maps';

export class Title extends Scene {
    
    constructor() {
        super("Title");
    }
    init(data: GlobalConfig) {
        this.data.values.GlobalConfig = data;
        this.data.values.menulist = [];
        this.data.values.menuselected = 0;
    }
    preload() {
        this.load.image({
            key: "bgImage",
            url: 'assets/images/bg.png'
        });
    }
    create ()
    {
        /** draw basic figures */
        this.add.image(400,300, 'bgImage');
        this.add.rectangle(400, 40, 760, 50, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(270, 320, 500, 450, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(680, 320, 200, 450, 0x111111, 0.9).setDepth(1);
        
        /** draw menu ( single player / multiplayer ) */
        let singlePlayerText = this.add.text(100, 400, 'SINGLEPLAYER', { fontFamily:"Arial", fontSize:40, color: '#0f0' }).setDepth(2).setInteractive().on('pointerdown', () => this.createRoom() );
        let multiPlayerText = this.add.text(100, 450, 'MULTIPLAYER', { fontFamily:"Arial", fontSize:40, color: '#0f0' }).setDepth(2).setInteractive().on('pointerdown', () => this.switchToLobby() );
        
        this.setTween(singlePlayerText).play();
        this.setTween(multiPlayerText).pause();

        this.data.values.menulist.push(singlePlayerText);
        this.data.values.menulist.push(multiPlayerText);

        /** controls processing ( WSAD+SPACE ) */
        var self = this;
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() {
            var selected = self.data.values.menuselected;
            if (selected == 0) {
                console.log('createRoom');
                self.createRoom()
            } else {
                console.log('switchLobby');
                self.switchToLobby();
            }
        });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W).addListener('down', function() {
            self._menuItem(true);
        });
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S).addListener('down', function() {
            self._menuItem(false);
        })
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
    createRoom() {
        var client:Client = this.data.values.GlobalConfig.colyseus;
        client.joinOrCreate("takeoff_room", { 
            width: Map1.width,
            height: Map1.height,
            map: Map1.map.join(),
            startPoints: Map1.startPoints,
            externalId: "extId",
            displayName: "uuname"
        }).then((room: Room) => {
            var config: GlobalConfig = this.data.values.GlobalConfig;
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
    switchToLobby() {
        this.scene.switch('Lobby', this.data.values.GlobalConfig);
    }
 
    setTween(el: Phaser.GameObjects.Text) {
        return this.tweens.add({
            targets: el,
            alpha: 0,
            ease: 'Cubic.easeOut',  
            duration: 500,
            repeat: -1,
            yoyo: true
        });
    }
}