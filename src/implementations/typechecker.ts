import { parsers, ast, smartql } from '../interfaces'


class TypeChecker implements parsers.ITypeChecker {

	isConjunction(subPredicate: smartql.SubPredicate){
		if(Array.isArray(subPredicate) || typeof subPredicate !== 'object' || subPredicate === null) return false
		if(Object.keys(subPredicate).length <= 0) return false

		for(let operator in <smartql.Conjunction>subPredicate){		
			if(!this.isConjunctionOperator(operator) || !this.isConjunctionOperand(subPredicate[operator])) return false
		}

		return true		
	}

	isConjunctionOperator(operator: string){
		return operator === '>' || operator === '<' || operator === '>=' || operator === '<=' || operator === '=' || operator === '!='
	}

	isConjunctionOperand(operand: smartql.SubPredicate){
		return this.isValue(operand) || this.isValueList(operand)
	}

	isDisjunction(subPredicate: smartql.SubPredicate){
		if(!Array.isArray(subPredicate) || subPredicate.length <= 0 || this.isValueList(subPredicate)) return false

		for(let i = 0; i < subPredicate.length; i++){
			if(!this.isDisjunctionOperand(subPredicate[i])) return false
		}
		
		return true
	}

	isDisjunctionOperand(subPredicate: smartql.SubPredicate){
		return this.isConjunction(subPredicate) || this.isValue(subPredicate)
	}

	isValue(subPredicate: smartql.SubPredicate){
		if(Array.isArray(subPredicate) || !subPredicate) return false

		if(typeof subPredicate === 'string') return true
		if(typeof subPredicate === 'number') return true
		if(!!(<Date>subPredicate).toDateString) return true
		if(this.isSubquery(subPredicate)) return true

		return false	
	}
	
	isValueList(subPredicate: smartql.SubPredicate){
		if(!Array.isArray(subPredicate) || subPredicate.length <= 0) return false

		for(let i = 0; i < subPredicate.length; i++){
			if(!this.isValue(subPredicate[i])) return false
		}	

		return true 
	}
	
	isSubquery(subPredicate: smartql.SubPredicate){
		if(Array.isArray(subPredicate) || typeof subPredicate !== 'object' || subPredicate === null) return false
		if(!(<smartql.SubQuery>subPredicate).resource || !(<smartql.SubQuery>subPredicate).field) return false
			
		return true
	}
}


export { TypeChecker } 