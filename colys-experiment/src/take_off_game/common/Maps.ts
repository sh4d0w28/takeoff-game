

class FieldMapStartPoint {
    x: number;
    y: number;
    direction: string
}

class FieldMapSet {
    map: string[];
    startPoints: FieldMapStartPoint[]
}

export const GameMaps: Map<string, FieldMapSet> = new Map([
    ["map_1", {
        map: ["┌┐┌┐┌┐┌┐┌┐┌┐┌┐*"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"        
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "├┼┼┼┼┼┼┼┼┼┼┼┼┤║"
            , "└┘└┘└┴└┘└┘└┘└┴┘"],
        startPoints:[
            {x:0,y:0,direction: 'RIGHT' }
        ],
    }],
    ["map_3", {
        map: ["┌─┐*"
            , "├┬┤║"
            , "│││║"
            , "│││║"
            , "│││║"
            , "└┴┴╝"],
        startPoints:[
            {x:0,y:0,direction: 'RIGHT' }
        ],
    }],
    [
        "map_2", {
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
    ]
]);