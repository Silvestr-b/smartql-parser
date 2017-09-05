import { expect } from 'chai'
import { smartql, parsers, ast } from '../interfaces'
import { Parser } from '../'


describe('Predicate', () => {
	const parser = Parser();

	it('subpredicate is number', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					id: 5 
				}]
			}]
		});
		const predicate = query.getAllResources()[0].getPredicates()[0];

		expect(predicate.getFieldPredicate('id').getType()).to.be.equal('Value')

	})

	it('subpredicate is string', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					name: 'Joe' 
				}]
			}]
		});
		const predicate = query.getAllResources()[0].getPredicates()[0];

		expect(predicate.getFieldPredicate('name').getType()).to.be.equal('Value')

	})

	it('subpredicate is conjunction', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					age: {
						'>': 18,
						'<': 25
					} 
				}]
			}]
		});
		const subPredicate = <ast.IConjunction>query.getAllResources()[0].getPredicates()[0].getFieldPredicate('age');

		expect(subPredicate.getType()).to.be.equal('Conjunction')
		expect(subPredicate.getOperands()).to.be.have.lengthOf(2)
		expect(subPredicate.getOperands()[0].getType()).to.be.equal('Expression')
		expect(subPredicate.getOperands()[1].getType()).to.be.equal('Expression')

	})

	it('subpredicate is disjunction', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					age: [{'>': 18}, 16] 
				}]
			}]
		});
		const subPredicate = <ast.IDisjunction>query.getAllResources()[0].getPredicates()[0].getFieldPredicate('age');
		
		expect(subPredicate.getType()).to.be.equal('Disjunction')
		expect(subPredicate.getOperands()).to.be.have.lengthOf(2)
		expect(subPredicate.getOperands()[0].getType()).to.be.equal('Conjunction')
		expect(subPredicate.getOperands()[1].getType()).to.be.equal('Value')

	})

	it('subpredicate is subquery', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					age: {
						resource: 'User',
						field: 'age',
						where: [{
							id: 5
						}]
					}
				}]
			}]
		});
		const subQuery = <ast.ISubquery>(<ast.IValue>query.getAllResources()[0].getPredicates()[0].getFieldPredicate('age')).getValue();

		expect(subQuery.getType()).to.be.equal('Subquery')
		expect(subQuery.getField()).to.be.equal('age')
		expect(subQuery.getResource().getType()).to.be.equal('Resource')
		expect(subQuery.getResource().getName()).to.be.equal('User')
		expect(subQuery.getResource().getPredicates()).to.have.length(1)

	})

	it('subpredicate is uncorrect', () => {
		const parse = () => parser.parse(<smartql.Query>{
			method: 'GET',
			resources: [{
				resource: 'User',
				where: [{ 
					age: {'3':3}
				}]
			}]
		});
		
		expect(parse).to.throw(/Uncorrect subPredicate/);

	})
	
})

