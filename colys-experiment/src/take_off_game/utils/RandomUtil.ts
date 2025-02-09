import { PlaneColorEnum } from "../common/Enums";
import { PlaneState } from "../schemas/PlaneState";
import { PlayerState } from "../schemas/PlayerState";
import { MapSchema } from "@colyseus/schema"

export default abstract class RandomUtil {

    public static getFreeName(players: MapSchema<PlayerState>) {
        var anonList = ['Shadow Guardian','Silent Sentinel','Enigmatic Wanderer','Veiled Champion','Phantom Avenger','Ghostly Protector'];
        var usedNames: string[] = [];
        players.forEach(v => usedNames.push(v.displayedName));
        anonList = anonList.filter(obj => !usedNames.includes(obj));
        return anonList[0];
    }

    public static getFreeColor(planes:  MapSchema<PlaneState>) {
        var colorList = PlaneColorEnum.list;
        var usedColors: number[] = [];
        planes.forEach(v => usedColors.push(v.color));
        colorList = colorList.filter(obj => !usedColors.includes(obj));
        return colorList[0];
    }

    public static getRandomElement(list: string[]) {
        var randomel = this.getRandomInt(0, list.length -1);
        return list[randomel];
    }

    public static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}