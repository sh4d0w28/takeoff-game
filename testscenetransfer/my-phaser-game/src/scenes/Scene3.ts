import { Scene } from 'phaser';

export class Scene3 extends Scene
{
    constructor ()
    {
        super('Scene3');
    }

    create ()
    {
        this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.add.rectangle(20, 100, 512, 480, 0x111111, 0.9).setOrigin(0);
        this.add.rectangle(552, 100, 228, 480, 0x111111, 0.9).setOrigin(0);
    }
}
