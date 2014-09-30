package criteria.js

import grails.converters.JSON

class CriteriaJsController {

	def grailsApplication

	private convertValue(obj) {
		if (obj['class'] instanceof String) {
			if (obj['id']) {
				return Class.forName(obj['class'], true, this.class.classLoader).get(obj['id'])
			} else {
				return Class.forName(obj['class']).newInstance(obj.value)
			}
		}
		if (obj instanceof String) {
			if (obj ==~ /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) {
				return Date.parse('yyyy-MM-dd', obj)
			}
		}
		return obj
	}

	private Closure createClosure(_itens) {
		return {
			_itens.each { _subItem ->
				if (_subItem.type == 'closure') {
					"${_subItem.name}"(createClosure(_subItem.itens))
				} else if(_subItem.type == 'method') {
					if (_subItem.args.size() == 1) {
						"${_subItem.name}"(_subItem.args[0])
					} else if (_subItem.args.size() == 2) {
						"${_subItem.name}"(_subItem.args[0], convertValue(_subItem.args[1]))
					} else if (_subItem.args.size() == 3) {
						"${_subItem.name}"(_subItem.args[0], convertValue(_subItem.args[1]), convertValue(_subItem.args[2]))
					} else {
						throw new RuntimeException('not implemented with 4 or more args')
					}
				}
			}
		}
	}

	private Class getClazz(className) {
		Class clazz = grailsApplication.domainClasses.find { it.clazz.simpleName == className }.clazz
		clazz
	}

	private __getProp(obj, propertyName) {
		def res = obj
		propertyName.split('\\.').each {
			if (res == null) return
			if (it == 'class') {
				res = res.class.name
			} else {
				res = res."$it"
			}
		}
		return res
	}

	private _getProp(obj, Integer index) {
		obj[index]
	}
	
	private _getProp(obj, String property) {
		__getProp(obj, property)
	}

	private _getProp(Collection obj, Object property) {
		__getProp(obj[property.index], property['property'])
	}
	

	def list() {
		def json = request.JSON
		def clazz = getClazz(json.clazz)
		def ls = clazz.withCriteria(createClosure(json.criteria))
		if (json.leanJson) {
			def handled = []
			ls.each { dbObj ->
				def jsonObj = [:]
				json.leanJson.each { k, v ->
					jsonObj[k] = _getProp(dbObj, v)
				}
				handled << jsonObj
			}
			render handled as JSON
		} else {
			render ls as JSON
		}
	}

	def get() {
		def json = request.JSON
		def clazz = getClazz(json.clazz)
		def object = clazz.get(json.id.value)
		render object as JSON
	}

	def index() { }
}
