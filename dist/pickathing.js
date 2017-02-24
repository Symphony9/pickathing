var Pickathing = function Pickathing(elementId, hasSearch, options) {
	this.transTimeout;
	this.transTimeoutDelay = 201;

	this.searchFieldText = 'Search';

	if (options) {
		this.filterAnotherBy = options.filterAttr;
		this.filterAnother = options.filter;
		this.transTimeoutDelay = options.focusDelay + 1;
		this.searchFieldText = options.searchLabel;
	}

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
	this.selectedOption;

	this.multiple = this.element.multiple;

	if (this.multiple) {
		this.wrapper.classList.add('Pickathing--multiple');
		this.value = {};
	} else {
		this.value = this.element.value;
	}

	this.searchField;

	this.focusedOption = -1;
	if (!this.hasSearch) {
		this.focusedOption = 0;
	}
	this.focusableOptions = [];

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

	this.checkFocusable();
	this.checkSelected();
};

Pickathing.prototype.checkFocusable = function checkFocusable () {
		var this$1 = this;

	this.focusableOptions = [];
	this.optionElements.map(function (el) {
		if (!el.disabled && el.offsetParent != null) {
			this$1.focusableOptions.push(el);
		}
	});
};

Pickathing.prototype.addSelectedField = function addSelectedField () {
	this.selectedField = document.createElement('div');
	this.selectedField.type = '';
	this.selectedField.setAttribute('data-client-input', '');
	this.selectedField.className = 'Pickathing-selectedField';
	this.selectedField.setAttribute('tabindex', '0');
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
	this.searchField.placeholder = this.searchFieldText;
	this.searchField.className = 'Pickathing-searchField';
	this.dropdown.appendChild(this.searchField);
};

Pickathing.prototype.addOption = function addOption (option) {
	var value = option.value;
	var text = option.innerHTML;
	var element = document.createElement('button');

	if (value == '' || option.disabled) {
		element.disabled = true;
	}

	element.type = 'button';

	element.innerHTML = text;
	element.className = 'Pickathing-option'
	element.setAttribute('data-option', value);
	element.setAttribute('data-label', text);

	var dataAttributes = [].filter.call(option.attributes, function (at) { return /^data-/.test(at.name); });
	if (dataAttributes.length > 0) {
		dataAttributes.map(function (data) {
			element.setAttribute(data.name, data.value);
		});
	}

	element.setAttribute('tabindex', '-1');
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
				this$1.selectedOption = this$1.optionElements[i];

				return;
			} else {
				this$1.setMultiOption(this$1.optionElements[i]);
			}
		}
	}
};

Pickathing.prototype.setMultiOption = function setMultiOption (option) {
	option.classList.add('Pickathing-option--selected');
	var label = option.getAttribute('data-label');
	var value = option.getAttribute('data-option');
	var selectedFlag = document.createElement('span');
	var dataAttributes = [].filter.call(option.attributes, function (at) { return /^data-/.test(at.name); });
	if (dataAttributes.length > 0) {
		dataAttributes.map(function (data) {
			selectedFlag.setAttribute(data.name, data.value);
		});
	}
	selectedFlag.classList.add('Pickathing-selectedFlag');
	selectedFlag.setAttribute('data-option', value);
	selectedFlag.innerHTML = label;
	this.selectedField.appendChild(selectedFlag);
	this.value[value] = option;
};

Pickathing.prototype.onChange = function onChange () {
	// silence is golden
};

Pickathing.prototype.setOptionByIndex = function setOptionByIndex (index, fireOnChange) {
	var value = this.optionElements[index].getAttribute('data-option');
	var label = this.optionElements[index].getAttribute('data-label');

	this.optionElements.map(function (opt) {
		opt.classList.remove('Pickathing-option--selected');
	});

	this.optionElements[index].classList.add('Pickathing-option--selected');
	this.selectedField.innerHTML = label;
	this.element.value = value;
	this.value = value;
	this.selectedOption = this.optionElements[index];

	if (typeof fireOnChange == 'undefined' || fireOnChange == true) {
		this.onChange();
	}
};

Pickathing.prototype.reset = function reset (fireOnChange) {
		var this$1 = this;

	if (!this.multiple) {
		this.setOptionByIndex(0, fireOnChange);
	} else {
		for (var val in this.value) {
			this$1.deselectMultiOption(val);
		}

		if (fireOnChange) {
			this.onChange();
		}
	}

	this.checkFocusable();
};

Pickathing.prototype.deselectMultiOption = function deselectMultiOption (value) {
	var element = this.wrapper.querySelectorAll('.Pickathing-option[data-option="' + value + '"]');
	var flagToRemove = this.wrapper.querySelectorAll('.Pickathing-selectedFlag[data-option="' + value + '"]');
	var originalOption = this.element.querySelectorAll('option[value="' + value + '"]')[0];
	originalOption.selected = false;
	flagToRemove[0].remove();
	element[0].classList.remove('Pickathing-option--selected');
	delete this.value[value];
};

