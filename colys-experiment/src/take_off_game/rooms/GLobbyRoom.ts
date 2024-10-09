import { LobbyRoom, matchMaker } from "colyseus";

export class GLobbyRoom extends LobbyRoom {
    
    async onCreate(options: any) {
        super.onCreate(options);
        this.autoDispose = false;
        this.onMessage("new", (client, message) => {    
            matchMaker.createRoom("takeoff_room", message);
        });
    }
}







