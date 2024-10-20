

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
    width: 21,
    height: 13, 
    map: ["┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐┌┐*"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"        
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤║"
        , "└┘└┘└┘└┘└┴└┘└┘└┘└┘└┴┘"],
    startPoints:[
        {x:0,y:0,direction: 'RIGHT' }
    ],
}

export const Map2:FieldMapSet = {
    width: 4,
    height: 7, 
    map: ["╔╗╝╚"
        , "┌┐┘└"
        , "║═│─"
        , "┤┴├┬"
        , "┼  *"
        , "╴╵╶╷"
        , "╸╹╺╻"],
    startPoints:[
        {x:0,y:0,direction: 'RIGHT' }
    ],
}