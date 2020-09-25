
      var data;
      var theGapi;
      var game_out = ["idtest", "0", "pseudotest", "0", "0", "0", "0", "0","idtest", "0", "pseudotest", "0", "0", "0", "0", "0"];

      var CLIENT_ID ="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com";
      var API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

      var DISCOVERY_DOCS = [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ];
      var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

      var authorizeButton = document.getElementById("authorize_button");
      var signoutButton = document.getElementById("signout_button");

       /**
       *  lance l'API et l'initialisation du client
       * */
      function handleClientLoad() {
        gapi.load("client", initClient);
      }

       /**
       *  Initialise le client API et met en place la connection
       * */
      function initClient() {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
          .then( async () => {
              theGapi = gapi;
              const range = await listData();
              data = range.values;
              getListPlayer(getUsers(data));
          }).catch( err =>{ 
            console.log(err);
          } );
        }

      /**
       *  Recupere toute les informations presentes dans la base de donné et retourne un tableau.
       * */
      function listData() {
        return new Promise((resolve, reject) => {
          gapi.client.sheets.spreadsheets.values
            .get({
              spreadsheetId: "18x0Vjb_BTGE5trVHf7hbMOEuLGnAtS-WwuslFqH3DYs",
              range: "Users",
            })
            .then((response) => {
              return resolve(response.result);
            })
            .catch((err) => reject(err));
        });
      }

      /**
       *  Ajoute une ligne dans la BDD, feuille 'Games'.
       *  @param tableau dans l'ordre des colonnes de la BDD.
       * */
      async function addrow(table) {
        //Split en deux le tableau passé en parametre.
        lengthmax = table.length ;
        var Joueur1 = [];
        var Joueur2 = [];
        for (let i = 0; i < lengthmax / 2 ; i++) {
          Joueur1[i] = table[i];
          Joueur2[i] = table[i+lengthmax/2]
        }
        theGapi.client.sheets.spreadsheets.values
          .append({
            spreadsheetId: "18x0Vjb_BTGE5trVHf7hbMOEuLGnAtS-WwuslFqH3DYs",
            range: "Historique de jeux!A1:C3",
            insertDataOption: "INSERT_ROWS",
            valueInputOption: "RAW",
            resource: {
              values: [
                Joueur1,
                Joueur2
              ],
            },
          })
          .then((response) => {
            var result = response.result;
            console.log(`cells added.`);
          });
      }

      /**
       * Recupere un tableau avec tout les pseudos des joueurs, feuille 'Users'.
       * @param tableau dans l'ordre des colonnes de la BDD.
       * */
      function getUsers(table) {
        users = [];
        for (i = 1; i < table.length; i++) 
            users[i] = table[i][5];
        return users;
      }
