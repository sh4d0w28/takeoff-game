import { DirectionEnum } from "../../../../common/Enums";

export default abstract class FieldMapUtil {

    // transforms line of field specification ( pseudograph )
    // to the map:
    // {
    //  "0.0" => '|'
    //  "0.1" => '+'
    //  ...
    // } 
    public static stringFieldSpecToMap(playFieldSpec: string, width: number) {
        let fieldMap = new Map<string,string>();
        var x = 0;
        var y = 0;
        for(var i = 0; i< playFieldSpec.length; i++) {
          fieldMap.set(this.xyToKey(x,y), playFieldSpec[i]);
          x++;
          if(x >= width) { y++; x = 0;} 
        }
        return  fieldMap;
    }

    // coords to key for map
    // return '5.1'
    public static xyToKey(x: number, y:number) {
      return x + '.' + y
    }

    // map key to coords struct
    // {x:0, y:0}
    public static keyToXy(key: string) {
      const xy = key.split('.');
      return { 'x' : parseInt(xy[0]), 'y' : parseInt(xy[1]) }
    }

    public static isATakeOffZone(c: string) {
      return "═║╔╗╚╝".includes(c);       
    }

    public static isAScorePoint(c: string) {
      return "*" == c;       
    }

    public static getAllowedDirections(c: string, currentDirection: string) {
      var allowed: string[] = [];
      switch(c) {
        case '─':
        case '═':
          allowed = [DirectionEnum.RIGHT,DirectionEnum.LEFT];
          break;
        case '│':
        case '║':
          allowed = [DirectionEnum.UP,DirectionEnum.DOWN];
          break;
        case '┐':
        case '╗':
          allowed = [DirectionEnum.LEFT,DirectionEnum.DOWN];
          break;
        case '┘':
        case '╝':
          allowed = [DirectionEnum.LEFT,DirectionEnum.UP];
          break;
        case '└':
        case '╚':
          allowed = [DirectionEnum.RIGHT,DirectionEnum.UP];
          break;
        case '┌':
        case '╔':
          allowed = [DirectionEnum.RIGHT,DirectionEnum.DOWN];
          break;
        case '┤':
          allowed = [DirectionEnum.UP,DirectionEnum.LEFT,DirectionEnum.DOWN];
          break;
        case '┴':
          allowed = [DirectionEnum.UP,DirectionEnum.LEFT,DirectionEnum.RIGHT];
          break;
        case '├':
          allowed = [DirectionEnum.UP,DirectionEnum.RIGHT,DirectionEnum.DOWN];
          break;
        case '┬':
          allowed = [DirectionEnum.DOWN,DirectionEnum.LEFT,DirectionEnum.RIGHT];
          break;
        case '┼':
          allowed = [DirectionEnum.UP,DirectionEnum.RIGHT,DirectionEnum.LEFT,DirectionEnum.DOWN];
          break
        default: 
          allowed = [];
          break;
      }

      var oppositeDir = FieldMapUtil.getOppositeDirection(currentDirection);
      allowed = allowed.filter(o => o != oppositeDir);
      
      return allowed;
    }

    public static getOppositeDirection(dir: string) {
      switch(dir) {
          case DirectionEnum.UP: return DirectionEnum.DOWN;
          case DirectionEnum.DOWN: return DirectionEnum.UP;
          case DirectionEnum.LEFT: return DirectionEnum.RIGHT;
          case DirectionEnum.RIGHT: return DirectionEnum.LEFT;
      }
    }
}