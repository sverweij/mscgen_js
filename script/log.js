define(function (){
    function LOG (pString, pLevel){
        if (console) {
            if (!pLevel) { pLevel = "generic"; }
            switch (pLevel){
                case "debug": 
                    console.debug(pString); // debug deprecated; should use log. However firefox doesn't sort it out to the correct category yet
                    break;
                case "info": 
                    console.info(pString);
                    break;
                case "warn": 
                    console.warn(pString);
                    break;
                case "error":
                    console.error(pString);
                    break;
                default:
                    console.log(pString);
                    break;
            }
        }
    }
    return {
        DEBUG: function (pString){
            LOG(pString, "debug");
        },
        INFO: function (pString){
            LOG(pString, "info");
        },
        WARN: function (pString){
            LOG(pString, "warn");
        },
        ERROR: function (pString){
            LOG(pString, "error");
        }
    };
}); // define

