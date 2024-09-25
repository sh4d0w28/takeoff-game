import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client } from 'colyseus.js';

export class Lobby extends Scene {   

    constructor() {
        super("Lobby");
    }

    init(data: GlobalConfig) {
        this.data.set('client', data.colyseus);
    }

    create() {
        this.data.set('takeoff_rooms', {});
        this.data.set('rectangles', []);
        
        this.add.text(100, 100, 'LBY!', { color: '#0f0' });

        this.add.text(100,150, 'CREATE', { color: '#f00'})
            .setInteractive()
            .on('pointerdown', () => this._createRoom() );

        // event processing
        var client:Client = this.data.get("client");
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
    // update(time, delta) {
    //     console.log(time,delta);
    // }
    _createRoom(){
        var client:Client = this.data.get('client')
        client.create("takeoff_room", { 
            width: 2,
            height: 2, 
            map: "┌┐└┘",
            startPoints:[
                {x:0,y:0,direction:"UP"}
            ]
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

}