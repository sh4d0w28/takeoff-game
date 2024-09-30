import { Scene } from "phaser";

export default class GroundDisplayUtil {

    private static readonly GROUND_TILE_SPRITESHEET = 'roadSpriteSheet';

    /**
     * Draw ground tiles from the state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
     */
    public static drawGroundTiles(tSize:number, w:number,h:number, scene: Scene, state: any) {
        // center point based 
        var fieldLeftX = (w - state.columns * tSize) / 2; 
        var fieldTopY = (h - state.rows * tSize) / 2;
        
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            const [x,y] = coord.split('.').map(v => parseInt(v));
            this.drawMapChar(fieldLeftX + x * tSize, fieldTopY + y * tSize, tile, scene);
        });
    }

    /**
     * Draw a tile based on its position
     * @param x     - tile coord
     * @param y     - tile coord
     * @param c     - tile spec
     * @param scene - scene to draw onto 
     */
    private static drawMapChar(x:integer,y:integer, c: string, scene: Scene) {
        switch(c) {
            case '╔': case '┌': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 2);                          break;
            case '╗': case '┐': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI/2 ); break;
            case '╝': case '┘': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI   ); break;
            case '╚': case '└': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 2).setRotation(-Math.PI/2 ); break;
            case '║': case '│': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 1);                          break;
            case '═': case '─': scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 1).setRotation( Math.PI/2 ); break;
            case '┤':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI   ); break; 
            case '┴':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 0).setRotation(-Math.PI/2 ); break;
            case '├':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 0);                          break;
            case '┬':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI/2 ); break;
            case '┼':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 3);                          break;
            case '*':           scene.add.image(x,y, this.GROUND_TILE_SPRITESHEET, 4);                          break;
        }
    }
}