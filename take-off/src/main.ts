import { Title } from './scenes/Title.ts'; 
import { Lobby } from './scenes/Lobby.ts';
import {PlayField} from './scenes/PlayField.ts';
import { AUTO, Scale,Types } from 'phaser';
import { Client } from './colys/colyseus'
import GlobalConfig from './GlobalConfig.ts';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#222222',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Title, Lobby, PlayField
    ]
};

/** create client instance to pass across all scenes */
const client = new Client('wss://colyseus.edushm.com');

const globalConfig: GlobalConfig = {
    colyseus: client
}

const game = new Phaser.Game(config);
game.scene.start('Title', globalConfig);