import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import * as Utils from '../core/FunctionLibrary';
import { MyCharacter } from './Player/Player';
import { updateCharacters } from '../socket/socket';
import { enableCharacterUpdate } from './World';

export class CharacterSpawnPoint implements ISpawnPoint
{
	private object: THREE.Object3D;
	public driver: string = "character";

	constructor(object: THREE.Object3D)
	{
		this.object = object;
	}
	
	public spawn(loadingManager: LoadingManager, world: World, players: MyCharacter[], userData: any, playerIndex: number): void
	{	
		let boxmanLink = (world.boxmanKey.length !== 0)?"https://www.dropbox.com/scl/fi/" + world.boxmanKey[0] + "/boxman.glb?rlkey=" + world.boxmanKey[1] + "&dl=1":"build/assets/boxman.glb";
		loadingManager.loadGLTF(boxmanLink, (model) =>
		{	
			this.object.position.x = userData.position.x;
			this.object.position.z = userData.position.y;
			this.object.rotation.y = userData.rotation;

			let player = new Character(model);
			if (userData.mySid) player.sid = userData.mySid;

			let worldPos = new THREE.Vector3();
			this.object.getWorldPosition(worldPos);
			player.setPosition(worldPos.x, worldPos.y, worldPos.z);
			
			let forward = Utils.getForward(this.object);
			player.setOrientation(forward, true);

			world.add(player);
			if (userData.mySid === players[0].mySid) player.takeControl();
			if (playerIndex >= 0) players[playerIndex].character = player;
			if (enableCharacterUpdate) updateCharacters(world);  // ignore character update for now.
		});

		this.createNameBubble(userData);
	}

	public createNameBubble(userData: any) {
		// console.log(userData.name);
		// console.log(userData.color);
		// name colored bubble
	}
}