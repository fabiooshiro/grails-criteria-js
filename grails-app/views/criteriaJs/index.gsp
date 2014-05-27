<html>
<head>
	<title>Criteria JS</title>
	<script type="text/javascript">
		var config = {
			contextPath: '${request.contextPath}'
		}
	</script>
	<link rel="stylesheet" type="text/css" href="//tomate.herokuapp.com/js/jasmine-2.0.0/jasmine.css">
	<script src="//code.jquery.com/jquery-1.11.0.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="//tomate.herokuapp.com/js/jasmine-2.0.0/jasmine.js" type="text/javascript"></script>
	<script src="//tomate.herokuapp.com/js/jasmine-2.0.0/jasmine-html.js" type="text/javascript"></script>
	<script src="//tomate.herokuapp.com/js/jasmine-2.0.0/boot.js" type="text/javascript"></script>
	<g:javascript src="criteria.js" />
	<g:if test="${params.plastic}">
		<g:javascript src="plastic-criteria.js" />
		<g:javascript src="bootstrap.js" />
	</g:if>
	<g:javascript src="test-criteria.js" />
</head>
<body>

</body>
</html>
		