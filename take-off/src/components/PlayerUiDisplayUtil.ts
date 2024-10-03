import PlaneDisplayUtil from "./PlaneDisplayUtil";

export default class PlayerUiDisplayUtil {
    
    /**
     * Draw player GUI using current data as well as current state
     * 
     * @param tSize - texture size ( currently 32 )
     * @param w     - width of canvas ( for calculate starting drawing point of airfield ) 
     * @param h     - height of canvas ( for calculate starting drawing point of airfield )
     * @param scene - current scene to draw onto 
     * @param state - current state recevied from Colyseus
     */
    public static drawGUI(tSize: number, w:number, h:number, scene:Phaser.Scene, state: any) {
        // get current user session id
        var sessionId = scene.data.get('GlobalConfig').room.sessionId;
        // center point based 
        var fieldLeftX = (w - state.columns * tSize) / 2; 
        var fieldTopY = (h - state.rows * tSize) / 2;

        scene.add.rectangle(
            fieldLeftX - 30, 
            fieldTopY  - 30, 
            fieldLeftX + 30  + (state.columns * tSize) + 30,
            fieldTopY  + 30 + (state.rows * tSize) + 30,
            0x001100, 
        ).setDepth(-1);

        this.drawSpeedAndScore(fieldLeftX, fieldTopY, sessionId, scene, state);
        this.drawPlayersScores(fieldLeftX, fieldTopY + (state.rows * tSize), scene, state)
    }

    private static drawPlayersScores(leftX: number, topY: number, scene:Phaser.Scene, state: any) {
        var i = 0;
        state.players.entries().forEach(([sessionId,playerSpec]:any)=>{
            var planeSpec = state.planes.get(sessionId)
            scene.add.sprite(leftX, topY + 10 + 35 * i, PlaneDisplayUtil.PLANES_SPRITESHEET, planeSpec.color).setDepth(2);
            scene.add.text(leftX + 35, topY + 5 + 35 * i, playerSpec.displayedName + " : " + playerSpec.score).setDepth(2);
            i++;
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
    private static drawSpeedAndScore(leftX:number, topY:number, sessionId:string, scene:Phaser.Scene, state: any) {       
        if(!scene.data.get('speed')) {
            scene.data.set('speed', scene.add.text(leftX, topY-30, 'speed').setDepth(3));
        }
        let speedCtrl:Phaser.GameObjects.Text = scene.data.get('speed');
        let myPlane = state.planes.get(sessionId);
        if(myPlane.currentSpeed >= myPlane.takeOffSpeed) {
            speedCtrl.setText('SPEED ACHIEVED! GO TO RUNWAY!');
        } else {
            speedCtrl.setText('speed: ' + myPlane.currentSpeed + " / " + myPlane.takeOffSpeed);
        }
    }
}