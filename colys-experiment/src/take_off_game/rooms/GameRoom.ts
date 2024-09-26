import { Room, Client } from "@colyseus/core";
import {Delayed} from "@gamestdio/timer/lib/Delayed"
import { AirFieldState } from "../schemas/AirFieldState";
import { AirFieldStateOption } from "../classes/AirFieldStateOption";
import { PlayerJoinOption } from "../classes/PlayerJoinOption"

export class GameRoom extends Room<AirFieldState> {
    maxClients = 6;
    
    public delayedInterval!: Delayed;
  
    onCreate (options: AirFieldStateOption) {    
      this.setState(new AirFieldState(options));
      this.clock.start();
  
      this.delayedInterval = this.clock.setInterval(() => {
        this.state.advance(this);
      }, 100);
    }
  
    onJoin (client: Client, options: PlayerJoinOption) {
      console.log(client.sessionId, "joined!");
      this.state.addPlayer(client.sessionId, options.externalId, options.displayName);
    }
  
    onLeave (client: Client, consented: boolean) {
      console.log(client.sessionId, "left!");
      this.state.removePlayer(client.sessionId);
    }
  
    onDispose() {
      console.log("room", this.roomId, "disposing...");
    }
  
  }
  