
export default class BonusDisplayUtil {

    readonly tSize: number;
    readonly scene: Phaser.Scene;
    readonly w:number;
    readonly h:number;

    public static readonly BONUS_SPRITESHEET = 'bonusSpriteAnimated';
    public static readonly BONUS_SPRITEFILE = '/assets/takeoff_game/bonussprite-anim.bmp';
    
    public constructor(s: Phaser.Scene, tsize :number, w:number, h:number) {
        this.scene = s;
        this.tSize = tsize;
        this.w = w;
        this.h = h;

        // store sprites
        if(!this.scene.data.get('bonuses')) {
            this.scene.data.set('bonuses', {});
        }
    }

    public registerSpriteSheet() {
        this.scene.load.spritesheet({
            key: BonusDisplayUtil.BONUS_SPRITESHEET,
            url: BonusDisplayUtil.BONUS_SPRITEFILE,
            frameConfig: {
                frameWidth: this.tSize,
                frameHeight: this.tSize,
                startFrame: 0,
                endFrame: 3
            }
        });
    }

    public registerAnimation() {
        this.scene.anims.create({
            key: 'bonus',
            frames: this.scene.anims.generateFrameNumbers(BonusDisplayUtil.BONUS_SPRITESHEET, {frames: [0,1,2,3,2,1,0]}),
            repeat: -1,
            frameRate: 20
        });
    }

    /**
     * Draw all bonuses using current data as well as current state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
    */
    public drawBonuses(container: Phaser.GameObjects.Container, state: any) 
    {
        // center point based 
        var fieldLeftX = (this.w - state.columns * this.tSize) / 2; 
        var fieldTopY = (this.h - state.rows * this.tSize) / 2;

        // prepare bonuses to store sprites
        var bonuses = this.scene.data.get('bonuses')

        // transform current existing bonuses list to list of coordinates: ["0.0","1.0",....]
        var incomingBKeys:string[] = [];
        state.bonuses.keys().forEach((key:string) => {
            incomingBKeys.push(key);
        });

        // draw all bonuses from the state ( create if non-exists )
        state.bonuses.entries().forEach((e:any)=>{ 
            var id = e[0];
            var bonusSpec = e[1];
            if(!bonuses[id]) {
                var x = fieldLeftX + bonusSpec.x * this.tSize;
                var y = fieldTopY + bonusSpec.y * this.tSize; 
                bonuses[id] = this.scene.add.sprite(x, y,BonusDisplayUtil.BONUS_SPRITESHEET,0).setDepth(3);
                container.add(bonuses[id]);
                bonuses[id].anims.play('bonus');
            }
        });

        // remove all sprites, which are absent from incoming state
        Object.keys(bonuses).forEach((k:string) => {
            if (!incomingBKeys.includes(k)) {
                bonuses[k].destroy();
                delete bonuses[k]; 
            }
        });
    }
}
