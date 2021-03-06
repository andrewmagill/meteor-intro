// Meteor Intro
// by dannydavidson

// Functional code controls changing state.
//
// At every moment in time,
// your application's state is represented by data.  In Meteor, you model
// shared state using a database called MongoDB.
//
// This is the syntax to create a Collection
var Items = new Meteor.Collection( 'items' );

// Your javascript in Meteor can run in the browser or
// on the server
if ( Meteor.isClient ) {

	// State is not always shared, sometimes it represents
	// something that is local to the user. In Meteor, you
	// model local state using the Session.
	//
	// Here's how you set a value on the Session.
	Session.set( 'currentItem', 1 );

	// You get state rendered to your UI by
	// defining rendering functions. This takes
	// time to adjust to, but no matter how complex
	// your data model gets, you'll always be returning
	// just Arrays and Objects.

	// Here we fetch all records in the Items collection.
	// By returning them our template renders an item template
	// for each record in the database.
	Template.items.items = function () {
		return Items.find( {} ).fetch();
	};

	// We want an item to highlight when it's selected. We pass
	// that state using the isSelected key.  Because we do a
	// Session.get('currentItem'), anytime our app does a
	// Session.set('currentItem') this function gets re-run and
	// our UI updates
	Template.item.isSelected = function () {
		return Session.get( 'currentItem' ) === this.id;
	}

	// To change state from user action, just react to change in an
	// event map function by updating state in either the Session or
	// Collection.
	Template.items.events( {
		'click .item': function ( evt ) {
			Session.set( 'currentItem', this.id );
		}
	} );

	// As the user changes the name in the input field for an item,
	// update that Item in Mongo.
	Template.items.events( {
		'input input': function ( evt ) {
			// In mongo, you specify which record you want to update
			// by using its _id. Here we use a $set to just change the
			// name value
			Items.update( this._id, {
				$set: {
					name: $( evt.currentTarget ).val()
				}
			} );
		},

		// when a user focuses the name input, set that Item
		// as currentItem
		'focus input': function ( evt ) {
			Session.set( 'currentItem', this.id );
		}
	} );

}

if ( Meteor.isServer ) {
	Meteor.startup( function () {

		// For the purpose of prototyping, you can easily
		// create fixture data on the server on startup.
		Items.remove( {} );
		for ( var i = 0; i < 3; i++ ) {
			Items.insert( {
				id: i
			} );
		};
	} );
}
