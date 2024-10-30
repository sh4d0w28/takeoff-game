import { Room, Client } from "@colyseus/core";
import {Delayed} from "@gamestdio/timer/lib/Delayed"
import { AirFieldState } from "../schemas/AirFieldState";
import { AirFieldStateOption } from "../classes/AirFieldStateOption";
import { PlayerJoinOption } from "../classes/PlayerJoinOption"
import { DirectionEnum } from "../common/Enums";
import { GameMaps } from "../common/Maps";

export class GameRoom extends Room<AirFieldState> {
    maxClients = 6;
    
    /** timer to update state ( will update each 100 ms ) */
    public delayedInterval!: Delayed;

    onCreate (options: AirFieldStateOption) {
      /** keep room even without clients */
      this.autoDispose = false;

      /** if we receive key of map in map_name, create map using that specification */
      if(options.map_name && GameMaps.has(options.map_name)) {
        var aMap = GameMaps.get(options.map_name)
        options.map = aMap.map.join("");
        options.width = aMap.map[0].length;
        options.height = aMap.map.length;
        options.startPoints = aMap.startPoints;
      }

      /** init state and start update loop */
      this.setState(new AirFieldState(options));
      this.clock.start();

      /** set client control button handler */
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
  
      /** declare event on trigger  */
      this.delayedInterval = this.clock.setInterval(() => {
        this.state.advance(this);
      }, 100);
    }
  
    /** add player on join */
    onJoin (client: Client, options: PlayerJoinOption) {
      console.log('[GameRoom]', client.sessionId, "joined!");
      this.state.addPlayer(client.sessionId, options.externalId, options.displayName);
    }
  
    /** remove player on leave, destroy room in the only player */
    onLeave (client: Client, consented: boolean) {
      console.log('[GameRoom]',client.sessionId, "left!");
      if(this.clients.length == 0) {
        this.autoDispose = true;
      }
      this.state.removePlayer(client.sessionId);
    }
  
    /** planeholder ( just log ) */
    onDispose() {
      console.log('[GameRoom]',"room", this.roomId, "disposing...");
    }
  
  }
  