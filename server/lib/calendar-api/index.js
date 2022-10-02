// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const { authenticate } = require('@google-cloud/local-auth');
// const { google } = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
// 	try {
// 		const content = await fs.readFile(TOKEN_PATH);
// 		const credentials = JSON.parse(content);
// 		return google.auth.fromJSON(credentials);
// 	} catch (err) {
// 		return null;
// 	}
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
// 	const content = await fs.readFile(CREDENTIALS_PATH);
// 	const keys = JSON.parse(content);
// 	const key = keys.installed || keys.web;
// 	const payload = JSON.stringify({
// 		type: 'authorized_user',
// 		client_id: key.client_id,
// 		client_secret: key.client_secret,
// 		refresh_token: client.credentials.refresh_token,
// 	});
// 	await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
// 	let client = await loadSavedCredentialsIfExist();
// 	if (client) {
// 		return client;
// 	}
// 	client = await authenticate({
// 		scopes: SCOPES,
// 		keyfilePath: CREDENTIALS_PATH,
// 	});
// 	if (client.credentials) {
// 		await saveCredentials(client);
// 	}
// 	return client;
// }

// /**
//  * Lists the next 10 events on the user's primary calendar.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// async function listEvents(auth) {
// 	const calendar = google.calendar({ version: 'v3', auth });
// 	const res = await calendar.events.list({
// 		calendarId: 'primary',
// 		timeMin: new Date().toISOString(),
// 		maxResults: 10,
// 		singleEvents: true,
// 		orderBy: 'startTime',
// 	});
// 	const events = res.data.items;
// 	if (!events || events.length === 0) {
// 		console.log('No upcoming events found.');
// 		return;
// 	}
// 	console.log('Upcoming 10 events:');
// 	events.map((event, i) => {
// 		const start = event.start.dateTime || event.start.date;
// 		console.log(`${start} - ${event.summary}`);
// 	});
// }

// authorize().then(listEvents).catch(console.error);


//index.js code for integrating Google Calendar

const config = require('config');
const { google } = require('googleapis');



const SCOPES = config.get('calendarAPIConfig').SCOPES;
const GOOGLE_PRIVATE_KEY = config.get('calendarAPIConfig').GOOGLE_PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = config.get('calendarAPIConfig').GOOGLE_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = config.get('calendarAPIConfig').GOOGLE_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = config.get('calendarAPIConfig').GOOGLE_CALENDAR_ID;


const jwtClient = new google.auth.JWT(
	GOOGLE_CLIENT_EMAIL,
	null,
	GOOGLE_PRIVATE_KEY,
	SCOPES
);

const calendar = google.calendar({
	version: 'v3',
	project: GOOGLE_PROJECT_NUMBER,
	auth: jwtClient
});

const getCalendarEvents = async (req, res) => {
	calendar.events.list({
		calendarId: GOOGLE_CALENDAR_ID,
		timeMin: (new Date()).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	}, (error, result) => {
		if (error) {
			res.send(JSON.stringify({ error: error }));
		} else {
			if (result.data.items.length) {
				res.send(JSON.stringify({ events: result.data.items }));
			} else {
				res.send(JSON.stringify({ message: 'No upcoming events found.' }));
			}
		}
	})
};
module.exports.getCalendarEvents = getCalendarEvents;

