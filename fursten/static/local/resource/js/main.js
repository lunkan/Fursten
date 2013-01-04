
var ResourceModule = (function () {
	
	var resourceModule = function() {
	
		//var resourceListModel = null;
		//var resourceListView = null;
		
		//var resourceFormModel = null;
		//var resourceFormView = null;
		
		//var resourceIconFormModel = null;
		//var resourceIconFormView = null;
		
		//var selectedResource = null;
		var that = this;
		var resourceList = new ResourceCollection();
		
		//MESSAGES
		/*fursten.msg.newResource = new signals.Signal();
		fursten.msg.extendResource = new signals.Signal();
		fursten.msg.editResource = new signals.Signal();
		fursten.msg.deleteResource = new signals.Signal();
		fursten.msg.editResourceIcon = new signals.Signal();
		fursten.msg.selectedResourceChanged = new signals.Signal();
		fursten.msg.resourceChanged = new signals.Signal();
		fursten.msg.exportResources = new signals.Signal();
		fursten.msg.importResources = new signals.Signal();*/
		
		/*var ResourceForm = function(title, ajaxUrl, element) {
			
			resourceFormModel = new JNode.EntityModel({url:ajaxUrl, name:"resource-form"});
			resourceFormView = new JNode.FormView({el:element, model: resourceFormModel});
			
			fursten.msg.openDialog.dispatch("resource-form", element);
			resourceFormModel.fetch();
			
			resourceFormModel.bind("form-canceled", function() {
				fursten.msg.closeDialog.dispatch("resource-form", {canceled:false, type:"cancel"});
			});
			
			resourceFormModel.bind("form-saved", function() {
				fursten.msg.resourceChanged.dispatch();
				fursten.msg.closeDialog.dispatch("resource-form");
			});

			resourceFormModel.bind("form-saved-failed", function() {
				alert("Failed Save resource");
			});
		};*/
		
		/*var ResourceIconForm = function(title, ajaxUrl, element) {
			
			resourceIconFormModel = new JNode.EntityModel({url:ajaxUrl, name:"resource-icon-form"});
			resourceIconFormView = new JNode.FormView({el:element, model: resourceIconFormModel});
			
			fursten.msg.openDialog.dispatch("resource-icon-form", element);
			resourceIconFormModel.fetch();
			
			resourceIconFormModel.bind("form-canceled", function() {
				fursten.msg.closeDialog.dispatch("resource-icon-form", {canceled:false, type:"cancel"});
			});
			
			resourceIconFormModel.bind("form-saved", function() {
				fursten.msg.resourceChanged.dispatch();
				fursten.msg.closeDialog.dispatch("resource-icon-form");
			});

			resourceIconFormModel.bind("form-saved-failed", function() {
				alert("Failed Save resource");
			});
		};*/
		
		this.onJQueryReady = function() {
			
			//$('#resource-list-block')
			
			/*var elm = $('#resource-list-block');
			var $('#tabel')*/
			
			//var element = document.getElementById('resource-list-block');
			//var templ = document.getElementById('tabel');
			
			//alert($('#table').html());
			//var temp = _.template($('#table').html());
			//alert(temp({a:'b'}));
			/*var ResourceListView = Backbone.View.extend({
			    
				template: _.template($('#table').html()),
				el: $('#resource-list-block'),

			    initialize: function () {
			    	//alert("epa");
			    	//this.model.bind('change', this.render, this);
			    	//_.bindAll(this, 'render');
			    	this.render();
			    },
			    render : function() {
			    	
			    	$(this.el).html(this.template({id:'id'}));
			    	
			    	//alert("opa");
			    	//var that = this;
			        //$(this.el).empty();
			     
			        // Render each sub-view and append it to the parent view's element.
			        //_(this._donutViews).each(function(dv) {
			        //  $(that.el).append(dv.render().el);
			        //});
			    }
			})*/
			
			var resourceListView = new Views.ResourceListView({
				collection: resourceList,
				el: $('#resource-list-block')
			});
			
			var user = new User();

			var form = new Backbone.Form({
			    model: user
			}).render();

			//$('#resource-list-block').append(form.el);
			
			
			//RESOURCE LIST
			/*var action = ""
				
				fursten.getBaseUrl().'/resource	
			
			if(window.location.port)
				action = window.location.protocol + "//" + document.domain + ":" + window.location.port + '/ajax/resource-list.json';
			else
				action = window.location.protocol + "//" + document.domain + '/ajax/resource-list.json';
			
			resourceListModel = new JNode.EntityModel({url:action, name:"resource-list-item"});
			resourceListView = new JNode.TableView({
				el:$("#resourcelist"),
				model: resourceListModel
			});*/
		};
		
		this.onInitialized = function() {
			
			resourceList.fetch();
			
			/*var element = resourceListView.el;
			resourceListModel.bind('updated', function() {
				element.find('.table .node.resource-list-item').click( function(e) {
					var resourceKey = $(this).attr("data-key");
					fursten.modules.resource.setSelectedResource(resourceKey);
				});
			});
			
			resourceListModel.fetch();
			that.setSelectedResource(null);*/
		};
		
		/*this.getSelectedResource = function() {
	    	return this.selectedResource;
	    };
	    
	    this.setSelectedResource = function(resourceKey) {
	    	this.selectedResource = resourceKey;
	    	fursten.msg.selectedResourceChanged.dispatch();
	    };
	    
	    this.onSelectedResourceChanged = function() {
	    	$('#resourcelist .selected').each(function() {
	    		$(this).removeClass('selected');
	    	});
	    	
			if(that.selectedResource) {
	    		$('div[data-key='+that.selectedResource+']').first().addClass('selected');
	    		fursten.modules.mainMenu.enableMenuItem(["edit-resource-icon", "extend-resource","delete-resource","edit-resource","edit-resource-style"]);
	    	}
	    	else {
	    		$("#menu-option-edit .extend-resource").addClass('disabled');
	    		fursten.modules.mainMenu.disableMenuItem(["edit-resource-icon","extend-resource","delete-resource","edit-resource","edit-resource-style"]);
	    	}
	    };
	    
		this.onNewResource = function() {
			var element = $("<div class='popup' id='resourceform'></div>");
			var url = '/ajax/resource-form.json?method=10&key=0';
			ResourceForm("New Resource", url, element);
		};
		
		this.onExtendResource = function() {
			if(that.selectedResource) {
				var element = $("<div class='popup' id='resourceform'></div>");
				var url = '/ajax/resource-form.json?method=10&key=' + that.selectedResource;
				ResourceForm("New Resource", url, element);
			}
		};
		
		this.onEditResource = function() {
			if(that.selectedResource) {
				var element = $("<div class='popup' id='resourceform'></div>");
				var url = '/ajax/resource-form.json?method=11&key='+that.selectedResource;
				ResourceForm("Edit Resource", url, element);
			}
		};
		
		this.onDeletedResource = function() {
			
			if(that.selectedResource) {
				
				var action = ""
				if(window.location.port)
					action = window.location.protocol + "//" + document.domain + ":" + window.location.port + '/ajax/resource-delete.json';
				else
					action = window.location.protocol + "//" + document.domain + '/ajax/resource-delete.json';
    			
				var data = {};
				data['resource-key'] = that.selectedResource;
				data = JSON.stringify(data);
				
    			var postObj = {};
    			postObj['resource-delete'] = data;
    			        
				$.post(action, postObj, function(msg){
    				if(msg.error){
    					alert('ERROR DELETE');
    				}
    				else {
    					fursten.msg.resourceChanged.dispatch();
    					$("#as-map").get(0).cleanRefresh();
    				}
    			});
			}
		};
		
		this.onEditResourceIcon = function() {
			
			if(that.selectedResource) {
				var element = $("<div class='popup' id='resourceiconform'></div>");
				var url = '/ajax/resource-icon-form.json?key='+that.selectedResource;
				ResourceIconForm("Edit resource icon", url, element);
			}
		}
		
		this.onResourceChanged = function() {
			
			$('#resource-css').each(function () {
				this.disabled = true;
				
				var queryString = '?reload=' + new Date().getTime();
				this.href = this.href.replace(/\?.*|$/, queryString);
				
				this.disabled = false;
			});
			
			resourceListModel.fetch();
			
			//Can not get css update to work
			//window.location.reload();
		};
		
		this.onExportResources = function() {
			
			$("#file-loader-container").html("");
			$("#file-loader-container").append("<iframe src='/api/resources.proto'></iframe>");
		};
		
		this.onImportResources = function() {
			
			var redirectUrl = encodeURIComponent("http://localhost:8888/dashboard.html");
			
			var args = {
				method: "POST",
				enctype: "multipart/form-data",
				accept: "binary/proto",
				title: "Import resources",
				message: "Observe that recources sharing same key will be overwritten! Only files downloded with 'export nodes' option - ending with .proto may be uploaded.",
				action: "/api/resources?location=" + redirectUrl,
				label: "Resource data-file"
			};
			
			var dialogTemplate = _.template($('#q-browse-file-dialog-tpl').html());
			var dialogElement = $(dialogTemplate(args));
			fursten.msg.openDialog.dispatch("import-resources-form", dialogElement);
		
			dialogElement.find(".cancel").click(function () {
				fursten.msg.closeDialog.dispatch("import-resources-form", {canceled:false, type:"confirmed"});
			});
		};
		
		this.onCloseDialog = function(id, arg) {
		
			if(id == "resource-form" && arg) {
				
				//alert("isChanged " + resourceFormModel.isChanged());
				if(arg.type == "cancel") {
					arg.canceled = true;
					fursten.msg.openAlert.dispatch("resource-form-alert", {
						id:"resource-form-alert",
						type:"info",
						title:"",
						msg:"Are you sure you like to cancel? All changes will be lost!",
						actions: [
						   {label:"No", callback: function() {
							   fursten.msg.closeAlert.dispatch("resource-form-alert");
						   }},
						   {label:"Yes", callback: function() {
							   fursten.msg.closeAlert.dispatch("resource-form-alert");
							   fursten.msg.closeDialog.dispatch(id, {canceled:false, type:"confirmed"});
						   }},
						]	
					});
				}
			}
			else if(id == "resource-icon-form" && arg) {
				
				//alert("isChanged " + resourceFormModel.isChanged());
				if(arg.type == "cancel") {
					arg.canceled = true;
					fursten.msg.openAlert.dispatch("resource-icon-form-alert", {
						id:"resource-icon-form-alert",
						type:"info",
						title:"",
						msg:"Are you sure you like to cancel? All changes will be lost!",
						actions: [
						   {label:"No", callback: function() {
							   fursten.msg.closeAlert.dispatch("resource-icon-form-alert");
						   }},
						   {label:"Yes", callback: function() {
							   fursten.msg.closeAlert.dispatch("resource-icon-form-alert");
							   fursten.msg.closeDialog.dispatch(id, {canceled:false, type:"confirmed"});
						   }},
						]	
					});
				}
			}
		};*/
		
		//SUBSCRIBE TO MESSAGES
		fursten.msg.jQueryReady.add(this.onJQueryReady);
		fursten.msg.initialized.add(this.onInitialized);
		/*fursten.msg.newResource.add(this.onNewResource);
		fursten.msg.extendResource.add(this.onExtendResource);
		fursten.msg.editResource.add(this.onEditResource);
		fursten.msg.deleteResource.add(this.onDeletedResource);
		fursten.msg.selectedResourceChanged.add(this.onSelectedResourceChanged);
		fursten.msg.resourceChanged.add(this.onResourceChanged);
		fursten.msg.exportResources.add(this.onExportResources);
		fursten.msg.importResources.add(this.onImportResources);
		fursten.msg.closeDialog.add(this.onCloseDialog);
		fursten.msg.newProjectComplete.add(this.onResourceChanged);
		fursten.msg.editResourceIcon.add(this.onEditResourceIcon);*/
	}
	
	return resourceModule;
})();

fursten.models['resource'] = new ResourceModule();