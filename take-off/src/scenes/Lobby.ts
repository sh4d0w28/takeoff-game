import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room, RoomAvailable } from 'colyseus.js';
import { Map1 } from '../../../common/Maps';


class RoomRect {

    private rect: Phaser.GameObjects.Rectangle;
    private name: Phaser.GameObjects.Text;
    private players: Phaser.GameObjects.Text;
    private roomId: string;
    
    /**
     * 
     * @param dx left of ext container
     * @param dy top of ext container
     * @param ind index of elemen
     * @param room data
     */
    constructor(scene:Lobby, dx:number,dy:number,ind: number, room:any) {
        const rw = 170;
        const rh = 120;
        const padx = 10;
        const pady = 20;
        const itemsInRow = 4;
        
        var cellx = dx + 20 + ( padx + rw ) * (ind % itemsInRow);
        var celly = dy + 20 + ( pady + rh ) * Math.trunc(ind / itemsInRow);
        
        this.rect = scene.add.rectangle(cellx, celly, rw, rh, 0x333333).setOrigin(0).setInteractive();

        if (room) {
            this.roomId = room.roomId;
            this.name = scene.add.text(cellx+(rw/2), celly+10, room.roomId, { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);
            this.players = scene.add.text(cellx+(rw/2), celly+30, room.clients + " users", { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        } else {
            this.name = scene.add.text(cellx+(rw/2), celly+10, "NEW", { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);
            this.players = scene.add.text(cellx+(rw/2), celly+30, "", { fontFamily:'arcadepi', fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        }

        // Add interactive listeners
        this.rect.on('pointerdown', () => {
            if(this.roomId) {
                scene._joinGame(this.roomId)
            } else {
                scene._createRoom();
            }
        });
        this.rect.on('pointerover', () => {
            this.rect.setFillStyle(0x0056b3);
        });
        this.rect.on('pointerout', () => {
            this.rect.setFillStyle(0x333333);
        });          
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

        // event processing
        var client:Client = this.data.values.GlobalConfig.colyseus;

        client.getAvailableRooms("takeoff_lobby").then((rooms:RoomAvailable[]) => {
            var lobbyRoomId = rooms[0].roomId;
            console.log('found lobby room!');
            client.joinById(lobbyRoomId).then((lobby_room) => {
        
                this.data.values.GlobalConfig.room = lobby_room;
    
                lobby_room.onMessage("rooms", (rooms) => { this._rooms(rooms); } );
                lobby_room.onMessage("+", ([roomId, room]) => { this.onAddRoom(roomId, room); });
                lobby_room.onMessage("-", (roomId) => { this.onRemoveRoom(roomId); });
                lobby_room.onLeave(() => { this._leave(); });  
    
                console.log("Joined lobby room!");
            })
            .catch((e) => {
                console.error("Error", e);
            });    
        });
    }

    _createRoom(){
        var config:GlobalConfig = this.data.values.GlobalConfig;
        config.room?.send("new", { 
            width: Map1.width,
            height: Map1.height,
            map: Map1.map.join(),
            startPoints: Map1.startPoints
        });
    }
    
    onAddRoom(roomId: any, room: any) {
        console.log('add rooms');
        this.data.values.takeoff_rooms[roomId] = room;
        this._redraw_rooms()
    }
    onRemoveRoom(roomId: any) {
        console.log('remove rooms');
        delete this.data.values.takeoff_rooms[roomId];
        this._redraw_rooms()
    }
    _rooms(rooms: any) {
        console.log('rooms');
        this.data.values.takeoff_rooms = rooms;
        this._redraw_rooms()
    }
    _leave() {console.log('[lobby] Leaving lobby')}

    _redraw_rooms() {
        var ids:string[] = [];
        this.data.values.takeoff_rooms_graphics["NEW"] = new RoomRect(this, 20, 120, ids.length, null);
        
        Object.entries(this.data.values.takeoff_rooms).forEach(([i,room]: any) => {
            ids.push(room.roomId);
            if(!this.data.values.takeoff_rooms_graphics[room.roomId]) {
                this.data.values.takeoff_rooms_graphics[room.roomId] = new RoomRect(this, 20, 120, -1, room);
            } else {
                this.data.values.takeoff_rooms_graphics[room.roomId].setPlayers(room.clients);
            }
        });
        Object.keys(this.data.values.takeoff_rooms_graphics).filter((v)=> ids.indexOf(v)==-1).forEach((v) => {
            this.data.values.takeoff_rooms_graphics[v].delete();
            delete this.data.values.takeoff_rooms_graphics[v];
        });
        
        var i = 0;
        Object.values(this.data.values.takeoff_rooms_graphics).forEach(r => r.setPos(20,120, i++));
    }

    _joinGame(roomId: string) {
        var config: GlobalConfig = this.data.values.GlobalConfig;
        if (roomId) {
            config.colyseus.joinById(roomId, {}).then((room) => {
                config.room = room;
                this.scene.switch('Game', config);
            });
        }
    }
}