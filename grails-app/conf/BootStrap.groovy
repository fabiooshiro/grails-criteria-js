import criteria.js.*

class BootStrap {

    def init = { servletContext ->
		def belaBartok = new Artist(name: 'Béla Bartók').save(failOnError: true)
		def album = new Album(artist: belaBartok).save(failOnError: true)
		new Music(album: album, date: new Date('2013/01/01'), time: 100.0).save(failOnError: true)
		new Music(album: album, date: new Date('2013/01/02'), time: 20.0).save(failOnError: true)
		new Music(album: album, date: new Date('2013/01/03'), time: 3.0).save(failOnError: true)

		def radioHead = new Artist(name: 'Radio Head').save(failOnError: true)
		def album2 = new Album(artist: radioHead, year: 2000).save(failOnError: true)
		new Music(album: album2, date: new Date('2013/01/04'), time: 2.2, name: 'Idioteque').save(failOnError: true)
		new Music(album: album2, date: new Date('2013/01/05'), time: 5.4, name: 'OK Computer').save(failOnError: true)
    }

}
