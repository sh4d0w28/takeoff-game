

class FieldMapStartPoint {
    x: number;
    y: number;
    direction: string
}

class FieldMapSet {
    width: number;
    height:number; 
    map: string[];
    startPoints: FieldMapStartPoint[]
}

export const Map1:FieldMapSet = {
    width: 11,
    height: 8, 
    map: ["┌┐┌┐┌┐┌┐┌┐*"
        , "│└┼┼┼┼┼┼┘│║"
        , "│┌┼┼┼┼┼┼┐│║"
        , "││└┼┼┼┼┘┼┘║"
        , "││┌┼┼┼┼┼┼┐║"
        , "│└┼┼┼┼┼┼┼│║"
        , "│┌┼┼┼┼┼┼┼│║"
        , "└┘└┘└┘└┘└┴┘"],
    startPoints:[
        {x:0,y:0,direction: 'RIGHT' }
    ],
}