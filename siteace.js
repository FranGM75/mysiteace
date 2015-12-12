Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

if (Meteor.isClient) {

	//routing
	Router.configure({
		layoutTemplate:'ApplicationLayout'
	});

	Router.route('/', function () {
  	this.render('navbar',{
			to:"navbar"
			});
		this.render('Main',{
			to:"main"
			});
	});

	Router.route('/:_id', function () {
		this.render('navbar',{
			to:"navbar"
			});
		this.render('website_detail',{
			to:"main",
			data:function(){
				return Websites.findOne({_id:this.params._id});
			}
			});
	});


	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{scoreup:-1}});
		}
	});


	/////
	// template events
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			Websites.update(website_id, {$inc:{scoreup:1}});

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			Websites.update(website_id,{$inc:{scoredown:1}});

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_item.helpers({
		"info":function(){
			var website_id = this._id;
			return Websites.findOne({_id:website_id});
		},
		"comments":function(){
			var title=this.title;
			return Comments.find({title:title});
		},
		"numcomments":function(){
			var title=this.title;
			return Comments.find({title:title}).count();			
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var desc = event.target.description.value;


			console.log("The url they entered is: "+url);

			//  put your website saving code in here!
			if(url.trim() != "" && desc.trim() != ""){
				Websites.insert({
					title:title,
					url:url,
					description:desc,
				  createdOn:new Date(),
					scoreup:0,
					scoredown:0
					}, function( error, result) {
    				if ( error ) console.log ( error ); //info about what went wrong
    				if ( result ) console.log ( result ); //the _id of new object if successful
  			});
			}else{
				console.log("Error !!!! url or description are empty...");
			}

			return false;// stop the form submit from reloading the page

		}
	});

	Template.website_detail.events({
		"submit .js-save-comments-form":function(event,template){
			// Prevent default browser form submit
			event.preventDefault();
			var comment = event.target.comment.value;
			var title = this.title;

			Comments.insert({
				title:title,
				comment:comment
				}, function( error, result) {
	    			if ( error ) console.log ( error ); //info about what went wrong
	    			if ( result ) console.log ( result ); //the _id of new object if successful
	  		});

				// Clear form
				template.find(".js-save-comments-form").reset();
				return false;
			}

	});

	Template.website_detail.helpers({
		comments:function(){
			var title=this.title;
			return Comments.find({title:title});
		}
	});

}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date()
    	});
    }
  });
}
