// console.log('Goodblock content script.');

/******************************************************************************/
/******************************************************************************/

var baseElemId = 'goodblock-iframe-base';

var createGbScript = function() {
	var script = document.createElement('script');
	script.id = baseElemId;
	script.src = process.env.GOODBLOCK_SCRIPT_SRC;
	script.async = 'async';
	document.body.appendChild(script);
	return script;
}

// Create the Goodblock script if it does not exist.
// Return the script element.
var createGbScriptIdempotent = function() {
	var baseElem = document.querySelector('#' + baseElemId);
	if (!baseElem) {
		baseElem = createGbScript();
	}
}

// When this content script executes, there are two possibilities:
//   (1) This is the first time the content script has run in the
//		 current page, like when the user navigates to a new web
//		 page or when the user installs the extension for the first
//		 time.
//	 (2) This is the second or greater time the content script has
//	     has run in the current page. This can happen when the extension
//		 updates, when the user manually reloads the extension, or if
//		 the user uninstalls and reinstalls without reloading a web page.
createGbScriptIdempotent();

/******************************************************************************/
/******************************************************************************/
