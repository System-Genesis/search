import { EntityDTO } from '../entity/dto';
import { RoleDTO } from '../role/dto';

export interface GroupDTO {
    id: string;
    name: string;
    source: string;
    ancestors: string[];
    hierarchy: string;
    akaUnit: string;
    status: string;
    isLeaf: boolean;
    createdAt: Date;
    updatedAt: Date;
    diPrefix: string;
    directEntities: [EntityDTO];
    directRoles: [RoleDTO];
}
