import { expect } from 'chai'
import { parsers } from '../interfaces'
import { Parser } from '../'


describe('RootResource', () => {
	const parser = Parser();

	it('type', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User'
			}]
		}).getAllResources()[0]

		expect(resource.getType()).to.be.equal('Resource')
	})


	it('name', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User'
			}]
		}).getAllResources()[0]

		expect(resource.getName()).to.be.equal('User')
	})


	it('fields', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				fields: ['id', 'name']
			}]
		}).getAllResources()[0]

		expect(resource.hasField('id')).to.be.true
		expect(resource.hasField('name')).to.be.true
	})


	describe('where', () => {

		it('singlePredicate', () => {
			const resource = parser.parse({
				method: 'GET',
				resources: [{
					resource: 'User',
					where: {
						id: 1
					}
				}]
			}).getAllResources()[0]

			expect(resource.getPredicates()).to.have.length(1)
		})

		it('manyPredicates', () => {
			const resource = parser.parse({
				method: 'GET',
				resources: [{
					resource: 'User',
					where: [{
						id: 1
					},{
						name: 2
					}]
				}]
			}).getAllResources()[0]

			expect(resource.getPredicates()).to.have.length(2)
		})
		
	})


	it('with', () => {
		const resource = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User',
				with: {
					posts: { fields: ['title'] },
					comments: { fields: ['author'] }
				}
			}]
		}).getAllResources()[0]

		expect(resource.hasInclusion('posts')).to.be.true
		expect(resource.hasInclusion('comments')).to.be.true
	})

})