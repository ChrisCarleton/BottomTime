import { Col, Row } from 'react-flexbox-grid';
import { Glyphicon } from 'react-bootstrap';
import config from '../../config';
import connectToStores from 'alt-utils/lib/connectToStores';
import CurrentUserStore from '../../users/stores/current-user-store';
import Formsy from 'formsy-react';
import moment from 'moment';
import React from 'react';
import StaticField from '../../components/static-field';
import { ToPreferredUnits } from '../../unit-conversion';
import PropTypes from 'prop-types';

const Unspecified = 'Unspecified';

class ViewLogEntry extends React.Component {
	static getStores() {
		return [ CurrentUserStore ];
	}

	static getPropsFromStores() {
		return {
			currentUser: CurrentUserStore.getState().currentUser
		};
	}

	renderValueWithUnit(value, unit = ' minutes') {
		return value || value === 0 ? `${ value }${ unit }` : null;
	}

	renderTankSize(size) {
		return size || size === 0 ? `${ size }L` : null;
	}

	renderDepth(value) {
		if (!value && value !== 0) {
			return null;
		}

		const converted = ToPreferredUnits
			.Distance[this.props.currentUser.distanceUnit](value)
			.toFixed(2);
		return `${ converted }${ this.props.currentUser.distanceUnit }`;
	}

	renderTemperature(value) {
		if (!value && value !== 0) {
			return null;
		}

		const converted = ToPreferredUnits
			.Temperature[this.props.currentUser.temperatureUnit](value)
			.toFixed(2);
		return `${ converted }${ this.props.currentUser.temperatureUnit === 'c' ? '°C' : '°F' }`;
	}

	renderPressure(value) {
		if (!value && value !== 0) {
			return null;
		}

		const converted = ToPreferredUnits
			.Pressure[this.props.currentUser.pressureUnit](value)
			.toFixed(2);
		return `${ converted }${ this.props.currentUser.pressureUnit }`;
	}

	renderWeight(value) {
		if (!value && value !== 0) {
			return null;
		}

		const converted = ToPreferredUnits
			.Weight[this.props.currentUser.weightUnit](value)
			.toFixed(2);
		return `${ converted }${ this.props.currentUser.weightUnit }`;
	}

