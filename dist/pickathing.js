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

	this.multiple = this.element.multiple;

	if (this.multiple) {
		this.wrapper.classList.add('Pickathing--multiple');
		this.value = {};
	} else {
		this.value = this.element.value;
	}

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
	this.selectedField = document.createElement('div');
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

	if (value == '' || option.disabled) {
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
			if (!this$1.multiple) {
				var label = this$1.optionElements[i].getAttribute('data-label');
				this$1.optionElements[i].classList.add('Pickathing-option--selected');
				this$1.selectedField.innerHTML = label;

				return;
			} else {
				this$1.setMultiOption(this$1.optionElements[i]);
				this$1.optionElements[i].disabled = true;
			}
		}
	}
};

Pickathing.prototype.setMultiOption = function setMultiOption (option) {
	option.classList.add('Pickathing-option--selected');
	var label = option.getAttribute('data-label');
	var value = option.getAttribute('data-option');
	var selectedFlag = document.createElement('span');

	selectedFlag.classList.add('Pickathing-selectedFlag');
	selectedFlag.setAttribute('data-option', value);
	selectedFlag.innerHTML = label;
	this.selectedField.appendChild(selectedFlag);
	this.value[value] = option;
};

Pickathing.prototype.onChange = function onChange () {
	// silence is golden
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
			if (el.classList.contains('Pickathing-option') && this$1.multiple) {
				// do nothing
			} else {
				this$1.wrapper.classList.remove('Pickathing--open');
			}
		}
	});

	this.wrapper.addEventListener('click', function (e) {
		var el = e.target;
		if (el.classList.contains('Pickathing-option')) {

			if (!this$1.multiple) {
				self.wrapper.classList.remove('Pickathing--open');
			}

			var value = el.getAttribute('data-option');
			var label = el.getAttribute('data-label');

			if (!this$1.multiple) {
				this$1.optionElements.map(function (opt) {
					opt.classList.remove('Pickathing-option--selected');
				});
				el.classList.add('Pickathing-option--selected');
				this$1.selectedField.innerHTML = label;
				this$1.element.value = value;
				this$1.value = value;
			} else {
				if (!el.classList.contains('Pickathing-option--selected')) {
					var selectedFlag = document.createElement('span');
					selectedFlag.classList.add('Pickathing-selectedFlag');
					selectedFlag.innerHTML = label;
					selectedFlag.setAttribute('data-option', value);
					this$1.value[value] = el;
					this$1.selectedField.appendChild(selectedFlag);
					el.classList.add('Pickathing-option--selected');
				} else {
					var flagToRemove = this$1.wrapper.querySelectorAll('.Pickathing-selectedFlag[data-option="' + value + '"]');
					flagToRemove[0].remove();
					el.classList.remove('Pickathing-option--selected');
					delete this$1.value[el.getAttribute('data-option')];
				}
			}

			this$1.onChange(this$1.value);
		}

		if (el.classList.contains('Pickathing-selectedField')) {
			e.preventDefault();
			self.wrapper.classList.toggle('Pickathing--open');
		}

		if (el.classList.contains('Pickathing-selectedFlag')) {
			e.stopPropagation();
			if (this$1.wrapper.classList.contains('Pickathing--open')) {
				var flagToRemove$1 = this$1.wrapper.querySelectorAll('.Pickathing-option--selected[data-option="' + el.getAttribute('data-option') + '"]');
				flagToRemove$1[0].classList.remove('Pickathing-option--selected');
				delete this$1.value[el.getAttribute('data-option')];
				el.remove();
			} else {
				this$1.wrapper.classList.add('Pickathing--open');
			}

			this$1.onChange(this$1.value);
		}

	});
};
