﻿
var SupplierUnbrand = undefined; // 整个供方编辑对象

jQuery(document).ready(function() {

	SupplierUnbrand = new (function(){

		// 供方详细信息
		this.supplierDatas = {
			contacts : [
				{
					area : '厦门',
					person : '吴慧慧',
					phone : '0592-1234567',
					Email : 'wuhuihui@qq.com'
				},{
					area : '福州',
					person : '吴是慧慧',
					phone : '05952-1234567',
					Email : 'wuhu订单ihui@qq.com'
				}
			]
			,agentBrand : [
				{
					name : '上海三菱',
					grade : '一级',
					area : '福建'
				},{
					name : '三洋电器',
					grade : '二级',
					area : '上海'
				}
			]
		};

		// 供方详细信息
		this.labelDatas = {
			agentBrand : [
				{
					label : '品牌名称',
					field : 'name',
					tpl : 'tpl_4_5_7'
				},{
					label : '代理等级',
					field : 'grade',
					tpl : 'tpl_4_5_7'
				},{
					label : '经营区域',
					field : 'area',
					tpl : 'tpl_4_5_7'
				}
			]
			,contacts : [
				{
					label : '地区',
					field : 'area',
					tpl	: 'tpl_6_4_8'
				},{
					label : '联系人',
					field : 'person',
					tpl	: 'tpl_6_4_8'
				},{
					label : '电话',
					field : 'phone',
					tpl	: 'tpl_6_4_8'
				},{
					label : 'Email',
					field : 'Email',
					tpl	: 'tpl_6_4_8'
				}
			]
		};

		// 模板名值对模板
		this.templateString = {
			tpl_4_5_7 : '<div class = "col-sm-4"> <div class = "form-group"> <label class = "col-sm-5 control-label" >{{label}}：</label> <div class="col-sm-7"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_4_6_6 : '<div class = "col-sm-4"> <div class = "form-group"> <label class = "col-sm-6 control-label" >{{label}}：</label> <div class="col-sm-6"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_6_4_8 : '<div class = "col-sm-6"> <div class = "form-group"> <label class = "col-sm-4 control-label" >{{label}}：</label> <div class="col-sm-8"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
			,tpl_12_2_10 : '<div class = "col-sm-12"> <div class = "form-group"> <label class = "col-sm-2 control-label" >{{label}}：</label> <div class="col-sm-10"> <input type="text" value="{{value}}" class="form-control form-only-show" disabled /> </div> </div> </div>'
		};

		// 创建一个名值元素
		this._createLabelElement = function(labelItem, value){
			return TemplateEngine(this.templateString[labelItem.tpl], {label: labelItem.label, value: value});
		}

		// 创建一行记录
		this._createRowElement = function(labels, data){
			var self = this;
			var element, result = [];
			for(var i = 0, j = labels.length; i < j; i++){
				var labelItem = labels[i];
				element = self._createLabelElement(labelItem, data[labelItem.field]);
				result.push(element);
			}

			var panelBody = $('<div class="panel-body"></div>');
			var row = $('<div class="row form-horizontal"></div>');
			row.html(result.join('')).appendTo(panelBody);
			
			result.length = 0;
			data.element = panelBody[0]; 		// data 引用到元素上
			panelBody.data("rowDatas", data); 	// 绑定数据到元素上:rowDatas
			return panelBody;
		}

		// 显示一行记录
		this._appendRowElement = function(panelId, rowElement){
			rowElement.hide();
			$(panelId).prepend(rowElement);
			rowElement.slideDown(800);
		}

		// 显示数据信息
		this._panelShowDatas = function (labels, datas, panelId, callBack) {
			var self = this;
			$.each(datas, function(m, data){
				var panelBody = self._createRowElement(labels, data);
				self._appendRowElement(panelId, panelBody);
			});

			(callBack || jQuery.noop).call(this); //回调
		};
		

		this.createEdit = function(type){

			return this[type + "Instance"] = {

				supplier : this,

				// 创建联系方式数据
				show : function(panelId){
					var supplier = this.supplier;
					supplier._panelShowDatas(
						supplier.labelDatas[type], 
						supplier.supplierDatas[type], 
						panelId,
						function(){
							console.info('Added and show Rows!');
						}
					);
					return this;
				},

				// 添加联系方式数据
				add : function(data, isAppend){
					var supplier = this.supplier;
					supplier.supplierDatas[type].push(data);
					isAppend && this._addElement(data); // 添加元素
					return data;
				},

					// 添加元素
					_addElement : function(data){
						var supplier = this.supplier;
						var panelBody = supplier._createRowElement(
							supplier.labelDatas[type], 
							data
						);
						supplier._appendRowElement("#panelContact", panelBody);
						return data;
					},


				// 删除联系方式数据
				remove : function(data, isRemove){
					var self = this;
					var itemDatas = this.supplier.supplierDatas;
					jQuery.each(itemDatas[type], function(i,item){
						if(item === data){
							itemDatas[type].splice(i,1);
							isRemove && self._removeElement(data);
							data.element = null;
							return data;
						}
					});
					return false;
				},

					// 删除元素
					_removeElement : function(data){
						$(data.element).fadeTo(400,0).slideUp(400,function(){
							$(this).remove();
						});
					},


				// 更新联系方式数据
				update : function(oldData, newData, isUpdate){
					jQuery.extend(oldData, newData);
					isUpdate && this._updateElement(oldData);
					return oldData;
				},

					// 更新元素
					_updateElement : function(newData){
						var oldElement = newData.element;
						var supplier = this.supplier;
						var newElement = supplier._createRowElement(
							supplier.labelDatas[type], 
							newData
						);
						$(oldElement).replaceWith(newElement);
						return newElement;
					}
			}
		}

		// 初始化
		this.init = function(param){
			
		}
		 
	})();


	/* ===================================== */

	SupplierUnbrand.init({

	});


	// 联系方式
	var contactInstance = SupplierUnbrand.createEdit('contacts');
	contactInstance.show('#panelContact'); // 创建联系方式
	new BindEdit({
		dataObj :  contactInstance
		,rowPanelId : '#panelContact'
		,operateElement :  {
			 add    : '#addConcatButton'
			,edit   : '#editConcatButton'
			,remove : '#removeConcatButton'
		}
	});



	// 代理品牌
	var agentBrandInstance = SupplierUnbrand.createEdit('agentBrand');
	agentBrandInstance.show('#panelAgentBrand'); // 创建代理品牌
	new BindEdit({
		dataObj :  agentBrandInstance
		,rowPanelId : '#panelAgentBrand'
		,modalWidth : 400
		,operateElement :  {
			 add    : '#addAgentBrandButton'
			,edit   : '#editAgentBrandButton'
			,remove : '#removeAgentBrandButton'
		}
	});

	

	// 绑定编辑功能
	function BindEdit(opts){

		this.opts = {
			 modalId : '#ajax-modal-dialog'
			,modalWidth : 650
			// ,dataObj :  SupplierUnbrand.contacts
			// ,rowPanelId : '#panelContact'
			// ,operateElement :  {
			// 	 add    : '#addConcatButton'
			// 	,edit   : '#editConcatButton'
			// 	,remove : '#removeConcatButton'
			// }
		}
		$.extend(this.opts, opts);

		var self = this;
		var operateElement = this.opts.operateElement;

		this.$modal = $(this.opts.modalId);
		this.currentItem = undefined; // 当前选中的项
		

		// 点击修改按钮
	    $(operateElement.add).click(function(){
	    	self.addItem($(this).data('modal-url'));
	    });

	    // 点击修改按钮
	    $(operateElement.edit).click(function(){
	    	self.eidtItem($(this).data('modal-url'));
	    });

	    // 点击删除按钮
	    $(operateElement.remove).click(function(){
	    	self.removeItem();
	    });
	    
	    // 选择数据
	    $(this.opts.rowPanelId).on('click','.panel-body',function(){
	    	if($(this).hasClass('checked')){
	    		$(this).removeClass('checked');
	    		self.currentItem = undefined;
	    	}else{
	    		$(this).addClass('checked').siblings('.panel-body').removeClass('checked');
	    		self.currentItem = $(this).data('rowDatas');
	    	}
	    });
	}

	// 新增
	BindEdit.prototype.addItem = function(modalUrl){
		var self = this;
		this.$modal.load(modalUrl, '', function() {
		    self.$modal.modal({width: self.opts.modalWidth});
		    bindSubmit('add'); // 绑定提交为新增方法
		});
	}

	// 修改
	BindEdit.prototype.eidtItem = function(modalUrl){
		var self = this;
		if(this.currentItem){
	        this.$modal.load(modalUrl, '', function() {
	            self.$modal.modal({width: self.opts.modalWidth});
	            FormData.load('#modalForm', self.currentItem);
	            bindSubmit('update', self.currentItem); // 绑定提交为修改方法
	        });
    	}else{
		    notifyInfo({text:'请选择要修改的项目！'})
    	}
	}

	// 删除
	BindEdit.prototype.removeItem = function(){
		if(this.currentItem){
    		this.opts.dataObj.remove(this.currentItem, true);
    		this.currentItem = undefined;
    	}else{
		    notifyInfo({text:'请选择要删除的项目！'})
    	}
	}


	// 移除rowBling类，保证下次动画显示
	$('select-able-row').on('webkitAnimationEnd msAnimationEnd animationend','.panel-body',function(){
		$(this).removeClass('rowBling');
	});


});



