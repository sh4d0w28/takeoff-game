import {Schema, type} from "@colyseus/schema";

export class BonusState extends Schema {

    @type("number") x: number;
    @type("number") y: number;
    @type("number") points: number;
    
    constructor(x:number, y:number, points:number) {
        super();
        this.x = x;
        this.y = y;
        this.points = points;
    }
}