	/* eslint-disable complexity */
	render() {
		const { currentEntry } = this.props;
		const gps = currentEntry.gps || {};
		const weight = currentEntry.weight || {};

		const air = currentEntry.air || [];
		air[0] = air[0] || {};

		const temperature = currentEntry.temperature || {};
		temperature.thermoclines = temperature.thermoclines || [];
		temperature.thermoclines[0] = temperature.thermoclines[0] || {};

		const decoStops = currentEntry.decoStops || [];
		decoStops[0] = decoStops[0] || {};

		const latitude = gps.latitude
			? `${ Math.abs(gps.latitude) } °${ gps.latitude >= 0 ? 'N' : 'S' }`
			: null;
		const longitude = gps.longitude
			? `${ Math.abs(gps.longitude) } °${ gps.longitude >= 0 ? 'E' : 'W' }`
			: null;

		return (
			<div>
				<Formsy>
					<Row>
						<Col sm={ 12 } md={ 6 }>
							<StaticField
								controlId="diveNumber"
								name="diveNumber"
								label="diveNumber"
								value={ currentEntry.diveNumber }
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 }>
							<h4><Glyphicon glyph="map-marker" />&nbsp;Time and Location</h4>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 } md={ 6 }>
							<StaticField
								controlId="location"
								name="location"
								label="Location"
								value={ currentEntry.location }
							/>
							<StaticField
								controlId="site"
								name="site"
								label="Dive site"
								value={ currentEntry.site }
							/>
							<StaticField
								controlId="entryTime"
								name="entryTime"
								label="Entry time"
								value={
									moment(currentEntry.entryTime)
										.local()
										.format(config.entryTimeFormat)
								}
							/>
							<StaticField
								controlId="bottomTime"
								name="bottomTime"
								label="Bottom time"
								value={ this.renderValueWithUnit(currentEntry.bottomTime) }
								default={ Unspecified }
							/>
							<StaticField
								controlId="totalTime"
								name="totalTime"
								label="Total time"
								value={ this.renderValueWithUnit(currentEntry.totalTime) }
								default={ Unspecified }
							/>
							<StaticField
								controlId="surfaceInterval"
								name="surfaceInterval"
								label="Surface interval"
								value={ this.renderValueWithUnit(currentEntry.surfaceInterval) }
								default={ Unspecified }
							/>
						</Col>
						<Col sm={ 12 } md={ 6 }>
							<strong>GPS</strong>
							<StaticField
								controlId="gps.latitude"
								name="gps.latitude"
								label="Latitude"
								default={ Unspecified }
								value={ latitude }
							/>
							<StaticField
								controlId="gps.longitude"
								name="gps.longitude"
								label="Longitude"
								default={ Unspecified }
								value={ longitude }
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 }>
							<h4><Glyphicon glyph="dashboard" />&nbsp;Dive Info</h4>
						</Col>
					</Row>
					<Row>
						<Col md={ 6 } sm={ 12 }>
							<StaticField
								controlId="averageDepth"
								name="averageDepth"
								label="Average depth"
								value={ this.renderDepth(currentEntry.averageDepth) }
								default={ Unspecified }
							/>
							<StaticField
								controlId="maxDepth"
								name="maxDepth"
								label="Max. depth"
								value={ this.renderDepth(currentEntry.maxDepth) }
								default={ Unspecified }
							/>
							<strong>Weight</strong>
							<StaticField
								controlId="weight.belt"
								name="weight.belt"
								label="Weight belt"
								default={ Unspecified }
								value={ this.renderWeight(weight.belt) }
							/>
							<StaticField
								controlId="weight.integrated"
								name="weight.integrated"
								label="Integrated pockets"
								default={ Unspecified }
								value={ this.renderWeight(weight.integrated) }
							/>
							<StaticField
								controlId="weight.backplate"
								name="weight.backplate"
								label="Backplate/Trim"
								default={ Unspecified }
								value={ this.renderWeight(weight.backplate) }
							/>
							<StaticField
								controlId="weight.ankles"
								name="weight.ankles"
								label="Ankle weights"
								default={ Unspecified }
								value={ this.renderWeight(weight.ankles) }
							/>
							<StaticField
								controlId="weight.other"
								name="weight.other"
								label="Other weight"
								default={ Unspecified }
								value={ this.renderWeight(weight.other) }
							/>
							<StaticField
								controlId="weight.correctness"
								name="weight.correctness"
								label="Correctness"
								default={ Unspecified }
								value={ weight.correctness }
							/>
							<StaticField
								controlId="weight.trim"
								name="weight.trim"
								label="Trim"
								default={ Unspecified }
								value={ weight.trim }
							/>
							<strong>Safety Stop</strong>
							<StaticField
								controlId="decoStops[0].depth"
								name="decoStops[0].depth"
								label="Depth"
								default={ Unspecified }
								value={ this.renderDepth(decoStops[0].depth) }
							/>
							<StaticField
								controlId="decoStops[0].duration"
								name="decoStops[0].duration"
								label="Duration"
								default={ Unspecified }
								value={ this.renderValueWithUnit(decoStops[0].duration) }
							/>
						</Col>
						<Col md={ 6 } sm={ 12 }>
							<strong>Air</strong>
							<StaticField
								controlId="air[0].in"
								name="air[0].in"
								label="Start pressure"
								default={ Unspecified }
								value={ this.renderPressure(air[0].in) }
							/>
							<StaticField
								controlId="air[0].out"
								name="air[0].out"
								label="End pressure"
								default={ Unspecified }
								value={ this.renderPressure(air[0].out) }
							/>
							<StaticField
								controlId="air[0].size"
								name="air[0].size"
								label="Tank info"
								default={ Unspecified }
								value={ this.renderTankSize(air[0].size) }
							/>
							<StaticField
								controlId="air[0].workingPressure"
								name="air[0].workingPressure"
								label="Tank info"
								default={ Unspecified }
								value={ this.renderPressure(air[0].workingPressure) }
							/>
							<StaticField
								controlId="air[0].oxygen"
								name="air[0].oxygen"
								label="Oxygen content"
								default={ Unspecified }
								value={ this.renderValueWithUnit(air[0].oxygen, '%') }
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 }>
							<h3><Glyphicon glyph="sunglasses" />&nbsp;Conditions</h3>
						</Col>
						<Col sm={ 12 } md={ 6 }>
							<StaticField
								name="temperature.surface"
								controlId="temperature.surface"
								label="Surface temp"
								default={ Unspecified }
								value={ this.renderTemperature(temperature.surface) }
							/>
							<StaticField
								name="temperature.water"
								controlId="temperature.water"
								label="Water temp"
								default={ Unspecified }
								value={ this.renderTemperature(temperature.water) }
							/>
							<StaticField
								name="temperature.thermoclines[0].temperature"
								controlId="temperature.thermoclines[0].temperature"
								label="Thermocline"
								default={ Unspecified }
								value={ this.renderTemperature(temperature.thermoclines[0].temperature) }
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 }>
							<h3><Glyphicon glyph="pencil" />&nbsp;Notes</h3>
						</Col>
					</Row>
					<Row>
						<Col sm={ 12 } md={ 6 }>
							<StaticField
								controlId="tags"
								name="tags"
								label="Tags"
								default="None"
								value={ currentEntry.tags ? currentEntry.tags.join(', ') : null }
							/>
							<StaticField
								controlId="comments"
								name="comments"
								label="Comments"
								default="None"
								value={ currentEntry.comments }
							/>
						</Col>
					</Row>
				</Formsy>
			</div>
		);
		/* eslint-enable complexity */
	}
}

ViewLogEntry.propTypes = {
	currentEntry: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired
};

export default connectToStores(ViewLogEntry);
