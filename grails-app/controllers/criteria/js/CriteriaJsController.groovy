package criteria.js

import grails.converters.*

class CriteriaJsController{

	def grailsApplication

	private Closure createClosure(itens){
		return {
			itens.each{ _subItem ->
				if(_subItem.type == 'closure'){
					"${_subItem.name}"(createClosure(_subItem.itens))
				}else if(_subItem.type == 'method'){
					if(_subItem.args.size() == 1){
						"${_subItem.name}"(_subItem.args[0])
					}else if(_subItem.args.size() == 2){
						def _value = _subItem.args[1]
						"${_subItem.name}"(_subItem.args[0], _value instanceof Integer ? (long) _value: _value )
					}else if(_subItem.args.size() == 3){
						"${_subItem.name}"(_subItem.args[0], _subItem.args[1], _subItem.args[2])
					}else{
						throw new RuntimeException('not implemented with 4 or more args')
					}
				}
			}
		}
	}

	private Class getClazz(className){
		Class clazz = grailsApplication.domainClasses.find { it.clazz.simpleName == className }.clazz
		clazz
	}

	def list(){
		def json = request.JSON
		def clazz = getClazz(json.clazz)
		def ls = clazz.withCriteria(createClosure(json.criteria))
		render ls as JSON	
	}

	def index(){}
}
