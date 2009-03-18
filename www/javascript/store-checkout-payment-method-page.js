function StoreCheckoutPaymentMethodPage(id, inception_date_ids,
	issue_number_ids, card_ids)
{
	this.id = id;
	this.card_ids = card_ids;
	this.container = document.getElementById('payment_method_form');
	this.card_container = document.getElementById('card_container');
	this.account_fields_container =
		document.getElementById('account_fields_container');

	this.list_new = document.getElementById('payment_method_list_new');
	this.inception_date_types = [];
	this.issue_number_types = [];
	this.card_types = [];

	// set up event handlers for payment methods
	var payment_methods = document.getElementsByName('payment_method_list');
	for (var i = 0; i < payment_methods.length; i++) {
		YAHOO.util.Event.on(payment_methods[i], 'click',
			this.handlePaymentMethodClick, this, true);
	}

	// set up event handlers for payment types
	var payment_types = document.getElementsByName('payment_type');
	for (var i = 0; i < payment_types.length; i++) {
		YAHOO.util.Event.on(payment_types[i], 'click',
			this.handlePaymentTypeClick, this, true);
	}

	for (var i = 0; i < inception_date_ids.length; i++) {
		var type = document.getElementById(
			'payment_type_' + inception_date_ids[i]);

		if (type) {
			this.inception_date_types.push(type);
		}
	}

	for (var i = 0; i < issue_number_ids.length; i++) {
		var type = document.getElementById(
			'payment_type_' + issue_number_ids[i]);

		if (type) {
			this.issue_number_types.push(type);
		}
	}

	for (var i = 0; i < card_ids.length; i++) {
		var type = document.getElementById(
			'payment_type_' + card_ids[i]);

		if (type) {
			this.card_types.push(type);
		}
	}

	this.fields = [
		'payment_type',
		'card_type',
		'card_number',
		'card_verification_value',
		'card_issue_number',
		'card_expiry_month',
		'card_expiry_year',
		'card_inception_month',
		'card_inception_year',
		'card_fullname',
		'save_account_payment_method'
	];

	this.card_fields = [
		'card_type',
		'card_number',
		'card_verification_value',
		'card_issue_number',
		'card_expiry_month',
		'card_expiry_year',
		'card_inception_month',
		'card_inception_year',
		'card_fullname',
		'save_account_payment_method'
	];

	this.inception_date_fields = [
		'card_inception_month',
		'card_inception_year'
	];

	this.issue_number_fields = [
		'card_issue_number'
	];

	this.account_fields = [
		'account_card_verification_value'
	];

	var payment_type_options =
		document.getElementsByName('payment_type');

	for (var i = 0; i < payment_type_options.length; i++)
		this.fields.push(payment_type_options[i].id);

	this.updateFields();
}

StoreCheckoutPaymentMethodPage.prototype.handlePaymentMethodClick = function(e)
{
	this.updateFields();
}

StoreCheckoutPaymentMethodPage.prototype.handlePaymentTypeClick = function(e)
{
	this.updateFields();
}

StoreCheckoutPaymentMethodPage.prototype.updateFields = function()
{
	if (!this.isSensitive()) {
		this.desensitize();
		this.sensitizeAccountFields();
		return;
	}

	this.sensitize();
	this.desensitizeAccountFields();

	if (!this.isCardSensitive()) {
		this.desensitizeCard();
		return;
	}

	this.sensitizeCard();

	if (this.isInceptionDateSensitive())
		this.sensitizeInceptionDate();
	else
		this.desensitizeInceptionDate();

	if (this.isIssueNumberSensitive())
		this.sensitizeIssueNumber();
	else
		this.desensitizeIssueNumber();
}

// payment method fields

StoreCheckoutPaymentMethodPage.prototype.isSensitive = function()
{
	var sensitive = true;
	if (this.list_new)
		sensitive = this.list_new.checked;

	return sensitive;
}

