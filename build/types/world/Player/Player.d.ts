import { Character } from "src/ts/characters/Character";
export declare class MyCharacter {
    name: String;
    position: THREE.Vector3;
    rotation: THREE.Vector3;
    color: Object;
    object: THREE.Object3D[];
    mySid: String;
    scenario: string;
    character: Character;
    constructor(userData: any);
    getPosition(): THREE.Vector3;
    getRotation(): THREE.Vector3;
}
