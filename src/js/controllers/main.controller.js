angular
  .module('vamApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$transitions', '$rootScope', '$state','$auth'];

function MainCtrl($transitions, $rootScope, $state, $auth) {
  const vm = this;
  vm.isAuthenticated = $auth.isAuthenticated;
  vm.logout = logout;

  function logout() {
    $auth.logout();
    $state.go('home');
  }

  $rootScope.$on('error', (e, err) => {

    vm.message = err.data.message;
    if(err.status === 401 && vm.pageName !== 'login') {
      vm.stateHasChanged =  false;
      $state.go('login');
    }
  });

  $transitions.onSuccess({}, (transition) => {
    // attaches the state name to the main controller to be used as a class name on the body
    vm.pageName = transition.to().name;

    if (vm.stateHasChanged) vm.message = null;
    if (!vm.stateHasChanged) vm.stateHasChanged =  true;
    if($auth.isAuthenticated()) vm.currentUserId = $auth.getPayload().userId;
  });

}
