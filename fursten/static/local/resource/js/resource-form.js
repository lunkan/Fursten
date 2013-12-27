
var ResourceFormModule = (function () {
	
	var resourceFormModule = function() {
		
		var self = this;
		var selectedResource = null;
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.extendResource = new signals.Signal();
		fu.msg.editResource = new signals.Signal();
	    fu.msg.deleteResource = new signals.Signal();
	    fu.msg.resourceChange = new signals.Signal();
	    
		//Create base model constructor for resource forms
		//Add slash in the end to prevent django from redirecting
		var FormModel = Backbone.Model.extend({
			idAttribute: 'key',
			urlRoot :'/resource',
			url: function() {
				var original_url = Backbone.Model.prototype.url.call( this );
			    var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) != '/' ? '/' : '' );
			    return parsed_url;
			},
			defaults: {
				mortality:0.0,
				threshold:0.5,
				speed:2.0
			}
		});
		
	    this.schemas = {};
	    
		this.onInitialized = function() {
			fu.msg.newResource.add(self.onNewResource);
			fu.msg.extendResource.add(self.onExtendResource);
			fu.msg.editResource.add(self.onEditResource);
			fu.msg.deleteResource.add(self.onDeleteResource);
			fu.msg.resourceSelected.add(self.onResourceSelected);
			
			//Trigger no-resource selected
			self.onResourceSelected(selectedResource);
		};
		
		this.onNewResource = function() {
			self.createResourceForm("New root resource", null, false);
		};
		
		this.onExtendResource = function() {
			if(selectedResource) {
				//self.createResourceForm("Extend resource", null, selectedResource);
				self.createResourceForm("Extend resource", selectedResource, true);
			} else {
				alert("No resource is selected.");
			}
		};
		
		this.onEditResource = function() {
			if(selectedResource) {
				self.createResourceForm("Edit resource", selectedResource, false);
			} else {
				alert("No resource is selected.");
			}
		};
		
		this.onDeleteResource = function() {
	    	
	    	if(selectedResource) {
	    		var model = new FormModel({key:selectedResource});
	    		model.destroy({
	    			success: function() {
	    				fu.msg.resourceChange.dispatch();
	    			},
	    			error: function() {
	    				alert("could not delete resource -server error");
	    			}
	    		});
			} else {
				alert("No resource is selected.");
			}
	    };
	    
		this.createResourceForm = function(formTitle, resourceKey, extendedResource) {
			
			var title = '<img src="/resourcestyle/'+ resourceKey +'/symbol/64/"/>&nbsp;&nbsp;&nbsp;' + formTitle;
			var model;
			var extend = extendedResource;
			model = new FormModel({key:resourceKey});
			
			
			//Create form attributes
			var formSchema = self.schemas.ResourceFormSchema;
			var initForm = function() {
				
				//Prevent additional sync calls - on save etc.
				if(this.on)
					this.off('sync');
				
				//Extend resource by loaded as edit but saved as extended child
				if(extend) {
					model.urlRoot = '/resource/' +  model.get("key");
					model.set("name", "Extended " + model.get("name"));
					model.set("key", null);
				}
				
				var form = new Backbone.BootstrapForm({
					model: model,
				    schema: formSchema,
				    fieldsets: [
				        ['name','isLocked','mortality','threshold','speed'],
						{ legend: 'Weights', fields: ['weightGroups'] },
				        { legend: 'Offsprings', fields: ['offsprings', 'mutations'] }
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
					{large:true}
				);
			};
			
			//Display form
			//Display directly if new resource or fetch data from server
			if(!resourceKey) {
				initForm();
			} else {
				model.on('sync', initForm);
				model.fetch();
			}
		};
	    
		this.onResourceSelected = function(resourceKey) {
			
			if(!resourceKey) {
				$('#main_menu_item_delete_resource').addClass("disabled");
				$('#main_menu_item_extend_resource').addClass("disabled");
				$('#main_menu_item_edit_resource').addClass("disabled");
			}
			else {
				$('#main_menu_item_delete_resource').removeClass("disabled");
				$('#main_menu_item_extend_resource').removeClass("disabled");
				$('#main_menu_item_edit_resource').removeClass("disabled");
			}
			
			selectedResource = resourceKey;
		}

		this.schemas.ResourceFormSchema = {
			isLocked: {
				type:'Checkbox',
				help: 'Locked resources will not be updated by the simulator, but they will stay visible for other nodes.'
			},
			name: {
				type:'BootstrapText',
				validators:['required'],
				help: 'Human readable identifier.'
			},
			mortality: {
				type:'BootstrapText',
				validators: [function validateMortality(value, formValues) {
	                var err = {
	                	type: 'mortality',
	                    message: 'Must be a decimal number between 0.0 and 1.0.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
	                
	                var floatVal = parseFloat(value);
	                if(floatVal < 0 || floatVal > 1) return err;
	            }],
				help: 'Chance of sudden decline (per tick). Value between 0-1 where 0.5 equals 50%. If the event is triggered the effected node will have a reduced value of 1. Value lower than 1 will lead to extinction.'
			},
			threshold: {
				type:'BootstrapText',
				validators: [function thresholdMortality(value, formValues) {
					var err = {
	                	type: 'threshold',
	                    message: 'Must be a number greater than 0.1.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
	                
	                var floatVal = parseFloat(value);
	                if(floatVal < 0.1) return err;
	            }],
				help: 'Dwell penalty. A resource must have an impact value higher than threshold in order to settle. The threshold value does not effect the resource tendency to extinction by negativ impact, which triggers at impact values <= 0. The simulator runs more stable with higher thresholds. Threshold scales with value so value 10 gives a threshold value x10 higher.'
			},
			speed: {
				type:'BootstrapText',
				validators: [function validateSpeed(value, formValues) {
	                var err = {
	                	type: 'speed',
	                    message: 'Must be a decimal number greater or equal to 0.0.'
	                };
	                
	                if(value === null) return err;
	                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
	                
	                var floatVal = parseFloat(value);
	                if(floatVal < 0.0) return err;
	            }],
				help: 'The speed in which the resource is traveling as a spore, where a value of 1.0 equals 1 base distance (node radius). Higher value allows the resource to settle down futher away from its source.'
			},
			weightGroups: {
				type: 'BootstrapRepeater',
				layout:'vertical',
				help: 'The weight group with the lowest value will determin the resource final stability.',
				model: Backbone.Model.extend({
					schema: {
						weights: {
							type: 'BootstrapRepeater',
							min:1,
							help: 'All weights are summed. Resources may be referenced multiple times.',
							colgroups: { resource:'50%', value:'50%' },
							model: Backbone.Model.extend({
								defaults: {
									value:1
								},
							    schema: {
							    	resource: {
							    		type: 'BootstrapAutocompleteResource',
							    		validators:['required'],
							    		help:'Resource and children are effected.',
							    		options: {
							    			url:'/resource'
							    		}
							    	},
									value: {
										type:'BootstrapText',
										help:'Value at zero distance.',
										validators: [function weightValueMortality(value, formValues) {
											var err = {
							                	type: 'weightValue',
							                    message: 'Must be a number greater or lower than 0.'
							                };
							                
							                if(value === null) return err;
							                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
							                
							                var floatVal = parseFloat(value);
							                if(floatVal == 0) return err;
							            }]
									}
							    }
							})
						}
					}
				})
			},
			offsprings: {
				type: 'BootstrapRepeater',
				max:1,
				help: 'Resource abilty to spread offspings of the same resource type.',
				colgroups: { ratio:'25%', cost:'25%', multiplier:'25%',isLinked:'25%' },
				model: Backbone.Model.extend({
					defaults: {
						multiplier: 1.0,
						ratio: 0.01,
						cost: 0
				    },
				    schema: {
				    	ratio: {
				    		type: 'BootstrapText',
				    		help: 'Chance per tick. 0.1 = 10%.',
				    		validators: [function validateRatio(value, formValues) {
				                var err = {
				                	validateRatio: 'ratio',
				                    message: 'Must be a decimal number greater than 0 and less or equal to 1.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal <= 0 || floatVal > 1) return err;
				            }]
				    	},
				        cost: {
				        	type: 'BootstrapText',
				        	help: 'Value decrease per offspring (1=100%). If value will deceed 1 - no offspring is created.',
				        	validators: [function validateCost(value, formValues) {
				                var err = {
				                	type: 'cost',
				                    message: 'Must be a decimal number between 0.0 and 1.0.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal < 0 || floatVal > 1) return err;
				            }]
				        },
				        multiplier: {
				        	type: 'BootstrapText',
				        	help: 'Offsprings initial value as share of parent value (1=100%).',
				        	validators: [function validateMultiplier(value, formValues) {
				                var err = {
				                	type: 'multiplier',
				                    message: 'Must be a decimal number greater than 0.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal < 0) return err;
				            }]
				        },
				        isLinked: {
				        	type: 'BootstrapCheckbox',
				        	help: 'Linked offsprings are decrease with parents in relation of the multiplier.'
				        }
				    }
				})
		    },
		    mutations: {
		    	type: 'BootstrapRepeater',
		    	help: 'Resource abilty to spread offspings with diffrent resource type.',
		    	colgroups: { resource:'20%', ratio:'20%', cost:'20%', multiplier:'20%',isLinked:'20%' },
				model: Backbone.Model.extend({
					defaults: {
						multiplier: 1.0,
						ratio: 0.01,
						cost: 0
				    },
				    schema: {
				    	resource: {
				    		type: 'BootstrapAutocompleteResource',
				    		options: {url:'/resource'},
				    		help:'Resource reference.',
				    		validators:['required']
				    	},
				    	ratio: {
				    		type: 'BootstrapText',
				    		help: 'Chance per tick. 0.1 = 10%.',
				    		validators: [function validateMutaionRatio(value, formValues) {
				                var err = {
				                	validateRatio: 'mutationRatio',
				                    message: 'Must be a decimal number greater than 0 and less or equal to 1.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal <= 0 || floatVal > 1) return err;
				            }],
				    	},
				        cost: {
				        	type: 'BootstrapText',
				        	help: 'Value decrease per offspring (1=100%). If value will deceed 1 - no offspring is created.',
				        	validators: [function validateMutationCost(value, formValues) {
				                var err = {
				                	type: 'mutationCost',
				                    message: 'Must be a decimal number between 0.0 and 1.0.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal < 0 || floatVal > 1) return err;
				            }]
				        },
				        multiplier: {
				        	type: 'BootstrapText',
				        	help: 'Offsprings initial value as share of parent value (1=100%).',
				        	validators: [function validateMutationMultiplier(value, formValues) {
				                var err = {
				                	type: 'mutationMultiplier',
				                    message: 'Must be a decimal number greater than 0.'
				                };
				                
				                if(value === null) return err;
				                else if(!value.toString().match(/^-*[0-9\.]+$/)) return err;
				                
				                var floatVal = parseFloat(value);
				                if(floatVal < 0) return err;
				            }]
				        },
				        isLinked: {
				        	type: 'BootstrapCheckbox',
				        	help: 'Linked offsprings are decrease with parents in relation of the multiplier.'
				        }
				    }
				})
		    }
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceFormModule;
})();
fu.models['resourceForm'] = new ResourceFormModule();