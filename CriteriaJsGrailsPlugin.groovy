class CriteriaJsGrailsPlugin {
    def version = "0.8.1"
    def grailsVersion = "2.0 > *"
    def pluginExcludes = [
        'grails-app/domain/**',
        "grails-app/views/error.gsp"
    ]

    def title = "Criteria Js Plugin"
    def author = "Fabio Issamu Oshiro"
    def authorEmail = ""
    def description = 'GORM criteria for javascript'

    def documentation = "https://github.com/fabiooshiro/grails-criteria-js"

    def license = "APACHE"
    def organization = [name: "Investtools", url: "http://www.investtools.com.br/"]
    def issueManagement = [system: 'GitHub', url: 'https://github.com/fabiooshiro/grails-criteria-js/issues']
    def scm = [url: 'https://github.com/fabiooshiro/grails-criteria-js']
}
