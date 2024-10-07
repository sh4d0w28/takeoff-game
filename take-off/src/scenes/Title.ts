import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import AnimateTextHelper from '../AnimateTextHelper';

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
        this.add.text(100, 100, 'Start!', { color: '#0f0' }).setInteractive().on('pointerdown', () => this.switchToLobby() );
    }
    switchToLobby() {
        console.log('switch to lobby');
        this.scene.switch('Lobby', this.data.get('globaldata'));
    }
}