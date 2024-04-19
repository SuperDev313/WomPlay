import { Character } from "src/ts/characters/Character";

export class MyCharacter
{
    public name: String;
    public position: THREE.Vector3;
    public rotation: THREE.Vector3;
    public color: Object
    public object: THREE.Object3D[];
    public mySid: String;
    public scenario: string;
    public character: Character;

    constructor (userData: any) {
        this.name = userData.name;
        this.position = userData.position;
        this.rotation = userData.rotation;
        this.color = userData.color;
    }

    public getPosition (): THREE.Vector3
    {
        return this.position;
    }

    public getRotation (): THREE.Vector3
    {
        return this.rotation;
    }
}