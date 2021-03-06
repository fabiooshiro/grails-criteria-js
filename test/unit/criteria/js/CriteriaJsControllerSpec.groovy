package criteria.js

import static plastic.criteria.PlasticCriteria.* // mockCriteria() method
import grails.converters.JSON
import grails.test.mixin.Mock
import grails.test.mixin.TestFor

import spock.lang.Specification

@TestFor(CriteriaJsController)
@Mock([Album, Artist, Music])
class CriteriaJsControllerSpec extends Specification{

	def "should do a simple criteria list"(){
		given: "a list of Music"
			new Music().save(validate: false)
			new Music().save(validate: false)
		and: "a criteria request"
			request.JSON = [clazz: 'Music']
		when: "call the server"
			controller.list()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def ls = JSON.parse(jsonStr)
			ls.size() == 2
	}

	def "should filter by artist"(){
		given: "a list of Music"
			def belaBartok = new Artist(name: 'Béla Bartók').save(validate: false)
			def album = new Album(artist: belaBartok).save(validate: false)
			new Music(album: album, time: 100.0).save(validate: false)
			new Music(album: album, time: 20.0).save(validate: false)
			new Music(album: album, time: 3.0).save(validate: false)

			def radioHead = new Artist(name: 'Radio Head').save(validate: false)
			def album2 = new Album(artist: radioHead).save(validate: false)
			new Music(album: album2).save(validate: false)
			new Music(album: album2).save(validate: false)
			mockCriteria(Music)
		and: "a criteria request"
			request.JSON = [
				clazz: 'Music',
				criteria: [
					[ // item da criteria
						type: 'closure',
						name: 'album',
						itens: [
							[
								type: 'closure',
								name: 'artist',
								itens: [
									[
										type: 'method',
										name: 'eq',
										args: ['id', belaBartok.id]
									]
								]
							]
						]
					]
				]
			]
		when: "call the server"
			controller.list()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def ls = JSON.parse(jsonStr)
			ls.size() == 3
			123.0 == ls.sum(0.0){it.time}
	}

	def "should get an artist"() {
		given:"an artist"
			def belaBartok = new Artist(name: 'Béla Bartók').save(validate: false)
		and:"a criteria request"
			request.JSON = [clazz: 'Artist', id: 1]
		when: "call the server"
			controller.get()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def artist = JSON.parse(jsonStr)
			1 == belaBartok.id
	}

	def "should convert date string by pattern"(){
		given: "a music list"
			new Music(date: new Date('2013/05/04')).save(validate: false)
			new Music(date: new Date('2013/05/05')).save(validate: false)
			new Music(date: new Date('2013/05/05')).save(validate: false)
			new Music(date: new Date('2013/05/06')).save(validate: false)
		and: "a criteria request"
			request.JSON = [
				clazz: 'Music',
				criteria: [
					[
						type: 'method',
						name: 'eq',
						args: ['date', '2013-05-05']
					]
				]
			]
		when: "call the server"
			controller.list()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def ls = JSON.parse(jsonStr)
			ls.size() == 2
	}

	def "should make json lean"() {
		given: "a music list"
			def belaBartok = new Artist(name: 'Béla Bartók').save(validate: false)
			def album1 = new Album(artist: belaBartok, year: 2010).save(validate: false)
			def album2 = new Album(artist: belaBartok, year: 2014).save(validate: false)
			new Music(album: album1).save(validate: false)
			new Music(album: album2).save(validate: false)
		and: "a criteria request"
		request.JSON = [
			clazz: 'Music',
			criteria: [],
			leanJson: [
				"year": 'album.year'
			]
		]
		when: "call the server"
			controller.list()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def ls = JSON.parse(jsonStr)
			2010 == ls[0].year
			2014 == ls[1].year
	}

	def "should make json lean, prop null"() {
		given: "a music list"
			def belaBartok = new Artist(name: 'Béla Bartók').save(validate: false)
			def album1 = new Album(artist: belaBartok, year: 2010).save(validate: false)
			def album2 = new Album(artist: belaBartok, year: 2014).save(validate: false)
			new Music(album: album1).save(validate: false)
			new Music().save(validate: false)
		and: "a criteria request"
		request.JSON = [
			clazz: 'Music',
			criteria: [],
			leanJson: [
				"year": 'album.year'
			]
		]
		when: "call the server"
			controller.list()
		then:
			def jsonStr = controller.response.contentAsString
			assert jsonStr
			def ls = JSON.parse(jsonStr)
			2010 == ls[0].year
			assert ls[1].isNull('year')
	}

}