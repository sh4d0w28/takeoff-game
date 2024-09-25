import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';

export class Title extends Scene {
    constructor() {
        super("Title");
    }
    init(data: GlobalConfig) {
        this.data.set('globaldata', data);
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