import { Schema, type, MapSchema } from "@colyseus/schema";
import { Room } from "colyseus";
import { PlayerState } from "./PlayerState";
import { AirFieldStateOption } from "../classes/AirFieldStateOption";
import FieldMapUtil from "../utils/FieldMapUtil";
import { PlaneState } from "./PlaneState";
import PlayerStartPointOption from "../classes/PlayerStartPointOption";
import RandomStringUtil from "../utils/RandomUtil";
import { PlaneStateEnum } from "../../../../common/Enums";
import RandomUtil from "../utils/RandomUtil";

export class AirFieldState extends Schema {

    @type("number") columns: number;                             // width(W) of the playfield
    @type("number") rows: number;                                // height(H) of the playfield
    @type({ map: "string" }) mapSpecification: Map<string, string>; // map specification in the way 'key':'pseudograph'

    @type({ map: PlaneState }) planes = new MapSchema<PlaneState>();
    @type({ map: PlayerState }) players = new MapSchema<PlayerState>();

    startPoints: PlayerStartPointOption[]

    // options:
    // {
    //      width: 2
    //      height: 2
    //      map: "┌┐└┘"
    // }
    constructor(options: AirFieldStateOption) {
        super();
        this.columns = options.width;
        this.rows = options.height;
        this.mapSpecification = FieldMapUtil.stringFieldSpecToMap(options.map, options.width);

        this.startPoints = options.startPoints;
    }

    // advance state ( move planes, pickup bonuses, increase scores, takingoff )
    advance(room?: Room) {
        // TODO : implement
        this._advancePlanes(room);
    }

    // add player
    // sessionId - Colyseum sessionid
    // externalId - User id in oAuth provider
    // displayName - Name user want to see
    addPlayer(sessionId: string, externalId: string, displayName: string) {
        //register player
        this.players.set(sessionId, new PlayerState(sessionId, externalId, displayName));
        // get startpoint
        const sp = this.startPoints[0];
        // create plane
        this.planes.set(sessionId, new PlaneState(
            sp.x,
            sp.y,
            sp.direction,
            RandomUtil.getRandomInt(8, 10),
            RandomUtil.getFreeColor(this.planes)
        ));
    }

    // player quit. Remove him from the list and all his assets
    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
        this.planes.delete(sessionId);
    }

    private _advancePlanes(room?: Room) {
        this.planes.forEach((plane, sessionId) => {

            // stop processing dead
            if (plane.state == PlaneStateEnum.DEAD) {
                return;
            }

            // get current cell
            const currentFieldContent = this.mapSpecification.get(
                FieldMapUtil.xyToKey(plane.x, plane.y)
            );

            // if on a runway - start takeoff
            if (FieldMapUtil.isATakeOffZone(currentFieldContent)) {
                plane.state = PlaneStateEnum.TAKEOFF;
            }

            // check if we try to score a point
            if (FieldMapUtil.isAScorePoint(currentFieldContent)) {
                if (plane.currentSpeed >= plane.takeOffSpeed) {
                    this.players.get(sessionId).score++;
                    // reset speeds 
                    plane.currentSpeed = 0;
                    plane.takeOffSpeed = RandomUtil.getRandomInt(8, 10);
                    // startpoint
                    var sp = this.startPoints[0];
                    plane.x = sp.x;
                    plane.y = sp.y;
                    plane.state = PlaneStateEnum.OK;
                    plane.currentDirection = sp.direction;
                    plane.desiredDirection = sp.direction;
                    return;
                } else {
                    plane.currentSpeed = 0;
                    plane.state = PlaneStateEnum.DEAD;
                    room.clients.getById(sessionId).send('state', 'LOST');
                    return;
                }
            }

            var allowedDirections = FieldMapUtil.getAllowedDirections(
                currentFieldContent, plane.currentDirection
            );

            if (allowedDirections.includes(plane.userCommand)) {
                // turn if we have user command allowed and only if less than 10% path passed 
                if (plane.subMove <= 0.2) {
                    plane.decideAutoTurn(plane.userCommand);
                }
            } else if (allowedDirections.includes(plane.currentDirection)) {
                // just continue moving if we have allowed diirection
            } else {
                // decide autoturn if no user input
                if (plane.subMove <= 0.2) {
                    var rnd = RandomStringUtil.getRandomInt(0, allowedDirections.length - 1);
                    plane.decideAutoTurn(allowedDirections[rnd]);
                }
            }
            plane.move();
        });
    }
}