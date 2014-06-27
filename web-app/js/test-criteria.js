describe("criteria js", function() {
	it("should sum music time", function(done) {
		new Criteria('Music')
			.attr('album', function(album) {
				album.eq('id', new Long(1));
			})
			.projections(function(p) {
				p.sum('time');
			})
			.success(function(results) {
				expect(results.length).toEqual(1);
				expect(results[0]).toEqual(123);
				done();
			})
		;
	});

	it("should sum time and groupProperty album", function(done) {
		new Criteria('Music')
			.projections(function(p){
				p.groupProperty('album');
				p.sum('time');
			})
			.success(function(response){
				expect(response[0][0].class).toBe("criteria.js.Album");
				expect(response[0][1]).toEqual(123);
				expect(response[1][0].class).toBe("criteria.js.Album");
				expect(response[1][1]).toBeCloseTo(7.6, 1);
				done();
			})
		;
	});

	it("should max", function(done) {
		new Criteria('Music')
			.projections(function(p) {
				p.max('time');
			})
			.success(function(response) {
				expect(response.length).toEqual(1);
				expect(response[0]).toEqual(100);
				done();
			})
		;
	});

	it("should min", function(done) {
		new Criteria('Music')
			.projections(function(p) {
				p.min('time');
			})
			.success(function(response) {
				expect(response.length).toEqual(1);
				expect(response[0]).toEqual(2.2);
				done();
			})
		;
	});

	it("should avg", function(done) {
		new Criteria('Music')
			.projections(function(p) {
				p.avg('time');
			})
			.success(function(response) {
				expect(response.length).toEqual(1);
				expect(response[0]).toBeCloseTo(26.12, 2);
				done();
			})
		;
	});

	it("should filter time > 3", function(done) {
		new Criteria('Music')
			.gt('time', new BigDecimal(3))
			.success(function(response){
				expect(response.length).toEqual(3);
				done();
			})
		;
	});

	it("should filter year == 2000", function(done) {
		new Criteria('Album')
			.eq('year', 2000)
			.success(function(response) {
				expect(response.length).toEqual(1);
				expect(response[0].year).toEqual(2000);
				done();
			})
		;
	});

	it("should load eager", function(done) {
		new Criteria('Music')
			.eq('name', 'OK Computer')
			.fetchMode('album', FetchMode.JOIN)
			.fetchMode('album.artist', FetchMode.JOIN)
			.success(function(response) {
				expect(response[0].album.year).toEqual(2000);
				done();
			})
		;
	});

	it("should get an artist", function(done) {
		new Criteria('Artist').get(new Long(1), function(artist) {
			expect(artist.id).toEqual(1);
			done();
		});
	});

	it("should order by sum asc", function(done) {
		new Criteria('Music')
			.projections(function(p){
				p.groupProperty('album');
				p.sum('time', 'time');
			})
			.order('time', 'asc')
			.success(function(response){
				expect(response[0][0].class).toBe("criteria.js.Album");
				expect(response[0][1]).toBeCloseTo(7.6, 1);
				expect(response[1][0].class).toBe("criteria.js.Album");
				expect(response[1][1]).toEqual(123);
				done();
			})
		;
	});

	it("should order by sum desc", function(done) {
		new Criteria('Music')
			.projections(function(p) {
				p.groupProperty('album');
				p.sum('time', 'time');
			})
			.order('time', 'desc')
			.success(function(response) {
				expect(response[0][0].class).toBe("criteria.js.Album");
				expect(response[0][1]).toEqual(123);
				expect(response[1][0].class).toBe("criteria.js.Album");
				expect(response[1][1]).toBeCloseTo(7.6, 1);
				done();
			})
		;
	});

	it("should filter by date", function(done) {
		new Criteria('Music')
			.ge('date', "2013-01-04")
			.le('date', "2013-01-05")
			.order('date', 'asc')
			.success(function(response) {
				expect(response[0].class).toBe("criteria.js.Music");
				expect(response[0].name).toBe("Idioteque");
				expect(response[1].class).toBe("criteria.js.Music");
				expect(response[1].name).toBe("OK Computer");
				done();
			})
		;
	});

	it("should filter name in list", function(done) {
		new Criteria('Music')
			.in('name', ["OK Computer", "Idioteque"])
			.order('name', 'asc')
			.success(function(response){
				expect(response.length).toBe(2);
				expect(response[0].class).toBe("criteria.js.Music");
				expect(response[0].name).toBe("Idioteque");
				expect(response[1].class).toBe("criteria.js.Music");
				expect(response[1].name).toBe("OK Computer");
				done();
			})
		;
	});

	it("should filter by name not in", function(done) {
		new Criteria('Music')
			.not(function(not) {
				not.in('name', ["OK Computer", "Idioteque"]);
			})
			.order('name', 'asc')
			.success(function(response){
				expect(response.length).toBe(3);
				expect(response[0].class).toBe("criteria.js.Music");
				expect(response[0].name).toBe("A");
				expect(response[1].class).toBe("criteria.js.Music");
				expect(response[1].name).toBe("B");
				expect(response[2].class).toBe("criteria.js.Music");
				expect(response[2].name).toBe("C");
				done();
			})
		;
	});

	it("should returns musics with name 'Ok Computer' or 'Idioteque'", function(done) {
		new Criteria('Music')
			.or(function(or) {
				or.eq('name', "OK Computer");
				or.eq('name', "Idioteque");
			})
			.order('name', 'asc')
			.success(function(response){
				expect(response.length).toBe(2);
				expect(response[0].class).toBe("criteria.js.Music");
				expect(response[0].name).toBe("Idioteque");
				expect(response[1].class).toBe("criteria.js.Music");
				expect(response[1].name).toBe("OK Computer");
				done();
			})
		;
	});

});