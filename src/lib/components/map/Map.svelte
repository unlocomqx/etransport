<script lang="ts">
  import Map from "ol/Map";
  import Point from "ol/geom/Point";
  import { fromLonLat } from "ol/proj";
  import TileLayer from "ol/layer/Tile";
  import XYZ from "ol/source/XYZ";
  import View from "ol/View";
  import { setContext } from "svelte";

  export let center = [ 0, 0 ];

  const [ latitude, longitude ] = center;

  let map: Map | null = null;

  setContext("map", {
    get instance() {
      return map;
    }
  });

  function initMap(div: HTMLDivElement) {
    const point = new Point(fromLonLat([ longitude, latitude ]));
    map = new Map({
      target: div,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          })
        })
      ],
      view: new View({
        center: point.getCoordinates(),
        zoom: 15
      })
    });

    return {
      destroy() {
        map?.setTarget(undefined);
        map = null;
      }
    };
  }
</script>

<div class="map" use:initMap>
  <slot></slot>
</div>

<style>
  .map {
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
</style>