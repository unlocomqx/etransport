<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import XYZ from "ol/source/XYZ";
  import Point from "ol/geom/Point.js";
  import { fromLonLat } from "ol/proj";
  import "ol/ol.css";
  import { getCenterIcon } from "./utils/map";

  export let data: PageData;

  const { latitude, longitude } = data;

  let map: Map | null = null;
  onMount(() => {
    console.log([ latitude, longitude ]);
    const point = new Point(fromLonLat([ longitude, latitude ]));
    map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          })
        }),
        getCenterIcon([ longitude, latitude ])
      ],
      view: new View({
        center: point.getCoordinates(),
        zoom: 12
      })
    });

    console.log(map);
    return () => {
      map?.setTarget(undefined);
      map = null;
    };
  });
</script>

<div id="map"></div>

<style>
  #map {
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
</style>