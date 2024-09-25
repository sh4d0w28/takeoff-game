import {Schema, type} from "@colyseus/schema";

export class PlayerState extends Schema {

    @type("string") sessionId: string;
    @type("string") externalId: string;
    @type("string") displayedName: string;
    @type("number") score: number;
    
    constructor(sessionId:string, externalId:string, displayedName:string) {
        super();
        this.sessionId = sessionId;
        this.externalId = externalId;
        this.displayedName = displayedName;
    }
}