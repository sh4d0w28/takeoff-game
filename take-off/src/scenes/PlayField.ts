import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Room } from 'colyseus.js';

export class PlayField extends Scene {   

    constructor() {
        super("Game");
    }
    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }
    create() {
        // event processing
        var room: Room = this.data.get("GlobalConfig").room; 
        room.onStateChange((state) => {
            this.data.set("state", state);
        });
    }
    update() {
        console.log('state',this.data.get("state"));
    }
}