"use strict";

/* toBlob Polyfill */
if (!HTMLCanvasElement.prototype.toBlob) {
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
		value: function(callback, type, quality) {
			var canvas = this;
			setTimeout(function() {

				var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
					len = binStr.length,
					arr = new Uint8Array(len);

				for (var i = 0; i < len; i++) {
					arr[i] = binStr.charCodeAt(i);
				}

				callback(new Blob([arr], {
					type: type || 'image/png'
				}));

			});
		}
	});
}

class Petit {
	constructor({
			fileType = 'jpeg',
			quality = .88,
			maxHeight = false,
			maxWidth = false,
			scaling = false,
			onError = (e) => console.error( e ),
			onSuccess = null
		}) {
			this.onSuccess = onSuccess;
			this.fileType = 'image/' + fileType;
			this.quality = quality;
			this.maxHeight = maxHeight;
			this.maxWidth = maxWidth;
			this.scaling = scaling;
			this.onError = onError;
	}
	
	loadFile({ file }) {
		let reader = new FileReader(),
			quality = this.quality,
			maxHeight = this.maxHeight,
			maxWidth = this.maxWidth,
			fileType = this.fileType,
			callback = this.onSuccess,
			scaling = this.scaling,
			error = this.onError;
		
		try {
			reader.onload = (e) => {
				let img = new Image();
				
				img.onload = function() {
					let	ratio = null;
					
					/* Check for maxHeight/maxWidth */
					if ( !maxHeight && maxWidth ) {
						/* No maxHeight provided but maxWidth was */
						ratio = maxWidth / img.width;
					} else if ( maxHeight && !maxWidth ) {
						/* No maxWidth provided but maxHeight was */
						ratio = maxHeight / img.height;
					} else if ( maxHeight && maxWidth) {
						/* Both maxWidth and maxHeight were provided */
						/* Get ratios from both maxHeight & maxWidth */
						let mwRatio = maxWidth / img.width;
							mwRatio = img.height * mwRatio;
						let	mhRatio = maxHeight / img.height;
							mhRatio = img.width * mhRatio;
						/* Check to see which ratio doesn't go against either of the max's */
						if ( mwRatio > maxHeight ) {
							/* maxHeight ratio was used */
							ratio = maxHeight / img.height
						} else if ( mhRatio > maxWidth ) {
							/* maxWidth ratio was used */
							ratio = maxWidth / img.width
						}
					} else {
						/* no maxWidth or maxHeight were provided */
						ratio = 1;
					}
					
					/* Check if image is being scaled up */
					/* If larger, reset ratio to 1 if scaling is set to false */
					if ( ratio > 1 && !scaling ) ratio = 1;
					
					/* Create Canvas image based on generated ratio */
					let canvas = document.createElement('canvas');
						canvas.width = img.width * ratio;
						canvas.height = img.height * ratio;
				
					let ctx = canvas.getContext("2d");
						ctx.drawImage( img, 0, 0, canvas.width, canvas.height );
				
					/* Convert to Blob/Export via provided Callback */
					canvas.toBlob( function( blob ) {
						if ( file.size < blob.size && ratio == 1 ) {
							/* Image compression wasn't efficient. Original file size is smaller than the new file size.. */
							/* Output should be original file instead of oversized Blob */
							callback( file, 0 )
							return;
						}
						callback( blob, 1 )
					}, fileType, quality);
				};
				
				img.src = e.target.result;
			}

			reader.readAsDataURL(file);
		} catch(e) {
			error(e)
		}
	}
	
	static returnFileSize(number) {
		if(number < 1024) {
			return number + ' bytes';
		} else if(number > 1024 && number < 1048576) {
			return (number/1024).toFixed(1) + ' <span>KB</span>';
		} else if(number > 1048576) {
			return (number/1048576).toFixed(1) + ' <span>MB</span>';
		}
	}
}
