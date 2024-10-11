import { Scene } from 'phaser';

export class Scene2 extends Scene
{
    constructor ()
    {
        super('Scene2');
    }

    create ()
    {
        this.add.rectangle(20, 20, 760, 60, 0x111111, 0.9).setOrigin(0);
        this.add.rectangle(20, 100, 760, 480, 0x111111, 0.9).setOrigin(0);
        this.add.text(100, 100, "SC2-2");
    }
}
