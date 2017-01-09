class Pickathing {
	constructor(elementId, hasSearch, options) {
		this.transTimeout;
		this.transTimeoutDelay = 201;

		if (options) {
			this.filterAnotherBy = options.filterAttr;
			this.filterAnother = options.filter;
			this.transTimeoutDelay = options.focusDelay + 1;
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
		this.focusableOptions;

		this.create();
		this.bindEvents();
	}

	create() {
		let self = this;

		this.addSelectedField();
		this.addDropdown();
		if (this.hasSearch) {
			this.addSearchField();
		}
		this.addList();

		for (let i = 0; i < this.options.length; i++) {
			self.addOption(self.options[i]);
		}

		this.focusableOptions = this.optionElements;

		this.checkSelected();
	}

	addSelectedField() {
		this.selectedField = document.createElement('div');
		this.selectedField.type = '';
		this.selectedField.setAttribute('data-client-input', '');
		this.selectedField.className = 'Pickathing-selectedField';
		this.wrapper.appendChild(this.selectedField);
	}

	addDropdown() {
		this.dropdown = document.createElement('div');
		this.dropdown.className = 'Pickathing-dropdown';
		this.wrapper.appendChild(this.dropdown);
	}

	addList() {
		this.list = document.createElement('div');
		this.list.className = 'Pickathing-list';
		this.dropdown.appendChild(this.list);
	}

	addSearchField() {
		this.searchField = document.createElement('input');
		this.searchField.type = 'text';
		this.searchField.placeholder = 'Search...';
		this.searchField.className = 'Pickathing-searchField';
		this.dropdown.appendChild(this.searchField);
	}

	addOption(option) {
		let value = option.value;
		let text = option.innerHTML;
		let element = document.createElement('button');

		if (value == '' || option.disabled) {
			element.disabled = true;
		}

		element.type = 'button';

		element.innerHTML = text;
		element.className = 'Pickathing-option'
		element.setAttribute('data-option', value);
		element.setAttribute('data-label', text);

		let dataAttributes = [].filter.call(option.attributes, (at) => /^data-/.test(at.name));
		if (dataAttributes.length > 0) {
			dataAttributes.map((data) => {
				element.setAttribute(data.name, data.value);
			});
		}

		this.list.appendChild(element);
		this.optionElements.push(element);
	}

	enable() {
		this.selectedField.disabled = false;
	}

	disable() {
		this.selectedField.disabled = true;
	}

	checkSelected() {
		for (let i = 0; i < this.options.length; i++) {
			if (this.options[i].selected) {
				if (!this.multiple) {
					let label = this.optionElements[i].getAttribute('data-label');
					this.optionElements[i].classList.add('Pickathing-option--selected');
					this.selectedField.innerHTML = label;
					this.selectedOption = this.optionElements[i];

					return;
				} else {
					this.setMultiOption(this.optionElements[i]);
					this.optionElements[i].disabled = true;
				}
			}
		}
	}

	setMultiOption(option) {
		option.classList.add('Pickathing-option--selected');
		let label = option.getAttribute('data-label');
		let value = option.getAttribute('data-option');
		let selectedFlag = document.createElement('span');
		let dataAttributes = [].filter.call(option.attributes, (at) => /^data-/.test(at.name));
		if (dataAttributes.length > 0) {
			dataAttributes.map((data) => {
				selectedFlag.setAttribute(data.name, data.value);
			});
		}
		selectedFlag.classList.add('Pickathing-selectedFlag');
		selectedFlag.setAttribute('data-option', value);
		selectedFlag.innerHTML = label;
		this.selectedField.appendChild(selectedFlag);
		this.value[value] = option;
	}

	onChange() {
		// silence is golden
	}

	setOptionByIndex(index, fireOnChange) {
		let value = this.optionElements[index].getAttribute('data-option');
		let label = this.optionElements[index].getAttribute('data-label');

		this.optionElements.map((opt) => {
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
	}

	reset(fireOnChange) {
		if (!this.multiple) {
			this.setOptionByIndex(0, fireOnChange);
		} else {
			for (let val in this.value) {
				this.deselectMultiOption(val);
			}

			if (fireOnChange) {
				this.onChange();
			}
		}
	}

	deselectMultiOption(value) {
		let element = this.wrapper.querySelectorAll('.Pickathing-option[data-option="' + value + '"]');
		let flagToRemove = this.wrapper.querySelectorAll('.Pickathing-selectedFlag[data-option="' + value + '"]');
		flagToRemove[0].remove();
		element[0].classList.remove('Pickathing-option--selected');
		delete this.value[value];
	}

	filter(query, field) {
		this.optionElements.map((el) => {
			let label = el.getAttribute(field);
			el.style.display = 'block';
			if (label && query != null) {
				if (label.match(query)) {
					el.style.display = 'block';
				} else {
					el.style.display = 'none';
				}
			}
		});
	}

	focusNextOption() {
		if (this.optionElements.length > this.focusedOption + 1) {
			this.focusedOption += 1;
			this.focusOption();
		}
	}

	focusPreviousOption() {
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
	}

	focusOption() {
		this.focusableOptions[this.focusedOption].focus();
	}

	toggleState() {
		let self = this;
		self.wrapper.classList.toggle('Pickathing--open');
		if (this.hasSearch) {
			this.focusedOption = -1;
		} else {
			this.focusedOption = 0;
		}
		if (self.hasSearch) {
			clearTimeout(self.transTimeout);
			self.transTimeout = setTimeout(() => {
				self.searchField.focus();
			}, self.transTimeoutDelay);
		} else {
			clearTimeout(self.transTimeout);
			self.transTimeout = setTimeout(() => {
				self.focusableOptions[0].focus();
			}, self.transTimeoutDelay);
		}
	}

	bindEvents() {
		let self = this;
		if (this.hasSearch) {
			this.searchField.addEventListener('keyup', (e) => {
				let query = new RegExp(self.searchField.value, 'gi');
				self.filter(query, 'data-label');
			});
		}

		document.addEventListener('click', (e) => {
			let el = e.target;

			if (el != this.selectedField && el != this.searchField) {
				if (el.classList.contains('Pickathing-option') && this.multiple) {
					// do nothing
				} else {
					this.wrapper.classList.remove('Pickathing--open');
				}
			}
		});

		this.wrapper.addEventListener('click', (e) => {
			let el = e.target;
			if (el.classList.contains('Pickathing-option')) {

				if (!this.multiple) {
					self.wrapper.classList.remove('Pickathing--open');
				}

				let value = el.getAttribute('data-option');
				let label = el.getAttribute('data-label');

				this.focusedOption = this.focusableOptions.indexOf(el);

				if (!this.multiple) {
					this.optionElements.map((opt) => {
						opt.classList.remove('Pickathing-option--selected');
					});
					el.classList.add('Pickathing-option--selected');
					this.selectedOption = el;
					this.selectedField.innerHTML = label;
					this.element.value = value;
					this.value = value;
				} else {
					if (!el.classList.contains('Pickathing-option--selected')) {
						let selectedFlag = document.createElement('span');
						selectedFlag.classList.add('Pickathing-selectedFlag');
						selectedFlag.innerHTML = label;
						selectedFlag.setAttribute('data-option', value);
						let dataAttributes = [].filter.call(el.attributes, (at) => /^data-/.test(at.name));
						if (dataAttributes.length > 0) {
							dataAttributes.map((data) => {
								selectedFlag.setAttribute(data.name, data.value);
							});
						}
						this.value[value] = el;
						this.selectedField.appendChild(selectedFlag);
						el.classList.add('Pickathing-option--selected');
					} else {
						this.deselectMultiOption(value);
					}
				}

				if (self.filterAnother) {
					self.filterAnother.filter(self.selectedOption.getAttribute(self.filterAnotherBy), self.filterAnotherBy);
					if (!self.filterAnother.multiple
						&& self.filterAnother.selectedOption.getAttribute(self.filterAnotherBy) != self.selectedOption.getAttribute(self.filterAnotherBy)) {
						self.filterAnother.reset(true);
					} 

					if (self.filterAnother.multiple) {
						self.filterAnother.reset(true);
					}
				}

				this.onChange(this.value);
			}

			if (el.classList.contains('Pickathing-selectedField')) {
				e.preventDefault();
				this.toggleState();
			}

			if (el.classList.contains('Pickathing-selectedFlag')) {
				e.stopPropagation();
				if (this.wrapper.classList.contains('Pickathing--open')) {
					let flagToRemove = this.wrapper.querySelectorAll('.Pickathing-option--selected[data-option="' + el.getAttribute('data-option') + '"]');
					flagToRemove[0].classList.remove('Pickathing-option--selected');
					delete this.value[el.getAttribute('data-option')];
					el.remove();
				} else {
					this.wrapper.classList.add('Pickathing--open');
				}

				this.onChange(this.value);
			}

		});

		this.wrapper.addEventListener('keyup', (e) => {
			e.preventDefault();
			if (e.which == 40) { // down arrow
				this.focusNextOption();
			} else if (e.which == 38) { // up arrow
				e.preventDefault();
				this.focusPreviousOption();
			} else if (e.which == 27) {
				this.toggleState();
			}
		})
	}
}