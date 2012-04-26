ACTIVITY_1_MAX = 18
ACTIVITY_2_MAX = 20
ACTIVITY_3_MAX = 20
ALMOST_FULL = 3

Registrations = new Meteor.Collection "registrations"
Registrations.remove({})

if Meteor.is_client

  Template.errors.errors = ->
    return Session.get('errors')

  Template.form.is_registered = ->
    return Session.get('is_registered')

  Template.form.free_1 = ->
    return ACTIVITY_1_MAX - Registrations.find({ activity: '1'}).count()

  Template.form.free_2 = ->
    return ACTIVITY_2_MAX - Registrations.find({ activity: '2'}).count()

  Template.form.free_3 = ->
    return ACTIVITY_3_MAX - Registrations.find({ activity: '3'}).count()

  Template.form.free_1_class = ->
    helper_free_class(1)

  Template.form.free_2_class = ->
    helper_free_class(2)

  Template.form.free_3_class = ->
    helper_free_class(3)

  Template.form.free_1_enabled = ->
    helper_free_enabled(1)

  Template.form.free_2_enabled = ->
    helper_free_enabled(2)

  Template.form.free_3_enabled = ->
    helper_free_enabled(3)

  helper_free_class = (id) ->
    max = 0

    switch id
      when 1 then max = ACTIVITY_1_MAX
      when 2 then max = ACTIVITY_2_MAX
      when 3 then max = ACTIVITY_3_MAX

    if max - Registrations.find({ activity: "" + id}).count() < ALMOST_FULL
      return "label-important"
    else
      return "label-info"

  helper_free_enabled = (id) ->
    max = 0

    switch id
      when 1 then max = ACTIVITY_1_MAX
      when 2 then max = ACTIVITY_2_MAX
      when 3 then max = ACTIVITY_3_MAX

    if max - Registrations.find({ activity: "" + id}).count() <= 0
      return 'disabled'
    else
      return ''

  Template.form.events =
    'submit': (e) ->

      # hold event back
      e.preventDefault()
      
      # fields
      email = $('#email').val()
      meet = $('input[name=meet]:checked').val()
      carpool_start = $('#carpool_start').val()
      carpool_places = $('#carpool_places').val()
      menu = $('#menu').val()
      damien = $('#damien').val()
      activity = $('input[name=activity]:checked').val()

      # validation
      valid = true
      
      Session.set('errors', [])
      errors = []

      if Registrations.find({email: email}).count() > 0
        errors.push('Iemand deed al mee met dit e-mail adres')
        valid = false

      if email == ''
        errors.push('Kies een geldig e-mail adres')
        valid = false

      if menu == '-1'
        errors.push('Kies een menu')
        valid = false

      if not activity
        errors.push('Kies een activiteit')
        valid = false
  
      if not meet
        errors.push('Kies waar je wil afspreken')
        valid = false

      if valid
        Registrations.insert({
          email: email,
          meet: meet,
          carpool_places: carpool_places,
          carpool_start: carpool_start,
          menu: menu,
          damien: damien,
          activity: activity,
        })

        Session.set('is_registered', true)

      else
        Session.set('errors', errors)

      return false

    # Meteor.startup ->

if Meteor.is_server

  Meteor.startup ->
    # code to run on server at startup
