/* eslint-disable */
import $ from 'jquery'

var intervalCheckLogon = 60000;	//millisecond
var timerCheckLogon = null;
var intervalCheckSSO = 60000;	//millisecond
var timerCheckSSO = null;

// base uri: set from 'setNssoConfiguration' method
var nssoConfigAgentBaseUri = "";

// ============
// ASP.NET
// ============
/*
// for get configuration
var nssoConfigPathNssoConfig = "NSSOConfig";
// for login back-end application
var nssoConfigPathLogonService = "LogonService";
// for choice when duplication occurred
var nssoConfigPathDupReceive = "DupChoiceReceive";
var nssoConfigPathDupChoiceLogon = "DupChoiceLogon";
var nssoConfigPathDupChoiceCancel = "DupChoiceCancel";
// for input when secret code is needed
var nssoConfigPathTfaReceive = "TFAReceive";
// for check sso status of back-end application
var nssoConfigPathCheckLogon = "CheckLogon";
*/

// ============
// Java
// ============
// for get configuration
var nssoConfigPathNssoConfig = "config";
// for login back-end application
var nssoConfigPathLogonService = "check";
// for choice when duplication occurred
var nssoConfigPathDupReceive = "dup.jsp";
// for input when secret code is needed
var nssoConfigPathTfaReceive = "tfa.jsp";
// for check sso status of back-end application
var nssoConfigPathCheckLogon = "check";


// set from 'setNssoConfiguration' method
var ssosite = "";
var defaultUrl = "";
var urlSSOLogonService = "";
var urlSSOCheckService = "";
var urlSSOLogoffService = "";
var credTypeDefault = "BASIC";
var credTypeEncrypt = "ENCRYPTEDBASIC";
var credTypeArtifact = "ARTIFACT";

// logonStatus
var ssoSuccess = false;
var ssoErrorCode = 0;
var ssoErrorMessage = "";
var ssoUserId = "";
var ssoUserAttribute = null;
var ssoMisc = null;
var ssoTfa = {};
var ssoDuplication = {};
var gateUrl = "";   // (backwards compatibility) This is the URL for authn the OLD-SSO. If this value is returned when login is successful, the URL is moved to the corresponding URL.

var temporaryDuplicationData = "";

function getNssoUserId() {
    return ssoSuccess ? ssoUserId : "";
}

export function getNssoUserAttribute(keynm) {
    var attrReturn = "";

    if (ssoSuccess) {
        $.each(ssoUserAttribute, function (i, v) {
            if (v.key === keynm) {
                attrReturn = v.value;
            }
        });

        if (attrReturn !== "")
            return attrReturn;

        ssoErrorMessage = "There is no attribute '" + keynm + "'.";
        return "";
    } else {
        ssoErrorMessage = "User does not logon.";
        return "";
    }
}

export function getNssoUserAttributeList() {
    var attrRetrun = [];

    if (ssoSuccess) {
        $.each(ssoUserAttribute, function (i, v) {
            attrRetrun[i] = v.key + "=" + v.value;
        });
    }
    return attrRetrun;
}

function getNssoMisc(key) {
    if (ssoMisc === null)
        return "";
    var retMiscValue = "";
    $.each(ssoMisc, function (i, v) {
        if (v.hasOwnProperty(key)) {
            retMiscValue = v[key];
        }
    });
    return retMiscValue;
}

var callbackLogonFail, callbackLogonSuccess, callbackReceiveTfa, callbackReceiveDuplication, callbackSsoUnavailable;

export function setNssoConfiguration(baseUri, functionLogonFail, functionLogonSuccess, functionReceiveTfa, functionReceiveDuplication, functionSsoUnavailable) {

    nssoConfigAgentBaseUri = baseUri.endsWith("/") ? baseUri : baseUri + "/";
    callbackLogonFail = functionLogonFail;
    callbackLogonSuccess = functionLogonSuccess;
    callbackReceiveTfa = functionReceiveTfa;
    callbackReceiveDuplication = functionReceiveDuplication;
    callbackSsoUnavailable = functionSsoUnavailable;

    $.ajax({
        type: 'POST',
        url: nssoConfigAgentBaseUri + nssoConfigPathNssoConfig,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/json'},
        data: {},
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            if (json.result) {
                ssosite = json.ssosite;
                defaultUrl = json.defaultUrl;
                if (!defaultUrl) defaultUrl = location.href;
                urlSSOLogonService = json.urlSSOLogonService;
                urlSSOCheckService = json.urlSSOCheckService;
                urlSSOLogoffService = json.urlSSOLogoffService;
                checkLogon();
            } else {
                alert(json.errorMessage);
            }
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed setting nsso-configuration. " + error;
            callbackLogonFail();
        }
    });
}

