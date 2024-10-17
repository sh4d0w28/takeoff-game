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

        this.onMessage("new", (client, message) => {    
            console.log('need create takeoff_room')
            matchMaker.createRoom("takeoff_room", message);
        });
        
        this.delayedInterval = this.clock.setInterval(() => {
            this.storage.listHighScores().then(data => {
                this.broadcast('score', data);                 
            });
        }, 1000);
    }
}