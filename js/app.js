$(document).ready(function(){
	$('#flickr').jflickrfeed({
		limit: 14,
		qstrings: {
			id: '47865405@N02'
		},
		itemTemplate: 
		'<li>' +
			'<a href="{{image_b}}" class="photos"><img src="{{image_s}}" alt="{{title}}" /></a>' +
		'</li>'
	}, function(){
		bind();
	});
	
	bind();
});

function bind(){
	$("#flickr a").fancybox();
}