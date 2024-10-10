import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room } from 'colyseus.js';
import { Map1 } from '../../../common/Maps';


class RoomRect {

    private rect: Phaser.GameObjects.Rectangle;
    private name: Phaser.GameObjects.Text;
    private players: Phaser.GameObjects.Text;
    
    /**
     * 
     * @param dx left of ext container
     * @param dy top of ext container
     * @param ind index of elemen
     * @param room data
     */
    constructor(scene:Scene, dx:number,dy:number,ind: number, room:any) {
        const rw = 170;
        const rh = 120;
        const padx = 10;
        const pady = 20;
        const itemsInRow = 4;
        
        var cellx = dx + 20 + ( padx + rw ) * (ind % itemsInRow);
        var celly = dy + 20 + ( pady + rh ) * Math.trunc(ind / itemsInRow);
        
        this.rect = scene.add.rectangle(cellx, celly, rw, rh, 0x333).setOrigin(0);
        this.name = scene.add.text(cellx+(rw/2), celly+10, room.id, { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        this.players = scene.add.text(cellx+(rw/2), celly+30, room.clients + " users", { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);

        // // Add interactive listener for room selection
        // roomRectangle.on('pointerdown', () => {
        //     this._joinGame(roomId)
        //     // Handle room selection logic here
        // });

        // // Optional: Change color on hover
        // roomRectangle.on('pointerover', () => {
        //     roomRectangle.setFillStyle(0x0056b3);
        // });

        // roomRectangle.on('pointerout', () => {
        //     roomRectangle.setFillStyle(0x007bff);
        // });          

    }

    setPlayers(players: number)  {
        this.players.setText(players + " users");
    }

    setPos(dx:number,dy:number, ind:  number) {
        const rw = 170;
        const rh = 120;
        const padx = 10;
        const pady = 20;
        const itemsInRow = 4;
        
        var cellx = dx + 20 + ( padx + rw ) * (ind % itemsInRow);
        var celly = dy + 20 + ( pady + rh ) * Math.trunc(ind / itemsInRow);
        
        this.rect.setPosition(cellx, celly);
        this.name.setPosition(cellx+(rw/2), celly+10);
        this.players.setPosition(cellx+(rw/2), celly+30);
    }

    delete() {
        this.rect.destroy();
        this.name.destroy();
        this.players.destroy();
    }
}
export class Lobby extends Scene {   

    constructor() {
        super("Lobby");
    }

    init(data: GlobalConfig) {
        this.data.values.GlobalConfig = data;
        this.data.values.takeoff_rooms_graphics = {}
        this.data.values.takeoff_rooms = {};
    }

    preload() {
        this.load.image({
            key: "bgImage",
            url: 'assets/images/bg.png'
        });
    }

    create() {

        /** draw basic figures */
        //this.add.image(0,0, 'bgImage').setOrigin(0);
        this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0).setDepth(1);
        this.add.rectangle(20, 120, 760, 450, 0x111111, 0.9).setOrigin(0).setDepth(1);

//        this._createRoomRect(20,120, 0, {id:'11', clients:5});
        
        // this.add.text(100,150, 'New Room', { color: '#f00'})
        //     .setInteractive()
        //     .on('pointerdown', () => this._createRoom() );

        // event processing
        var client:Client = this.data.values.GlobalConfig.colyseus;

        client.joinOrCreate("takeoff_lobby").then((lobby_room) => {
        
            lobby_room.onMessage("rooms", (rooms) => { this._rooms(rooms); } );
            lobby_room.onMessage("+", ([roomId, room]) => { this.onAddRoom(roomId, room); });
            lobby_room.onMessage("-", (roomId) => { this.onRemoveRoom(roomId); });
            lobby_room.onLeave(() => { this._leave(); });  

            console.log("Joined lobby room!");
        })
        .catch((e) => {
            console.error("Error", e);
        });
    }

    _createRoom(){
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
    
    onAddRoom(roomId: any, room: any) {
        this.data.values.takeoff_rooms[roomId] = room;
        this._redraw_rooms()
    }
    onRemoveRoom(roomId: any) {
        delete this.data.values.takeoff_rooms[roomId];
        this._redraw_rooms()
    }
    _rooms(rooms: any) {
        this.data.values.takeoff_rooms = rooms;
        this._redraw_rooms()
    }
    _leave() {console.log('[lobby] Leaving lobby')}

    _redraw_rooms() {
        
        var i = 0;
        var ids:string[] = [];
        Object.entries(this.data.values.takeoff_rooms).forEach(([roomId,room]: any) => {
            ids.push(roomId);
            if(!this.data.values.takeoff_rooms_graphics[roomId]) {
                this.data.values.takeoff_rooms_graphics[roomId] = new RoomRect(this, 20, 120, i++, room);
            } else {
                this.data.values.takeoff_rooms_graphics[roomId].setPos(i);
                this.data.values.takeoff_rooms_graphics[roomId].setPlayers(room.clients);
            }
        });

        Object.keys(this.data.values.takeoff_rooms).filter((v)=> ids.indexOf(v)>-1).forEach((v) => {
            this.data.values.takeoff_rooms_graphics[v].delete();
            delete this.data.values.takeoff_rooms_graphics[v];
        })
    }

    _joinGame(roomId: string) {
        var config: GlobalConfig = this.data.values.GlobalConfig;
        config.colyseus.joinById(roomId, {}).then((room) => {
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
}