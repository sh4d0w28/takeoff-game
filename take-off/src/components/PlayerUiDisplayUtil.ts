
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

        this.drawSpeedAndScore(fieldLeftX, fieldTopY, sessionId, scene, state)
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