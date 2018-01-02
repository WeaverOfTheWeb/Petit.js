Quick and easy, client-side image compression with JavaScripts Canvas API! - [Demo](http://petit.lewisshaw.me/) 🎨🖼️

```html
<script type="text/javascript">
    var image = new Petit({
		/* Quality ranges from 0 - 1 */
		quality: .92,
		/* JPEG or PNG, no compression with PNG */
		fileType: 'jpeg',
		/* Max Width & Height */
		maxWidth: 600,
		maxHeight: 500,
		/* Scale image upwards if Max Height/Width > Original, default is set to false */
		scaling: false,
		/* Deal with compressed output */
		onSuccess: function( blob, wasCompressed ) {
			if ( wasCompressed ) {
				/* Image was compressed */
				/* Blob output can now be sent to your server */
			} else {
				/* Image wasn't compressed (file size larger than original input) */
				/* Original input file is spat out */
				/* Possibly send formdata informing your server to do the compression/resize */
			}
		},
		/* Catch Errors */
		onError: function(e) {console.error( e )}
	});
</script>
```
## Change Log

__1.0.0__

- Initial release
