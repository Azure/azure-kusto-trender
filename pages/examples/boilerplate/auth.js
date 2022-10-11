var adalJs = document.createElement("script");
adalJs.src =
  "https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal.min.js";

document.getElementsByTagName("head")[0].appendChild(adalJs);

function initAuth(title) {
  document.getElementsByTagName(
    "body"
  )[0].innerHTML += `<div id="loginModal" style="display: none">
        <div>
            <span id="api_response"></span>
            <a href="#" onclick="authContext.login(); return false;">Log in</a>
        </div>
    </div>
    <div style="position: absolute; top: 0; width: 100%;">
        <div class="header">
            ${title}
            <pre id="api_response2"></pre>
            <div class="rightSide">
                <div id="username"></div>
                <div class="loginLogout">
                    <p>
                        <a href="#" onclick="authContext.logOut(); return false;">Log out</a>
                    </p>
                </div>
            </div>
        </div>
    </div>`;

  var authContextProperties = {
    clientId: "b5f3b2a2-0ec3-4c9d-adfd-447e528f24ac",
    cacheLocation: "localStorage",
  };
  authContext = new AuthenticationContext(authContextProperties);

  if (authContext.isCallback(window.location.hash)) {
    // Handle redirect after token requests
    authContext.handleWindowCallback();
    var err = authContext.getLoginError();
    if (err) {
      // TODO: Handle errors signing in and getting tokens
      document.getElementById("api_response").textContent = err;
      document.getElementById("loginModal").style.display = "block";
    }
  } else {
    var user = authContext.getCachedUser();
    if (user) {
      document.getElementById("username").textContent = user.userName;
    } else {
      document.getElementById("username").textContent = "Not signed in.";
    }
  }

  authContext.getTsiToken = function () {
    document.getElementById("api_response2").textContent =
      "Getting ADX token...";

    // Get an access token to the Microsoft ADX API
    var promise = new Promise(function (resolve, reject) {
      authContext.acquireToken(
        "https://help.kusto.windows.net/",
        function (error, token) {
          if (error || !token) {
            // TODO: Handle error obtaining access token
            document.getElementById("api_response").textContent = error;
            document.getElementById("loginModal").style.display = "block";
            document.getElementById("api_response2").textContent = "";
            return;
          }
          // Use the access token
          document.getElementById("api_response").textContent = "";
          document.getElementById("api_response2").textContent = "";
          document.getElementById("loginModal").style.display = "none";
          resolve(token);
        }
      );
    });

    return promise;
  };
}
