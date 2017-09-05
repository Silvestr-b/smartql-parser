import { ast, smartql } from './'


// Fasade

export interface IParser {
	parse: (restqlQuery: smartql.Query) => ast.IQuery
}


// Checkers:

export interface ITypeChecker {
	isConjunction: (subPredicate: smartql.SubPredicate) => boolean
	isConjunctionOperator: (operator: string) => boolean
	isConjunctionOperand: (operand: smartql.SubPredicate) => boolean 
	isDisjunction: (subPredicate: smartql.SubPredicate) => boolean
	isDisjunctionOperand: (subPredicate: smartql.SubPredicate) => boolean
	isValue: (subPredicate: smartql.SubPredicate) => boolean
	isValueList: (subPredicate: smartql.SubPredicate) => boolean
	isSubquery: (subPredicate: smartql.SubPredicate) => boolean
}

