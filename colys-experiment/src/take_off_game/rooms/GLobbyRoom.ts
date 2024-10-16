import { Delayed, LobbyRoom, matchMaker } from "colyseus";
import PersistentStorage from "../../PersistentStorage";

export class GLobbyRoom extends LobbyRoom {
    
    public delayedInterval!: Delayed;
    public storage: PersistentStorage;

    async onCreate(options: any) {
        super.onCreate(options);
        this.autoDispose = false;
        this.storage = new PersistentStorage();
        this.clock.start();

        this.onMessage("scores", (client, message) => {    
            matchMaker.createRoom("takeoff_room", message);
        });

        this.delayedInterval = this.clock.setInterval(() => {
            this.broadcast('score', this.storage.listHighScores());
        }, 1000);
    }
}