StoreCheckoutPaymentMethodPage.prototype.sensitize = function()
{
	if (this.container)
		YAHOO.util.Dom.removeClass(this.container, 'swat-insensitive');

	StoreCheckoutPage_sensitizeFields(this.fields);
}

StoreCheckoutPaymentMethodPage.prototype.desensitize = function()
{
	if (this.container)
		YAHOO.util.Dom.addClass(this.container, 'swat-insensitive');

	StoreCheckoutPage_desensitizeFields(this.fields);
}

// account card verification number

StoreCheckoutPaymentMethodPage.prototype.sensitizeAccountFields = function()
{
	if (this.account_fields_container)
		YAHOO.util.Dom.removeClass(this.account_fields_container,
			'swat-insensitive');

	StoreCheckoutPage_sensitizeFields(this.account_fields);
}

StoreCheckoutPaymentMethodPage.prototype.desensitizeAccountFields = function()
{
	if (this.account_fields_container)
		YAHOO.util.Dom.addClass(this.account_fields_container,
			'swat-insensitive');

	StoreCheckoutPage_desensitizeFields(this.account_fields);
}

// card fields

StoreCheckoutPaymentMethodPage.prototype.isCardSensitive = function()
{
	var sensitive = false;

	if (document.getElementsByName('payment_type').length > 1) {
		// radio list of payment types
		for (var i = 0; i < this.card_types.length; i++) {
			if (this.card_types[i].checked) {
				sensitive = true;
				break;
			}
		}
	} else if (this.card_ids.length == 1) {
		// only one payment type and it's a card
		sensitive = true;
	}

	return sensitive;
}

StoreCheckoutPaymentMethodPage.prototype.sensitizeCard = function()
{
	if (this.card_container)
		YAHOO.util.Dom.removeClass(this.card_container, 'swat-insensitive');

	StoreCheckoutPage_sensitizeFields(this.card_fields);
}

StoreCheckoutPaymentMethodPage.prototype.desensitizeCard = function()
{
	if (this.card_container)
		YAHOO.util.Dom.addClass(this.card_container, 'swat-insensitive');

	StoreCheckoutPage_desensitizeFields(this.card_fields);
}

// inception date fields

StoreCheckoutPaymentMethodPage.prototype.isInceptionDateSensitive = function()
{
	var sensitive = false;

	for (var i = 0; i < this.inception_date_types.length; i++) {
		if (this.inception_date_types[i].checked) {
			sensitive = true;
			break;
		}
	}

	return sensitive;
}

StoreCheckoutPaymentMethodPage.prototype.sensitizeInceptionDate = function()
{
	YAHOO.util.Dom.removeClass('card_inception_field', 'swat-insensitive');
	StoreCheckoutPage_sensitizeFields(this.inception_date_fields);
}

StoreCheckoutPaymentMethodPage.prototype.desensitizeInceptionDate = function()
{
	YAHOO.util.Dom.addClass('card_inception_field', 'swat-insensitive');
	StoreCheckoutPage_desensitizeFields(this.inception_date_fields);
}

// issue number fields

StoreCheckoutPaymentMethodPage.prototype.isIssueNumberSensitive = function()
{
	var sensitive = false;

	for (var i = 0; i < this.issue_number_types.length; i++) {
		if (this.issue_number_types[i].checked) {
			sensitive = true;
			break;
		}
	}

	return sensitive;
}

StoreCheckoutPaymentMethodPage.prototype.sensitizeIssueNumber = function()
{
	YAHOO.util.Dom.removeClass('card_issue_number_field', 'swat-insensitive');
	StoreCheckoutPage_sensitizeFields(this.issue_number_fields);
}

StoreCheckoutPaymentMethodPage.prototype.desensitizeIssueNumber = function()
{
	YAHOO.util.Dom.addClass('card_issue_number_field', 'swat-insensitive');
	StoreCheckoutPage_desensitizeFields(this.issue_number_fields);
}
