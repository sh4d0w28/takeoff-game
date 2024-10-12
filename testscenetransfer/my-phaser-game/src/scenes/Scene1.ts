import { Scene, Tweens } from 'phaser';
import { containerOfGameObject } from '../Utils';

export class Scene1 extends Scene
{
    private top:Phaser.GameObjects.Rectangle;
    private left:Phaser.GameObjects.Rectangle;
    private right: Phaser.GameObjects.Rectangle;
    private topcontainer: Phaser.GameObjects.Container;
    private leftcontainer: Phaser.GameObjects.Container;
    private rightcontainer: Phaser.GameObjects.Container;


    constructor ()
    {
        super('Scene1');
    }

    create (data: any)
    {
        this.top = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        //
        if(data.prepareFromScene2ToScene1) {
            this.left = this.add.rectangle(20, 100, 760, 480, 0x111111, 0.9).setOrigin(0);
        } else {
            this.left = this.add.rectangle(20, 100, 512, 480, 0x111111, 0.9).setOrigin(0);    
        }
        
        this.right = this.add.rectangle(552, 100, 228, 480, 0x111111, 0.9).setOrigin(0);

        var titleText = this.add.text(20,20,"Main screen");

        var menuTextLine1 = this.add.text(20,20,"Menu");
        var menuTextLine2 = this.add.text(20,40,"MenuText-1");

        var highScoreTitleLine = this.add.text(20,20,"Score");
        var highScoreEntryLine = this.add.text(20,40,"Score1: 000");

        this.topcontainer = containerOfGameObject(this, this.top, [titleText]);
        this.leftcontainer = containerOfGameObject(this, this.left, [menuTextLine1, menuTextLine2]);
        this.rightcontainer = containerOfGameObject(this, this.right, [highScoreTitleLine, highScoreEntryLine]);

        if(data.prepareFromScene2ToScene1) {
            this.moveFromScene2ToScene1();
        } else {
            this.moveFromScene1ToScene2();
        }
    }
    
    moveFromScene2ToScene1() {

        this.topcontainer.alpha = 0;
        this.leftcontainer.alpha = 0;
        this.rightcontainer.alpha = 0;
        this.right.alpha = 0;
        
        console.log('Scene1.moveFromScene2ToScene1');

        this.tweens.chain({
            tweens:[
                {
                    targets: this.left,
                    ease: 'Cubic',
                    width: 512,
                    duration: 500,
                },
                {
                    targets: this.right,
                    alpha:1,
                    ease: 'Cubic',
                    duration: 500
                },
                {
                    targets: [this.topcontainer, this.leftcontainer, this.rightcontainer],
                    alpha:1,
                    ease: 'Cubic',
                    duration: 500,
                }
            ]
        });
    }

    moveFromScene1ToScene2() {
        
        console.log('Scene1.moveFromScene1ToScene2');

        let self = this
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topcontainer, this.leftcontainer, this.rightcontainer],
                    alpha:0,
                    ease: 'Cubic',
                    duration: 500,
                },
                {
                    targets: this.right,
                    alpha:0,
                    ease: 'Cubic',
                    duration: 500
                },
                {
                    targets: this.left,
                    ease: 'Cubic',
                    width: 760,
                    duration: 500,
                    onComplete: function() { self.scene.switch('Scene2', {}); }
                }
            ]
        });
    }
}
