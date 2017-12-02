'use strict';


module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/get-data/:city').get(core.getData);

  app.route('/import-cal').get(core.importCal);

  //User

  // app.route('/create-user').post(core.createUser);
  //
  // app.route('/update-user').post(core.updateUser);
  //
  // app.route('/get-user-data').get(core.getUserData);
  //
  // // Teams
  //
  // app.route('/create-team').post(core.createTeam);
  //
  // app.route('/update-team').post(core.updateTeam);
  //
  // app.route('/get-team-data').get(core.getTeamData);

  // Define application route
  app.route('/*').get(core.renderIndex);

};
