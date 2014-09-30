
(function() {

	Criteria.data = {};
	Criteria.print = false;
	
	var _criteriaValue, _instanceValue;
	var theImplementations = {
		le: function() { return _instanceValue <= _criteriaValue },
		eq: function() { return _instanceValue == _criteriaValue },
		lt: function() { return _instanceValue  < _criteriaValue },
		gt: function() { return _instanceValue  > _criteriaValue },
		ge: function() { return _instanceValue >= _criteriaValue },
		in: function() { return _criteriaValue.indexOf(_instanceValue) !==-1 },
		ne: function() { return _instanceValue != _criteriaValue },
		ilike: function() { return ('' + _instanceValue).toLowerCase().match(_criteriaValue.replace(/%/g,'.*').toLowerCase()) !== null },
		like: function() { return ('' + _instanceValue).match(_criteriaValue.replace(/%/g,'.*')) !== null },
		isNull: function() { return typeof _instanceValue === 'undefined' || _instanceValue === null },
		isNotNull: function() { return _instanceValue !== null },
		eqProperty: function() { return _instanceValue == _criteriaValue },
		geProperty: function() { return _instanceValue >= _criteriaValue },
		leProperty: function() { return _instanceValue <= _criteriaValue},
		neProperty: function() { return _instanceValue != _criteriaValue },
		gtProperty: function() { return _instanceValue > _criteriaValue },
		ltProperty: function() { return _instanceValue < _criteriaValue }
	};

	function extractVal(obj) {
		if (obj && (obj['class'] == 'java.lang.Long' || obj['class'] == 'java.math.BigDecimal' || obj['class'] == 'org.joda.time.LocalDate')) {
			return obj.value;
		}
		return obj;
	}

	function _runCriteria(cri, obj) {
		if (cri.name.match('.*Property$')) {
			_criteriaValue = obj[cri.args[1]];
		} else {
			_criteriaValue = extractVal(cri.args[1]);
		}
		_instanceValue = _getProp(obj, cri.args[0]);
		//_critOptions = cri.opt;
		var method = theImplementations[cri.name];
		if (!method) {
			console.log("Sem metodo", cri.name);
		}
		var result = method();
		if (Criteria.print) console.log('    ', cri.name, cri.args[0], _instanceValue, ', ', _criteriaValue, result);
		//_SaintPeter.tell("    ${cri.criteriaName}('${_instanceValue}', '${_criteriaValue}') == ${result}")
		return result;
	}

	function isAndOrNot(name) {
		return name == 'and' || name == 'or' || name == 'not';
	}
	function knokinOnHeavensDoor(criList, obj) {
		var gotoParadise;
		if (criList.jsFunc == 'and') {
			for (var i = 0; i < criList.itens.length; i++) {
				if (criList.itens[i].jsFunc == 'projections' || criList.itens[i].name == 'fetchMode' || criList.itens[i].name == 'order') continue;
				if (isAndOrNot(criList.itens[i].jsFunc)) {
					if (!knokinOnHeavensDoor(criList.itens[i], obj)) {
						return false;
					}
				} else {
					if (!_runCriteria(criList.itens[i], obj)) {
						return false;
					}
				}
			}
			return true;
		} else if (criList.jsFunc == 'or') {
			for (var i = 0; i < criList.itens.length; i++) {
				if (criList.itens[i].jsFunc == 'projections' || criList.itens[i].name == 'fetchMode' || criList.itens[i].name == 'order') continue;
				if (isAndOrNot(criList.itens[i].jsFunc)) {
					if (knokinOnHeavensDoor(criList.itens[i], obj)) {
						return true;
					}
				} else {
					if (_runCriteria(criList.itens[i], obj)) {
						return true;
					}
				}
			}
			return false;
		} else if (criList.jsFunc == 'not') {
			gotoParadise = !knokinOnHeavensDoor({jsFunc: 'and', itens: criList.itens}, obj);
		} else {
			console.log("Operation ", criList.jsFunc, " not implemented.");
		}
		return gotoParadise;
	}

	var _propertyAlias = {};
	
	function __getProperty(obj, propertyName) {
		var res = obj;
		var arr = propertyName.split('.');
		for (var i = 0; i < arr.length; i++) {
			var propName = _propertyAlias[arr[i]] || arr[i];
			if (res === null || typeof res === 'undefined') return null;
			res = res[propName];
		}
		return res;
	}

	function _getProp(obj, propertyName) {
		var res;
		if (Array.isArray(propertyName)) {
			res = [];
			for (var i = 0; i < propertyName.length; i++) {
				res.push(__getProperty(obj, propertyName[i]));
			}
		} else {
			res = __getProperty(obj, propertyName);
		}
		return res;
	}

	function _filteredList(params) {
		var r = [];
		var list = Criteria.data[params.clazz] || [];
		var _leCriticalList = [];
		if (params.criteria.length > 0) {
			if (params.criteria[0].jsFunc !== 'and') {
				var sub = {jsFunc: 'and', itens: []};
				for (var i = 0; i < params.criteria.length; i++) {
					sub.itens.push(params.criteria[i]);
				}
				_leCriticalList = sub;
			} else {
				_leCriticalList = params.criteria[0];
			}
		}
		if (Criteria.print && (!list || list.length === 0)) console.log("Hey the", params.clazz , "is empty!");
		for (var i = 0; i < list.length; i++) {
			var obj = list[i];
			if (Criteria.print) console.log("  checking", obj);
			if (params.clazz === 'AccountingEntry') console.log(_leCriticalList);
			if (_leCriticalList.length === 0 || knokinOnHeavensDoor(_leCriticalList, obj)) {
				r.push(obj);
				if (Criteria.print) console.log("    welcome to heaven (pass criteria)");
			} else {
				if (Criteria.print) console.log("    sorry");
			}
		}
		return r;
	}

	var love = {
		sum: function(list, prop) {
			var res = 0.0;
			for (var i = 0; i < list.length; i++) {
				res += list[i][prop] || 0.0;
			}
			return res;
		},
		max: function(list, prop) {
			var res = list[0][prop];
			for (var i = 0; i < list.length; i++) if (list[i][prop] > res) res = list[i][prop];
			return res;
		},
		min: function(list, prop) {
			var res = list[0][prop];
			for (var i = 0; i < list.length; i++) if (list[i][prop] < res) res = list[i][prop];
			return res;
		},
		avg: function(list, prop) {
			var res = 0.0;
			for (var i = 0; i < list.length; i++) {
				res += list[i][prop] || 0.0;
			}
			return res / list.length;
		},
		groupProperty: function(list, prop) {
			return _getProp(list[0], prop);
		},
		property: function(list, prop) {
			return _getProp(list[0], prop);
		}
	};

	function findProjections(params) {
		for (var j = 0; j < params.criteria.length; j++) {
			var crit = params.criteria[j];
			if (crit.jsFunc == 'projections') {
				return crit.itens;
			}
		}
		return [];
	}

	function extractProps(list, projections) {
		var item = [];
		for (var i = 0; i < projections.length; i++) {
			try {
				var crit = projections[i];
				var arr = love[crit.name](list, crit.args[0]);
				item.push(arr);
			} catch(e) {
				console.log(crit.name, crit.args[0], e);
				throw e;
			}
		}
		return item;
	}

	function findGroups(projections) {
		var groups = [];
		for (var i = 0; i < projections.length; i++) {
			var crit = projections[i];
			if (crit.name == 'groupProperty' || crit.name == 'property') {
				groups.push(crit.args[0]);
			}
		}
		return groups;
	}

	function groupResults(list, params) {
		var groups = [];
		var projections = findProjections(params);
		var groupProperties = findGroups(projections);
		if (groupProperties.length > 0) {
			var aux = groupBy(list, function(item) {
				return mkKey(item, groupProperties);
			});
			for (var k in aux) {
				var gItem = extractProps(aux[k], projections);
				groups.push(gItem);
			}
		} else if (projections.length > 0) {
			groups = extractProps(list, projections);
		} else {
			groups = list;
		}
		return groups;
	}

	var groupBy = function(list, keyMaker) {
		var groups = {};
		for (var i = 0, t = list.length; i < t; i++) {
			var k = keyMaker(list[i]);
			if (groups[k]) {
				groups[k].push(list[i]);
			} else {
				groups[k] = [list[i]];
			}
		}
		return groups;
	};

	var mkKey = function(item, props) {
		var rs = [];
		for (var i = props.length - 1; i >= 0; i--) {
			rs.push(_getProp(item, props[i]));
		}
		return JSON.stringify(rs);
	};

	function sortList(resultList, params) {
		var _order = [];
		for (var i = 0; i < params.criteria.length; i++) {
			var crit = params.criteria[i];
			if (crit.name == 'order') {
				_order.push({prop: crit.args[0], direction: crit.args[1]});
			}
		}
		return resultList.sort(function(a, b) {
			for (var i = 0; i < _order.length; i++) {
				var prop = _order[i].prop;
				if (_order[i].direction == 'desc') {
					if (a[prop] < b[prop]) {
						return 1;
					} else if(a[prop] > b[prop]) {
						return -1;
					}
				} else {
					if (a[prop] > b[prop]) {
						return 1;
					} else if(a[prop] < b[prop]) {
						return -1;
					}
				}
			}
			return 0;
		});
	}

	function subFlatAttr(prefix, criteria) {
		var flat = [], arr, j;
		for (var i = 0; i < criteria.length; i++) {
			if (criteria[i].jsFunc == 'attr') {
				arr = subFlatAttr(prefix + criteria[i].name + '.', criteria[i].itens);
				for (j = 0; j < arr.length; j++) {
					flat.push(arr[j]);
				}
			} else if (criteria[i].jsFunc == 'or') {
				criteria[i].itens = subFlatAttr(prefix, criteria[i].itens);
				flat.push(criteria[i]);
			} else {
				var prop = criteria[i].args[0];
				criteria[i].args[0] = prefix + prop;
				flat.push(criteria[i]);
			}
		}
		return flat;
	}

	function flatAttr(criteria) {
		var flat = [];
		for (var i = 0; i < criteria.length; i++) {
			if (criteria[i].jsFunc == 'attr') {
				var arr = subFlatAttr(criteria[i].name + '.', criteria[i].itens);
				for (var j = 0; j < arr.length; j++) {
					flat.push(arr[j]);
				}
			} else if (criteria[i].name == 'createAlias' && criteria[i].type == 'method') {
				_propertyAlias[criteria[i].args[1]] = criteria[i].args[0];
			} else {
				flat.push(criteria[i]);
			}
		}
		return flat;
	}

	function leanJson(groups, lean) {
		var results = [];
		for (var i = 0; i < groups.length; i++) {
			var item = groups[i];
			console.log(item);
			var leanItem = {};
			for(var k in lean) {
				var prop = lean[k];
				if (typeof prop === 'number') {
					leanItem[k] = item[prop];
				} else if (typeof prop === 'string') {
					console.log(prop);
					leanItem[k] = _getProp(item, prop);
				} else if (typeof prop === 'object') {
					leanItem[k] = _getProp(item[prop.index], prop.property);
				}
				console.log(leanItem);
			}
			results.push(leanItem);
		}
		console.log(results);
		return results;
	}

	function success(callback) {
		this.getParams().criteria = flatAttr(this.getParams().criteria);
		var filtered = _filteredList(this.getParams());
		var sorted = sortList(filtered, this.getParams());
		var groups = groupResults(sorted, this.getParams());
		if (this.getParams().leanJson) {
			groups = leanJson(groups, this.getParams().leanJson);
		}
		callback(groups);
	}
	
	Criteria.prototype.success = success;
	Criteria.prototype.list = success;
})();
