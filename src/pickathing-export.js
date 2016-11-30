export default class Pickathing {
	constructor(elementId, hasSearch) {
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
		this.searchField.className = 'Pickathing-searchField';
		this.dropdown.appendChild(this.searchField);
	}

	addOption(option) {
		let value = option.value;
		let text = option.innerHTML;
		let element;

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

		if (typeof fireOnChange == 'undefined' || fireOnChange == true) {
			this.onChange();
		}
	}

	reset(fireOnChange) {
		this.setOptionByIndex(0, fireOnChange);
	}

	bindEvents() {
		let self = this;
		if (this.hasSearch) {
			this.searchField.addEventListener('keyup', (e) => {
				let query = new RegExp(self.searchField.value, 'gi');

				self.optionElements.map((el) => {
					let label = el.getAttribute('data-label');
					if (label.match(query)) {
						el.style.display = 'block';
					} else {
						el.style.display = 'none';
					}
				});
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

				if (!this.multiple) {
					this.optionElements.map((opt) => {
						opt.classList.remove('Pickathing-option--selected');
					});
					el.classList.add('Pickathing-option--selected');
					this.selectedField.innerHTML = label;
					this.element.value = value;
					this.value = value;
				} else {
					if (!el.classList.contains('Pickathing-option--selected')) {
						let selectedFlag = document.createElement('span');
						selectedFlag.classList.add('Pickathing-selectedFlag');
						selectedFlag.innerHTML = label;
						selectedFlag.setAttribute('data-option', value);
						this.value[value] = el;
						this.selectedField.appendChild(selectedFlag);
						el.classList.add('Pickathing-option--selected');
					} else {
						let flagToRemove = this.wrapper.querySelectorAll('.Pickathing-selectedFlag[data-option="' + value + '"]');
						flagToRemove[0].remove();
						el.classList.remove('Pickathing-option--selected');
						delete this.value[el.getAttribute('data-option')];
					}
				}

				this.onChange(this.value);
			}

			if (el.classList.contains('Pickathing-selectedField')) {
				e.preventDefault();
				self.wrapper.classList.toggle('Pickathing--open');
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
	}
}