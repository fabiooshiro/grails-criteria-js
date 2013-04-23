function Criteria(clazz){
	var url = config.contextPath + '/criteriaJs/list';
	var self = this;
	var params = {clazz: clazz, criteria: []};

	this.getParams = function(){
		return params;
	};

	this.like = function(prop, val){
		params.criteria.push({type: 'method', name: 'like', args: [prop, val]});
		return self;
	};

	this.eq = function(prop, val){
		params.criteria.push({type: 'method', name: 'eq', args: [prop, val]});
		return self;	
	}

	this.sum = function(prop){
		params.criteria.push({type: 'method', name: 'sum', args: [prop]});
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

	this.success = function(callback){
		$.ajax(url, {
    		data: JSON.stringify(params),
    		contentType : 'application/json',
    		type : 'POST',
    		success: callback
    	});
	};
}

