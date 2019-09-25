///<reference path="globals.d.ts" />
import { MapService } from './mapservice';
import mapboxgl from 'mapbox-gl';

// Creates the map
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lzdGFqc29kdG5vZmFzZGYiLCJhIjoiY2swZDQzb3gwMDJ2bzNjcXg0Yms3ajkxciJ9.IlQsvqC_5gRUyyjPLjAj0g';
(global as any).map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-111.97588, 33.37751], // starting position
    zoom: 9 // starting zoom
});

/**
 *  Nothing below this does anything right now. It was originally a reference for a similar written with angular,
 *  Just keeping it around because I might organize point.ts in a similar way
 * */ 



export class MapBox {

    /// default settings
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lng = -111.97588;
    lat = 33.37751;
    message = 'Hello World!';
    
    // data
    source: any;
    points: any;
    
    constructor(private mapService: MapService) {
    }
    
    OnInit() {
        //this.points = this.mapService.getPoints()
        this.initializeMap()
    }
    
    private initializeMap() {
        /// locate the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.map.flyTo({
                    center: [this.lng, this.lat]
                })
            });
        }
        
        this.buildMap()
        
    }
    
    buildMap() {
        this.map = map;
        
        
        /// Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
        
        
        //// Add Point on Click
        this.map.on('click', (event) => {
            const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat]
            //const newPoint = new GeoJson(coordinates, { message: this.message })
            //this.mapService.createPoint(newPoint)
        })
        
        
        /// Add realtime firebase data on map load
        this.map.on('load', (event) => {
            
            /// subscribe to realtime database and set data source
            //var subscribe = new Promise(function(resolve, reject){
                //let data = new FeatureCollection(points)
                //  resolve(data)
                //})
            //this.points.subscribe(points => {
                //let data = new FeatureCollection(this.points)
                //this.source.setData(data);
                //})
                
                /// create map layers with realtime data
                this.map.addLayer({
                    id: 'point',
                    source: 'point',
                    type: 'symbol',
                    layout: {
                        'text-field': '{message}',
                        'text-size': 24,
                    'text-transform': 'uppercase',
                    'icon-image': 'rocket-15',
                    'text-offset': [0, 1.5]
                },
                paint: {
                    'text-color': '#f16624',
                    'text-halo-color': '#fff',
                    'text-halo-width': 2
                }
            })
            
        })
        
    }
    
    
    removeMarker(point: string) {
        // this.mapService.removePoint(point.$key)
    }
    
    // flyTo(data: GeoJSON) {
    //     this.map.flyTo({
    //         center: data.geometry.coordinates
    //     })
    // }
}
var mapbox = new MapBox(new MapService());
//mapbox.OnInit();
//mapbox.