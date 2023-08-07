jQuery(document).ready(function() {
	jQuery('#file').change(function() {
		if(jQuery(this).val() != '') {
			var genres = [], producers = [];
			var formData = new FormData();
			jQuery('#result').html('');
			jQuery('.loading').css('display','block');
			formData.append('file', jQuery(this)[0]['files'][0]);
			jQuery.ajax({
			    url: 'https://api.trace.moe/search?anilistInfo',
				method: 'post',
				data: formData,
				processData: false,
				contentType: false,
				headers: {"Content-Type": jQuery(this)[0]['files'][0]['type']},
				success: function(data) {
					for(let i = 0; i < 5; i++) {
					var ms;
					ms = 1000;
					ms += new Date().getTime();
					while (new Date() < ms){}
					jQuery.ajax({
						url: `https://api.jikan.moe/v4/anime?q=${data['result'][i]['anilist']['title']['romaji']}&limit=1`,
						method: 'get',
						success: function(response) {
							for (let i = 0; i < response['data'][0]['genres'].length; i++) {
								genres.push(response['data'][0]['genres'][i]['name']);
							}
							for (let i = 0; i < response['data'][0]['producers'].length; i++) {
								producers.push(response['data'][0]['producers'][i]['name']);
							}
							jQuery('#result').html(jQuery('#result')[0].outerHTML+`
<tr>
	<td class='logo'><img src='${response['data'][0]['images']['jpg']['image_url']}'></td>
	<td class='text'>
		<strong>title:</strong> ${response['data'][0]['title']}<br>
		<strong>title (english):</strong> ${response['data'][0]['title_english']}<br>
		<strong>episodes:</strong> ${response['data'][0]['episodes']}<br>
		<strong>status:</strong> ${response['data'][0]['status']}<br>
		<strong>season:</strong> ${response['data'][0]['season']} ${response['data'][0]['year']}<br>
		<strong>genres:</strong> ${genres.join(', ')}<br>
		<strong>producers:</strong> ${producers.join(', ')}<br>
		<strong>similarity:</strong> ${Math.round(data['result'][i]['similarity'] * 100)} %<br>
		<u><a data='${data['result'][i]['video']}' n=${i} status='off' class='view_video'>view part of the video</a><u>
	</td>
</tr>
`);
						}
					});
				}
				jQuery('.loading').css('display','none');
				},
				error: function () {
					alert('error');
					jQuery('.loading').css('display','none');
				}
			});
		}
	});

	jQuery('#search').on('click', function() {
		var url, genres = [], producers = [];
		jQuery('#result').html('');
		jQuery('.loading').css('display','block');
		url = jQuery('#inputline').val();
		jQuery.ajax({
			url: 'https://api.trace.moe/search?anilistInfo&url='+url,
			method: 'get',
			success: function(data) {
				for(let i = 0; i < 5; i++) {
					var ms;
					ms = 1000;
					ms += new Date().getTime();
					while (new Date() < ms){}
					jQuery.ajax({
						url: `https://api.jikan.moe/v4/anime?q=${data['result'][i]['anilist']['title']['romaji']}&limit=1`,
						method: 'get',
						success: function(response) {
							for (let i = 0; i < response['data'][0]['genres'].length; i++) {
								genres.push(response['data'][0]['genres'][i]['name']);
							}
							for (let i = 0; i < response['data'][0]['producers'].length; i++) {
								producers.push(response['data'][0]['producers'][i]['name']);
							}
							jQuery('#result').html(jQuery('#result')[0].outerHTML+`
<tr>
	<td class='logo'><img src='${response['data'][0]['images']['jpg']['image_url']}'></td>
	<td class='text'>
		<strong>title:</strong> ${response['data'][0]['title']}<br>
		<strong>title (english):</strong> ${response['data'][0]['title_english']}<br>
		<strong>episodes:</strong> ${response['data'][0]['episodes']}<br>
		<strong>status:</strong> ${response['data'][0]['status']}<br>
		<strong>season:</strong> ${response['data'][0]['season']} ${response['data'][0]['year']}<br>
		<strong>genres:</strong> ${genres.join(', ')}<br>
		<strong>producers:</strong> ${producers.join(', ')}<br>
		<strong>similarity:</strong> ${Math.round(data['result'][i]['similarity'] * 100)} %<br>
		<u><a data='${data['result'][i]['video']}' n=${i} status='off' class='view_video'>view part of the video</a><u>
	</td>
</tr>
`);
						}
					});
				}
				jQuery('.loading').css('display','none');
			},
			error: function () {
				alert('error');
				jQuery('.loading').css('display','none');
			}
		});
	});
	$(document).on("click", ".view_video", function(data) {
		if(data['target']['attributes']['status']['nodeValue'] == 'off') {
			jQuery(`a[n = ${data['target']['attributes']['n']['nodeValue']}]`).html(`
<u><a data='${data['target']['attributes']['data']['nodeValue']}' n=${data['target']['attributes']['n']['nodeValue']} status='on' class='view_video'>hide part of the video</a><u><br>
<video width="320" height="240" controls>
	<source src="${data['target']['attributes']['data']['nodeValue']}" type="video/mp4">
Your browser does not support the video tag.
</video>
		`);
		} else {
			jQuery(`a[n = ${data['target']['attributes']['n']['nodeValue']}]`).html(`
<u><a data='${data['target']['attributes']['data']['nodeValue']}' n=${data['target']['attributes']['n']['nodeValue']} status='off' class='view_video'>view part of the video</a><u>
		`);
		}
		
	});
});