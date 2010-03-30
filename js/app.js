$(document).ready(function(){
	$('#flickr').jflickrfeed({
		limit: 14,
		qstrings: {
			nsid: '47865405@N02',
			set: '72157623732861328'
		},
		feedapi: 'photoset.gne',
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
	$("#content a[href*='flickr.com']").fancybox();
}