Tabtastic
=========

iFrame web interface jQuery plugin

I wanted to create a desktop application feel in a web browser and that led me
to develop a custom jQuery plug-in which I have dubbed “Tabtastic”. It works by 
laying out a canvas so to speak for the creation of tabbed iframes. It is simple 
to use and can be easily extended.


Include your core files
<link type="text/css" href="includes/jquery.tabtastic.css" media="screen" rel="Stylesheet" />
<script type="text/javascript" src="includes/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="includes/jquery.tabtastic.js"></script>

Create a placeholder element as a container for your tab interface
<!-- just any old container element will do -->
<div id="tabtastic" style="border:solid 1px #666666;"></div>
<!-- you could also use a span with display:block; -->

Initiate the placeholder element as tabtastic
$(document).ready(function() {
	//tabtastic
	$('#tabtastic').tabtastic();
	$(document).tabtastic('createLinks');
});

Add a link that will open/add a new tab
<!-- this is an example anchor that will open a new tab -->
<a href="javascript:$('#tabtastic').tabtastic('add', 
{ title: 'Tab 1', src: 'tabs/tab1.html', sticky: 'false' });">Tab 1</a>
<!-- you could also use the javascript above to open a new 
tab on page load if you like -->
