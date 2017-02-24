# pickathing
Simple select written in Vanilla JS

Just do `var select = new Pickathing('your-id', true/false)`

true /false is for the searchfield to show or not.

If you want multiple select it is easy! Just create normal multiple select:

`<select multiple> ...`

and initialization is the same as with normal select.

There is an option to filter one select by the other. To do that simply add options object as a third parameter like so:

`new Pickathing('your-id', true/false, {filterAttr: 'data-filter', filter: select})`

The select needs to be instance of Pickathing class.

## More docs:

`new Pickathing('element-id', hasSearch, options)`

### Parameters

#### element-id
(String) Id of the select you want to activate

#### hasSearch
(Boolean) true/false determines if the searchfield is added or not

#### options __(optional)__
(Object) key: value pairs of other options

##### options.filter
(Instance) Instance of already initialized Pickathing select which gets filtered BY this select

##### options.filterAttr
(String) Attribute for which to look when filtering another select __(Has to be present if you use options.filter)__

##### options.searchLabel
(String) Sets the placeholder in the search field

##### options.focusDelay
(Number) Sets delay after the search field or the first item is selected. Should match transition of opening the dropdown. If you did not change transition in CSS you do not have to change this value

### Methods

#### Pickathing.reset(fireOnChange)
Resets the filter to initial state. Accepts `fireOnChange` (true or false) to trigger the onChange method or not

#### Pickathing.onChange()
You can fire the onChange event manually with this method, or you can set what function should be executed
```javascript
let select = new Pickathing(...);
select.onChange = () => {
  ...
}
```
By default this method is blank and does not do anything.

### Events

#### Pickathing.onChange
By default it is blank and serves as a method as well. Fire after the select has changed its value (e.g. clicking on option). Has to be set after initialization:
```javascript
let select = new Pickathing(...);
select.onChange = () => {
  ...
}
```
