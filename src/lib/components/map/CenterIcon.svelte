<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Icon, Style } from "ol/style";
  import { Feature } from "ol";
  import Point from "ol/geom/Point.js";
  import { fromLonLat } from "ol/proj";
  import { Vector } from "ol/source";
  import { Vector as VectorLayer } from "ol/layer";
  import type { Coordinate } from "ol/coordinate";
  import type Map from "ol/Map";

  export let coords: Coordinate;

  const [ latitude, longitude ] = coords;

  const mapContext = getContext("map") as {
    instance: Map;
  };

  onMount(() => {
    const map = mapContext.instance;

    const iconStyle = new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: "/map/location-indicator-red.svg",
        scale: 4
      })
    });
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([ longitude, latitude ]))
    });
    iconFeature.setStyle(iconStyle);

    const vectorSource = new Vector({
      features: [ iconFeature ]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    map.addLayer(vectorLayer);
  });
</script>