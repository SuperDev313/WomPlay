import { World } from '../world/World';
import { LoadingManager } from '../core/LoadingManager';
import { MyCharacter } from './Player/Player';
export declare class Scenario {
    id: string;
    name: string;
    spawnAlways: boolean;
    default: boolean;
    world: World;
    descriptionTitle: string;
    descriptionContent: string;
    private rootNode;
    private spawnPoints;
    private invisible;
    private initialCameraAngle;
    constructor(root: THREE.Object3D, world: World);
    createLaunchLink(): void;
    launch(loadingManager: LoadingManager, world: World, players: MyCharacter[]): void;
}
