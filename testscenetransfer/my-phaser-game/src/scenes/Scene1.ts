import { Scene, Tweens } from 'phaser';
import { containerOfGameObject } from '../Utils'

export class Scene1 extends Scene
{
    private topRectangle:Phaser.GameObjects.Rectangle;
    private leftRectangle:Phaser.GameObjects.Rectangle;
    private rightRectangle: Phaser.GameObjects.Rectangle;
    private topContainer: Phaser.GameObjects.Container;
    private leftContainer: Phaser.GameObjects.Container;
    private rightContainer: Phaser.GameObjects.Container;


    constructor ()
    {
        super('Scene1');
    }

    create (data: any)
    {
        var self = this;
        // add space to trigger change
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() { self.moveFromScene1ToScene2(self); });

        // top rectangle is always there
        this.topRectangle = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);

        if(data.prepareFromScene2ToScene1) {
            this.leftRectangle = this.add.rectangle(20, 100, 760, 480, 0x111111, 0.9).setOrigin(0);
        } else {
            this.leftRectangle = this.add.rectangle(20, 100, 512, 480, 0x111111, 0.9).setOrigin(0);    
        }
        
        this.rightRectangle = this.add.rectangle(552, 100, 228, 480, 0x111111, 0.9).setOrigin(0);

        var titleText = this.add.text(20,20,"Main screen");

        var menuTextLine1 = this.add.text(20,20,"Menu");
        var menuTextLine2 = this.add.text(20,40,"MenuText-1");

        var highScoreTitleLine = this.add.text(20,20,"Score");
        var highScoreEntryLine = this.add.text(20,40,"Score1: 000");

        this.topContainer = containerOfGameObject(this, this.topRectangle, [titleText]);
        this.leftContainer = containerOfGameObject(this, this.leftRectangle, [menuTextLine1, menuTextLine2]);
        this.rightContainer = containerOfGameObject(this, this.rightRectangle, [highScoreTitleLine, highScoreEntryLine]);

        if(data.prepareFromScene2ToScene1) {
            this.completeMoveFromScene2ToScene1();
        }
    }
    
    /**
     * Sequence:
     * 1. Hide containers immediately ( alpha = 0 ), Hide right rectangle immediately (alpha = 0 )
     * 2. Resize left rectangle ( 760 => to 512 ) 
     * 3. Show right rectangle ( alpha 0 => 1 )
     * 4. Show containers ( alpha 0 => 1 )
     */
    completeMoveFromScene2ToScene1() {

        this.topContainer.alpha = 0;
        this.leftContainer.alpha = 0;
        this.rightContainer.alpha = 0;
        this.rightRectangle.alpha = 0;
        
        console.log('Scene1.completeMoveFromScene2ToScene1');

        this.tweens.chain({
            tweens:[
                {
                    targets: this.leftRectangle,
                    ease: 'Cubic',
                    width: 512,
                    duration: 400,
                },
                {
                    targets: this.rightRectangle,
                    alpha:1,
                    ease: 'Cubic',
                    duration: 200
                },
                {
                    targets: [this.topContainer, this.leftContainer, this.rightContainer],
                    alpha:1,
                    ease: 'Cubic',
                    duration: 200,
                }
            ]
        });
    }

    /**
     * Sequence: 
     * 1. hide containers ( alpha 1 => 0 )
     * 2. hide right rectangle ( alpha 1 => 0 )
     * 3. resize left rectangle ( width 512 => 760 )
     * 4. switch to scene 2
     */
    moveFromScene1ToScene2(self: Phaser.Scene) {
        console.log('Scene1.moveFromScene1ToScene2');
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topContainer, this.leftContainer, this.rightContainer],
                    alpha:0,
                    ease: 'Cubic',
                    duration: 200,
                },
                {
                    targets: this.rightRectangle,
                    alpha:0,
                    ease: 'Cubic',
                    duration: 200
                },
                {
                    targets: this.leftRectangle,
                    ease: 'Cubic',
                    width: 760,
                    duration: 500,
                    onComplete: function() { self.scene.switch('Scene2', {prepareFromScene1ToScene2:true}); }
                }
            ]
        });
    }
}
