$(document).ready(function(){
	/*$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=47865405@N02&lang=en-us&format=json&nojsoncallback=1", function(data){
		alert(data);
		$.each(data.items, function(i, item){
			$("<img/>").attr("src", item.media.m).appendTo("#flickr");
			if( i == 3)
				return false;
		});
	});*/
	$('#flickr').jflickrfeed({
		limit: 14,
		qstrings: {
			id: '47865405@N02'
		},
		itemTemplate: 
		'<li>' +
			'<a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a>' +
		'</li>'
	});
});