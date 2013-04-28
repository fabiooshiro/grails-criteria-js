Criteria JS
===========


<a href="http://margotskapacs.com/2013/04/localdate-as-json-and-other-types-to-custom-serialize-in-grails/">Custom JSON</a>

Groovy
```groovy
def belaBartok = new Artist(name: 'Béla Bartók').save(failOnError: true)
def album = new Album(artist: belaBartok).save(failOnError: true)
new Music(album: album, time: 100.0).save(failOnError: true)
new Music(album: album, time: 20.0).save(failOnError: true)
new Music(album: album, time: 3.0).save(failOnError: true)

def radioHead = new Artist(name: 'Radio Head').save(failOnError: true)
def album2 = new Album(artist: radioHead, year: 2000).save(failOnError: true)
new Music(album: album2, time: 2.2).save(failOnError: true)
new Music(album: album2, time: 5.4).save(failOnError: true)
```

Javascript
```javascript
describe("criteria js", function(){
    it("should sum", function(){
        var done = false;
        runs(function(){
            new Criteria('Music')
                .attr('album', function(album){
                    album.eq('id', new Long(1));
                })
                .projections(function(p){
                    p.sum('time');
                })
                .success(function(response){
                    expect(response.length).toEqual(1);
                    expect(response[0]).toEqual(123);
                    done = true;
                })
            ;
        });

        waitsFor(function(){ return done; }, 'Test timeout', 10000);
    });

    it("should groupProperty", function(){
        var done = false;
        runs(function(){
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
                    done = true;
                })
            ;
        });
        
        waitsFor(function(){ return done; }, 'Test timeout', 10000);
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

});
```


