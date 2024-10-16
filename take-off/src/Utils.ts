import { GameObjects, Scene } from "phaser";

export function containerOfGameObject(s: Scene, o: GameObjects.Rectangle, kids: GameObjects.GameObject[]) {
    return s.add.container(o.x, o.y, kids);
} 

export function containerOfNineSlice(s: Scene, o: GameObjects.NineSlice, kids: GameObjects.GameObject[]) {
    var bg = s.add.rectangle(0,0,o.width,o.height,0x111111, 0.9).setOrigin(0);
    return s.add.container(o.x, o.y, [bg].concat(kids));
} 