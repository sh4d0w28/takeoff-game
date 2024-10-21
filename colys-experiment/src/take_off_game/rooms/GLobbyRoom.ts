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
            var options = {
                
            }
            if (message['map_name']) {
                var map_name = message['map_name'];
                switch (map_name) {
                    case 'map_1': 
                }
            }
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