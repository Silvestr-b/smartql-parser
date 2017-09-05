import { expect } from 'chai'
import { parsers } from '../interfaces'
import { Parser } from '../'


describe('IncludedResource', () => {
	const parser = Parser();

	it('type', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				with: {
					posts: {
						fields: ['id', 'title']
					}
				}
			}]
		}).getAllResources()[0].getInclusion('posts')

		expect(resource.getType()).to.be.equal('Resource')
	})


	it('name', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				with: {
					posts: {
						fields: ['id', 'title']
					}
				}
			}]
		}).getAllResources()[0].getInclusion('posts')

		expect(resource.getName()).to.be.equal('')
	})


	it('fields', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				with: {
					posts: {
						fields: ['id', 'title']
					}
				}
			}]
		}).getAllResources()[0].getInclusion('posts')

		expect(resource.hasField('id')).to.be.true
		expect(resource.hasField('title')).to.be.true
	})


	describe('where', () => {

		it('singlePredicate', () => {
			const resource = parser.parse({
				method: 'GET',
				resources: [{
					resource: 'User',
					with: {
						posts: {
							where: {
								id: 1
							}
						}
					}
				}]
			}).getAllResources()[0].getInclusion('posts')
			
			expect(resource.getPredicates()).to.have.length(1)
		})

		it('manyPredicates', () => {
			const resource = parser.parse({
				method: 'GET',
				resources: [{
					resource: 'User',
					with: {
						posts: {
							where: [{
								id: 1
							},{
								name: 2
							}]
						}
					}
				}]
			}).getAllResources()[0].getInclusion('posts')
			
			expect(resource.getPredicates()).to.have.length(2)
		})

		
	})


	it('with', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				with: {
					posts: {
						with: {
							author: { fields: ['id'] },
							comments: { fields: ['text'] }
						}
					}
				}
			}]
		}).getAllResources()[0].getInclusion('posts')

		expect(resource.hasInclusion('author')).to.be.true
		expect(resource.hasInclusion('comments')).to.be.true
	})

})