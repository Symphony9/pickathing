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