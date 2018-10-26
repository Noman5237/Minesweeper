/**
 
    @author     :   Noman^Alien#0637
    @created_On :   10/26/2018 ; 2:49 AM
 
 */

    // Home Screen Handler

window.addEventListener("DOMContentLoaded", function () {

    window.addEventListener('keydown', function(e){
        switch (e.key) {
            case 'SoftLeft':
                // todo handle the help page
                break;
            case 'SoftRight':
                // todo handle the More page
                break;
            case 'Enter':
                // opens he game page
                window.location.href="../game.html";
                break;
            default:
                break;
        }
    });

});