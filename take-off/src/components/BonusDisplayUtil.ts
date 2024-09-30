
export default class BonusDisplayUtil {

    public static readonly BONUS_SPRITESHEET = 'bonusSpriteAnimated';
    
    public static registerSpriteSheet(scene: Phaser.Scene, tSize: number) {
        scene.load.spritesheet({
            key: this.BONUS_SPRITESHEET,
            url: 'assets/bonussprite-anim.bmp',
            frameConfig: {
                frameWidth: tSize,
                frameHeight: tSize,
                startFrame: 0,
                endFrame: 3
            }
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
    public static drawBonuses(tSize:number, w:number, h:number, scene: Phaser.Scene,  state: any) 
    {
        // center point based 
        var fieldLeftX = (w - state.columns * tSize) / 2; 
        var fieldTopY = (h - state.rows * tSize) / 2;

        // prepare bonuses to store sprites
        if(!scene.data.get('bonuses')) {
            scene.data.set('bonuses', {});
        }
        var bonuses = scene.data.get('bonuses')

        // transform current existing bonuses list to list of coordinates: ["0.0","1.0",....]
        var incomingBKeys:string[] = [];
        state.bonuses.keys().forEach((key:string) => {
            incomingBKeys.push(key);
        });

        // draw all bonuses from the state ( create if non-exists )
        state.bonuses.entries().forEach(([id ,bonusSpec]:any)=>{ 
            if(!bonuses[id]) {
                var x = fieldLeftX + bonusSpec.x * tSize;
                var y = fieldTopY + bonusSpec.y * tSize; 
                bonuses[id] = scene.add.sprite(x, y,this.BONUS_SPRITESHEET,0).setDepth(3);
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
