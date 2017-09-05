import { expect } from 'chai'
import { Parser } from '../'


describe('Query', () => {
	const parser = Parser();

	it('type', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User'
			}]
		});

		expect(query.getType()).to.be.equal('Query')
	})


	it('method', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User'
			}]
		});

		expect(query.getMethod()).to.be.equal('GET')
	})


	it('resources', () => {
		const query = parser.parse({
			method: 'GET',
			resources: [{
				resource: 'User'
			},{
				resource: 'Post'
			}]
		});

		expect(query.getAllResources()).to.have.lengthOf(2)
		expect(query.hasResource('User')).to.be.true
		expect(query.hasResource('Post')).to.be.true
	})

})