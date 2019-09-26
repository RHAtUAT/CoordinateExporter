import fs from 'fs';
import path from 'path';
import { FeatureCollection, Feature } from 'geojson';
const Pickr = require('@simonwep/pickr');

export class MapService {

    private static getSaveFile() {
        return path.join(__dirname, '../point-data.json');
    }

    // Read the points from the JSON File
    // TODO: Add error handling for if the user deletes the file
    public static readPoints() {
        try {
            return JSON.parse(fs.readFileSync(this.getSaveFile()).toString())
        }
        catch (err) {
            console.error('Failed to read %s file due to error: %s', this.getSaveFile(), err.message);
            return {};
        }
    }

    // Write the points to the JSON file
    public static writePoints(data: FeatureCollection) {
        fs.writeFileSync(this.getSaveFile(), JSON.stringify(data, null, 4));
    }

    // Inserts html into the 'ul' element to display the point's information
    public static newListElement(id: string ,longitude: number, latitude: number) {
        let lng = longitude.toFixed(4);
        let lat = latitude.toFixed(4);
        // Inserts the HTML code for adding a new list element
        var ul = document.getElementById('point-list');
        var newItems = `<li id=${id}><input class='color-picker'><label class='list-item'>(${lng}, ${lat})</label><br><button class='export'>Export</button><button id='delete-btn' class='delete'>Delete</button></li>`;
        ul.insertAdjacentHTML('beforeend', newItems);

    }

    // Remove the list element. This is called when the point is removed
    public static removeListElement(id : string) {
        var listElement = document.getElementById(id);
        listElement.replaceWith('');
    }

    // Replace the default windows color picker
    public static buildColorPicker( feature: Feature, color: string, featureCollection: FeatureCollection) {
            const pickr = Pickr.create({
                // Color picker options
                el: '.color-picker',
                theme: 'nano', // 'monolith', 'nano', or 'classic'
                lockOpacity: true,
                closeOnScroll: false,
                default: color,
                swatches: [
                    'rgba(244, 67, 54, 1)',
                    'rgba(233, 30, 99, 0.95)',
                    'rgba(156, 39, 176, 0.9)',
                    'rgba(103, 58, 183, 0.85)',
                    'rgba(63, 81, 181, 0.8)',
                    'rgba(33, 150, 243, 0.75)',
                    'rgba(3, 169, 244, 0.7)',
                    'rgba(0, 188, 212, 0.7)',
                    'rgba(0, 150, 136, 0.75)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(139, 195, 74, 0.85)',
                    'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                    'rgba(255, 193, 7, 1)'
                ],

                components: {

                    // Main components
                    preview: true,
                    opacity: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        hex: true,
                        rgba: false,
                        hsla: false,
                        hsva: false,
                        cmyk: false,
                        input: true,
                        clear: false,
                        save: true
                    }
                }
            });
            pickr.on('change', () => {
                // Get the color from the color picker
                let color = '#' + pickr.getColor().toHEXA().join('');
                // Set the circle-color of the layer on the map
                map.setPaintProperty(feature.properties.id, 'circle-color', color);
            });
            pickr.on('save', () => {                
                // Get the color from the color picker
                let color = '#' + pickr.getColor().toHEXA().join('');
                // Save the new color to the JSON file
                feature.properties.color = color;
                MapService.writePoints(featureCollection);
            });
            pickr.on('hide', () => {
                // Set the circle-color of the layer on the map
                map.setPaintProperty(feature.properties.id, 'circle-color', feature.properties.color);
            });
    }
}