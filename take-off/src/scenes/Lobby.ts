import { Scene } from 'phaser';
import GlobalConfig from '../GlobalConfig';
import { Client, Room } from 'colyseus.js';
import { DirectionEnum } from '../../../common/Enums'

export class Lobby extends Scene {   

    constructor() {
        super("Lobby");
    }

    map2_2 = "┌┐└┘";
    map11_8 = "┌┐┌┐┌┐┌┐┌┐*" 
            + "│└┼┼┼┼┼┼┘│║"
            + "│┌┼┼┼┼┼┼┐│║"
            + "││└┼┼┼┼┘┼┘║"
            + "││┌┼┼┼┼┼┼┐║"
            + "│└┼┼┼┼┼┼┼│║"
            + "│┌┼┼┼┼┼┼┼│║"
            + "└┘└┘└┘└┘└┴┘";

    init(data: GlobalConfig) {
        this.data.values.GlobalConfig = data;
    }

    preload() {
        this.load.image({
            key: "bgImage",
            url: 'assets/images/bg.png'
        });
    }

    create() {
         /** draw basic figures */
        this.add.image(400,300, 'bgImage');
        this.add.rectangle(400, 40, 760, 50, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(270, 320, 500, 450, 0x111111, 0.9).setDepth(1);
        this.add.rectangle(680, 320, 200, 450, 0x111111, 0.9).setDepth(1);
         
        this.data.values.takeoff_rooms = {};
        this.data.values.takeoff_rooms_graphics = {};

        this.add.text(100,150, 'New Room', { color: '#f00'})
            .setInteractive()
            .on('pointerdown', () => this._createRoom() );

        // event processing
        var client:Client = this.data.values.GlobalConfig.colyseus;

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
        var client:Client = this.data.values.GlobalConfig.colyseus;
        client.joinOrCreate("takeoff_room", { 
            width: 11,
            height: 8, 
            map: this.map11_8,
            startPoints:[
                {x:0,y:0,direction: DirectionEnum.RIGHT }
            ],
            externalId: "extId",
            displayName: "uuname"
        }).then((room: Room) => {
            var config: GlobalConfig = this.data.values.GlobalConfig;
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
    _plusroom(roomId: any, room: any) {
        this.data.values.takeoff_rooms[roomId] = room;
        this.data.values.takeoff_rooms_graphics[roomId] = {
            rect: this.add.rectangle(270, 0, 450, 50, 0x660000, 1).setOrigin(0.5).setDepth(2).setInteractive(),
            text: this.add.text(270, 0, "", { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5).setDepth(4)
        };
        this._redraw_rooms()
    }
    _minusroom(roomId: any) {
        delete this.data.values.takeoff_rooms[roomId];
        this.data.values.takeoff_rooms_graphics[roomId].text.destroy();
        this.data.values.takeoff_rooms_graphics[roomId].rect.destroy();
        delete this.data.values.takeoff_rooms_graphics[roomId];
        this._redraw_rooms()
    }
    _rooms(rooms: any) {
        this.data.values.takeoff_rooms = rooms;
        this._redraw_rooms()
    }
    _leave() {console.log('[lobby] Leaving lobby')}

    _redraw_rooms() {
        
        const roomHeight = 50;
        const roomPadding = 10;
        var index = 0;

        Object.entries(this.data.values.takeoff_rooms).forEach(([roomId,room]: any) => {

            const yPosition = index++ * (roomHeight + roomPadding) + 150; // Adjust vertical position
            // Create rounded rectangle for the room
            const roomRectangle = this.add.rectangle(270, yPosition, 450, roomHeight, 0x660000, 1)
                .setOrigin(0.5).setDepth(2).setInteractive();

            // Add room name and user count text
            const text = `${room.roomId} (${room.clients} users)`;
            this.add.text(270, yPosition, text, { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5).setDepth(4);

            // Add interactive listener for room selection
            roomRectangle.on('pointerdown', () => {
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
        var config: GlobalConfig = this.data.values.GlobalConfig;
        config.colyseus.joinById(roomId, {}).then((room) => {
            config.room = room;
            this.scene.switch('Game', config);
        });
    }
}