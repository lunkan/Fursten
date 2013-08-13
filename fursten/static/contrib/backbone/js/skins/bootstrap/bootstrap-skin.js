
var BootstrapForm = Backbone.Form.extend(null, {

  //STATICS
  template: _.template('\
    <form data-fieldsets class="bootstrap-form"></form>\
  ', null, this.templateSettings),

  templateSettings: {
    evaluate: /<%([\s\S]+?)%>/g, 
    interpolate: /<%=([\s\S]+?)%>/g, 
    escape: /<%-([\s\S]+?)%>/g
  },

  editors: {}

});

BootstrapForm.Fieldset = Backbone.Form.Fieldset.extend(null, {
  template: _.template('\
    <fieldset class="bootstrap-fieldset" data-fields>\
      <% if (legend) { %>\
        <legend><%= legend %></legend>\
      <% } %>\
    </fieldset>\
  ', null, Backbone.Form.templateSettings)

});

BootstrapForm.Field = Backbone.Form.Field.extend(null, {
	template: _.template('\
	  <div class="form-group">\
	    <label for="<%= editorId %>"><%= title %></label>\
		<div class="help-block">\
		  <span id="error-<%= editorId %>" data-error class="text-danger"></span>\
		  <small class="text-muted"><%= help %></small>\
		</div>\
	    <div data-editor></div>\
	  </div>\
	', null, Backbone.Form.templateSettings),
	
	errorClassName: 'has-error'
});

Backbone.Form.editors.BootstrapText = Backbone.Form.editors.Text.extend({
  attributes: {'class':'form-control'}
});

Backbone.Form.editors.BootstrapCheckbox = Backbone.Form.editors.Checkbox.extend({
  attributes: {'class':'form-control'}
});

Backbone.Form.editors.BootstrapNumber = Backbone.Form.editors.Number.extend({
  attributes: {'class':'form-control'}
});

Backbone.Form.editors.BootstrapSelect = Backbone.Form.editors.Select.extend({
  attributes: {'class':'form-control'}
});

//Exports
Backbone.BootstrapForm = BootstrapForm;
