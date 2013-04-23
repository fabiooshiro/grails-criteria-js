import criteria.js.*

class BootStrap {

    def init = { servletContext ->
		def belaBartok = new Artist(name: 'Béla Bartók').save(failOnError: true)
		def album = new Album(artist: belaBartok).save(failOnError: true)
		new Music(album: album, time: 100.0).save(failOnError: true)
		new Music(album: album, time: 20.0).save(failOnError: true)
		new Music(album: album, time: 3.0).save(failOnError: true)

		def radioHead = new Artist(name: 'Radio Head').save(failOnError: true)
		def album2 = new Album(artist: radioHead, year: 2000).save(failOnError: true)
		new Music(album: album2, time: 2.2).save(failOnError: true)
		new Music(album: album2, time: 5.4).save(failOnError: true)
    }

}
