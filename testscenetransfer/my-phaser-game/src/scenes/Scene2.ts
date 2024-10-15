import { Scene } from 'phaser';
import { containerOfGameObject } from '../Utils'

export class Scene2 extends Scene
{
    private topRectangle:Phaser.GameObjects.Rectangle;
    private leftRectangle:Phaser.GameObjects.Rectangle;
    private topContainer: Phaser.GameObjects.Container;
    private leftContainer: Phaser.GameObjects.Container;

    constructor ()
    {
        super('Scene2');
    }

    create (data: any)
    {
        var self = this;
        // add space to trigger change
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() { self.moveFromScene2ToScene1(self); });

        this.topRectangle = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.leftRectangle = this.add.rectangle(20, 100, 760, 480, 0x111111, 0.9).setOrigin(0);
    
        var titleText = this.add.text(20, 20, "Lobby screen");
        this.topContainer = containerOfGameObject(this, this.topRectangle, [titleText]);
        
        var oneroom = this.add.text(20,20, 'ROOM#1');
        this.leftContainer = containerOfGameObject(this, this.leftRectangle,[oneroom]);

        if(data.prepareFromScene1ToScene2) {
            this.completeMoveFromScene1ToScene2();
        }
    }

    /** 
     * Sequence:
     * 1. Hide containers ( alpha 1 => 0)
     * 2. Switch to scene 1 with prepareFromScene2ToScene1
    */
    moveFromScene2ToScene1(self: Phaser.Scene) {
        console.log('Scene2.moveFromScene2ToScene1');
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topContainer, this.leftContainer],
                    alpha:0,
                    ease: 'Cubic',
                    duration: 200,
                    onComplete: function() { self.scene.start ('Scene1', {prepareFromScene2ToScene1:true}); }
                }
            ]
        });
    }

    /**
     * Sequence:
     * 1. Hide containers immediately ( aplha = 0 )
     * 2. Show containers ( alpha 0 => 1 )
     */
    completeMoveFromScene1ToScene2() {
        this.leftContainer.setAlpha(0);
        this.topContainer.setAlpha(0);
    
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topContainer, this.leftContainer],
                    alpha:1,
                    ease: 'Cubic',
                    duration: 200
                }
            ]
        });
    }
}
