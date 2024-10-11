import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room } from 'colyseus.js';
import { Map1 }  from '../../../common/Maps';

export class Title extends Scene {

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
    }
    create ()
    {
        /** draw basic figures */
        //this.add.image(0,0, 'bgImage').setOrigin(0);
        this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0).setDepth(1);
        this.add.rectangle(20, 120, 500, 450, 0x111111, 0.9).setOrigin(0).setDepth(1);
        this.add.rectangle(550, 120, 800 - 20 - 550, 450, 0x111111, 0.9).setOrigin(0).setDepth(1);
        
        /** draw menu ( single player / multiplayer ) */
        let singlePlayerText = this.add.text(20+250, 400, 'Start SinglePlayer', { fontFamily:"arcadepi", fontSize:30, color: '#030' }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => this._startSinglePlayer() );
        let multiPlayerText =  this.add.text(20+250, 450, 'Go To Lobby', { fontFamily:"arcadepi", fontSize:30, color: '#030' }).setOrigin(0.5).setDepth(2).setInteractive().on('pointerdown', () => this._goToLobby() );
        
        this.setTween(singlePlayerText).play();
        this.setTween(multiPlayerText).pause();

        this.data.values.menulist.push(singlePlayerText);
        this.data.values.menulist.push(multiPlayerText);

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
        this.scene.switch('Lobby', this.data.get(GlobalConfig.KEY));
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