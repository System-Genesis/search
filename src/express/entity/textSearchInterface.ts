import { FilterQueries } from '../../types';
import { IEntity } from './interface';

export type EntityFilters = {
    status: string[];
    entityType: string[];
    'digitalIdentities.source': string[];
    'digitalIdentities.mail': string[];
    mail: string[];
    rank: string[];
    responsibility: string[];
    hierarchyPath: string[];
    expanded: boolean[];
    underGroupId: string[];
};

export const entityMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['source', new Map<string, string>([['digitalIdentity', 'digitalIdentities.source']])],
    [
        'mail',
        new Map<string, string>([
            ['digitalIdentity', 'digitalIdentities.mail'],
            ['entity', 'mail'],
        ]),
    ],
    ['rank', new Map<string, string>([['entity', 'rank']])],
    ['status', new Map<string, string>([['entity', 'status']])],
    ['responsibility', new Map<string, string>([['entity', 'responsibility']])],
    ['hierarchy', new Map<string, string>([['entity', 'hierarchy']])],
    ['expanded', new Map<string, string>([['entity', 'expanded']])],
    ['underGroupId', new Map<string, string>([['entity', 'underGroupId']])],
    ['entityType', new Map<string, string>([['entity', 'entityType']])],
]);

export interface EntityTextSearch {
    searchByFullName(fullName: string, filters?: FilterQueries<Partial<EntityFilters>>): Promise<IEntity[]>;
}
