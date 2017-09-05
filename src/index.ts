import { parsers, ast } from './interfaces'
import { Parser } from './implementations/parser'
import { TypeChecker } from './implementations/typechecker'
import ASTBuilder from 'smartql-ast'


function ParserFactory(){
	const astBuilder = ASTBuilder();
	const typeChecker = new TypeChecker();

	return new Parser(typeChecker, astBuilder)
}


export { ParserFactory as Parser }

