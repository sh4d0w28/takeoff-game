import { Client, Room } from "colyseus.js";

export default class GlobalConfig {
    colyseus: Client;
    room?: Room
}