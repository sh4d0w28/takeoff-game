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

        /** create empty room */
        this.onMessage("new", (client, message) => {
            matchMaker.createRoom("takeoff_room", message);
        });

        /** loop to broadcast highscore */
        this.delayedInterval = this.clock.setInterval(() => {
            this.storage.listHighScores().then(data => {
                this.broadcast('score', data);                 
            });
        }, 1000);
    }
}