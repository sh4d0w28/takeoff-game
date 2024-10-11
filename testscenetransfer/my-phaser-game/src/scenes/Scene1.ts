import { Scene, Tweens } from 'phaser';

export class Scene1 extends Scene
{
    private top:Phaser.GameObjects.Rectangle;
    private left:Phaser.GameObjects.Rectangle;
    private right: Phaser.GameObjects.Rectangle;


    constructor ()
    {
        super('Scene1');
    }

    create ()
    {   
        this.top = this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.left = this.add.rectangle(20, 100, 512, 480, 0x111111, 0.9).setOrigin(0);
        this.right = this.add.rectangle(552, 100, 228, 480, 0x111111, 0.9).setOrigin(0);

        this._setLayoutFromScene2ToScene1();

    }

    _setLayoutFromScene2ToScene1() {
        let self = this
        this.tweens.chain({
            tweens:[{
            targets: this.right,
            alpha:0,
            duration: 1000
            },{
                targets: this.left,
                ease: 'Cubic',
                width: 760,
                duration: 1000,
                onComplete: function() {
                    self.scene.switch('Scene2', {});
                }
            }]
        });
    }
}
