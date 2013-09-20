define([], function() {

    var HTTP_STATUS_OK = 200;

    var httpRequest;

    // private functions
    function onReadyStateChange(pCallback) {
        try {
            if (httpRequest.readyState === httpRequest.DONE) {
                if (httpRequest.status === HTTP_STATUS_OK || ("file:" === window.location.protocol) ) {
                    pCallback(httpRequest.responseText);
                }
            }
        } catch (e) {
        }
    }

    // public functions
    return {
        makeJSONRequest : function(pURL, pCallback) {
            if (window.XMLHttpRequest) {
                httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                try {
                    httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (activeXe) {
                    }
                }
            }

            if (httpRequest) {
                httpRequest.onreadystatechange = function() {
                    onReadyStateChange(pCallback);
                };
                httpRequest.overrideMimeType("text/json");
                httpRequest.open('GET', pURL/*+ "?ts=" + (new Date()).getTime()*/, true);
                httpRequest.send(null);
            }
        }
    };
});
// define
