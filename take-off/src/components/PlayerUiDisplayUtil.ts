import PlaneDisplayUtil from "./PlaneDisplayUtil";

export default class PlayerUiDisplayUtil {
    
    readonly tSize: number;
    readonly scene: Phaser.Scene;
    readonly w:number;
    readonly h:number;

    public constructor(s: Phaser.Scene, tsize :number, w:number, h:number) {
        this.scene = s;
        this.tSize = tsize;
        this.w = w;
        this.h = h;

        // keep score texts and icons
        if(!this.scene.data.get('playerScores')) {
            this.scene.data.set('playerScores', {});
        }
    }

    /**
     * Draw player GUI using current data as well as current state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
     */
    public drawGUI(state: any) {
        // get current user session id
        var sessionId = this.scene.data.get('GlobalConfig').room.sessionId;
        // center point based 
        var fieldLeftX = (this.w - state.columns * this.tSize) / 2; 
        var fieldTopY = (this.h - state.rows * this.tSize) / 2;

        this.scene.add.rectangle(
            fieldLeftX - 30, 
            fieldTopY  - 30, 
            fieldLeftX + 30  + (state.columns * this.tSize) + 30,
            fieldTopY  + 30 + (state.rows * this.tSize) + 30,
            0x001100, 
        ).setDepth(-1);

        this.drawSpeedAndScore(fieldLeftX, fieldTopY, sessionId, state);
        this.drawPlayersScores(fieldLeftX, fieldTopY + (state.rows * this.tSize), state)
    }

    private drawPlayersScores(leftX: number, topY: number, state: any) {
        var i = 0;
        state.players.entries().forEach(([sessionId,playerSpec]:any)=>{
            var planeSpec = state.planes.get(sessionId)

            var planeScoreSprite: Phaser.GameObjects.Sprite;
            var planeScoreText: Phaser.GameObjects.Text;

            if(!this.scene.data.get('playerScores')[sessionId]) {
                planeScoreSprite = this.scene.add.sprite(leftX, topY + 10 + 35 * i, PlaneDisplayUtil.PLANES_SPRITESHEET, planeSpec.color).setDepth(2); 
                planeScoreText = this.scene.add.text(leftX + 35, topY + 5 + 35 * i, playerSpec.displayedName + " : " + playerSpec.score).setDepth(2);
                i++;
                this.scene.data.get('playerScores')[sessionId] = {
                    sprite :planeScoreSprite,
                    text :planeScoreText
                }
            } else {
                planeScoreSprite = this.scene.data.get('playerScores')[sessionId].sprite;
                planeScoreText = this.scene.data.get('playerScores')[sessionId].text
                planeScoreText.setText(playerSpec.displayedName + " : " + playerSpec.score);
            }
        });
    }

    /**
     * Draw speed and score
     * @param leftX     - left point of plane coords
     * @param topY      - top point of plane coords 
     * @param sessionId - user session id
     * @param scene     - current scene to draw onto 
     * @param state     - current state recevied from Colyseus
     */
    private drawSpeedAndScore(leftX:number, topY:number, sessionId:string, state: any) {       
        if(!this.scene.data.get('speed')) {
            this.scene.data.set('speed', this.scene.add.text(leftX, topY-30, 'speed').setDepth(3));
        }
        let speedCtrl:Phaser.GameObjects.Text = this.scene.data.get('speed');
        let myPlane = state.planes.get(sessionId);
        if(myPlane.currentSpeed >= myPlane.takeOffSpeed) {
            speedCtrl.setText('SPEED ACHIEVED! GO TO RUNWAY!');
        } else {
            speedCtrl.setText('speed: ' + myPlane.currentSpeed + " / " + myPlane.takeOffSpeed);
        }
    }
}