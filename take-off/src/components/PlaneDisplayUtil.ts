import { DirectionEnum } from "../../../common/Enums";


export default class PlaneDisplayUtil {

    public static readonly PLANES_SPRITESHEET = 'planesSpriteSheet';

    public static registerSpriteSheet(scene: Phaser.Scene, tSize: number) {
        scene.load.spritesheet({
            key: this.PLANES_SPRITESHEET,
            url: 'assets/planesprite-anim.bmp',
            frameConfig: {
                frameWidth: tSize,
                frameHeight: tSize,
                spacing: 0
            }
        });
    }

    public static registerAnimation(scene: Phaser.Scene) {     
        scene.anims.create({ key: 'planeAnim1', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[0, 6,12,18]}), repeat: 1, frameRate: 4});
        scene.anims.create({ key: 'planeAnim2', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[1, 7,13,19]}), repeat: 1, frameRate: 4});
        scene.anims.create({ key: 'planeAnim3', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[2, 8,14,20]}), repeat: 1, frameRate: 4});
        scene.anims.create({ key: 'planeAnim4', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[3, 9,15,21]}), repeat: 1, frameRate: 4});
        scene.anims.create({ key: 'planeAnim5', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[4,10,16,22]}), repeat: 1, frameRate: 4});
        scene.anims.create({ key: 'planeAnim6', frames: scene.anims.generateFrameNumbers(this.PLANES_SPRITESHEET, {frames:[5,11,17,23]}), repeat: 1, frameRate: 4});
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
    public static drawPlanes(tSize: number, w:number, h:number, scene: Phaser.Scene, state: any) 
    {
        // center point based 
        var fieldLeftX = (w - state.columns * tSize) / 2; 
        var fieldTopY = (h - state.rows * tSize) / 2;

        // prepare 'planes' object to keep planes data locally for processing
        if(!scene.data.get('planes')) {
            scene.data.set('planes', {});
        }

        let planes = scene.data.get('planes');
        
        // for each plane:
        // either create a sprite object in memory, 
        // or update coordinates / states / speed / rotation 
        state.planes.entries().forEach(([sessionId,planeSpec]:any)=>{

            // create image on default position
            if (!planes[sessionId]) {
                planes[sessionId] = scene.add.sprite(0,0,this.PLANES_SPRITESHEET, planeSpec.color).setDepth(2);
            }
            var psprite: Phaser.GameObjects.Sprite = planes[sessionId];
            // move sprite according to plane state
            this.movePlaneSprite(fieldLeftX + planeSpec.x * tSize, fieldTopY + planeSpec.y * tSize, tSize, planeSpec, psprite);
            if (planeSpec.state == 'dead'.toUpperCase()) {
                if(!psprite.data.has('dead')) {
                    psprite.data.set('dead', true);
                    debugger;
                    psprite.anims.play('planeAnim' + planeSpec.color);
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
    private static movePlaneSprite(planeLeftX: integer, planeTopY: integer, tSize:number, planeSpec: any, sprite: Phaser.GameObjects.Image) 
    {
        var subModX = 0;
        var subModY = 0;
        var angle = 0;
        if(planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            subModX = -0.5 + planeSpec.subMove;
            subModY = 0;
            angle = 90;
        } else if(planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            subModX = 0.5 - planeSpec.subMove;
            subModY = 0;
            angle = 270;
        } else if(planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.UP) {
            subModX = 0; 
            subModY = 0.5 - planeSpec.subMove;
            angle = 0;
        } else if(planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            subModX = 0;
            subModY = -0.5 + planeSpec.subMove;
            angle = 180; 
        } else if ( planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 90 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            var a = 90 * (planeSpec.subMove);     
            subModX = -0.5 + 0.5 * Math.cos((360 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((360 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.UP) {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((90 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            var a = 90 * (planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 0 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.DOWN && planeSpec.desiredDirection == DirectionEnum.RIGHT) {
            var a = 90 * (-planeSpec.subMove);     
            subModX = 0.5 + 0.5 * Math.cos((180 + a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((180 + a) * Math.PI/180);
            angle = 180 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.LEFT && planeSpec.desiredDirection == DirectionEnum.DOWN) {
            var a = 90 * (-planeSpec.subMove);    
            subModX = 0.5 + 0.5 * Math.cos((270 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((270 + a) * Math.PI/180);
            angle = 270 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.UP && planeSpec.desiredDirection == DirectionEnum.LEFT) {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((0 + a) * Math.PI/180);
            subModY = 0.5 + 0.5 * Math.sin((0 + a) * Math.PI/180);
            angle = 360 + a;
        } else if ( planeSpec.currentDirection == DirectionEnum.RIGHT && planeSpec.desiredDirection == DirectionEnum.UP) {
            var a = 90 * (-planeSpec.subMove);
            subModX = -0.5 + 0.5 * Math.cos((90+a) * Math.PI/180);
            subModY = -0.5 + 0.5 * Math.sin((90+a) * Math.PI/180);
            angle = 90 + a;
        } else {
            subModX = 0; 
            subModY = 0;
        }
        sprite
            .setPosition(planeLeftX + subModX * tSize ,planeTopY + subModY * tSize)
            .setRotation(angle * Math.PI / 180);
    }
}
