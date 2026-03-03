import "leaflet";

declare module "leaflet" {
  function markerClusterGroup(options?: Record<string, unknown>): MarkerClusterGroup;

  interface MarkerClusterGroup extends FeatureGroup {
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    clearLayers(): this;
    getAllChildMarkers(): Marker[];
  }
}
