import { parsers, ast, smartql } from '../interfaces'


class Parser implements parsers.IParser {

	constructor(
		private typeChecker: parsers.ITypeChecker,
		private astFactory: ast.IASTFactory
	){}
	
	// Query 

	parse(restqlQuery: smartql.Query){
		const method = restqlQuery.method;
		const query = this.astFactory.createQuery();
		const resources = restqlQuery.resources.map(resource => this.parseResource(resource));

		return query.setResources(resources).setMethod(method)
	}


	// Resource

	private parseResource(restqlResource: smartql.Resource){
		const resource = this.astFactory.createResource();

		const name = this.parseName(restqlResource)
		const fields = this.parseFields(restqlResource)
		const predicates = this.parsePredicates(restqlResource)
		const inclusions = this.parseInclusions(restqlResource)

		return resource.setName(name).setFields(fields).setPredicates(predicates).setInclusions(inclusions)	
	}	


	// Name

	private parseName(resource: smartql.Resource){
		if(!resource.resource) return ''

		return resource.resource
	}


	// Fields

	private parseFields(resource: smartql.Resource){
		if(!resource.fields) return []

		return resource.fields.map(fieldName => {
			return this.astFactory.createField(fieldName)
		})
	}


	// Predicates

	private parsePredicates(resource: smartql.Resource){
		if(!resource.where) return []

		return Array.isArray(resource.where)
			? resource.where.map(predicate => this.predicateParse(predicate))
			: [this.predicateParse(resource.where)]
	}


	// Inclusions

	private parseInclusions(resource: smartql.Resource){
		const inclusionsList: ast.InclusionsList = {};

		if(resource.with){
			for(let inclusionName in resource.with){
				inclusionsList[inclusionName] = this.parseResource(resource.with[inclusionName]);
			}
		}

		return inclusionsList  	
	}


	// Predicate

	private predicateParse(rstqlPredicate: smartql.Predicate){
		const astPredicate = this.astFactory.createPredicate();

		for(let fieldName in rstqlPredicate){
			const astSubPredicate = this.parseSubPredicate(fieldName, rstqlPredicate[fieldName]);

			astPredicate.addFieldPredicate(fieldName, astSubPredicate) 
		} 

		return astPredicate 
	}


	// SubPredicate

	private parseSubPredicate(fieldName: string, subPredicate: smartql.SubPredicate){

		if(this.typeChecker.isValue(subPredicate))
			return this.parseValue(<smartql.Value>subPredicate)

		if(this.typeChecker.isDisjunction(subPredicate))
			return this.parseDisjunction(<smartql.Disjunction>subPredicate)

		if(this.typeChecker.isConjunction(subPredicate))
			return this.parseConjunction(<smartql.Conjunction>subPredicate)

			
		throw new Error(`Uncorrect subPredicate: ${JSON.stringify(subPredicate, null, 4)}`)

	}


	// Value

	private parseValue(value: smartql.Value){
		if(!this.typeChecker.isSubquery(value)) return this.astFactory.createValue(<ast.ValuesType>value)

		const subQuery = this.parseSubquery(<smartql.SubQuery>value)

		return this.astFactory.createValue(subQuery)
	}


	// Subquery

	private parseSubquery(subquery: smartql.SubQuery){
		const fieldName = subquery.field;
		const resourceName = subquery.resource;
		const field = this.astFactory.createField(fieldName);
		const predicates = this.parsePredicates(subquery);
		const resource = this.astFactory.createResource().setName(resourceName).addField(field).setPredicates(predicates)
	
		return this.astFactory.createSubquery(fieldName, resource)
	}


	// Disjunction

	private parseDisjunction(restqlDisjunction: smartql.Disjunction){
		const astDisjunction = this.astFactory.createDisjunction()

		restqlDisjunction.forEach(operand => {
			if(this.typeChecker.isValue(operand)){
				astDisjunction.addOperand(this.parseValue(<smartql.Value>operand))
			} else {
				astDisjunction.addOperand(this.parseConjunction(<smartql.Conjunction>operand))
			}

		})

		return astDisjunction
	}


	// Conjanction

	private parseConjunction(conjunction: smartql.Conjunction){
		const astConjunction = this.astFactory.createConjunction()

		for(let key in conjunction){
			const operator = this.astFactory.createOperator(<ast.OperatorType>key);
			const operand = this.parseValue(<smartql.Value>conjunction[key]);
			const expression = this.astFactory.createExpression(operator, operand);

			astConjunction.addOperand(expression)
		}

		return astConjunction
	}

}


export { Parser } 

