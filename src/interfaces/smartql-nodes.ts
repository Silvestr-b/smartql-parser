
export interface Query {
	method: string
	resources: [RootResource]
}

export interface RootResource extends Resource {
	resource: string;
}

export interface Resource {
	resource?: string;
	fields?: FieldsList;
	where?: Predicate | [Predicate];
	with?: InclusionsList;
}

export interface SubQuery {
	resource: string;
	field: string;
	where?: Predicate | [Predicate];
}

export interface Predicate {
	[fieldName: string]: SubPredicate;
}

export interface Conjunction {
	'>'?: Value | Value[];
	'<'?: Value | Value[];
	'>='?: Value | Value[];
	'<='?: Value | Value[];
	'='?: Value | Value[];
	'!='?: Value | Value[];
}

export type Disjunction = (Conjunction | Value)[];

export type Value = string | number | Date | SubQuery;

export type SubPredicate = Conjunction | Disjunction | Value | SubQuery;

export type OperatorType = '>' | '<' | '>=' | '<=' | '=' | '!=';

export type InclusionsList = { 
	[relationName: string]: Resource; 
}

export type FieldsList = [string]




const query: Query = {
	method: 'GET',
	resources: [{
		resource: 'User',
		fields: ['id', 'name'],
		where: [{
			name: {
				field: 'name',
				resource: 'User',
				where: [{
					age: {
						'<': 5,
						'>': 5
					}
				}]
			},
			age: {
				'<': 6,
				'>': 5
			}
		}],
		with: {
			posts: {
				fields: ['id', 'title', 'text'],
				where: [{
					w: [{'>':5, '<':3}]
				}]
			}
		}
	}]
}	



	