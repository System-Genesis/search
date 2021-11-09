import { IEntity } from '../entity/interface';
import { IRole } from '../role/interface';

export interface IOrganizationGroup {
    id?: string;
    name: string;
    ancestors: string[];
    hierarchy: string;
    akaUnit: string;
    status: string;
    isLeaf: boolean;
    createdAt: Date;
    updatedAt: Date;
    directEntities: IEntity[];
    directRoles: IRole[];
    diPrefix: string;
}
