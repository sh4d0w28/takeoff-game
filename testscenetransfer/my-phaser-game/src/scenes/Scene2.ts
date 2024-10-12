import { Scene } from 'phaser';
import { containerOfGameObject } from '../Utils';

export class Scene2 extends Scene
{
    private top:Phaser.GameObjects.Rectangle;
    private left:Phaser.GameObjects.Rectangle;
    private topcontainer: Phaser.GameObjects.Container;
    private leftcontainer: Phaser.GameObjects.Container;

    constructor ()
    {
        super('Scene2');
    }

    create ()
    {
        
        this.top = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.left = this.add.rectangle(20, 100, 760, 480, 0x111111, 0.9).setOrigin(0);
    
        var titleText = this.add.text(20, 20, "Lobby screen");
        this.topcontainer = containerOfGameObject(this, this.top, [titleText]);
        
        var oneroom = this.add.text(20,20, 'ROOM#1');
        this.leftcontainer = containerOfGameObject(this, this.left,[oneroom]);

        this.prepareFromScene1();
        this.moveFromScene1ToScene2();
        this.moveFromScene2ToScene1();
    }

    prepareFromScene1() {

        console.log('Scene2.prepareFromScene1');

        this.leftcontainer.setAlpha(0);
    }

    moveFromScene1ToScene2(){

        console.log('Scene2.moveFromScene1ToScene2');

        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topcontainer, this.leftcontainer],
                    alpha:1,
                    ease: 'Cubic',
                    duration: 500
                }
            ]
        });
    }

    moveFromScene2ToScene1() {

        console.log('Scene2.moveFromScene2ToScene1');

        let self = this;
        this.tweens.chain({
            tweens:[
                {
                    targets: [this.topcontainer, this.leftcontainer],
                    alpha:0,
                    ease: 'Cubic',
                    duration: 500,
                    onComplete: function() { self.scene.start ('Scene1', {prepareFromScene2ToScene1:true}); }
                }
            ]
        });
    }
}