function checkLogon() {
    $.ajax({
        type: 'POST',
        url: nssoConfigAgentBaseUri + nssoConfigPathCheckLogon,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/json', 'SSOAgent-Type': 'SPA'},
        data: {
            op: 'AU'    //authn
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseCheckLogon(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed check logon status. " + error;
            callbackLogonFail();
        }
    });
}

function parseCheckLogon(json) {
    ssoErrorCode = json.errorCode;

    if (json.authStatus === "SSO_SUCCESS" || json.authStatus === "SSOSuccess") {
        ssoSuccess = true;
        ssoUserId = json.userId;
        ssoUserAttribute = json.userAttribute;
        ssoErrorMessage = "";
        callbackLogonSuccess();

        if (timerCheckLogon === null) {
            timerCheckLogon = setInterval(checkLogon, intervalCheckLogon);
            clearInterval(timerCheckSSO);
            timerCheckSSO = null;
        }
    } else {
        ssoSuccess = false;
        ssoUserId = "";
        ssoUserAttribute = null;
        ssoErrorMessage = json.errorMessage;
        if (json.authStatus === "SSOUnAvailable") {
            callbackSsoUnavailable();
        } else if (json.authStatus !== "SSOFirstAccess") {
            if (ssoErrorCode === 11060002) {
                if (json.hasOwnProperty("dupTime")) ssoDuplication['time'] = json.dupTime;
                if (json.hasOwnProperty("dupIP")) ssoDuplication['ip'] = json.dupIP;
            }
            callbackLogonFail();    // 최초접속일때는 UI 보이지 않도록 하기 위함
        }
        if (timerCheckSSO === null && ssoErrorCode !== 11060002) {
            timerCheckSSO = setInterval(checkSSO, intervalCheckSSO);
            clearInterval(timerCheckLogon);
            timerCheckLogon = null;
            checkSSO();
        }
    }
}

function checkSSO() {
    $.ajax({
        type: 'POST',
        url: urlSSOCheckService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            if (status === "error") {
                ssoErrorMessage = "Failed check SSO. Please check connection."
                callbackLogonFail();
            }
        }
    });
}

function parseFromSSO(json) {
    ssoErrorCode = json.errorCode;
    ssoErrorMessage = json.errorMessage;
    ssoMisc = json.hasOwnProperty("misc") ? json.misc : null;
    if (json.result) {
        // continue sso
        var policyVersion = json.policyVersion;
        if (json.errorCode === 0) {
            // received logon data
            if (json.hasOwnProperty("pathESSO") && json.hasOwnProperty("artifactESSO"))
                webToEsso(json.pathESSO, json.artifactESSO);
            // moveUrl: clear not-authn cookies
            if (json.hasOwnProperty("moveUrl"))
                callMoveUrls(json);
            // authnGroup: authn of apps tied to a group
            if (json.hasOwnProperty("authnGroup"))
                authnGroup(json);
            gateUrl = json.hasOwnProperty("gateUrl") ? json.gateUrl : "";
            var ssoResponse = json.hasOwnProperty("ssoResponse") ? json.ssoResponse : "";
            var artifactId = json.hasOwnProperty("artifactID") ? json.artifactID : "";
            // login web-app
            console.log(ssoResponse + ", " + artifactId + ", " + policyVersion)
            logonWebApplication(ssoResponse, artifactId, policyVersion);
        } else if (json.errorCode === 11100028) {
            // Two Factor Authentication
            ssoTfa['remainCount'] = (json.hasOwnProperty("tfaRemainCount")) ? json.tfaRemainCount : -1;
            receiveTfa(json.tfaID, policyVersion);
        } else if (json.errorCode === 11060009) {
            // Choice Duplication
            temporaryDuplicationData = json.ssoRequest;
            receiveDuplication(json.ssoRequest, policyVersion);
        } else {
            if (!ssoErrorMessage)
                ssoErrorMessage = "Failed parsing data from SSO. (" + json.errorCode + ")";
            callbackLogonFail();
        }
    } else {
        // not-authenticated.
        if (json.hasOwnProperty("pathESSO")) {
            essoToWeb(json.pathESSO);
        } else {
            callbackLogonFail();
        }
    }
}

