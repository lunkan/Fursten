Backbone.Form.editors.BootstrapAutocomplete = Backbone.Form.editors.Autocomplete.extend({
  attributes: {'class':'form-control'}
});

/*;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.BootstrapAutocomplete = editors.Autocomplete.extend({}
	
		template: _.template('\
		    <div>\
		      <table class="table table-striped table-bordered">\
				<colgroup>\
				  <% _.each(headers, function(header, index) { %>\
		    	  <col class="col<%= index %>">\
		    	  <% }); %>\
		    	  <col class="col<%= headers.length %>">\
		    	</colgroup>\
				<thead class="">\
		    	  <tr>\
		    	  <% _.each(headers, function(header) { %>\
				    <th>\
						<%= header.title %><br>\
						<small class="text-muted"><%= header.help %></small>\
					</th>\
				  <% }); %>\
		    		<th></th>\
		          </tr>\
		        </thead>\
				<tfoot>\
				  <tr>\
		            <th colspan="<%= (headers.length+1) %>"><button class="btn btn-primary pull-right" data-target="<%= repeaterId %>" type="button" data-action="add"><%= addLabel %></button></th>\
		          </tr>\
				</tfoot>\
				<tbody data-items>\
		        </tbody>\
		      </table>\
		    <div>\
		', null, Backbone.Form.templateSettings),
	
	);
	
	return Backbone;
	
})(this);*/