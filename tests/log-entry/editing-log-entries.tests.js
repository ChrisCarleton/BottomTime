/* eslint max-statements: 0 */

import { By, until } from 'selenium-webdriver';
import driver from '../web-driver';
import { expect } from 'chai';
import faker from 'faker';
import mockApis, { exampleUser, logEntries } from '../webapp/mock-apis';
import sinon from 'sinon';

const NewEntryUrl = mockApis.resolveUrl('/logs/jake_smith/new');
const EntryUrl = mockApis.resolveUrl(`/logs/jake_smith/${ logEntries[0].entryId }`);

async function refreshPage(url) {
	await driver.navigate().to(url);
	await driver.wait(until.elementLocated(By.id('location')));
}

describe('Editing Log Entries', () => {
	let authStub = null;
	const LongString = faker.lorem.sentences(8).substr(0, 190);

	describe('Validation', () => {
		let stub = null;

		before(() => {
			authStub = sinon.stub(mockApis, 'getAuthMe');
			authStub.callsFake((req, res) => {
				res.json(exampleUser);
			});
		});

		beforeEach(async () => {
			await refreshPage(NewEntryUrl);
		});

		afterEach(() => {
			if (stub) {
				stub.restore();
				stub = null;
			}
		});

		after(() => {
			authStub.restore();
		});

		it('Dive number must be a number', async () => {
			await driver.findElement(By.id('diveNumber')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-diveNumber'));
		});

		it('Dive number must be positive', async () => {
			await driver.findElement(By.id('diveNumber')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-diveNumber'));
		});

		it('Will not allow location to be longer than 200 characters', async () => {
			const logEntry = {
				...logEntries[0],
				location: LongString
			};
			stub = sinon.stub(mockApis, 'getUsersUsernameLogsLogId');
			stub.callsFake((req, res) => {
				res.json(logEntry);
			});

			await driver.navigate().to(EntryUrl);
			await driver.wait(until.elementLocated(By.id('location')));
			const element = await driver.findElement(By.id('location'));
			await element.sendKeys(faker.lorem.sentence(15));
			const value = await element.getAttribute('value');
			expect(value).to.have.lengthOf(200);
		});

		it('Will not allow site to be longer than 200 characters', async () => {
			const logEntry = {
				...logEntries[0],
				site: LongString
			};
			stub = sinon.stub(mockApis, 'getUsersUsernameLogsLogId');
			stub.callsFake((req, res) => {
				res.json(logEntry);
			});

			await driver.navigate().to(EntryUrl);
			await driver.wait(until.elementLocated(By.id('location')));
			const element = await driver.findElement(By.id('site'));
			await element.sendKeys(faker.lorem.sentence(15));
			const value = await element.getAttribute('value');
			expect(value).to.have.lengthOf(200);
		});

		it('Entry time must be valid', async () => {
			await driver.findElement(By.id('entryTime')).sendKeys('not a valid date');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-entryTime'));
		});

		it('Bottom time must be a number', async () => {
			await driver.findElement(By.id('bottomTime')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-bottomTime'));
		});

		it('Bottom time must be positive', async () => {
			await driver.findElement(By.id('bottomTime')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-bottomTime'));
		});

		it('Total time must be a number', async () => {
			await driver.findElement(By.id('totalTime')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-totalTime'));
		});

		it('Total time must be positive', async () => {
			await driver.findElement(By.id('totalTime')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-totalTime'));
		});

		it('Total time must be greater than or equal to bottom time', async () => {
			await driver.findElement(By.id('bottomTime')).sendKeys('31');
			await driver.findElement(By.id('totalTime')).sendKeys('30.6');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-totalTime')));
		});

		it('Surface interval must be a number', async () => {
			await driver.findElement(By.id('surfaceInterval')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-surfaceInterval'));
		});

		it('Surface interval must be positive', async () => {
			await driver.findElement(By.id('surfaceInterval')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-surfaceInterval'));
		});

		it('Latitude must be a number', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('nope');
			await driver.findElement(By.id('gps.longitude')).sendKeys('114.38484');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.latitude')));
		});

		it('Latitude cannot be less than -90.0 degrees', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('-90.32324');
			await driver.findElement(By.id('gps.longitude')).sendKeys('114.38484');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.latitude')));
		});

		it('Latitude cannot be more than 90 degrees', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('90.5373582');
			await driver.findElement(By.id('gps.longitude')).sendKeys('114.38484');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.latitude')));
		});

		it('longitude must be a number', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('14.38394');
			await driver.findElement(By.id('gps.longitude')).sendKeys('nope');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.longitude')));
		});

		it('longitude cannot be less than -180 degrees', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('14.38394');
			await driver.findElement(By.id('gps.longitude')).sendKeys('-180.45782575');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.longitude')));
		});

		it('longitude cannot be more than 180 degrees', async () => {
			await driver.findElement(By.id('gps.latitude')).sendKeys('14.38394');
			await driver.findElement(By.id('gps.longitude')).sendKeys('180.35735735');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.longitude')));
		});

		it('if longitude is entered, latitude must also be present', async () => {
			await driver.findElement(By.id('location')).sendKeys('Roatan');
			await driver.findElement(By.id('site')).sendKeys('Mary\'s Place');
			await driver.findElement(By.id('entryTime')).sendKeys('2016-02-04 10:30AM');
			await driver.findElement(By.id('maxDepth')).sendKeys('80');
			await driver.findElement(By.id('bottomTime')).sendKeys('38');
			await driver.findElement(By.id('gps.longitude')).sendKeys('17.32828');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.latitude')));
		});

		it('if latitude is entered, longitude must also be present', async () => {
			await driver.findElement(By.id('location')).sendKeys('Roatan');
			await driver.findElement(By.id('site')).sendKeys('Mary\'s Place');
			await driver.findElement(By.id('entryTime')).sendKeys('2016-02-04 10:30AM');
			await driver.findElement(By.id('maxDepth')).sendKeys('80');
			await driver.findElement(By.id('bottomTime')).sendKeys('38');
			await driver.findElement(By.id('gps.latitude')).sendKeys('14.38394');
			await driver.findElement(By.id('btn-save')).click();
			await driver.wait(until.elementLocated(By.id('err-gps.longitude')));
		});

		it('Average depth must be a number', async () => {
			await driver.findElement(By.id('averageDepth')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-averageDepth'));
		});

		it('Average depth must be positive', async () => {
			await driver.findElement(By.id('averageDepth')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-averageDepth'));
		});

		it('Max depth must be a number', async () => {
			await driver.findElement(By.id('maxDepth')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-maxDepth'));
		});

		it('Max depth must be positive', async () => {
			await driver.findElement(By.id('maxDepth')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-maxDepth'));
		});

		it('Max depth cannot be less than average depth', async () => {
			await driver.findElement(By.id('averageDepth')).sendKeys('24');
			await driver.findElement(By.id('maxDepth')).sendKeys('23.8');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-maxDepth'));
		});

		it('Safety stop depth must be a number', async () => {
			await driver.findElement(By.id('decoStops[0].depth')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-decoStops[0].depth'));
		});

		it('Safety stop depth must be positive', async () => {
			await driver.findElement(By.id('decoStops[0].depth')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-decoStops[0].depth'));
		});

		it('Safety stop duration must be a number', async () => {
			await driver.findElement(By.id('decoStops[0].duration')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-decoStops[0].duration'));
		});

		it('Safety stop duration must be positive', async () => {
			await driver.findElement(By.id('decoStops[0].duration')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-decoStops[0].duration'));
		});

		it('Start pressure must be a number', async () => {
			await driver.findElement(By.id('air[0].in')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-air[0].in'));
		});

		it('Start pressure must be positive', async () => {
			await driver.findElement(By.id('air[0].in')).sendKeys('0');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-air[0].in'));
		});

		it('End pressure must be a number', async () => {
			await driver.findElement(By.id('air[0].out')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-air[0].out'));
		});

		it('End pressure cannot be negative', async () => {
			await driver.findElement(By.id('air[0].out')).sendKeys('-1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-air[0].out'));
		});

		it('End pressure cannot be greater than start pressure', async () => {
			await driver.findElement(By.id('air[0].in')).sendKeys('200');
			await driver.findElement(By.id('air[0].out')).sendKeys('210');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-air[0].in'));
		});

		[ 'belt', 'integrated', 'backplate', 'ankles', 'other' ].forEach(w => {
			it(`${ w } weight must be a number`, async () => {
				await driver.findElement(By.id(`weight.${ w }`)).sendKeys('lol');
				await driver.findElement(By.id('btn-save')).click();
				await driver.findElement(By.id(`err-weight.${ w }`));
			});

			it(`${ w } weight must be positive`, async () => {
				await driver.findElement(By.id(`weight.${ w }`)).sendKeys('-0.1');
				await driver.findElement(By.id('btn-save')).click();
				await driver.findElement(By.id(`err-weight.${ w }`));
			});
		});

		it('Comments cannot be more than 1000 characters', async () => {
			const SuperLongEssay = faker.lorem.paragraphs(8).substr(0, 995);
			const logEntry = {
				...logEntries[0],
				comments: SuperLongEssay
			};
			stub = sinon.stub(mockApis, 'getUsersUsernameLogsLogId');
			stub.callsFake((req, res) => {
				res.json(logEntry);
			});

			await driver.navigate().to(EntryUrl);
			await driver.wait(until.elementLocated(By.id('location')));
			const commentsTextBox = await driver.findElement(By.id('comments'));
			await commentsTextBox.sendKeys('This will push it over the max');
			const value = await commentsTextBox.getAttribute('value');
			expect(value).to.have.lengthOf(1000);
		});
	});

	describe('Temperature field validation', () => {
		function setUserTempUnit(temperatureUnit) {
			const user = {
				...exampleUser,
				temperatureUnit
			};

			authStub = sinon.stub(mockApis, 'getAuthMe');
			authStub.callsFake((req, res) => {
				res.json(user);
			});
		}

		afterEach(() => {
			authStub.restore();
			authStub = null;
		});

		it('Surface temperature must be a number', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.surface')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.surface'));
		});

		it('Surface temperature cannot be less than -2C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.surface')).sendKeys('-2.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.surface'));
		});

		it('Surface temperature cannot be greater than 50C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.surface')).sendKeys('50.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.surface'));
		});

		it('Surface temperature cannot be less than 28.4F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.surface')).sendKeys('28.3');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.surface'));
		});

		it('Surface temperature cannot be more than 120F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.surface')).sendKeys('120.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.surface'));
		});

		it('Water temperature must be a number', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.water')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.water'));
		});

		it('Water temperature cannot be less than -2C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.water')).sendKeys('-2.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.water'));
		});

		it('Water temperature cannot be greater than 50C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.water')).sendKeys('50.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.water'));
		});

		it('Water temperature cannot be less than 28.4F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.water')).sendKeys('28.3');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.water'));
		});

		it('Water temperature cannot be more than 120F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.water')).sendKeys('120.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.water'));
		});

		it('Thermocline temperature must be a number', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.thermoclines[0].temperature')).sendKeys('seven');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.thermoclines[0].temperature'));
		});

		it('Thermocline temperature cannot be less than -2C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.thermoclines[0].temperature')).sendKeys('-2.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.thermoclines[0].temperature'));
		});

		it('Thermocline temperature cannot be greater than 50C', async () => {
			setUserTempUnit('c');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.thermoclines[0].temperature')).sendKeys('50.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.thermoclines[0].temperature'));
		});

		it('Thermocline temperature cannot be less than 28.4F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.thermoclines[0].temperature')).sendKeys('28.3');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.thermoclines[0].temperature'));
		});

		it('Thermocline temperature cannot be more than 120F', async () => {
			setUserTempUnit('f');
			await refreshPage(NewEntryUrl);
			await driver.findElement(By.id('temperature.thermoclines[0].temperature')).sendKeys('120.1');
			await driver.findElement(By.id('btn-save')).click();
			await driver.findElement(By.id('err-temperature.thermoclines[0].temperature'));
		});
	});

	describe('Discard changes', () => {
		before(() => {
			authStub = sinon.stub(mockApis, 'getAuthMe');
			authStub.callsFake((req, res) => {
				res.json(exampleUser);
			});
		});

		after(() => {
			authStub.restore();
			authStub = null;
		});

		it('Will restore a saved entry back to its saved state', async () => {
			await refreshPage(EntryUrl);
			const [ location, averageDepth, weightAmount ] = await Promise.all([
				driver.findElement(By.id('location')),
				driver.findElement(By.id('averageDepth')),
				driver.findElement(By.id('weight.belt'))
			]);

			await location.clear();
			await averageDepth.clear();
			await weightAmount.clear();

			await location.sendKeys('Cozumel');
			await averageDepth.sendKeys('17.6');
			await weightAmount.sendKeys('2.6');

			await driver.findElement(By.id('btn-reset')).click();
			await driver.wait(until.elementLocated(By.id('btn-confirm')));
			await driver.findElement(By.id('btn-confirm')).click();
			await driver.wait(until.elementLocated(By.id('global-error-bar')));

			const [ locationValue, averageDepthValue, weightAmountValue ] = await Promise.all([
				driver.findElement(By.id('location')).getAttribute('value'),
				driver.findElement(By.id('averageDepth')).getAttribute('value'),
				driver.findElement(By.id('weight.belt')).getAttribute('value')
			]);

			expect(locationValue).to.equal(logEntries[0].location);
			expect(parseFloat(averageDepthValue)).to.equal(logEntries[0].averageDepth);
			expect(parseFloat(weightAmountValue)).to.equal(logEntries[0].weight.belt);
		});

		it('Will restore a new entry back to a blank document', async () => {
			await refreshPage(NewEntryUrl);
			const [ location, averageDepth, weightAmount ] = await Promise.all([
				driver.findElement(By.id('location')),
				driver.findElement(By.id('averageDepth')),
				driver.findElement(By.id('weight.integrated'))
			]);

			await location.clear();
			await averageDepth.clear();
			await weightAmount.clear();

			await location.sendKeys('Cozumel');
			await averageDepth.sendKeys('17.6');
			await weightAmount.sendKeys('2.2');

			await driver.findElement(By.id('btn-reset')).click();
			await driver.wait(until.elementLocated(By.id('btn-confirm')));
			await driver.findElement(By.id('btn-confirm')).click();
			await driver.wait(until.elementLocated(By.id('global-error-bar')));

			const [ locationValue, averageDepthValue, weightAmountValue ] = await Promise.all([
				driver.findElement(By.id('location')).getAttribute('value'),
				driver.findElement(By.id('averageDepth')).getAttribute('value'),
				driver.findElement(By.id('weight.integrated')).getAttribute('value')
			]);

			expect(locationValue).to.equal('');
			expect(averageDepthValue).to.equal('');
			expect(weightAmountValue).to.equal('');
		});

		it('Will do nothing if cancelled', async () => {
			const expectedLocation = 'Cozumel';
			const expectedAverageDepth = '17.6';
			const expectedWeightAmount = '4.8';

			await refreshPage(NewEntryUrl);
			const [ location, averageDepth, weightAmount ] = await Promise.all([
				driver.findElement(By.id('location')),
				driver.findElement(By.id('averageDepth')),
				driver.findElement(By.id('weight.backplate'))
			]);

			await location.clear();
			await averageDepth.clear();
			await weightAmount.clear();

			await location.sendKeys(expectedLocation);
			await averageDepth.sendKeys(expectedAverageDepth);
			await weightAmount.sendKeys(expectedWeightAmount);

			await driver.findElement(By.id('btn-reset')).click();
			await driver.wait(until.elementLocated(By.id('btn-confirm')));
			await driver.findElement(By.id('btn-cancel')).click();

			const [ locationValue, averageDepthValue, weightAmountValue ] = await Promise.all([
				driver.findElement(By.id('location')).getAttribute('value'),
				driver.findElement(By.id('averageDepth')).getAttribute('value'),
				driver.findElement(By.id('weight.backplate')).getAttribute('value')
			]);

			expect(locationValue).to.equal(expectedLocation);
			expect(averageDepthValue).to.equal(expectedAverageDepth);
			expect(weightAmountValue).to.equal(expectedWeightAmount);
		});
	});
});
