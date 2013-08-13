
var ResourceStyleModule = (function () {
	
	var resourceStyleModule = function() {
		
		var self = this;
		var selectedResource = null;
		
		//Create base model constructor for resource style
		//Add slash in the end to prevent django from redirecting
		var StyleModel = Backbone.Model.extend({
			urlRoot :'/resourcestyle',
			url: function() {
				var original_url = Backbone.Model.prototype.url.call( this );
			    var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) != '/' ? '/' : '' );
			    return parsed_url;
			}
		});
		
		this.schemas = {};
		
		//MESSAGES
		fu.msg.editResourceStyle = new signals.Signal();
	    
		this.onInitialized = function() {
			
			fu.msg.editResourceStyle.add(self.onEditResourceStyle);
			fu.msg.resourceSelected.add(self.onResourceSelected);
			
			//Trigger no-resource selected
			self.onResourceSelected(selectedResource);
		};
		
		this.onResourceSelected = function(resourceKey) {
			
			if(!resourceKey) {
				$('#main_menu_item_edit_resource_style').addClass("disabled");
			} else {
				$('#main_menu_item_edit_resource_style').removeClass("disabled");
			}
			
			selectedResource = resourceKey;
		}
		
		this.onEditResourceStyle = function() {
			
			if(!selectedResource) {
				alert("No resource is selected.");
				return
			}
			
			var title = "Edit resource style";
			var resourceKey = parseInt(selectedResource);
			model = new StyleModel({id:resourceKey});
			
			//Create form attributes
			var formSchema = self.schemas.ResourceStyleFormSchema;
			var initForm = function() {
				
				//Prevent additional sync calls - on save etc.
				if(this.on)
					this.off('sync');
				
				var form = new Backbone.BootstrapForm({
					model: model,
				    schema: formSchema,
				    fieldsets: [
				        ['form','color','borderColor']
				    ]
				}).render();
				
				//Create form, controls and callback functions
				fu.openModal(
					title,
					form.el, [{
						callback: function() {
							var errors = form.commit();
							if(!errors) {
								form.model.save({}, {
									success: function() {
										fu.closeModal();
										fu.msg.resourceChange.dispatch();
									},
									error: function() {
										alert("Could not save form - server error.");
									}
								});	
							}
						},
						label:"Save"
					}],
					{small:true}
				);
			};
			
			//Display form
			//Display directly if new resource or fetch data from server
			model.on('sync', initForm);
			model.fetch();
		};
		
		this.schemas.ResourceStyleFormSchema = {
			form: {
				type: 'BootstrapSelect',
				options: ['circle', 'cube', 'diamond', 'triangle']
			},
			color: {
				type:'BootstrapColorpicker',
				validators: [function validateColor(value, formValues) {
	                var err = {
	                	validateRatio: 'color',
	                    message: 'Not a valid hex color.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) return err;
	            }]
			},
			borderColor: {
				type:'BootstrapColorpicker',
				validators: [function validateBorderColor(value, formValues) {
	                var err = {
	                	validateRatio: 'borderColor',
	                	message: 'Not a valid hex color.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) return err;
	            }]
			}
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceStyleModule;
	
})();
fu.models['resourceStyle'] = new ResourceStyleModule();