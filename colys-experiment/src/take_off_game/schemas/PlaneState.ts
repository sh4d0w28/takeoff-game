import { Schema, type } from '@colyseus/schema'
import { DirectionEnum, PlaneStateEnum } from '../../../../common/Enums';
import FieldMapUtil from '../utils/FieldMapUtil';

export class PlaneState extends Schema {
    
    @type("number") x: number;
    @type("number") y: number;
    @type("string") currentDirection:string; // direction we are going right now ( while we in cell )
    @type("string") desiredDirection:string; // direction person want to go ( probably not allowed )
    @type("number") currentSpeed: number;  // current speed of plane
    @type("number") takeOffSpeed: number;  // speed to successfully takeoff
    @type("string") state: string;  // 'ok', 'dead', 'takeoff'
    @type("number") color: number;  // 'RED','BLUE','GREEN'
    @type("number") subMove: number; // current part of cell we drove

    subStep:number = 0.2; // each cell will require 20 ticket to pass
    decisionFinal = true; // if we can turn plane direction in the next cell
    userCommand: string;

    constructor(x: number, y: number, initialDirection:string, takeOffSpeed: number, color: number) {
        super();
        this.state = PlaneStateEnum.OK;
        this.currentSpeed = 0;
        this.takeOffSpeed = takeOffSpeed;
        this.x = x;
        this.y = y;
        this.currentDirection = initialDirection;
        this.desiredDirection = initialDirection; // initially we plan to go direction we face 
        this.subMove = 0;
        this.color = color;   
    }

    askToTurn(requestedDirection: string) {
        this.userCommand = requestedDirection;
    }

    decideAutoTurn(dir: string) {
        if(!this.decisionFinal) {
            this.decisionFinal = true;
            this.desiredDirection = dir;
        }
    }

    move() {
        // no move for the dead
        if (this.state == PlaneStateEnum.DEAD) {
            return;
        }
        // progress substep
        this.subMove += this.subStep;
        // if we taking off, speed up
        if(this.state == PlaneStateEnum.TAKEOFF) {
            this.subMove += this.subStep;
        }
        
        // if we reach end of cell
        if(this.subMove >= 1) {
            // enable to change direction in new cell
            this.decisionFinal = false

            // switch to next cell ... 
            this.subMove = 0;
            // ... and depend on which direction we face, change coordinates
            switch(this.desiredDirection) {
                case DirectionEnum.UP:
                    this.y --;
                    break;
                case DirectionEnum.DOWN:
                    this.y ++;
                    break;
                case DirectionEnum.LEFT:
                    this.x --;
                    break;
                case DirectionEnum.RIGHT:
                    this.x ++;
                    break;
                default:
                    break;
            }
            // sync current direction with desired.
            // after moving from cell to cell we face latest direction
            this.currentDirection = this.desiredDirection;
        }
    }
}