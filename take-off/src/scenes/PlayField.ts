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
            this.data.set('loaded', true);
        });
    }
    update() {
        if(!this.data.get('loaded')) {
            return;
        }
        this._drawGroundTiles(this.data.get("state"))
    }

    _drawGroundTiles(state: any) {
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            const [x,y] = coord.split('.');
            console.log(x, y, tile);
        });
    }
    _drawPlanes() {

    }
}