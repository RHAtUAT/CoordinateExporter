import fs from 'fs';
import path from 'path';
import { FeatureCollection, Feature } from 'geojson';
import { Layer } from 'mapbox-gl';
import { Points } from './geojson';
const Pickr = require('@simonwep/pickr');

export class MapService {
    
    public static layerIds : string[];
    public static updateLayerArrays(){
        
        // Create an array of layer ids
        MapService.layerIds = MapService.getPointLayers().map(element => {
            return element.id;
        });
    }
    
    public static getPointLayers(){
        // Get all the layers and return an array of the ones the user creates  
        let layers : Layer[];
        layers = map.getStyle().layers.filter(function (layers) {
            return layers.id.includes('PointID-');
        });
        return layers;
    }

    public static getPointSources(){
        let sources = map.getStyle().sources;
        console.log("sources: " + sources);
        return sources;
    }

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
        
        let initialText : HTMLElement | null = document.getElementById('initialText');
        if(initialText != null){initialText.replaceWith('');}
        // Inserts the HTML code for adding a new list element
        let ul = document.getElementById('point-list');
        let lng = longitude.toFixed(4);
        let lat = latitude.toFixed(4);
        // The elements for the list thats going to be created
        let colorPicker = `<input class='color-picker'>`;
        let coordinatesLabel = `<label class='list-item'>(${lng}, ${lat})</label>`;
        let exportButton = `<button class='export'>Export</button>`;
        let deleteButton = `<button id=Delete-Button-${id} class='delete'>Delete</button>`;
        let flyToButton = `
        <span class='fly'> 
            <span class='tooltip'>
                    <img id='fly-to-${id}' class='flyImage' src='/images/send.svg'>    
                <span class="tooltiptext">Fly to point</span>
            </span>
        </span>`;
        let newItem = `<li id=${id}>
        ${colorPicker}
        ${coordinatesLabel}
        ${flyToButton}
        <br>
        ${exportButton}
        ${deleteButton}
        </li>`;
        // Inject the newItem code into the ul element
        ul.insertAdjacentHTML('beforeend', newItem);
        MapService.addFlyToListener(id, longitude, latitude);
        // Clicking delete removes the point and listItem 
        document.getElementById(`Delete-Button-${id}`).addEventListener('click', function () {
            MapService.removePoint(id);  
        });
    }

    private static addFlyToListener(id: string, longitude: number, latitude: number){
        // Clicking on the listItem makes the map fly to the point
        document.getElementById(`fly-to-${id}`).addEventListener('click', function() { 
            map.flyTo({center: [ longitude, latitude ]}); 
        });
    }

    // Remove the list element. This is called when the point is removed
    public static removeListElement(id : string) {
        let listElement = document.getElementById(id);
        listElement.replaceWith('');
    }

    public static removePoint(id: string) {

        console.log("RemovePoint");
        // Remove the point from the list in the side bar
        MapService.removeListElement(id);

        //Remove the layer from the map
        map.removeLayer(id);
        map.removeSource(id);

        // Return an array of all points except the one we clicked
        Points.geojson.features = Points.geojson.features.filter(function (element : Feature) {
            return element.properties.id !== id;
        });

        MapService.updateLayerArrays();
        // Save the data
        MapService.writePoints(Points.geojson);
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
