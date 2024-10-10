import { Scene } from "phaser";

export default class GroundDisplayUtil {

    readonly tSize: number;
    readonly scene: Phaser.Scene;
    readonly w:number;
    readonly h:number;
    readonly top:number;
    readonly left:number;

    private static readonly GROUND_TILE_SPRITESHEET = 'roadSpriteSheet';
    public static readonly GROUND_TILE_SPRITEFILE = 'assets/roadsprite.bmp';

    public constructor(s: Phaser.Scene, tsize: number, w:number, h:number, left:number, top:number){
        this.scene = s;
        this.tSize = tsize;
        this.w = w;
        this.h = h;
        this.top = top;
        this.left = left;

        // no saving required
    }

    public registerSpriteSheet() {
        this.scene.load.spritesheet({
            key: GroundDisplayUtil.GROUND_TILE_SPRITESHEET,
            url: GroundDisplayUtil.GROUND_TILE_SPRITEFILE,
            frameConfig: {
                frameWidth: this.tSize,
                frameHeight: this.tSize,
                spacing: 1,
                startFrame: 0,
                endFrame: 6
            }
        });
    }
    
    /**
     * Draw ground tiles from the state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
     */
    public drawGroundTiles(state: any) {
        // center point based 
        var fieldLeftX = (this.w - state.columns * this.tSize) / 2; 
        var fieldTopY = (this.h - state.rows * this.tSize) / 2;
        
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            const [x,y] = coord.split('.').map(v => parseInt(v));
            this.drawMapChar(fieldLeftX + x * this.tSize, fieldTopY + y * this.tSize, tile, this.scene);
        });
    }

    /**
     * Draw a tile based on its position
     * @param x     - tile coord
     * @param y     - tile coord
     * @param c     - tile spec
     * @param scene - scene to draw onto 
     */
    private drawMapChar(x:integer,y:integer, c: string, scene: Scene) {
        switch(c) {
            case '╔': case '┌': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2);                          break;
            case '╗': case '┐': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI/2 ); break;
            case '╝': case '┘': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI   ); break;
            case '╚': case '└': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation(-Math.PI/2 ); break;
            case '║': case '│': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 1);                          break;
            case '═': case '─': scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 1).setRotation( Math.PI/2 ); break;
            case '┤':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI   ); break; 
            case '┴':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation(-Math.PI/2 ); break;
            case '├':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0);                          break;
            case '┬':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI/2 ); break;
            case '┼':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 3);                          break;
            case '*':           scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 4);                          break;
        }
    }
}