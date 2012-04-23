(function() {
  var ACTIVITY_1_MAX, ACTIVITY_2_MAX, ACTIVITY_3_MAX, ALMOST_FULL, Registrations, helper_free_class, helper_free_enabled;

  ACTIVITY_1_MAX = 10;

  ACTIVITY_2_MAX = 10;

  ACTIVITY_3_MAX = 10;

  ALMOST_FULL = 10;

  Registrations = new Meteor.Collection("registrations");

  if (Meteor.is_client) {
    Template.status.reg_count = function() {
      return Registrations.find().count();
    };
    Template.errors.errors = function() {
      return Session.get('errors');
    };
    Template.form.is_registered = function() {
      return Session.get('is_registered');
    };
    Template.form.free_1 = function() {
      return ACTIVITY_1_MAX - Registrations.find({
        activity: '1'
      }).count();
    };
    Template.form.free_2 = function() {
      return ACTIVITY_2_MAX - Registrations.find({
        activity: '2'
      }).count();
    };
    Template.form.free_3 = function() {
      return ACTIVITY_3_MAX - Registrations.find({
        activity: '3'
      }).count();
    };
    Template.form.free_1_class = function() {
      return helper_free_class(1);
    };
    Template.form.free_2_class = function() {
      return helper_free_class(2);
    };
    Template.form.free_3_class = function() {
      return helper_free_class(3);
    };
    Template.form.free_1_enabled = function() {
      return helper_free_enabled(1);
    };
    Template.form.free_2_enabled = function() {
      return helper_free_enabled(2);
    };
    Template.form.free_3_enabled = function() {
      return helper_free_enabled(3);
    };
    helper_free_class = function(id) {
      var max;
      max = 0;
      switch (id) {
        case 1:
          max = ACTIVITY_1_MAX;
          break;
        case 2:
          max = ACTIVITY_2_MAX;
          break;
        case 3:
          max = ACTIVITY_3_MAX;
      }
      if (max - Registrations.find({
        activity: "" + id
      }).count() < ALMOST_FULL) {
        return "label-important";
      } else {
        return "label-info";
      }
    };
    helper_free_enabled = function(id) {
      var max;
      max = 0;
      switch (id) {
        case 1:
          max = ACTIVITY_1_MAX;
          break;
        case 2:
          max = ACTIVITY_2_MAX;
          break;
        case 3:
          max = ACTIVITY_3_MAX;
      }
      if (max - Registrations.find({
        activity: "" + id
      }).count() <= 8) {
        return 'disabled';
      } else {
        return '';
      }
    };
    Template.form.events = {
      'submit': function(e) {
        var activity, carpool_places, carpool_start, damien, email, errors, meet, menu, valid;
        e.preventDefault();
        email = $('#email').val();
        meet = $('input[name=meet]:checked').val();
        carpool_start = $('#carpool_start').val();
        carpool_places = $('#carpool_places').val();
        menu = $('#menu').val();
        damien = $('#damien').val();
        activity = $('input[name=activity]:checked').val();
        valid = true;
        Session.set('errors', []);
        errors = [];
        if (Registrations.find({
          email: email
        }).count() > 0) {
          errors.push('Iemand deed al mee met dit e-mail adres');
          valid = false;
        }
        if (email === '') {
          errors.push('Kies een geldig e-mail adres');
          valid = false;
        }
        if (menu === '-1') {
          errors.push('Kies een menu');
          valid = false;
        }
        if (!activity) {
          errors.push('Kies een activiteit');
          valid = false;
        }
        if (!meet) {
          errors.push('Kies waar je wil afspreken');
          valid = false;
        }
        if (valid) {
          Registrations.insert({
            email: email,
            meet: meet,
            carpool_places: carpool_places,
            carpool_start: carpool_start,
            menu: menu,
            damien: damien,
            activity: activity
          });
          Session.set('is_registered', true);
        } else {
          Session.set('errors', errors);
        }
        return false;
      }
    };
  }

  if (Meteor.is_server) Meteor.startup(function() {});

}).call(this);