Pickathing.prototype.filter = function filter (query, field) {
	this.optionElements.map(function (el) {
		var label = el.getAttribute(field);
		el.style.display = 'block';
		if (label && query != null) {
			if (label.match(query)) {
				el.style.display = 'block';
			} else {
				el.style.display = 'none';
			}
		}
	});

	this.checkFocusable();
};

Pickathing.prototype.focusNextOption = function focusNextOption () {
	if (this.focusableOptions.length > this.focusedOption + 1) {
		this.focusedOption += 1;
		this.focusOption();
	}
};

Pickathing.prototype.focusPreviousOption = function focusPreviousOption () {
	if (this.hasSearch) {
		if (this.focusedOption > -1) {
			this.focusedOption -= 1;
			if (this.focusedOption == -1) {
				this.searchField.focus();
			} else {
				this.focusOption();
			}
		}
	} else {
		if (this.focusedOption > 0) {
			this.focusedOption -= 1;
			this.focusOption();
		}
	}
};

Pickathing.prototype.focusOption = function focusOption () {
	this.focusableOptions[this.focusedOption].focus();
};

Pickathing.prototype.toggleState = function toggleState () {
	var self = this;
	self.wrapper.classList.toggle('Pickathing--open');
	if (this.hasSearch) {
		this.focusedOption = -1;
	} else {
		this.focusedOption = 0;
	}
	if (self.hasSearch) {
		clearTimeout(self.transTimeout);
		self.transTimeout = setTimeout(function () {
			self.searchField.focus();
		}, self.transTimeoutDelay);
	} else {
		clearTimeout(self.transTimeout);
		self.transTimeout = setTimeout(function () {
			self.focusableOptions[0].focus();
		}, self.transTimeoutDelay);
	}
};

Pickathing.prototype.bindEvents = function bindEvents () {
		var this$1 = this;

	var self = this;
	if (this.hasSearch) {
		this.searchField.addEventListener('keyup', function (e) {
			var query = new RegExp(self.searchField.value, 'gi');
			self.filter(query, 'data-label');
			this$1.checkFocusable();
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

			this$1.focusedOption = this$1.focusableOptions.indexOf(el);

			if (!this$1.multiple) {
				this$1.optionElements.map(function (opt) {
					opt.classList.remove('Pickathing-option--selected');
				});
				el.classList.add('Pickathing-option--selected');
				this$1.selectedOption = el;
				this$1.selectedField.innerHTML = label;
				this$1.element.value = value;
				this$1.value = value;
			} else {
				if (!el.classList.contains('Pickathing-option--selected')) {
					var selectedFlag = document.createElement('span');
					selectedFlag.classList.add('Pickathing-selectedFlag');
					selectedFlag.innerHTML = label;
					selectedFlag.setAttribute('data-option', value);
					var dataAttributes = [].filter.call(el.attributes, function (at) { return /^data-/.test(at.name); });
					if (dataAttributes.length > 0) {
						dataAttributes.map(function (data) {
							selectedFlag.setAttribute(data.name, data.value);
						});
					}
					var originalOption = this$1.element.querySelectorAll('option[value="' + value + '"]')[0];
					originalOption.selected = true;
					this$1.value[value] = el;
					this$1.selectedField.appendChild(selectedFlag);
					el.classList.add('Pickathing-option--selected');
				} else {
					this$1.deselectMultiOption(value);
				}
			}

			if (self.filterAnother) {
				self.filterAnother.filter(self.selectedOption.getAttribute(self.filterAnotherBy), self.filterAnotherBy);
				if (!self.filterAnother.multiple
					&& self.filterAnother.selectedOption.getAttribute(self.filterAnotherBy) != self.selectedOption.getAttribute(self.filterAnotherBy)) {
					self.filterAnother.reset(false);
				} 

				if (self.filterAnother.multiple) {
					self.filterAnother.reset(false);
				}
			}

			this$1.onChange(this$1.value);
		}

		if (el.classList.contains('Pickathing-selectedField')) {
			e.preventDefault();
			this$1.toggleState();
		}

		if (el.classList.contains('Pickathing-selectedFlag')) {
			e.stopPropagation();
			if (this$1.wrapper.classList.contains('Pickathing--open')) {
				var flagToRemove = this$1.wrapper.querySelectorAll('.Pickathing-option--selected[data-option="' + el.getAttribute('data-option') + '"]');
				flagToRemove[0].classList.remove('Pickathing-option--selected');
				delete this$1.value[el.getAttribute('data-option')];
				el.remove();
			} else {
				this$1.wrapper.classList.add('Pickathing--open');
			}

			this$1.onChange(this$1.value);
		}

	});

	this.wrapper.addEventListener('keyup', function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.which == 40) { // down arrow
			this$1.focusNextOption();
		} else if (e.which == 38) { // up arrow
			e.preventDefault();
			this$1.focusPreviousOption();
		} else if (e.which == 27) {
			this$1.toggleState();
		}
	})

	this.wrapper.addEventListener('keypress', function (e) {
		if (e.which == 40 || e.which == 38) {
			e.preventDefault();
		}
	})

	this.wrapper.addEventListener('keydown', function (e) {
		if (e.which == 40 || e.which == 38) {
			e.preventDefault();
		}
	})
};
