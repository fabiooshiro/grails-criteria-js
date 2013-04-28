package criteria.js

class Album {

	static belongsTo = [artist: Artist]

	static hasMany = [musics: Music]

	Integer year

    static constraints = {
    	year nullable: true
    }
}
