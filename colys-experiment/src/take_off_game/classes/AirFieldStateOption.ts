import PlayerStartPointOption from "./PlayerStartPointOption";

export class AirFieldStateOption {
    width: number;  // width(W) of the playfield
    height: number; // height(H) of the playfield
    map: string;    // string of <W x H> pseudographic chars
    startPoints: PlayerStartPointOption[] // list of points users can start 
}