var msalJs = document.createElement("script");
msalJs.src = "https://alcdn.msauth.net/browser/2.38.1/js/msal-browser.min.js";
document.getElementsByTagName("head")[0].appendChild(msalJs);

var msalInstance;

msalJs.onload = function() {
  initializeMsal();
};

function initializeMsal() {
  const msalConfig = {
    auth: {
      clientId: "8a950f54-f491-4831-93f1-e93715569a7f",
      authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
      redirectUri: window.location.origin + window.location.pathname
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false
    }
  };

  msalInstance = new msal.PublicClientApplication(msalConfig);

  msalInstance.handleRedirectPromise()
    .then(response => {
      if (response) {
        displayUserInfo();
      } else {
        displayUserInfo();
      }
    })
    .catch(err => {
      console.error("Redirect error:", err);
      document.getElementById("api_response").textContent = err.message || err;
      document.getElementById("loginModal").style.display = "block";
    });
}

function initAuth(title) {
  document.getElementsByTagName("body")[0].innerHTML += `
    <div id="loginModal" style="display: none">
      <div>
        <span id="api_response"></span>
        <a href="#" onclick="loginRedirect(); return false;">Log in</a>
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
              <a href="#" onclick="logoutRedirect(); return false;">Log out</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  var checkMsalReady = setInterval(function() {
    if (msalInstance) {
      clearInterval(checkMsalReady);
      displayUserInfo();
    }
  }, 100);
}

function displayUserInfo() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    document.getElementById("username").textContent = accounts[0].username;
    document.getElementById("loginModal").style.display = "none";
  } else {
    document.getElementById("username").textContent = "Not signed in.";
  }
}

function loginRedirect() {
  const loginRequest = {
    scopes: ["https://help.kusto.windows.net/.default"]
  };
  msalInstance.loginRedirect(loginRequest);
}

function logoutRedirect() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const logoutRequest = {
      account: accounts[0],
      postLogoutRedirectUri: window.location.origin + window.location.pathname
    };
    msalInstance.logoutRedirect(logoutRequest);
  }
}

var getTsiTokenInterval = setInterval(function() {
  if (msalInstance) {
    clearInterval(getTsiTokenInterval);
    
    msalInstance.getTsiToken = async function () {
      document.getElementById("api_response2").textContent = "Getting ADX token...";
      
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        document.getElementById("api_response").textContent = "No user signed in. Please log in first.";
        document.getElementById("loginModal").style.display = "block";
        document.getElementById("api_response2").textContent = "";
        throw new Error("No user signed in");
      }

      const tokenRequest = {
        scopes: ["https://help.kusto.windows.net/.default"],
        account: accounts[0]
      };

      try {
        const response = await msalInstance.acquireTokenSilent(tokenRequest);
        document.getElementById("api_response").textContent = "";
        document.getElementById("api_response2").textContent = "";
        document.getElementById("loginModal").style.display = "none";
        return response.accessToken;
      } catch (error) {
        if (error instanceof msal.InteractionRequiredAuthError) {
          try {
            const response = await msalInstance.acquireTokenPopup(tokenRequest);
            document.getElementById("api_response").textContent = "";
            document.getElementById("api_response2").textContent = "";
            document.getElementById("loginModal").style.display = "none";
            return response.accessToken;
          } catch (popupError) {
            console.error("Token acquisition error:", popupError);
            document.getElementById("api_response").textContent = popupError.message || popupError;
            document.getElementById("loginModal").style.display = "block";
            document.getElementById("api_response2").textContent = "";
            throw popupError;
          }
        } else {
          console.error("Token acquisition error:", error);
          document.getElementById("api_response").textContent = error.message || error;
          document.getElementById("loginModal").style.display = "block";
          document.getElementById("api_response2").textContent = "";
          throw error;
        }
      }
    };
  }
}, 100);

var authContext = {
  getTsiToken: function() {
    if (msalInstance && msalInstance.getTsiToken) {
      return msalInstance.getTsiToken();
    } else {
      return new Promise((resolve, reject) => {
        var waitForMsal = setInterval(function() {
          if (msalInstance && msalInstance.getTsiToken) {
            clearInterval(waitForMsal);
            msalInstance.getTsiToken().then(resolve).catch(reject);
          }
        }, 100);
      });
    }
  },
  login: loginRedirect,
  logOut: logoutRedirect
};
