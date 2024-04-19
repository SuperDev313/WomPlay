import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import { World } from '../sketchbook';
import { MyCharacter } from '../world/Player/Player';
import { io } from 'socket.io-client';
import { enableCharacterUpdate, enableVehicleUpdate } from '../world/World';
import * as CANNON from 'cannon';

export const socket = io('http://localhost:8000', {transports: ['websocket', 'polling'] });
export let mySid;
export const timeStamp = 100;

let keyEvent;
let detectObj;

export const InitSocket = () => {
    socket.on('connect', () => { 
        console.log('connected, will start working')
    })

    socket.on('disconnect', () => {

    })
}

export const ReceiveMySid = (OneCharacter: MyCharacter) => {
    socket.on('yourSid', (sid) => {
        OneCharacter.mySid = sid;
        mySid = sid;
    })
}

export const ReportJoin = (OneCharacter: MyCharacter) => {
    let reportData = {
        name: OneCharacter.name, 
        mySid: OneCharacter.mySid, 
        position: OneCharacter.position, 
        rotation: OneCharacter.rotation, 
        color: OneCharacter.color,
        scenario: OneCharacter.scenario
    };
    socket.emit('join', reportData);
}

export const createModels = (world: World, scenarioId: string, loadingManager: LoadingManager, sp: ISpawnPoint, players: MyCharacter[]) => {   
    socket.on('createModels', (userData) => {
        if (userData.mySid !== mySid) {
            let player = new MyCharacter(userData);
            player.mySid = userData.mySid;
            player.scenario = scenarioId;
            players.push(player);
        }
        
        let playerIndex = players.length - 1;
        if (sp.driver === 'character') {
            sp.spawn(loadingManager, world, players, userData, playerIndex);
        }
    })

    socket.on('askPosition', (sid) => {
        let info = {
            position: players[0].position, 
            rotation: players[0].rotation, 
            sid: sid, 
            mySid: mySid, 
            name: players[0].name, 
            color: players[0].color
        };
        if (sid !== mySid) socket.emit('answerPosition', info);
    })

    socket.on('answerPosition', (info) => {
        let player = new MyCharacter(info);
        player.scenario = scenarioId;
        player.mySid = info.mySid;
        players.push(player);
        let playerIndex = players.length - 1;
        sp.spawn(loadingManager, world, players, info, playerIndex);
    })
}

export const pressKeyboard = (event: KeyboardEvent, code: string, world: World, pressed: boolean) => {
    let viewVector = world.players[0].character.viewVector;
    let data = JSON.stringify({keyCode: code, sid: mySid, roomId: world.players[0].scenario, pressed: pressed, viewVector: viewVector});
    keyEvent = event;
    socket.emit('pressKeyboard', data);
}

export const moveCharacters = (world: World) => {
    socket.on('moveCharacters', (info) => {
        let parsedData = JSON.parse(info);
        if (parsedData.sid !== mySid) { 
            world.players.forEach(player => {
                if (player.mySid === parsedData.sid) {
                    player.character.setViewVector(parsedData.viewVector);

                    if (parsedData.keyCode === 'KeyF') {
                        world.changeEnableCharacter(false);
                        world.changeEnableVehicle(true);
                        world.params[`Sync_Vehicle_Enable`] = true;
                    }
                    player.character.handleKeyboardEvent(keyEvent, parsedData.keyCode, parsedData.pressed);
                }
            })
        }
    })
}

export const updateCharacters = (world: World) => {
    detectObj = 'character';

    socket.on('updateCharacter', (data) => {
        let info = JSON.parse(data);
        if (info.sid !== mySid) {
            world.players.forEach(player => {
                if (player.character && player.character.sid === info.sid) {
                    player.character.detectPosition = info.position;
                } 
            })
        }
    })

    if (world.players[0].character) {
        setInterval(() => {
            if (detectObj === 'character') {
                let info = {
                    sid: mySid,
                    position: world.players[0].character.position
                }
                let data = JSON.stringify(info);
                socket.emit('updateCharacter', data);
            }
        }, timeStamp)
    }
}

export const updateVehicles = (world: World, sid: string) => {
    if (sid === mySid) detectObj = 'vehicle';

    socket.on('updateVehicle', (data) => {
        let info = JSON.parse(data);
        if (info.sid !== mySid) {
            world.players.forEach(player => {
                if (player.character && player.character.sid === info.sid) {
                    player.character.controlledObject.detectPosition = info.position;
                    player.character.controlledObject.detectQuaternion = new CANNON.Quaternion(info.quaternion._x, info.quaternion._y, info.quaternion._z, info.quaternion._w);
                } 
            })
        }
    })

    if (world.players[0].character.controlledObject) {
        setInterval(() => {
            if (detectObj === 'vehicle') {
                let info = {
                    sid: mySid,
                    position: world.players[0].character.controlledObject.position,
                    quaternion: world.players[0].character.controlledObject.quaternion,
                }
                let data = JSON.stringify(info);

                socket.sendBuffer = [];
                socket.emit('updateVehicle', data);
            }
        }, timeStamp)
    }
}