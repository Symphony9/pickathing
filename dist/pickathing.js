var Pickathing = function Pickathing(elementId, hasSearch) {
	this.element = document.getElementById(elementId);
	this.parentEl = this.element.parentNode;
	this.hasSearch = typeof hasSearch === 'undefined' ? true : hasSearch;
	this.required = this.element.hasAttribute('data-required');

	this.wrapper = document.createElement('div');
	this.wrapper.className = 'Pickathing';
	this.wrapper = this.parentEl.insertBefore(this.wrapper, this.element);

	if (this.required) {
		this.wrapper.setAttribute('data-required', '');
		this.element.removeAttribute('data-required');
	}

	this.optionElements = [];
	this.options = this.element.options;
	this.value = this.element.value;

	this.searchField;

	this.create();
	this.bindEvents();
};

Pickathing.prototype.create = function create () {
	var self = this;

	this.addSelectedField();
	this.addDropdown();
	if (this.hasSearch) {
		this.addSearchField();
	}
	this.addList();

	for (var i = 0; i < this.options.length; i++) {
		self.addOption(self.options[i]);
	}

	this.checkSelected();
};

Pickathing.prototype.addSelectedField = function addSelectedField () {
	this.selectedField = document.createElement('button');
	this.selectedField.type = '';
	this.selectedField.setAttribute('data-client-input', '');
	this.selectedField.className = 'Pickathing-selectedField';
	this.wrapper.appendChild(this.selectedField);
};

Pickathing.prototype.addDropdown = function addDropdown () {
	this.dropdown = document.createElement('div');
	this.dropdown.className = 'Pickathing-dropdown';
	this.wrapper.appendChild(this.dropdown);
};

Pickathing.prototype.addList = function addList () {
	this.list = document.createElement('div');
	this.list.className = 'Pickathing-list';
	this.dropdown.appendChild(this.list);
};

Pickathing.prototype.addSearchField = function addSearchField () {
	this.searchField = document.createElement('input');
	this.searchField.type = 'text';
	this.searchField.className = 'Pickathing-searchField';
	this.dropdown.appendChild(this.searchField);
};

Pickathing.prototype.addOption = function addOption (option) {
	var value = option.value;
	var text = option.innerHTML;
	var element;

	if (value == '') {
		element = document.createElement('button');
		element.disabled = true;
	} else {
		element = document.createElement('div');
	}

	element.innerHTML = text;
	element.className = 'Pickathing-option'
	element.setAttribute('data-option', value);
	element.setAttribute('data-label', text);
	this.list.appendChild(element);
	this.optionElements.push(element);
};

Pickathing.prototype.enable = function enable () {
	this.selectedField.disabled = false;
};

Pickathing.prototype.disable = function disable () {
	this.selectedField.disabled = true;
};

Pickathing.prototype.checkSelected = function checkSelected () {
		var this$1 = this;

	for (var i = 0; i < this.options.length; i++) {
		if (this$1.options[i].selected) {
			var label = this$1.optionElements[i].getAttribute('data-label');

			this$1.selectedField.innerHTML = label;

			return;
		}
	}
};

Pickathing.prototype.setOption = function setOption (value) {
	var option = this.wrapper.querySelectorAll('[data-option="' + value + '"]');
	var label = option[0].getAttribute('data-label');

	this.selectedField.innerHTML = label;
	this.element.value = value;
	this.value = value;
};

Pickathing.prototype.bindEvents = function bindEvents () {
		var this$1 = this;

	var self = this;
	if (this.hasSearch) {
		this.searchField.addEventListener('keyup', function (e) {
			var query = new RegExp(self.searchField.value, 'gi');

			self.optionElements.map(function (el) {
				var label = el.getAttribute('data-label');
				if (label.match(query)) {
					el.style.display = 'block';
				} else {
					el.style.display = 'none';
				}
			});
		});
	}

	document.addEventListener('click', function (e) {
		var el = e.target;

		if (el != this$1.selectedField && el != this$1.searchField) {
			this$1.optionElements.map(function (option) {
				if (el == option) {
					return;
				}
			});

			this$1.wrapper.classList.remove('Pickathing--open');
		}
	});

	this.wrapper.addEventListener('click', function (e) {
		var el = e.target;
		if (el.classList.contains('Pickathing-option')) {
			self.wrapper.classList.remove('Pickathing--open');
			var value = el.getAttribute('data-option');
			var label = el.getAttribute('data-label');

			this$1.selectedField.innerHTML = label;
			this$1.element.value = value;
			this$1.value = value;
		}

		if (el.classList.contains('Pickathing-selectedField')) {
			e.preventDefault();
			self.wrapper.classList.toggle('Pickathing--open');
		}
	});
};