function webToEsso(pathESSO, artifactID) {
    $.ajax({
        type: 'GET',
        url: pathESSO + "essostatusjson",
        data: {
            time: new Date().getTime()
        },
        timeout: 1000,
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            if (json.supportESSO)
                webToEssoLogon(pathESSO, artifactID);
        },
        error: function (request, status, error) {
        }
    });
}

function webToEssoLogon(pathESSO, artifactID) {
    $.ajax({
        type: 'GET',
        url: pathESSO + "LogonArtifact",
        data: {
            time: new Date().getTime(),
            artifactID: artifactID
        },
        timeout: 1000,
        async: true,
        success: function (data) {
        },
        error: function (request, status, error) {
        }
    });
}

function essoToWeb(pathESSO) {
    $.ajax({
        type: 'GET',
        url: pathESSO + "essostatusjson",
        data: {
            time: new Date().getTime()
        },
        timeout: 1000,
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            if (json.supportESSO && json.supportLive)
                essoToWebArtifact(pathESSO);
            else
                callbackLogonFail();
        },
        error: function (request, status, error) {
            callbackLogonFail();
        }
    });
}

function essoToWebArtifact(pathESSO) {
    $.ajax({
        type: 'GET',
        url: pathESSO + "AppToWeb/AuthCheckJson",
        data: {
            time: new Date().getTime(),
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        timeout: 1000,
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            if (json.result)
                logonArtifact(json.artifactID);
            else
                callbackLogonFail();
        },
        error: function (request, status, error) {
            callbackLogonFail();
        }
    });
}

function callMoveUrls(json) {
    var moveUrls = json['moveUrl'];
    for (var i = 0; i < moveUrls.length; i++) {
        var moveUrl = moveUrls[i];
        $.ajax({
            type: 'POST'
            , url: moveUrl.url
            , xhrFields: {withCredentials: true}
            , headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'}
            , data: {
                ssosite: moveUrl.appId
                , returnURL: defaultUrl
                , op: 'NC'
            }
            , async: true
            , success: function (data) {
                var json = (typeof data === 'string' && data.trim() !== '') ? JSON.parse(data) : data;
                if (json) {
                    ssoErrorCode = json.errorCode;
                    ssoErrorMessage = json.errorMessage;
                }
            }
            , error: function (request, status, error) {
                ssoErrorMessage = "Failed clear of NA(not-authn) cookies. " + error;
            }
        });
    }
}

function authnGroup(json) {
    var authns = json['authnGroup'];
    for (var i = 0; i < authns.length; i++) {
        var authn = authns[i];
        var data = "";
        $.each(authn.params, function (i, v) {
            if (data !== "")
                data += "&"
            data += v.key + "=" + v.value;
        });
        $.ajax({
            type: 'POST'
            , url: authn.url
            , xhrFields: {withCredentials: true}
            , headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'}
            , data: data
            , async: true
            , success: function (data) {
            }
            , error: function (request, status, error) {
                ssoErrorMessage = "Failed authn group." + error;
            }
        });
    }
}

function logonWebApplication(ssoResponse, artifactId, pv) {
    $.ajax({
        type: 'POST',
        url: nssoConfigAgentBaseUri + nssoConfigPathLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            op: 'LI',   // login
            ssosite: ssosite,
            ssoResponse: ssoResponse,
            artifactID: artifactId,
            policyVersion: pv
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseCheckLogon(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon web-application. " + error;
        }
    });
}

function receiveTfa(tfaID, sv) {
    $.ajax({
        type: 'POST',
        url: nssoConfigAgentBaseUri + nssoConfigPathTfaReceive,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            tfaID: tfaID,
            policyVersion: sv
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseReceiveTfa(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon tfa. " + error;
        }
    });
}


function parseReceiveTfa(json) {
    ssoErrorCode = json.errorCode;
    ssoErrorMessage = json.errorMessage;
    if (json.result) {
        // continue sso
        if (json.errorCode === 0) {
            ssoTfa['userID'] = json.userID;
            ssoTfa['tfaID'] = json.tfaID;
            ssoTfa['targetYN'] = json.targetYN;
            //ssoTfa['device'] = json.device;
            ssoTfa['code'] = json.code;
            ssoTfa['method'] = json.method;
            ssoTfa['timeoutMinutes'] = json.timeoutMinutes;
            ssoMisc = json.hasOwnProperty("misc") ? json.misc : null;
            clearInterval(timerCheckSSO);
            callbackReceiveTfa();
        } else {
            if (!ssoErrorMessage)
                ssoErrorMessage = "Failed parsing tfa-data from SSO. (" + json.errorCode + ")";
        }
    }
}

