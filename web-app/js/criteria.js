function BigDecimal(val){
	this.class = 'java.math.BigDecimal';
	this.value = val;
}

function Long(val){
	this.class = 'java.lang.Long';
	this.value = val;
}

function LocalDate(val){
	this.class = 'org.joda.time.LocalDate';
	this.value = val;	
}

var FetchMode = {
	JOIN: {class: 'criteria.js.FetchMode', id: 'JOIN'},
	EAGER: {class: 'criteria.js.FetchMode', id: 'EAGER'}
}

function Criteria(clazz){
	var url = config.contextPath + '/criteriaJs/list';
	var self = this;
	var params = {clazz: clazz, criteria: []};

	this.getParams = function(){
		return params;
	};

	this.fetchMode = function(prop, val){
		params.criteria.push({type: 'method', name: 'fetchMode', args: [prop, val]});
		return self;
	};

	this.like = function(prop, val){
		params.criteria.push({type: 'method', name: 'like', args: [prop, val]});
		return self;
	};

	this.eq = function(prop, val){
		params.criteria.push({type: 'method', name: 'eq', args: [prop, val]});
		return self;	
	};

	this.ne = function(prop, val){
		params.criteria.push({type: 'method', name: 'ne', args: [prop, val]});
		return self;	
	};

	this.gt = function(prop, val){
		params.criteria.push({type: 'method', name: 'gt', args: [prop, val]});
		return self;	
	};

	this.ge = function(prop, val){
		params.criteria.push({type: 'method', name: 'ge', args: [prop, val]});
		return self;	
	};

	this.le = function(prop, val){
		params.criteria.push({type: 'method', name: 'le', args: [prop, val]});
		return self;	
	};

	this.lt = function(prop, val){
		params.criteria.push({type: 'method', name: 'lt', args: [prop, val]});
		return self;	
	};

	this.order = function(prop, val){
		params.criteria.push({type: 'method', name: 'order', args: [prop, val]});
		return self;	
	};

	this.property = function(prop){
		params.criteria.push({type: 'method', name: 'property', args: [prop]});
		return self;
	};

	this.isNull = function(prop){
		params.criteria.push({type: 'method', name: 'isNull', args: [prop]});
		return self;
	};

	this.isNotNull = function(prop){
		params.criteria.push({type: 'method', name: 'isNotNull', args: [prop]});
		return self;
	};

	this.groupProperty = function(prop){
		params.criteria.push({type: 'method', name: 'groupProperty', args: [prop]});
		return self;
	};

	this.count = function(prop){
		params.criteria.push({type: 'method', name: 'count', args: [prop]});
		return self;
	};

	this.countDistinct = function(prop){
		params.criteria.push({type: 'method', name: 'countDistinct', args: [prop]});
		return self;
	};

	this.maxResults = function(intVal){
		params.criteria.push({type: 'method', name: 'maxResults', args: [intVal]});
		return self;
	};

	this.firstResult = function(intVal){
		params.criteria.push({type: 'method', name: 'firstResult', args: [intVal]});
		return self;
	};

	this.sum = function(prop){
		params.criteria.push({type: 'method', name: 'sum', args: [prop]});
		return self;	
	};

	this.max = function(prop){
		params.criteria.push({type: 'method', name: 'max', args: [prop]});
		return self;	
	};

	this.min = function(prop){
		params.criteria.push({type: 'method', name: 'min', args: [prop]});
		return self;	
	};

	this.avg = function(prop){
		params.criteria.push({type: 'method', name: 'avg', args: [prop]});
		return self;	
	};

	this.and = function(subCrit){
		self.attr('and', subCrit);
		return self;
	};

	this.or = function(subCrit){
		self.attr('or', subCrit);
		return self;
	};

	this.projections = function(subCrit){
		self.attr('projections', subCrit);
		return self;
	};

	this.attr = function(name, subCrit){
		var subParams = {type: 'closure', name: name, itens: []};
		params.criteria.push(subParams)
		var crit = new Criteria();
		subCrit(crit);
		subParams.itens = crit.getParams().criteria;
		return self;
	};

	this.postIt = function(callback){
		$.ajax(url, {
    		data: JSON.stringify(params),
    		contentType : 'application/json',
    		type : 'POST',
    		success: callback
    	});
	}

	this.list = function(callback){
		this.postIt(callback);
	}

	this.success = function(callback){
		this.postIt(callback);
	};
}

