import { App } from './';
import { Point } from './points';

import https from 'https';

export class Temperature {

	/**
	 * Fetches the temperature for the given point in the background, and updates it silently.
	 */
	public static fetch(point: Point) {
		this._getTemperature(point).then(temperature => {
			point.properties.temp = temperature;
			App.map.pointManager.savePoints();
			console.log('Updated temperature to %s for (%s, %s).', temperature, point.geometry.coordinates[1], point.geometry.coordinates[0]);
		}, function(error: Error) {
			console.error('Failed to fetch temperature data:', error);
		});
	}

	private static _getTemperature(point: Point) : Promise<string> {
		return new Promise(async (resolve, reject) => {
            // Grabs the lat and long of point clicked
            let lat = point.geometry.coordinates[1];
            let lon = point.geometry.coordinates[0];
            let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=6a267a38043e6b6bcd7d776c5733c62d';

            // Sends get request to url & waits for return
            https.get(url, (res) => {
                let data = '';

                res.on('data', (d) => {
                    data += d;
                });

                res.on('end', () => {
                    // Converts temp in K to F
                    const temp = Math.floor((1.8 * (JSON.parse(data).main.temp - 273) + 32)).toString();
                    return resolve(temp);
                });
            }).on('error', e => {
                return reject(e);
            });
        })
	}

}
