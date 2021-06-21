import { IEntity } from './interface';

export type EntityFilters = Partial<{
    status: string | string[];
    entityType: string | string[];
    'digitalIdentities.source': string | string[];
    rank: string | string[];
    responsibility: string | string[];
    hierarchyPath: string;
}>;

export interface EntityTextSearch {
    searchByFullName(fullName: string, filters?: Partial<EntityFilters>): Promise<IEntity[]>;
}
