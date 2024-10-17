import { Client, Room } from "colyseus.js";

export default class GlobalConfig {

    public static KEY = "GlobalConfig"

    colyseus: Client;
    room?: Room;
    
    prepareFromScene1ToScene2?: boolean;
}