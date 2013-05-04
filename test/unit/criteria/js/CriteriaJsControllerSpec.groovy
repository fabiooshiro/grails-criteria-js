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
}
