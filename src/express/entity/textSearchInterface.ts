import { IEntity } from './interface';

export type EntityFilters = Partial<{
    status: string | string[];
    entityType: string | string[];
    'digitalIdentities.source': string | string[];
    'digitalIdentities.mail': string | string[];
    mail: string | string[];
    rank: string | string[];
    responsibility: string | string[];
    hierarchyPath: string | string[];
}>;

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
]);

export interface EntityTextSearch {
    searchByFullName(fullName: string, filters?: Partial<EntityFilters>): Promise<IEntity[]>;
}
