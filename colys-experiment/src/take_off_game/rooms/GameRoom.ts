import { Room, Client } from "@colyseus/core";
import {Delayed} from "@gamestdio/timer/lib/Delayed"
import { AirFieldState } from "../schemas/AirFieldState";
import { AirFieldStateOption } from "../classes/AirFieldStateOption";
import { PlayerJoinOption } from "../classes/PlayerJoinOption"
import { DirectionEnum } from "../common/Enums";
import { GameMaps } from "../common/Maps";

export class GameRoom extends Room<AirFieldState> {
    maxClients = 6;
    
    public delayedInterval!: Delayed;

    onCreate (options: AirFieldStateOption) {
      this.autoDispose = false;

      if(options.map_name && GameMaps.has(options.map_name)) {
        var aMap = GameMaps.get(options.map_name)
        options.map = aMap.map.join("");
        options.width = aMap.map[0].length;
        options.height = aMap.map.length;
        options.startPoints = aMap.startPoints;
      }

      this.setState(new AirFieldState(options));
      this.clock.start();
      
      this.onMessage("wasd", (client, message:string) => {
        switch(message.toLowerCase()) {
          case 'w':
            this.state.planes.get(client.sessionId).askToTurn(DirectionEnum.UP);
            break;
          case 's':
            this.state.planes.get(client.sessionId).askToTurn(DirectionEnum.DOWN);
          break;
          case 'a':
            this.state.planes.get(client.sessionId).askToTurn(DirectionEnum.LEFT);
          break;
          case 'd':
            this.state.planes.get(client.sessionId).askToTurn(DirectionEnum.RIGHT);
          break;
        }
      });
  
      this.delayedInterval = this.clock.setInterval(() => {
        this.state.advance(this);
      }, 100);
    }
  
    onJoin (client: Client, options: PlayerJoinOption) {
      console.log('[GameRoom]', client.sessionId, "joined!");
      this.state.addPlayer(client.sessionId, options.externalId, options.displayName);
    }
  
    onLeave (client: Client, consented: boolean) {
      console.log('[GameRoom]',client.sessionId, "left!");
      if(this.clients.length == 0) {
        this.autoDispose = true;
      }
      this.state.removePlayer(client.sessionId);
    }
  
    onDispose() {
      console.log('[GameRoom]',"room", this.roomId, "disposing...");
    }
  
  }
  