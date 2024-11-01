import { Scene } from "phaser";

export default class GroundDisplayUtil {

    readonly tSize: number;
    readonly scene: Phaser.Scene;
    readonly w:number;
    readonly h:number;

    private static readonly GROUND_TILE_SPRITESHEET = 'roadSpriteSheet';
    public static readonly GROUND_TILE_SPRITEFILE = '/assets/takeoff_game/roadnoise.png';

    readonly sprites:Map<String,Phaser.GameObjects.Image> = new Map();

    public constructor(s: Phaser.Scene, tsize: number, w:number, h:number){
        this.scene = s;
        this.tSize = tsize;
        this.w = w;
        this.h = h;
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
                endFrame: 12
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
    public drawGroundTiles(container: Phaser.GameObjects.Container, state: any) {
        // center point based 
        var fieldLeftX = 14 + (this.w - state.columns * this.tSize) / 2; 
        var fieldTopY = 14 + (this.h - state.rows * this.tSize) / 2;
        
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            let xy = coord.split('.').map(v => parseInt(v));
            let x = xy[0];
            let y = xy[1];
            if(this.sprites.has(coord)) {
                this.updateMapChar(this.sprites.get(coord)!, tile);               
            } else {
                var sprite = this.drawMapChar(fieldLeftX + x * this.tSize, fieldTopY + y * this.tSize, tile, this.scene)!.setToTop();
                this.sprites.set(coord, sprite);
                container.add(sprite);
            }
        });
    }

    public enableTakeOffs(state:any, isEnabled:boolean) {
        state.mapSpecification.forEach((tile:string ,coord:string)=>{
            if(this.sprites.has(coord) && tile == '*') {
                if(isEnabled) {
                    this.sprites.get(coord)?.setFrame(6);
                } else {
                    this.sprites.get(coord)?.setFrame(5);
                }
            }
        });
    }

    /**
     * update frame ( if map will be changed for any reason )
     * @param image - original image from list
     * @param c - new tile ( or old )
     */
    private updateMapChar(image: Phaser.GameObjects.Image, c:string) {
        switch(c) {
            case '┬': case '┴': case '┤': case '├': image.setFrame(0); break;
            case '─': case '│':                     image.setFrame(1); break;
            case '┌': case '┐': case '┘': case '└': image.setFrame(2); break;
            case '┼': image.setFrame(3); break;
            case '╴': case '╵': case '╶': case '╷': image.setFrame(4); break;

            case '╻': case '╸': case '╹': case '╺': image.setFrame(12); break;

            case '*': image.setFrame(5); break;

            case '║': case '═': image.setFrame(9); break;
            case '╔': case '╗': case '╝': case '╚': image.setFrame(10); break;
            

            default: image.setFrame(7); break;
        }
    }

    /**
     * Draw a tile based on its position and return it.
     * @param x     - tile coord
     * @param y     - tile coord
     * @param c     - tile spec
     * @param scene - scene to draw onto 
     */
    private drawMapChar(x:integer,y:integer, c: string, scene: Scene) {
        switch(c) {

            case '┌': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2);                          break;
            case '╔': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 10);                         break;
            case '┐': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI/2 ); break;
            case '╗': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 10).setRotation( Math.PI/2 ); break;
            
            case '╝': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 10).setRotation( Math.PI   ); break; 
            case '┘': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation( Math.PI   ); break;
            
            case '╚': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 10).setRotation(-Math.PI/2 ); break;
            case '└': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 2).setRotation(-Math.PI/2 ); break;
            
            case '║': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 9);                          break;
            case '│': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 1);                          break;
            
            case '═': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 9).setRotation( Math.PI/2 ); break;
            case '─': return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 1).setRotation( Math.PI/2 ); break;
            
            case '┤':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI   ); break; 
            case '┴':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation(-Math.PI/2 ); break;
            case '├':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0);                          break;
            case '┬':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 0).setRotation( Math.PI/2 ); break;
            case '┼':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 3);                          break;
            case '*':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 5);                          break;
            
            case '╷':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 4); break;
            case '╴':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 4).setRotation( Math.PI/2 ); break; 
            case '╵':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 4).setRotation( Math.PI); break;
            case '╶':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 4).setRotation( -Math.PI/2 ); break;

            case '╻':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 12); break;
            case '╸':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 12).setRotation( Math.PI/2 ); break; 
            case '╹':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 12).setRotation( Math.PI); break;
            case '╺':           return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 12).setRotation( -Math.PI/2 ); break;
            
            default: return scene.add.image(x,y, GroundDisplayUtil.GROUND_TILE_SPRITESHEET, 7); break;
        }
    }
}