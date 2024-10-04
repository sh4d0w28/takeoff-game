import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import AnimateTextHelper from '../AnimateTextHelper';

export class Title extends Scene {
    
    constructor() {
        super("Title");
    }
    init(data: GlobalConfig) {
        this.data.set('globaldata', data);
        this.data.set('menu', []);
        this.data.set('menuselected', 0);
    }
    create ()
    {
        var controlBtns = this.input.keyboard?.addKeys('W,S');
        var scene = this;
        if(controlBtns) {
            controlBtns.W.addListener('up',    function() { scene.menu(false); });
            controlBtns.S.addListener('down',  function() { scene.menu(true); });
        }

        const startText = this.add.text(400, 300, 'Start Game').setOrigin(0.5);
        this.data.get('menu').push(startText);

        const highScoreText = this.add.text(400,350, 'Leaders Table').setOrigin(0.5);
        this.data.get('menu').push(highScoreText);

        this.add.text(100, 100, 'Start!', { color: '#0f0' }).setInteractive().on('pointerdown', () => this.switchToLobby() );
    }
    switchToLobby() {
        console.log('switch to lobby');
        this.scene.switch('Lobby', this.data.get('globaldata'));
    }
    update() {
        this.data.get('menu').forEach((i,n) => {
            console.log(i);
            console.log(n);
        });
    }

    menu(down: boolean) {
        var menuselected = this.data.get('menuselected');
        var items = this.data.get('menu').length;
        if(down) {
            menuselected ++;
            if(menuselected >= items){ menuselected = 0; }
        } else {
            menuselected --;
            if(menuselected < 0) { menuselected = items-1; }
        }
        this.data.set('menuselected');
    }
}