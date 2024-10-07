import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';

export class Title extends Scene {
    constructor() {
        super("Title");
    }
    init(data: GlobalConfig) {
        this.data.set('globaldata', data);
        this.data.set('menulist', []);
        this.data.set('menuselected', 0);
    }
    preload() {
        this.load.image({
            key: "bgImage",
            url: 'assets/images/bg.png'
        });
    }
    create ()
    {
        this.add.image(400,300, 'bgImage');
        this.add.rectangle(400, 40, 760, 50, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(270, 320, 500, 450, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(680, 320, 200, 450, 0x111111, 0.9).setDepth(1);
        
        let singlePlayerText = this.add.text(100, 400, 'SINGLEPLAYER', { fontFamily:"Arial", fontSize:40, color: '#0f0' }).setDepth(2).setInteractive().on('pointerdown', () => this.createRoom() );
        let multiPlayerText = this.add.text(100, 450, 'MULTIPLAYER', { fontFamily:"Arial", fontSize:40, color: '#0f0' }).setDepth(2).setInteractive().on('pointerdown', () => this.switchToLobby() );
        
        this.setTween(singlePlayerText);
        this.setTween(multiPlayerText);

        this.data.get('menulist').push(singlePlayerText);
        this.data.get('menulist').push(multiPlayerText);

        this.setTween(this.data.get('menulist')[0]);

        var controlBtns = this.input.keyboard?.addKeys('W,S');
        var self = this;
        if(controlBtns) {
            controlBtns.W.addListener('up',    function() { self.menuItem(true); });
            controlBtns.S.addListener('down',  function() { self.menuItem(false); });
        }
    }
    menuItem (goUp:Boolean) {
        let selected:number = this.data.get('menuselected');
        let menulist:Phaser.GameObjects.Text[] = this.data.get('menulist')
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
        console.log(selected, menulist);
        this.data.set('menuselected', selected);
    }
    createRoom() {

    }
    switchToLobby() {
        console.log('switch to lobby');
        this.scene.switch('Lobby', this.data.get('globaldata'));
    }
    update() {
        var menuselected = this.data.get('menuselected');
        this.data.get('menulist').forEach((obj:Phaser.GameObjects.Text ,i:number) => {
            if(this.tweens.getTweensOf(obj).length > 0) {
                if(i == menuselected) {
                    this.tweens.getTweensOf(obj)[0].play();
                } else {
                    this.tweens.getTweensOf(obj)[0].pause();
                }
            }
        });
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