package criteria.js

/**
 * Strong Adapter 2 return the correct enum for org.hibernate.FetchMode
 */
class FetchMode{

	/**
	 * return the real fetch mode
	 */
	static get(String name){
		return org.hibernate.FetchMode."$name"
	}

}
