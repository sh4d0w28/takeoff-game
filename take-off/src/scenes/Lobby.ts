import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room } from 'colyseus.js';
import { DirectionEnum } from '../../../common/Enums'

export class Lobby extends Scene {   

    constructor() {
        super("Lobby");
    }

    map2_2 = "┌┐└┘";
    map10_4 = "┌┐┌┐┌┐┌┐┌┐" 
           + "│└┘└┘└┘└┘│"
           + "│┌┐┌┐┌┐┌┐│"
           + "└┘└┘└┘└┘└┘";

    init(data: GlobalConfig) {
        this.data.set('GlobalConfig', data);
    }

    create() {
        this.data.set('takeoff_rooms', {});
        
        this.add.text(100, 100, 'LBY!', { color: '#0f0' });

        this.add.text(100,150, 'New Room', { color: '#f00'})
            .setInteractive()
            .on('pointerdown', () => this._createRoom() );

        // event processing
        var client:Client = this.data.get("GlobalConfig").colyseus;

        client.joinOrCreate("takeoff_lobby").then((lobby_room) => {
        
            lobby_room.onMessage("rooms", (rooms) => { this._rooms(rooms); } );
            lobby_room.onMessage("+", ([roomId, room]) => { this._plusroom(roomId, room); });
            lobby_room.onMessage("-", (roomId) => { this._minusroom(roomId); });
            lobby_room.onLeave(() => { this._leave(); });  

            console.log("Joined lobby room!");
        })
        .catch((e) => {
            console.error("Error", e);
        });
    }

    _createRoom(){
        var client:Client = this.data.get("GlobalConfig").colyseus;
        client.joinOrCreate("takeoff_room", { 
            width: 10,
            height: 4, 
            map: this.map10_4,
            startPoints:[
                {x:0,y:0,direction: DirectionEnum.RIGHT }
            ],
            externalId: "extId",
            name: "uuname"
        }).then((room: Room) => {
            var config: GlobalConfig = this.data.get('GlobalConfig');
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
    _plusroom(roomId: any, room: any) {
        console.log("[lobby] Room add:", roomId, room)
        this.data.get('takeoff_rooms')[roomId] = room;
        this._redraw_rooms()
    }
    _minusroom(roomId: any) {
        console.log("[lobby] Room removed", roomId);
        this.data.get('takeoff_rooms')[roomId] = null;
        this._redraw_rooms()
    }
    _rooms(rooms: any) {
        console.log("[lobby] Rooms received:", rooms);
        this.data.set('takeoff_rooms', rooms);
        this._redraw_rooms()
    }
    _leave() {console.log('[lobby] Leaving lobby')}

    _redraw_rooms() {
        
        const roomHeight = 50;
        const roomPadding = 10;
        var index = 0;

        console.log('rms', this.data.get("takeoff_rooms"));

        Object.entries(this.data.get('takeoff_rooms')).forEach(([roomId,room]: any) => {

            console.log(room);
            const yPosition = index++ * (roomHeight + roomPadding) + 100; // Adjust vertical position
            // Create rounded rectangle for the room
            const roomRectangle = this.add.rectangle(400, yPosition, 300, roomHeight, 0x007bff, 1)
                .setOrigin(0.5)
                .setInteractive();

            // Add room name and user count text
            const text = `${room.roomId} (${room.clients} users)`;
            this.add.text(400, yPosition, text, { fontSize: '20px', color: '#ffffff' })
                .setOrigin(0.5);

            // Add interactive listener for room selection
            roomRectangle.on('pointerdown', () => {
                console.log(`Selected: ${room.roomId}`);
                this._joinGame(room.roomId)
                // Handle room selection logic here
            });

            // Optional: Change color on hover
            roomRectangle.on('pointerover', () => {
                roomRectangle.setFillStyle(0x0056b3);
            });

            roomRectangle.on('pointerout', () => {
                roomRectangle.setFillStyle(0x007bff);
            });          
        })
    }

    _joinGame(roomId: string) {
        var config: GlobalConfig = this.data.get('GlobalConfig');
        config.colyseus.joinById(roomId, {}).then((room) => {
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
}