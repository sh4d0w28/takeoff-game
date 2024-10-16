import { Scene } from 'phaser';
import { containerOfNineSlice } from '../Utils'

export class Scene1 extends Scene
{
    private topRectangle:Phaser.GameObjects.NineSlice;
    private leftRectangle:Phaser.GameObjects.NineSlice;
    private rightRectangle: Phaser.GameObjects.NineSlice;
    private topContainer: Phaser.GameObjects.Container;
    private leftContainer: Phaser.GameObjects.Container;
    private rightContainer: Phaser.GameObjects.Container;

    private spritesheet_id = 'borderSpreadSheet';
    private spritesheet_file = 'assets/rect_bg2.png';

    constructor ()
    {
        super('Scene1');
    }

    preload() {

        this.load.image({
            key: this.spritesheet_id,
            url: this.spritesheet_file
        });
    }

    create (data: any)
    {
        var self = this;
        // add space to trigger change
        this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).addListener('down', function() { self.moveFromScene1ToScene2(self); });

        // top rectangle is always there
        this.topRectangle = this.add.nineslice(20,20,'borderSpreadSheet', undefined,760,60,32,32,32,32).setOrigin(0).setAlpha(0.9);

        if(data.prepareFromScene2ToScene1) {
            this.leftRectangle = this.add.nineslice(20,100,'borderSpreadSheet', undefined,760,480,32,32,32,32).setOrigin(0).setAlpha(0.9);
        } else {
            this.leftRectangle = this.add.nineslice(20,100,'borderSpreadSheet', undefined,512,480,32,32,32,32).setOrigin(0).setAlpha(0.9);
        }
        
        this.rightRectangle = this.add.nineslice(552,100,'borderSpreadSheet', undefined,228,480,32,32,32,32).setOrigin(0).setAlpha(0.9);

        var titleText = this.add.text(20,20,"Main screen");

        var menuTextLine1 = this.add.text(20,20,"Menu");
        var menuTextLine2 = this.add.text(20,40,"MenuText-1");

        var highScoreTitleLine = this.add.text(20,20,"Score");
        var highScoreEntryLine = this.add.text(20,40,"Score1: 000");

        this.topContainer = containerOfNineSlice(this, this.topRectangle, [titleText]);
        this.leftContainer = containerOfNineSlice(this, this.leftRectangle, [menuTextLine1, menuTextLine2]);
        this.rightContainer = containerOfNineSlice(this, this.rightRectangle, [highScoreTitleLine, highScoreEntryLine]);

        if(data.prepareFromScene2ToScene1) {
            this.completeMoveFromScene2ToScene1();
        }

        var ns = this.add.nineslice(200,200,'borderSpreadSheet',undefined,64,64,32,32,32,32).setDepth(19999);
        ns.setSlices(90,90,32,32,32,32,true);

        // this.add.sprite(0,0,this.spritesheet_id, 0).set
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
