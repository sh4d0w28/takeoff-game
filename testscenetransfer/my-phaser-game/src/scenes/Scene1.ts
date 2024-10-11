import { Scene, Tweens } from 'phaser';

export class Scene1 extends Scene
{
    private top:Phaser.GameObjects.Rectangle;
    private left:Phaser.GameObjects.Rectangle;
    private right: Phaser.GameObjects.Rectangle;
    private leftcontainer: Phaser.GameObjects.Container;


    constructor ()
    {
        super('Scene1');
    }

    create ()
    {
        console.log('create');   
        this.top = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.left = this.add.rectangle(20, 100, 512, 480, 0x111111, 0.9).setOrigin(0);
        this.right = this.add.rectangle(552, 100, 228, 480, 0x111111, 0.9).setOrigin(0);

        var text = this.add.text(20,20,"SC1");
        var text2 = this.add.text(20,40,"SC1-1");

        this.leftcontainer = this.add.container(20,100, [
            text, text2
        ]);

        this.moveFromScene1ToScene2();

    }

    moveFromScene1ToScene2() {
        let self = this
        this.tweens.chain({
            tweens:[
                {
                    targets: this.leftcontainer,
                    alpha:0,
                    ease: 'Cubic',
                    duration: 500
                },
                {
                    targets: this.right,
                    alpha:0,
                    ease: 'Cubic',
                    duration: 300
                },
                {
                    targets: this.left,
                    ease: 'Cubic',
                    width: 760,
                    duration: 1000,
                    onComplete: function() { self.scene.switch('Scene2', {}); }
                }
            ]
        });
    }
}
