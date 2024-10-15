import { GameObjects, Scene } from "phaser";

export function containerOfGameObject(s: Scene, o: GameObjects.Rectangle, kids: GameObjects.GameObject[]) {
    return s.add.container(o.x, o.y, kids);
} 

export function containerOfNineSlice(s:Scene, o: GameObjects.NineSlice, kids: GameObjects.GameObject[]) {
    return s.add.container(o.x, o.y, kids);
}