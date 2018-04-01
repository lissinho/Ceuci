Template.App_body.helpers({
    username() {
        return Meteor.user().username;
    }
});