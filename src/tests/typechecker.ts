import { expect } from 'chai'
import { smartql } from '../interfaces'
import { TypeChecker } from '../implementations/typechecker'


describe('typeChecker', () => {
	const typeChecker = new TypeChecker()

	describe('isConjunction', () => {

		describe('correctOperators', () => {
			
			it('greater', () => isConjunction({'>': 1}))
			it('less', () => isConjunction({'<': 1}))
			it('greaterOrEqual', () => isConjunction({'>=': 1}))
			it('lessOrEqual', () => isConjunction({'<=': 1}))
			it('equal', () => isConjunction({'=': 1}))
			it('notEqual', () => isConjunction({'!=': 1}))

		})

		describe('correctValues', () => {
			
			it('number', () => isConjunction({'=': 1}))
			it('string', () => isConjunction({'=': 'someString'}))
			it('date', () => isConjunction({'=': new Date()}))
			it('subquery', () => isConjunction({'=': {resource: 'Post', field: 'id'}}))

		})

		describe('correctValuesList', () => {
			
			it('number', () => isConjunction({'=': [1, 1]}))
			it('string', () => isConjunction({'=': [1, 'someString']}))
			it('date', () => isConjunction({'=': [1, new Date()]}))
			it('subquery', () => isConjunction({'=': [1, {resource: 'Post', field: 'id'}]}))

		})

		describe('uncorrectOperator', () => {
			
			it('someString', () => isNotConjunction({'someString': 3}))
			it('number', () => isNotConjunction({3: 3}))

		})

		describe('uncorrectValue', () => {
			
			it('disjunction', () => isNotConjunction({'>':[1, {'>':1}]}))
			it('conjunction', () => isNotConjunction({'>':{'>':1}}))
			it('emptyObject', () => isNotConjunction({'>': {}}))
			it('emptyArray', () => isNotConjunction({'>': []}))
			it('null', () => isNotConjunction({'>': null}))
			it('undefined', () => isNotConjunction({'>': undefined}))
			it('function', () => isNotConjunction({'>': new Function()}))

		})

		describe('notConjunction', () => {
			
			it('number', () => isNotConjunction(1))
			it('string', () => isNotConjunction('someString'))
			it('date', () => isNotConjunction(new Date()))
			it('subquery', () => isNotConjunction({resource: 'Post', field: 'id'}))
			it('disjunction', () => isNotConjunction([1, {'>':1}]))
			it('valueList', () => isNotConjunction([1,2]))

			it('emptyObject', () => isNotConjunction({}))
			it('emptyArray', () => isNotConjunction([]))
			it('someObject', () => isNotConjunction({q:4}))
			it('someArray', () => isNotConjunction([2,'someString']))
			it('null', () => isNotConjunction(null))
			it('undefined', () => isNotConjunction(undefined))
			it('function', () => isNotConjunction(new Function()))

		})

	})

	describe('isConjunctionOperator', () => {

		describe('correctOperator', () => {

			it('greater', () => isConjunctionOperator('>'))
			it('less', () => isConjunctionOperator('<'))
			it('greaterOrEqual', () => isConjunctionOperator('>='))
			it('lessOrEqual', () => isConjunctionOperator('<='))
			it('equal', () => isConjunctionOperator('='))
			it('notEqual', () => isConjunctionOperator('!='))

		})

		describe('uncorrectOperator', () => {
			it('someString', () => isNotConjunctionOperator('someString'))
		})

	})

	describe('isConjunctionOperand', () => {
		
		describe('correctOperand', () => {
			
			it('number', () => isConjunctionOperand(1))
			it('string', () => isConjunctionOperand('someString'))
			it('date', () => isConjunctionOperand(new Date()))
			it('subquery', () => isConjunctionOperand({resource: 'Post', field: 'id'}))
			it('valueList', () => isConjunctionOperand([1,'someString']))

		})

		describe('uncorrectOperand', () => {
			
			it('function', () => isNotConjunctionOperand(new Function()))
			it('null', () => isNotConjunctionOperand(null))
			it('undefined', () => isNotConjunctionOperand(undefined))
			it('emptyObject', () => isNotConjunctionOperand({}))
			it('emptyArray', () => isNotConjunctionOperand([]))
			it('someObject', () => isNotConjunctionOperand({'q':5}))

		})

	})

	describe('isDisjunction', () => {

		describe('correctOperand', () => {
			
			it('singleOperand', () => isDisjunction([{'>': 1}]))
			it('manyOperands', () => isDisjunction([5,{'>': 1}]))

		})

		describe('uncorrectOperand', () => {
			
			it('number', () => isNotDisjunction([1, 1]))
			it('string', () => isNotDisjunction([1, 'someString']))
			it('date', () => isNotDisjunction([1, new Date()]))
			it('subquery', () => isNotDisjunction([1, {resource: 'Post', field: 'id'}]))
			it('function', () => isNotDisjunction([1, new Function()]))
			it('null', () => isNotDisjunction([1, null]))
			it('undefined', () => isNotDisjunction([1, undefined]))
			it('emptyObject', () => isNotDisjunction([1, {}]))
			it('emptyArray', () => isNotDisjunction([1, []]))
			it('someObject', () => isNotDisjunction([1, {'q':5}]))
			it('someArray', () => isNotDisjunction([1, [1,2]]))

		})

		describe('uncorrectDisjunction', () => {
			
			it('number', () => isNotDisjunction(1))
			it('string', () => isNotDisjunction('someString'))
			it('date', () => isNotDisjunction(new Date()))
			it('subquery', () => isNotDisjunction({resource: 'Post', field: 'id'}))
			it('function', () => isNotDisjunction(new Function()))
			it('null', () => isNotDisjunction(null))
			it('undefined', () => isNotDisjunction(undefined))
			it('emptyObject', () => isNotDisjunction({}))
			it('emptyArray', () => isNotDisjunction([]))
			it('someObject', () => isNotDisjunction({'q':5}))
			it('someArray', () => isNotDisjunction([1,2]))

		})

	})

	describe('isDisjunctionOperand', () => {

		describe('correctOperand', () => {
			
			it('number', () => isDisjunctionOperand(5))
			it('string', () => isDisjunctionOperand('someString'))
			it('date', () => isDisjunctionOperand(new Date()))
			it('conjunction', () => isDisjunctionOperand({'>': 1}))
			it('subquery', () => isDisjunctionOperand({resource: 'Post', field: 'id'}))	

		})

		describe('uncorrectOperand', () => {

			it('emptyObject', () => isNotDisjunctionOperand({}))
			it('emptyArray', () => isNotDisjunctionOperand([]))
			it('someObject', () => isNotDisjunctionOperand({'q':5}))
			it('someArray', () => isNotDisjunctionOperand([1,2]))
			it('disjunction', () => isNotDisjunctionOperand([1, {'>': 1}]))
			it('function', () => isNotDisjunctionOperand(new Function()))
			it('null', () => isNotDisjunctionOperand(null))
			it('undefined', () => isNotDisjunctionOperand(undefined))

		})

	})

	describe('isValueList', () => {

		describe('correctOperands', () => {

			it('number', () => isValueList([1, 1]))
			it('string', () => isValueList([1, 'someString']))
			it('date', () => isValueList([1, new Date()]))
			it('subquery', () => isValueList([1, {resource: 'Post', field: 'id'}]))		

		})

		describe('uncorrectOperands', () => {

			it('conjunction', () => isNotValueList([1, {'>': 1}]))
			it('function', () => isNotValueList([new Function()]))
			it('null', () => isNotValueList([null]))
			it('undefined', () => isNotValueList([undefined]))
			it('emptyObject', () => isNotValueList([{}]))
			it('emptyArray', () => isNotValueList([[]]))
			it('someObject', () => isNotValueList([{'q':5}]))		
			it('someArray', () => isNotValueList([[1,2]]))

		})

		describe('uncorrectValueList', () => {

			it('emptyObject', () => isNotValueList({}))
			it('emptyArray', () => isNotValueList([]))
			it('number', () => isNotValueList(5))
			it('string', () => isNotValueList('someString'))
			it('date', () => isNotValueList(new Date()))
			it('disjunction', () => isNotValueList([1, {'>': 1}]))
			it('conjunction', () => isNotValueList({'>': 1}))
			it('function', () => isNotValueList(new Function()))
			it('null', () => isNotValueList(null))
			it('undefined', () => isNotValueList(undefined))
			it('someObject', () => isNotValueList({'q':5}))		

		})

	})

	describe('isSubquery', () => {

		describe('correctSubquery', () => {

			it('withoutWhere', () => isSubquery({resource: 'Post', field: 'id'}))
			it('withWhere', () => isSubquery({resource: 'Post', field: 'id', where: {id: 5}}))

		})

		describe('uncorrectSubquery', () => {

			it('emptyObject', () => isNotSubquery({}))
			it('emptyArray', () => isNotSubquery([]))
			it('someObject', () => isNotSubquery({'q':5}))
			it('someArray', () => isNotSubquery([1,2]))
			it('number', () => isNotSubquery(5))
			it('string', () => isNotSubquery('someString'))
			it('date', () => isNotSubquery(new Date()))
			it('disjunction', () => isNotSubquery([1, {'>': 1}]))
			it('conjunction', () => isNotSubquery({'>': 1}))
			it('function', () => isNotSubquery(new Function()))
			it('null', () => isNotSubquery(null))
			it('undefined', () => isNotSubquery(undefined))

		})

	})


	// Conjunction

	function isConjunction(subPredicate: any){
		expect(typeChecker.isConjunction(subPredicate)).to.be.true
	}

	function isNotConjunction(subPredicate: any){
		expect(typeChecker.isConjunction(subPredicate)).to.be.false
	}


	// ConjunctionOperator

	function isConjunctionOperator(subPredicate: any){
		expect(typeChecker.isConjunctionOperator(subPredicate)).to.be.true
	}

	function isNotConjunctionOperator(subPredicate: any){
		expect(typeChecker.isConjunctionOperator(subPredicate)).to.be.false
	}


	// ConjunctionOperand

	function isConjunctionOperand(subPredicate: any){
		expect(typeChecker.isConjunctionOperand(<smartql.SubPredicate>subPredicate)).to.be.true
	}

	function isNotConjunctionOperand(subPredicate: any){
		expect(typeChecker.isConjunctionOperand(<smartql.SubPredicate>subPredicate)).to.be.false
	}


	// Disjunction

	function isDisjunction(subPredicate: any){
		expect(typeChecker.isDisjunction(<smartql.SubPredicate>subPredicate)).to.be.true
	}

	function isNotDisjunction(subPredicate: any){
		expect(typeChecker.isDisjunction(<smartql.SubPredicate>subPredicate)).to.be.false
	}


	// DisjunctionOperand

	function isDisjunctionOperand(subPredicate: any){
		expect(typeChecker.isDisjunctionOperand(<smartql.SubPredicate>subPredicate)).to.be.true
	}

	function isNotDisjunctionOperand(subPredicate: any){
		expect(typeChecker.isDisjunctionOperand(<smartql.SubPredicate>subPredicate)).to.be.false
	}


	// ValueList

	function isValueList(subPredicate: any){
		expect(typeChecker.isValueList(<smartql.SubPredicate>subPredicate)).to.be.true
	}

	function isNotValueList(subPredicate: any){
		expect(typeChecker.isValueList(<smartql.SubPredicate>subPredicate)).to.be.false
	}


	// Subquery

	function isSubquery(subPredicate: any){
		expect(typeChecker.isSubquery(<smartql.SubPredicate>subPredicate)).to.be.true
	}

	function isNotSubquery(subPredicate: any){
		expect(typeChecker.isSubquery(<smartql.SubPredicate>subPredicate)).to.be.false
	}

})





