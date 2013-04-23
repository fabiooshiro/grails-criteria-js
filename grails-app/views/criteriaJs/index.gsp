<html>
<head>
	<title>Console</title>
	<script type="text/javascript">
		var config = {
			contextPath: '${request.contextPath}'
		}
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<g:javascript src="criteria.js" />
	<script type="text/javascript">
		$(function(){
			$('#btnRun').click(function(){
				eval($('#criteria').val());
			});
		});
	</script>
</head>
<body>
<textarea id="criteria">
new Criteria('Music')
	.attr('album', function(album){
		album.eq('id', 1);
	})
	.projections(function(p){
		p.sum('time');
	})
	.success(function(response){
		$("#result").html(JSON.stringify(response));
	})
;
</textarea>
<input type="button" value="Run" id="btnRun" />
<div id="result"></div>
</body>
</html>
		