
var ProjectFormModule = (function () {
	
	var projectFormModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.newProject = new signals.Signal();
		
		//Create project model constructor
		//Add slash in the end to prevent django from redirecting
		var FormModel = Backbone.Model.extend({
			urlRoot :'/project/new',
			url: function() {
				var original_url = Backbone.Model.prototype.url.call( this );
			    var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) != '/' ? '/' : '' );
			    return parsed_url;
			}
		});
		
	    this.schemas = {};
	    
		this.onInitialized = function() {
			fu.msg.newProject.add(self.onNewproject);
		};
			
		this.onNewproject = function() {
			
			var title = "New project";
			model = new FormModel({
				width: 100000,
				height: 100000
			});
			
			//Create form attributes
			var formSchema = self.schemas.ProjectFormSchema;
			var form = new Backbone.BootstrapForm({
				model: model,
				schema: formSchema,
				fieldsets: [
				    ['name','width','height']
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
					label:"Create"
				}],
				{small:true}
			);
		}
		
		this.schemas.ProjectFormSchema = {
			name: {
				type: 'BootstrapText',
				validators: ['required'],
				help: 'Human readable identifier.'
			},
			width: {
				type:'BootstrapText',
				help: 'World width in meters (10000-10000000).',
				validators: [function validateWorldWidth(value, formValues) {
	                var err = {
	                	validateRatio: 'worldWidth',
	                    message: 'Must be an integer value between 10000-10000000.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^\d+$/)) return err;
	                
	                var intVal = parseInt(value);
	                if(intVal < 10000 || intVal > 10000000) return err;
	            }]
			},
			height: {
				type:'BootstrapText',
				help: 'World height in meters (10000-10000000).',
				validators: [function validateWorldHeight(value, formValues) {
	                var err = {
	                	validateRatio: 'worldHeight',
	                    message: 'Must be an integer value between 10000-10000000.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^\d+$/)) return err;
	                
	                var intVal = parseInt(value);
	                if(intVal < 10000 || intVal > 10000000) return err;
	            }]
			}
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return projectFormModule;
})();
fu.models['projectForm'] = new ProjectFormModule();