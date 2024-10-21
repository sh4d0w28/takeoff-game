export default class PlaneDisplayUtil {

    readonly tSize: number;
    readonly scene: Phaser.Scene;
    readonly w:number;
    readonly h:number;

    public static readonly PLANES_SPRITESHEET = 'planesSpriteSheet';
    public static readonly PLANES_SPRITEFILE = 'assets/planesprite-anim.bmp'; 
    
    public constructor(s: Phaser.Scene, tsize :number, w:number, h:number) {
        this.scene = s;
        this.tSize = tsize;
        this.w = w;
        this.h = h;

        // store sprites
        if(!this.scene.data.get('planes')) {
            this.scene.data.set('planes', {});
        }
    }

    public registerSpriteSheet() {
        this.scene.load.spritesheet({
            key: PlaneDisplayUtil.PLANES_SPRITESHEET,
            url: PlaneDisplayUtil.PLANES_SPRITEFILE,
            frameConfig: {
                frameWidth: this.tSize,
                frameHeight: this.tSize,
                spacing: 0
            }
        });
    }

    public registerAnimation() {     
        this.registerAnim('planeAnim1', [0, 6,12,18]);
        this.registerAnim('planeAnim2', [1, 7,13,19]);
        this.registerAnim('planeAnim3', [2, 8,14,20]);
        this.registerAnim('planeAnim4', [3, 9,15,21]);
        this.registerAnim('planeAnim5', [4,10,16,22]);
        this.registerAnim('planeAnim6', [5,11,17,23]);
    }
    
    private registerAnim(key: string, frames: number[] ) {
        this.scene.anims.create({ key: key, frames: this.scene.anims.generateFrameNumbers(PlaneDisplayUtil.PLANES_SPRITESHEET, {frames: frames}), repeat: 1, frameRate: 4});
    }

    /**
     * Draw all the planes using current data as well as current state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
    */
    public drawPlanes(container: Phaser.GameObjects.Container, state: any) 
    {
        // center point based 
        var fieldLeftX = (this.w - state.columns * this.tSize) / 2; 
        var fieldTopY = (this.h - state.rows * this.tSize) / 2;

        let planes = this.scene.data.get('planes');
        
        // for each plane:
        // either create a sprite object in memory, 
        // or update coordinates / states / speed / rotation 
        state.planes.entries().forEach((e:any)=>{
            let sessionId = e[0];
            let planeSpec = e[1];

            // create image on default position
            var planeSprite: Phaser.GameObjects.Sprite;

            if (!planes[sessionId]) {
                planeSprite = this.scene.add.sprite(0,0,PlaneDisplayUtil.PLANES_SPRITESHEET, planeSpec.color);
                planes[sessionId] = planeSprite;
                container.add(planeSprite);
            } else {
                planeSprite = planes[sessionId];
            }

            // move sprite according to plane state
            // fieldLeftX - left of game field, we add Game-coordinates (map based)
            // fieldTopY - top of game field, we add Game-coordinates (map based)
            // planeSpec is an object from Colyseus
            // planeSprite is an sprite object to draw
            this.movePlaneSprite(fieldLeftX + planeSpec.x * this.tSize, fieldTopY + planeSpec.y * this.tSize, planeSpec, planeSprite);
            
            // if plane is dead, play dead animation, set the state to avoid repeatable triggers
            if (planeSpec.state == 'dead'.toUpperCase()) {
                if(!planeSprite.data.has('dead')) {
                    planeSprite.data.set('dead', true);
                    planeSprite.anims.play('planeAnim' + planeSpec.color);
                }
            }
        });
    }
    
    /**
     * Update a single sprite position / angle / state
     * To define position used geo funcs
     * 
     * @param planeLeftX    - left point of plane coords
     * @param planeTopY     - top point of plane coords
     * @param tSize texture - texture size ( currently 32 )
     * @param planeSpec     - plane data from Colyseus
     * @param sprite        - current plane sprite
     */
    private movePlaneSprite(planeLeftX: integer, planeTopY: integer, planeSpec: any, sprite: Phaser.GameObjects.Image) 
    {
        var subModX = 0;
        var subModY = 0;
        var angle = 0;
        if(planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'RIGHT') {
            subModX = -0.5 + planeSpec.subMove;
            subModY = 0;
            angle = 90;
        } else if(planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'LEFT') {
            subModX = 0.5 - planeSpec.subMove;
            subModY = 0;
            angle = 270;
        } else if(planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'UP') {
            subModX = 0; 
            subModY = 0.5 - planeSpec.subMove;
            angle = 0;
        } else if(planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'DOWN') {
            subModX = 0;
            subModY = -0.5 + planeSpec.subMove;
            angle = 180; 
        } else if ( planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'DOWN') {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 90 + a;
        } else if ( planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'LEFT') {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((360 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((360 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'UP') {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((90 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'RIGHT') {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 0 + a;
        } else if ( planeSpec.currentDirection == 'DOWN' && planeSpec.desiredDirection == 'RIGHT') {
            var a = 90 * (-planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == 'LEFT' && planeSpec.desiredDirection == 'DOWN') {
            var a = 90 * (-planeSpec.subMove);    
            subModX = 0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == 'UP' && planeSpec.desiredDirection == 'LEFT') {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((0 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((0 + a) * Math.PI/180);
            angle = 360 + a;
        } else if ( planeSpec.currentDirection == 'RIGHT' && planeSpec.desiredDirection == 'UP') {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((90+a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90+a) * Math.PI/180);
            angle = 90 + a;
        } else {
            subModX = 0; 
            subModY = 0;
        }
        sprite
            .setPosition(planeLeftX + subModX * this.tSize ,planeTopY + subModY * this.tSize)
            .setRotation(angle * Math.PI / 180);
    }
}
