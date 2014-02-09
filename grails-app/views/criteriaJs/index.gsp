<html>
<head>
	<title>Console</title>
	<link rel="stylesheet" href="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine.css"/>
	<script type="text/javascript">
		var config = {
			contextPath: '${request.contextPath}'
		}
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine.js"></script>
	<script src="http://pivotal.github.io/jasmine/lib/jasmine-1.3.1/jasmine-html.js"></script>
	
	<g:javascript src="criteria.js" />
	<script type="text/javascript">
		function step(description, fn, timeout){
			var done = fn.length != 1; // has done arg in fn?
			runs(function(){
				fn(function(){
					done = true;
				});
			});
			waitsFor(function(){ return done; }, 'step "' + description + '"', timeout?timeout:5000);
		}

		describe("criteria js", function(){
			it("should sum music time", function(){
				var results = [];
				step("call the server", function(done){
					new Criteria('Music')
						.attr('album', function(album){
							album.eq('id', new Long(1));
						})
						.projections(function(p){
							p.sum('time');
						})
						.success(function(response){
							results = response;
							done();
						})
					;
				});
				step("verify results", function(){
					expect(results.length).toEqual(1);
					expect(results[0]).toEqual(123);
				});
			});

			it("should sum time and groupProperty album", function(){
				step("call the server", function(done){
					new Criteria('Music')
						.projections(function(p){
							p.groupProperty('album');
							p.sum('time');
						})
						.success(function(response){
							expect(response[0][0].class).toBe("criteria.js.Album");
							expect(response[0][1]).toEqual(123);
							expect(response[1][0].class).toBe("criteria.js.Album");
							expect(response[1][1]).toEqual(7.6);
							done();
						})
					;
				});
			});

			it("should max", function(){
				var done = false;
				runs(function(){
					new Criteria('Music')
						.projections(function(p){
							p.max('time');
						})
						.success(function(response){
							expect(response.length).toEqual(1);
							expect(response[0]).toEqual(100);
							done = true;
						})
					;
				});
				waitsFor(function(){ return done; }, 'Test timeout', 10000);
			});

			it("should min", function(){
				var done = false;
				runs(function(){
					new Criteria('Music')
						.projections(function(p){
							p.min('time');
						})
						.success(function(response){
							expect(response.length).toEqual(1);
							expect(response[0]).toEqual(2.2);
							done = true;
						})
					;
				});
				waitsFor(function(){ return done; }, 'Test timeout', 10000);
			});

			it("should filter time > 3", function(){
				var done = false;
				runs(function(){
					new Criteria('Music')
						.gt('time', new BigDecimal(3))
						.success(function(response){
							expect(response.length).toEqual(3);
							done = true;
						})
					;
				});
				waitsFor(function(){ return done; }, 'Test timeout', 10000);
			});

			it("should filter year == 2000", function(){
				var done = false;
				runs(function(){
					new Criteria('Album')
						.eq('year', 2000)
						.success(function(response){
							expect(response.length).toEqual(1);
							expect(response[0].year).toEqual(2000);
							done = true;
						})
					;
				});
				waitsFor(function(){ return done; }, 'Test timeout', 10000);
			});

			it("should load eager", function(){
				step("call server", function(done){
					new Criteria('Music')
						.eq('name', 'OK Computer')
						.fetchMode('album', FetchMode.JOIN)
						.fetchMode('album.artist', FetchMode.JOIN)
						.success(function(response){
							expect(response[0].album.year).toEqual(2000);
							done();
						})
					;
				});
			});

			it("should get an artist", function(){
				step("call server", function(done){
					new Criteria('Artist').get(new Long(1), function(response){
							expect(response.id).toEqual(1);
							done();
					});
				});
			});

			it("should order by sum", function(){
				step("call server asc", function(done){
					new Criteria('Music')
						.projections(function(p){
							p.groupProperty('album');
							p.sum('time', 'time');
						})
						.order('time', 'asc')
						.success(function(response){
							expect(response[0][0].class).toBe("criteria.js.Album");
							expect(response[0][1]).toEqual(7.6);
							expect(response[1][0].class).toBe("criteria.js.Album");
							expect(response[1][1]).toEqual(123);
							done();
						})
					;
				});

				step("call server desc", function(done){
					new Criteria('Music')
						.projections(function(p){
							p.groupProperty('album');
							p.sum('time', 'time');
						})
						.order('time', 'desc')
						.success(function(response){
							expect(response[0][0].class).toBe("criteria.js.Album");
							expect(response[0][1]).toEqual(123);
							expect(response[1][0].class).toBe("criteria.js.Album");
							expect(response[1][1]).toEqual(7.6);
							done();
						})
					;
				});
			});

			it("should filter by date", function(){
				step("call server desc", function(done){
					new Criteria('Music')
						.ge('date', "2013-01-04")
						.le('date', "2013-01-05")
						.order('date', 'asc')
						.success(function(response){
							expect(response[0].class).toBe("criteria.js.Music");
							expect(response[0].name).toBe("Idioteque");
							expect(response[1].class).toBe("criteria.js.Music");
							expect(response[1].name).toBe("OK Computer");
							done();
						})
					;
				});
			});

			it("should filter name in list", function(){
				step("call server", function(done){
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
			});

		});
		
	</script>
</head>
<body>
<script type="text/javascript">
(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;

  /**
   Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
   */
  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  /**
   Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
   */
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  /**
   Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler

   ### Test Results

   Scroll down to see the results of all of these specs.
   */
  var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    //document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }
})();
</script>
</body>
</html>
		