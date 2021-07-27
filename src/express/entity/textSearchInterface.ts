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
    ['source', new Map<string, string>([['Digital Identity', 'digitalIdentities.source']])],
    [
        'mail',
        new Map<string, string>([
            ['Digital Identity', 'digitalIdentities.mail'],
            ['Entity', 'mail'],
        ]),
    ],
    ['rank', new Map<string, string>([['Entity', 'rank']])],
    ['status', new Map<string, string>([['Entity', 'status']])],
    ['responsibility', new Map<string, string>([['Entity', 'responsibility']])],
    ['hierarchyPath', new Map<string, string>([['Entity', 'hierarchyPath']])],
    ['expanded', new Map<string, string>([['Entity', 'expanded']])],
    ['underGroupId', new Map<string, string>([['Entity', 'underGroupId']])],
    ['entityType', new Map<string, string>([['Entity', 'entityType']])],
]);

export interface EntityTextSearch {
    searchByFullName(fullName: string, filters?: FilterQueries<Partial<EntityFilters>>): Promise<IEntity[]>;
}