function receiveDuplication(dupData, sv) {
    $.ajax({
        type: 'POST',
        url: nssoConfigAgentBaseUri + nssoConfigPathDupReceive,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            op: 'DU',       // DUP Receive
            ssoRequest: dupData,
            policyVersion: sv
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseReceiveDuplication(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon tfa. " + error;
        }
    });
}

function parseReceiveDuplication(json) {
    ssoErrorCode = json.errorCode;
    ssoErrorMessage = json.errorMessage;
    if (json.result) {
        // continue sso
        if (json.errorCode === 0) {
            ssoDuplication['userID'] = json.userID;
            ssoDuplication['time'] = json.time;
            ssoDuplication['ip'] = json.ip;
            ssoDuplication['timeoutMinutes'] = json.timeoutMinutes;
            temporaryDuplicationData = json.credential;
            clearInterval(timerCheckSSO);
            callbackReceiveDuplication();
        } else {
            if (!ssoErrorMessage)
                ssoErrorMessage = "Failed parsing duplication-data from SSO. (" + json.errorCode + ")";
        }
    }
}

function logonEnc(id, pw) {
    $.ajax({
        type: 'POST',
        url: "ssoagent/gen_key.jsp",
        data: {
            ssoRequest: new Date().getTime()
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            logonEncProcess(id, pw, json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon. " + error;
            callbackLogonFail();
        }
    });
}

function logonEncProcess(id, pw, publicKey) {
    var rsa = new RSAKey();
    rsa.setPublic(publicKey.modulus, publicKey.exponent);

    var enc_id = rsa.encrypt(id);
    var enc_pw = rsa.encrypt(pw);

    $.ajax({
        type: 'POST',
        url: urlSSOLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            userID: enc_id,
            password: enc_pw,
            credType: credTypeEncrypt,
            keyID: publicKey.id,
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon. " + error;
        }
    });
}

function logon(id, pw) {
    $.ajax({
        type: 'POST',
        url: urlSSOLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            userID: id,
            password: pw,
            credType: credTypeDefault,
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon. " + error;
        }
    });
}

function logonArtifact(artifactID) {
    $.ajax({
        type: 'POST',
        url: urlSSOLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            artifactID: artifactID,
            targetID: ssosite,
            credType: credTypeArtifact
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon. " + error;
        }
    });
}

function logonTfa(secretCode) {
    $.ajax({
        type: 'POST',
        url: urlSSOLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            // userID: ssoTfa['userID'],
            tfaID: ssoTfa['tfaID'],
            code: secretCode,
            credType: "NTFA",
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        async: true,
        success: function (data) {
            var json = (typeof data == 'string') ? JSON.parse(data) : data;
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon(TFA). " + error;
        }
    });
}

function dupChoiceLogon() {
    $.ajax({
        type: 'POST',
        url: urlSSOLogonService,
        xhrFields: {withCredentials: true},
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'SSOAgent-Type': 'SPA'},
        data: {
            credential: temporaryDuplicationData,
            credType: "DUPCHOICE",
            ssosite: ssosite,
            returnURL: defaultUrl
        },
        async: true,
        success: function (json) {
            temporaryDuplicationData = "";
            parseFromSSO(json);
        },
        error: function (request, status, error) {
            ssoErrorMessage = "Failed logon(Dup). " + error;
        }
    });
}

function dupChoiceCancel() {
    callbackLogonFail();
}

function disableTimer() {
    if (timerCheckLogon !== null) {
        clearInterval(timerCheckLogon);
        timerCheckLogon = null;
    }
    if (timerCheckSSO !== null) {
        clearInterval(timerCheckSSO);
        timerCheckSSO = null;
    }
}

String.prototype.startsWith = function (str) {
    if (this.length < str.length) {
        return false;
    }
    return this.indexOf(str) === 0;
};
String.prototype.endsWith = function (str) {
    if (this.length < str.length) {
        return false;
    }
    return this.lastIndexOf(str) + str.length === this.length;
};