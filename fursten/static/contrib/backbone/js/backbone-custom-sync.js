/* alias away the sync method */
Backbone._sync = Backbone.sync;

/* define a new sync method */
Backbone.sync = function(method, model, options) {

	function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
	
	/* only need a token for non-get requests */
    if (method == 'create' || method == 'update' || method == 'delete') {
        // CSRF token value is in an embedded meta tag 
        var csrfToken = $("meta[name='csrf_token']").attr('content');

        options.beforeSend = function(xhr){
        	var csrfToken = getCookie('csrftoken');
        	xhr.setRequestHeader('X-CSRFToken', csrfToken);
        };
    }

    /* proxy the call to the old sync method */
    return Backbone._sync(method, model, options);
};

$(function(){
	jQuery(document).ready(function($) {
		$.ajaxSetup({ 
		    beforeSend: function(xhr, settings) {
		        function getCookie(name) {
		            var cookieValue = null;
		            if (document.cookie && document.cookie != '') {
		                var cookies = document.cookie.split(';');
		                for (var i = 0; i < cookies.length; i++) {
		                    var cookie = jQuery.trim(cookies[i]);
		                    // Does this cookie string begin with the name we want?
		                if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                    break;
		                }
		            }
		        }
		        return cookieValue;
		        }
		        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
		            // Only send the token to relative URLs i.e. locally.
		            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		        }
		    } 
		});
	});
});